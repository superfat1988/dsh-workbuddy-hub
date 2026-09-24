// Host-side summon test: drives the real apply() with faked DSH services and
// asserts the /expert and /connector command contracts end to end.
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
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

// 夹具：**完全临时**的 storeRoot（原来是硬编码的真实 ~/workbuddyskills，测试会读写用户
// 真实 registry：先塞一个合成 connector/rot 再删掉 —— 中途崩了就把用户数据写脏，且换机换用户
// 必挂。现在改成 mkdtemp + 合成注册表/人设文件，测试不再触碰任何真实目录）。
const storeRoot = mkdtempSync(join(tmpdir(), 'wbhub-summon-'))
const paths = {
  experts: join(storeRoot, 'experts'), connectors: join(storeRoot, 'connectors'),
  skills: join(storeRoot, 'skills'), meta: join(storeRoot, '.meta'),
  registry: join(storeRoot, '.meta', 'registry.json'),
}
for (const d of [paths.experts, paths.connectors, paths.skills, paths.meta]) mkdirSync(d, { recursive: true })

const FIXTURE_EXPERT = 'adort-design-expert'
const expertDir = join(paths.experts, FIXTURE_EXPERT)
mkdirSync(join(expertDir, '.codebuddy-plugin'), { recursive: true })
mkdirSync(join(expertDir, 'agents'), { recursive: true })
writeFileSync(join(expertDir, '.codebuddy-plugin', 'plugin.json'), JSON.stringify({
  name: FIXTURE_EXPERT, agentName: FIXTURE_EXPERT, displayName: 'Ardot 设计专家', expertType: 'single',
}))
// 人设正文里故意放一个 {{占位符}}：顺带断言注入前会把它剥掉（原断言 !persona.includes('{{')）
writeFileSync(join(expertDir, 'agents', `${FIXTURE_EXPERT}.md`), [
  '---', `name: ${FIXTURE_EXPERT}`, 'description: 精通 Ardot 设计软件', '---', '',
  `# ${FIXTURE_EXPERT}`, '', '你是 Ardot 设计专家，负责 UI 评审。', '',
  '补充：{{some_placeholder}}', '',
  '# Agent Personality', '', '## Identity', '你是设计与开发之间的桥梁。', '',
].join('\n'))

// CLI 型连接器：目录里**没有** mcp.json（用于断言「没有 mcp.json」这条错误分支）
const cliConnectorDir = join(paths.connectors, '77ircloud')
mkdirSync(cliConnectorDir, { recursive: true })
writeFileSync(join(cliConnectorDir, 'cli.json'), JSON.stringify({ name: '77ircloud', command: '77ircloud' }))

writeFileSync(paths.registry, JSON.stringify({
  version: 1,
  installed: {
    [`expert/${FIXTURE_EXPERT}`]: {
      kind: 'expert', name: FIXTURE_EXPERT, displayName: 'Ardot 设计专家',
      description: '精通 Ardot 设计软件，既能在画布上构建精准 UI，也能将设计稿直接生成前端',
      dest: expertDir, files: 2, bytes: 200, flags: [],
    },
    'connector/77ircloud': {
      kind: 'connector', name: '77ircloud', displayName: '七牛云 CLI',
      dest: cliConnectorDir, files: 1, bytes: 20, flags: [],
    },
  },
}, null, 2))

// keepalive:false：本测试不需要保活定时器（它由 test-keepalive.mjs 用假凭证覆盖）。
apply(ctx, { storeRoot, skillPrefix: 'wbh-summon-', keepalive: false })

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
const ok = await expert.handler(invocation(`${FIXTURE_EXPERT} 帮我评审这个界面`))
assert.equal(ok.kind, 'success', ok.text)
assert.ok(ok.text.includes('session-child-1'))
assert.equal(spawned.length, 1)
const spec = spawned[0]
assert.equal(spec.provider, 'spawn')
assert.equal(spec.request.parent.id, 'agent-1')
// persona uses the catalog's localized label; the raw id appears in the prompt
assert.ok(spec.request.persona.includes('设计专家'), spec.request.persona)
assert.ok(spec.request.prompt[0].text.includes(FIXTURE_EXPERT))
assert.ok(!spec.request.persona.includes('{{'))
assert.deepEqual(spec.request.prompt.map(b => b.type), ['text'])
assert.ok(spec.request.prompt[0].text.includes('帮我评审这个界面'))
assert.ok(spec.request.prompt[0].text.includes('请完整遵循'))

// a spawn failure surfaces as a command error, not a crash
ctx.subagents.startContinuable = async () => { throw new Error('provider offline') }
const failed = await expert.handler(invocation(`${FIXTURE_EXPERT} 任务`))
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
const rotDir = join(storeRoot, 'connectors', 'rot')
mkdirSync(rotDir, { recursive: true })
writeFileSync(`${rotDir}/mcp.json`, JSON.stringify({
  mcpServers: { rot: { transport: 'streamable-http', url: 'https://example.invalid/mcp', headers: { Authorization: 'Bearer \${ROT_KEY}' } } },
}))
const rotRegistry = JSON.parse(readFileSync(paths.registry, 'utf8'))
rotRegistry.installed['connector/rot'] = { kind: 'connector', name: 'rot', dest: rotDir, displayName: '轮换测试', files: 1, bytes: 10, flags: [] }
writeFileSync(paths.registry, JSON.stringify(rotRegistry, null, 2))

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

// cleanup the synthetic registry entry + 临时目录
rotRegistry.installed = Object.fromEntries(Object.entries(rotRegistry.installed).filter(([k]) => k !== 'connector/rot'))
writeFileSync(paths.registry, JSON.stringify(rotRegistry, null, 2))
rmSync(storeRoot, { recursive: true, force: true })
console.log('credential rotation re-mount: OK')
