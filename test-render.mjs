// Render-level smoke test: every slot component the browser half registers must
// survive a server render, and every hub.js symbol a source file uses must be
// imported by it. These two checks exist because undefined identifiers inside a
// component (setBusy, setNotice, onMarketRequest) shipped three times and each
// time silently broke a surface — the picker disappearing entirely was the last.
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import vm from 'node:vm'
import React from 'react'
import { renderToString } from 'react-dom/server'

let registration = null
const slots = []
const sandbox = {
  window: { __ModuleLoader__: { load: r => { registration = r } } },
  document: { createElement: () => ({ setAttribute() {}, style: {}, appendChild() {} }), head: { appendChild() {} } },
  console, setTimeout, clearTimeout,
  fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve({}), text: () => Promise.resolve('') }),
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
}
vm.runInNewContext(readFileSync(new URL('./client.js', import.meta.url), 'utf8'), sandbox, { filename: 'client.js' })

const plugin = registration.factory(name => {
  if (name === 'react' || name === 'react/jsx-runtime') return React
  throw new Error(`unexpected browser require: ${name}`)
})
plugin.apply({
  get: () => undefined,
  slots: {
    inject: (name, fn) => fn(),
    register: (options, component) => { slots.push({ options, component }) },
  },
})

assert.ok(slots.length >= 5, 'expected the five registered surfaces')
const props = { sessionId: 'session-smoke', onKind() {}, onQuery() {}, onDetail() {}, onAction() {}, installed: {}, mounted: new Set(), busy: '' }
// The plugin is browser-only, so components legitimately use useLayoutEffect;
// React's server renderer warns about that and the warning is not a defect.
const realError = console.error
console.error = (...args) => {
  if (String(args[0]).includes('useLayoutEffect does nothing on the server')) return
  realError(...args)
}
try {
  for (const { options, component } of slots) {
    const label = `${options.name}#${options.id ?? options.key ?? ''}`
    try {
      renderToString(React.createElement(component, props))
    } catch (error) {
      assert.fail(`${label} threw during render: ${String(error?.message || error)}`)
    }
  }
} finally { console.error = realError }

// hub.js import completeness: a symbol used in a file must be imported there.
const hubSource = readFileSync(new URL('./src/hub.js', import.meta.url), 'utf8')
const exports = new Set(
  [...hubSource.matchAll(/export\s+(?:async\s+)?(?:function|const|let)\s+([A-Za-z_$][\w$]*)/g)].map(m => m[1]),
)
assert.ok(exports.size > 0, 'hub.js exports not detected')
for (const file of readdirSync(new URL('./src', import.meta.url)).filter(f => (f.endsWith('.jsx') || f.endsWith('.js')) && f !== 'hub.js')) {
  const text = readFileSync(new URL(`./src/${file}`, import.meta.url), 'utf8')
  // 支持多行 import：取 "from './hub.js'" 之前整段导入子句
  const marker = text.indexOf("from './hub.js'")
  const importLine = marker < 0 ? '' : text.slice(Math.max(0, marker - 600), marker)
  const body = text.split('\n').filter(l => !l.includes("from './hub.js'")).join('\n')
    // Strip comments and string literals so a mention inside a message never
    // counts as identifier usage.
    .replace(/\/\/[^\n]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/'(?:[^'\\]|\\.)*'/g, "''")
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')
    .replace(/`(?:[^`\\]|\\.)*`/g, '``')
  for (const name of exports) {
    const used = new RegExp(`(^|[^\\w$.])${name}\\b`).test(body)
    if (!used) continue
    assert.ok(new RegExp(`[{,\\s]${name}[,}\\s]`).test(importLine), `${file} uses hub.${name} without importing it`)
  }
}

console.log('render smoke + hub import completeness: OK')
