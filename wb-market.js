// Official WorkBuddy market data layer, speaking the same protocol as the
// reference gateway (workbuddy2api): OAuth device flow for credentials, then
// Bearer-authenticated reads against copilot.tencent.com /v2/market/*.
import { writeFileSync, readFileSync, existsSync, mkdirSync, rmSync, chmodSync } from 'node:fs'
import { join } from 'node:path'
import {
  KEEPALIVE_THRESHOLD_MS, SESSION_DEAD_CODE, expiresAtOf, shouldRefresh, normalizeHealth,
} from './src/keepalive.js'

// 保活常量与失效错误码的唯一来源在 src/keepalive.js（纯逻辑，可单测）；这里转出，
// 宿主与调用方只认一个来源，业务代码里不散落魔法数字。
export { KEEPALIVE_THRESHOLD_MS, SESSION_DEAD_CODE }

const UPSTREAM = 'https://copilot.tencent.com'
const ORIGIN = 'https://www.codebuddy.cn'
const UA = 'CLI/2.63.2 CodeBuddy/2.63.2'

function baseHeaders() {
  return {
    'content-type': 'application/json',
    accept: 'application/json, text/plain, */*',
    'x-requested-with': 'XMLHttpRequest',
    origin: ORIGIN,
    referer: ORIGIN + '/',
    'user-agent': UA,
  }
}

/* ---- 官方鉴权事件总线（12153 = session 失效） ---------------------------- *
 * 宿主订阅后即可在「官方任意接口返回 12153」时走同一套「连续失败 → 会话失效」计数，
 * 而不必逐个改动这些函数的返回形状（成功路径的形状保持原样）。
 * 注意：refresh 端点自身**不**广播 session-dead（emitSessionDead:false）——它的失败
 * 由 refreshIfNeeded() 的返回值交给调用方计数，避免同一次失败被记两遍。
 * ------------------------------------------------------------------------ */
const _authEventListeners = new Set()

/**
 * 订阅官方鉴权事件；返回取消订阅函数。
 * 事件：{ type:'session-dead', error:Error }（官方返回 12153）
 *       { type:'refresh-ok',   error:'' }   （refresh 真正成功，宿主据此清零失败计数）
 */
export function onAuthEvent(fn) {
  _authEventListeners.add(fn)
  return () => { _authEventListeners.delete(fn) }
}

function emitAuthEvent(event) {
  for (const fn of _authEventListeners) { try { fn(event) } catch { /* 单个订阅者出错不影响调用方 */ } }
}

/** 组装带官方 code 的错误：12153 → err.sessionDead = true。成功路径不经过这里。 */
function officialError(message, { status, code } = {}) {
  const err = new Error(message)
  if (status !== undefined) err.status = status
  if (code !== undefined) err.code = code
  err.sessionDead = code === SESSION_DEAD_CODE
  err.authorised = status !== 401 && status !== 403
  return err
}

async function call(method, path, { token, body, emitSessionDead = true } = {}) {
  const headers = baseHeaders()
  if (token) headers.authorization = `Bearer ${token}`
  const init = { method, headers }
  if (body !== undefined) init.body = JSON.stringify(body)
  const res = await fetch(UPSTREAM + path, init)
  const text = await res.text()
  let json
  try { json = JSON.parse(text) } catch { json = { raw: text.slice(0, 200) } }
  // 官方 session 失效：广播给宿主（宿主据此累计连续失败，连续 3 次才判失效）
  if (emitSessionDead && json?.code === SESSION_DEAD_CODE) {
    emitAuthEvent({ type: 'session-dead', error: officialError(`official session dead: ${method} ${path} code=${SESSION_DEAD_CODE} msg=${json?.msg}`, { status: res.status, code: SESSION_DEAD_CODE }) })
  }
  return { status: res.status, json }
}

// ---- OAuth device flow ----------------------------------------------------
/** Step 1: create a login state and return the official authorisation URL. */
export async function loginStart() {
  const { status, json } = await call('POST', '/v2/plugin/auth/state?platform=CLI', { body: {} })
  const data = json?.data ?? {}
  if (status !== 200 || !data.state || !data.authUrl) {
    throw new Error(`auth/state failed: HTTP ${status} ${JSON.stringify(json).slice(0, 160)}`)
  }
  return { state: data.state, authUrl: data.authUrl }
}

