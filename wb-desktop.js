/**
 * dsh-workbuddy-hub — WorkBuddy 桌面端「自带市场」接入层。
 *
 * 桌面客户端（WorkBuddy 5.7.x）的市场不是从账号接口拉的，而是一份**匿名的公开
 * 静态包**；本模块把同一份源接进插件（来源从 app.asar / marketplace-meta 中提取，
 * 与桌面端自记的 sourceKey/etag/sha256 一一对应）：
 *
 *   · 连接器目录 + mcp.json + skills + 图标
 *       https://static.workbuddy.cn/connectors-config-v2/connectors-config.zip
 *   · 连接器插件包（marketplace.json 索引 + 每个连接器的 plugin.json/version）
 *       https://static.workbuddy.cn/connector-agent-plugins/connector-plugins.zip
 *
 * 纪律：
 *   · 两个包都当**不可信数据**：只按固定规则取字段，不执行包内任何脚本；
 *   · etag 未变就不重新下载；下载后记录 sha256，供 /updates 判定「目录是否更新」；
 *   · 不落任何明文凭据：MCP 头里的密钥一律写成 `${VAR}` 引用。
 *
 * 连接模型（与桌面端一致，实测确认）：
 *   · 带 `${VAR}` 头占位符的连接器（auth_mode=token）→ 直连上游 URL，凭据由用户提供；
 *   · 其余（server-side / oauth / oneid-token / 无鉴权）→ 走官方 agent-gateway
 *     `https://copilot.tencent.com/console/agent-gateway/<name><上游 path>`，
 *     请求头带 WorkBuddy 账号 bearer；网关侧凭据由腾讯保存。
 *     未被账号授权时网关回 17009（可发起授权），未注册回 17008（企业/未上线）。
 *   · stdio / cli 一律 fail-closed：前者会在本机执行进程，后者是 `npm i -g` 任意代码。
 */
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync, renameSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { unzip } from './wb-unzip.js'

export const DESKTOP_CATALOG_URL = 'https://static.workbuddy.cn/connectors-config-v2/connectors-config.zip'
export const DESKTOP_PLUGINS_URL = 'https://static.workbuddy.cn/connector-agent-plugins/connector-plugins.zip'
export const DESKTOP_GATEWAY_BASE = 'https://copilot.tencent.com/console/agent-gateway'
/** 插件自己的图标路由（客户端会把根相对路径指向当前站点）。 */
export const ICON_ROUTE = '/workbuddy-hub/icon'
export const WB_TOKEN_REF = 'WORKBUDDY_TOKEN'
/** 目录默认保鲜期：桌面端自己的 autoUpdate 也是按天级节奏。 */
export const DESKTOP_TTL_MS = 6 * 60 * 60 * 1000
/** 握手探测用的 MCP 协议版本（与 DSH mcp-client 同代）。 */
const PROBE_PROTOCOL_VERSION = '2025-06-18'
const MAX_BUNDLE_BYTES = 128 * 1024 * 1024

const sha256 = buf => createHash('sha256').update(buf).digest('hex')

/** 上游 URL → 网关 URL：`<base>/<name>` + 上游 path。实测同规则。 */
export function gatewayUrlFor(name, upstreamUrl) {
  if (!/^[\w.-]+$/.test(String(name || ''))) return ''
  let path = ''
  try {
    const u = new URL(String(upstreamUrl || ''))
    if (u.protocol !== 'https:') return ''
    // 带 `${VAR}` 的 query 不外推（那属于用户凭据，直连模式处理），避免把占位符
    // 写进网关地址后被日志/界面展示。
    path = u.pathname + (u.search && !u.search.includes('${') ? u.search : '')
  } catch { return '' }
  if (!path || path === '/') return ''
  return `${DESKTOP_GATEWAY_BASE}/${name}${path}`
}

/** 上游 URL 的 path+query（用于推导网关地址时的展示/调试）。 */
export function upstreamPathOf(upstreamUrl) {
  try { const u = new URL(String(upstreamUrl || '')); return u.pathname + (u.search || '') } catch { return '' }
}

/**
 * 判断一个 mcpServers 条目能否被本插件挂载。
 * 返回 {transport, supported, reason}；sse 由 mcp-manager.normalizeTransport 归一为
 * streamable-http，因此这里也算可用。
 */
