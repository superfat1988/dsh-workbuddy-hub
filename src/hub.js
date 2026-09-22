// Data adapter: the official components talk only to these helpers, which map
// onto the hub routes. Official sources first, mirror as fallback.
const API = '/workbuddy-hub'

// Tiny module-level event bus: the composer picker (input.left) and the
// attached rail (composer.dock) are separate slot instances, so a mount /
// unmount made by one must notify the other to re-read.
// 已选条目（专家/技能/连接器）：composer 的 chip 直接读这份客户端状态，
// 因此「选中即显示、悬停删除、取消即移除」不依赖槽组件能否拿到 sessionId。
let _selected = []
const _selListeners = new Set()
export function selectedItems() { return _selected }
export function onSelectionChange(fn) { _selListeners.add(fn); return () => { _selListeners.delete(fn) } }
const _emitSelection = () => { for (const fn of _selListeners) { try { fn() } catch {} } }
export function addSelection(entry) {
  const key = `${entry.kind}/${entry.name}`
  if (_selected.some(x => x.key === key)) return
  _selected = [..._selected, { key, kind: entry.kind, name: entry.name, displayName: entry.displayName || entry.name, icon: entry.icon || '' }]
  _emitSelection()
}
export function removeSelection(kind, name) {
  const before = _selected.length
  _selected = _selected.filter(x => !(x.kind === kind && x.name === name))
  if (_selected.length !== before) _emitSelection()
}

const _changeListeners = new Set()
export const onCatalogChange = fn => { _changeListeners.add(fn); return () => { _changeListeners.delete(fn) } }
const _emitChange = () => { for (const fn of _changeListeners) { try { fn() } catch {} } }

async function api(path, options) {
  const response = await fetch(API + path, options)
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
    try {
      const r = await api(`/market-list?kind=${kind}&page=${page}&pageSize=${pageSize}&q=${q}&category=${c}`)
      if (r.source === 'official') {
        const rows = (r.rows ?? []).map(x => toEntry(x, kind))
        const total = r.total ?? rows.length
        return { rows, total, hasMore: page * pageSize < total, source: 'official' }
      }
    } catch { /* fall through */ }
    // Expert registry (no paging) keeps the page usable without an official login.
    if (kind === 'expert' && !query && !category && page === 1) {
      try {
        const e = await api(`/official-experts?limit=${pageSize}&q=${q}&category=${c}`)
        const rows = (e.rows ?? []).map(x => toEntry(x, kind))
        if (rows.length) return { rows, total: e.total ?? rows.length, hasMore: false, source: 'official-registry' }
      } catch { /* fall through */ }
    }
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
  activeSession: () => api('/active-session').catch(() => ({ sessionId: '' })),
  enableConnector: name => post('/connectors/enable', { name }).then(r => { _emitChange(); return r }),
  disableConnector: name => post('/connectors/disable', { name }).then(r => { _emitChange(); return r }),

  auth: () => api('/wb-auth'),
  authStart: () => post('/wb-auth/start', {}),
  authPoll: () => post('/wb-auth/poll', {}),
  authLogout: () => post('/wb-auth/logout', {}),
}
