// Client bundle contract: the ModuleLoader shape, the registered slots, and the
// official component structure the browser half ships.
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import vm from 'node:vm'
import React from 'react'

let registration = null
const slots = []
const sandbox = {
  window: { __ModuleLoader__: { load: r => { registration = r } } },
  document: { createElement: () => ({ setAttribute() {}, style: {}, appendChild() {} }), head: { appendChild() {} } },
  console, setTimeout, clearTimeout, fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }),
}
vm.runInNewContext(readFileSync(new URL('./client.js', import.meta.url), 'utf8'), sandbox, { filename: 'client.js' })

assert.equal(registration.id, 'dsh-workbuddy-hub')
const plugin = registration.factory(name => {
  if (name === 'react' || name === 'react/jsx-runtime') return React
  throw new Error(`unexpected browser require: ${name}`)
})
assert.equal(typeof plugin.apply, 'function')
assert.deepEqual([...plugin.inject], ['slots', 'remote', 'remote.agentPresets'])

plugin.apply({
  get: () => undefined,
  slots: {
    inject: (name, fn) => fn(),
    register: (options, component) => { slots.push({ options, component }) },
  },
})
const bySlot = name => slots.find(row => row.options.name === name)
assert.equal(bySlot('main').options.key, 'workbuddy-hub')
assert.equal(bySlot('sidebar.panellist').options.id, 'workbuddy-hub')
assert.equal(bySlot('conversation.input.left').options.id, 'workbuddy-hub-add')
assert.equal(bySlot('conversation.input.overlay'), undefined, 'attached rail must never overlay the input placeholder')
assert.equal(bySlot('settings.plugins.tab').options.id, 'workbuddy-hub')
assert.equal(bySlot('settings.section').options.id, 'workbuddy-hub')

const src = readFileSync(new URL('./client.js', import.meta.url), 'utf8')
// the official stylesheet must be embedded (catalogue geometry comes from it)
for (const cls of ['.ec-expert-card', '.um-tab--active', '.ec-card-summon-btn--top', '.ec-modal-card', '.ec-picker-panel']) {
  assert.ok(src.includes(cls), `official stylesheet embedded: ${cls}`)
}
// the official structure must be used by the components
assert.ok(src.includes('ec-card-avatar-sq'), 'official card avatar class used')
assert.ok(src.includes('ec-modal-quick-prompt-btn'), 'official quick-prompt buttons used')
assert.ok(src.includes('ec-picker-header'), 'official picker header used')
// conversation surfaces present
assert.ok(src.includes('wbh-pop'), 'composer popup present')
assert.ok(src.includes('wbh-rail'), 'composer dock rail present')
assert.ok(src.includes('wb-auth/start'), 'device-login flow wired')
// guard: never register the input overlay
assert.ok(!/name:\s*['"]conversation\.input\.overlay['"]/.test(src), 'must never register the input overlay slot')

// picker 必须用官方几何（官方 picker 三套面板宽度/行高/搜索框/图标盒）
for (const [needle, why] of [
  ['.wbh-flyout.is-expert {', 'official expert panel rule'],
  ['.wbh-flyout.is-skill {', 'official skill panel rule'],
  ['.wbh-flyout.is-connector {', 'official connector panel rule'],
  ['max-height: min(392px, var(--wbh-maxh,392px))', 'official connector panel max-height, capped by the viewport'],
  ['max-height: var(--wbh-maxh,none)', 'viewport height clamp on the panel'],
  ['max-width: var(--wbh-maxw,none)', 'viewport width clamp on the panel'],
  ['flex: 0 0 32px', 'official 32px search row'],
  ['width: 26px', 'official 26px toggle track'],
  ['height: 16px', 'official 16px toggle track height'],
  ['font-size: 12px', 'official 12px skill description'],
  ['line-height: 20px', 'official 20px skill description line'],
  ['animation: wbhAddPopIn .18s ease-out both', 'official 0.18s menu pop-in'],
]) {
  assert.ok(src.includes(needle), `official picker rule present: ${why}`)
}
// 官方 SVG 图标必须原样内联（不是自绘近似图形）
assert.ok(src.includes('M5 3.5 9 7l-4 3.5'), 'official chevron path inlined')
assert.ok(src.includes('fill=\"none\"') || src.includes("fill=\"none\""), 'official svg fill attribute preserved')

// 会话 id：客户端必须把框架注入的 props.sessionId 传给宿主接口
assert.ok(src.includes('data-wbh-session'), 'session id surfaced for verification')
assert.ok(src.includes('useSessions'), 'root-scope session resolution via official standard prop')

// 侧栏入口：官方图标 + 悬停弹出的三项（官方 wb-popover--placement-right 规格）
assert.ok(src.includes('wbh-sideEntry'), 'sidebar entry wrapper present')
assert.ok(src.includes('wbh-sideEntryPop'), 'sidebar hover popover present')
for (const [needle, why] of [
  ['width: 162px', 'official sidebar popover width'],
  ['border: 1px solid #f2f2f2', 'official sidebar popover border'],
  ['padding: 5px 8px', 'official sidebar popover row padding'],
  ['height: 32px', 'official sidebar popover row height'],
]) {
  assert.ok(src.includes(needle), `official sidebar popover rule present: ${why}`)
}
// 侧栏入口用的官方图标（与官方 button[data-track-name="专家中心入口"] 的 path 同源）
assert.ok(src.includes('M7.1035 0C8.6643 0 10.7053 0.0099'), 'official sidebar entry icon inlined')

console.log('client bundle: ModuleLoader shape, slots and official structure: OK')