/** Step 2: exchange a completed browser login for the token bundle. */
export async function loginPoll(state) {
  const tok = await call('GET', `/v2/plugin/auth/token?state=${encodeURIComponent(state)}`)
  const d = tok.json?.data ?? {}
  if (tok.status !== 200 || !d.accessToken) {
    const err = new Error('login pending or failed')
    err.pending = true
    throw err
  }
  let account = {}
  try {
    const acct = await call('GET', `/v2/plugin/login/account?state=${encodeURIComponent(state)}`, { token: d.accessToken })
    account = acct.json?.data ?? {}
  } catch { /* nickname/uid are cosmetic */ }
  return {
    access_token: d.accessToken,
    refresh_token: d.refreshToken,
    expires_in: d.expiresIn,
    domain: d.domain,
    uid: account.uid,
    nickname: account.nickname,
    obtainedAt: Date.now(),
  }
}

// ---- token persistence (config-scoped state, not credentials) -------------
const AUTH_FILE = 'workbuddy-auth.json'
/** 保活健康档（与凭证同目录）：记录连续失败次数 / 最后错误 / 最后巡检时间 / 判失效时间。 */
export const AUTH_HEALTH_FILE = 'workbuddy-auth-health.json'

export function loadAuth(stateDir) {
  const path = join(stateDir, AUTH_FILE)
  if (!existsSync(path)) return null
  try { return JSON.parse(readFileSync(path, 'utf8')) } catch { return null }
}

export function saveAuth(stateDir, auth) {
  mkdirSync(stateDir, { recursive: true })
  const path = join(stateDir, AUTH_FILE)
  // 凭证明文按 0600 落盘（审计项：此前是默认 0644，同机其他用户可读）
  writeFileSync(path, JSON.stringify(auth, null, 2), { mode: 0o600 })
  // mode 只在**创建**时生效：已存在的旧文件必须显式 chmod，否则修不掉历史 0644
  try { chmodSync(path, 0o600) } catch { /* 非 POSIX 文件系统忽略 */ }
}

/** 读取健康档（缺失 / 脏文件 → 初始值，绝不抛错）。 */
export function loadAuthHealth(stateDir) {
  const path = join(stateDir, AUTH_HEALTH_FILE)
  if (!existsSync(path)) return normalizeHealth(null)
  try { return normalizeHealth(JSON.parse(readFileSync(path, 'utf8'))) } catch { return normalizeHealth(null) }
}

/** 落盘健康档（0600；内容只有计数与错误文案，不含凭据值）。 */
export function saveAuthHealth(stateDir, health) {
  mkdirSync(stateDir, { recursive: true })
  const path = join(stateDir, AUTH_HEALTH_FILE)
  writeFileSync(path, JSON.stringify(normalizeHealth(health), null, 2), { mode: 0o600 })
  try { chmodSync(path, 0o600) } catch { /* 非 POSIX 文件系统忽略 */ }
}

/** 清空健康档（重新登录成功 / 注销时调用：成功一次就清空）。 */
export function clearAuthHealth(stateDir) {
  try { rmSync(join(stateDir, AUTH_HEALTH_FILE), { force: true }) } catch { /* 清不掉不影响登录 */ }
}

/**
 * 真正调用官方 refresh 接口换新 token。
 *  · 成功：返回形状与旧实现完全一致（{...auth, access_token, refresh_token, expires_in, obtainedAt}），
 *    并广播 refresh-ok（宿主据此清零连续失败计数）；
 *  · 失败：**抛错**，错误上带 code / sessionDead（12153）/ status / authorised，
 *    调用方（bearer / refreshIfNeeded）据此判定，不再靠「返回值没变」猜失败。
 */
