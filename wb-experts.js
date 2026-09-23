// Expert installation from the official registry (expert_center.json): the
// same catalogue the official client shows, with persona Markdown and avatars
// fetched from the same source.
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'

const REGISTRY = 'https://acc-1258344699.cos.accelerate.myqcloud.com/workbuddy/expert-marketplace'
let registryCache = null

export async function registry() {
  if (registryCache) return registryCache
  const res = await fetch(`${REGISTRY}/expert_center.json`)
  if (!res.ok) throw new Error(`registry HTTP ${res.status}`)
  registryCache = await res.json()
  return registryCache
}

/** Normalised expert rows for the UI. */
export async function listExperts({ query = '', categoryId, limit = 60 } = {}) {
  const d = await registry()
  const q = query.trim().toLowerCase()
  let rows = d.experts ?? []
  if (categoryId && categoryId !== 'all') rows = rows.filter(e => e.categoryId === categoryId)
  if (q) rows = rows.filter(e =>
    JSON.stringify([e.displayName, e.profession, e.description, e.tags, e.id]).toLowerCase().includes(q))
  // Same field names as the market API rows, so one browser mapping handles both.
  const shaped = rows.slice(0, limit).map(normalise).map(e => ({
    ...e,
    agent_name: e.name,
    display_name_zh: e.displayName,
    profession_zh: e.subtitle,
    description_zh: e.description,
  }))
  return { total: rows.length, rows: shaped }
}

export async function categories() {
  const d = await registry()
  return (d.categories ?? []).map(c => ({ id: c.id, label: c.name?.zh ?? c.name?.en, count: c.count }))
}

function normalise(e) {
  return {
    kind: 'expert',
    name: e.agentName || e.id,
    displayName: zh(e.displayName) || e.id,
    subtitle: zh(e.profession) || '',
    description: zh(e.description) || '',
    tags: (e.tags ?? []).map(t => t.zh ?? t.en ?? t).slice(0, 3),
    avatar: e.avatar ? `${REGISTRY}${e.avatar}` : '',
    icon: e.avatar ? `${REGISTRY}${e.avatar}` : '',
    quickPrompts: (e.quickPrompts ?? []).map(q => q.zh ?? q.en).filter(Boolean),
    categoryId: e.categoryId,
    expertType: e.expertType,
  }
}

function zh(v) {
  if (v == null) return ''
  if (typeof v === 'string') {
    try { const p = JSON.parse(v); return p.zh ?? p.en ?? v } catch { return v }
  }
  return v.zh ?? v.en ?? ''
}

/** Install one official expert into the store: persona MD + plugin.json. */
export async function installExpert(entry, destDir, prefix) {
  const d = await registry()
  const raw = (d.experts ?? []).find(e => (e.agentName || e.id) === entry)
    ?? (d.experts ?? []).find(e => e.id === entry)
  if (!raw) throw new Error(`expert not in official registry: ${entry}`)
  const agentName = raw.agentName || raw.id
  const dest = join(destDir, agentName)
  mkdirSync(dest, { recursive: true })

  // persona markdown — the summon payload, from the official source
  const mdRes = await fetch(`${REGISTRY}${raw.promptFile}`)
  if (!mdRes.ok) throw new Error(`persona HTTP ${mdRes.status}`)
  const md = await mdRes.text()
  if (md.length > 256 * 1024) throw new Error('persona too large')
  if (md.includes('\u0000')) throw new Error('persona contains NUL')
  const agentsDir = join(dest, 'agents')
  mkdirSync(agentsDir, { recursive: true })
  writeFileSync(join(agentsDir, `${agentName}.md`), md)

  // minimal plugin manifest so the existing persona parser finds agentName
  const pluginDir = join(dest, '.codebuddy-plugin')
  mkdirSync(pluginDir, { recursive: true })
  writeFileSync(join(pluginDir, 'plugin.json'), JSON.stringify({
    name: agentName,
    displayName: zh(raw.displayName),
    agentName,
    expertType: raw.expertType ?? 'agent',
    version: '1.0.0',
    source: 'official-registry',
  }, null, 2))

  // avatar (best effort)
  try {
    const av = await fetch(`${REGISTRY}${raw.avatar}`)
    if (av.ok) {
      mkdirSync(join(dest, 'icons'), { recursive: true })
      writeFileSync(join(dest, 'icons', 'avatar.png'), Buffer.from(await av.arrayBuffer()))
    }
  } catch { /* optional */ }

  return {
    kind: 'expert', name: agentName, dest,
    displayName: zh(raw.displayName),
    // 官方头像 URL：装完就记下来，picker/市场卡片直接用官方 icon，不再退化成字母块
    icon: raw.avatar ? `${REGISTRY}${raw.avatar}` : '',
    avatar: raw.avatar ? `${REGISTRY}${raw.avatar}` : '',
    description: zh(raw.description),
    tags: (raw.tags ?? []).map(t => t.zh ?? t.en).slice(0, 3),
    files: 3, bytes: md.length,
    flags: [], source: 'official-registry',
  }
}

/** Install an official skill package (zip with <name>/SKILL.md) into the store. */
export async function installSkillPackage(pkg) {
  // pkg: { name, displayName, description, downloadUrl }
  const res = await fetch(pkg.downloadUrl)
  if (!res.ok) throw new Error(`skill package HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length > 8 * 1024 * 1024) throw new Error('skill package too large')
  if (!(buf[0] === 0x50 && buf[1] === 0x4b)) throw new Error('skill package is not a zip')
  return { buf, size: buf.length }
}
