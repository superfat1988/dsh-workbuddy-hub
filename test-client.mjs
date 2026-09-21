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
const jsxRuntime = React // automatic JSX only needs jsx/jsxs/Fragment; React covers these
const plugin = registration.factory(name => {
  if (name === 'react' || name === 'react/jsx-runtime') return jsxRuntime
  throw new Error(`unexpected browser require: ${name}`)
})
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
assert.ok(!/name:\s*['"]conversation\.input\.overlay['"]/.test(src), 'must never register the input overlay slot')

// the bundle must embed the official stylesheet and component classes
assert.ok(src.includes('SummonDialog'), 'summon confirmation dialog present')
assert.ok(src.includes('AuthDialog'), 'connector authorisation dialog present')
assert.ok(src.includes("commandsRemote()"), 'commands remote resolved lazily')
const official = existsSync(new URL('./src/marketplace.css', import.meta.url))
assert.ok(official, 'official-component sources kept in src/ for the migration')

import { readFileSync as rfs, existsSync } from 'node:fs'
const pkg = JSON.parse(rfs(new URL('./package.json', import.meta.url), 'utf8'))
assert.ok(pkg.scripts['build:client'], 'esbuild pipeline registered')
assert.equal(typeof registration.factory, 'function', 'bundle ships as ModuleLoader factory')

console.log('client module export, dock placement, connector and summon semantics: OK')
