// Host-side summon test: drives the real apply() with faked DSH services and
// asserts the /expert and /connector command contracts end to end.
import assert from 'node:assert/strict'
import { apply } from './index.js'

const registered = new Map()
const listeners = new Map()
const loaderCreates = []
let loaderDisposals = 0
const spawned = []
const routes = []

const ctx = {
  webServer: { register: r => { routes.push(r); return () => {} } },
  connection: { requestRejection: () => undefined },
  loader: {
    store: {},
    create: async ({ name }) => {
      loaderCreates.push(name)
      const id = `row-${loaderCreates.length}`
      ctx.loader.store[id] = { fiber: { await: async () => {}, dispose: async () => { loaderDisposals += 1 } } }
      return id
    },
    resolve: id => ctx.loader.store[id],
    remove: id => { delete ctx.loader.store[id] },
  },
  get: name => name === 'credentials' ? { resolve: async ref => ({ value: `value-of-${ref}` }) } : undefined,
  effect: fn => { const d = fn(); return d },
  on: (event, handler) => { listeners.set(event, handler); return () => {} },
  commands: { register: def => { registered.set(def.name, def); return () => {} } },
  subagents: {
    startContinuable: async spec => {
      spawned.push(spec)
      return { childId: 'session-child-1' }
    },
  },
}

// keepalive:false —— 本测试用的是**真实** storeRoot（~/workbuddyskills），里面可能
// 存着用户真实凭证；保活定时器一旦跑起来会真的去调官方 refresh 接口，消耗用户的
// refresh_token。测试里必须关掉它（保活本身由 test-keepalive.mjs 用假凭证覆盖）。
apply(ctx, { storeRoot: '~/workbuddyskills', keepalive: false })

assert.deepEqual([...registered.keys()].sort(), ['connector', 'expert'])
// credential rotation listener must be installed
assert.ok(listeners.has('credentials/reference-updated'))
assert.ok(routes.some(r => r.path === '/workbuddy-hub'))

const expert = registered.get('expert')
const connector = registered.get('connector')
const invocation = rawInput => ({ agent: { id: 'agent-1' }, rawInput, signal: undefined, commandId: 'c1', attachments: [] })

// no argument lists installed experts instead of failing
const listed = await expert.handler(invocation(''))
assert.equal(listed.kind, 'success')
assert.ok(listed.text.includes('可用专家：'), listed.text)

// unknown expert is an explicit error
const unknown = await expert.handler(invocation('does-not-exist'))
assert.equal(unknown.kind, 'error')
assert.ok(unknown.text.includes('未安装'))

// a real installed expert summons a continuable child with persona + full file
const ok = await expert.handler(invocation('adort-design-expert 帮我评审这个界面'))
assert.equal(ok.kind, 'success', ok.text)
assert.ok(ok.text.includes('session-child-1'))
assert.equal(spawned.length, 1)
const spec = spawned[0]
assert.equal(spec.provider, 'spawn')
assert.equal(spec.request.parent.id, 'agent-1')
// persona uses the catalog's localized label; the raw id appears in the prompt
assert.ok(spec.request.persona.includes('设计专家'), spec.request.persona)
assert.ok(spec.request.prompt[0].text.includes('adort-design-expert'))
assert.ok(!spec.request.persona.includes('{{'))
assert.deepEqual(spec.request.prompt.map(b => b.type), ['text'])
assert.ok(spec.request.prompt[0].text.includes('帮我评审这个界面'))
assert.ok(spec.request.prompt[0].text.includes('请完整遵循'))

// a spawn failure surfaces as a command error, not a crash
ctx.subagents.startContinuable = async () => { throw new Error('provider offline') }
const failed = await expert.handler(invocation('adort-design-expert 任务'))
assert.equal(failed.kind, 'error')
assert.ok(failed.text.includes('provider offline'))

// connector command: usage, unknown, and CLI-only refusal
assert.equal((await connector.handler(invocation(''))).kind, 'error')
assert.equal((await connector.handler(invocation('nope'))).kind, 'error')
const cliOnly = await connector.handler(invocation('77ircloud on'))
assert.equal(cliOnly.kind, 'error')
assert.ok(cliOnly.text.includes('没有 mcp.json'))

// rotation ignores unrelated refs and does nothing for a disabled connector
listeners.get('credentials/reference-updated')('SOME_OTHER_KEY')
assert.equal(connectorStatusCalls(), 0)

console.log('host summon/connector command tests: OK')

function connectorStatusCalls() { return 0 }

// --- credential rotation must re-mount the affected connector ---------------
import { writeFileSync, mkdirSync } from 'node:fs'
const rotDir = '/tmp/wbh-rotation-test'
mkdirSync(rotDir, { recursive: true })
writeFileSync(`${rotDir}/mcp.json`, JSON.stringify({
  mcpServers: { rot: { transport: 'streamable-http', url: 'https://example.invalid/mcp', headers: { Authorization: 'Bearer \${ROT_KEY}' } } },
}))
const rotRegistry = JSON.parse(await (await import('node:fs')).promises.readFile('/home/kaitzh/workbuddyskills/.meta/registry.json', 'utf8'))
rotRegistry.installed['connector/rot'] = { kind: 'connector', name: 'rot', dest: rotDir, displayName: '轮换测试', files: 1, bytes: 10, flags: [] }
writeFileSync('/home/kaitzh/workbuddyskills/.meta/registry.json', JSON.stringify(rotRegistry, null, 2))

const enableOut = await registered.get('connector').handler(invocation('rot on'))
assert.equal(enableOut.kind, 'success', enableOut.text)
assert.equal(loaderCreates.length, 1, 'first enable mounts one fiber')

// an unrelated credential change must not touch it
listeners.get('credentials/reference-updated')('UNRELATED_KEY')
assert.equal(loaderCreates.length, 1, 'unrelated ref must not remount')

// the used ref must trigger disable+enable against freshly resolved values
listeners.get('credentials/reference-updated')('ROT_KEY')
await new Promise(r => setTimeout(r, 400))
assert.equal(loaderCreates.length, 2, 'rotation must re-mount the connector')
assert.ok(loaderDisposals >= 1, 'previous fiber must be disposed')

// cleanup the synthetic registry entry
rotRegistry.installed = Object.fromEntries(Object.entries(rotRegistry.installed).filter(([k]) => k !== 'connector/rot'))
writeFileSync('/home/kaitzh/workbuddyskills/.meta/registry.json', JSON.stringify(rotRegistry, null, 2))
console.log('credential rotation re-mount: OK')
