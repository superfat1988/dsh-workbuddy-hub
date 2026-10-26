// 桌面端公开目录接入 —— **隔离实例实测**（联网，不进 npm test）。
//
// 隔离原则：
//   · storeRoot / skillsMount 都指向 mkdtemp 临时目录，绝不碰生产 ~/workbuddyskills；
//   · 所有 copilot.tencent.com / codebuddy.cn 的接口**打桩**（不消耗/不轮换生产凭证）；
//   · static.workbuddy.cn 与第三方 MCP 端点走**真网络**（这才是要验的东西）；
//   · 结束时校验生产 registry/auth 文件哈希未变（证明隔离没漏）。
//
//   node scripts/accept-desktop-live.mjs
import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { createHash } from 'node:crypto'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { homedir } from 'node:os'

import { apply } from '../index.js'
import { saveAuth, AUTH_HEALTH_FILE } from '../wb-market.js'

const realFetch = globalThis.fetch
const PROD = join(homedir(), 'workbuddyskills')
const hashOf = p => { try { return createHash('sha256').update(readFileSync(p)).digest('hex') } catch { return '(missing)' } }
const before = {
  registry: hashOf(join(PROD, '.meta', 'registry.json')),
  auth: hashOf(join(PROD, '.meta', 'state', 'workbuddy-auth.json')),
  authMtime: (() => { try { return statSync(join(PROD, '.meta', 'state', 'workbuddy-auth.json')).mtimeMs } catch { return 0 } })(),
}

const root = mkdtempSync(join(tmpdir(), 'wbh-desktop-live-'))
process.on('exit', () => { try { rmSync(root, { recursive: true, force: true }) } catch { /* 忽略 */ } })

let handler = null
const ctx = {
  // 宿主代码两处取服务：`ctx.credentials` 与 `ctx.get('credentials')` —— 桩要都覆盖，
  // 否则会出现「token 写进去了、读的时候却按未配置处理」的假失败（真实宿主两者等价）。
  get: name => (name === 'credentials' ? ctx.credentials : undefined),
  connection: {},
  webServer: { register: spec => { handler = spec.handler; return () => {} } },
  effect: fn => { try { return fn() } catch { return () => {} } },
  on: () => () => {},
  logger: { info() {}, warn() {}, error() {} },
  commands: { register: () => () => {} },
  sessions: { list: () => [] },
  agents: { get: () => null },
  // 凭据库桩：set/resolve 真进 Map（证明 MCP OAuth 的 token 真的落到凭据引用上）
  credentials: {
    _store: new Map(),
    set: async (ref, value) => { ctx.credentials._store.set(String(ref), String(value)); return { ref } },
    resolve: async ref => (ctx.credentials._store.has(String(ref)) ? { value: ctx.credentials._store.get(String(ref)) } : undefined),
  },
  loader: { create: async () => 'row', resolve: () => ({ fiber: { await: async () => {}, dispose() {} } }), remove: () => {}, store: {} },
  subagents: { startContinuable: async () => ({ childId: 'child-1' }) },
  tools: { register: () => () => {} },
}

/** 官方接口打桩：只覆盖 copilot/codebuddy，其余走真网络。 */
const OFFICIAL_ROWS = [
  { name: 'official-demo', data: { display_name: '官方演示连接器', description: '官方注册表里的条目' }, auth_type: 'mcp_oauth', is_connected: false, mcp: { gateway_url: 'https://copilot.tencent.com/console/agent-gateway/official-demo/mcp', transport: 'http', ide_server_name: 'official-demo' } },
]
globalThis.fetch = async (url, init = {}) => {
  const u = String(url)
  if (u.startsWith('https://copilot.tencent.com') || u.startsWith('https://www.codebuddy.cn')) {
    // agent-gateway（第三方 MCP 的网关调用）：按真实语义回 17009「该连接器未授权」，
    // 这样验收不依赖本账号当时的授权状态，也把「未授权」这条路径钉死。
    if (u.includes('/console/agent-gateway/')) {
      const payload = JSON.stringify({ code: 17009, msg: `Connector "${u.split('/console/agent-gateway/')[1]?.split('/')[0]}" is not authorized for the current user or project.` })
      return { ok: false, status: 401, text: async () => payload, json: async () => JSON.parse(payload) }
    }
    if (u.includes('/console/as/connector/registry2c/list')) {
      return { ok: true, status: 200, text: async () => JSON.stringify({ code: 0, data: { list: OFFICIAL_ROWS } }), json: async () => ({ code: 0, data: { list: OFFICIAL_ROWS } }) }
    }
    if (u.includes('/console/as/connector/user/')) {
      return { ok: true, status: 200, text: async () => JSON.stringify({ code: 0, data: { connectors: [] } }), json: async () => ({ code: 0, data: { connectors: [] } }) }
    }
    return { ok: true, status: 200, text: async () => JSON.stringify({ code: 0, data: { list: [], total_count: 0, skills: [], experts: [] } }), json: async () => ({ code: 0, data: {} }) }
  }
  return realFetch(url, init)
}

