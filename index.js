/**
 * dsh-workbuddy-hub — Host half.
 *
 * WorkBuddy marketplace hub for DSH:
 *  - catalog: fetch the mirror repo's CATALOG.md + trees manifest (GitHub raw),
 *    expose search across experts/skills/connectors;
 *  - install: on-demand download of one catalog entry from the mirror fork,
 *    three-form conversion (skill → DSH skill, expert → persona store,
 *    connector → MCP registration), landing under ~/workbuddyskills;
 *  - persona: session-scoped "current expert" registry for the Web chip UI;
 *  - credentials: connector auth state via ctx.credentials (never returned).
 *
 * All file writes stay inside storeRoot; skills mount via symlink
 * ~/.dsh/skills/workbuddy-<name> → storeRoot/skills/<name> (DSH skill scanner
 * follows symlinks; verified nodeEntryKind).
 */
import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { homedir } from 'node:os'
import { isAbsolute, join, normalize, resolve } from 'node:path'
import {
  cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync,
  symlinkSync, unlinkSync, writeFileSync, lstatSync,
} from 'node:fs'

export const name = 'workbuddy-hub'
export const inject = ['webServer']

const PREFIX = '/workbuddy-hub'
const GH_RAW = 'https://raw.githubusercontent.com'
const GH_API = 'https://api.github.com'

/* ------------------------------------------------------------------ *
 * Paths & config
 * ------------------------------------------------------------------ */

function expandHome(p) {
  if (!p) return p
  if (p === '~') return homedir()
  if (p.startsWith('~/')) return join(homedir(), p.slice(2))
  return p
}

function storePaths(config) {
  const root = resolve(expandHome(config.storeRoot || '~/workbuddyskills'))
  return {
    root,
    store: join(root, '.store'),
    skills: join(root, 'skills'),
    experts: join(root, 'experts'),
    connectors: join(root, 'connectors'),
    meta: join(root, '.meta'),
    registry: join(root, '.meta', 'registry.json'),
    catalogCache: join(root, '.meta', 'catalog-cache.json'),
  }
}

/* ------------------------------------------------------------------ *
 * Registry (installed entries)
 * ------------------------------------------------------------------ */

export function loadRegistry(registryPath) {
  try {
    return JSON.parse(readFileSync(registryPath, 'utf8'))
  } catch {
    return { version: 1, installed: {} }
  }
}

export function saveRegistry(registryPath, registry) {
  mkdirSync(registryPath.slice(0, registryPath.lastIndexOf('/')), { recursive: true })
  writeFileSync(registryPath, JSON.stringify(registry, null, 2))
}

/* ------------------------------------------------------------------ *
 * GitHub fetch helpers (catalog metadata + entry download)
 * ------------------------------------------------------------------ */

export async function ghText(repo, branch, path) {
  const res = await fetch(`${GH_RAW}/${repo}/${branch}/${path}`)
  if (!res.ok) throw new Error(`raw ${res.status} for ${path}`)
  return res.text()
}

export async function ghTree(repo, branch) {
  const res = await fetch(`${GH_API}/repos/${repo}/git/trees/${branch}?recursive=1`)
  if (!res.ok) throw new Error(`tree api ${res.status}`)
  const data = await res.json()
  return data.tree.filter(e => e.type === 'blob')
}

