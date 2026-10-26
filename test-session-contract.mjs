// 会话解析契约 + 运行时 MCP 工具注册表视图（宿主半）。
//
// 1) sessionId 必须「客户端显式值优先」；**只读**路由在缺失时才退化为最近会话，且退化
//    必须由 sessionSource 如实标出（recent-fallback），绝不静默挂到错误的会话上。
//    写路由（POST /mount、/unmount）更进一步：缺失 sessionId 一律 409，不兜底。
// 2) 卸载必须连带摘掉挂载（pruneMounts）：全量清理各会话里的该 key，不动别的 key。
// 3) /connectors/live-tools 必须读 DSH 活注册表（tools 服务每次现算），返回
//    mcp__<serverName>__* 的真实工具名 —— 这是「连接器工具真的进了本进程」的证据。
import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { apply, replacePersonaPrefix, mountEntry, unmountEntry, pruneMounts } from './index.js'
import { connectorDefHash } from './src/updates.js'

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
  get: (name) => {
    if (name === 'tools') return { schemas: () => LIVE_TOOLS }
    // 工作区注册表：用于验证「nearSessionId → sessionIds 成员关系 → workspaceId」解析
    if (name === 'workspaceRegistry') {
      return {
        list: () => [{
          workspaceId: 'ws-browser', title: 'browser-sessions', path: '/tmp/browser-sessions',
          sessionIds: ['session-from-client'],
        }],
        resolveByPath: async () => undefined,
        create: async () => undefined,
      }
    }
    return undefined
  },
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

// ---- 1-写路由. 写路由必须显式传 sessionId（缺失 → 409，绝不兜底最近会话）----
// 只读路由保留 recent-fallback（上面 /active-session 的断言），写路由一律拒绝：
// 兜底取「最近会话」会把条目挂进用户没在看的会话，是静默的错误挂载。
const mountNoSession = await call('POST', '/mount', { kind: 'expert', name: 'demo-expert' })
assert.equal(mountNoSession.status, 409, 'POST /mount without sessionId must be rejected, never fall back to the newest session')
assert.equal(mountNoSession.json.error, 'sessionId is required for mount/unmount')

const unmountNoSession = await call('POST', '/unmount', { kind: 'expert', name: 'demo-expert' })
assert.equal(unmountNoSession.status, 409, 'POST /unmount without sessionId must be rejected too')
assert.equal(unmountNoSession.json.error, 'sessionId is required for mount/unmount')

// 空白串与缺失等价（客户端可能传 '' / '   '）
const mountBlank = await call('POST', '/mount', { kind: 'skill', name: 'demo-skill', sessionId: '   ' })
assert.equal(mountBlank.status, 409, 'a whitespace-only sessionId must count as missing')

// 非法 kind / name 仍是 400（既有行为，这里固化住）
const badKind = await call('POST', '/mount', { kind: 'nope', name: 'demo-skill', sessionId: 'session-from-client' })
assert.equal(badKind.status, 400)
assert.equal(badKind.json.error, 'invalid kind or name')
const badEntryName = await call('POST', '/mount', { kind: 'skill', name: '../etc/passwd', sessionId: 'session-from-client' })
assert.equal(badEntryName.status, 400)
const badUnmountKind = await call('POST', '/unmount', { kind: 'nope', name: 'demo-skill', sessionId: 'session-from-client' })
assert.equal(badUnmountKind.status, 400)

// 被拒的写请求不得写脏数据（尤其不得落到兜底会话上）
const afterRejected = JSON.parse(readFileSync(join(root, '.meta', 'mounts.json'), 'utf8')).sessions
assert.ok(!Object.prototype.hasOwnProperty.call(afterRejected, 'session-new'),
  'a rejected write must never leave a mount on the fallback session')

// 合法 sessionId → 200，且如实标注来源 client
const mountOk = await call('POST', '/mount', { kind: 'expert', name: 'demo-expert', sessionId: 'session-from-client' })
assert.equal(mountOk.status, 200)
assert.equal(mountOk.json.sessionId, 'session-from-client')
assert.equal(mountOk.json.sessionSource, 'client')
assert.deepEqual(mountOk.json.keys, ['expert/demo-expert'])
await call('POST', '/unmount', { kind: 'expert', name: 'demo-expert', sessionId: 'session-from-client' })

