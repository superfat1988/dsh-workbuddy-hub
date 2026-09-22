// Official WorkBuddy market data layer, speaking the same protocol as the
// reference gateway (workbuddy2api): OAuth device flow for credentials, then
// Bearer-authenticated reads against copilot.tencent.com /v2/market/*.
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'

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

async function call(method, path, { token, body } = {}) {
  const headers = baseHeaders()
  if (token) headers.authorization = `Bearer ${token}`
  const init = { method, headers }
  if (body !== undefined) init.body = JSON.stringify(body)
  const res = await fetch(UPSTREAM + path, init)
  const text = await res.text()
  let json
  try { json = JSON.parse(text) } catch { json = { raw: text.slice(0, 200) } }
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
export function loadAuth(stateDir) {
  const path = join(stateDir, 'workbuddy-auth.json')
  if (!existsSync(path)) return null
  try { return JSON.parse(readFileSync(path, 'utf8')) } catch { return null }
}

export function saveAuth(stateDir, auth) {
  mkdirSync(stateDir, { recursive: true })
  writeFileSync(join(stateDir, 'workbuddy-auth.json'), JSON.stringify(auth, null, 2))
}

/** Refresh the access token before it lapses (kept best-effort). */
export async function refresh(auth) {
  if (!auth?.refresh_token) return auth
  const { status, json } = await call('POST', '/v2/plugin/auth/refresh', { body: { refresh_token: auth.refresh_token } })
  const d = json?.data ?? {}
  if (status !== 200 || !d.accessToken) return auth
  return { ...auth, access_token: d.accessToken, refresh_token: d.refreshToken ?? auth.refresh_token, expires_in: d.expiresIn, obtainedAt: Date.now() }
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
    const err = new Error(`official market ${kind} list failed: HTTP ${status} code=${json?.code} msg=${json?.msg}`)
    err.status = status
    err.authorised = status !== 401 && status !== 403
    throw err
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
  if (status !== 200 || json?.code !== 0) throw new Error(`skill get-by-ids failed: HTTP ${status} code=${json?.code}`)
  return json.data?.skills ?? []
}

/** Official connector registry (name/display/description/icon/auth_type/mcp). */
export async function connectorRegistry(stateDir) {
  const token = await bearer(stateDir)
  if (!token) return []
  const { status, json } = await call('GET', '/console/as/connector/registry2c/list?scope=all', { token })
  if (status !== 200 || json?.code !== 0) return []
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
