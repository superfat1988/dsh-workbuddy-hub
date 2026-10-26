/**
 * dsh-workbuddy-hub — MCP OAuth 2.1 客户端（连接器授权接入）。
 *
 * 背景（2026-10-07 实测）：WorkBuddy 连接器有两套授权机制 ——
 *   ① WorkBuddy 连接器 OAuth：`/v2/as/connector/oauth/<name>/start` 返回 authorize_url
 *      （tdx-connector、github 实测可用）；
 *   ② **MCP 标准 OAuth 2.1**：MCP 端点 401 带
 *      `WWW-Authenticate: Bearer resource_metadata="…"`，客户端自己发现授权服务器、
 *      动态注册客户端（DCR）、用 PKCE 拉起授权页、回调换 token。
 *      QQ邮箱走的正是这套（桌面端把注册结果存在 `.workbuddy/connectors/<uid>/.credentials.v3.json`
 *      的 `mcpClientInfo["qq-mail|<hash>"]`，redirect 是 deep link；实测 DCR 也接受
 *      loopback 回调 `http://127.0.0.1:<port>/callback`）。
 *
 * 本模块只做机制，不持有密钥：token 一律交给 DSH 凭据库（ctx.credentials），
 * mcp.json 里只写 `${<REF>}` 引用。
 */
import { createHash, randomBytes } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync, renameSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { createServer } from 'node:http'

/** 回调监听的默认端口；被占用时按 +1 向上找（最多 20 个）。 */
export const DEFAULT_CALLBACK_PORT = 8788
const MAX_PORT_PROBES = 20
const DEFAULT_TIMEOUT_MS = 8000
/** 授权 URL 的有效期（超过即视为过期，未完成的流程可重新发起）。 */
export const OAUTH_FLOW_TTL_MS = 10 * 60 * 1000
/** 提前刷新窗口：token 剩余寿命小于它时先刷新再挂载。 */
export const TOKEN_REFRESH_WINDOW_MS = 5 * 60 * 1000

/* ---------------------------------------------------------------- utils -- */

const b64url = buf => Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

export function codeVerifier() {
  return b64url(randomBytes(32))
}

export function codeChallengeS256(verifier) {
  return b64url(createHash('sha256').update(verifier).digest())
}

export function newState() {
  return b64url(randomBytes(16))
}

/** 连接器名 → 凭据引用名（`${VAR}` 允许的字符集：字母数字下划线）。 */
export function tokenRefFor(name) {
  const slug = String(name || '').toUpperCase().replace(/[^A-Z0-9]/g, '_').replace(/^_+/, '')
  return `WORKBUDDY_OAUTH_${slug || 'CONNECTOR'}_TOKEN`
}

/** fetch 响应 → JSON（SSE 也要能吃）。 */
async function readJson(res) {
  const text = await res.text()
  try { return JSON.parse(text) } catch { /* 继续试 SSE */ }
  const line = text.split('\n').filter(l => l.startsWith('data:')).pop()
  if (line) { try { return JSON.parse(line.slice(5).trim()) } catch { return null } }
  return null
}

/** 解析 `WWW-Authenticate: Bearer realm="x", resource_metadata="https://…"`。 */
export function parseWwwAuthenticate(header) {
  const raw = String(header || '')
  if (!/^bearer/i.test(raw.trim())) return null
  const out = {}
  for (const m of raw.matchAll(/([a-zA-Z_][\w-]*)\s*=\s*"([^"]*)"/g)) out[m[1].toLowerCase()] = m[2]
  return out
}

/* ------------------------------------------------------------ discovery -- */

/** 试一组标准 well-known 路径，返回第一个 200 的 JSON。 */
async function fetchFirstJson(urls, { fetchImpl, timeoutMs }) {
  const tried = []
  for (const url of urls) {
    if (!url) continue
    try {
      const res = await fetchImpl(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(timeoutMs) })
      tried.push({ url, status: res.status })
      if (res.status === 200) {
        const json = await readJson(res)
        if (json && typeof json === 'object') return { ok: true, url, json, tried }
      }
    } catch (error) {
      tried.push({ url, status: 0, error: String(error?.message || error).slice(0, 120) })
    }
  }
  return { ok: false, tried }
}

/**
 * 发现一个 MCP 端点的授权配置。
 * @returns {{ok:true, resource:string, authorizationServer:string, metadata:object, wwwAuthenticate?:object, resourceMetadataUrl?:string}
 *          |{ok:false, reason:string, detail?:object}}
 */