export function classifyServer(server) {
  const raw = String(server?.type ?? server?.transport ?? '').toLowerCase().replace(/[-_\s]/g, '')
  if (server?.command) return { transport: 'stdio', supported: false, reason: 'stdio：会在本机执行进程，本插件不自动挂载' }
  if (raw === 'stdio') return { transport: 'stdio', supported: false, reason: 'stdio：会在本机执行进程，本插件不自动挂载' }
  if (raw === 'sse') return { transport: 'sse', supported: true, reason: '' }
  if (raw === 'streamablehttp' || raw === 'http' || server?.url) return { transport: 'streamable-http', supported: true, reason: '' }
  return { transport: raw || 'unknown', supported: false, reason: `未知传输类型 ${raw || '(空)'}` }
}

/**
 * `${VAR}` 头占位符（凭据引用，永不落明文）。
 * 与 mcp-manager.credentialRefsIn 同口径：url / headers / env 全扫，
 * 因为上游把 token 放在 query（如 `?token=${TUSHARE_TOKEN}`）也很常见。
 */
export function placeholdersIn(server) {
  const refs = new Set()
  const text = JSON.stringify(server ?? {})
  for (const m of text.matchAll(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g)) refs.add(m[1])
  return [...refs]
}

/**
 * 连接端点决策：
 *   · 上游自己声明了 `${VAR}`（url/headers/env 任一）→ 直连上游，凭据由用户提供
 *     （token-schema.json 会给出要填哪些字段）；
 *   · 其余 → 走 agent-gateway + WorkBuddy 账号 bearer（与桌面端的注入行为一致）。
 * 注意：网关「未注册（17008）」的连接器不能靠静态规则判死，安装时会实测探测，
 * 探测结果才是最终落盘的端点（见 probeEndpoint / landDesktopConnector）。
 */
export function endpointFor(record) {
  const upstream = record?.upstreamUrl || ''
  const custom = (record?.placeholders ?? []).filter(r => r !== WB_TOKEN_REF)
  if (custom.length > 0) {
    return { mode: 'direct', url: upstream, credentialRefs: custom, gatewayKnown: Boolean(record?.gatewayUrl) }
  }
  const gateway = record?.gatewayUrl || ''
  return {
    mode: 'gateway',
    url: gateway || upstream,
    credentialRefs: [WB_TOKEN_REF],
    gatewayKnown: Boolean(gateway),
  }
}

/**
 * 实测一个连接器的可用端点：先按静态规则，若网关不可用再试直连上游（匿名）。
 * 只发 tools/list（只读），8s 超时；结果只用于决定落盘 URL，失败不影响安装。
 */
export async function probeEndpoint(record, { token = '', fetchImpl = fetch, timeoutMs = 8000 } = {}) {
  const staticChoice = endpointFor(record)
  const attempts = []
  const authHeader = token ? { authorization: `Bearer ${token}` } : {}
  if (staticChoice.mode === 'gateway') attempts.push({ mode: 'gateway', url: staticChoice.url, headers: authHeader })
  // 上游那条**不带任何凭据**探：MCP OAuth 客户端在授权前就是匿名请求，服务端这才回
  // 401 + `WWW-Authenticate: … resource_metadata`。带一个「存在但无效」的 bearer 反而可能
  // 只回业务错误、丢掉 OAuth 自述（QQ邮箱实测的差别），那样就判不出该走 OAuth。
  if (record?.upstreamUrl) attempts.push({ mode: 'direct', url: record.upstreamUrl, headers: {} })
  if (staticChoice.mode === 'direct') attempts.unshift({ mode: 'direct', url: staticChoice.url, headers: authHeader })
  const tried = []
  let last = null
  for (const attempt of attempts) {
    if (!attempt.url || attempt.url.includes('${')) { tried.push({ mode: attempt.mode, url: attempt.url, skipped: 'url 含未解析占位符' }); continue }
    const result = await handshakeTools(attempt.url, attempt.headers, { fetchImpl, timeoutMs })
    last = result
    tried.push({ mode: attempt.mode, url: attempt.url, http: result.http, tools: result.tools?.length || 0, code: result.code, error: result.error, oauthHint: result.oauthHint || null })
    if (result.ok) {
      return { ok: true, mode: attempt.mode, url: attempt.url, http: 200, tools: result.tools.length, tried, protocolVersion: result.protocolVersion }
    }
  }
  return {
    ok: false, mode: staticChoice.mode, url: staticChoice.url, http: last?.http || 0, tools: 0,
    code: last?.code, error: last?.error || '未取到可用端点', tried,
    // 端点自述是 MCP OAuth 时带出来（客户端据此给「去授权·扫码」而不是直接报错）
    oauthHint: last?.oauthHint || null,
  }
}

