// Data adapter: the official components talk only to these helpers, which map
// onto the hub routes. Official sources first, mirror as fallback.
const API = '/workbuddy-hub'

// Tiny module-level event bus: the composer picker (input.left) and the
// attached rail (composer.dock) are separate slot instances, so a mount /
// unmount made by one must notify the other to re-read.
// 市场导航桥：底部项（召唤更多专家/管理技能/…）需要切到主面板的市场页。
let _marketNavigator = null
const _marketListeners = new Set()
export function setMarketNavigator(fn) { _marketNavigator = fn }

// 打开某个会话（官方「召唤专家 = 新建对话并选中该专家」需要跳到专家的会话）
let _sessionOpener = null
export function setSessionOpener(fn) { _sessionOpener = fn }
export function openSessionById(sessionId) {
  try { return Boolean(_sessionOpener?.(sessionId)) } catch { return false }
}

// 选中某会话的 agent preset（官方 remote，会自动把 sessionId 解析成 agent；
// 只对空白会话生效，会话已开始会被锁拒绝）
let _presetSelector = null
export function setPresetSelector(fn) { _presetSelector = fn }
export function selectPreset(sessionId, presetId) {
  const fn = _presetSelector
  console.info('[wbh] selectPreset ->', sessionId, presetId, 'selector:', typeof fn)
  if (typeof fn !== 'function') return Promise.resolve({ ok: false, error: 'agentPresets remote 不可用' })
  try { return Promise.resolve(fn(sessionId, presetId)).then(r => { console.info('[wbh] selectPreset result ->', JSON.stringify(r)); return r }) } catch (error) {
    return Promise.resolve({ ok: false, error: String(error?.message || error) })
  }
}

// 新建对话（官方召唤前会先进入一个新对话）
let _sessionStarter = null
export function setSessionStarter(fn) { _sessionStarter = fn }
export function startNewSession() {
  try { return Boolean(_sessionStarter?.()) } catch { return false }
}


// 在指定工作区建/复用空白会话，并在主视图切换前用 beforeOpen(sessionId) 拿到会话 id。
// 这是 DSH 官方「新建会话」路径（走客户端 sessions.create，客户端会话列表即时更新），
// 与宿主的 sessionController.create 不同（后者客户端不会同步收到会话）。
/**
 * 最近加载过的专家（跨会话保留，localStorage）：picker 的专家面板据此把常用专家排在前面。
 * 没有记录时调用方回落到原有排序（不影响置顶）。
 */
