import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'

let registration
const window = {
  __ModuleLoader__: {
    load(value) { registration = value },
  },
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {},
}
const React = {
  createElement: (...args) => ({ type: args[0], props: args[1], children: args.slice(2) }),
  useCallback: fn => fn,
  useEffect() {},
  useRef: value => ({ current: value }),
  useState: initial => [initial, () => {}],
}
const sandbox = {
  window,
  Event: class Event { constructor(type) { this.type = type } },
  fetch: async () => ({ ok: true, json: async () => ({ installed: {} }) }),
  console,
}
vm.runInNewContext(readFileSync(new URL('./client.js', import.meta.url), 'utf8'), sandbox, { filename: 'client.js' })
assert.equal(registration.id, 'dsh-workbuddy-hub')
const plugin = registration.factory(name => {
  if (name === 'react') return React
  throw new Error(`unexpected browser require: ${name}`)
})
assert.deepEqual([...plugin.inject], ['slots', 'remote'])
assert.equal(typeof plugin.apply, 'function')

const registrations = []
const slots = {
  inject(_name, callback) { callback() },
  register(options, component) { registrations.push({ options, component }) },
}
plugin.apply({ slots, get: name => name === 'remote' ? undefined : undefined })
const bySlot = name => registrations.find(row => row.options.name === name)
assert.equal(bySlot('main').options.key, 'workbuddy-hub')
assert.equal(bySlot('sidebar.panellist').options.id, 'workbuddy-hub')
assert.equal(bySlot('conversation.input.left').options.id, 'workbuddy-hub-add')
assert.equal(bySlot('conversation.composer.dock').options.id, 'workbuddy-hub-attached')
assert.equal(bySlot('conversation.input.overlay'), undefined, 'attached rail must never overlay the input placeholder')
assert.equal(bySlot('settings.plugins.tab').options.id, 'workbuddy-hub')
console.log('client module export and correct below-composer dock registration: OK')
