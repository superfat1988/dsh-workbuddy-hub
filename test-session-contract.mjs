// 会话解析契约 + 运行时 MCP 工具注册表视图（宿主半）。
//
// 1) sessionId 必须「客户端显式值优先」，只有缺失时才退化为最近会话，且退化必须
//    由 sessionSource 如实标出（recent-fallback），绝不静默挂到错误的会话上。
// 2) /connectors/live-tools 必须读 DSH 活注册表（tools 服务每次现算），返回
//    mcp__<serverName>__* 的真实工具名 —— 这是「连接器工具真的进了本进程」的证据。
import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { apply, replacePersonaPrefix } from './index.js'

const root = '/tmp/wbh-session-contract'
rmSync(root, { recursive: true, force: true })
mkdirSync(join(root, '.meta'), { recursive: true })
mkdirSync(join(root, 'connectors', 'demo'), { recursive: true })
writeFileSync(join(root, 'connectors', 'demo', 'mcp.json'), JSON.stringify({
  mcpServers: { demo: { transport: 'streamable-http', url: 'https://example.invalid/mcp' } },
}))
writeFileSync(join(root, '.meta', 'registry.json'), JSON.stringify({
  version: 1,
  installed: {
    'connector/demo': {
      kind: 'connector', name: 'demo', displayName: 'Demo',
      dest: join(root, 'connectors', 'demo'), serverName: 'demo', enabled: true,
    },
  },
}))

// 活注册表：故意包含别的命名空间，验证只挑 mcp__demo__
const LIVE_TOOLS = [
  { name: 'bash' }, { name: 'read' },
  { name: 'mcp__demo__alpha' }, { name: 'mcp__demo__beta' },
  { name: 'mcp__demo__very_long_tool_name_that_would_be_hashed_0123456789ab' },
  { name: 'mcp__other__gamma' },
]

let handler = null
const ctx = {
  get: (name) => (name === 'tools' ? { schemas: () => LIVE_TOOLS } : undefined),
  sessions: { list: () => [{ header: { id: 'session-old', createdAt: 10 } }, { header: { id: 'session-new', createdAt: 99 } }] },
  agents: { get: () => ({ id: 'agent-1' }) },
  connection: {},
  webServer: { register: spec => { handler = spec.handler; return () => {} } },
  effect: fn => { try { return fn() } catch { return () => {} } },
  on: () => () => {},
  logger: { info() {}, warn() {}, error() {} },
  commands: { register: () => () => {} },
  loader: { create: () => ({ dispose() {}, disposeAll() {} }) },
  credentials: { resolve: async () => 'token', set: async () => {} },
  subagents: { startContinuable: async () => ({ childId: 'child-1' }) },
}
apply(ctx, { storeRoot: root, skillPrefix: 'wbh-selftest-' })
assert.equal(typeof handler, 'function', 'the plugin must register a webServer prefix handler')

const makeRes = () => {
  const chunks = []
  return {
    statusCode: 0, headers: {}, writableEnded: false,
    setHeader(k, v) { this.headers[k.toLowerCase()] = v },
    end(chunk) { if (chunk !== undefined) chunks.push(String(chunk)); this.writableEnded = true },
    get body() { return chunks.join('') },
  }
}
const call = async (method, path, body) => {
  const req = new EventEmitter()
  req.method = method
  req.url = '/workbuddy-hub' + path
  req.headers = {}
  req.destroy = () => {}
  const res = makeRes()
  const done = handler(req, res)
  setImmediate(() => {
    if (body !== undefined) req.emit('data', Buffer.from(JSON.stringify(body)))
    req.emit('end')
  })
  await done
  let parsed = null
  try { parsed = JSON.parse(res.body) } catch { parsed = null }
  return { status: res.statusCode, json: parsed }
}

// ---- 1. 会话解析：显式值优先，缺失才退化为最近会话并标注 ----
const explicit = await call('GET', '/active-session?sessionId=session-from-client')
assert.equal(explicit.status, 200)
assert.equal(explicit.json.sessionId, 'session-from-client')
assert.equal(explicit.json.sessionSource, 'client', 'an explicit sessionId must be reported as client-sourced')
assert.equal(explicit.json.hasAgent, true)

const absent = await call('GET', '/active-session')
assert.equal(absent.json.sessionId, 'session-new', 'without a client value the newest session is the documented fallback')
assert.equal(absent.json.sessionSource, 'recent-fallback', 'a guess must be labelled, never silent')

