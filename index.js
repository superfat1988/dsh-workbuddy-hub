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
import { join, resolve, dirname } from 'node:path'
import { loginStart, loginPoll, loadAuth, saveAuth, bearer, marketList, marketCategories, connectorRegistry, connectorBound, connectorAuthStart, connectorRevoke, connectorOauthStatus } from './wb-market.js'
import { listExperts, categories as officialCategories, installExpert } from './wb-experts.js'
import { skillDetails } from './wb-market.js'
import { unzip } from './wb-unzip.js'
import {
  existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync,
  symlinkSync, unlinkSync, lstatSync, statSync,
} from 'node:fs'
import { createConnectorManager, validateConnectorMcp, buildNativeRow, declaredServerNames } from './mcp-manager.js'
import { readExpertPersona, buildPersonaLine, buildSummonPrompt } from './expert-persona.js'

export const name = 'workbuddy-hub'
export const inject = ['webServer', 'connection', 'loader', 'commands', 'subagents', 'credentials', 'sessions', 'agents']

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

/** DSH 凭据引用名：官方 bearer 只以 ${WORKBUDDY_TOKEN} 形式出现在 mcp.json 里。 */
const WB_TOKEN_REF = 'WORKBUDDY_TOKEN'

const PROFILES_ROOT = join(homedir(), '.dsh', 'profiles')

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
    state: join(root, '.meta', 'state'),
    loginState: join(root, '.meta', 'state', 'login-state.json'),
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
 * Connector capability surfaces
 *
 * WorkBuddy connectors come in two shapes: MCP connectors carry `mcp.json`
 * (activated through mcp-manager), while CLI connectors carry `cli.json` plus
 * one or more skills under `skills/` (either `skills/SKILL.md` or
 * `skills/<child>/SKILL.md`). Only the MCP half was usable before; linking the
 * bundled skills is what makes a CLI connector actually do something in DSH.
 * ------------------------------------------------------------------ */

/** Every directory under `<connector>/skills` that carries a SKILL.md. */
export function connectorSkillDirs(dest) {
  const root = join(dest, 'skills')
  if (!existsSync(root)) return []
  if (existsSync(join(root, 'SKILL.md'))) return [{ child: '', dir: root }]
  const out = []
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const dir = join(root, entry.name)
    if (existsSync(join(dir, 'SKILL.md'))) out.push({ child: entry.name, dir })
  }
  return out
}

/** Link each bundled skill into ~/.dsh/skills so DSH can load it. */
export function linkConnectorSkills(prefix, connectorName, dest) {
  const linked = []
  for (const { child, dir } of connectorSkillDirs(dest)) {
    const name = child === '' ? connectorName : `${connectorName}-${child}`
    if (!/^[\w.-]{1,80}$/.test(name)) continue
    const linkPath = join(homedir(), '.dsh', 'skills', `${prefix}${name}`)
    try {
      lstatSync(linkPath); unlinkSync(linkPath)
    } catch { /* absent */ }
    try {
      symlinkSync(dir, linkPath)
      linked.push({ name, linkPath })
    } catch { /* link failure is reported by the caller's linked list */ }
  }
  return linked
}

export function unlinkConnectorSkills(prefix, linked = []) {
  for (const item of linked) {
    const name = typeof item === 'string' ? item : item?.name
    if (!name) continue
    try {
      const linkPath = join(homedir(), '.dsh', 'skills', `${prefix}${name}`)
      lstatSync(linkPath); unlinkSync(linkPath)
    } catch { /* absent */ }
  }
}

/** Sanitized CLI requirements: never persist the platform command templates. */
export function readCliMeta(dest) {
  const path = join(dest, 'cli.json')
  if (!existsSync(path)) return null
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8'))
    const type = typeof raw?.runtime?.type === 'string' ? raw.runtime.type : ''
    const version = typeof raw?.runtime?.version === 'string' ? raw.runtime.version : ''
    return {
      runtime: `${type}${version ? ` ${version}` : ''}`.trim(),
      minVersion: typeof raw?.versionCheck?.minVersion === 'string' ? raw.versionCheck.minVersion : '',
      authDomain: typeof raw?.authUrlDomain === 'string' ? raw.authUrlDomain : '',
      needsAuth: raw?.auth !== undefined,
    }
  } catch {
    return { runtime: '', minVersion: '', authDomain: '', needsAuth: false, unreadable: true }
  }
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

