// 会话解析契约 + 运行时 MCP 工具注册表视图（宿主半）。
//
// 1) sessionId 必须「客户端显式值优先」，只有缺失时才退化为最近会话，且退化必须
//    由 sessionSource 如实标出（recent-fallback），绝不静默挂到错误的会话上。
// 2) /connectors/live-tools 必须读 DSH 活注册表（tools 服务每次现算），返回
//    mcp__<serverName>__* 的真实工具名 —— 这是「连接器工具真的进了本进程」的证据。
import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { apply } from './index.js'

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

console.log('session resolution + live MCP tool registry: OK')