/** Parse CATALOG.md into a searchable index (name/dir/desc/prereq per row). */
export function parseCatalog(md) {
  const entries = []
  const table = /\|\s*\[`([^`]+)`\]\(([^)]+)\)\s*\|\s*\[([^\]]*)\]/g
  let m
  while ((m = table.exec(md)) !== null) {
    entries.push({ dir: m[1], link: m[2], name: m[3] || m[1] })
  }
  // attach section context (## / ### headings before each row)
  const sections = []
  for (const line of md.split('\n')) {
    const h = /^#{2,3}\s+(.*)$/.exec(line)
    if (h) sections.push(h[1])
  }
  return entries
}

/** Build a lightweight search index from the git tree (path-driven). */
export function buildIndex(blobs) {
  const kinds = { experts: [], skills: [], connectors: [] }
  const seen = new Map()
  for (const b of blobs) {
    const top = b.path.split('/')[0]
    if (!kinds[top]) continue
    const parts = b.path.split('/')
    if (parts.length < 2) continue
    const name = parts[1]
    const key = `${top}/${name}`
    let entry = seen.get(key)
    if (!entry) {
      entry = { kind: top.slice(0, -1), name, dir: key, files: 0, bytes: 0, hasSkillMd: false, hasPluginJson: false, hasMcpJson: false, hasCliJson: false, avatars: 0 }
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
    if (b.path.includes('/avatars/')) entry.avatars += 1
  }
  return kinds
}

/* ------------------------------------------------------------------ *
 * Safety scan — reject executable content with obvious red flags
 * ------------------------------------------------------------------ */

const SCAN_EXT = new Set(['.py', '.js', '.mjs', '.cjs', '.sh', '.ps1', '.cmd', '.bat'])

export function scanFlags(fileName, content) {
  const flags = []
  const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase()
  if (!SCAN_EXT.has(ext)) return flags
  const text = String(content)
  const rules = [
    [/curl\s+[^|]*\|\s*(ba)?sh/i, 'piped-to-shell'],
    [/\beval\s*\(/, 'eval'],
    [/new\s+Function\s*\(/, 'dynamic-function'],
    [/child_process|subprocess/i, 'spawns-process'],
    [/credentials?|api[_-]?key|secret|token/i, 'mentions-credentials'],
    [/https?:\/\/(?!raw\.githubusercontent\.com|github\.com)/i, 'external-url'],
  ]
  for (const [re, tag] of rules) if (re.test(text)) flags.push(tag)
  return flags
}

/* ------------------------------------------------------------------ *
 * Install — download one entry, convert, land, symlink
 * ------------------------------------------------------------------ */

const IMAGE_EXT = /\.(png|jpe?g|gif|svg|webp)$/i

/** Download every blob under `<top>/<name>/` from the mirror repo. */
export async function downloadEntry(repo, branch, kind, name, opts = {}) {
  const blobs = await ghTree(repo, branch)
  const prefix = `${kind}/${name}/`
  const files = blobs.filter(b => b.path.startsWith(prefix))
  if (files.length === 0) throw new Error(`entry not found: ${prefix}`)
  const out = {}
  for (const f of files) {
    const rel = f.path.slice(prefix.length)
    const base = rel.split('/').pop()
    // avatar policy: skip original avatars entirely in lite mode (default)
    if (opts.liteAvatars !== false && rel.includes('/avatars/') && IMAGE_EXT.test(base)) continue
    if (opts.skipGz && rel.endsWith('.gz') && existsSyncBuddy(out, rel.replace(/\.gz$/, ''))) continue
    const text = await ghText(repo, branch, f.path)
    out[rel] = { content: text, size: f.size || 0, sha: f.sha }
  }
  return out
}

function existsSyncBuddy(out, rel) { return Boolean(out[rel]) }

/** Land downloaded files under storeRoot/<kind>s/<name>, run scan, return report. */
export function landEntry(paths, kind, name, files) {
  const destRoot = { expert: paths.experts, skill: paths.skills, connector: paths.connectors }[kind]
  if (!destRoot) throw new Error(`unknown kind: ${kind}`)
  const dest = join(destRoot, name)
  rmSync(dest, { recursive: true, force: true })
  mkdirSync(dest, { recursive: true })
  const report = { files: 0, bytes: 0, flags: [], skipped: [] }
  for (const [rel, blob] of Object.entries(files)) {
    const target = join(dest, rel)
    if (!target.startsWith(dest)) throw new Error('path traversal blocked')
    mkdirSync(target.slice(0, target.lastIndexOf('/')), { recursive: true })
    writeFileSync(target, blob.content)
    report.files += 1
    report.bytes += blob.content.length
    for (const flag of scanFlags(rel, blob.content)) report.flags.push(`${rel}: ${flag}`)
  }
  return { dest, report }
}

/** Symlink ~/.dsh/skills/<prefix><name> → storeRoot/skills/<name> (skills only). */
export function linkSkill(paths, prefix, name) {
  const linkPath = join(homedir(), '.dsh', 'skills', `${prefix}${name}`)
  const target = join(paths.skills, name)
  try { lstatSync(linkPath); unlinkSync(linkPath) } catch { /* absent */ }
  symlinkSync(target, linkPath)
  return linkPath
}

export function unlinkSkill(prefix, name) {
  const linkPath = join(homedir(), '.dsh', 'skills', `${prefix}${name}`)
  try { lstatSync(linkPath); unlinkSync(linkPath) } catch { /* absent */ }
  return linkPath
}

/* ------------------------------------------------------------------ *
 * HTTP routes
 * ------------------------------------------------------------------ */

export function apply(ctx, config = {}) {
  const cfg = config ?? {}
  const mirrorRepo = cfg.mirrorRepo || 'superfat1988/workbuddyskills'
  const mirrorBranch = cfg.mirrorBranch || 'main'
  const upstreamRepo = cfg.upstreamRepo || 'infometa/workbuddyskills'
  const skillPrefix = cfg.skillPrefix || 'workbuddy-'
  const P = storePaths(cfg)

  // lazily init store dir
  for (const d of [P.root, P.store, P.skills, P.experts, P.connectors, P.meta]) mkdirSync(d, { recursive: true })

  const json = (res, code, body) => {
    res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify(body))
  }
  const readBody = req => new Promise((resolveBody, reject) => {
    const chunks = []
    req.on('data', c => chunks.push(c))
    req.on('end', () => resolveBody(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })

  const handler = async (req, res) => {
    const url = new URL(req.url, 'http://localhost')
    if (!url.pathname.startsWith(PREFIX)) return false
    const route = `${req.method} ${url.pathname.slice(PREFIX.length) || '/'}`

    ;(async () => {
      if (route === 'GET /health') {
        return json(res, 200, { ok: true, store: P.root, mirror: mirrorRepo })
      }

      // catalog index (cached 6h)
      if (route === 'GET /catalog') {
        const cache = loadRegistry(P.catalogCache)
        const fresh = cache.fetchedAt && (Date.now() - cache.fetchedAt < 6 * 3600 * 1000)
        if (fresh && cache.index) return json(res, 200, { cached: true, index: cache.index })
        const [md, blobs] = [await ghText(mirrorRepo, mirrorBranch, 'CATALOG.md'), await ghTree(mirrorRepo, mirrorBranch)]
        const index = buildIndex(blobs)
        const catalog = parseCatalog(md)
        saveRegistry(P.catalogCache, { version: 1, fetchedAt: Date.now(), index, catalog })
        return json(res, 200, { cached: false, index, catalogCount: catalog.length })
      }

      if (route === 'GET /catalog/search') {
        const q = (url.searchParams.get('q') || '').toLowerCase()
        const kind = url.searchParams.get('kind') || ''
        const cache = loadRegistry(P.catalogCache)
        if (!cache.index) return json(res, 503, { error: 'catalog not loaded yet' })
        let pool = []
        for (const [top, list] of Object.entries(cache.index)) {
          if (kind && !top.startsWith(kind)) continue
          pool = pool.concat(list)
        }
        const hits = pool.filter(e => !q || e.name.toLowerCase().includes(q) || e.dir.toLowerCase().includes(q))
        return json(res, 200, { total: hits.length, hits: hits.slice(0, 60) })
      }

      if (route === 'GET /installed') {
        const reg = loadRegistry(P.registry)
        return json(res, 200, reg)
      }

      // install one entry: {kind: expert|skill|connector, name}
      if (route === 'POST /install' && req.method === 'POST') {
        const body = JSON.parse((await readBody(req)) || '{}')
        const kind = body.kind
        const name = String(body.name || '')
        if (!['expert', 'skill', 'connector'].includes(kind)) return json(res, 400, { error: 'kind must be expert|skill|connector' })
        if (!/^[\w.-]+$/.test(name)) return json(res, 400, { error: 'invalid name' })
        const files = await downloadEntry(mirrorRepo, mirrorBranch, `${kind}s`, name)
        const { dest, report } = landEntry(P, kind, name, files)
        const reg = loadRegistry(P.registry)
        const key = `${kind}/${name}`
        reg.installed[key] = {
          kind, name, dest,
          installedAt: new Date().toISOString(),
          files: report.files,
          bytes: report.bytes,
          flags: report.flags,
          linked: false,
        }
        // skills auto-link into DSH
        if (kind === 'skill') {
          try { linkSkill(P, skillPrefix, name); reg.installed[key].linked = true } catch (e) {
            report.flags.push(`symlink failed: ${e.message}`)
          }
        }
        saveRegistry(P.registry, reg)
        return json(res, 200, { ok: true, key, report, linked: reg.installed[key].linked })
      }

      if (route === 'POST /uninstall' && req.method === 'POST') {
        const body = JSON.parse((await readBody(req)) || '{}')
        const key = `${body.kind}/${body.name}`
        const reg = loadRegistry(P.registry)
        const entry = reg.installed[key]
        if (!entry) return json(res, 404, { error: 'not installed' })
        if (entry.kind === 'skill') unlinkSkill(skillPrefix, body.name)
        rmSync(entry.dest, { recursive: true, force: true })
        delete reg.installed[key]
        saveRegistry(P.registry, reg)
        return json(res, 200, { ok: true, removed: key })
      }

      return json(res, 404, { error: `no route: ${route}` })
    })().catch(e => json(res, 500, { error: String(e.message || e) }))
  }

  ctx.webServer.register({ kind: 'prefix', path: PREFIX, handler })
}