let pluginCtx = null
export function apply(ctx, config = {}) {
  pluginCtx = ctx
  const cfg = config ?? {}
  const mirrorRepo = cfg.mirrorRepo || 'superfat1988/workbuddyskills'
  const mirrorBranch = cfg.mirrorBranch || 'main'
  const skillPrefix = cfg.skillPrefix || 'workbuddy-'
      const P = storePaths(cfg)
  for (const d of [P.root, P.store, P.skills, P.experts, P.connectors, P.meta, P.icons]) {
    mkdirSync(d, { recursive: true })
  }

  // Connector MCP fibers are owned here; unloading the plugin (or HMR) tears
  // every transport down instead of leaving orphaned registrations behind.
  const connectors = createConnectorManager(ctx)
  ctx.effect(() => () => connectors.disposeAll(), 'workbuddy-hub: connector transports')

  /** Persisted connector status is deliberately sanitized: no urls/headers/env. */
  const noteConnectorStatus = (key, patch) => {
    const registry = loadJson(P.registry, { version: 1, installed: {} })
    const record = registry.installed?.[key]
    if (record === undefined) return
    Object.assign(record, patch)
    saveJson(P.registry, registry)
  }
  const connectorStatus = key => connectors.statusOf(key)

  /* ---------------------------------------------------------------- *
   * 专家召唤 — one durable child session per summon, expert persona
   * scoped to that child only (the main conversation keeps no persona).
   * ---------------------------------------------------------------- */

  /* ---------------------------------------------------------------- *
   * 会话解析：客户端槽组件由 DSH 框架注入 props.sessionId（session scope 标准
   * props，已实测拿到真实会话 id），因此**客户端显式传值优先**。宿主没有「用户
   * 正看哪个会话」的概念，只有客户端未上报时才退化为「最近创建的会话」兜底，并
   * 用 sessionSource 把这次退化如实标出来（避免静默挂错会话）。
   * ---------------------------------------------------------------- */
  const resolveSessionId = explicit => {
    const given = String(explicit || '').trim()
    if (given) return { id: given, source: 'client' }
    try {
      const list = ctx.sessions?.list?.() ?? []
      let best = null
      for (const item of list) {
        const id = item?.header?.id ?? item?.id ?? ''
        const createdAt = item?.header?.createdAt ?? 0
        if (!id) continue
        if (best === null || createdAt > best.createdAt) best = { id, createdAt }
      }
      if (best) return { id: best.id, source: 'recent-fallback' }
    } catch { /* ignore */ }
    return { id: '', source: 'none' }
  }
  const resolveAgent = sessionId => {
    if (!sessionId) return null
    try { return ctx.agents?.get?.(sessionId) ?? null } catch { return null }
  }

  /**
   * 宿主侧「活工具表」视图：DSH 的 tools 服务按 scope chain 每次现算（无缓存），
   * 所以运行时挂载的连接器工具立刻可见——不需要新会话、不需要模型轮次。
   * 返回注册表里以 mcp__<serverName>__ 开头的工具名清单。
   */
  const liveToolView = serverName => {
    const prefix = `mcp__${serverName}__`
    try {
      const tools = ctx.get?.('tools', false)
      if (!tools || typeof tools.schemas !== 'function') {
        return { available: false, reason: 'tools service unavailable', prefix, count: 0, names: [] }
      }
      const names = tools.schemas().map(schema => schema?.name).filter(name => typeof name === 'string')
      const hit = names.filter(name => name.startsWith(prefix))
      return {
        available: true, prefix,
        total: names.length,
        count: hit.length,
        names: hit,
        // 超长名会被 mcp-client 截断并追加 12 位哈希；给出原始名以便核对
        sample: hit.slice(0, 8),
      }
    } catch (error) {
      return { available: false, reason: String(error?.message || error), prefix, count: 0, names: [] }
    }
  }

  // 只读：某个已安装连接器在本进程注册表中的实际工具（配合 /connectors/tools 的
  // 上游清单，一次调用即可闭合「上游 N 个 → 宿主 N 个」）。
  const liveToolsRoute = (res, url) => {
    const entryName = url.searchParams.get('name') || ''
    if (!/^[\w.-]+$/.test(entryName)) { json(res, 400, { error: 'invalid name' }); return }
    const registry = loadJson(P.registry, { version: 1, installed: {} })
    const record = registry.installed?.[`connector/${entryName}`]
    if (!record) { json(res, 404, { error: `connector not installed locally: ${entryName}` }); return }
    const serverName = record.serverName || entryName
    json(res, 200, { ok: true, connector: entryName, serverName, enabled: Boolean(record.enabled), live: liveToolView(serverName) })
  }

  const summonExpert = async (invocation, personaStore) => {
    const requested = String(invocation.rawInput || '').trim().replace(/^\s+/, '')
    const registry = loadJson(P.registry, { version: 1, installed: {} })
    const installed = Object.values(registry.installed ?? {}).filter(r => r.kind === 'expert')
    if (requested === '') {
      if (installed.length === 0) return { kind: 'error', text: '尚未安装任何专家；请先在「专家·技能·连接器」中召唤。' }
      const list = installed.map(r => `${r.displayName || r.name} (/expert ${r.name})`).join('、')
      return { kind: 'success', text: `可用专家：${list}` }
    }
    const name = requested.split(/\s+/)[0]
    const record = registry.installed?.[`expert/${name}`]
    if (record === undefined) return { kind: 'error', text: `专家未安装：${name}` }

    const persona = readExpertPersona(personaStore, name)
    if (!persona.ok) return { kind: 'error', text: `专家人设不可用：${persona.error}` }
    // Prefer the catalog's localized label over the raw directory id.
    const titled = { ...persona, title: record.displayName || persona.title, description: record.description || persona.description }

    const task = requested.slice(name.length).trim()
    try {
      const started = await ctx.subagents.startContinuable({
        provider: 'spawn',
        label: `专家：${titled.title}`,
        request: {
          parent: invocation.agent,
          prompt: [{ type: 'text', text: buildSummonPrompt(titled, task) }],
          persona: buildPersonaLine(titled),
        },
        signal: invocation.signal,
      })
      return {
        kind: 'success',
        text: `已召唤「${titled.title}」，独立专家会话：${started.childId}`,
      }
    } catch (error) {
      return { kind: 'error', text: `召唤失败：${String(error?.message || error)}` }
    }
  }

  // mcp-client captures headers/env into its transport at activation, so a
  // rotated credential would otherwise keep being used. Re-mount only the
  // connectors whose admitted refs include the changed one.
  const remountConnector = async key => {
    const registry = loadJson(P.registry, { version: 1, installed: {} })
    const record = registry.installed?.[key]
    if (record === undefined) return
    const mcpPath = join(record.dest, 'mcp.json')
    if (!existsSync(mcpPath)) return
    const live = connectorStatus(key)
    if (live.state !== 'enabled') return
    try {
      const raw = JSON.parse(readFileSync(mcpPath, 'utf8'))
      const result = await connectors.enable(key, raw, record.name)
      noteConnectorStatus(key, {
        enabled: true, status: 'enabled', lastError: '',
        serverName: result.serverName, credentialRefs: result.refs, transport: result.summary.transport,
      })
    } catch (error) {
      await connectors.disable(key)
      noteConnectorStatus(key, {
        enabled: false, status: 'failed', lastError: String(error?.message || error).slice(0, 300),
      })
    }
  }
  ctx.on('credentials/reference-updated', ref => {
    const changed = String(ref ?? '')
    if (changed === '') return
    for (const key of connectors.mountedKeys()) {
      if (connectors.refsOf(key).includes(changed)) void remountConnector(key)
    }
  })

  ctx.effect(() => ctx.commands.register({
    name: 'expert',
    description: '召唤已安装的 WorkBuddy 专家（角色化人设，运行在独立子会话中）',
    input: { hint: '<专家目录名> [任务描述]' },
    handler: invocation => summonExpert(invocation, P.experts),
  }), 'workbuddy-hub: /expert command')

  ctx.effect(() => ctx.commands.register({
    name: 'connector',
    description: '启用或停用已安装的 WorkBuddy 连接器（MCP）',
    input: { hint: '<连接器名> [on|off]' },
    handler: async invocation => {
      const parts = String(invocation.rawInput || '').trim().split(/\s+/).filter(Boolean)
      const name = parts[0] || ''
      const action = (parts[1] || 'on').toLowerCase()
      if (name === '') return { kind: 'error', text: '用法：/connector <连接器名> [on|off]' }
      const key = `connector/${name}`
      const registry = loadJson(P.registry, { version: 1, installed: {} })
      const record = registry.installed?.[key]
      if (record === undefined) return { kind: 'error', text: `连接器未安装：${name}` }
      if (action === 'off') {
        await connectors.disable(key)
        noteConnectorStatus(key, { enabled: false, status: 'disabled', lastError: '' })
        return { kind: 'success', text: `已停用连接器「${record.displayName || name}」。` }
      }
      const mcpPath = join(record.dest, 'mcp.json')
      if (!existsSync(mcpPath)) {
        const skills = (record.linkedSkills ?? []).map(s => s.name)
        return { kind: 'error', text: skills.length > 0
          ? `${name} 是 CLI 型连接器（无 mcp.json），其技能已挂载：${skills.join('、')}。`
          : `${name} 是 CLI/技能型连接器，没有 mcp.json。` }
      }
      try {
        const raw = JSON.parse(readFileSync(mcpPath, 'utf8'))
        const result = await connectors.enable(key, raw, name)
        noteConnectorStatus(key, {
          enabled: true, status: 'enabled', lastError: '',
          serverName: result.serverName, credentialRefs: result.refs, transport: result.summary.transport,
        })
        return { kind: 'success', text: `已启用连接器「${record.displayName || name}」（工具命名空间 ${result.serverName}），下一次模型步骤起可用。` }
      } catch (error) {
        const message = String(error?.message || error).slice(0, 200)
        noteConnectorStatus(key, { enabled: false, status: 'failed', lastError: message })
        return { kind: 'error', text: `启用失败：${message}` }
      }
    },
  }), 'workbuddy-hub: /connector command')

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

    // ---- official market API proxy: the web-first data layer ----
    // The official client talks to workbuddy.cn/portal/operation-platform/market/*.
    // Proxied with the browser's cookies so the plugin sees the same catalogue the
    // official UI does (5.8k experts / 9.1k skills, CDN icons, zh/en copy).
    if (route.startsWith('POST /market/') || route.startsWith('GET /market/')) {
      const rest = route.slice(route.indexOf(' /market/') + 9)
      const headers = { 'content-type': 'application/json', accept: 'application/json' }
      // Session credential for the official market API (user pastes their
      // workbuddy.cn cookie into DSH credentials; never persisted here).
      const ref = config?.workbuddyCookieRef
      if (ref) {
        try {
          const resolved = await pluginCtx?.credentials?.resolve?.(ref)
          const value = resolved?.value
          if (value) headers.cookie = String(value)
        } catch { /* unconfigured credential: anonymous proxying only */ }
      }
      if (!headers.cookie && req.headers.cookie) headers.cookie = req.headers.cookie
      const init = { method: req.method, headers }
      if (req.method === 'POST') {
        const chunks = []
        for await (const chunk of req) chunks.push(chunk)
        init.body = Buffer.concat(chunks)
      }
      try {
        const upstream_res = await fetch(`https://www.workbuddy.cn/portal/operation-platform/market/${rest}`, init)
        const text = await upstream_res.text()
        res.writeHead(upstream_res.status, { 'content-type': 'application/json; charset=utf-8' })
        res.end(text)
      } catch (error) {
        json(res, 502, { error: `official market unreachable: ${error.message}` })
      }
      return true
    }

    // ---- official account (OAuth device flow) ----
    if (route === 'GET /wb-auth') {
      const auth = loadAuth(P.state)
      json(res, 200, {
        configured: Boolean(auth?.access_token),
        uid: auth?.uid, nickname: auth?.nickname,
        expiresAt: auth ? (auth.obtainedAt ?? 0) + (auth.expires_in ?? 3600) * 1000 : null,
      })
      return true
    }
    if (route === 'POST /wb-auth/start') {
      try {
        const { state, authUrl } = await loginStart()
        saveJson(P.loginState, { state, at: Date.now() })
        json(res, 200, { ok: true, authUrl, state })
      } catch (error) {
        json(res, 502, { error: error.message })
      }
      return true
    }
    if (route === 'POST /wb-auth/poll') {
      const st = loadJson(P.loginState, null)
      if (!st?.state) { json(res, 400, { error: 'no login in progress (call /wb-auth/start first)' }); return true }
      try {
        const auth = await loginPoll(st.state)
        saveAuth(P.state, auth)
        rmSync(P.loginState, { force: true })
        json(res, 200, { ok: true, nickname: auth.nickname, uid: auth.uid })
      } catch (error) {
        json(res, error.pending ? 202 : 502, { error: error.message, pending: Boolean(error.pending) })
      }
      return true
    }
    if (route === 'POST /wb-auth/logout') {
      rmSync(P.state.join('workbuddy-auth.json'), { force: true })
      json(res, 200, { ok: true })
      return true
    }

    // ---- official market data (web-first layer) ----
    // ---- official expert registry (no login required, MIT source) ----
    if (route === 'GET /official-experts') {
      try {
        const out = await listExperts({
          query: url.searchParams.get('q') || '',
          categoryId: url.searchParams.get('category') || 'all',
          limit: Math.min(500, Number(url.searchParams.get('limit') || 60) || 60),
        })
        json(res, 200, { ok: true, source: 'official-registry', ...out })
      } catch (error) {
        json(res, 502, { error: error.message })
      }
      return true
    }
    if (route === 'GET /official-expert-categories') {
      try { json(res, 200, { ok: true, items: await officialCategories() }) }
      catch (error) { json(res, 502, { error: error.message }) }
      return true
    }

    if (route === 'GET /market-list') {
      const kindQ = url.searchParams.get('kind') || 'expert'
      if (kindQ === 'connector') {
        try {
          const rows = await connectorRegistry(P.state)
          json(res, 200, { ok: true, source: rows.length ? 'official' : 'mirror', total: rows.length, rows })
        } catch (error) {
          json(res, 200, { ok: true, source: 'mirror', total: 0, rows: [], error: error.message })
        }
        return true
      }
      const kind = kindQ === 'skill' ? 'skill' : 'expert'
      const payload = {
        page: Math.max(1, Number(url.searchParams.get('page') || 1) || 1),
        page_size: Math.min(100, Number(url.searchParams.get('pageSize') || 60) || 60),
      }
      const q = (url.searchParams.get('q') || '').trim()
      if (q) payload.keyword = q
      const cat = url.searchParams.get('category')
      if (cat && cat !== 'all') payload.categories = [cat]
      try {
        const { total, rows } = await marketList(kind, payload, P.state)
        json(res, 200, { ok: true, source: 'official', total, rows })
      } catch (error) {
        // mirror fallback keeps the page usable without an official login
        const cache = loadIndex()
        const q2 = (url.searchParams.get('q') || '').trim().toLowerCase()
        const hits = cache
          ? Object.values(cache.index?.[kind === 'expert' ? 'experts' : 'skills'] ?? {})
              .filter(e => !q2 || (e.displayName || '').toLowerCase().includes(q2) || (e.description || '').toLowerCase().includes(q2))
              .slice(0, payload.page_size)
          : []
        json(res, 200, { ok: true, source: 'mirror', total: hits.length, rows: hits, error: error.message })
      }
      return true
    }
    if (route === 'GET /market-categories') {
      const kind = url.searchParams.get('kind') === 'skill' ? 'skill' : 'expert'
      try {
        const items = await marketCategories(kind, P.state)
        json(res, 200, { ok: true, source: 'official', items })
      } catch (error) {
        json(res, 200, { ok: true, source: 'mirror', items: [] })
      }
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
      const registry = loadJson(P.registry, { version: 1, installed: {} })
      for (const [key, record] of Object.entries(registry.installed ?? {})) {
        if (record.kind !== 'connector') continue
        const live = connectorStatus(key)
        record.enabled = live.state === 'enabled'
        // A recorded failure stays visible until the next successful enable.
        record.status = live.state === 'enabled' ? 'enabled'
          : record.status === 'failed' ? 'failed' : 'disabled'
        if (live.serverName) record.serverName = live.serverName
      }
      json(res, 200, registry)
      return true
    }

    if (route === 'GET /connector-registry') {
      try {
        const rows = await connectorRegistry(P.state)
        json(res, 200, { ok: true, source: rows.length ? 'official' : 'mirror', rows })
      } catch (error) {
        json(res, 200, { ok: true, source: 'mirror', rows: [], error: error.message })
      }
      return true
    }

    // 官方「已绑定连接器」列表（真实连接态，不靠本地猜测）
    if (route === 'GET /connectors/bound') {
      try { json(res, 200, { ok: true, items: await connectorBound(P.state) }) }
      catch (error) { json(res, 200, { ok: false, items: [], error: String(error?.message || error) }) }
      return true
    }

    // 授权完成轮询（官方在 /start 之后轮询同一路径）
    if (route === 'GET /connectors/oauth-status') {
      const entryName = url.searchParams.get('name') || ''
      if (!/^[\w.-]+$/.test(entryName)) { json(res, 400, { error: 'invalid name' }); return true }
      try {
        const { payload } = await connectorOauthStatus(entryName, P.state)
        const data = payload?.data ?? {}
        // 官方成功态是字符串 "connected"（实测），不是布尔/数字。
        const status = data.status
        const connected = data.connected === true || status === 1 || status === 'connected' || status === 'connected_ok'
        json(res, 200, { ok: true, code: payload?.code, connected, status: status ?? null, raw: payload })
      } catch (error) { json(res, 200, { ok: false, connected: false, message: String(error?.message || error) }) }
      return true
    }

    // 连接器暴露的工具清单：宿主按 mcp.json 的 url + 凭据引用真调一次 tools/list。
    if (route === 'GET /connectors/tools') {
      const entryName = url.searchParams.get('name') || ''
      if (!/^[\w.-]+$/.test(entryName)) { json(res, 400, { error: 'invalid name' }); return true }
      try {
        const registry = loadJson(P.registry, { version: 1, installed: {} })
        const record = registry.installed?.[`connector/${entryName}`]
        if (!record) { json(res, 404, { error: `connector not installed locally: ${entryName}` }); return true }
        const mcpPath = join(record.dest, 'mcp.json')
        if (!existsSync(mcpPath)) { json(res, 400, { error: 'connector has no mcp.json' }); return true }
        const raw = JSON.parse(readFileSync(mcpPath, 'utf8'))
        const server = Object.values(raw.mcpServers ?? {})[0] ?? {}
        if (!server.url) { json(res, 400, { error: 'connector has no http url' }); return true }
        let token = ''
        try { token = await bearer(P.state) } catch { token = '' }
        const headers = { 'content-type': 'application/json', accept: 'application/json, text/event-stream' }
        for (const [key, value] of Object.entries(server.headers ?? {})) {
          headers[key] = String(value).replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g, () => token)
        }
        const upstream = await fetch(server.url, {
          method: 'POST', headers,
          body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} }),
        })
        const text = await upstream.text()
        if (upstream.status !== 200) { json(res, 502, { error: `mcp gateway HTTP ${upstream.status}`, detail: text.slice(0, 200) }); return true }
        // streamable-http 可能回 SSE（data: 行）也可能回纯 JSON，两种都解析。
        let payload = null
        try { payload = JSON.parse(text) } catch {
          const line = text.split('\n').filter(l => l.startsWith('data:')).pop()
          if (line) { try { payload = JSON.parse(line.slice(5).trim()) } catch { payload = null } }
        }
        const tools = payload?.result?.tools ?? []
        json(res, 200, {
          ok: true, connector: entryName,
          count: tools.length,
          names: tools.map(t => t.name),
          labelled: tools.map(t => ({ name: t.name, description: String(t.description || '').slice(0, 120) })),
          namespace: `mcp__${record.serverName || entryName}__`,
          // 宿主 registry 侧同一份数据的实测视图（证明这些工具真的注册进了本进程，
          // 而不只是上游网关能枚举出来）。零模型轮次：tools 服务每次调用现算。
          live: liveToolView(record.serverName || entryName),
        })
      } catch (error) {
        json(res, 502, { error: `tool listing failed: ${String(error?.message || error)}` })
      }
      return true
    }

    // 只读：连接器工具在**宿主进程注册表**里的实测视图（零模型轮次）。
    if (route === 'GET /connectors/live-tools') {
      liveToolsRoute(res, url)
      return true
    }

    // 只读导出：把已安装连接器渲染成可粘贴的原生 mcp-client overlay 行，
    // 并扫描 profile 里已声明的 serverName 供冲突提示。绝不写 profile。
    if (route === 'GET /connectors/native-row') {
      const entryName = url.searchParams.get('name') || ''
      if (!/^[\w.-]+$/.test(entryName)) { json(res, 400, { error: 'invalid name' }); return true }
      try {
        const registry = loadJson(P.registry, { version: 1, installed: {} })
        const record = registry.installed?.[`connector/${entryName}`]
        if (!record) { json(res, 404, { error: `connector not installed locally: ${entryName}` }); return true }
        const mcpPath = join(record.dest, 'mcp.json')
        if (!existsSync(mcpPath)) { json(res, 400, { error: 'connector has no mcp.json' }); return true }
        const raw = JSON.parse(readFileSync(mcpPath, 'utf8'))
        const picked = Object.keys(raw.mcpServers ?? {})[0]
        if (!picked) { json(res, 400, { error: 'mcp.json declares no server' }); return true }
        const server = raw.mcpServers[picked]
        const serverName = record.serverName || picked
        const credentialRef = String(JSON.stringify(server.headers ?? {})).match(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}/)?.[1] ?? ''
        const generatedAt = new Date().toISOString()
        const row = buildNativeRow({
          serverName, transport: server.transport || 'streamable-http',
          url: server.url || '', credentialRef: credentialRef || 'WORKBUDDY_TOKEN', connector: entryName,
        }, generatedAt)
        // 冲突扫描：profile 目录下的 patch/配置文本
        const conflicts = []
        try {
          const profileDir = join(PROFILES_ROOT, config?.profile ?? 'web')
          for (const file of ['cordis.yml', 'patch.yml', 'package.json']) {
            const path = join(profileDir, file)
            if (!existsSync(path)) continue
            for (const name of declaredServerNames(readFileSync(path, 'utf8'))) conflicts.push({ file, name })
          }
        } catch { /* 扫描失败不影响导出 */ }
        json(res, 200, {
          ok: true, connector: entryName, serverName, credentialRef, generatedAt,
          runtimeServerName: record.serverName || null,
          row,
          conflict: conflicts.some(c => c.name === serverName),
          conflicts,
          note: '快照导出：不修改任何 profile 文件；服务器改用原生加载后请重启 DSH 生效。',
        })
      } catch (error) {
        json(res, 502, { error: `native row export failed: ${String(error?.message || error)}` })
      }
      return true
    }

    // 解绑连接器：走官方 revoke（本地 disable 只对「本地安装」的 MCP 有意义）
    if (route === 'POST /connectors/unbind') {
      const body = JSON.parse((await readBody(req)) || '{}')
      const entryName = String(body.name || '')
      if (!/^[\w.-]+$/.test(entryName)) { json(res, 400, { error: 'invalid name' }); return true }
      try { json(res, 200, await connectorRevoke(entryName, P.state)) }
      catch (error) { json(res, 200, { ok: false, message: String(error?.message || error) }) }
      return true
    }

    // 发起官方 OAuth：把官方返回的授权链接（或错误）原样交给客户端
    if (route === 'POST /connectors/auth-start') {
      const body = JSON.parse((await readBody(req)) || '{}')
      const entryName = String(body.name || '')
      if (!/^[\w.-]+$/.test(entryName)) { json(res, 400, { error: 'invalid name' }); return true }
      try {
        const { payload } = await connectorAuthStart(entryName, P.state)
        const data = payload?.data ?? {}
        const url = data.url || data.auth_url || data.authorize_url || data.redirect_url || data.authUrl || ''
        json(res, 200, { ok: Boolean(url), url, code: payload?.code, message: payload?.msg || '', raw: url ? undefined : payload })
      } catch (error) {
        json(res, 200, { ok: false, url: '', message: String(error?.message || error) })
      }
      return true
    }

    // Local DSH skills (~/.dsh/skills): for the composer skill picker's
    // "installed" section. One row per directory holding a SKILL.md.
    if (route === 'GET /local-skills') {
      const rows = []
      try {
        const dshSkills = join(homedir(), '.dsh', 'skills')
        for (const dirent of readdirSync(dshSkills, { withFileTypes: true })) {
          if (!dirent.isDirectory()) continue
          if (!skillPrefix || dirent.name.startsWith(skillPrefix)) continue
          const dir = join(dshSkills, dirent.name)
          const skillMd = join(dir, 'SKILL.md')
          if (!existsSync(skillMd)) continue
          let description = ''
          try {
            const head = readFileSync(skillMd, 'utf8').slice(0, 2000)
            const m = head.match(/^description:\s*(.+)$/m)
            if (m) description = m[1].replace(/^["']|["']$/g, '').slice(0, 160)
          } catch { /* unreadable description is fine */ }
          rows.push({ kind: 'skill', name: dirent.name, displayName: dirent.name, description, local: true, dir })
        }
      } catch { /* no dsh skills dir */ }
      json(res, 200, { ok: true, rows })
      return true
    }

    // 官方已授权的连接器 → 在本地登记 MCP 配置，使其在 DSH 里真正可用。
    // gateway_url 来自官方注册表；密钥只以 ${WORKBUDDY_TOKEN} 引用落盘。
    if (route === 'POST /connectors/install') {
      const body = JSON.parse((await readBody(req)) || '{}')
      const entryName = String(body.name || '')
      if (!/^[\w.-]+$/.test(entryName)) { json(res, 400, { error: 'invalid name' }); return true }
      try {
        const rows = await connectorRegistry(P.state)
        const row = rows.find(r => r.name === entryName)
        if (!row) { json(res, 404, { error: `connector not in official registry: ${entryName}` }); return true }
        const gateway = row.mcp?.gateway_url
        if (!gateway) { json(res, 400, { error: 'connector has no MCP gateway (CLI or skill-only connector)' }); return true }
        const flags = []
        // bearer() 会按需刷新并返回当前 access_token（auth 文件里是 access_token 字段）。
        let token = ''
        try { token = await bearer(P.state) } catch { token = '' }
        if (token) {
          try { await ctx.credentials?.set?.(WB_TOKEN_REF, token) }
          catch (error) { flags.push(`credential store failed: ${String(error?.message || error)}`) }
        } else {
          flags.push('no official token: connector stays unusable until the account is connected')
        }
        const dest = join(P.connectors, entryName)
        mkdirSync(dest, { recursive: true })
        const mcp = {
          mcpServers: {
            [entryName]: {
              transport: 'streamable-http',
              url: gateway,
              headers: { Authorization: `Bearer $\{${WB_TOKEN_REF}}` },
            },
          },
        }
        const mcpText = JSON.stringify(mcp, null, 2)
        writeFileSync(join(dest, 'mcp.json'), mcpText)
        const registry = loadJson(P.registry, { version: 1, installed: {} })
        if (!registry.installed) registry.installed = {}
        const key = `connector/${entryName}`
        const previous = registry.installed[key]
        registry.installed[key] = {
          kind: 'connector', name: entryName, dest,
          displayName: row.displayName || entryName,
          description: row.description || '',
          icon: row.icon || '',
          installedAt: new Date().toISOString(),
          files: 1, bytes: Buffer.byteLength(mcpText), flags,
          linked: false,
          enabled: Boolean(previous?.enabled),
          official: true,
        }
        saveJson(P.registry, registry)
        json(res, 200, { ok: true, key, dest, flags })
      } catch (error) {
        json(res, 502, { error: `connector install failed: ${String(error?.message || error)}` })
      }
      return true
    }

    if (route === 'POST /connectors/enable' || route === 'POST /connectors/disable') {
      const body = JSON.parse((await readBody(req)) || '{}')
      const entryName = String(body.name || '')
      if (!/^[\w.-]+$/.test(entryName)) { json(res, 400, { error: 'invalid name' }); return true }
      const key = `connector/${entryName}`
      const registry = loadJson(P.registry, { version: 1, installed: {} })
      const record = registry.installed?.[key]
      if (record === undefined) { json(res, 404, { error: 'not installed' }); return true }

      if (route === 'POST /connectors/disable') {
        await connectors.disable(key)
        noteConnectorStatus(key, { enabled: false, status: 'disabled', lastError: '' })
        json(res, 200, { ok: true, key, status: 'disabled' })
        return true
      }

      const mcpPath = join(record.dest, 'mcp.json')
      if (!existsSync(mcpPath)) {
        json(res, 400, { error: 'connector has no mcp.json (CLI/skill-only connector)' })
        return true
      }
      let raw
      try {
        raw = JSON.parse(readFileSync(mcpPath, 'utf8'))
      } catch {
        json(res, 400, { error: 'mcp.json is not valid JSON' })
        return true
      }
      // Static admission runs first so a refusal can still report the transport
      // and the credential refs the UI must ask the user to configure. No
      // resolved secret value is ever persisted.
      const admission = validateConnectorMcp(raw, entryName)
      const facts = admission.ok
        ? { credentialRefs: admission.refs, transport: admission.summary.transport }
        : {}
      try {
        const result = await connectors.enable(key, raw, entryName)
        noteConnectorStatus(key, {
          enabled: true, status: 'enabled', lastError: '',
          serverName: result.serverName,
          credentialRefs: result.refs,
          transport: result.summary.transport,
        })
        json(res, 200, { ok: true, key, ...result })
      } catch (error) {
        const message = String(error?.message || error)
        // Installed-but-disabled on failure: never leave a half-mounted child.
        noteConnectorStatus(key, { enabled: false, status: 'failed', lastError: message.slice(0, 300), ...facts })
        json(res, 502, { ok: false, error: message.slice(0, 300), status: 'failed', ...facts })
      }
      return true
    }

    if (route === 'GET /mounted') {
      const resolvedSession = resolveSessionId(url.searchParams.get('sessionId'))
      const sessionId = resolvedSession.id
      const store = readMounts(P)
      const keys = Array.isArray(store.sessions[sessionId]) ? store.sessions[sessionId] : []
      const registry = loadJson(P.registry, { version: 1, installed: {} })
      const entries = keys.map(key => registry.installed?.[key]).filter(Boolean)
      json(res, 200, { sessionId, sessionSource: resolvedSession.source, keys, entries })
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
      // 客户端 props.sessionId 优先；宿主只在缺失时兜底取最近会话（并标注来源）。
      const resolvedSession = resolveSessionId(sessionId)
      const resolved = resolvedSession.id
      if (!resolved) { json(res, 409, { error: 'no active session' }); return true }
      const key = `${kind}/${entryName}`
      const list = route === 'POST /mount'
        ? mountEntry(P, resolved, key)
        : unmountEntry(P, resolved, key)
      json(res, 200, { ok: true, sessionId: resolved, sessionSource: resolvedSession.source, keys: list })
      return true
    }

    // 召唤专家：宿主侧解析会话与 agent 后建立子会话（客户端无需 sessionId）。
    if (route === 'POST /summon') {
      const body = JSON.parse((await readBody(req)) || '{}')
      const entryName = String(body.name || '')
      const task = String(body.task || '')
      if (!/^[\w.-]+$/.test(entryName)) { json(res, 400, { error: 'invalid name' }); return true }
      const resolvedSession = resolveSessionId(body.sessionId)
      const resolved = resolvedSession.id
      const agent = resolveAgent(resolved)
      if (!agent) { json(res, 409, { error: 'no active session' }); return true }
      const registry = loadJson(P.registry, { version: 1, installed: {} })
      const record = registry.installed?.[`expert/${entryName}`]
      const persona = readExpertPersona(P.experts, entryName)
      if (!persona.ok) { json(res, 400, { error: `专家人设不可用：${persona.error}` }); return true }
      const titled = {
        ...persona,
        title: record?.displayName || persona.title,
        description: record?.description || persona.description,
      }
      try {
        // 子会话规范要求一个可中断信号；宿主侧发起时用一个全新的、不会被外部取消的信号。
        const controller = new AbortController()
        const started = await ctx.subagents.startContinuable({
          provider: 'spawn',
          label: `专家：${titled.title}`,
          request: {
            parent: agent,
            prompt: [{ type: 'text', text: buildSummonPrompt(titled, task) }],
            persona: buildPersonaLine(titled),
          },
          signal: controller.signal,
        })
        json(res, 200, { ok: true, childId: started.childId, sessionId: resolved, sessionSource: resolvedSession.source })
      } catch (error) {
        json(res, 502, { error: String(error?.message || error) })
      }
      return true
    }

    // 当前解析到的会话（供界面显示/排障）
    if (route === 'GET /active-session') {
      const explicit = url.searchParams.get('sessionId')
      const resolvedSession = resolveSessionId(explicit)
      const resolved = resolvedSession.id
      json(res, 200, {
        ok: true, sessionId: resolved, sessionSource: resolvedSession.source,
        hasAgent: Boolean(resolveAgent(resolved)),
      })
      return true
    }

    if (route === 'POST /install') {
      const body = JSON.parse((await readBody(req)) || '{}')
      const kind = String(body.kind || '')
      const entryName = String(body.name || '')
      if (!['expert', 'skill', 'connector'].includes(kind) || !/^[\w.-]+$/.test(entryName)) {
        json(res, 400, { error: 'invalid kind or name' }); return true
      }
      // Experts prefer the official registry (same catalogue/copy the official
      // client shows); the mirror is the fallback for anything not published there.
      let files, dest, report, officialMeta = null
      if (kind === 'skill' && body.source === 'official') {
        // Official skill: the install request carries the human name, so resolve
        // name → skill_id first, then fetch the record with its download_url.
        try {
          const { rows } = await marketList('skill', { page: 1, pageSize: 10, query: entryName }, P.state)
          const hit = rows.find(r => r.name === entryName)
            ?? rows.find(r => (r.display_name_zh || r.display_name_en) === entryName)
            ?? rows[0]
          if (!hit?.skill_id) throw new Error(`official skill not found: ${entryName}`)
          const details = await skillDetails([hit.skill_id], P.state)
          const rec = details.find(x => x.skill_id === hit.skill_id) ?? details[0]
          if (!rec?.download_url) throw new Error('official skill has no package')
          const res = await fetch(rec.download_url)
          if (!res.ok) throw new Error(`skill package HTTP ${res.status}`)
          const buf = Buffer.from(await res.arrayBuffer())
          if (buf.length > 8 * 1024 * 1024) throw new Error('skill package too large')
          if (!(buf[0] === 0x50 && buf[1] === 0x4b)) throw new Error('skill package is not a zip')
          const entries = unzip(buf).filter(e => !e.name.endsWith('/'))
          const safeName = /^([\w.-]+)\//.exec(entries[0]?.name ?? '')
          const root = safeName ? safeName[1] : entryName
          if (!/^[\w.-]+$/.test(root)) throw new Error('unsafe package layout')
          dest = join(P.skills, root)
          mkdirSync(dest, { recursive: true })
          let count = 0, total = 0
          const flags = []
          for (const e of entries) {
            const rel = e.name.startsWith(root + '/') ? e.name.slice(root.length + 1) : e.name
            if (!rel || rel.includes('..')) continue
            const target = join(dest, rel)
            if (!target.startsWith(dest)) continue
            mkdirSync(dirname(target), { recursive: true })
            writeFileSync(target, e.data)
            count++; total += e.data.length
            flags.push(...scanFlags(e.data.toString('utf8').slice(0, 20000), rel))
          }
          officialMeta = {
            kind: 'skill', name: root, dest,
            displayName: rec.display_name_zh || rec.display_name_en || root,
            description: rec.description_zh || rec.description || rec.description_en || '',
            files: count, bytes: total, flags: [...new Set(flags)],
            source: 'official', officialId: rec.skill_id,
            icon: rec.icon,
          }
        files = entries
        report = { files: count, bytes: total, flags: officialMeta.flags }
        } catch (error) {
          json(res, 502, { error: `official skill install failed: ${error.message}` })
          return true
        }
      } else if (kind === 'expert' && body.source !== 'mirror') {
        try {
          officialMeta = await installExpert(entryName, P.experts, skillPrefix)
          dest = officialMeta.dest
          report = { files: officialMeta.files, bytes: officialMeta.bytes, flags: officialMeta.flags }
        } catch (error) {
          if (body.source === 'official') throw error
          officialMeta = null // fall through to the mirror
        }
      }
      if (!officialMeta) {
        files = await downloadEntry(mirrorRepo, mirrorBranch, `${kind}s`, entryName)
        const landed = landEntry(P, kind, entryName, files)
        dest = landed.dest; report = landed.report
      }
      const registry = loadJson(P.registry, { version: 1, installed: {} })
      if (!registry.installed) registry.installed = {}
      const key = `${kind}/${entryName}`
      const previous = registry.installed[key]
      // Persist the catalog's localized label so UI never shows the raw dir id.
      const cache = loadJson(P.catalogCache, null)
      const meta = officialMeta
        ? { displayName: officialMeta.displayName, description: officialMeta.description, tags: officialMeta.tags, icon: officialMeta.icon }
        : cache?.index?.[`${kind}s`]?.find(e => e.name === entryName)
      const record = {
        kind, name: officialMeta?.name ?? entryName, dest,
        displayName: meta?.displayName || entryName,
        description: meta?.description || '',
        installedAt: new Date().toISOString(),
        files: report.files, bytes: report.bytes, flags: report.flags,
        linked: false,
        enabled: kind === 'connector' ? Boolean(previous?.enabled) : undefined,
      }
      if (kind === 'skill') {
        try { linkSkill(P, skillPrefix, officialMeta?.name ?? entryName); record.linked = true } catch (error) {
          report.flags.push(`symlink failed: ${error.message}`)
        }
      }
      if (kind === 'connector') {
        // A connector's usable surface is its bundled skills (CLI form) and/or
        // its MCP declaration (activated separately by the user).
        try {
          const linkedSkills = linkConnectorSkills(skillPrefix, entryName, dest)
          if (linkedSkills.length > 0) record.linkedSkills = linkedSkills
        } catch (error) {
          report.flags.push(`skill link failed: ${error.message}`)
        }
        const cli = readCliMeta(dest)
        if (cli !== null) record.cli = cli
        record.mcp = existsSync(join(dest, 'mcp.json'))
      }
      if (officialMeta) {
        record.source = 'official'
        record.officialId = officialMeta.officialId ?? null
        if (officialMeta.icon) record.icon = officialMeta.icon
        record.official = true
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
      // Tear the transport down (and await it) before deleting its files.
      if (kind === 'connector') {
        await connectors.disable(key)
        unlinkConnectorSkills(skillPrefix, record.linkedSkills)
      }
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

  // 启动时恢复用户已启用的连接器：enable 只作用于当前运行时的 MCP 挂载，
  // 所以重启后必须按 registry 记录重新挂载，否则「已启用」的连接器会静默失效。
  ctx.effect(() => {
    let cancelled = false
    const timer = setTimeout(async () => {
      try {
        const registry = loadJson(P.registry, { version: 1, installed: {} })
        const rows = Object.entries(registry.installed ?? {}).filter(([, r]) => r?.kind === 'connector' && r.enabled === true)
        for (const [key, record] of rows) {
          if (cancelled) return
          try {
            const mcpPath = join(record.dest, 'mcp.json')
            if (!existsSync(mcpPath)) continue
            const raw = JSON.parse(readFileSync(mcpPath, 'utf8'))
            const result = await connectors.enable(key, raw, record.name)
            noteConnectorStatus(key, { enabled: true, status: 'enabled', lastError: '', serverName: result.serverName, credentialRefs: result.refs, transport: result.summary.transport })
          } catch (error) {
            noteConnectorStatus(key, { enabled: false, status: 'failed', lastError: String(error?.message || error).slice(0, 300) })
          }
        }
      } catch { /* 没有可恢复的记录 */ }
    }, 1500)
    return () => { cancelled = true; clearTimeout(timer) }
  }, 'workbuddy-hub: restore enabled connectors')

  // 任何路由未捕获的异常都返回可诊断的 JSON（此前会得到空体 400，无法定位）。
  const guardedHandler = async (req, res) => {
    try {
      return await handler(req, res)
    } catch (error) {
      try { json(res, 500, { error: String(error?.message || error) }) } catch { /* headers sent */ }
      return true
    }
  }
  ctx.effect(
    () => ctx.webServer.register({ kind: 'prefix', path: PREFIX, handler: guardedHandler }),
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