export async function refresh(auth) {
  if (!auth?.refresh_token) throw officialError('no refresh_token to refresh', { status: 0 })
  const { status, json } = await call('POST', '/v2/plugin/auth/refresh', {
    body: { refresh_token: auth.refresh_token },
    // refresh 自身的 12153 不广播：交给 refreshIfNeeded() 的返回值统一计数，避免重复记账
    emitSessionDead: false,
  })
  const d = json?.data ?? {}
  if (status !== 200 || !d.accessToken) {
    throw officialError(`official refresh failed: HTTP ${status} code=${json?.code} msg=${json?.msg}`, { status, code: json?.code })
  }
  const fresh = { ...auth, access_token: d.accessToken, refresh_token: d.refreshToken ?? auth.refresh_token, expires_in: d.expiresIn, obtainedAt: Date.now() }
  emitAuthEvent({ type: 'refresh-ok', error: '' })
  return fresh
}

/** A valid bearer token, refreshing when the stored one is near expiry. */
export async function bearer(stateDir) {
  const auth = loadAuth(stateDir)
  if (!auth?.access_token) return null
  const age = Date.now() - (auth.obtainedAt ?? 0)
  const ttl = (auth.expires_in ?? 3600) * 1000
  if (age > ttl * 0.8) {
    try {
      const fresh = await refresh(auth)
      saveAuth(stateDir, fresh)
      return fresh.access_token
    } catch { return auth.access_token }
  }
  return auth.access_token
}

/**
 * 主动保活（对应上游 wb_scheduler.py 的 keepalive 巡检）：
 * 读凭证 → 没有 refresh_token 直接报 no-credentials；force 为真或剩余寿命不足阈值
 * （默认 2 小时）时调用 refresh()；成功落盘并返回新凭证；未到阈值则原样返回。
 *
 * 与 bearer() 的**惰性**刷新互补：bearer 是「有请求才刷」（阈值 20% 寿命），
 * 本函数由宿主定时器周期性调用，解决「长期不打开 DSH → refresh_token 也过期 →
 * 用户被迫重新扫码」。
 *
 * @returns {Promise<{ok:boolean, refreshed?:boolean, auth?:object, reason?:string, error?:Error, sessionDead?:boolean}>}
 *   reason: 'no-credentials' | 'refresh-failed' | 'session-dead'
 */
export async function refreshIfNeeded(stateDir, { thresholdMs = KEEPALIVE_THRESHOLD_MS, force = false } = {}) {
  const auth = loadAuth(stateDir)
  if (!auth?.refresh_token) return { ok: false, reason: 'no-credentials' }
  const expiresAt = expiresAtOf(auth)
  if (!force && !shouldRefresh(expiresAt, Date.now(), thresholdMs)) {
    return { ok: true, refreshed: false, auth }
  }
  try {
    const fresh = await refresh(auth)
    saveAuth(stateDir, fresh)
    return { ok: true, refreshed: true, auth: fresh }
  } catch (error) {
    return {
      ok: false,
      reason: error?.sessionDead ? 'session-dead' : 'refresh-failed',
      sessionDead: Boolean(error?.sessionDead),
      error,
    }
  }
}

// ---- market reads ---------------------------------------------------------
/** Expert/skill catalogue from the official market API. */
export async function marketList(kind, { page = 1, pageSize = 60, query = '', categoryId, categories } = {}, stateDir) {
  const token = await bearer(stateDir)
  const payload = { page, page_size: pageSize }
  if (query) payload.keyword = query
  const cats = Array.isArray(categories) && categories.length ? categories : (categoryId && categoryId !== 'all' ? [categoryId] : [])
  if (cats.length) payload.categories = cats
  const { status, json } = await call('POST', `/v2/operation-platform/market/${kind}/list`, { token, body: payload })
  if (status !== 200 || json?.code !== 0) {
    // err.status / err.authorised 保持旧语义；新增 err.code / err.sessionDead（12153）
    throw officialError(
      `official market ${kind} list failed: HTTP ${status} code=${json?.code} msg=${json?.msg}`,
      { status, code: json?.code },
    )
  }
  const data = json.data ?? {}
  return { total: data.total_count ?? 0, rows: data.experts ?? data.skills ?? [] }
}

