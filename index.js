/**
 * dsh-workbuddy-hub — Host half.
 *
 * Marketplace hub for DSH:
 *  - catalog: mirror repo CATALOG.md + git tree → entries carrying Chinese
 *    name, description, prerequisites, kind and icon availability;
 *  - install: on-demand download of ONE entry (binary-safe), static safety
 *    scan, landing under ~/workbuddyskills, skill symlink into ~/.dsh/skills;
 *  - mount: per-session attachment state (专家/技能/连接器) driving the rail
 *    below the composer; mounting is deliberately separate from installing;
 *  - icons: lazy proxy of the mirror's avatar/icon bytes (cached on disk);
 *  - trust: every route asks ctx.connection for a rejection first, mirroring
 *    the first-party open-in-app host (no unauthenticated surface).
 *
 * MCP activation lives in ./mcp-manager.js and is mounted explicitly by the
 * user (install ≠ enable), so a failed connector never leaves a stale child.
 */
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import {
  existsSync, mkdirSync, readFileSync, rmSync, writeFileSync,
  symlinkSync, unlinkSync, lstatSync, statSync,
} from 'node:fs'

export const name = 'workbuddy-hub'
export const inject = ['webServer', 'connection']

const PREFIX = '/workbuddy-hub'
const GH_RAW = 'https://raw.githubusercontent.com'
const GH_API = 'https://api.github.com'
const MAX_ICON_BYTES = 4 * 1024 * 1024

/* ------------------------------------------------------------------ *
 * Paths & registry
 * ------------------------------------------------------------------ */

function expandHome(p) {
  if (!p) return p
  if (p === '~') return homedir()
  if (p.startsWith('~/')) return join(homedir(), p.slice(2))
  return p
}

export function storePaths(config) {
  const root = resolve(expandHome(config.storeRoot || '~/workbuddyskills'))
  return {
    root,
    store: join(root, '.store'),
    skills: join(root, 'skills'),
    experts: join(root, 'experts'),
    connectors: join(root, 'connectors'),
    meta: join(root, '.meta'),
    icons: join(root, '.meta', 'icons'),
    registry: join(root, '.meta', 'registry.json'),
    mounts: join(root, '.meta', 'mounts.json'),
    catalogCache: join(root, '.meta', 'catalog-cache.json'),
  }
}

export function loadJson(path, fallback) {
  try {
    const parsed = JSON.parse(readFileSync(path, 'utf8'))
    return parsed && typeof parsed === 'object' ? parsed : fallback
  } catch {
    return fallback
  }
}

export function saveJson(path, value) {
  mkdirSync(path.slice(0, path.lastIndexOf('/')), { recursive: true })
  writeFileSync(path, JSON.stringify(value, null, 2))
}

/* ------------------------------------------------------------------ *
 * GitHub fetch (text + binary)
 * ------------------------------------------------------------------ */

export async function ghText(repo, branch, path) {
  const res = await fetch(`${GH_RAW}/${repo}/${branch}/${path}`)
  if (!res.ok) throw new Error(`raw ${res.status} for ${path}`)
  return res.text()
}

export async function ghBytes(repo, branch, path) {
  const res = await fetch(`${GH_RAW}/${repo}/${branch}/${path}`)
  if (!res.ok) throw new Error(`raw ${res.status} for ${path}`)
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.byteLength > MAX_ICON_BYTES) throw new Error(`blob too large: ${path}`)
  return buf
}

export async function ghTree(repo, branch) {
  const res = await fetch(`${GH_API}/repos/${repo}/git/trees/${branch}?recursive=1`)
  if (!res.ok) throw new Error(`tree api ${res.status}`)
  const data = await res.json()
  return data.tree.filter(e => e.type === 'blob')
}

/* ------------------------------------------------------------------ *
 * Catalog metadata — Chinese name / description / prerequisites
 * ------------------------------------------------------------------ */

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|ico)$/i