function makeRes() {
  const res = { statusCode: 200, headers: {}, body: '' }
  res.setHeader = (k, v) => { res.headers[k] = v }
  res.end = chunk => { if (chunk !== undefined) res.body += String(chunk) }
  res.writeHead = code => { res.statusCode = code }
  return res
}
/** 二进制/非 JSON 响应（如 /icon）用这个：返回 { status, contentType, bytes }。 */
const callRaw = async (method, path) => {
  const req = new EventEmitter()
  req.method = method
  req.url = '/workbuddy-hub' + path
  req.headers = { host: '127.0.0.1:3080' }
  req.destroy = () => {}
  setTimeout(() => req.emit('end'), 0)
  const res = makeRes()
  res.headers = {}
  const done = handler(req, res)
  await done
  return { status: res.statusCode, contentType: res.headers['content-type'] || '', bytes: Buffer.byteLength(res.body) }
}

const call = async (method, path, payload) => {
  const req = new EventEmitter()
  req.method = method
  req.url = '/workbuddy-hub' + path
  req.headers = { host: '127.0.0.1:3080' }
  req.destroy = () => {}
  if (payload !== undefined) {
    const body = JSON.stringify(payload)
    setTimeout(() => { req.emit('data', Buffer.from(body)); req.emit('end') }, 0)
  } else {
    setTimeout(() => req.emit('end'), 0)
  }
  const res = makeRes()
  const done = handler(req, res)
  await done
  let json = null
  try { json = JSON.parse(res.body) } catch { /* 非 JSON */ }
  return { status: res.statusCode, json, raw: res.body }
}

let step = 0
const say = msg => console.log(`${++step}. ${msg}`)