const RECENT_EXPERTS_KEY = 'wbh-recent-experts'
const RECENT_EXPERTS_MAX = 8
export function recentExpertNames() {
  try {
    const raw = localStorage.getItem(RECENT_EXPERTS_KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr.filter(x => typeof x === 'string' && x) : []
  } catch { return [] }
}
export function markExpertRecent(entry) {
  const name = entry?.name
  if (typeof name !== 'string' || !name) return
  try {
    const list = recentExpertNames().filter(n => n !== name)
    list.unshift(name)
    localStorage.setItem(RECENT_EXPERTS_KEY, JSON.stringify(list.slice(0, RECENT_EXPERTS_MAX)))
  } catch { /* 无 localStorage 时忽略 */ }
}

/**
 * 「待生效专家」：召唤后先记下来，等新会话的 composer 挂载（拿到那个会话的
 * props.sessionId）时再挂上去 + 显示 chip。
 *
 * 这样专家跟「会话」走，而不是跟「插件猜的工作区」走 —— 用户在转跳后的界面上
 * 选任意工作区，新会话一挂载就自动带上该专家（不依赖工作区解析，也不改官方框架）。
 */
let _pendingExpert = null
const PENDING_TTL_MS = 5 * 60 * 1000
export function setPendingExpert(entry) {
  _pendingExpert = entry ? { ...entry, at: Date.now() } : null
  console.info('[wbh] pending expert set:', entry?.name)
}
export function clearPendingExpert() { _pendingExpert = null }
/** 只看不取（用于告知用户「上一次选的专家被替换了」）。 */
export function peekPendingExpert() {
  const p = _pendingExpert
  if (!p) return null
  if (Date.now() - (p.at || 0) > PENDING_TTL_MS) return null
  return p
}
export function takePendingExpert() {
  const p = _pendingExpert
  _pendingExpert = null
  if (!p) return null
  if (Date.now() - (p.at || 0) > PENDING_TTL_MS) return null
  return p
}

// 当前会话 id：composer 槽由框架注入 props.sessionId，是权威来源
let _composerSession = ''
export function setComposerSession(id) { _composerSession = id || '' }
export function composerSession() { return _composerSession }
export function onMarketRequest(fn) { _marketListeners.add(fn); return () => { _marketListeners.delete(fn) } }
let _pendingMarket = null
export function consumePendingMarket() { const r = _pendingMarket; _pendingMarket = null; return r }
export function openMarket(request) {
  // 主面板切换会让市场页「随后」才挂载，此刻它还没订阅，所以先存起来；
  // 挂载后 consumePendingMarket() 取用，并在下一个任务再广播一次给已挂载的订阅者。
  _pendingMarket = request
  try { _marketNavigator?.() } catch { /* 导航不可用时仍发出请求 */ }
  const emit = () => { for (const fn of _marketListeners) { try { fn(request) } catch { /* 忽略单个订阅者 */ } } }
  emit()
  try { setTimeout(emit, 0) } catch { /* 无定时器环境 */ }
}

// 已选条目（专家/技能/连接器）—— 按会话隔离：每个会话的 composer 只显示
// **它自己** 选中的 chip，不再全局串。key = sessionId；sessionId 缺失的调用
// 落到 '_unbound' 桶（历史兼容）。
let _selectedBySession = new Map()
const _selListeners = new Set()
export function selectedItems(sessionId) {
  const key = sessionId || '_unbound'
  return _selectedBySession.get(key) || []
}
export function onSelectionChange(fn) { _selListeners.add(fn); return () => { _selListeners.delete(fn) } }
const _emitSelection = () => { for (const fn of _selListeners) { try { fn() } catch {} } }
/**
 * 把一个条目加入某会话的 chip 列表。
 * **专家是单槽位**：加新专家会替换掉该会话原有的专家（返回被替换掉的条目数组，
 * 供调用方提示/清理）—— 与宿主侧 mountEntry「一个会话只挂一位专家」保持一致。
 * 技能/连接器仍是多选。
 */
export function addSelection(entry, sessionId) {
  const key = sessionId || '_unbound'
  const list = _selectedBySession.get(key) || []
  const itemKey = `${entry.kind}/${entry.name}`
  if (list.some(x => x.key === itemKey)) return []
  const replaced = entry.kind === 'expert' ? list.filter(x => x.kind === 'expert') : []
  const kept = replaced.length ? list.filter(x => x.kind !== 'expert') : list
  _selectedBySession.set(key, [...kept, { key: itemKey, kind: entry.kind, name: entry.name, displayName: entry.displayName || entry.name, icon: entry.icon || '' }])
  _emitSelection()
  return replaced
}

/** 某会话当前已选的专家（单槽位；没有则 null）。 */
export function selectedExpert(sessionId) {
  const list = _selectedBySession.get(sessionId || '_unbound') || []
  return list.find(x => x.kind === 'expert') || null
}
export function removeSelection(sessionId, kind, name) {
  const key = sessionId || '_unbound'
  const list = _selectedBySession.get(key) || []
  const before = list.length
  const next = list.filter(x => !(x.kind === kind && x.name === name))
  if (next.length !== before) { _selectedBySession.set(key, next); _emitSelection() }
}

const _changeListeners = new Set()
export const onCatalogChange = fn => { _changeListeners.add(fn); return () => { _changeListeners.delete(fn) } }
const _emitChange = () => { for (const fn of _changeListeners) { try { fn() } catch {} } }

/* ------------------------------------------------------------------ *
 * 登录态 store（市场页 / 连接器页 / picker / 设置区共用）
 * ------------------------------------------------------------------ */

/**
 * 缓存的登录态；未拉取过时为 null。宿主 GET /wb-auth 返回：
 * { configured, uid, nickname, expiresAt, stale, lastError, keepalive:{ lastCheckAt, consecutiveFailures } }
 * stale=true 表示「已登录但凭证已彻底失效」（连续 3 次保活刷新失败 / 官方 12153
 * 累计到阈值）—— 必须当作**需要重新登录**看待，否则用户只会看到一堆静默失败。
 */
let _authCache = null
const _authListeners = new Set()

/** 读取缓存的登录态（同步；null = 还没拉过）。 */
export function authState() { return _authCache }

/**
 * 登录态是否「已失效」：已登录但 stale。
 * 界面据此把 stale 视同未登录（显示登录卡 / 登录行），requireAuth 据此拦下动作。
 */
export function authStale(auth = _authCache) { return auth?.configured === true && auth?.stale === true }

/** stale 时统一的提示文案（登录卡 / 账号胶囊共用，避免各处措辞不一）。 */
export const STALE_LOGIN_REASON = '登录已失效，请重新扫码'

/** 订阅登录态变化；返回取消函数。 */
export function onAuthChange(fn) { _authListeners.add(fn); return () => { _authListeners.delete(fn) } }
const _emitAuth = () => { for (const fn of _authListeners) { try { fn(_authCache) } catch {} } }

/** 重新拉取 GET /wb-auth 并通知订阅者（登录成功、注销后都要调）。并发调用会合并成一次请求。 */
let _authInflight = null
export async function refreshAuth() {
  if (_authInflight) return _authInflight
  _authInflight = (async () => {
    try { _authCache = await hub.auth() } catch { _authCache = { configured: false } }
    _emitAuth()
    return _authCache
  })()
  try { return await _authInflight } finally { _authInflight = null }
}

/* ------------------------------------------------------------------ *
 * 动作级 JIT 登录门（requireAuth）
 *
 * 未登录时 requireAuth() 不直接失败：它广播一个「需要登录」事件，由界面
 * （市场页 / picker）订阅后弹出登录卡；登录成功 settleAuthGate(true) → resolve，
 * 界面据此自动继续刚才被拦下的动作；用户取消 settleAuthGate(false) → reject。
 * ------------------------------------------------------------------ */

let _authGate = null           // { reason, surface, at, claimed, resolve, reject }
const _authRequiredListeners = new Set()

/** 订阅「需要登录」事件；返回取消函数。 */
export function onAuthRequired(fn) { _authRequiredListeners.add(fn); return () => { _authRequiredListeners.delete(fn) } }

/**
 * 认领当前登录门（多个界面同时订阅时，只有第一个认领者负责显示登录卡）。
 * @param {string} [surface] 认领者所属界面（'page' 市场页 / 'picker' 输入框＋）；
 *   发起动作的界面会带上同名 surface，只有匹配的界面才认领 —— 避免
 *   「在 picker 里点连接，登录卡却弹在市场页」。
 */
export function claimAuthGate(surface) {
  const gate = _authGate
  if (!gate || gate.claimed) return null
  if (surface && gate.surface && surface !== gate.surface) return null
  gate.claimed = true
  return { reason: gate.reason, surface: gate.surface }
}

/** 当前是否有未决的登录门（供排障/测试观察）。 */
export function authGatePending() { return _authGate ? { reason: _authGate.reason, surface: _authGate.surface, claimed: _authGate.claimed } : null }

/**
 * 登录成功（ok=true）或用户取消（ok=false）时由显示登录卡的界面回传。
 * @returns {boolean} 是否结算了一个未决的登录门
 */
export function settleAuthGate(ok) {
  const gate = _authGate
  if (!gate) return false
  _authGate = null
  if (ok) gate.resolve(_authCache ?? { configured: true })
  else gate.reject(new Error('用户取消了登录'))
  return true
}

/**
 * 动作级 JIT 登录：已登录（且凭证未失效）直接 resolve；否则打开登录卡并等待结果。
 * 成功 → resolve(登录态)；取消 → reject；没有任何界面能显示登录卡 → reject（不挂起）。
 * @param {{ reason?: string, surface?: string }} options
 *   reason 会显示在登录卡上（说明为什么要登录）；surface 指定由哪个界面显示登录卡。
 */
export function requireAuth({ reason = '', surface = '' } = {}) {
  // 「已登录但 stale」= 凭证已失效，同样要拦下来重新扫码（不能只看 configured）
  const stale = authStale()
  if (_authCache?.configured === true && !stale) return Promise.resolve(_authCache)
  // stale 且调用方没给原因时，用统一文案（用户得知道为什么要再扫一次）
  const why = reason || (stale ? STALE_LOGIN_REASON : '')
  // 单槽位：新动作取代旧的未决请求，避免多个动作同时等同一张卡
  if (_authGate) {
    const staleGate = _authGate
    _authGate = null
    staleGate.reject(new Error('登录请求已被新的操作取代'))
  }
  return new Promise((resolve, reject) => {
    _authGate = { reason: why, surface, at: Date.now(), claimed: false, resolve, reject }
    for (const fn of _authRequiredListeners) { try { fn({ reason: why, surface }) } catch { /* 忽略单个订阅者 */ } }
    // 订阅者是同步回调：这里就能知道有没有界面认领。没人认领就别挂起调用方。
    if (!_authGate?.claimed) {
      _authGate = null
      reject(new Error('当前界面无法显示登录入口（请打开市场页或输入框「＋」后再试）'))
    }
  })
}

const API_TIMEOUT_MS = 30000
async function api(path, options) {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
  const timer = controller ? setTimeout(() => controller.abort(), API_TIMEOUT_MS) : null
  let response
  try {
    response = await fetch(API + path, { ...options, signal: controller?.signal })
  } catch (error) {
    if (controller?.signal?.aborted) throw new Error('请求超时（30s）')
    throw error
  } finally {
    if (timer) clearTimeout(timer)
  }
  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(body.error || `HTTP ${response.status}`)
    error.body = body
    error.status = response.status
    throw error
  }
  return body
}