/** Categories for a kind. */
export async function marketCategories(kind, stateDir) {
  const token = await bearer(stateDir)
  const path = kind === 'expert' ? '/v2/operation-platform/market/expert-categories' : `/v2/operation-platform/market/categories?type=${kind}`
  const { status, json } = await call('GET', path, { token })
  if (status === 200 && json?.code === 0) {
    const items = json.data?.items ?? []
    if (items.length) return items.map(i => ({ id: i.id, label: i.name_zh ?? i.name?.zh ?? i.name, count: i.item_count ?? i.count ?? 0 }))
  }
  // No-login fallback: the captured official snapshot (labels + counts).
  const { FALLBACK_CATEGORIES } = await import('./wb-cats.js')
  return FALLBACK_CATEGORIES[kind === 'expert' ? 'expert' : 'skill'] ?? []
}

/** Full records for the given skill ids (includes download_url). */
export async function skillDetails(ids, stateDir) {
  const token = await bearer(stateDir)
  const { status, json } = await call('POST', '/v2/operation-platform/market/skill/get-by-ids', { token, body: { skill_ids: ids } })
  if (status !== 200 || json?.code !== 0) {
    throw officialError(`skill get-by-ids failed: HTTP ${status} code=${json?.code}`, { status, code: json?.code })
  }
  return json.data?.skills ?? []
}

/**
 * Official connector registry (name/display/description/icon/auth_type/mcp).
 *
 * 需要登录，且失败**抛错**（不再静默返回 []）：调用方必须能区分「官方注册表为空」
 * 与「未登录 / 上游失败」—— 检查更新时把后者判成「已是最新」或「已下架」都是错的。
 */
export async function connectorRegistry(stateDir) {
  const token = await bearer(stateDir)
  if (!token) throw officialError('connector registry requires login', { status: 401 })
  const { status, json } = await call('GET', '/console/as/connector/registry2c/list?scope=all', { token })
  if (status !== 200 || json?.code !== 0) {
    throw officialError(
      `official connector registry failed: HTTP ${status} code=${json?.code} msg=${json?.msg}`,
      { status, code: json?.code },
    )
  }
  const arr = json.data?.list ?? json.data?.items ?? json.data ?? []
  if (!Array.isArray(arr)) return []
  return arr.map(c => ({
    kind: 'connector',
    name: c.name,
    displayName: c.data?.display_name || c.name,
    description: c.data?.description || '',
    icon: c.data?.icon_url || '',
    authType: c.auth_type || '',
    mcp: c.mcp || null,
    isConnected: Boolean(c.is_connected),
    official: true,
  }))
}

/** Already-bound connectors for this account (authoritative connected state). */
export async function connectorBound(stateDir) {
  const token = await bearer(stateDir)
  const { status, json } = await call('GET', '/console/as/connector/user/', { token })
  if (status !== 200 || json?.code !== 0) return []
  const items = json.data?.connectors ?? []
  return items
    .filter(c => c.connect_status === 1 || c.active_status === 1)
    .map(c => ({ name: c.name, displayName: c.display_name || c.name, description: c.description || '', mode: c.connect_mode || '', connectAt: c.connect_at || '' }))
}

/** Start the official OAuth flow for one connector; returns the raw payload
 *  (it carries the authorize URL when the provider supports it). */
export async function connectorAuthStart(name, stateDir) {
  const token = await bearer(stateDir)
  const { status, json } = await call('POST', `/console/as/connector/oauth/${encodeURIComponent(name)}/start`, { token, body: {} })
  return { status, payload: json }
}

/** Revoke (unbind) one connector through the app's own endpoint. */
export async function connectorRevoke(name, stateDir) {
  const token = await bearer(stateDir)
  const { status, json } = await call('POST', `/console/as/connector/oauth/${encodeURIComponent(name)}/revoke`, { token, body: {} })
  return { status, ok: json?.code === 0, message: json?.msg || '' }
}

/** Official OAuth completion poll (the app waits on this after /start). */
export async function connectorOauthStatus(name, stateDir) {
  const token = await bearer(stateDir)
  const { status, json } = await call('GET', `/console/as/connector/oauth/${encodeURIComponent(name)}/status`, { token })
  return { status, payload: json }
}
