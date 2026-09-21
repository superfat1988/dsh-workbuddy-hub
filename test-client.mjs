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
assert.deepEqual([...plugin.inject], ['slots'])
assert.equal(typeof plugin.apply, 'function')

const registrations = []
const slots = {
  inject(_name, callback) { callback() },
  register(options, component) { registrations.push({ options, component }) },
}
plugin.apply({ slots, get: () => undefined })
const bySlot = name => registrations.find(row => row.options.name === name)
assert.equal(bySlot('main').options.key, 'workbuddy-hub')
assert.equal(bySlot('sidebar.panellist').options.id, 'workbuddy-hub')
assert.equal(bySlot('conversation.input.left').options.id, 'workbuddy-hub-add')
assert.equal(bySlot('conversation.composer.dock').options.id, 'workbuddy-hub-attached')
assert.equal(bySlot('conversation.input.overlay'), undefined, 'attached rail must never overlay the input placeholder')
assert.equal(bySlot('settings.plugins.tab').options.id, 'workbuddy-hub')
// Connector switches must express MCP connection state, and switching off must
// actually tear the transport down rather than only hiding the chip.
const src = readFileSync(new URL('./client.js', import.meta.url), 'utf8')
assert.ok(src.includes("const on = isConnector ? enabled : mounted"), 'connector switch reads enabled state')
assert.ok(src.includes("post('/connectors/enable'"), 'attach must enable the connector')
assert.ok(src.includes("post('/connectors/disable'"), 'detach must disable the connector')
assert.ok(src.includes('credentialRefs'), 'refusals must surface the missing credential refs')
assert.ok(!src.includes("conversation.input.overlay'"), 'must never register the input overlay slot')

// The summon confirm dialog and the commands-remote injection are load-bearing:
// without them a summon silently does nothing.
assert.ok(src.includes('SummonDialog'), 'summon confirmation dialog present')
assert.ok(src.includes("commandsRemote()"), 'commands remote resolved lazily')
assert.ok(src.includes("get?.('remote.commands')"), 'looks up the remote.commands service')
import { readFileSync as rfs } from 'node:fs'
const pkg = JSON.parse(rfs(new URL('./package.json', import.meta.url), 'utf8'))
assert.ok(pkg.dsh.client.inject.includes('@deepseek-ai/dsh-api-remotes'),
  'commands namespace requires the api-remotes client module')

console.log('client module export, dock placement, connector and summon semantics: OK')