const post = (path, payload) => api(path, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(payload),
})

const REGISTRY = 'https://acc-1258344699.cos.accelerate.myqcloud.com/workbuddy/expert-marketplace'

/** Normalise any catalogue row (official registry / market API / mirror) to one shape. */
function toEntry(row, kind) {
  const name = row.agent_name ?? row.name ?? row.id ?? row.skill_id ?? ''
  let icon = row.icon || row.avatar || ''
  if (icon.startsWith('/')) icon = REGISTRY + icon
  return {
    kind,
    name,
    displayName: row.display_name_zh || row.display_name_en || row.displayName || name,
    subtitle: row.profession_zh || row.profession_en || row.subtitle || '',
    description: row.description_zh || row.description_en || row.description || '',
    icon,
    tags: (row.tags ?? []).map(t => (typeof t === 'string' ? t : t.zh || t.en)).filter(Boolean).slice(0, 4),
    quickPrompts: (row.quickPrompts ?? []).map(q => (typeof q === 'string' ? q : q.zh || q.en)).filter(Boolean),
    useCount: row.use_count || row.useCount || row.usage || '',
    updatedAt: row.updated_at || row.updatedAt || row.created_at || '',
    official: true,
  }
}

export const hub = {
  api,
  post,
  toEntry,

  /** Catalogue for one kind, official sources first. */
  async list(kind, { query = '', category = '', page = 1, pageSize = 60 } = {}) {
    const q = encodeURIComponent(query)
    const c = encodeURIComponent(category || '')
    if (kind === 'connector') {
      const r = await api(`/market-list?kind=connector&pageSize=${pageSize}&q=${q}`)
      // 宿主在「已登录但官方接口失败」时用镜像目录兜底；镜像行不是官方条目，
      // 必须如实标注（否则安装时会按官方来源去下载）。
      const rows = (r.rows ?? []).map(x => ({ ...toEntry(x, 'connector'), official: r.source !== 'mirror', isConnected: x.isConnected, mcp: x.mcp, authType: x.authType }))
      // 官方为空 + 有原因（未登录 / 官方不可用）→ 如实抛错，让界面显示原因而不是「暂无连接器」。
      // mirrorFallback 打开时宿主会回镜像内容（source=mirror），这里不抛。
      if (rows.length === 0 && r.error) throw new Error(String(r.error))
      return { rows, total: r.total ?? rows.length, hasMore: false, source: r.source }
    }
    // 专家以官方注册表为准：只有注册表条目带人设文件、可安装可召唤；
    // 市场 API 的专家只有列表数据（无 persona），装了也召唤不了，故只在其后兜底。
    if (kind === 'expert') {
      try {
        const e = await api(`/official-experts?limit=500&q=${q}&category=${c}`)
        const rows = (e.rows ?? []).map(x => toEntry(x, kind))
        if (rows.length) {
          const start = (page - 1) * pageSize
          return {
            rows: rows.slice(start, start + pageSize),
            total: e.total ?? rows.length,
            hasMore: start + pageSize < (e.total ?? rows.length),
            source: 'official-registry',
          }
        }
        // 带关键字却没命中 → 必须返回空，绝不能落回市场的全量列表
        // （否则用户看到「搜不到却显示全部」）。空关键字才允许继续兜底。
        if (String(query).trim() !== '') {
          return { rows: [], total: 0, hasMore: false, source: 'official-registry' }
        }
      } catch { /* fall through to the market */ }
    }
    let listError = ''
    try {
      const r = await api(`/market-list?kind=${kind}&page=${page}&pageSize=${pageSize}&q=${q}&category=${c}`)
      if (r.source === 'official') {
        const rows = (r.rows ?? []).map(x => toEntry(x, kind))
        const total = r.total ?? rows.length
        // 官方为空且宿主给了原因（未登录 / 官方目录不可用）→ 如实抛错，不落回镜像。
        if (rows.length === 0 && r.error) throw new Error(String(r.error))
        return { rows, total, hasMore: page * pageSize < total, source: 'official' }
      }
    } catch (error) { listError = String(error?.message || error) }
    // 官方失败 → 镜像兜底：**默认关闭**（宿主 mirrorFallback=false）。
    // 关闭时宿主对 /catalog 返回 503 + 可读原因，这里如实抛出，绝不静默换成镜像内容。
    try {
      await api('/catalog')
      const m = await api(`/search?q=${q}&kind=${kind}s&limit=${pageSize}`)
      const rows = (m.hits ?? []).map(x => ({ ...toEntry(x, kind), official: false }))
      return { rows, total: m.total ?? rows.length, hasMore: false, source: 'mirror' }
    } catch (error) {
      throw new Error(listError || String(error?.message || error) || '官方目录不可用')
    }
  },

  /** Category chips for one kind (官方来源). */
  async categories(kind) {
    try {
      if (kind === 'expert') {
        const r = await api('/official-expert-categories')
        return (r.items ?? []).map(c => ({ id: c.id, label: c.label || c.name, count: c.count }))
      }
      const r = await api(`/market-categories?kind=${kind}`)
      return (r.items ?? []).map(c => ({ id: c.id, label: c.label || c.name, count: c.count }))
    } catch { return [] }
  },

  installed: () => api('/installed').then(r => r.installed || {}),
  /**
   * 检查更新（只读路由；宿主侧对结果有 60s 短缓存）。
   * @param {{refresh?: boolean}} [opts] refresh=true → `?refresh=1` 强制重算
   *   （安装/更新成功后用它拿到最新判定；普通点「检查更新」走缓存，便宜）。
   */
  updates: (opts = {}) => api(`/updates${opts?.refresh ? '?refresh=1' : ''}`),
  localSkills: () => api('/local-skills').then(r => r.rows || []).catch(() => []),
  mounted: sessionId => sessionId
    ? api(`/mounted?sessionId=${encodeURIComponent(sessionId)}`).then(r => r.keys || [])
    : Promise.resolve([]),
  install: (kind, name, source) => post('/install', { kind, name, source }).then(r => { _emitChange(); return r }),
  uninstall: (kind, name) => post('/uninstall', { kind, name }).then(r => { _emitChange(); return r }),
  mount: (sessionId, kind, name) => post('/mount', { sessionId, kind, name }).then(r => { _emitChange(); return r }),
  unmount: (sessionId, kind, name) => post('/unmount', { sessionId, kind, name }).then(r => { _emitChange(); return r }),
  summon: (name, task, sessionId) => post('/summon', { name, task, sessionId }).then(r => { _emitChange(); return r }),
  // 方案 B：把专家做成真正的 agent preset，并在新会话里选中它（真接管）。
  expertPresetEnsure: name => post('/expert-preset-ensure', { name }),
  activeSession: () => api('/active-session').catch(() => ({ sessionId: '' })),
  boundConnectors: () => api('/connectors/bound').then(r => r.items || []).catch(() => []),
  connectorAuthStart: name => post('/connectors/auth-start', { name }),
  connectorUnbind: name => post('/connectors/unbind', { name }),
  connectorInstall: name => post('/connectors/install', { name }),
  connectorNativeRow: name => api(`/connectors/native-row?name=${encodeURIComponent(name)}`),
  connectorTools: name => api(`/connectors/tools?name=${encodeURIComponent(name)}`),
  connectorOauthStatus: name => api(`/connectors/oauth-status?name=${encodeURIComponent(name)}`),
  enableConnector: name => post('/connectors/enable', { name }).then(r => { _emitChange(); return r }),
  disableConnector: name => post('/connectors/disable', { name }).then(r => { _emitChange(); return r }),

  // 本地 MCP 服务器（用户手工注册的 loopback 服务）。token 只在 POST 请求体里
  // 出现一次（交给宿主写凭据库），前端 state 不留存、不回显。
  localMcpList: () => api('/mcp/local').catch(error => ({
    ok: false, guarded: false, servers: [], error: String(error?.message || error),
  })),
  localMcpSave: (name, url, token, opts = {}) => post('/mcp/local', {
    name, url,
    // 空 token 不发送（语义 = 沿用已存凭据；宿主只对非空 token 才写凭据库）
    ...(token ? { token } : {}),
    ...(opts.tokenRef ? { tokenRef: opts.tokenRef } : {}),
    ...(opts.note ? { note: opts.note } : {}),
  }),
  localMcpEnable: name => post('/mcp/local/enable', { name }),
  localMcpDisable: name => post('/mcp/local/disable', { name }),
  localMcpRemove: name => post('/mcp/local/remove', { name }).then(r => { _emitChange(); return r }),

  // 宿主侧 MCP 总清单：本插件托管的本地 MCP + 官方连接器建立的 MCP 行 + **DSH 自己
  // 加载的**（其它插件 / 配置行，如 openviking 的 mcp-proxy）。picker 的「本机 MCP」用它。
  hostMcpList: () => api('/mcp/host').catch(error => ({
    ok: false, guarded: false, servers: [], error: String(error?.message || error),
  })),

  auth: () => api('/wb-auth'),
  authStart: () => post('/wb-auth/start', {}),
  authPoll: () => post('/wb-auth/poll', {}),
  authLogout: () => post('/wb-auth/logout', {}),
}

