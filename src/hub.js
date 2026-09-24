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
let _openWorkspace = null
export function setOpenWorkspace(fn) { _openWorkspace = fn }
export function openWorkspaceIn(workspaceId, beforeOpen) {
  if (typeof _openWorkspace !== 'function' || !workspaceId) return false
  try { _openWorkspace(workspaceId, beforeOpen); return true } catch (error) {
    console.warn('[wbh] openWorkspace failed:', String(error?.message || error)); return false
  }
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
export function addSelection(entry, sessionId) {
  const key = sessionId || '_unbound'
  const list = _selectedBySession.get(key) || []
  const itemKey = `${entry.kind}/${entry.name}`
  if (list.some(x => x.key === itemKey)) return
  _selectedBySession.set(key, [...list, { key: itemKey, kind: entry.kind, name: entry.name, displayName: entry.displayName || entry.name, icon: entry.icon || '' }])
  _emitSelection()
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
      const rows = (r.rows ?? []).map(x => ({ ...toEntry(x, 'connector'), isConnected: x.isConnected, mcp: x.mcp, authType: x.authType }))
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
      } catch { /* fall through to the market */ }
    }
    try {
      const r = await api(`/market-list?kind=${kind}&page=${page}&pageSize=${pageSize}&q=${q}&category=${c}`)
      if (r.source === 'official') {
        const rows = (r.rows ?? []).map(x => toEntry(x, kind))
        const total = r.total ?? rows.length
        return { rows, total, hasMore: page * pageSize < total, source: 'official' }
      }
    } catch { /* fall through */ }
    await api('/catalog')
    const m = await api(`/search?q=${q}&kind=${kind}s&limit=${pageSize}`)
    const rows = (m.hits ?? []).map(x => ({ ...toEntry(x, kind), official: false }))
    return { rows, total: m.total ?? rows.length, hasMore: false, source: 'mirror' }
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
export async function summonExpertInNewSession(entry, nearSessionId) {
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
    // 2) 解析「当前会话所属工作区」（宿主侧解析，不建会话）
    let workspaceId = ''
    if (nearSessionId) {
      try {
        const r = await api(`/expert-resolve-workspace?nearSessionId=${encodeURIComponent(nearSessionId)}`)
        workspaceId = r?.workspaceId || ''
      } catch (error) {
        console.warn('[wbh] resolve workspace failed:', String(error?.message || error))
      }
    }
    if (!workspaceId) {
      return { ok: false, error: `无法确定新会话的工作区（当前会话 ${nearSessionId || '未知'}）。请先在工作区里打开一个会话再召唤。` }
    }
    // 3) 用 DSH 官方 openWorkspace 建会话 —— 走客户端 sessions.create，客户端会话列表
    //    即时含新会话（宿主 sessionController.create 不会同步给客户端，会导致跳转落空）。
    //    beforeOpen 在主视图切换前同步回调，拿到 sessionId 后立刻挂专家 + 显示 chip。
    const sessionId = await new Promise(resolve => {
      let settled = false
      const done = sid => { if (!settled) { settled = true; resolve(sid || '') } }
      const started = openWorkspaceIn(workspaceId, sid => {
        addSelection(entry, sid)
        void hub.mount(sid, 'expert', entry.name)
        console.info('[wbh] summonExpert: session', sid, 'expert', entry.name)
        done(sid)
      })
      if (!started) done('')
      // 兜底：openWorkspace 若因导航被取代而未回调，8s 后返回失败而不是永久挂起
      try { setTimeout(() => done(''), 8000) } catch { /* 无定时器环境 */ }
    })
    if (!sessionId) return { ok: false, error: '新会话未创建成功（openWorkspace 未回调）' }
    return { ok: true, sessionId }
  } catch (error) {
    return { ok: false, error: String(error?.message || error) }
  }
}