/**
 * 一次完整 MCP 握手：initialize → notifications/initialized → tools/list。
 * 与 DSH mcp-client 建连同语义 —— **不能只发 tools/list**：实测
 * `https://api.mail.qq.com/mcp` 对未初始化的 tools/list 回 200 + 12 个工具名，但
 * initialize 回 401（缺少/无效 access token）。宿主 /connectors/tools 与本模块的
 * 端点探测都走这里，避免「界面说有 12 个工具，实际挂不上」的假阳性（2026-10-07 生产实测）。
 *
 * @returns {{ok:boolean, http:number, code?:number, error?:string, tools:string[],
 *            labelled?:Array<{name:string,description:string}>, protocolVersion?:string, sessionId?:string}}
 */
export async function handshakeTools(url, headers = {}, { fetchImpl = fetch, timeoutMs = 12000 } = {}) {
  const base = { 'content-type': 'application/json', accept: 'application/json, text/event-stream', ...headers }
  const call = async (body, extraHeaders = {}) => {
    const res = await fetchImpl(url, {
      method: 'POST', headers: { ...base, ...extraHeaders }, body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    })
    const text = await res.text()
    return { status: res.status, headers: res.headers, payload: parseRpcText(text) }
  }
  const fail = (extra) => ({ ok: false, http: extra.http || 0, code: extra.code, error: extra.error, tools: [], oauthHint: extra.oauthHint || null })
  let init
  try {
    init = await call({
      jsonrpc: '2.0', id: 1, method: 'initialize',
      params: { protocolVersion: PROBE_PROTOCOL_VERSION, capabilities: {}, clientInfo: { name: 'dsh-workbuddy-hub', version: '0.1.0' } },
    })
  } catch (error) {
    return fail({ error: String(error?.message || error).slice(0, 160) })
  }
  if (init.status !== 200) {
    // 401 + `WWW-Authenticate: Bearer resource_metadata="…"` = 这是一个 **MCP OAuth** 端点
    // （QQ邮箱实测如此）。带上它，宿主/界面才能给出「去授权」而不是干巴巴的失败。
    const www = init.headers?.get?.('www-authenticate') || ''
    const meta = /resource_metadata\s*=\s*"([^"]+)"/i.exec(www)?.[1] || ''
    return fail({
      http: init.status, code: init.payload?.error?.code,
      error: init.payload?.error?.message || `initialize HTTP ${init.status}`,
      oauthHint: meta ? { kind: 'mcp-oauth', resourceMetadata: meta, wwwAuthenticate: String(www).slice(0, 200) } : null,
    })
  }
  const sessionId = init.headers?.get?.('mcp-session-id') || ''
  const extra = sessionId ? { 'mcp-session-id': sessionId } : {}
  try { await call({ jsonrpc: '2.0', method: 'notifications/initialized' }, extra) } catch { /* 通知失败不致命 */ }
  let list
  try {
    list = await call({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} }, extra)
  } catch (error) {
    return fail({ error: String(error?.message || error).slice(0, 160) })
  }
  if (list.status !== 200) {
    return fail({ http: list.status, code: list.payload?.error?.code, error: list.payload?.error?.message || `tools/list HTTP ${list.status}` })
  }
  const raw = list.payload?.result?.tools
  if (!Array.isArray(raw)) {
    return fail({ http: list.status, error: list.payload?.error?.message || 'tools/list 未返回工具列表' })
  }
  return {
    ok: true, http: 200, tools: raw.map(t => String(t?.name || '')),
    labelled: raw.map(t => ({ name: String(t?.name || ''), description: String(t?.description || '').slice(0, 120) })),
    protocolVersion: init.payload?.result?.protocolVersion || PROBE_PROTOCOL_VERSION,
    sessionId,
  }
}