// ---- 1a. 召唤用的工作区解析：nearSessionId 的 sessionIds 成员关系优先 ----
const wsHit = await call('GET', '/expert-resolve-workspace?nearSessionId=session-from-client')
assert.equal(wsHit.status, 200)
assert.equal(wsHit.json.ok, true)
assert.equal(wsHit.json.workspaceId, 'ws-browser',
  'the workspace containing that session in sessionIds must win (no cwd needed)')
const wsMiss = await call('GET', '/expert-resolve-workspace?nearSessionId=no-such-session')
assert.equal(wsMiss.json.workspaceId, '', 'an unknown session must resolve to empty, never a guess')
const wsEmpty = await call('GET', '/expert-resolve-workspace')
assert.equal(wsEmpty.json.workspaceId, '')

// ---- 1b. 专家人设注入（方案 C：system-prompt/assemble 接管）----
// 未挂载专家时：只读路由返回 injected:false 且不抛错
const noInject = await call('GET', '/expert-injection?sessionId=session-from-client')
assert.equal(noInject.status, 200)
assert.equal(noInject.json.ok, true)
assert.equal(noInject.json.disabled, false)
assert.equal(noInject.json.expert, '')
assert.equal(noInject.json.injected, false)

// 注册的是 system-prompt/assemble waterfall 监听：把 deployment:persona-prefix 段替换成专家人设
let assembleHandler = null
const spCtx = {
  ...ctx,
  on: (event, handler) => { if (event === 'system-prompt/assemble') assembleHandler = handler; return () => {} },
  webServer: { register: () => () => {} },
}
apply(spCtx, { storeRoot: root })
assert.ok(assembleHandler, 'must register a system-prompt/assemble listener')

// 正例：挂载专家后，handler 把 deployment:persona-prefix 替换成剥了 frontmatter 的正文
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
assert.equal(injected.json.chars, injected.json.text.length)

// 模拟一次 assembly：handler 应把 deployment:persona-prefix 段替换成专家正文
const asm = { sections: [
  { name: 'deployment:persona-prefix', text: 'You are a coding agent.', interpolate: true },
  { name: 'tool:x', text: 'tool guidance' },
] }
const result = await assembleHandler(asm, { scope: { id: 'session-from-client' } }, async () => asm)
assert.equal(result.sections[0].text, injected.json.text, 'the deployment persona must be replaced by the expert persona')
assert.equal(result.sections[0].interpolate, false)
assert.equal(result.sections[1].text, 'tool guidance', 'other sections must be untouched')

// 未挂载专家的会话：不改动部署人设
const baseAsm = { sections: [{ name: 'deployment:persona-prefix', text: 'base persona' }] }
const untouched = await assembleHandler(baseAsm, { scope: { id: 'no-such-session' } }, async () => baseAsm)
assert.equal(untouched.sections[0].text, 'base persona', 'no expert mounted → no takeover')

// 卸载后回空
await call('POST', '/unmount', { kind: 'expert', name: 'demo-expert', sessionId: 'session-from-client' })
assert.equal((await call('GET', '/expert-injection?sessionId=session-from-client')).json.injected, false)

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
// picker 技能栏的真源是 **DSH 技能服务**：只扫 ~/.dsh/skills 会漏掉插件包自带的
// skills/（如 dsh-archify 的 bundledSkillDir）等 provider，系统装新技能也不会出现。
assert.ok(hostSource.includes('collectDshSkills'), 'local-skills 必须先问 DSH 技能服务')
assert.ok(hostSource.includes("source: 'dsh-skills'"), 'local-skills 要标注数据来源')
assert.ok(hostSource.includes("ctx?.get?.('skills', false)"), '通过 ctx.get(\'skills\') 取服务（不写进 inject，保持 0.1.6 可加载）')
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

// 卸载专家：必须连带摘掉所有会话里的挂载（chip 还在 / 人设文件已删 = 静默坏状态）
const presetMounts = join(presetRoot, '.meta', 'mounts.json')
{
  const mpaths = { mounts: presetMounts }
  rmSync(presetMounts, { force: true })
  mountEntry(mpaths, 's-a', 'expert/demo-expert')
  mountEntry(mpaths, 's-b', 'skill/keep-me')
  mountEntry(mpaths, 's-b', 'expert/demo-expert')
  mountEntry(mpaths, 's-c', 'expert/other')
}