export async function discoverMcpOAuth(mcpUrl, { fetchImpl = fetch, timeoutMs = DEFAULT_TIMEOUT_MS, wwwAuthenticate = '' } = {}) {
  let origin = ''
  try { origin = new URL(mcpUrl).origin } catch { return { ok: false, reason: `非法 MCP URL：${mcpUrl}` } }

  // ① resource_metadata：优先用响应头给的那个，其次按规范猜
  let params = parseWwwAuthenticate(wwwAuthenticate)
  let resourceMetadataUrl = params?.resource_metadata || ''
  let resourceMeta = null
  let resourceMetaTried = []
  if (resourceMetadataUrl) {
    const r = await fetchFirstJson([resourceMetadataUrl], { fetchImpl, timeoutMs })
    resourceMetaTried = r.tried
    if (r.ok) resourceMeta = r.json
  }
  if (!resourceMeta) {
    const guess = await fetchFirstJson([
      `${origin}/.well-known/oauth-protected-resource`,
      `${origin}/.well-known/oauth-protected-resource${new URL(mcpUrl).pathname.replace(/\/$/, '')}`,
    ], { fetchImpl, timeoutMs })
    resourceMetaTried = [...resourceMetaTried, ...guess.tried]
    if (guess.ok) { resourceMeta = guess.json; resourceMetadataUrl = resourceMetadataUrl || guess.url }
  }
  if (!resourceMeta) {
    return { ok: false, reason: '该端点没有提供 OAuth protected-resource 元数据（不是 MCP OAuth 端点）', detail: { resourceMetaTried } }
  }

  const servers = Array.isArray(resourceMeta.authorization_servers) ? resourceMeta.authorization_servers : []
  if (servers.length === 0) return { ok: false, reason: 'protected-resource 元数据里没有 authorization_servers', detail: { resourceMeta } }

  // ② AS 元数据（RFC 8414；AS 带路径时先试 path 变体）
  for (const server of servers) {
    let base
    try { base = new URL(server) } catch { continue }
    const path = base.pathname.replace(/\/$/, '')
    const candidates = path && path !== '/'
      ? [`${base.origin}/.well-known/oauth-authorization-server${path}`, `${base.origin}/.well-known/oauth-authorization-server`, `${base.origin}${path}/.well-known/oauth-authorization-server`]
      : [`${base.origin}/.well-known/oauth-authorization-server`, `${base.origin}/.well-known/openid-configuration`]
    const found = await fetchFirstJson(candidates, { fetchImpl, timeoutMs })
    if (!found.ok) continue
    const meta = found.json
    if (!meta.authorization_endpoint || !meta.token_endpoint) continue
    return {
      ok: true,
      resource: String(resourceMeta.resource || mcpUrl),
      authorizationServer: server,
      metadata: {
        issuer: String(meta.issuer || server),
        authorizationEndpoint: String(meta.authorization_endpoint),
        tokenEndpoint: String(meta.token_endpoint),
        registrationEndpoint: meta.registration_endpoint ? String(meta.registration_endpoint) : '',
        scopesSupported: Array.isArray(meta.scopes_supported) ? meta.scopes_supported.map(String) : [],
        tokenEndpointAuthMethods: Array.isArray(meta.token_endpoint_auth_methods_supported) ? meta.token_endpoint_auth_methods_supported.map(String) : [],
      },
      wwwAuthenticate: params || null,
      resourceMetadataUrl,
    }
  }
  return { ok: false, reason: '取不到授权服务器元数据（authorization/token endpoint）', detail: { servers } }
}

/* -------------------------------------------------- dynamic registration -- */

/**
 * 动态客户端注册（RFC 7591）。公开客户端 + PKCE + loopback 回调。
 * @returns {{ok:true, clientId:string, clientSecret:string, redirectUri:string, scope:string}
 *          |{ok:false, reason:string, status?:number, detail?:object}}
 */
export async function registerClient(discovery, { redirectUri, clientName = 'DSH WorkBuddy Hub', scope = '', fetchImpl = fetch, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const endpoint = discovery?.metadata?.registrationEndpoint
  if (!endpoint) return { ok: false, reason: '该授权服务器不支持动态客户端注册（无 registration_endpoint）' }
  const body = {
    client_name: clientName,
    redirect_uris: [redirectUri],
    grant_types: ['authorization_code', 'refresh_token'],
    response_types: ['code'],
    token_endpoint_auth_method: 'none',
  }
  if (scope) body.scope = scope
  let res
  try {
    res = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    })
  } catch (error) {
    return { ok: false, reason: `注册请求失败：${String(error?.message || error)}` }
  }
  const json = await readJson(res)
  if (res.status !== 200 && res.status !== 201) {
    return { ok: false, reason: `注册被拒（HTTP ${res.status}）`, status: res.status, detail: json }
  }
  if (!json?.client_id) return { ok: false, reason: '注册响应里没有 client_id', status: res.status, detail: json }
  return {
    ok: true,
    clientId: String(json.client_id),
    clientSecret: json.client_secret ? String(json.client_secret) : '',
    redirectUri: Array.isArray(json.redirect_uris) && json.redirect_uris[0] ? String(json.redirect_uris[0]) : redirectUri,
    scope: String(json.scope || scope || ''),
  }
}

