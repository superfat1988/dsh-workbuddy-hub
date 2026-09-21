// Host-side summon test: drives the real apply() with faked DSH services and
// asserts the /expert and /connector command contracts end to end.
import assert from 'node:assert/strict'
import { apply } from './index.js'

const registered = new Map()
const spawned = []
const routes = []

const ctx = {
  webServer: { register: r => { routes.push(r); return () => {} } },
  connection: { requestRejection: () => undefined },
  loader: { store: {}, create: async () => { throw new Error('unused') }, remove: () => {} },
  get: () => undefined,
  effect: fn => { const d = fn(); return d },
  commands: { register: def => { registered.set(def.name, def); return () => {} } },
  subagents: {
    startContinuable: async spec => {
      spawned.push(spec)
      return { childId: 'session-child-1' }
    },
  },
}

apply(ctx, { storeRoot: '~/workbuddyskills' })

assert.deepEqual([...registered.keys()].sort(), ['connector', 'expert'])
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

console.log('host summon/connector command tests: OK')