const mountedExplicit = await call('GET', '/mounted?sessionId=session-from-client')
assert.equal(mountedExplicit.json.sessionId, 'session-from-client')
assert.equal(mountedExplicit.json.sessionSource, 'client')
assert.deepEqual(mountedExplicit.json.keys, [])

const mountRes = await call('POST', '/mount', { kind: 'skill', name: 'demo-skill', sessionId: 'session-from-client' })
assert.equal(mountRes.status, 200)
assert.equal(mountRes.json.sessionId, 'session-from-client')
assert.equal(mountRes.json.sessionSource, 'client')
assert.deepEqual(mountRes.json.keys, ['skill/demo-skill'])

const unmountRes = await call('POST', '/unmount', { kind: 'skill', name: 'demo-skill', sessionId: 'session-from-client' })
assert.equal(unmountRes.status, 200)
assert.deepEqual(unmountRes.json.keys, [])

// 挂载必须落到客户端给的那个会话，而不是「最近会话」
const mountsRaw = JSON.parse((await import('node:fs')).readFileSync(join(root, '.meta', 'mounts.json'), 'utf8'))
assert.ok(Object.prototype.hasOwnProperty.call(mountsRaw.sessions, 'session-from-client'), 'mount must be keyed by the client session')
assert.ok(!Object.prototype.hasOwnProperty.call(mountsRaw.sessions, 'session-new'), 'mount must not silently land on the fallback session')

// ---- 1b. 专家人设注入（阶段 1 / 方案 A）----
// 未挂载专家时：只读路由必须返回 injected:false 且不抛错（preStep 的 assemble 没有
// try/catch，所以注入链路任何一环失败都只能是「空串」，绝不能冒泡）。
const noInject = await call('GET', '/expert-injection?sessionId=session-from-client')
assert.equal(noInject.status, 200)
assert.equal(noInject.json.ok, true)
assert.equal(noInject.json.disabled, false)
assert.equal(noInject.json.expert, '')
assert.equal(noInject.json.injected, false)
assert.equal(noInject.json.text, '')
assert.equal(noInject.json.chars, 0)

// 有 systemPrompt 服务时必须注册 section：name 唯一、order 紧邻部署人设之后、
// interpolate:false（人设正文里的 {{ }} 必须保持字面量），text 回调对任何输入都
// 返回字符串且绝不抛错。
let registered = null
const spCtx = {
  ...ctx,
  systemPrompt: {
    getSectionOrder: n => (n === 'DEPLOYMENT_PERSONA_PREFIX' ? 0 : 99),
    section: spec => { registered = spec; return () => {} },
  },
  webServer: { register: () => () => {} },
}
apply(spCtx, { storeRoot: root })
assert.ok(registered, 'a systemPrompt service must get the expert persona section')
assert.equal(registered.name, 'workbuddy-expert-persona')
assert.equal(registered.order, 1, 'the section must sit right after DEPLOYMENT_PERSONA_PREFIX')
assert.equal(registered.interpolate, false, 'expert prose must not be template-interpolated')
assert.equal(registered.text(undefined), '')
assert.equal(registered.text({}), '')
assert.equal(registered.text({ scope: { id: 'session-from-client' } }), '', 'no mounted expert → empty text')
assert.equal(registered.text({ scope: { id: 'no-such-session' } }), '')

// 正例：挂载专家后注入「剥掉 frontmatter + 声明包裹」的正文，卸载后立刻回到空串。
const expertDir = join(root, 'experts', 'demo-expert')
mkdirSync(join(expertDir, '.codebuddy-plugin'), { recursive: true })
mkdirSync(join(expertDir, 'agents'), { recursive: true })
writeFileSync(join(expertDir, '.codebuddy-plugin', 'plugin.json'), JSON.stringify({ agentName: 'demo', displayName: '演示专家' }))
writeFileSync(join(expertDir, 'agents', 'demo.md'), '---\nname: demo\n---\n你是演示专家，请用一句话回答。\n')

const mountExpert = await call('POST', '/mount', { kind: 'expert', name: 'demo-expert', sessionId: 'session-from-client' })
assert.equal(mountExpert.status, 200)

const injected = await call('GET', '/expert-injection?sessionId=session-from-client')
assert.equal(injected.json.expert, 'expert/demo-expert')
assert.equal(injected.json.injected, true)
assert.ok(injected.json.text.includes('你是演示专家'), 'the persona body must be injected')
assert.ok(!injected.json.text.includes('name: demo'), 'the YAML frontmatter must be stripped')
assert.ok(injected.json.text.includes('【已选专家角色】'), 'the injection must carry its scope declaration')
assert.equal(injected.json.chars, injected.json.text.length)