const uninstalled = await callOn('POST', '/uninstall', { kind: 'expert', name: 'demo-expert' })
assert.equal(uninstalled.status, 200)
assert.equal(uninstalled.json.removed, 'expert/demo-expert')
assert.equal(uninstalled.json.prunedSessions, 2, 'uninstall must report how many sessions it unmounted')
assert.deepEqual(presetCalls.removed, ['workbuddy-demo-expert'], 'uninstall must drop the expert preset')
assert.equal(presetDirs.has('workbuddy-demo-expert'), false)

{
  const sessions = JSON.parse(readFileSync(presetMounts, 'utf8')).sessions
  assert.deepEqual(sessions['s-a'], [], 'the emptied session keeps an empty list (same shape as unmountEntry)')
  assert.deepEqual(sessions['s-b'], ['skill/keep-me'], 'other keys in the same session must survive')
  assert.deepEqual(sessions['s-c'], ['expert/other'], 'sessions that mounted another key must be untouched')
  assert.ok(!JSON.stringify(sessions).includes('expert/demo-expert'), 'no session may still mount the removed expert')
}

// 读路由也必须立刻反映（修复前这里会返回 chip 还在、注入为空的假挂载）
const mountedAfterUninstall = await callOn('GET', '/mounted?sessionId=s-a')
assert.equal(mountedAfterUninstall.status, 200)
assert.deepEqual(mountedAfterUninstall.json.keys, [], 'the pruned session must read back as empty')

// 未安装的条目：404 + 明确原因（界面「移除」失败时必须显示这个原因）
const missingEntry = await callOn('POST', '/uninstall', { kind: 'expert', name: 'ghost-expert' })
assert.equal(missingEntry.status, 404)
assert.equal(missingEntry.json.error, 'not installed')

// 真实 standard preset 的 YAML 也要能被原地改写（260 行、含 !!js 与注释）
const DSH_CHECKOUT = process.env.DSH_CHECKOUT || '/path/to/deepseek-harness'
const REAL_STANDARD = `${DSH_CHECKOUT}/packages/preset/agent-presets/presets/standard/agent.cordis.yml`
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

// --- 一个会话只挂一位专家（mountEntry 单槽位）--------------------------------
// 为什么必须在写入层兜住：firstMountedExpert 只取挂载列表里的**第一个**专家，
// 若允许挂多个，后挂的那位 chip 就是「假的」——界面显示已选，实际注入的仍是旧专家。
{
  const mpaths = { mounts: join(root, '.meta', 'mounts.json') }
  rmSync(mpaths.mounts, { force: true })
  const read = () => JSON.parse(readFileSync(mpaths.mounts, 'utf8')).sessions

  mountEntry(mpaths, 's1', 'expert/alpha')
  assert.deepEqual(read().s1, ['expert/alpha'])

  mountEntry(mpaths, 's1', 'skill/foo')
  mountEntry(mpaths, 's1', 'connector/bar')
  mountEntry(mpaths, 's1', 'expert/beta')          // 换专家
  let list = read().s1
  assert.deepEqual(list.filter(k => k.startsWith('expert/')), ['expert/beta'], '一个会话只能挂一位专家')
  assert.ok(!list.includes('expert/alpha'), '旧专家必须被摘掉')
  assert.ok(list.includes('skill/foo') && list.includes('connector/bar'), '技能/连接器不受影响')

  mountEntry(mpaths, 's1', 'expert/beta')          // 重复挂同一位：幂等
  assert.deepEqual(read().s1.filter(k => k.startsWith('expert/')), ['expert/beta'])

  mountEntry(mpaths, 's2', 'expert/gamma')         // 会话之间互不影响
  assert.deepEqual(read().s2, ['expert/gamma'])
  assert.deepEqual(read().s1.filter(k => k.startsWith('expert/')), ['expert/beta'])

  unmountEntry(mpaths, 's1', 'expert/beta')
  assert.deepEqual(read().s1.filter(k => k.startsWith('expert/')), [], '卸载后槽位空出')
  mountEntry(mpaths, 's1', 'expert/alpha')
  assert.deepEqual(read().s1.filter(k => k.startsWith('expert/')), ['expert/alpha'], '槽位空出后可以再挂')

  // --- pruneMounts：卸载时全量摘挂载（多会话 / 不动别的 key / 空列表语义）---
  mountEntry(mpaths, 's1', 'skill/keep')
  mountEntry(mpaths, 's2', 'expert/alpha')
  mountEntry(mpaths, 's3', 'expert/beta')
  const s1Others = read().s1.filter(k => k !== 'expert/alpha')   // 目标 key 之外的原样快照
  const s3Before = read().s3
  assert.equal(pruneMounts(mpaths, 'expert/alpha'), 2, 'must clean every session that mounted that key')
  assert.deepEqual(read().s1, s1Others, '同一会话里别的 key 必须原样保留（只摘掉目标 key）')
  assert.deepEqual(read().s2, [], '摘空后保留为空数组（与 unmountEntry 落盘形状一致）')
  assert.deepEqual(read().s3, s3Before, '没挂该 key 的会话一个字都不能动')
  assert.equal(pruneMounts(mpaths, 'expert/alpha'), 0, '对没挂过的 key 是 no-op')
  assert.equal(pruneMounts(mpaths, ''), 0, '空 key 绝不能匹配到所有会话')
  assert.deepEqual(read().s1, s1Others, 'no-op 不得改动任何会话')
  assert.deepEqual(read().s3, s3Before, 'no-op 不得改动任何会话')
}