/* ------------------------------------------------------------- authorize -- */

export function buildAuthorizeUrl(discovery, { clientId, redirectUri, state, verifier, scope = '', resource = '' }) {
  const url = new URL(discovery.metadata.authorizationEndpoint)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('code_challenge', codeChallengeS256(verifier))
  url.searchParams.set('code_challenge_method', 'S256')
  url.searchParams.set('state', state)
  if (scope) url.searchParams.set('scope', scope)
  if (resource) url.searchParams.set('resource', resource)
  return url.toString()
}

/* ---------------------------------------------------------------- tokens -- */

async function tokenRequest(discovery, form, { fetchImpl, timeoutMs }) {
  const endpoint = discovery?.metadata?.tokenEndpoint
  if (!endpoint) return { ok: false, reason: '缺少 token_endpoint' }
  let res
  try {
    res = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' },
      body: new URLSearchParams(form).toString(),
      signal: AbortSignal.timeout(timeoutMs),
    })
  } catch (error) {
    return { ok: false, reason: `token 请求失败：${String(error?.message || error)}` }
  }
  const json = await readJson(res)
  if (res.status !== 200 || !json?.access_token) {
    return { ok: false, reason: `换 token 被拒（HTTP ${res.status}）`, status: res.status, detail: json }
  }
  return {
    ok: true,
    accessToken: String(json.access_token),
    refreshToken: json.refresh_token ? String(json.refresh_token) : '',
    expiresIn: Number(json.expires_in) > 0 ? Number(json.expires_in) : 0,
    scope: String(json.scope || ''),
    tokenType: String(json.token_type || 'Bearer'),
  }
}

export function exchangeCode(discovery, { code, verifier, clientId, clientSecret = '', redirectUri, resource = '', fetchImpl = fetch, timeoutMs = 15000 }) {
  const form = {
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: verifier,
  }
  if (resource) form.resource = resource
  if (clientSecret) form.client_secret = clientSecret
  return tokenRequest(discovery, form, { fetchImpl, timeoutMs })
}

export function refreshAccessToken(discovery, { refreshToken, clientId, clientSecret = '', scope = '', resource = '', fetchImpl = fetch, timeoutMs = 15000 }) {
  const form = { grant_type: 'refresh_token', refresh_token: refreshToken, client_id: clientId }
  if (scope) form.scope = scope
  if (resource) form.resource = resource
  if (clientSecret) form.client_secret = clientSecret
  return tokenRequest(discovery, form, { fetchImpl, timeoutMs })
}

/* -------------------------------------------------- client registry store -- */

export function oauthPaths(root) {
  const dir = join(root, '.meta', 'oauth')
  return { dir, clients: join(dir, 'clients.json') }
}

export function loadClients(root) {
  const { clients } = oauthPaths(root)
  try { const j = JSON.parse(readFileSync(clients, 'utf8')); return j && typeof j === 'object' ? j : {} } catch { return {} }
}

export function saveClient(root, key, value) {
  const { dir, clients } = oauthPaths(root)
  const all = loadClients(root)
  all[key] = value
  mkdirSync(dir, { recursive: true })
  const tmp = `${clients}.tmp`
  writeFileSync(tmp, JSON.stringify(all, null, 2))
  renameSync(tmp, clients)
  return value
}

/* ------------------------------------------------------- callback server -- */

/**
 * 起一个只监听 127.0.0.1 的回调服务器，等浏览器把 `?code=&state=` 送回来。
 * 安全：只绑回环、只认一次、校验 state、有 TTL；不把任何密钥回显到页面。
 * @returns {{ok:true, port:number, redirectUri:string, wait:Promise<{code:string}|{error:string}>, close:()=>void}|{ok:false, reason:string}}
 */