const viaCallback = registered.text({ scope: { id: 'session-from-client' } })
assert.equal(viaCallback, injected.json.text, 'the section callback must agree with the read-only route')

await call('POST', '/unmount', { kind: 'expert', name: 'demo-expert', sessionId: 'session-from-client' })
const afterUnmount = await call('GET', '/expert-injection?sessionId=session-from-client')
assert.equal(afterUnmount.json.injected, false, 'unmounting must drop the persona on the next assembly')
assert.equal(registered.text({ scope: { id: 'session-from-client' } }), '')

// ---- 2. 活工具表：只取 mcp__<serverName>__ 前缀，来自 tools 服务 ----
const live = await call('GET', '/connectors/live-tools?name=demo')
assert.equal(live.status, 200)
assert.equal(live.json.serverName, 'demo')
assert.equal(live.json.live.available, true)
assert.equal(live.json.live.prefix, 'mcp__demo__')
assert.equal(live.json.live.count, 3, 'live registry must expose the three mcp__demo__ tools')
assert.equal(live.json.live.total, LIVE_TOOLS.length)
assert.ok(live.json.live.names.every(name => name.startsWith('mcp__demo__')))
assert.ok(!live.json.live.names.includes('mcp__other__gamma'), 'other namespaces must not leak in')

// 没有 tools 服务时必须优雅降级（available:false），而不是抛错
const bare = { ...ctx, get: () => undefined }
let bareHandler = null
apply({ ...bare, webServer: { register: spec => { bareHandler = spec.handler; return () => {} } } }, { storeRoot: root })
const bareRes = makeRes()
const bareReq = new EventEmitter()
bareReq.method = 'GET'; bareReq.url = '/workbuddy-hub/connectors/live-tools?name=demo'; bareReq.headers = {}
bareReq.destroy = () => {}
const bareDone = bareHandler(bareReq, bareRes)
setImmediate(() => bareReq.emit('end'))
await bareDone
const bareJson = JSON.parse(bareRes.body)
assert.equal(bareJson.status ?? bareRes.statusCode, 200)
assert.equal(bareJson.live.available, false, 'a missing tools service must degrade, not throw')
assert.equal(bareJson.live.count, 0)

// ---- 3. 分类栏与图标来源：契约级断言（防止回退到旧行为）----
const hostSource = readFileSync(new URL('./index.js', import.meta.url), 'utf8')
// 分类栏由客户端按 kind 分派（Catalogue.jsx 的 categoryChips），分类数据源也必须分类型：
// 连接器页此前误用了专家分类，点了也不生效。
const hubSource = readFileSync(new URL('./src/hub.js', import.meta.url), 'utf8')
assert.ok(hubSource.includes('official-expert-categories'), 'expert categories come from the official expert registry')
assert.ok(hubSource.includes('market-categories?kind=${kind}'), 'skill/connector categories are requested per kind')
const catalogueSource = readFileSync(new URL('./src/Catalogue.jsx', import.meta.url), 'utf8')
assert.ok(catalogueSource.includes(": kind === 'expert'"), 'the category strip is dispatched per kind (connector gets none)')
// /local-skills 必须包含 hub 装的软链技能（带官方 icon），不再按 skillPrefix 一律跳过
assert.ok(hostSource.includes('dirent.isSymbolicLink()'), 'local-skills must accept hub symlinks')
assert.ok(hostSource.includes('hub: Boolean(record)'), 'local-skills must mark hub-installed rows')
assert.ok(hostSource.includes('record?.icon && record.icon !== \'letter:auto\''), 'letter:auto is not a usable icon URL')
// /installed 必须回填官方图标（专家按 name/displayName，技能按 officialId）
assert.ok(hostSource.includes('byLabel'), 'expert icon backfill must fall back to displayName')
assert.ok(hostSource.includes('r.officialId && (!r.icon || r.icon === \'letter:auto\')'), 'skill icon backfill keyed by officialId')