// ---- 5. GET /updates：只认官方元数据；取不到时一律 unknown，绝不能判 current ----
// 语义纪律：把「查不到」渲染成「已是最新」是静默的错误结论 —— 用户会以为一切正常。
// 判定依据已从「镜像 blob sha 比对」换成**纯官方元数据**：
//   技能 = 官方 version vs 安装时记的 officialMeta.version；
//   专家 = 官方 updatedAt vs officialMeta.updatedAt（老记录退回 installedAt）；
//   连接器 = 官方 mcp 定义的规范化 sha256 vs officialMeta.defHash。
// 这里用打桩 fetch 覆盖三条官方数据路径（专家注册表公开，技能/连接器需要登录），断言：
// 未登录 → 专家照常判定、技能/连接器一律 unknown 且写明「需要登录」；已登录 → 三类各有判定；
// 官方接口失败 → unknown + 原因且绝不判 current；结果 60s 缓存与 ?refresh=1；
// 以及整条链路**一次都不碰 GitHub**（检查更新与镜像彻底解耦）。
{
  const upRoot = '/tmp/wbh-updates-contract'
  rmSync(upRoot, { recursive: true, force: true })
  mkdirSync(join(upRoot, '.meta'), { recursive: true })
  const upSkillDir = join(upRoot, 'skills', 'demo-skill')
  mkdirSync(upSkillDir, { recursive: true })
  const SKILL_CONTENT = '# 演示技能\n'
  writeFileSync(join(upSkillDir, 'SKILL.md'), SKILL_CONTENT)
  const skillBytes = Buffer.byteLength(SKILL_CONTENT)
  const upOldSkillDir = join(upRoot, 'skills', 'demo-skill-old')
  mkdirSync(upOldSkillDir, { recursive: true })
  const upDelistedDir = join(upRoot, 'skills', 'demo-delisted')
  mkdirSync(upDelistedDir, { recursive: true })
  const upMirrorSkillDir = join(upRoot, 'skills', 'demo-mirror-skill')
  mkdirSync(upMirrorSkillDir, { recursive: true })
  const upExpertDir = join(upRoot, 'experts', 'demo-official')
  mkdirSync(join(upExpertDir, 'agents'), { recursive: true })
  writeFileSync(join(upExpertDir, 'agents', 'demo.md'), '---\nname: demo\n---\n你是演示专家。\n')
  const upConnDir = join(upRoot, 'connectors', 'demo-connector')
  mkdirSync(upConnDir, { recursive: true })

  // 官方那一行的 MCP 定义：安装时记的就是它的规范化 sha256
  const OFFICIAL_MCP = {
    gateway_url: 'https://gw.example/mcp',
    transport: 'streamable-http',
    auth_mode: 'oauth',
    ide_server_name: 'demo',
    upstream_url: '',
    sandbox_url: '',
  }
  const OFFICIAL_DEF_HASH = connectorDefHash(OFFICIAL_MCP)

  const REGISTRY = {
    version: 1,
    installed: {
      'expert/demo-official': {
        kind: 'expert', name: 'demo-official', displayName: '官方演示专家',
        dest: upExpertDir, source: 'official', official: true,
        installedAt: '2020-01-01T00:00:00.000Z',
        officialMeta: { updatedAt: '2020-01-01T00:00:00.000Z' },
        files: 1, bytes: 40,
      },
      'skill/demo-skill': {
        kind: 'skill', name: 'demo-skill', displayName: '演示技能',
        dest: upSkillDir, source: 'official', officialId: 'sk-1',
        installedAt: '2020-01-01T00:00:00.000Z',
        officialMeta: { version: '1.0.0', updatedAt: '2020-01-01T00:00:00.000Z' },
        files: 1, bytes: skillBytes,
      },
      // 老记录：有 officialId 但没有安装时的官方版本 → unknown（提示重装一次）
      'skill/demo-skill-old': {
        kind: 'skill', name: 'demo-skill-old', dest: upOldSkillDir,
        source: 'official', officialId: 'sk-2',
        installedAt: '2020-01-01T00:00:00.000Z', files: 1, bytes: 10,
      },
      // 官方已下架：officialId 在官方记录里查不到
      'skill/demo-delisted': {
        kind: 'skill', name: 'demo-delisted', dest: upDelistedDir,
        source: 'official', officialId: 'sk-gone',
        installedAt: '2020-01-01T00:00:00.000Z',
        officialMeta: { version: '0.9.0' }, files: 1, bytes: 10,
      },
      // 镜像来源（无 officialId）→ unknown
      'skill/demo-mirror-skill': {
        kind: 'skill', name: 'demo-mirror-skill', dest: upMirrorSkillDir,
        installedAt: '2020-01-01T00:00:00.000Z', files: 1, bytes: 10,
      },
      'connector/demo-connector': {
        kind: 'connector', name: 'demo-connector', displayName: '演示连接器',
        dest: upConnDir, source: 'official', official: true,
        installedAt: '2020-01-01T00:00:00.000Z',
        officialMeta: { defHash: OFFICIAL_DEF_HASH },
        files: 1, bytes: 10,
      },
    },
  }
  writeFileSync(join(upRoot, '.meta', 'registry.json'), JSON.stringify(REGISTRY, null, 2))
  const registryText = readFileSync(join(upRoot, '.meta', 'registry.json'), 'utf8')

  // 假登录态（**绝不用真实 refresh_token**）：obtainedAt=现在、寿命 1 小时 → bearer() 不触发刷新
  const authPath = join(upRoot, '.meta', 'state', 'workbuddy-auth.json')
  const writeFakeAuth = () => {
    mkdirSync(join(upRoot, '.meta', 'state'), { recursive: true })
    writeFileSync(authPath, JSON.stringify({
      access_token: 'FAKE-TOKEN', refresh_token: 'FAKE-REFRESH',
      expires_in: 3600, obtainedAt: Date.now(), uid: 'fake', nickname: '假账号',
    }))
  }
  const removeAuth = () => rmSync(authPath, { force: true })

  const realFetch = globalThis.fetch
  const seen = { expert: 0, skill: 0, connector: 0, github: 0, other: [] }
  let mode = 'ok'                 // ok | skillDown | connectorDown
  let skillVersion = '1.0.0'
  let connectorMcp = OFFICIAL_MCP
  const stub = (status, payload) => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
    text: async () => JSON.stringify(payload),
  })
  globalThis.fetch = async input => {
    const target = String(input?.url ?? input)
    if (target.includes('github')) { seen.github += 1; throw new Error(`检查更新不得碰 GitHub：${target}`) }
    if (target.includes('expert_center.json')) {
      seen.expert += 1
      return stub(200, {
        experts: [{
          id: 'demo-official', agentName: 'demo-official', plugin: 'demo-plugin',
          updatedAt: '2024-06-01T00:00:00.000Z', createdAt: '2020-01-01T00:00:00.000Z',
        }],
      })
    }
    if (target.includes('/market/skill/get-by-ids')) {
      seen.skill += 1
      if (mode === 'skillDown') return stub(500, { code: 500, msg: 'upstream boom' })
      return stub(200, {
        code: 0,
        data: {
          skills: [
            { skill_id: 'sk-1', version: skillVersion, updated_at: '2026-09-03T08:47:48Z', download_url: 'https://x.invalid/sk1.zip' },
            { skill_id: 'sk-2', version: '2.0.0', updated_at: '2026-09-03T08:47:48Z', download_url: 'https://x.invalid/sk2.zip' },
          ],
        },
      })
    }
    if (target.includes('/connector/registry2c/list')) {
      seen.connector += 1
      if (mode === 'connectorDown') return stub(503, { code: 503, msg: 'registry down' })
      return stub(200, {
        code: 0,
        data: { list: [{ name: 'demo-connector', auth_type: 'oauth', is_connected: true, mcp: connectorMcp }] },
      })
    }
    seen.other.push(target)
    throw new Error(`unexpected fetch: ${target}`)
  }

  try {
    let upHandler = null
    apply({ ...ctx, webServer: { register: spec => { upHandler = spec.handler; return () => {} } } },
      { storeRoot: upRoot, skillPrefix: 'wbh-updates-', keepalive: false })
    assert.equal(typeof upHandler, 'function')
    const callUp = async path => {
      const req = new EventEmitter()
      req.method = 'GET'
      req.url = '/workbuddy-hub' + path
      req.headers = {}
      req.destroy = () => {}
      const res = makeRes()
      const done = upHandler(req, res)
      setImmediate(() => req.emit('end'))
      await done
      let parsed = null
      try { parsed = JSON.parse(res.body) } catch { parsed = null }
      return { status: res.statusCode, json: parsed }
    }
    const byKey = body => new Map(body.entries.map(e => [e.key, e]))

    // 5a. 未登录：专家（公开注册表）照常判定；技能/连接器一律 unknown + 「需要登录」
    removeAuth()
    const noLogin = await callUp('/updates')
    assert.equal(noLogin.status, 200)
    assert.equal(noLogin.json.ok, true)
    assert.equal(noLogin.json.sources.official.ok, false, '未登录时官方源必须如实标不可用')
    assert.ok(noLogin.json.sources.official.reason.includes('需要登录'),
      `原因要说明需要登录：${noLogin.json.sources.official.reason}`)
    assert.equal(noLogin.json.counts.current, 0, '未登录时绝不能出现「已是最新」')
    const noLoginByKey = byKey(noLogin.json)
    assert.equal(noLoginByKey.get('expert/demo-official').status, 'update',
      '专家注册表公开：未登录也能给出判定（官方 2024 > 本地 2020）')
    for (const key of ['skill/demo-skill', 'skill/demo-skill-old', 'skill/demo-delisted', 'skill/demo-mirror-skill']) {
      const row = noLoginByKey.get(key)
      assert.equal(row.status, 'unknown', `${key} 未登录时必须 unknown`)
      assert.ok(row.reason.includes('需要登录'), `${key} 的原因要说明需要登录：${row.reason}`)
    }
    const noLoginConn = noLoginByKey.get('connector/demo-connector')
    assert.equal(noLoginConn.status, 'unknown')
    assert.ok(noLoginConn.reason.includes('需要登录'), `连接器未登录原因：${noLoginConn.reason}`)
    assert.deepEqual(noLogin.json.counts, { update: 1, current: 0, unknown: 5 })
    assert.equal(seen.github, 0, '检查更新一次都不许碰 GitHub')

    // 5b. 已登录：三类各有判定（技能 current / 老记录 unknown / 已下架 unknown / 连接器 current）
    writeFakeAuth()
    const ok = await callUp('/updates?refresh=1')
    assert.equal(ok.json.sources.official.ok, true,
      `已登录且官方可用时 official.ok 必须为 true：${ok.json.sources.official.reason}`)
    assert.equal(ok.json.sources.mirror, undefined, 'sources 里不再有 mirror')
    const okByKey = byKey(ok.json)
    const skillRow = okByKey.get('skill/demo-skill')
    assert.equal(skillRow.status, 'current', '官方 version 与安装时记录的相同 → 已是最新')
    assert.equal(skillRow.remoteVersion, '1.0.0')
    assert.equal(skillRow.localVersion, '1.0.0')
    const oldRow = okByKey.get('skill/demo-skill-old')
    assert.equal(oldRow.status, 'unknown', '老记录缺 officialMeta.version → unknown（不伪造）')
    assert.ok(oldRow.reason.includes('officialMeta.version') && oldRow.reason.includes('重装'),
      `老技能记录的原因：${oldRow.reason}`)
    const delistedRow = okByKey.get('skill/demo-delisted')
    assert.equal(delistedRow.status, 'unknown')
    assert.ok(delistedRow.reason.includes('下架'), `已下架技能的原因：${delistedRow.reason}`)
    const mirrorRow = okByKey.get('skill/demo-mirror-skill')
    assert.equal(mirrorRow.status, 'unknown')
    assert.ok(mirrorRow.reason.includes('officialId'), `缺 officialId 的原因：${mirrorRow.reason}`)
    const connRow = okByKey.get('connector/demo-connector')
    assert.equal(connRow.status, 'current', '官方 MCP 定义哈希与安装时记录的一致 → 已是最新')
    assert.equal(connRow.remoteHash, OFFICIAL_DEF_HASH)
    assert.equal(connRow.localHash, OFFICIAL_DEF_HASH)
    const expertRow = okByKey.get('expert/demo-official')
    assert.equal(expertRow.status, 'update', '官方 updatedAt 比安装时记录的更新 → 有更新')
    assert.equal(expertRow.remoteAt, '2024-06-01T00:00:00.000Z')
    assert.deepEqual(ok.json.counts, { update: 1, current: 2, unknown: 3 })

    // 5c. 60s 结果缓存：第二次不再打官方接口；?refresh=1 强制重算
    const seenAfter = { ...seen }
    const cachedCall = await callUp('/updates')
    assert.equal(cachedCall.json.cached, true, '60s 内的第二次调用必须命中结果缓存')
    assert.equal(seen.expert, seenAfter.expert, '命中缓存不得再打官方注册表')
    assert.equal(seen.skill, seenAfter.skill, '命中缓存不得再打官方技能接口')
    const refreshed = await callUp('/updates?refresh=1')
    assert.equal(refreshed.json.cached, false)
    assert.ok(seen.skill > seenAfter.skill, 'refresh=1 必须真的重新检查，而不是复用缓存结果')

    // 5d. 官方数据变化 → update（技能版本、连接器 MCP 定义）
    skillVersion = '1.0.1'
    connectorMcp = { ...OFFICIAL_MCP, gateway_url: 'https://gw2.example/mcp' }
    const bumped = await callUp('/updates?refresh=1')
    const bumpedByKey = byKey(bumped.json)
    const bumpedSkill = bumpedByKey.get('skill/demo-skill')
    assert.equal(bumpedSkill.status, 'update', '官方版本变了 → 有更新')
    assert.equal(bumpedSkill.remoteVersion, '1.0.1')
    assert.ok(bumpedSkill.reason.includes('1.0.1') && bumpedSkill.reason.includes('1.0.0'),
      `版本变化原因要能读出新旧版本：${bumpedSkill.reason}`)
    const bumpedConn = bumpedByKey.get('connector/demo-connector')
    assert.equal(bumpedConn.status, 'update', '官方 MCP 定义变了 → 有更新')
    assert.notEqual(bumpedConn.remoteHash, bumpedConn.localHash)
    assert.deepEqual(bumped.json.counts, { update: 3, current: 0, unknown: 3 })

    // 5e. 官方接口失败（已登录）→ unknown + 原因，绝不判 current
    mode = 'skillDown'
    skillVersion = '1.0.0'
    connectorMcp = OFFICIAL_MCP
    const down = await callUp('/updates?refresh=1')
    assert.equal(down.json.sources.official.ok, false, '官方接口失败时 official.ok 必须为 false')
    const downSkill = byKey(down.json).get('skill/demo-skill')
    assert.equal(downSkill.status, 'unknown', '官方技能接口失败时必须 unknown')
    assert.ok(downSkill.reason.includes('官方技能接口不可用'), `接口失败原因：${downSkill.reason}`)
    mode = 'connectorDown'
    const connDown = await callUp('/updates?refresh=1')
    const connDownRow = byKey(connDown.json).get('connector/demo-connector')
    assert.equal(connDownRow.status, 'unknown', '官方连接器注册表失败时必须 unknown')
    assert.ok(connDownRow.reason.includes('官方连接器注册表不可用'), `连接器失败原因：${connDownRow.reason}`)
    assert.equal(connDown.json.counts.current, 1, '只有没失败的那条技能仍是 current')
    mode = 'ok'

    assert.deepEqual(seen.other, [], '只读检查路由不得打别的网络地址')
    assert.equal(seen.github, 0, '检查更新与镜像彻底解耦：一次都不打 GitHub')
    // 只读自检：整个检查过程不得改动注册表
    assert.equal(readFileSync(join(upRoot, '.meta', 'registry.json'), 'utf8'), registryText,
      '检查更新不得写注册表')
  } finally {
    globalThis.fetch = realFetch
  }
}

console.log('session resolution + live MCP tool registry: OK')
