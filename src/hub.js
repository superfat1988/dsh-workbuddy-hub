const API = '/workbuddy-hub'
async function api(path, options) {
  const response = await fetch(API + path, options)
  const body = await response.json().catch(() => ({}))
  if (!response.ok) { const e = new Error(body.error || `HTTP ${response.status}`); e.body = body; throw e }
  return body
}
export const hub = {
  api,
  post: (path, payload) => api(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }),
  search: (q, kind) => api(`/search?q=${encodeURIComponent(q)}&kind=${kind}s&limit=60`).then(r => r.hits || []),
  installed: () => api('/installed').then(r => r.installed || {}),
}