// ---- 4. 方案 B：每专家一个 agent preset（真接管）----
// 用假 agentPresets stub 跑通「ensure 幂等 → copy → 写 persona → select」这条链：
// 这是「专家 preset 真的建出来、且人设正文真的写进去了」的证据。
const presetRoot = '/tmp/wbh-preset-contract'
rmSync(presetRoot, { recursive: true, force: true })
mkdirSync(join(presetRoot, '.meta'), { recursive: true })
// 一个仿 standard 的 preset（结构与官方一致：persona 块 + 后续块，prefix 用 >-）
const shippedDir = join(presetRoot, 'shipped-standard')
mkdirSync(shippedDir, { recursive: true })
const SHIPPED_YAML = [
  '- id: persona',
  "  name: '@deepseek-ai/dsh-persona'",
  '  config:',
  '    suffix: Your working directory is {{cwd}}.',
  '    prefix: >-',
  '      You are a coding agent powered by the {{model}} model.',
  '',
  '- id: agent-instructions',
  "  name: '@deepseek-ai/dsh-agent-instructions'",
  '  config:',
  '    maxBytes: 65536',
  '',
].join('\n')
writeFileSync(join(shippedDir, 'agent.cordis.yml'), SHIPPED_YAML)

// 装一个专家：人设正文故意带 frontmatter 和 {{ }}（preset 走严格插值，必须剥掉）
const presetExpertDir = join(presetRoot, 'experts', 'demo-expert')
mkdirSync(join(presetExpertDir, '.codebuddy-plugin'), { recursive: true })
mkdirSync(join(presetExpertDir, 'agents'), { recursive: true })
writeFileSync(join(presetExpertDir, '.codebuddy-plugin', 'plugin.json'),
  JSON.stringify({ agentName: 'demo', displayName: '演示专家' }))
writeFileSync(join(presetExpertDir, 'agents', 'demo.md'),
  '---\nname: demo\n---\n你是演示专家。\n模板残留：{{model}} 与 {{cwd}} 必须被剥掉。\n')

const presetCalls = { copied: [], selected: [], removed: [] }
const presetDirs = new Map([['standard', shippedDir]])
const agentPresetsStub = {
  async resolve(id) {
    const dir = presetDirs.get(id)
    if (!dir) {
      const error = new Error(`preset "${id}" not found`)
      error.code = 'agent-preset/not-found'
      throw error
    }
    return { id, name: id, path: join(dir, 'agent.cordis.yml') }
  },
  async copy(from, id, name) {
    presetCalls.copied.push({ from, id, name })
    if (presetDirs.has(id)) throw new Error(`preset "${id}" already exists`)
    const dir = join(presetRoot, 'user-root', id)
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'agent.cordis.yml'), readFileSync(join(presetDirs.get(from), 'agent.cordis.yml')))
    presetDirs.set(id, dir)
  },
  async select(agent, presetId) {
    presetCalls.selected.push({ sessionId: agent.id, presetId })
    if (presetCalls.selected.length > 1) {
      const error = new Error(`session "${agent.id}" has already started; its agent preset is fixed`)
      error.code = 'agent-preset/locked'
      throw error
    }
    return presetId
  },
  async remove(id) {
    presetCalls.removed.push(id)
    const dir = presetDirs.get(id)
    if (dir) { rmSync(dir, { recursive: true, force: true }); presetDirs.delete(id) }
  },
}

writeFileSync(join(presetRoot, '.meta', 'registry.json'), JSON.stringify({
  version: 1,
  installed: {
    'expert/demo-expert': {
      kind: 'expert', name: 'demo-expert', displayName: '演示专家',
      dest: presetExpertDir, files: 2, bytes: 10, flags: [], linked: false,
    },
  },
}))

let presetHandler = null
const presetCtx = {
  ...ctx,
  agentPresets: agentPresetsStub,
  // 只有这一个会话有活跃 agent，用来分别验 select 成功路径与 409 路径
  agents: { get: id => (id === 'session-from-client' ? { id: 'agent-1' } : undefined) },
  webServer: { register: spec => { presetHandler = spec.handler; return () => {} } },
}
apply(presetCtx, { storeRoot: presetRoot, skillPrefix: 'wbh-preset-' })
assert.equal(typeof presetHandler, 'function')

const callOn = async (method, path, body) => {
  const req = new EventEmitter()
  req.method = method
  req.url = '/workbuddy-hub' + path
  req.headers = {}
  req.destroy = () => {}
  const res = makeRes()
  const done = presetHandler(req, res)
  setImmediate(() => {
    if (body !== undefined) req.emit('data', Buffer.from(JSON.stringify(body)))
    req.emit('end')
  })
  await done
  let parsed = null
  try { parsed = JSON.parse(res.body) } catch { parsed = null }
  return { status: res.statusCode, json: parsed }
}