/** streamable-http 可能回 SSE（data: 行）也可能回纯 JSON。 */
function parseRpcText(text) {
  try { return JSON.parse(text) } catch { /* 继续试 SSE */ }
  const line = String(text).split('\n').filter(l => l.startsWith('data:')).pop()
  if (line) { try { return JSON.parse(line.slice(5).trim()) } catch { return null } }
  return null
}

/** 连接器 record → 可落盘的 mcp.json（密钥只以 `${VAR}` 引用）。 */
export function buildDesktopMcpJson(record, { serverName, endpoint } = {}) {
  const chosen = endpoint || endpointFor(record)
  const name = serverName || record.serverName || record.name
  const headers = {}
  // 上游自己声明的头照抄（其中 ${VAR} 保持引用形态）
  for (const [key, value] of Object.entries(record.upstreamHeaders ?? {})) headers[key] = String(value)
  if (chosen.mode === 'gateway') headers.Authorization = `Bearer \${${WB_TOKEN_REF}}`
  const server = { transport: record.transport === 'sse' ? 'sse' : 'streamable-http', url: chosen.url }
  if (Object.keys(headers).length > 0) server.headers = headers
  return { mcpServers: { [name]: server } }
}

/** 目录缓存目录：<storeRoot>/.meta/desktop。 */
export function desktopPaths(root) {
  return {
    dir: join(root, '.meta', 'desktop'),
    catalogZip: join(root, '.meta', 'desktop', 'connectors-config.zip'),
    pluginsZip: join(root, '.meta', 'desktop', 'connector-plugins.zip'),
    index: join(root, '.meta', 'desktop', 'index.json'),
  }
}

export function readDesktopIndex(dir) {
  try {
    const raw = readFileSync(join(dir, 'index.json'), 'utf8')
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.connectors)) return null
    return parsed
  } catch { return null }
}