/** Text-ish extensions we may store as UTF-8; everything else is binary. */
const TEXT_EXT = /\.(md|txt|json|js|mjs|cjs|ts|py|sh|ps1|cmd|bat|yml|yaml|toml|ini|cfg|conf|csv|xml|html|htm|css|svg|tpl|license)$/i

/** Parse CATALOG.md rows into {dir, name, description, prereq}.
 *
 *  Two row shapes exist in the mirror's catalog:
 *    目录 | 名称 | 描述 | 前置      (experts, skills)
 *    目录 | 描述 | 前置            (connectors — no name column)
 *  The name column is detected by its markdown link, so both parse correctly.
 */
export function parseCatalog(md) {
  const rows = []
  let section = ''
  for (const line of md.split('\n')) {
    const heading = /^#{2,3}\s+(.+?)\s*$/.exec(line)
    if (heading) { section = heading[1]; continue }
    if (!line.startsWith('|')) continue
    const cells = line.split('|').map(c => c.trim())
    const items = cells.filter((c, i) => !(i === 0 || i === cells.length - 1) || c !== '')
    const body = cells.slice(1, cells.length - 1).filter((c, i, arr) => !(c === '' && (i === 0 || i === arr.length - 1)))
    if (body.length < 2) continue
    const dirCell = body[0]
    const dir = /\[`([^`]+)`\]/.exec(dirCell)?.[1]
    if (!dir) continue
    const hasNameColumn = body.length >= 4 && body[1].startsWith('[')
    const nameCell = hasNameColumn ? body[1] : ''
    const name = hasNameColumn
      ? (/\[([^\]]+)\]/.exec(nameCell)?.[1] ?? nameCell).replace(/`/g, '').trim()
      : ''
    const description = (hasNameColumn ? body[2] : body[1] ?? '').replace(/\s+/g, ' ').trim()
    const prereq = (hasNameColumn ? body[3] : body[2] ?? '').replace(/\s+/g, ' ').trim()
    rows.push({ dir, name, description, prereq, section })
  }
  return rows
}