export function startCallbackServer({ preferredPort = DEFAULT_CALLBACK_PORT, host = '127.0.0.1', state, ttlMs = OAUTH_FLOW_TTL_MS, onResult } = {}) {
  return new Promise(resolve => {
    let settled = false
    let timer = null
    // maxHeaderSize 放宽：本机 127.0.0.1 上多个服务共享 cookie jar，浏览器对回环地址的
    // Cookie 头可能很大（实测 DSH GUI 已被 431 挡过）。回调若被 431 顶掉，code 就收不到。
    const server = createServer({ maxHeaderSize: 256 * 1024 }, (req, res) => {
      const url = new URL(req.url || '/', 'http://127.0.0.1')
      if (url.pathname !== '/callback') {
        res.statusCode = 404
        res.setHeader('content-type', 'text/plain; charset=utf-8')
        res.end('not found')
        return
      }
      const code = url.searchParams.get('code') || ''
      const gotState = url.searchParams.get('state') || ''
      const error = url.searchParams.get('error') || ''
      const errorDescription = url.searchParams.get('error_description') || ''
      const page = ok => {
        res.setHeader('content-type', 'text/html; charset=utf-8')
        res.end(ok
          ? '<!doctype html><meta charset="utf-8"><title>授权完成</title><body style="font:15px/1.6 system-ui;padding:40px">授权已完成，可以关闭本页并回到 DSH。</body>'
          : '<!doctype html><meta charset="utf-8"><title>授权未完成</title><body style="font:15px/1.6 system-ui;padding:40px">这次回调不匹配当前授权请求，已忽略；请回到 DSH 重新点「连接」。</body>')
      }
      /** 终止整个流程（成功 / 用户拒绝 / 超时）。 */
      const settle = payload => {
        if (settled) return
        settled = true
        if (timer) clearTimeout(timer)
        page(payload.ok)
        setTimeout(() => { try { server.close() } catch { /* 忽略 */ } }, 50)
        try { onResult?.(payload) } catch { /* 忽略 */ }
        resolveResult(payload)
      }
      if (error) { settle({ ok: false, error: `${error}${errorDescription ? `: ${errorDescription}` : ''}` }); return }
      // 缺少 code / state 不匹配都**不终止**流程：可能只是杂散请求（或用户点了旧链接），
      // 如实回一个「不匹配」页面，继续等正确的回调（单次成功即结束）。
      if (!code) { page(false); return }
      if (!state || gotState !== state) { page(false); return }
      settle({ ok: true, code })
    })

    let resolveResult = () => {}
    const wait = new Promise(r => { resolveResult = r })

    const tryListen = port => {
      server.once('error', err => {
        if (err?.code === 'EADDRINUSE' && port - preferredPort < MAX_PORT_PROBES) { tryListen(port + 1); return }
        resolve({ ok: false, reason: `回调端口不可用（${port}）：${String(err?.message || err)}` })
      })
      server.listen(port, host, () => {
        timer = setTimeout(() => {
          if (settled) return
          settled = true
          try { server.close() } catch { /* 忽略 */ }
          resolveResult({ ok: false, error: '等待授权超时（未在有效期内完成）' })
        }, ttlMs)
        // 端口以实际绑定为准（preferredPort=0 时由系统分配）
        const actual = server.address()?.port || port
        // host 默认 127.0.0.1（授权页与 DSH 同机时最省事）；如需用 PC 浏览器直接完成回调，
        // 可把 oauthCallbackHost 配成 NAS 的 LAN IP（PKCE 兜底：光有 code 换不到 token）。
        resolve({
          ok: true,
          port: actual,
          host,
          redirectUri: `http://${host}:${actual}/callback`,
          wait,
          close: () => { if (timer) clearTimeout(timer); try { server.close() } catch { /* 忽略 */ } },
        })
      })
    }
    tryListen(preferredPort)
  })
}

/* ------------------------------------------------------------ flow store -- */

/** 进程内待完成流程：state → 上下文（含 verifier，绝不落盘）。 */
const pendingFlows = new Map()
let flowSeq = 0

export function putFlow(flow) {
  const state = flow.state
  pendingFlows.set(state, { ...flow, id: ++flowSeq, createdAt: Date.now() })
  // 顺手清理过期流程（避免长期挂着 verifier）
  for (const [key, value] of pendingFlows) {
    if (Date.now() - value.createdAt > OAUTH_FLOW_TTL_MS) pendingFlows.delete(key)
  }
  return pendingFlows.get(state)
}

export function getFlow(state) {
  return pendingFlows.get(state) || null
}

export function dropFlow(state) {
  const flow = pendingFlows.get(state)
  pendingFlows.delete(state)
  return flow || null
}

export function flowCount() {
  return pendingFlows.size
}

/** 供测试/排障：清空全部待完成流程。 */
export function clearFlows() {
  pendingFlows.clear()
}

export { dirname }