/**
 * 方案 B：召唤专家 = 新建一个会话，并把该专家设成这个会话的 agent preset
 * （真接管，与官方「点召唤→新会话→该专家成为会话 agent」一致）。当前会话
 * 完全不动：不挂载、不注入、不 chip。
 * @returns {Promise<{ok:true, presetId, sessionId} | {ok:false, error}>}
 */
export async function summonExpertInNewSession(entry) {
  try {
    // 1) 确保已安装（人设文件是注入的前置）
    const key = `expert/${entry.name}`
    let already = false
    try { already = Boolean((await hub.installed())[key]) } catch { /* 读不到则走安装 */ }
    if (!already) {
      try {
        await hub.install('expert', entry.name, entry.official ? 'official' : undefined)
      } catch (error) {
        const fresh = await hub.installed().catch(() => ({}))
        if (!fresh[key]) return { ok: false, error: `安装专家失败：${String(error?.message || error)}` }
      }
    }
    // 2) 记为「待生效专家」—— 任意工作区的新会话挂载时都会带上它。
    //    单个槽位：重复召唤会替换上一次（一个会话只挂一个专家），这里把被替换的告诉调用方。
    const replaced = peekPendingExpert()?.name || ''
    setPendingExpert(entry)
    markExpertRecent(entry)   // 记录「最近加载过的专家」，供 picker 排序
    // 3) 走 DSH 官方新建会话流程（工作区由 DSH 自己决定；定位不到就停在选择工作区界面）
    const started = startNewSession()
    if (!started) {
      clearPendingExpert()
      return { ok: false, error: '无法进入新建会话流程（uiWorkspace 不可用）' }
    }
    // 说明：不再做「延迟兜底」。曾经加过 1500ms 后读 composerSession() 补挂的兜底，
    // 但用户停在市场页时 composer 是卸载的、该值仍是上一个对话的会话 id —— 兜底会把
    // 专家挂到旧会话并把待生效消费掉，导致真正的新会话反而没有专家。主链路
    // （新会话的 composer 一挂载就 takePendingExpert）已覆盖所有正常场景。
    return { ok: true, pending: true, replaced }
  } catch (error) {
    clearPendingExpert()
    return { ok: false, error: String(error?.message || error) }
  }
}