const first = await callOn('POST', '/expert-preset-ensure', { name: 'demo-expert' })
assert.equal(first.status, 200)
assert.equal(first.json.ok, true)
assert.equal(first.json.presetId, 'workbuddy-demo-expert')
assert.equal(presetCalls.copied.length, 1, 'the first ensure must copy exactly once')
assert.equal(presetCalls.copied[0].from, 'standard')
assert.equal(presetCalls.copied[0].id, 'workbuddy-demo-expert')
assert.equal(presetCalls.copied[0].name, '演示专家', 'the preset display name comes from the expert title')

// 幂等：第二次 ensure 必须直接复用，不再 copy
const second = await callOn('POST', '/expert-preset-ensure', { name: 'demo-expert' })
assert.equal(second.json.ok, true)
assert.equal(second.json.presetId, 'workbuddy-demo-expert')
assert.equal(presetCalls.copied.length, 1, 'ensure must be idempotent (no second copy)')

// 写出来的 YAML：persona 正文进 block scalar、剥了 {{ }}、suffix 与其它块原样
const written = readFileSync(join(presetRoot, 'user-root', 'workbuddy-demo-expert', 'agent.cordis.yml'), 'utf8')
assert.ok(written.includes('    prefix: |'), 'the persona prefix must be a literal block scalar')
assert.ok(!written.includes('>-'), 'the folded scalar must be replaced, not kept')
assert.ok(written.includes('      你是演示专家。'), 'the body must be indented 6 spaces')
assert.ok(written.includes('你是演示专家。'), 'the persona body must land in the preset')
assert.ok(!written.includes('{{model}} 与 {{cwd}}'), 'template braces from the expert prose must be stripped')
assert.ok(written.includes('模板残留：model 与 cwd 必须被剥掉。'), 'the prose survives with braces removed')
assert.ok(written.includes('    suffix: Your working directory is {{cwd}}.'), 'the suffix must be untouched')
assert.ok(!written.includes('name: demo\n'), 'the YAML frontmatter must be stripped')
assert.equal((written.match(/^- id:/gm) ?? []).length, 2, 'no other composition row may be added or lost')
assert.ok(written.includes('- id: agent-instructions'), 'later rows must survive')

// 非法专家名：不碰 agentPresets，直接 400
const badName = await callOn('POST', '/expert-preset-ensure', { name: '../etc/passwd' })
assert.equal(badName.status, 400)
assert.equal(badName.json.ok, false)
assert.equal(presetCalls.copied.length, 1)

// select 已改为客户端官方 remote（ctx.remote.agentPresets.select(sessionId, presetId)）：
// 它会自动把 sessionId 解析成 agent、且只对空白会话生效（会话开始后被锁拒绝），
// 不再走宿主路由，所以这里不测宿主 select。

// 卸载专家后 best-effort 删掉它的 preset
const uninstalled = await callOn('POST', '/uninstall', { kind: 'expert', name: 'demo-expert' })
assert.equal(uninstalled.status, 200)
assert.deepEqual(presetCalls.removed, ['workbuddy-demo-expert'], 'uninstall must drop the expert preset')
assert.equal(presetDirs.has('workbuddy-demo-expert'), false)

// 真实 standard preset 的 YAML 也要能被原地改写（260 行、含 !!js 与注释）
const REAL_STANDARD = '/home/kaitzh/deepseek-harness/packages/preset/agent-presets/presets/standard/agent.cordis.yml'
if (existsSync(REAL_STANDARD)) {
  const source = readFileSync(REAL_STANDARD, 'utf8')
  const patched = replacePersonaPrefix(source, '你是演示专家。\n第二行：正文换行必须保留。')
  assert.equal((patched.match(/^- id:/gm) ?? []).length, (source.match(/^- id:/gm) ?? []).length,
    'rewriting the real standard preset must not add or drop a row')
  assert.ok(patched.includes('    prefix: |'))
  assert.ok(patched.includes('    suffix: Your working directory is {{cwd}}.'))
  assert.ok(patched.includes('      你是演示专家。'))
  assert.ok(patched.includes('      第二行：正文换行必须保留。'))
  assert.ok(!patched.includes('>-'), 'the folded prefix scalar must be gone')
  assert.ok(patched.includes('!!js'), 'the rest of the real composition must be untouched')
}

console.log('session resolution + live MCP tool registry: OK')
