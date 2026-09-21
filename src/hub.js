// Data adapter: the official components talk only to these helpers, which map
// onto the hub routes. Official sources first, mirror as fallback.
const API = '/workbuddy-hub'

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
    official: true,
  }
}

export const hub = {
  api,
  post,
  toEntry,

  /** Catalogue for one kind, official sources first. */
  async list(kind, { query = '', limit = 60 } = {}) {
    const q = encodeURIComponent(query)
    try {
      if (kind === 'expert') {
        const r = await api(`/official-experts?limit=${limit}&q=${q}`)
        const rows = (r.rows ?? []).map(x => toEntry(x, kind))
        if (rows.length) return rows
        if (r.total === 0 && query === '') return []
      }
      const r = await api(`/market-list?kind=${kind}&pageSize=${limit}&q=${q}`)
      if (r.source === 'official') return (r.rows ?? []).map(x => toEntry(x, kind))
    } catch { /* fall through to the mirror */ }
    await api('/catalog')
    const r = await api(`/search?q=${q}&kind=${kind}s&limit=${limit}`)
    return (r.hits ?? []).map(x => ({ ...toEntry(x, kind), official: false }))
  },

  installed: () => api('/installed').then(r => r.installed || {}),
  mounted: sessionId => sessionId
    ? api(`/mounted?sessionId=${encodeURIComponent(sessionId)}`).then(r => r.keys || [])
    : Promise.resolve([]),
  install: (kind, name, source) => post('/install', { kind, name, source }),
  uninstall: (kind, name) => post('/uninstall', { kind, name }),
  mount: (sessionId, kind, name) => post('/mount', { sessionId, kind, name }),
  unmount: (sessionId, kind, name) => post('/unmount', { sessionId, kind, name }),
  enableConnector: name => post('/connectors/enable', { name }),
  disableConnector: name => post('/connectors/disable', { name }),

  auth: () => api('/wb-auth'),
  authStart: () => post('/wb-auth/start', {}),
  authPoll: () => post('/wb-auth/poll', {}),
  authLogout: () => post('/wb-auth/logout', {}),
}