try {
  // 隔离实例的假凭证（剩余寿命新鲜 → bearer 不触发 refresh；官方接口已被打桩，
  // 所以这里既不需要、也不会用到生产 token）。
  const stateDir = join(root, '.meta', 'state')
  mkdirSync(stateDir, { recursive: true })
  saveAuth(stateDir, { access_token: 'isolated-token', refresh_token: 'isolated-refresh', expires_in: 6 * 3600, obtainedAt: Date.now(), uid: 'u-isolated', nickname: '隔离验收' })
  writeFileSync(join(stateDir, AUTH_HEALTH_FILE), JSON.stringify({ consecutiveFailures: 0, lastError: '', lastCheckAt: 0, staleAt: null }), { mode: 0o600 })

  apply(ctx, { storeRoot: root, skillsMount: join(root, '.dsh-skills'), keepalive: false, desktopCatalog: true, oauthCallbackPort: 0 })
  assert.equal(typeof handler, 'function', '插件必须注册 webServer 路由')

  say('GET /desktop-catalog（真实抓取公开静态包）')
  const catalog = await call('GET', '/desktop-catalog')
  assert.equal(catalog.status, 200)
  assert.equal(catalog.json.enabled, true)
  assert.ok(catalog.json.entries > 300, `目录条目应 >300，实际 ${catalog.json.entries}`)
  assert.ok(catalog.json.supported > 200, `可挂载条目应 >200，实际 ${catalog.json.supported}`)
  assert.match(catalog.json.source, /^https:\/\/static\.workbuddy\.cn\//)
  assert.match(catalog.json.etag, /^[0-9a-f]{16,}$/)
  assert.ok(existsSync(join(root, '.meta', 'desktop', 'connectors-config.zip')), '目录包应落到隔离 storeRoot')
  console.log(`   条目 ${catalog.json.entries}｜可挂载 ${catalog.json.supported}（网关 ${catalog.json.gateway} / 直连 ${catalog.json.direct}）｜不可自动接入 ${catalog.json.unsupported}`)
  console.log(`   etag ${catalog.json.etag.slice(0, 16)}…｜抓取 ${catalog.json.fetchedAt}`)

  say('GET /market-list?kind=connector（官方打桩 + 桌面全量合并）')
  const list = await call('GET', '/market-list?kind=connector&pageSize=500')
  assert.equal(list.status, 200)
  assert.equal(list.json.rows.length, list.json.officialTotal + list.json.desktopTotal, '官方+桌面应无重复地合并')
  assert.equal(list.json.rows[0].name, 'official-demo', '官方条目排在最前')
  assert.equal(list.json.rows[0].source, 'official')
  const deskRow = list.json.rows.find(r => r.source === 'desktop')
  assert.ok(deskRow, '应包含桌面目录行')
  assert.equal(deskRow.official, false)
  assert.match(deskRow.icon, /\/workbuddy-hub\/icon\?kind=connector&source=desktop&name=/, '桌面行图标应指向插件自己的 /icon 路由（第三方 CDN 那条实测 404）')
  console.log(`   合计 ${list.json.rows.length} 条（官方 ${list.json.officialTotal} + 桌面 ${list.json.desktopTotal}）`)

  say('桌面连接器的图标：由插件自己的 /icon 路由供图（第三方 CDN 那条路径实测 404）')
  const iconRows = list.json.rows.filter(r => r.source === 'desktop' && r.icon)
  assert.ok(iconRows.length > 0, '桌面行必须带图标')
  assert.match(iconRows[0].icon, /^http:\/\/127\.0\.0\.1:\d+\/workbuddy-hub\/icon\?kind=connector&source=desktop&name=/, '图标应指向插件自己的 /icon（同源绝对 URL）')
  const iconRes = await callRaw('GET', `/icon?kind=connector&source=desktop&name=${encodeURIComponent(iconRows[0].name)}`)
  assert.equal(iconRes.status, 200, '插件图标路由应能供图')
  assert.match(iconRes.contentType, /^image\//, `应返回图片类型：${iconRes.contentType}`)
  assert.ok(iconRes.bytes > 100, `图标应有实际字节：${iconRes.bytes}`)
  console.log(`   ${iconRows[0].name} → ${iconRows[0].icon.slice(0, 72)}…（HTTP ${iconRes.status}）`)

  say('搜索过滤：中文关键词命中桌面目录条目')
  const search = await call('GET', '/market-list?kind=connector&q=通达信')
  assert.ok(search.json.rows.some(r => r.name === 'tdx-connector'), '应能搜到「通达信」')

  say('POST /connectors/install 装桌面连接器（qq-mail）：安装落盘 + 端点实测如实')
  const install = await call('POST', '/connectors/install', { name: 'qq-mail', source: 'desktop' })
  assert.equal(install.status, 200, `安装应成功：${install.raw.slice(0, 200)}`)
  assert.equal(install.json.source, 'desktop')
  const mcpPath = join(root, 'connectors', 'qq-mail', 'mcp.json')
  assert.ok(existsSync(mcpPath), 'mcp.json 应落盘')
  const mcp = JSON.parse(readFileSync(mcpPath, 'utf8'))
  const server = Object.values(mcp.mcpServers)[0]
  assert.equal(server.transport, 'streamable-http')
  assert.ok(!JSON.stringify(mcp).includes('eyJ'), 'mcp.json 不得含明文令牌（凭据只以 ${VAR} 引用）')
  // 关键：真实握手探测必须判它「不可用」——只发 tools/list 会被宽松端点骗成 200+12 个工具
  const probe = install.json.endpoint && install.json.probe ? install.json.probe : null
  const reg0 = JSON.parse(readFileSync(join(root, '.meta', 'registry.json'), 'utf8'))
  const rec0 = reg0.installed['connector/qq-mail']
  assert.equal(rec0.probe.ok, false, '未通过 initialize 的端点不能被判成可用（假阳性回归）')
  assert.ok(rec0.probe.http === 401 || rec0.probe.code, `探测应记录真实失败原因：${JSON.stringify(rec0.probe)}`)
  console.log(`   端点 ${server.url}｜探测 ok=${rec0.probe.ok} code=${rec0.probe.code ?? '-'}（${rec0.probe.error || ''}）`)

  say('GET /connectors/tools 也必须做真实握手（不再假报工具数）')
  const tools = await call('GET', '/connectors/tools?name=qq-mail')
  assert.equal(tools.status, 502, `握手失败应如实 502：${tools.raw.slice(0, 200)}`)
  assert.match(tools.json.error, /握手失败/)
  console.log(`   ${tools.json.error}`)

  say('真实握手成功路径：本地 stub MCP 服务端（initialize → initialized → tools/list）')
  {
    const { createServer } = await import('node:http')
    const stub = createServer((req, res) => {
      let body = ''
      req.on('data', c => { body += c })
      req.on('end', () => {
        const msg = (() => { try { return JSON.parse(body) } catch { return {} } })()
        res.setHeader('content-type', 'application/json')
        if (msg.method === 'initialize') {
          res.setHeader('mcp-session-id', 'stub-session-1')
          res.end(JSON.stringify({ jsonrpc: '2.0', id: msg.id, result: { protocolVersion: '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'stub', version: '1' } } }))
          return
        }
        if (msg.method === 'notifications/initialized') { res.statusCode = 202; res.end(''); return }
        if (msg.method === 'tools/list') {
          res.end(JSON.stringify({ jsonrpc: '2.0', id: msg.id, result: { tools: [{ name: 'stub_echo', description: '回声' }, { name: 'stub_add', description: '求和' }] } }))
          return
        }
        res.statusCode = 400
        res.end(JSON.stringify({ jsonrpc: '2.0', id: msg.id, error: { code: -32601, message: 'method not found' } }))
      })
    })
    await new Promise(resolve => stub.listen(0, '127.0.0.1', resolve))
    const port = stub.address().port
    // 手工登记一个指向 stub 的已安装连接器（只读路径：record + mcp.json）
    const stubName = 'stub-handshake'
    const stubDir = join(root, 'connectors', stubName)
    mkdirSync(stubDir, { recursive: true })
    writeFileSync(join(stubDir, 'mcp.json'), JSON.stringify({ mcpServers: { [stubName]: { transport: 'streamable-http', url: `http://127.0.0.1:${port}/mcp` } } }, null, 2))
    const reg = JSON.parse(readFileSync(join(root, '.meta', 'registry.json'), 'utf8'))
    reg.installed[`connector/${stubName}`] = { kind: 'connector', name: stubName, dest: stubDir, displayName: '握手桩', source: 'desktop', enabled: false, serverName: stubName, files: 1, bytes: 1 }
    writeFileSync(join(root, '.meta', 'registry.json'), JSON.stringify(reg, null, 2))
    const r2 = await call('GET', `/connectors/tools?name=${stubName}`)
    assert.equal(r2.status, 200, `stub 握手应成功：${r2.raw.slice(0, 200)}`)
    assert.equal(r2.json.count, 2)
    assert.deepEqual(r2.json.names, ['stub_echo', 'stub_add'])
    console.log(`   工具 ${r2.json.count} 个｜命名空间 ${r2.json.namespace}｜示例 ${r2.json.names.join(', ')}`)
    await new Promise(resolve => stub.close(resolve))
  }

  say('POST /connectors/install 装 tdx-connector：上游自述 MCP OAuth → 落盘端点应选上游而不是网关')
  const gw = await call('POST', '/connectors/install', { name: 'tdx-connector', source: 'desktop' })
  assert.equal(gw.status, 200, `安装应成功：${gw.raw.slice(0, 200)}`)
  const gwMcp = JSON.parse(readFileSync(join(root, 'connectors', 'tdx-connector', 'mcp.json'), 'utf8'))
  const gwServer = Object.values(gwMcp.mcpServers)[0]
  // 实测：tdx 的网关 401（账号侧）而无 OAuth 自述，上游 txmcp.tdx.com.cn 自述 MCP OAuth
  // → 必须落上游（token 要发给会认它的端点），且授权由 MCP OAuth 流程补，不由安装注入 bearer。
  assert.match(gwServer.url, /^https:\/\/txmcp\.tdx\.com\.cn/, `应落上游端点，实际 ${gwServer.url}`)
  assert.equal(gwServer.headers?.Authorization, undefined, 'MCP OAuth 型安装时不得注入 WorkBuddy bearer')
  console.log(`   落盘端点：${gwServer.url}（探测：${JSON.stringify(gw.json.endpoint)}）`)

  say('未授权的 MCP OAuth 端点：调用时如实报上游失败而不是假装成功')
  const gwTools = await call('GET', '/connectors/tools?name=tdx-connector')
  assert.equal(gwTools.status, 502, `未授权应如实报 502：${gwTools.raw.slice(0, 160)}`)
  assert.match(gwTools.json.error, /HTTP 401/)
  const reg = JSON.parse(readFileSync(join(root, '.meta', 'registry.json'), 'utf8'))
  const tdxRecord = reg.installed['connector/tdx-connector']
  assert.equal(tdxRecord.source, 'desktop', '桌面来源必须记进注册表')
  assert.equal(tdxRecord.official, false, '不得冒充官方条目')
  assert.equal(tdxRecord.officialMeta.source, 'desktop')
  assert.match(tdxRecord.officialMeta.bundle.sha256, /^[0-9a-f]{64}$/, '溯源要记目录包 sha256')
  assert.equal(tdxRecord.probe?.ok, false, '未授权的探测结果要如实记录')
  assert.equal(tdxRecord.probe?.oauthHint?.kind, 'mcp-oauth', '端点自述 OAuth 要记进 probe（界面据此给「去授权」）')
  console.log(`   记录 source=${tdxRecord.source}｜probe=${JSON.stringify(tdxRecord.probe)}｜端点=${tdxRecord.desktopEndpoint?.mode}`)

  say('用户自备凭据型（tushare）：缺凭据如实报 credentialRefs，绝不拿账号 token 冒充')
  const tk = await call('POST', '/connectors/install', { name: 'tushare', source: 'desktop' })
  assert.equal(tk.status, 200, `安装应成功：${tk.raw.slice(0, 160)}`)
  const tkMcp = JSON.parse(readFileSync(join(root, 'connectors', 'tushare', 'mcp.json'), 'utf8'))
  const tkServer = Object.values(tkMcp.mcpServers)[0]
  assert.match(tkServer.url, /\$\{TUSHARE_TOKEN\}/, '直连型必须保留用户凭据占位符')
  assert.equal(tkServer.headers, undefined, '直连型不得注入 WorkBuddy bearer')
  const tkTools = await call('GET', '/connectors/tools?name=tushare')
  assert.equal(tkTools.status, 400)
  assert.deepEqual(tkTools.json.credentialRefs, ['TUSHARE_TOKEN'])
  console.log(`   ${tkTools.json.error}`)

  say('fail-closed：stdio / CLI 连接器拒绝自动接入')
  const stdio = await call('POST', '/connectors/install', { name: 'weisheng-scrm', source: 'desktop' })
  assert.equal(stdio.status, 400, `stdio 应被拒：${stdio.raw.slice(0, 160)}`)
  assert.match(stdio.json.error, /stdio/)
  const cli = await call('POST', '/connectors/install', { name: 'awesun', source: 'desktop' })
  assert.equal(cli.status, 400, `CLI 应被拒：${cli.raw.slice(0, 160)}`)
  assert.match(cli.json.error, /CLI/)
  console.log(`   ${stdio.json.error}`)
  console.log(`   ${cli.json.error}`)

  say('未安装也能看：安装前 /connectors/tools 报「未本地安装」而不是 500')
  const notInstalled = await call('GET', '/connectors/tools?name=kdocs')
  assert.equal(notInstalled.status, 404)

  say('POST /desktop-catalog/refresh（etag 未变 → 不重复下载）')
  const refreshed = await call('POST', '/desktop-catalog/refresh', {})
  assert.equal(refreshed.status, 200)
  assert.equal(refreshed.json.ok, true)
  assert.equal(refreshed.json.entries, catalog.json.entries)

  say('MCP OAuth 端到端：假 MCP(401+resource_metadata) → 假 AS → 授权回调 → token 进凭据库 → mcp.json 写引用')
  {
    const { createServer } = await import('node:http')
    const asPortRef = { port: 0 }
    const mcpUrlRef = { url: '' }
    const tokens = []                       // 记录 AS 发出的 token 请求（校验 PKCE/refresh）
    const issued = { access: 'at-e2e-1', refresh: 'rt-e2e-1' }

    // ── 假 AS ────────────────────────────────────────────────────────────
    const as = createServer((req, res) => {
      const send = (code, obj) => { res.statusCode = code; res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(obj)) }
      const u = new URL(req.url, `http://127.0.0.1:${asPortRef.port}`)
      if (u.pathname === '/.well-known/oauth-authorization-server') {
        return send(200, {
          issuer: `http://127.0.0.1:${asPortRef.port}`,
          authorization_endpoint: `http://127.0.0.1:${asPortRef.port}/oauth/authorize`,
          token_endpoint: `http://127.0.0.1:${asPortRef.port}/oauth/token`,
          registration_endpoint: `http://127.0.0.1:${asPortRef.port}/oauth/register`,
          scopes_supported: ['mail:read', 'mail:send'],
        })
      }
      if (u.pathname === '/oauth/register' && req.method === 'POST') {
        let body = ''
        req.on('data', c => { body += c })
        req.on('end', () => {
          const j = (() => { try { return JSON.parse(body) } catch { return {} } })()
          send(201, { client_id: 'e2e-client', redirect_uris: j.redirect_uris || [], token_endpoint_auth_method: 'none' })
        })
        return
      }
      if (u.pathname === '/oauth/token' && req.method === 'POST') {
        let body = ''
        req.on('data', c => { body += c })
        req.on('end', () => {
          const form = new URLSearchParams(body)
          tokens.push(Object.fromEntries(form.entries()))
          if (form.get('grant_type') === 'refresh_token') {
            issued.access = 'at-e2e-2'
            return send(200, { access_token: issued.access, refresh_token: form.get('refresh_token'), expires_in: 3600, token_type: 'Bearer' })
          }
          send(200, { access_token: issued.access, refresh_token: issued.refresh, expires_in: 3600, token_type: 'Bearer' })
        })
        return
      }
      send(404, { error: 'not_found' })
    })
    await new Promise(r => as.listen(0, '127.0.0.1', r))
    asPortRef.port = as.address().port

    // ── 假 MCP：未授权 401 + resource_metadata；带正确 token 时握手成功 ──
    const mcp = createServer((req, res) => {
      const u = new URL(req.url, `http://127.0.0.1:${mcpUrlRef.port}`)
      const send = (code, obj, headers = {}) => {
        res.statusCode = code
        res.setHeader('content-type', 'application/json')
        for (const [k, v] of Object.entries(headers)) res.setHeader(k, v)
        res.end(JSON.stringify(obj))
      }
      if (u.pathname === '/.well-known/oauth-protected-resource') {
        return send(200, { resource: mcpUrlRef.url, authorization_servers: [`http://127.0.0.1:${asPortRef.port}`] })
      }
      let body = ''
      req.on('data', c => { body += c })
      req.on('end', () => {
        const msg = (() => { try { return JSON.parse(body) } catch { return {} } })()
        const auth = String(req.headers.authorization || '')
        if (auth !== 'Bearer at-e2e-1' && auth !== 'Bearer at-e2e-2') {
          return send(401, { jsonrpc: '2.0', id: msg.id, error: { code: 40101, message: 'Bearer token is missing' } },
            { 'www-authenticate': `Bearer realm="E2E", resource_metadata="${mcpUrlRef.url.replace('/mcp', '')}/.well-known/oauth-protected-resource"` })
        }
        if (msg.method === 'initialize') return send(200, { jsonrpc: '2.0', id: msg.id, result: { protocolVersion: '2025-06-18', capabilities: { tools: {} } } })
        if (msg.method === 'notifications/initialized') { res.statusCode = 202; return res.end('') }
        if (msg.method === 'tools/list') return send(200, { jsonrpc: '2.0', id: msg.id, result: { tools: [{ name: 'e2e_tool', description: '端到端工具' }] } })
        send(400, { jsonrpc: '2.0', id: msg.id, error: { code: -32601, message: 'method not found' } })
      })
    })
    await new Promise(r => mcp.listen(0, '127.0.0.1', r))
    const mcpPort = mcp.address().port
    mcpUrlRef.port = mcpPort
    mcpUrlRef.url = `http://127.0.0.1:${mcpPort}/mcp`

    // ── 把一个「需要 OAuth 的连接器」登记进沙盒 storeRoot ──
    const demoName = 'mcp-oauth-demo'
    const demoDir = join(root, 'connectors', demoName)
    mkdirSync(demoDir, { recursive: true })
    writeFileSync(join(demoDir, 'mcp.json'), JSON.stringify({ mcpServers: { [demoName]: { transport: 'streamable-http', url: mcpUrlRef.url } } }, null, 2))
    const reg = JSON.parse(readFileSync(join(root, '.meta', 'registry.json'), 'utf8'))
    reg.installed[`connector/${demoName}`] = { kind: 'connector', name: demoName, dest: demoDir, displayName: 'MCP OAuth 演示', source: 'desktop', enabled: false, serverName: demoName, files: 1, bytes: 1 }
    writeFileSync(join(root, '.meta', 'registry.json'), JSON.stringify(reg, null, 2))

    // ① 未授权时：握手 401 且带 resource_metadata → /connectors/tools 如实失败
    const before = await call('GET', `/connectors/tools?name=${demoName}`)
    assert.equal(before.status, 502, `未授权时应失败：${before.raw.slice(0, 160)}`)
    assert.match(before.json.error, /握手失败/)

    // ② 发起 MCP OAuth：应返回授权 URL（含 PKCE/state/loopback 回调）
    const start = await call('POST', '/connectors/mcp-oauth/start', { name: demoName })
    assert.equal(start.status, 200, `发起授权应成功：${start.raw.slice(0, 220)}`)
    assert.equal(start.json.ok, true)
    const authUrl = new URL(start.json.url)
    assert.equal(authUrl.origin + authUrl.pathname, `http://127.0.0.1:${asPortRef.port}/oauth/authorize`)
    assert.equal(authUrl.searchParams.get('response_type'), 'code')
    assert.equal(authUrl.searchParams.get('client_id'), 'e2e-client', '应使用动态注册拿到的 client_id')
    assert.equal(authUrl.searchParams.get('code_challenge_method'), 'S256')
    assert.ok(authUrl.searchParams.get('code_challenge'), '授权 URL 必须带 PKCE challenge')
    assert.equal(start.json.redirectUri, `http://127.0.0.1:${new URL(start.json.redirectUri).port}/callback`)
    console.log(`   授权 URL: ${authUrl.origin}${authUrl.pathname}?client_id=${authUrl.searchParams.get('client_id')}&…PKCE…&state=${String(start.json.state).slice(0, 8)}…`)

    // ③ 模拟用户扫码：浏览器被 AS 重定向回 loopback 回调
    const cbRes = await fetch(`${start.json.redirectUri}?code=authcode-e2e&state=${encodeURIComponent(start.json.state)}`)
    assert.equal(cbRes.status, 200)
    assert.match(await cbRes.text(), /授权已完成/)

    // ④ 轮询流程状态直到 done
    let status = null
    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 250))
      const st = await call('GET', `/connectors/mcp-oauth/status?name=${demoName}`)
      status = st.json
      if (status?.status?.state === 'done' || status?.status?.state === 'error') break
    }
    assert.equal(status?.status?.state, 'done', `流程应完成：${JSON.stringify(status?.status)}`)

    // ⑤ token 必须落进凭据库 + mcp.json 只写引用
    const ref = 'WORKBUDDY_OAUTH_MCP_OAUTH_DEMO_TOKEN'
    assert.equal(ctx.credentials._store.get(ref), 'at-e2e-1', 'access token 应写入 DSH 凭据库')
    assert.equal(ctx.credentials._store.get(`${ref}_REFRESH`), 'rt-e2e-1', 'refresh token 也应入凭据库')
    const demoMcp = JSON.parse(readFileSync(join(demoDir, 'mcp.json'), 'utf8'))
    const demoServer = Object.values(demoMcp.mcpServers)[0]
    assert.equal(demoServer.headers.Authorization, `Bearer \${${ref}}`, 'mcp.json 只能写 ${REF} 引用')
    assert.ok(!JSON.stringify(demoMcp).includes('at-e2e-1'), 'mcp.json 不得出现明文 token')
    const regAfter = JSON.parse(readFileSync(join(root, '.meta', 'registry.json'), 'utf8'))
    const rec = regAfter.installed[`connector/${demoName}`]
    assert.equal(rec.mcpOauth.ref, ref)
    assert.ok(rec.mcpOauth.expiresAt > Date.now(), '应记录 token 过期时间')
    assert.equal(rec.mcpOauth.authorizationServer, `http://127.0.0.1:${asPortRef.port}`)

    // ⑥ 授权后：/connectors/tools 真能枚举工具（走凭据引用 → 假 MCP 认这个 token）
    const after = await call('GET', `/connectors/tools?name=${demoName}`)
    assert.equal(after.status, 200, `授权后应能枚举工具：${after.raw.slice(0, 200)}`)
    assert.equal(after.json.count, 1)
    assert.deepEqual(after.json.names, ['e2e_tool'])

    // ⑦ refresh：换出的新 token 也要写回凭据库
    const refreshed = await call('POST', '/connectors/mcp-oauth/refresh', { name: demoName })
    assert.equal(refreshed.status, 200, `刷新应成功：${refreshed.raw.slice(0, 160)}`)
    assert.equal(ctx.credentials._store.get(ref), 'at-e2e-2')
    assert.equal(tokens.filter(t => t.grant_type === 'refresh_token').length, 1)
    assert.equal(tokens[0].code_verifier?.length > 0, true, '换 token 必须带 PKCE code_verifier')
    console.log(`   凭据 ${ref} 已写入 → 授权前 502 / 授权后 ${after.json.count} 个工具 / 刷新后 token 已轮换`)


    // ⑧ 已授权后再点「连接」：握手就通 → 宿主必须如实回 already-usable（不重复发起 OAuth）
    const again = await call('POST', '/connectors/mcp-oauth/start', { name: demoName })
    assert.equal(again.json.ok, false)
    assert.equal(again.json.code, 'already-usable')

    // ⑨ 跨机兜底：清掉凭据（模拟未授权）→ 重新发起 → 不走 loopback 回调，把回调链接粘回来
    ctx.credentials._store.delete(ref)
    ctx.credentials._store.delete(`${ref}_REFRESH`)
    const start2 = await call('POST', '/connectors/mcp-oauth/start', { name: demoName })
    assert.equal(start2.json.ok, true, `未授权时应能发起：${start2.raw.slice(0, 160)}`)
    const pasted = `${start2.json.redirectUri}?code=authcode-manual&state=${encodeURIComponent(start2.json.state)}`
    const manual = await call('POST', '/connectors/mcp-oauth/complete', { name: demoName, url: pasted })
    assert.equal(manual.status, 200, `手动完成应成功：${manual.raw.slice(0, 200)}`)
    assert.equal(manual.json.ok, true)
    assert.equal(ctx.credentials._store.get(ref), issued.access)
    const badState = await call('POST', '/connectors/mcp-oauth/complete', { name: demoName, url: pasted })
    assert.equal(badState.status, 400, '没有进行中的流程时再粘一次应如实拒绝')
    console.log('   跨机兜底：粘贴回调链接 → 授权完成（state 校验 + 无流程时拒绝）')


    // ⑩ 端点选择：网关不认（17008，无 OAuth 自述）但上游自述 MCP OAuth → 必须去上游发现，
    //    并把 mcp.json 的 url 一起改到上游（否则 token 会被发到不认它的网关地址）
    const gwName = 'mcp-oauth-via-upstream'
    const gwDir = join(root, 'connectors', gwName)
    mkdirSync(gwDir, { recursive: true })
    const gateway = createServer((req, res) => {
      res.statusCode = 401
      res.setHeader('content-type', 'application/json')
      res.end(JSON.stringify({ code: 17008, msg: 'Connector is not registered or its gateway configuration is unavailable.' }))
    })
    await new Promise(r => gateway.listen(0, '127.0.0.1', r))
    const gwUrl = `http://127.0.0.1:${gateway.address().port}/console/agent-gateway/${gwName}/mcp`
    writeFileSync(join(gwDir, 'mcp.json'), JSON.stringify({ mcpServers: { [gwName]: { transport: 'streamable-http', url: gwUrl } } }, null, 2))
    const reg2 = JSON.parse(readFileSync(join(root, '.meta', 'registry.json'), 'utf8'))
    reg2.installed[`connector/${gwName}`] = {
      kind: 'connector', name: gwName, dest: gwDir, displayName: '上游 OAuth 演示', source: 'desktop',
      enabled: false, serverName: gwName, files: 1, bytes: 1,
      officialMeta: { source: 'desktop', upstreamUrl: mcpUrlRef.url },
    }
    writeFileSync(join(root, '.meta', 'registry.json'), JSON.stringify(reg2, null, 2))
    const upStart = await call('POST', '/connectors/mcp-oauth/start', { name: gwName })
    assert.equal(upStart.json.ok, true, `应能去上游发现 OAuth：${upStart.raw.slice(0, 200)}`)
    const upCb = await fetch(`${upStart.json.redirectUri}?code=authcode-upstream&state=${encodeURIComponent(upStart.json.state)}`)
    assert.equal(upCb.status, 200)
    let upStatus = null
    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 250))
      const st = await call('GET', `/connectors/mcp-oauth/status?name=${gwName}`)
      upStatus = st.json
      if (upStatus?.status?.state === 'done' || upStatus?.status?.state === 'error') break
    }
    assert.equal(upStatus?.status?.state, 'done', `上游授权应完成：${JSON.stringify(upStatus?.status)}`)
    const gwMcp = JSON.parse(readFileSync(join(gwDir, 'mcp.json'), 'utf8'))
    const gwServer = Object.values(gwMcp.mcpServers)[0]
    assert.equal(gwServer.url, mcpUrlRef.url, 'mcp.json 的 url 必须改到会认 token 的上游端点')
    assert.match(gwServer.headers.Authorization, /^Bearer \$\{WORKBUDDY_OAUTH_/, 'Authorization 必须是凭据引用')
    const gwTools = await call('GET', `/connectors/tools?name=${gwName}`)
    assert.equal(gwTools.status, 200, `上游端点应能枚举工具：${gwTools.raw.slice(0, 160)}`)
    console.log(`   端点选择：网关 17008 → 上游发现 OAuth → 落盘 url 改为上游 → 枚举到 ${gwTools.json.count} 个工具`)
    await new Promise(r => gateway.close(r))

    await new Promise(r => as.close(r))
    await new Promise(r => mcp.close(r))
  }

  say('隔离校验：生产 storeRoot 的 registry / auth 未被本次验收改动')
  const after = {
    registry: hashOf(join(PROD, '.meta', 'registry.json')),
    auth: hashOf(join(PROD, '.meta', 'state', 'workbuddy-auth.json')),
    authMtime: (() => { try { return statSync(join(PROD, '.meta', 'state', 'workbuddy-auth.json')).mtimeMs } catch { return 0 } })(),
  }
  assert.equal(after.registry, before.registry, '生产 registry.json 不得被改')
  assert.equal(after.auth, before.auth, '生产 auth 文件不得被改')
  console.log('   生产 registry/auth 哈希一致 ✓')

  console.log('\nACCEPT-DESKTOP-LIVE PASSED')
} catch (error) {
  console.error('\nACCEPT-DESKTOP-LIVE FAILED:', error)
  // 失败即退出：假服务器/监听若留在失败路径上会把进程挂住（验收脚本不能吊死）
  process.exit(1)
}