async function fetchBundle(url, { fetchImpl = fetch, force = false, existing = null, log = () => {} } = {}) {
  let etag = ''
  try {
    const head = await fetchImpl(url, { method: 'HEAD' })
    if (head.ok) etag = (head.headers.get('etag') || '').replace(/"/g, '')
  } catch { /* HEAD 失败不致命：下面仍会尝试 GET */ }
  if (!force && existing && etag && existing.etag === etag && existsSync(existing.file)) {
    return { file: existing.file, etag, sha256: existing.sha256, bytes: existing.bytes, downloaded: false }
  }
  const res = await fetchImpl(url, { redirect: 'follow' })
  if (!res.ok) throw new Error(`bundle HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length > MAX_BUNDLE_BYTES) throw new Error(`bundle too large: ${buf.length}`)
  if (!(buf[0] === 0x50 && buf[1] === 0x4b)) throw new Error('bundle is not a zip')
  mkdirSync(dirname(existing.file), { recursive: true })
  const tmp = `${existing.file}.tmp`
  writeFileSync(tmp, buf)
  renameSync(tmp, existing.file)
  log(`desktop bundle ${existing.key || url}: ${buf.length} bytes, etag=${etag || '-'}`)
  return { file: existing.file, etag, sha256: sha256(buf), bytes: buf.length, downloaded: true }
}

/** 解析目录包 → 连接器记录数组（纯函数，便于单测）。 */
export function parseCatalogZip(buf, { pluginsMarketplace = null } = {}) {
  const files = unzip(buf)
  const byName = new Map(files.map(f => [f.name, f]))
  const catalogFile = byName.get('.codebuddy-connector/connectors.json')
  if (!catalogFile) throw new Error('bundle missing .codebuddy-connector/connectors.json')
  const catalog = JSON.parse(catalogFile.data.toString('utf8'))
  const records = Array.isArray(catalog.connectors) ? catalog.connectors : []
  const pluginVersions = new Map()
  for (const p of pluginsMarketplace?.plugins ?? []) {
    if (p?.name) pluginVersions.set(String(p.name), String(p.version || ''))
  }

  const iconIndex = new Map()
  for (const f of files) {
    const m = /^icons\/(.+)\.(png|svg|jpg|jpeg|webp)$/i.exec(f.name)
    if (m && !iconIndex.has(m[1])) iconIndex.set(m[1], m[2])
  }
  const allDirs = new Set()
  for (const f of files) {
    const m = /^connectors\/([^/]+)\//.exec(f.name)
    if (m) allDirs.add(m[1])
  }

  const connectors = []
  for (const record of records) {
    const name = String(record.id || record.source || record.name || '')
    if (!/^[\w.-]+$/.test(name)) continue
    const mcpFile = byName.get(`connectors/${name}/mcp.json`)
    let server = null
    let parseError = ''
    if (mcpFile) {
      try {
        const parsed = JSON.parse(mcpFile.data.toString('utf8'))
        const servers = parsed?.mcpServers && typeof parsed.mcpServers === 'object' ? parsed.mcpServers : {}
        const picked = Object.keys(servers)[0]
        if (picked) server = { serverName: picked, ...servers[picked] }
        else parseError = 'mcp.json 未声明 mcpServers 条目'
      } catch (error) { parseError = `mcp.json 解析失败: ${error.message}` }
    }
    const cls = server ? classifyServer(server) : { transport: '', supported: false, reason: '无 mcp.json' }
    const placeholders = server ? placeholdersIn(server) : []
    const upstreamUrl = server?.url || ''
    const skills = files
      .filter(f => f.name.startsWith(`connectors/${name}/skills/`) && f.name.endsWith('SKILL.md'))
      .map(f => f.name.slice(`connectors/${name}/skills/`.length, -'SKILL.md'.length).replace(/\/$/, ''))
    let tokenFields = []
    const tsFile = byName.get(`connectors/${name}/token-schema.json`)
    if (tsFile) {
      try {
        const ts = JSON.parse(tsFile.data.toString('utf8'))
        tokenFields = (ts.fields ?? []).map(f => ({ key: String(f.key || ''), label: String(f.label || f.key || ''), required: f.required !== false }))
          .filter(f => f.key)
      } catch { /* 坏 schema 只影响提示，不影响目录 */ }
    }
    const hasCli = byName.has(`connectors/${name}/cli.json`)
    const transport = cls.transport
    const supported = Boolean(server) && cls.supported && !hasCli
    const unsupportedReason = hasCli
      ? 'CLI 连接器：需要 `npm install -g` 等命令安装并执行任意代码，本插件不自动接入'
      : (server ? cls.reason : (parseError || '无 mcp.json'))
    connectors.push({
      name,
      serverName: server?.serverName || name,
      displayName: String(record.name || name),
      nameEn: String(record.name_en || ''),
      description: String(record.description_zh || record.description || record.description_en || ''),
      descriptionEn: String(record.description_en || ''),
      examples: Array.isArray(record.examples_zh) ? record.examples_zh.slice(0, 4).map(String) : [],
      type: String(record.type || ''),
      authMode: String(record.auth_mode || ''),
      visibleIn: Array.isArray(record.visible_in) ? record.visible_in.map(String) : [],
      // 图标只在**包内**（icons/<name>.<ext>）：实测 static.workbuddy.cn/connectors-config-v2/icons/… 是 404，
      // 所以这里只记包内路径，由宿主 /icon 路由供图（见 desktopRow 的 icon）。
      iconFile: iconIndex.has(name) ? `icons/${name}.${iconIndex.get(name)}` : '',
      icon: '',
      hasMcp: Boolean(server),
      hasCli,
      hasDirectory: allDirs.has(name),
      transport,
      supported,
      unsupportedReason,
      upstreamUrl,
      upstreamPath: upstreamPathOf(upstreamUrl),
      upstreamHeaders: server?.headers && typeof server.headers === 'object' ? server.headers : {},
      gatewayUrl: gatewayUrlFor(name, upstreamUrl),
      placeholders,
      tokenFields,
      skills,
      version: pluginVersions.get(name) || '',
      parseError,
    })
  }
  return {
    catalogName: String(catalog.name || ''),
    owner: catalog.owner && typeof catalog.owner === 'object' ? String(catalog.owner.name || '') : String(catalog.owner || ''),
    authInjectionRules: Array.isArray(catalog.auth_injection_rules) ? catalog.auth_injection_rules : [],
    connectors,
  }
}

/**
 * 确保目录索引可用（etag 增量 + TTL）。
 * 返回 { index, refreshed, flags }；网络失败但本地有旧索引时，用旧索引 + 如实标记 stale。
 */
export async function ensureDesktopIndex(root, { ttlMs = DESKTOP_TTL_MS, force = false, fetchImpl = fetch, now = Date.now(), log = () => {} } = {}) {
  const P = desktopPaths(root)
  mkdirSync(P.dir, { recursive: true })
  const existing = readDesktopIndex(P.dir)
  const fresh = existing && !force && typeof existing.fetchedAt === 'number' && (now - existing.fetchedAt) < ttlMs
  if (fresh) return { index: existing, refreshed: false, stale: false, flags: [] }

  const flags = []
  let catalog
  try {
    catalog = await fetchBundle(DESKTOP_CATALOG_URL, {
      fetchImpl, force, log,
      existing: { file: P.catalogZip, key: 'catalog', etag: existing?.catalogEtag || '', sha256: existing?.catalogSha256 || '', bytes: existing?.catalogBytes || 0 },
    })
  } catch (error) {
    if (existing) {
      flags.push(`目录刷新失败，继续使用本地缓存：${String(error?.message || error)}`)
      return { index: { ...existing, stale: true }, refreshed: false, stale: true, flags }
    }
    throw error
  }

  let pluginsMarketplace = null
  let pluginsInfo = null
  try {
    const plugins = await fetchBundle(DESKTOP_PLUGINS_URL, {
      fetchImpl, force, log,
      existing: { file: P.pluginsZip, key: 'plugins', etag: existing?.pluginsEtag || '', sha256: existing?.pluginsSha256 || '', bytes: existing?.pluginsBytes || 0 },
    })
    const files = unzip(readFileSync(plugins.file))
    const mp = files.find(f => f.name === '.codebuddy-plugin/marketplace.json')
    if (mp) pluginsMarketplace = JSON.parse(mp.data.toString('utf8'))
    pluginsInfo = { etag: plugins.etag, sha256: plugins.sha256, bytes: plugins.bytes, entries: pluginsMarketplace?.plugins?.length ?? 0 }
  } catch (error) {
    // 插件包只是补充（version/描述）：拿不到不影响目录可用性，如实记 flag。
    flags.push(`插件包不可用（不影响目录）：${String(error?.message || error)}`)
  }

  const parsed = parseCatalogZip(readFileSync(catalog.file), { pluginsMarketplace })
  const index = {
    version: 1,
    fetchedAt: now,
    fetchedAtIso: new Date(now).toISOString(),
    catalogEtag: catalog.etag,
    catalogSha256: catalog.sha256,
    catalogBytes: catalog.bytes,
    pluginsEtag: pluginsInfo?.etag || '',
    pluginsSha256: pluginsInfo?.sha256 || '',
    pluginsBytes: pluginsInfo?.bytes || 0,
    pluginEntries: pluginsInfo?.entries || 0,
    sourceKey: `workbuddy-connector-official\n${DESKTOP_CATALOG_URL}`,
    catalogName: parsed.catalogName,
    owner: parsed.owner,
    authInjectionRules: parsed.authInjectionRules,
    connectors: parsed.connectors,
    stale: false,
  }
  const tmp = `${P.index}.tmp`
  writeFileSync(tmp, JSON.stringify(index))
  renameSync(tmp, P.index)
  return { index, refreshed: true, stale: false, flags }
}

/** 索引记录 → 插件连接器行（形状对齐 wb-market.connectorRegistry 的行）。 */
export function desktopRow(record) {
  const endpoint = endpointFor(record)
  return {
    kind: 'connector',
    name: record.name,
    displayName: record.displayName || record.name,
    description: record.description || '',
    // 图标由插件自己供（字节取自缓存的桌面目录包），客户端拿到的是同源绝对/根相对路径，
    // 不依赖第三方 CDN（那条路实测 404），断网也能显示。
    icon: record.iconFile ? `${ICON_ROUTE}?kind=connector&source=desktop&name=${encodeURIComponent(record.name)}` : (record.icon || ''),
    authType: record.authMode || '',
    mcp: record.gatewayUrl ? { gateway_url: record.gatewayUrl, transport: record.transport, auth_mode: 'gateway' } : null,
    isConnected: false,
    official: false,
    source: 'desktop',
    desktop: {
      transport: record.transport,
      supported: record.supported,
      unsupportedReason: record.unsupportedReason || '',
      authMode: record.authMode,
      visibleIn: record.visibleIn,
      endpoint: endpoint.mode,
      endpointUrl: endpoint.url,
      upstreamUrl: record.upstreamUrl,
      credentialRefs: endpoint.credentialRefs,
      tokenFields: record.tokenFields,
      skills: record.skills,
      examples: record.examples,
      type: record.type,
      version: record.version,
    },
  }
}

export function desktopRows(index) {
  return (index?.connectors ?? []).map(desktopRow)
}

export function desktopRecord(index, name) {
  return (index?.connectors ?? []).find(c => c.name === name) || null
}

/**
 * 官方行 + 桌面行 → 合并结果（关键词大小写不敏感过滤）。
 * 去重两级（实测必需）：
 *   ① 同名（`name`）：官方 `youzan-workbuddy` 与桌面同名条目；
 *   ② **同展示名 + 同描述**（大小写不敏感）：官方注册表用账号侧 id（`tdocs-app`），
 *      桌面目录用市场 id（`tencent-docs`）—— 两边 id 不同但其实是同一个连接器，
 *      只按 name 去重会让「腾讯文档」「乐享知识库」在界面上各出现两次（生产 GUI 实测）。
 * 官方行永远优先（它带账号的授权状态）；被隐藏的桌面行数如实返回 `desktopDuplicates`。
 * 纯函数：宿主路由、hub-find 与单测共用同一口径，避免两处过滤规则漂移。
 */
export function mergeConnectorRows(officialRows, deskRows, q) {
  const needle = String(q || '').trim().toLowerCase()
  const matchDesktop = row => !needle || [row.name, row.displayName, row.description]
    .some(v => String(v || '').toLowerCase().includes(needle))
  const matchOfficial = row => !needle || [row.name, row.displayName, row.description, row.authType]
    .some(v => String(v || '').toLowerCase().includes(needle))
  const official = (officialRows ?? []).filter(matchOfficial).map(row => ({ ...row, source: 'official', official: true }))
  const seen = new Set(official.map(r => r.name))
  const identity = row => `${String(row.displayName || '').trim().toLowerCase()}\u0000${String(row.description || '').trim().toLowerCase()}`
  const seenIdentity = new Set(official.filter(r => r.displayName && r.description).map(identity))
  const desktop = []
  let duplicates = 0
  for (const row of deskRows ?? []) {
    if (seen.has(row.name)) { duplicates++; continue }
    const key = row.displayName && row.description ? identity(row) : ''
    if (key && seenIdentity.has(key)) { duplicates++; continue }
    if (!matchDesktop(row)) continue
    if (key) seenIdentity.add(key)
    desktop.push(row)
  }
  return { rows: [...official, ...desktop], official: official.length, desktop: desktop.length, desktopDuplicates: duplicates }
}

/** 从目录包里取出某个连接器的全部文件（路径已做安全收敛）。 */
export function extractConnectorFiles(indexDir, name) {
  if (!/^[\w.-]+$/.test(String(name || ''))) throw new Error(`invalid connector name: ${name}`)
  const zipPath = join(indexDir, 'connectors-config.zip')
  if (!existsSync(zipPath)) throw new Error('desktop catalog bundle missing (refresh first)')
  const prefix = `connectors/${name}/`
  const out = []
  for (const file of unzip(readFileSync(zipPath))) {
    if (!file.name.startsWith(prefix)) continue
    const rel = file.name.slice(prefix.length)
    if (!rel || rel.endsWith('/') || rel.includes('..')) continue
    out.push({ rel, data: file.data })
  }
  return out
}

/** 目录溯源（写进注册表，供 /updates 与排障显示）。 */
export function desktopProvenance(index, record) {
  return {
    kind: 'connector',
    source: 'desktop',
    bundle: {
      url: DESKTOP_CATALOG_URL,
      etag: index?.catalogEtag || '',
      sha256: index?.catalogSha256 || '',
      fetchedAt: index?.fetchedAtIso || '',
    },
    connectorId: record?.name || '',
    version: record?.version || '',
    transport: record?.transport || '',
    authMode: record?.authMode || '',
    endpoint: endpointFor(record).mode,
    upstreamUrl: record?.upstreamUrl || '',
  }
}
