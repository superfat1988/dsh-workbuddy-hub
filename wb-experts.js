// Expert installation from the official registry (expert_center.json): the
// same catalogue the official client shows, with persona Markdown and avatars
// fetched from the same source.
import { writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs'
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

/** Install one official expert into the store: persona MD + plugin.json.
 *
 * 失败时不留半成品：`experts/<name>/` 目录**只在这一调用里新建**的情况下才会被清掉
 * （已存在的目录保持原样 —— 重装失败不该毁掉上一份可用副本）。
 * 真机残骸：官方缺人设文件时（persona HTTP 404）此前会在 store 里留下一个**空目录**
 * `experts/personal-knowledge-architect/`，注册表里却没有记录。
 *
 * 「官方档案缺口」用 `error.assetMissing` 标出来：注册表列了这位专家、CDN 上没有他的
 * 人设文件（404）。这跟「官方服务不可用」不同，上层据此按条目回落镜像仓。
 */
export async function installExpert(entry, destDir, prefix) {
  const d = await registry()
  const raw = (d.experts ?? []).find(e => (e.agentName || e.id) === entry)
    ?? (d.experts ?? []).find(e => e.id === entry)
  if (!raw) {
    const error = new Error(`expert not in official registry: ${entry}`)
    error.assetMissing = true
    throw error
  }
  const agentName = raw.agentName || raw.id
  const dest = join(destDir, agentName)
  const existed = existsSync(dest)
  try {
    mkdirSync(dest, { recursive: true })

    // persona markdown — the summon payload, from the official source
    const mdRes = await fetch(`${REGISTRY}${raw.promptFile}`)
    if (!mdRes.ok) {
      const error = new Error(`persona HTTP ${mdRes.status}`)
      // 404 = 官方档案里就没有这份文件（缺口）；5xx/超时才是「官方不可用」。
      error.assetMissing = mdRes.status === 404
      // 官方注册表里那份**标签**（名字/简介/标签/头像）是可用的：回落到镜像内容时
      // 用它做界面展示，但绝不冒充官方内容（provenance 仍然留空）。
      error.officialRow = {
        name: agentName,
        displayName: zh(raw.displayName) || agentName,
        description: zh(raw.description),
        tags: (raw.tags ?? []).map(t => t.zh ?? t.en).filter(Boolean).slice(0, 3),
        icon: raw.avatar ? `${REGISTRY}${raw.avatar}` : '',
      }
      throw error
    }
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
      // 官方原始条目的更新时间：安装时记进 officialMeta，供「检查更新」做纯官方元数据比对
      updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : '',
      displayName: zh(raw.displayName),
      // 官方头像 URL：装完就记下来，picker/市场卡片直接用官方 icon，不再退化成字母块
      icon: raw.avatar ? `${REGISTRY}${raw.avatar}` : '',
      avatar: raw.avatar ? `${REGISTRY}${raw.avatar}` : '',
      description: zh(raw.description),
      tags: (raw.tags ?? []).map(t => t.zh ?? t.en).slice(0, 3),
      files: 3, bytes: md.length,
      flags: [], source: 'official-registry',
    }
  } catch (error) {
    if (!existed) { try { rmSync(dest, { recursive: true, force: true }) } catch { /* 清理失败不影响原始错误 */ } }
    throw error
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
