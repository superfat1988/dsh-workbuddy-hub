const API = '/workbuddy-hub'

async function api(path, options) {
  const response = await fetch(API + path, options)
  const body = await response.json().catch(() => ({}))
  if (!response.ok) { const e = new Error(body.error || `HTTP ${response.status}`); e.body = body; throw e }
  return body
}

// ---- official market data (web-first) ----
// Same catalogue and copy the official UI shows; falls back to the mirror
// search when the official proxy is unauthorised or unreachable.
export const hub = {
  api,
  post: (path, payload) => api(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }),
  async marketList(kind, { page = 1, pageSize = 60, query = '', categoryId } = {}) {
    const payload = { page, page_size: pageSize }
    if (query) payload.keyword = query
    if (categoryId && categoryId !== 'all') payload.category_id = categoryId
    const body = await hub.post(`/market/${kind}/list`, payload)
    if (body?.code !== 0) throw new Error(body?.msg || 'official market error')
    const data = body.data ?? {}
    const rows = data.experts ?? data.skills ?? []
    return rows.map(r => ({
      kind,
      id: r.expert_id ?? r.skill_id,
      name: r.agent_name ?? r.name,
      displayName: r.display_name_zh ?? r.display_name_en ?? r.display_name ?? r.name,
      subtitle: r.profession_zh ?? r.profession_en ?? '',
      description: r.description_zh ?? r.description ?? '',
      icon: r.icon,
      tags: (r.tags ?? []).map(t => t.name_zh ?? t.name ?? t).filter(Boolean),
      usage: r.usage_count ?? r.install_count,
      raw: r,
    }))
  },
  async categories(kind) {
    const body = await hub.api(`/market/categories?type=${kind}`).catch(() => null)
    if (body?.code !== 0) return []
    return (body.data?.items ?? []).map(c => ({ id: c.id, label: c.name_zh ?? c.name_en, count: c.item_count }))
  },
  // legacy mirror surface (still the package source for installs)
  search: (q, kind) => api(`/search?q=${encodeURIComponent(q)}&kind=${kind}s&limit=60`).then(r => r.hits || []),
  installed: () => api('/installed').then(r => r.installed || {}),
}