/** Merge catalog rows into tree-derived index entries (adds zh name/desc). */
export function mergeCatalog(index, catalog) {
  // CATALOG.md links are kind-relative ('tc-chengxin', '../x'), while tree
  // entries are kind-prefixed ('connectors/tc-chengxin'). Match on the leaf.
  const byLeaf = new Map()
  for (const row of catalog) {
    const leaf = String(row.dir || '').replace(/^\.\//, '').replace(/\/$/, '').split('/').pop()
    if (leaf && !byLeaf.has(leaf)) byLeaf.set(leaf, row)
  }
  let matched = 0
  for (const list of Object.values(index)) {
    for (const entry of list) {
      const row = byLeaf.get(entry.name)
      if (!row) continue
      matched += 1
      entry.displayName = row.name || entry.name
      entry.description = row.description || ''
      entry.prereq = row.prereq || ''
      entry.section = row.section || ''
    }
  }
  index.__matched = matched
  index.__catalogRows = catalog.length
  return index
}

/** Tree-derived structural index (files/bytes/capabilities/icon). */
export function buildIndex(blobs) {
  const kinds = { experts: [], skills: [], connectors: [] }
  const seen = new Map()
  for (const b of blobs) {
    const top = b.path.split('/')[0]
    if (!kinds[top]) continue
    const parts = b.path.split('/')
    if (parts.length < 2) continue
    const entryName = parts[1]
    const key = `${top}/${entryName}`
    let entry = seen.get(key)
    if (!entry) {
      entry = {
        kind: top.slice(0, -1), name: entryName, dir: key,
        files: 0, bytes: 0, hasSkillMd: false, hasPluginJson: false,
        hasMcpJson: false, hasCliJson: false, avatars: 0, iconPath: '',
      }
      seen.set(key, entry)
      kinds[top].push(entry)
    }
    entry.files += 1
    entry.bytes += b.size || 0
    const base = parts[parts.length - 1]
    if (base === 'SKILL.md') entry.hasSkillMd = true
    if (base === 'plugin.json' && b.path.includes('.codebuddy-plugin')) entry.hasPluginJson = true
    if (base === 'mcp.json' && parts.length === 3) entry.hasMcpJson = true
    if (base === 'cli.json' && parts.length === 3) entry.hasCliJson = true
    if (parts.length >= 4 && parts[parts.length - 2] === 'avatars' && IMAGE_EXT.test(base) && !entry.iconPath) {
      entry.avatars += 1
      entry.iconPath = b.path
    }
    if (parts.length >= 3 && parts[parts.length - 2] === 'icons' && IMAGE_EXT.test(base) && !entry.iconPath) {
      entry.iconPath = b.path
    }
  }
  return kinds
}

/* ------------------------------------------------------------------ *
 * Safety scan
 * ------------------------------------------------------------------ */

const SCAN_EXT = new Set(['.py', '.js', '.mjs', '.cjs', '.sh', '.ps1', '.cmd', '.bat'])

export function scanFlags(fileName, text) {
  const flags = []
  const dot = fileName.lastIndexOf('.')
  if (dot < 0) return flags
  if (!SCAN_EXT.has(fileName.slice(dot).toLowerCase())) return flags
  const src = String(text)
  const rules = [
    [/curl\s+[^|]*\|\s*(ba)?sh/i, 'piped-to-shell'],
    [/\beval\s*\(/, 'eval'],
    [/new\s+Function\s*\(/, 'dynamic-function'],
    [/child_process|subprocess/i, 'spawns-process'],
    [/credentials?|api[_-]?key|secret|token/i, 'mentions-credentials'],
    [/https?:\/\/(?!raw\.githubusercontent\.com|github\.com)/i, 'external-url'],
  ]
  for (const [re, tag] of rules) if (re.test(src)) flags.push(tag)
  return flags
}

/* ------------------------------------------------------------------ *
 * Install (binary-safe, one entry, path-confined)
 * ------------------------------------------------------------------ */

const BINARY_EXT = /\.(tgz|tar|gz|zip|7z|rar|png|jpe?g|gif|webp|ico|bmp|pdf|woff2?|ttf|otf|eot|wasm|so|dylib|dll|exe|bin|node|jar|class|db|sqlite|mp3|mp4|wav|ogg)$/i

/** Download every blob under `<kind>s/<name>/` from the mirror. */
export async function downloadEntry(repo, branch, kindPlural, entryName, opts = {}) {
  const blobs = await ghTree(repo, branch)
  const prefix = `${kindPlural}/${entryName}/`
  const files = blobs.filter(b => b.path.startsWith(prefix))
  if (files.length === 0) throw new Error(`entry not found: ${prefix}`)
  const out = {}
  for (const f of files) {
    const rel = f.path.slice(prefix.length)
    const base = rel.split('/').pop() || rel
    if (opts.liteAvatars !== false && rel.includes('/avatars/') && IMAGE_EXT.test(base)) continue
    if (rel.includes('/icons/') && IMAGE_EXT.test(base)) continue
    if (TEXT_EXT.test(base) && !BINARY_EXT.test(base)) {
      out[rel] = { text: await ghText(repo, branch, f.path), size: f.size || 0, sha: f.sha }
    } else {
      const bytes = await ghBytes(repo, branch, f.path)
      out[rel] = { bytes, size: f.size || 0, sha: f.sha }
    }
  }
  return out
}

/** Land downloaded files under storeRoot/<kind>s/<name>. */
export function landEntry(paths, kind, entryName, files) {
  const destRoot = { expert: paths.experts, skill: paths.skills, connector: paths.connectors }[kind]
  if (!destRoot) throw new Error(`unknown kind: ${kind}`)
  const dest = resolve(join(destRoot, entryName))
  if (!dest.startsWith(resolve(destRoot) + '/')) throw new Error('path traversal blocked')
  rmSync(dest, { recursive: true, force: true })
  mkdirSync(dest, { recursive: true })
  const report = { files: 0, bytes: 0, flags: [] }
  for (const [rel, blob] of Object.entries(files)) {
    const target = resolve(join(dest, rel))
    if (!target.startsWith(dest + '/')) throw new Error('path traversal blocked')
    mkdirSync(target.slice(0, target.lastIndexOf('/')), { recursive: true })
    if (blob.bytes) {
      writeFileSync(target, blob.bytes)
      report.bytes += blob.bytes.byteLength
    } else {
      writeFileSync(target, blob.text)
      report.bytes += Buffer.byteLength(blob.text)
      for (const flag of scanFlags(rel, blob.text)) report.flags.push(`${rel}: ${flag}`)
    }
    report.files += 1
  }
  return { dest, report }
}

/** Symlink ~/.dsh/skills/<prefix><name> → storeRoot/skills/<name>. */
export function linkSkill(paths, prefix, entryName) {
  const linkPath = join(homedir(), '.dsh', 'skills', `${prefix}${entryName}`)
  const target = join(paths.skills, entryName)
  try { lstatSync(linkPath); unlinkSync(linkPath) } catch { /* absent */ }
  symlinkSync(target, linkPath)
  return linkPath
}

export function unlinkSkill(prefix, entryName) {
  const linkPath = join(homedir(), '.dsh', 'skills', `${prefix}${entryName}`)
  try { lstatSync(linkPath); unlinkSync(linkPath) } catch { /* absent */ }
  return linkPath
}

/* ------------------------------------------------------------------ *
 * Mounts — per-session attachment state (install ≠ mount)
 * ------------------------------------------------------------------ */

export function readMounts(paths) {
  const store = loadJson(paths.mounts, { version: 1, sessions: {} })
  if (!store.sessions || typeof store.sessions !== 'object') store.sessions = {}
  return store
}

export function mountEntry(paths, sessionId, key) {
  const store = readMounts(paths)
  const list = Array.isArray(store.sessions[sessionId]) ? store.sessions[sessionId] : []
  if (!list.includes(key)) list.push(key)
  store.sessions[sessionId] = list
  saveJson(paths.mounts, store)
  return list
}

export function unmountEntry(paths, sessionId, key) {
  const store = readMounts(paths)
  const list = (Array.isArray(store.sessions[sessionId]) ? store.sessions[sessionId] : []).filter(k => k !== key)
  store.sessions[sessionId] = list
  saveJson(paths.mounts, store)
  return list
}

/* ------------------------------------------------------------------ *
 * HTTP routes
 * ------------------------------------------------------------------ */

export function apply(ctx, config = {}) {
  const cfg = config ?? {}
  const mirrorRepo = cfg.mirrorRepo || 'superfat1988/workbuddyskills'
  const mirrorBranch = cfg.mirrorBranch || 'main'
  const skillPrefix = cfg.skillPrefix || 'workbuddy-'
  const P = storePaths(cfg)
  for (const d of [P.root, P.store, P.skills, P.experts, P.connectors, P.meta, P.icons]) {
    mkdirSync(d, { recursive: true })
  }

  const json = (res, code, body) => {
    res.statusCode = code
    res.setHeader('content-type', 'application/json; charset=utf-8')
    res.setHeader('cache-control', 'no-store')
    res.end(JSON.stringify(body))
  }
  const readBody = req => new Promise((resolveBody, reject) => {
    const chunks = []
    let size = 0
    req.on('data', chunk => {
      size += chunk.length
      if (size > 64 * 1024) { req.destroy(); reject(new Error('body too large')); return }
      chunks.push(chunk)
    })
    req.on('end', () => resolveBody(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
  const rejected = (req, res) => {
    const connection = ctx.connection
    if (!connection || typeof connection.requestRejection !== 'function') return false
    const verdict = connection.requestRejection(req)
    if (verdict === undefined) return false
    res.statusCode = verdict
    res.end()
    return true
  }
  const loadIndex = () => {
    const cache = loadJson(P.catalogCache, null)
    if (!cache || !cache.index) return null
    return cache
  }

  const handler = async (req, res) => {
    const url = new URL(req.url, 'http://localhost')
    if (!url.pathname.startsWith(PREFIX)) return false
    if (rejected(req, res)) return true
    const route = `${req.method} ${url.pathname.slice(PREFIX.length) || '/'}`

    if (route === 'GET /health') {
      json(res, 200, { ok: true, store: P.root, mirror: mirrorRepo, branch: mirrorBranch })
      return true
    }

    if (route === 'GET /catalog') {
      const cache = loadJson(P.catalogCache, null)
      const force = url.searchParams.get('refresh') === '1'
      if (!force && cache?.fetchedAt && Date.now() - cache.fetchedAt < 6 * 3600 * 1000 && cache.index) {
        json(res, 200, { cached: true, counts: countIndex(cache.index) })
        return true
      }
      const [md, blobs] = [await ghText(mirrorRepo, mirrorBranch, 'CATALOG.md'), await ghTree(mirrorRepo, mirrorBranch)]
      const index = mergeCatalog(buildIndex(blobs), parseCatalog(md))
      saveJson(P.catalogCache, { version: 2, fetchedAt: Date.now(), index })
      json(res, 200, { cached: false, counts: countIndex(index) })
      return true
    }

    if (route === 'GET /search') {
      const cache = loadIndex()
      if (!cache) { json(res, 503, { error: 'catalog not loaded' }); return true }
      const q = (url.searchParams.get('q') || '').trim().toLowerCase()
      const kind = url.searchParams.get('kind') || ''
      const limit = Math.min(Number(url.searchParams.get('limit') || 40) || 40, 100)
      let pool = []
      for (const [top, list] of Object.entries(cache.index)) {
        if (kind && !top.startsWith(kind)) continue
        pool = pool.concat(list)
      }
      const hits = q
        ? pool.filter(e => `${e.name} ${e.displayName || ''} ${e.description || ''} ${e.dir}`.toLowerCase().includes(q))
        : pool
      json(res, 200, {
        total: hits.length,
        hits: hits.slice(0, limit).map(e => ({
          kind: e.kind, name: e.name, dir: e.dir,
          displayName: e.displayName || e.name,
          description: e.description || '',
          prereq: e.prereq || '',
          files: e.files, bytes: e.bytes,
          hasMcpJson: e.hasMcpJson, hasCliJson: e.hasCliJson,
          hasPluginJson: e.hasPluginJson, hasSkillMd: e.hasSkillMd,
          hasIcon: Boolean(e.iconPath),
        })),
      })
      return true
    }

    if (route === 'GET /installed') {
      json(res, 200, loadJson(P.registry, { version: 1, installed: {} }))
      return true
    }

    if (route === 'GET /mounted') {
      const sessionId = url.searchParams.get('sessionId') || ''
      const store = readMounts(P)
      const keys = Array.isArray(store.sessions[sessionId]) ? store.sessions[sessionId] : []
      const registry = loadJson(P.registry, { version: 1, installed: {} })
      const entries = keys.map(key => registry.installed?.[key]).filter(Boolean)
      json(res, 200, { sessionId, keys, entries })
      return true
    }

    if (route === 'POST /mount' || route === 'POST /unmount') {
      const body = JSON.parse((await readBody(req)) || '{}')
      const kind = String(body.kind || '')
      const entryName = String(body.name || '')
      const sessionId = String(body.sessionId || '')
      if (!['expert', 'skill', 'connector'].includes(kind) || !/^[\w.-]+$/.test(entryName)) {
        json(res, 400, { error: 'invalid kind or name' }); return true
      }
      if (!sessionId) { json(res, 400, { error: 'sessionId required' }); return true }
      const key = `${kind}/${entryName}`
      const list = route === 'POST /mount'
        ? mountEntry(P, sessionId, key)
        : unmountEntry(P, sessionId, key)
      json(res, 200, { ok: true, sessionId, keys: list })
      return true
    }

    if (route === 'POST /install') {
      const body = JSON.parse((await readBody(req)) || '{}')
      const kind = String(body.kind || '')
      const entryName = String(body.name || '')
      if (!['expert', 'skill', 'connector'].includes(kind) || !/^[\w.-]+$/.test(entryName)) {
        json(res, 400, { error: 'invalid kind or name' }); return true
      }
      const files = await downloadEntry(mirrorRepo, mirrorBranch, `${kind}s`, entryName)
      const { dest, report } = landEntry(P, kind, entryName, files)
      const registry = loadJson(P.registry, { version: 1, installed: {} })
      if (!registry.installed) registry.installed = {}
      const key = `${kind}/${entryName}`
      const previous = registry.installed[key]
      // Persist the catalog's localized label so UI never shows the raw dir id.
      const cache = loadJson(P.catalogCache, null)
      const meta = cache?.index?.[`${kind}s`]?.find(e => e.name === entryName)
      const record = {
        kind, name: entryName, dest,
        displayName: meta?.displayName || entryName,
        description: meta?.description || '',
        installedAt: new Date().toISOString(),
        files: report.files, bytes: report.bytes, flags: report.flags,
        linked: false,
        enabled: kind === 'connector' ? Boolean(previous?.enabled) : undefined,
      }
      if (kind === 'skill') {
        try { linkSkill(P, skillPrefix, entryName); record.linked = true } catch (error) {
          report.flags.push(`symlink failed: ${error.message}`)
        }
      }
      registry.installed[key] = record
      saveJson(P.registry, registry)
      json(res, 200, { ok: true, key, report, linked: record.linked })
      return true
    }

    if (route === 'POST /uninstall') {
      const body = JSON.parse((await readBody(req)) || '{}')
      const kind = String(body.kind || '')
      const entryName = String(body.name || '')
      const key = `${kind}/${entryName}`
      const registry = loadJson(P.registry, { version: 1, installed: {} })
      const record = registry.installed?.[key]
      if (!record) { json(res, 404, { error: 'not installed' }); return true }
      if (kind === 'skill') unlinkSkill(skillPrefix, entryName)
      rmSync(record.dest, { recursive: true, force: true })
      delete registry.installed[key]
      saveJson(P.registry, registry)
      json(res, 200, { ok: true, removed: key })
      return true
    }

    if (route === 'GET /icon') {
      const kind = url.searchParams.get('kind') || ''
      const entryName = url.searchParams.get('name') || ''
      if (!['expert', 'skill', 'connector'].includes(kind) || !/^[\w.-]+$/.test(entryName)) {
        json(res, 400, { error: 'invalid kind or name' }); return true
      }
      const cache = loadIndex()
      const entry = cache?.index?.[`${kind}s`]?.find(e => e.name === entryName)
      if (!entry?.iconPath) { json(res, 404, { error: 'no icon' }); return true }
      const cached = join(P.icons, `${kind}-${entryName}${extOf(entry.iconPath)}`)
      try {
        if (!existsSync(cached) || statSync(cached).size === 0) {
          const bytes = await ghBytes(mirrorRepo, mirrorBranch, entry.iconPath)
          writeFileSync(cached, bytes)
        }
        const bytes = readFileSync(cached)
        res.statusCode = 200
        res.setHeader('content-type', mimeOf(cached))
        res.setHeader('cache-control', 'public, max-age=86400')
        res.end(bytes)
      } catch {
        json(res, 404, { error: 'icon unavailable' })
      }
      return true
    }

    json(res, 404, { error: `no route: ${route}` })
    return true
  }

  ctx.effect(
    () => ctx.webServer.register({ kind: 'prefix', path: PREFIX, handler }),
    'workbuddy-hub: routes',
  )
}

function countIndex(index) {
  const counts = {}
  for (const [top, list] of Object.entries(index)) counts[top] = list.length
  return counts
}

function extOf(path) {
  const dot = path.lastIndexOf('.')
  return dot < 0 ? '' : path.slice(dot).toLowerCase()
}

const MIME = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.webp': 'image/webp', '.ico': 'image/x-icon', '.svg': 'image/svg+xml',
}

function mimeOf(path) {
  return MIME[extOf(path)] || 'application/octet-stream'
}
