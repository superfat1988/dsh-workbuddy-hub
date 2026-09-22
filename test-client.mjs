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
assert.deepEqual([...plugin.inject], ['slots'])

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

console.log('client bundle: ModuleLoader shape, slots and official structure: OK')
