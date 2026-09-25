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
import { loginStart, loginPoll, loadAuth, saveAuth, bearer, marketList, marketCategories, connectorRegistry, connectorBound, connectorAuthStart, connectorRevoke, connectorOauthStatus, refreshIfNeeded, loadAuthHealth, saveAuthHealth, clearAuthHealth, onAuthEvent } from './wb-market.js'
import { KEEPALIVE_THRESHOLD_MS, reduceHealth, touchCheck, isStale } from './src/keepalive.js'
import { listExperts, categories as officialCategories, installExpert, registry as officialRegistry } from './wb-experts.js'
import {
  compareOfficial, compareSkillVersion, compareConnectorDef, summarizeUpdates,
  connectorDefHash, skillProvenance, expertProvenance, connectorProvenance,
} from './src/updates.js'
import { skillDetails } from './wb-market.js'
import { unzip } from './wb-unzip.js'
import { inspectExpert, inspectSkill, inspectConnector } from './wb-inspect.js'
import { scanFlags, scanMcpDefinitionFlags, SCAN_EXT } from './scan.js'
// 兼容导出：老调用方（test-local-mcp 等）直接 import index.js 的 scanFlags ——
// 实现的唯一真源在 ./scan.js，这里只转发。
export { scanFlags, scanMcpDefinitionFlags, SCAN_EXT }
import { execSync } from 'node:child_process'
import {
  existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync,
  symlinkSync, unlinkSync, lstatSync, statSync,
  openSync, readSync, closeSync,
} from 'node:fs'
import { createConnectorManager, validateConnectorMcp, buildMcpConfig, buildNativeRow, declaredServerNames, localMcpSpec, localTokenRefFor, MCP_SERVER_NAME_PATTERN, MCP_CLIENT_PACKAGE } from './mcp-manager.js'
import {
  readExpertPersona, buildPersonaLine, buildSummonPrompt,
  extractPersonaBody, sanitizePersonaBody,
} from './expert-persona.js'

export const name = 'workbuddy-hub'
// agentPresets 供「方案 B」使用：把专家做成真正的 agent preset，由用户在新会话里选中。
// tools：注册 workbuddy_install 工具（装前预检 + DSH 原生审批）。
export const inject = ['webServer', 'connection', 'loader', 'commands', 'subagents', 'credentials', 'sessions', 'agents', 'systemPrompt', 'agentPresets', 'sessionController', 'tools']

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

/**
 * DSH home（会话目录所在的根）。优先级与 DSH 自己的 `defaultDshHome` 一致：
 * `$DSH_HOME` → `~/.dsh`；**全空白视为未设置**（照抄上游语义，空白覆盖不应生效）。
 * 此前这里硬编码 `/home/kaitzh/.dsh`，换机器/换 home 就静默失效。
 */
export function dshHomeRoot(env = process.env) {
  const raw = String(env?.DSH_HOME ?? '')
  return raw.trim() === '' ? join(homedir(), '.dsh') : resolve(expandHome(raw.trim()))
}

/**
 * 会话日志文件名（按代际编址）：`session.jsonl` / `session.v3.jsonl` / `session.v4.jsonl`，
 * 以及它们的 `.zstd` 压缩形态。
 */
const SESSION_LOG_NAME = /^session(?:\.v(\d+))?\.jsonl(\.zstd)?$/

/**
 * 列出一个会话目录里的**全部代际**日志，最新代际在前。
 *
 * 为什么按代际降序：DSH 从 V3 升到 V4 后，新事件写进 `session.v4.jsonl.zstd`，而原
 * `session.v3.*` 文件**逐字节保留**（升级说明：后继发布、源文件不改）。所以两代同时存在时，
 * v4 才是「活的这一代」，v3 只是天然备份 —— 读 cwd 必须读最高代际，否则新会话读不到。
 * 同代际优先 `.zstd`（DSH 默认压缩写）。
 *
 * @returns {Array<{file: string, version: number, zstd: boolean}>}
 */
export function sessionLogsNewestFirst(dir) {
  const found = []
  for (const name of readdirSync(dir)) {
    const matched = SESSION_LOG_NAME.exec(name)
    if (!matched) continue
    found.push({
      file: join(dir, name),
      version: Number(matched[1] ?? 1),
      zstd: Boolean(matched[2]),
    })
  }
  found.sort((a, b) => (b.version - a.version) || (Number(b.zstd) - Number(a.zstd)))
  return found
}

/** 读一个会话日志文件的头部（至多 2 KiB），zstd 的走 `zstd -dc`，明文直接读前 2 KiB。 */
function readSessionLogHead({ file, zstd }) {
  if (zstd) {
    return execSync(`zstd -dc '${file}' 2>/dev/null | head -c 2048`,
      { encoding: 'utf8', timeout: 5000, maxBuffer: 4096 })
  }
  const fd = openSync(file, 'r')
  try {
    const buffer = Buffer.alloc(2048)
    const read = readSync(fd, buffer, 0, 2048, 0)
    return buffer.subarray(0, read).toString('utf8')
  } finally { closeSync(fd) }
}

/** 从磁盘会话日志头部读 cwd（内存里没有该会话时的兜底；代际无关，见 sessionLogsNewestFirst）。 */
export function readSessionCwdFromDisk(sessionId, env = process.env) {
  try {
    if (!/^[-\w]+$/.test(String(sessionId))) return ''
    const root = join(dshHomeRoot(env), 'sessions')
    for (const entry of readdirSync(root, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue
      const dir = join(root, entry.name, sessionId)
      if (!existsSync(dir)) continue
      for (const log of sessionLogsNewestFirst(dir)) {
        let head = ''
        try { head = readSessionLogHead(log) } catch { continue /* 这一代读不了就退到下一代 */ }
        const first = (head.split('\n').find(l => l.includes('"type":"session"')) || '')
        const cwd = /"cwd":"([^"]+)"/.exec(first)?.[1]
        if (cwd) return cwd
      }
    }
  } catch { /* 读不到返回空 */ }
  return ''
}

/** DSH 凭据引用名：官方 bearer 只以 ${WORKBUDDY_TOKEN} 形式出现在 mcp.json 里。 */
const WB_TOKEN_REF = 'WORKBUDDY_TOKEN'

const PROFILES_ROOT = join(homedir(), '.dsh', 'profiles')

/** 工具错误信息里展示原始参数用：压成单行并截断，绝不回显任意长度输入。 */
function oneLineOf(value, max = 40) {
  const s = String(value ?? '').replace(/\s+/g, ' ').trim()
  return s.length > max ? s.slice(0, max - 1) + '…' : s
}

export function storePaths(config) {
  const root = resolve(expandHome(config.storeRoot || '~/workbuddyskills'))
  return {    root,
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
    // 本地 MCP 服务器条目（与官方连接器分开：目录独立，绝不混进 connectors/，
    // 避免污染官方连接器列表与 /updates 的「连接器」判定）
    localMcpDir: join(root, 'mcp-servers'),
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
 * Safety scan — 实现已搬到 ./scan.js（宿主与 hub-find.mjs inspect 共用同一份）。
 * 兼容导出见文件顶部（import + export 转发，landEntry 内部也要用 scanFlags）。
 * ------------------------------------------------------------------ */

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

/** DSH skills 挂载目录（默认 ~/.dsh/skills；参数化是为了让测试不碰用户真实目录）。 */
export function skillsMountRoot() { return join(homedir(), '.dsh', 'skills') }

/** Symlink <skillsRoot>/<prefix><name> → storeRoot/skills/<name>. */
export function linkSkill(paths, prefix, entryName, skillsRoot = skillsMountRoot()) {
  const linkPath = join(skillsRoot, `${prefix}${entryName}`)
  const target = join(paths.skills, entryName)
  mkdirSync(skillsRoot, { recursive: true })
  try { lstatSync(linkPath); unlinkSync(linkPath) } catch { /* absent */ }
  symlinkSync(target, linkPath)
  return linkPath
}

export function unlinkSkill(prefix, entryName, skillsRoot = skillsMountRoot()) {
  const linkPath = join(skillsRoot, `${prefix}${entryName}`)
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

export function unlinkConnectorSkills(prefix, linked = [], skillsRoot = skillsMountRoot()) {
  for (const item of linked) {
    const name = typeof item === 'string' ? item : item?.name
    if (!name) continue
    try {
      const linkPath = join(skillsRoot, `${prefix}${name}`)
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
  let list = Array.isArray(store.sessions[sessionId]) ? store.sessions[sessionId] : []
  // 一个会话只允许一位专家（产品语义）：挂新专家时把旧的摘掉。
  // 必须在这一层兜住 —— firstMountedExpert 只取挂载列表里的**第一个**专家，
  // 若留着旧专家，新专家的 chip 就成了「假的」：界面显示已选、实际注入的却是旧专家。
  if (/^expert\//.test(String(key))) list = list.filter(k => !/^expert\//.test(String(k)))
  if (!list.includes(key)) list.push(key)
  store.sessions[sessionId] = list
  saveJson(paths.mounts, store)
  invalidateExpertCache() // 挂载变化后，下一步 assembly 即按新状态重算人设注入
  return list
}

export function unmountEntry(paths, sessionId, key) {
  const store = readMounts(paths)
  const list = (Array.isArray(store.sessions[sessionId]) ? store.sessions[sessionId] : []).filter(k => k !== key)
  store.sessions[sessionId] = list
  saveJson(paths.mounts, store)
  invalidateExpertCache()
  return list
}

/**
 * 从**所有**会话里摘掉某个 key（卸载时必须连带摘挂载），返回被清理的会话数。
 *
 * 为什么必须做：POST /uninstall 只删文件与注册表记录，会话里的挂载会留下一位
 * 「人设文件已被删掉」的专家 —— 界面 chip 还在，注入却失败或静默为空。
 *
 * 空列表语义与 unmountEntry 保持一致：列表被摘空时保留为空数组（不删会话键），
 * 这样「某会话曾挂过什么」的痕迹不会被悄悄抹掉，两个函数的落盘形状也一致。
 * 只要有会话被清理就写盘并作废人设缓存（否则下一步 assembly 还会读到旧人设）。
 */
export function pruneMounts(paths, key) {
  const target = String(key || '')
  if (target === '') return 0
  const store = readMounts(paths)
  let pruned = 0
  for (const [sessionId, list] of Object.entries(store.sessions)) {
    if (!Array.isArray(list) || !list.includes(target)) continue
    store.sessions[sessionId] = list.filter(k => k !== target)
    pruned += 1
  }
  if (pruned > 0) saveJson(paths.mounts, store)
  // 卸载后即使本次没摘到挂载（例如 mounts.json 损坏读不出来），也要让缓存作废：
  // 磁盘上的人设文件已经被删了，缓存里的旧正文绝不能再被注入。
  invalidateExpertCache()
  return pruned
}

/* ------------------------------------------------------------------ *
 * 专家人设注入 — 阶段 1 / 方案 A
 *
 * 用户选中专家后，把该专家的人设正文作为一段 system prompt section 动态注入
 * **当前会话**：section 的 text 是回调，每个 step 的 prompt assembly 都会重算，
 * 所以「切换专家 → 下一步生效」，不建子会话、也不写 agent preset。
 * ------------------------------------------------------------------ */

/** name -> 已剥 frontmatter 并 sanitize 过的人设正文。挂载变化时整体清空。 */
let expertCache = new Map()

/** 是否成功向 DSH 注册了 system prompt section（排障关键：为 false 说明注入整体没生效）。 */
let personaSectionRegistered = false

/** 清空人设缓存（挂载/卸载成功后调用）。 */
function invalidateExpertCache() {
  expertCache = new Map()
}

/**
 * 解析 nearSessionId 所属的工作区 id（只解析，不建会话）。
 * 顺序：① 工作区列表的 sessionIds 成员关系（基准事实，不依赖会话头 cwd）；
 *      ② 会话 cwd（内存头或磁盘日志兜底）→ resolveByPath；
 *      ③ 该目录从未注册 → 就地注册成工作区。
 */
async function resolveWorkspaceIdForSession(ctx, nearSessionId) {
  const reg = ctx.get?.('workspaceRegistry') ?? ctx.workspaceRegistry
  const near = nearSessionId ? String(nearSessionId) : ''
  // ① sessionIds 成员关系
  if (near) {
    try {
      for (const ws of (typeof reg?.list === 'function' ? reg.list() : [])) {
        if (Array.isArray(ws.sessionIds) && ws.sessionIds.some(i => String(i) === near)) {
          return ws.workspaceId
        }
      }
    } catch { /* ignore */ }
  }
  // ② cwd → resolveByPath
  let cwd = ''
  try {
    cwd = ctx.sessions?.get?.(near)?.header?.cwd || readSessionCwdFromDisk(near)
  } catch { /* ignore */ }
  if (cwd && typeof reg?.resolveByPath === 'function') {
    try {
      const ws = await reg.resolveByPath(cwd)
      if (ws?.workspaceId) return ws.workspaceId
    } catch { /* ignore */ }
  }
  // ③ 注册新工作区
  if (cwd && typeof reg?.create === 'function') {
    try {
      const ws = await reg.create(cwd)
      if (ws?.workspaceId) return ws.workspaceId
    } catch (error) {
      console.warn('[wbh] workspace create failed:', String(error?.message || error))
    }
  }
  return ''
}

/** 从 mounts.json 取该会话挂载的第一个专家目录名；轻量、容错，读不到就返回 ''。 */
function firstMountedExpert(mountsPath, sessionId) {
  const store = loadJson(mountsPath, null)
  const list = Array.isArray(store?.sessions?.[sessionId]) ? store.sessions[sessionId] : []
  for (const key of list) {
    const hit = /^expert\/([\w.-]+)$/.exec(String(key))
    if (hit) return hit[1]
  }
  return ''
}

/**
 * 该会话当前应注入的专家人设正文。
 * 参数为空 / 未挂载专家 / 文件缺失 / 解析失败 / 被配置禁用 → 一律返回 ''。
 * preStep 的 assemble 没有 try/catch，所以这里**任何异常都必须吞掉**。
 */
function injectedExpertPersona(paths, sessionId, disabled) {
  try {
    if (disabled) return ''
    const id = String(sessionId || '').trim()
    if (id === '') return ''
    const expertName = firstMountedExpert(paths.mounts, id)
    if (expertName === '') return ''
    const cached = expertCache.get(expertName)
    if (cached !== undefined) return cached
    const read = readExpertPersona(paths.experts, expertName)
    // 接管语义：直接注入专家人设正文（替换部署人设），不加「仅作参考」声明
    const body = read.ok ? presetPersonaText(read.persona) : ''
    expertCache.set(expertName, body)
    return body
  } catch {
    return ''
  }
}

/* ------------------------------------------------------------------ *
 * 方案 B：每专家一个 agent preset（真接管）
 *
 * 与方案 A（注入当前会话的 system prompt）并存：A 是默认动作，B 是可选动作 ——
 * 把专家人设写进一个 user root 里的 preset，用户在新会话里选中它，该会话的
 * persona / 工具面就由这份 preset 决定（真接管，不再依赖 section 叠加）。
 * ------------------------------------------------------------------ */

/** 专家 preset id；expertName 必须已通过 /^[\w.-]+$/ 校验。 */
export function expertPresetId(expertName) {
  return `workbuddy-${expertName}`
}

/** 进 preset 的人设正文上限（字符）；超长截断并注明。 */
const MAX_PRESET_PERSONA_CHARS = 12000

/**
 * 专家人设正文 → 可直接放进 preset YAML 的文本：
 *  - 剥掉 frontmatter（extractPersonaBody）；
 *  - 剥掉 `{{` / `}}`：preset 的 persona section 走**严格插值**，专家正文里
 *    残留的模板变量会让 renderPrompt 因未知变量直接抛错，必须清掉；
 *  - 超长截断。
 */
export function presetPersonaText(persona) {
  let text = extractPersonaBody(persona).replace(/\{\{|\}\}/g, '').trim()
  if (text.length > MAX_PRESET_PERSONA_CHARS) {
    text = `${text.slice(0, MAX_PRESET_PERSONA_CHARS)}\n\n（人设正文过长，已截断至前 ${MAX_PRESET_PERSONA_CHARS} 字符。）`
  }
  return text
}

/**
 * 把 agent.cordis.yml 里 `- id: persona` 块的 `prefix:` 值换成 YAML literal
 * block scalar（`|`，正文每行 6 空格缩进），换行原样保留；同块的 suffix 及其它
 * 行一律不动。找不到 persona 块 / prefix 键时抛错（调用方转成 ok:false）。
 * 只用 `|` 不用 `>-`：后者会把正文折成一行。
 */
export function replacePersonaPrefix(yaml, body) {
  const lines = String(yaml).split('\n')
  const start = lines.findIndex(line => /^- id:\s*persona\s*$/.test(line))
  if (start < 0) throw new Error('agent.cordis.yml 里没有 `- id: persona` 块')
  let end = lines.length
  for (let i = start + 1; i < lines.length; i += 1) {
    if (/^- id:/.test(lines[i])) { end = i; break }
  }
  const key = lines.findIndex((line, i) => i > start && i < end && /^ {4}prefix:/.test(line))
  if (key < 0) throw new Error('persona 块里没有 `prefix:` 键')
  // 吃掉 prefix 的旧值：块标量（>-, |, |- …）继续到缩进不足 6 为止；行内标量只吃本行。
  let stop = key + 1
  if (/^ {4}prefix:\s*[|>][+-]?\s*$/.test(lines[key])) {
    while (stop < end && /^ {5,}\S/.test(lines[stop])) stop += 1
  }
  const block = String(body).split('\n').map(line => (line.trim() === '' ? '' : `      ${line}`))
  lines.splice(key, stop - key, '    prefix: |', ...block)
  return lines.join('\n')
}

/* ------------------------------------------------------------------ *
 * 专家预设：两套模型并存（0.1.6 磁盘副本 / 0.1.7 运行时声明）
 *
 * 0.1.6：预设是磁盘目录，`agentPresets.copy('standard', id, name)` 复制一份内置 standard
 *        到 `$DSH_HOME/.agent-presets/<id>/`，再改写里面 persona 行的 prefix。
 * 0.1.7：**预设只能是声明**——`$DSH_HOME/.agent-presets/` 已无人读取，`copy`/`remove` 都被
 *        删除；声明方用 `agentPresets.register(definition)` 提供完整 rows 并**自己持有
 *        disposer**（重复注册会抛 `Duplicate agent preset`）。
 *        rows 从 loader 里那条 `preset-standard` 声明行的**已解析 config**里取——这是进程内
 *        唯一带 config 的结构化来源（`readDocument()` 只给 YAML 文本、`compositionInventory()`
 *        只给 rows 元数据，都不够用来 register）。
 * 两套都用 `resolve(id)` 探活做幂等（两版的 resolve 对未知 id 都抛 agent-preset/not-found）。
 * ------------------------------------------------------------------ */

/** 本插件声明过的专家预设：presetId → disposer（0.1.7 才有）。 */
const expertPresetDisposers = new Map()

/** 声明模型是否可用（0.1.7 有 register / 没有 copy）。 */
export function usesPresetDeclarations(presets) {
  return typeof presets?.register === 'function' && typeof presets?.copy !== 'function'
}

/**
 * 从 loader 里找 standard 预设的声明行，返回其 `config`（含 plugins 行列表）。
 * 行 id 约定是 `preset-<id>`；同时兜底遍历一遍 entries，避免用户改过行 id。
 */
export function standardPresetDeclaration(ctx, presetName = 'standard') {
  const loader = ctx?.loader ?? ctx?.get?.('loader', false)
  if (!loader) return undefined
  const candidates = []
  try { candidates.push(loader.resolve?.(`preset-${presetName}`)) } catch { /* 约定 id 不存在 → 走遍历 */ }
  try {
    if (typeof loader.entries === 'function') for (const entry of loader.entries()) candidates.push(entry)
  } catch { /* 遍历不了就只认约定 id */ }
  for (const entry of candidates) {
    const options = entry?.options
    if (!options || options.name !== '@deepseek-ai/dsh-agent-preset') continue
    const config = options.config
    if (!config || config.id !== presetName || !Array.isArray(config.plugins)) continue
    return config
  }
  return undefined
}

/**
 * 把专家人设注入一份兼容预设行列表：替换 persona 行的 `config.prefix`。
 * 不改写别的行、不删行；找不到 persona 行就抛错（宁可失败也不留个没有人设的空壳）。
 */
export function injectPersonaRows(rows, body) {
  let hit = false
  const out = rows.map(row => {
    if (!row || typeof row !== 'object') return row
    const isPersona = row.id === 'persona' || row.name === '@deepseek-ai/dsh-persona'
    if (!isPersona) return row
    hit = true
    return { ...row, config: { ...(row.config || {}), prefix: String(body) } }
  })
  if (!hit) throw new Error('standard 组合里没有 persona 行')
  return out
}

/** 释放一个专家预设：0.1.7 用自己持有的 disposer；0.1.6 回退到 `remove(id)`（删目录）。 */
export async function disposeExpertPreset(ctx, presetId) {
  const dispose = expertPresetDisposers.get(presetId)
  if (typeof dispose === 'function') {
    expertPresetDisposers.delete(presetId)
    try { await dispose() } catch { /* 释放失败不改调用方结论 */ }
    return true
  }
  // 0.1.7 没有 `remove`：不由我们声明的预设（别人的声明 / 上一进程的声明）本来就无可释放，
  // 这里必须如实返回 false，而不是假装成功。
  const remove = ctx?.agentPresets?.remove
  if (typeof remove !== 'function') return false
  try { await remove.call(ctx.agentPresets, presetId); return true } catch { return false }
}

/** 释放本插件声明过的全部专家预设（插件卸载 / 热重载时调用）。 */
export async function disposeAllExpertPresets() {
  const ids = [...expertPresetDisposers.keys()]
  for (const id of ids) await disposeExpertPreset(undefined, id)
  return ids
}

/**
 * 确保某专家在 user root 里有一份 agent preset（幂等：已存在直接复用）。
 * @returns {Promise<{ok: true, presetId: string} | {ok: false, error: string}>}
 */
export async function ensureExpertPreset(ctx, paths, expertName) {
  const name = String(expertName || '')
  if (!/^[\w.-]+$/.test(name)) return { ok: false, error: `invalid expert name "${name}"` }
  const presets = ctx?.agentPresets
  const declare = usesPresetDeclarations(presets)
  const legacyCopy = typeof presets?.copy === 'function'
  if (!presets || typeof presets.resolve !== 'function' || (!declare && !legacyCopy)) {
    return { ok: false, error: 'agentPresets unavailable' }
  }
  const presetId = expertPresetId(name)
  // 幂等：上一轮召唤已经建过就直接复用（0.1.7 下重复 register 会抛 Duplicate agent preset）。
  try {
    await presets.resolve(presetId)
    return { ok: true, presetId }
  } catch { /* 不存在 → 下面创建 */ }

  const read = readExpertPersona(paths.experts, name)
  if (!read.ok) return { ok: false, error: `专家人设不可用：${read.error}` }
  const body = presetPersonaText(read.persona)
  if (body === '') return { ok: false, error: '专家人设正文为空' }

  if (declare) {
    // ---- 0.1.7：声明模型 ----------------------------------------------------
    const standard = standardPresetDeclaration(ctx)
    if (!standard) return { ok: false, error: '找不到 standard 预设声明（Loader 里没有 preset-standard 行）' }
    let plugins
    try { plugins = injectPersonaRows(standard.plugins, body) } catch (error) {
      return { ok: false, error: `注入专家人设失败：${String(error?.message || error)}` }
    }
    const record = loadJson(paths.registry, { version: 1, installed: {} })?.installed?.[`expert/${name}`] || {}
    const definition = {
      id: presetId,
      name: read.title || name,
      ...(String(record.description || read.description || '') === ''
        ? {} : { description: String(record.description || read.description) }),
      // 排在官方预设之后（standard 是 1），专家之间保持稳定顺序
      order: (Number.isFinite(Number(standard.order)) ? Number(standard.order) : 1) + 100,
      plugins,
    }
    let dispose
    try {
      dispose = await presets.register(definition)
    } catch (error) {
      const message = String(error?.message || error)
      // 并发/热重载竞态：别人（或上一轮）已经声明过同一个 id → 当作既存复用
      if (/Duplicate agent preset/.test(message)) return { ok: true, presetId }
      return { ok: false, error: `声明专家预设失败：${message}` }
    }
    expertPresetDisposers.set(presetId, dispose)
    // 声明成功 ≠ 行可用：新模型下激活失败仍会 resolve，用 broken 复核（宁可现在失败）
    try {
      const verified = await presets.resolve(presetId)
      if (verified?.broken !== undefined) throw new Error(String(verified.broken))
    } catch (error) {
      await disposeExpertPreset(ctx, presetId)
      return { ok: false, error: `专家预设不可用：${String(error?.message || error)}` }
    }
    return { ok: true, presetId }
  }

  // ---- 0.1.6：磁盘副本模型 ------------------------------------------------
  try {
    await presets.copy('standard', presetId, read.title || name)
  } catch (error) {
    return { ok: false, error: `创建专家预设失败：${String(error?.message || error)}` }
  }
  try {
    const resolved = await presets.resolve(presetId)
    const file = resolved?.path
    if (!file) throw new Error('resolve 未返回 preset 文件路径')
    writeFileSync(file, replacePersonaPrefix(readFileSync(file, 'utf8'), body))
    // 用 DSH 自己的 discovery 复核一遍：它用 loader 的 YAML dialect 解析，
    // broken 非空说明这份 preset 装不起来（宁可现在失败，也不留个装不上的空壳）。
    const verified = await presets.resolve(presetId)
    if (verified?.broken !== undefined) throw new Error(String(verified.broken))
  } catch (error) {
    try { await presets.remove?.(presetId) } catch { /* 清不掉也不影响报错 */ }
    return { ok: false, error: `写入专家预设失败：${String(error?.message || error)}` }
  }
  return { ok: true, presetId }
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
  // 官方源是唯一真源；GitHub 镜像只是**默认关闭**的灾备开关（官方挂了才临时打开）。
  // 为 false 时：官方失败就如实暴露失败（列表空 + 可读原因），绝不静默换成镜像内容。
  // 注意：/updates 永远不用镜像（纯官方元数据比对），与这个开关无关。
  const mirrorFallback = cfg.mirrorFallback === true
  const skillPrefix = cfg.skillPrefix || 'workbuddy-'
  // DSH skills 挂载目录（默认 ~/.dsh/skills）。**参数化是为了隔离测试**：此前它硬编码
  // homedir，导致任何指向临时 storeRoot 的隔离实例装技能时，都会往用户真实 ~/.dsh/skills
  // 里塞软链（实测泄漏过一个指向已删临时目录的断链）。
  const skillsMount = cfg.skillsMount ? resolve(expandHome(cfg.skillsMount)) : skillsMountRoot()
      const P = storePaths(cfg)
  for (const d of [P.root, P.store, P.skills, P.experts, P.connectors, P.meta, P.icons]) {
    mkdirSync(d, { recursive: true })
  }

  // 专家人设注入：只在 apply() 里注册一次（section 的 name 在同一层唯一，重复注册
  // 会抛错）。text 是回调 → 每个 step 的 assembly 都会重算，因此挂载/切换专家
  // 「下一步生效」。order 紧邻部署人设之后；interpolate:false 保证人设正文里的
  // 方案 C：注入 + 接管。挂 system-prompt/assemble 的 waterfall 监听，在每次
  // assembly 完成后、把 deployment:persona-prefix 段**替换**成专家人设正文（而非叠加）。
  // 这样「你是谁」干净答「我是专家」，且动态换专家下一步生效、不建新会话、不写 preset。
  const injectExperts = cfg.injectExperts !== false
  try {
    ctx.on('system-prompt/assemble', async (_assembly, context, next) => {
      const assembly = await next()
      const sessionId = context?.scope?.id
      if (!injectExperts || !sessionId) return assembly
      const body = injectedExpertPersona(P, sessionId, false)
      if (body === '') return assembly
      const idx = Array.isArray(assembly?.sections) ? assembly.sections.findIndex(item => item?.name === 'deployment:persona-prefix') : -1
      if (idx >= 0) {
        assembly.sections[idx] = { ...assembly.sections[idx], text: body, interpolate: false }
        personaSectionRegistered = true
      }
      return assembly
    }, { prepend: true })
  } catch { /* 环境没有 system-prompt 事件：跳过注入 */ }

  // Connector MCP fibers are owned here; unloading the plugin (or HMR) tears
  // every transport down instead of leaving orphaned registrations behind.
  const connectors = createConnectorManager(ctx)
  ctx.effect(() => () => connectors.disposeAll(), 'workbuddy-hub: connector transports')

  /* ---------------------------------------------------------------- *
   * 本地 MCP 服务器（用户手工注册的 loopback 服务，如 Docker 里的 scrapling）
   *
   * ⚠️ 威胁模型（如实声明，不做超出模型的安全承诺）：
   * 这些路由与插件的其它路由共用同一道 DSH 连接栅栏（ctx.connection.requestRejection，
   * 路由入口统一调用），它拦的是「未经授权的浏览器/外部访问」，拦不住本机进程。
   * 而 agent 本身（比如经技能文档指导）就能 curl 这些本地路由 —— 所以四道栅栏
   * （localMcp 默认关 / 仅 loopback / v1 拒绝 stdio / 全程可见 + 立即生效）的目标是：
   *   1) 不让权限**静默升级**（默认关、stdio 拒绝、loopback 白名单都是显式约束）；
   *   2) 全程可见（注册/启用/停用/移除都打 console 日志 + 条目里留时间戳）；
   *  3) 一键可撤（disable/remove 立即 dispose mcp-client 行，工具当场从注册表消失）。
   * 它们**不是**针对「已被完全控制的 agent」的防御 —— 一个完全受控的 agent 本来
   * 就可以直连 loopback 服务或改写插件代码；那类威胁归 DSH 宿主与用户监督处理。
   *
   * 凭据：token 只经 ctx.credentials.set 存进 DSH 凭据库（refs 表，0600，热加载），
   * 条目文件/响应/日志里只出现引用名（${REF}），绝不出现明文。
   * ---------------------------------------------------------------- */
  const localMcpEnabled = cfg.localMcp === true
  const LOCAL_MCP_GUARD = '本地 MCP 管理未开启：请在插件配置里设 localMcp: true（默认关闭）'
  // 专家预设（0.1.7 声明模型）：disposer 由**声明方**持有，插件卸载 / HMR 时必须释放，
  // 否则热重载后再 register 同一个 id 会抛 `Duplicate agent preset`。
  ctx.effect(() => () => disposeAllExpertPresets(), 'workbuddy-hub: expert preset declarations')
  // 0.1.7 的声明活在进程里：重启后 `workbuddy-<专家>` 就没人声明了，而**已经选中过该预设的
  // 会话**在恢复时会 `agent-preset/not-found`（与遗留预设目录失效同一类故障）。所以启动后
  // 为**已安装的专家**补一次声明，把 0.1.6 里「预设目录持久存在」的语义补齐。
  // 失败只记日志：绝不因为补声明失败影响插件启动。
  if (usesPresetDeclarations(ctx.agentPresets)) {
    void (async () => {
      try {
        await ctx.loader?.await?.()
        const registry = loadJson(P.registry, { version: 1, installed: {} })
        const names = Object.values(registry.installed ?? {})
          .filter(record => record?.kind === 'expert' && typeof record.name === 'string')
          .map(record => record.name)
        let declared = 0
        for (const name of names) {
          const result = await ensureExpertPreset(ctx, P, name)
          if (result.ok) declared += 1
          else console.warn(`[wbh] expert preset re-declare failed: ${name} — ${result.error}`)
        }
        if (names.length > 0) console.info(`[wbh] expert presets declared at startup: ${declared}/${names.length}`)
      } catch (error) {
        console.warn('[wbh] expert preset startup declaration skipped:', String(error?.message || error))
      }
    })()
  }
  // 本地 MCP 的运行时挂载（同 connectors 的 mounted Map）。
  const localMcpRuntime = new Map()
  // 插件卸载 / HMR 时拆掉所有本地 MCP 传输（不留孤儿注册）。
  ctx.effect(() => () => {
    for (const name of [...localMcpRuntime.keys()]) void disableLocalMcp(name)
  }, 'workbuddy-hub: local MCP transports')
  // 隔离测试需要看到「门关着」这一事实；false 时仍返回 guarded:true，不暴露任何条目数据。
  if (!localMcpEnabled) {
    mkdirSync(P.localMcpDir, { recursive: true })
  }

  const localMcpPath = name => join(P.localMcpDir, `${name}.json`)
  const readLocalMcp = name => {
    try { return JSON.parse(readFileSync(localMcpPath(name), 'utf8')) } catch { return null }
  }
  const listLocalMcp = () => {
    const out = []
    try {
      for (const f of readdirSync(P.localMcpDir)) {
        if (!f.endsWith('.json')) continue
        const entry = readLocalMcp(f.slice(0, -5))
        if (entry?.name) out.push(entry)
      }
    } catch { /* 目录不存在 → 空 */ }
    return out
  }
  const saveLocalMcp = entry => {
    mkdirSync(P.localMcpDir, { recursive: true })
    writeFileSync(localMcpPath(entry.name), JSON.stringify(entry, null, 2))
  }
  /** 谁在操作（审计字段）。DSH 前缀路由下没有按用户鉴权，能记多少记多少。 */
  const auditNote = req => `remote=${req?.socket?.remoteAddress || 'unknown'}`
  /** 栅栏 d) 可见性：每个写动作一条 console 日志（只含引用名，绝不含 token 明文）。 */
  const auditLog = (action, name, detail) => {
    console.info(`[wbh] localMcp ${action}: ${name} ${detail}`)
  }

  /** 条目 → 列表视图（绝不包含 token 明文；工具数实时从活注册表算）。 */
  const localMcpView = entry => {
    const live = entry.serverName ? liveToolView(entry.serverName) : null
    return {
      name: entry.name,
      url: entry.url,
      transport: entry.transport || 'streamable-http',
      tokenRef: entry.tokenRef || '',
      // 只暴露「凭据是否已配置」，不暴露值本身（hasToken 甚至也不回传值的存在性以外的信息）
      tokenRefSet: Boolean(entry.tokenRef),
      serverName: entry.serverName || '',
      enabled: Boolean(entry.enabled),
      toolCount: live?.available ? live.count : null,
      lastError: String(entry.lastError || ''),
      note: String(entry.note || ''),
      createdAt: entry.createdAt || '',
      updatedAt: entry.updatedAt || '',
      lastEnabledAt: entry.lastEnabledAt || '',
      lastDisabledAt: entry.lastDisabledAt || '',
      removedAt: entry.removedAt || '',
    }
  }

  /** 启用一条本地 MCP（路由与启动恢复共用）。失败抛错且绝不置 enabled。 */
  const enableLocalMcp = async entry => {
    const spec = localMcpSpec({ name: entry.name, url: entry.url, tokenRef: entry.tokenRef })
    if (!spec.ok) throw new Error(spec.error)
    if (localMcpRuntime.has(entry.name)) await disableLocalMcp(entry.name)
    const resolved = {}
    const credentials = ctx.credentials
    const missing = []
    for (const ref of spec.refs) {
      try {
        const value = (await credentials?.resolve?.(ref))?.value
        if (value === undefined || value === '') missing.push(ref)
        else resolved[ref] = value
      } catch { missing.push(ref) }
    }
    let authMode
    const server = structuredClone(spec.server)
    if (missing.length > 0) {
      // 凭据还没配置：按「未鉴权」明示降级（连接可能被服务器 401 拒绝 —— 那也是可见的失败）。
      delete server.headers.Authorization
      authMode = 'unauthorized'
    } else {
      authMode = 'token'
    }
    const id = await ctx.loader.create({ name: MCP_CLIENT_PACKAGE, config: buildMcpConfig(server, spec.serverName, resolved) })
    const created = ctx.loader.resolve?.(id)
    if (created?.fiber !== undefined) {
      try { await created.fiber.await() } catch (error) {
        const disposal = created.fiber.dispose()
        ctx.loader.remove(id)
        await disposal
        throw error instanceof Error ? error : new Error(String(error))
      }
    }
    localMcpRuntime.set(entry.name, { id, serverName: spec.serverName })
    return { serverName: spec.serverName, authMode }
  }

  /** 停用并立即 dispose（本地 MCP 与连接器共用同一套 fiber 管理方式）。 */
  const disableLocalMcp = async name => {
    const live = localMcpRuntime.get(name)
    if (live === undefined) return false
    localMcpRuntime.delete(name)
    const entry = ctx.loader.store?.[live.id]
    if (entry !== undefined) {
      const disposal = entry.fiber?.dispose()
      ctx.loader.remove(live.id)
      await disposal
    }
    return true
  }


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
   *
   * ⚠️ 这个兜底**只服务于只读路由**（/mounted、/active-session、/expert-injection 等）。
   * 写路由（POST /mount、POST /unmount）必须显式传入 sessionId：缺失时直接 409，
   * 绝不退化为「最近会话」—— 否则会把专家静默挂进用户根本没在看的那个会话。
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
   * 召唤用的父 agent：优先目标会话自己的 agent；若该会话还没有活跃 agent
   * （刚建的空会话、用户还没发过消息），退化为最近活跃的 agent —— 否则召唤会
   * 直接 409，用户看到的就是「点了没反应」。返回来源以便如实告知。
   */
  const resolveSummonParent = sessionId => {
    const own = resolveAgent(sessionId)
    if (own) return { agent: own, source: 'session' }
    try {
      const live = ctx.agents?.list?.() ?? []
      const last = live.length > 0 ? live[live.length - 1] : null
      if (last) return { agent: last, source: 'recent-agent' }
    } catch { /* ignore */ }
    return { agent: null, source: 'none' }
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

  /**
   * 本进程里**所有**以 mcp__<serverName>__ 形式注册的 MCP 服务器 → 工具数。
   * DSH 的 tools 服务按 scope chain 现算，所以这里看到的就是「当前真的加载了哪些 MCP」，
   * 不管它是本插件托管的本地 MCP、官方连接器建立的 MCP 行，还是 DSH 配置 / 其它插件
   * （如 openviking 的 mcp-proxy）拉起来的服务器。
   */
  const liveServerNames = () => {
    const out = {}
    try {
      const tools = ctx.get?.('tools', false)
      if (!tools || typeof tools.schemas !== 'function') return out
      for (const schema of tools.schemas()) {
        const name = schema?.name
        if (typeof name !== 'string' || !name.startsWith('mcp__')) continue
        const rest = name.slice('mcp__'.length)
        // 按**第一个** __ 切：DSH 的 serverName 契约是 [A-Za-z0-9_-]{1,32}
        // （packages/mcp/mcp-client 的 SERVER_NAME_PATTERN），所以 serverName 里
        // 不可能出现 __；而工具名里可以（真机撞到过 mcp__tdocs-app__smartsheet__add_…，
        // 按最后一个 __ 切会凭空造出一个不存在的服务器）。
        const cut = rest.indexOf('__')
        if (cut <= 0) continue
        const server = rest.slice(0, cut)
        out[server] = (out[server] || 0) + 1
      }
    } catch { /* 读不到就返回空表：调用方按「没有活工具」呈现 */ }
    return out
  }

  /**
   * 宿主侧 MCP 总清单（picker 的「本机 MCP」用它）。三类来源，边界明确：
   *  · local-mcp：本插件托管的本地 MCP（storeRoot/mcp-servers/*.json）—— 可开关；
   *  · connector：官方连接器落地后建立的 MCP 行 —— 连接器列表里已单列，这里带上
   *    serverName 供对账（客户端会跳过它，避免重复展示）；
   *  · dsh：进程里确实有 mcp__<server>__ 工具，但不属于上面两类 —— 由 DSH 配置或
   *    其它插件加载。**只读展示**：插件不代管别人的 profile/配置，绝不替用户改写。
   */
  const hostMcpInventory = () => {
    const live = liveServerNames()
    const out = []
    for (const entry of listLocalMcp()) {
      const serverName = entry.serverName || entry.name
      out.push({
        name: entry.name, serverName, source: 'local-mcp', managed: true,
        enabled: Boolean(entry.enabled), toolCount: live[serverName] ?? 0,
        url: entry.url || '', transport: entry.transport || 'streamable-http',
        tokenRef: entry.tokenRef || '', lastError: String(entry.lastError || ''),
      })
      delete live[serverName]
    }
    const registry = loadJson(P.registry, { version: 1, installed: {} })
    for (const rec of Object.values(registry.installed ?? {})) {
      if (rec?.kind !== 'connector') continue
      const serverName = rec.serverName || rec.name
      out.push({
        name: rec.name, serverName, source: 'connector', managed: true,
        enabled: Boolean(rec.enabled), toolCount: live[serverName] ?? 0, connector: rec.name,
      })
      delete live[serverName]
    }
    for (const [serverName, toolCount] of Object.entries(live)) {
      out.push({
        name: serverName, serverName, source: 'dsh', managed: false,
        enabled: true, toolCount,
        note: '由 DSH 配置或其它插件加载：本插件只展示，不代管（改配置请走 DSH 自己的设置）',
      })
    }
    out.sort((a, b) => (Number(b.toolCount) - Number(a.toolCount)) || a.name.localeCompare(b.name))
    return out
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

  /* ---------------------------------------------------------------- *
   * 「检查更新」辅助（GET /updates 用）
   *
   *  判定**只认官方元数据**（技能 version / 专家 updatedAt / 连接器 MCP 定义哈希），
   *  不再碰 GitHub 镜像、不再算任何文件 sha；安装时记下的 officialMeta 是唯一本地依据。
   *  · 检查结果整体缓存 60 秒（?refresh=1 强制重算），让重复调用便宜；
   *  · 缓存只在内存里，**不写盘、不碰注册表**（路由是只读的）。
   * ---------------------------------------------------------------- */
  const UPDATES_RESULT_TTL_MS = 60 * 1000
  let updatesResultCache = null

  /* ---------------------------------------------------------------- *
   * 账号保活（keepalive）+「已登录但凭证失效」判定
   *
   * 背景：refresh_token 本身也会过期 —— 长期不打开 DSH / 不访问市场时，只有
   * 「有请求才刷」的惰性刷新（wb-market.bearer）根本不会触发，凭证最终彻底失效。
   * 因此这里按上游 workbuddy2api 的规则做**主动**保活：
   *  · 周期 30 分钟巡检一次（上游按整点、每日 22:00 集中保活；本插件随 DSH 长驻，
   *    30 分钟一次成本可忽略且更稳）；启动后先立刻巡检一次，但不阻塞插件加载；
   *  · 剩余寿命不足 2 小时（KEEPALIVE_THRESHOLD_MS）就主动 refresh；
   *  · 连续 3 次失败（含官方 12153）判「会话失效」→ 需要用户重新扫码；
   *  · 用「运行中」标志防重入（对应上游调度器的运行锁）。
   * 纯判定逻辑在 src/keepalive.js（可单测），这里只做调度与落盘。
   * ---------------------------------------------------------------- */
  const AUTH_KEEPALIVE_INTERVAL_MS = 30 * 60 * 1000

  /** 读健康档 → 应用一个保活事件 → 落盘；返回最新健康档。 */
  const noteAuthHealth = (type, error) => {
    const next = reduceHealth(loadAuthHealth(P.state), {
      type,
      at: Date.now(),
      error: error ? String(error?.message || error).slice(0, 300) : '',
    })
    saveAuthHealth(P.state, next)
    return next
  }

  /** 未到阈值（本次没有真正刷新）：只更新巡检时间，成功/失败计数都不动。 */
  const noteAuthCheckOnly = () => saveAuthHealth(P.state, touchCheck(loadAuthHealth(P.state), Date.now()))

  // 官方任意接口返回 12153（session 失效）→ 与定时巡检走同一套计数。
  // refresh 端点自身的 12153 不在广播范围内（由 refreshIfNeeded 的返回值计数），
  // 所以同一次失败不会被记两遍。
  ctx.effect(() => onAuthEvent(event => {
    if (event?.type === 'session-dead') noteAuthHealth('session-dead', event.error)
    else if (event?.type === 'refresh-ok') noteAuthHealth('refresh-ok')
  }), 'workbuddy-hub: auth keepalive events')

  // 保活定时器：apply() 时启动，插件卸载 / ctx 销毁时清掉。
  ctx.effect(() => {
    if (cfg.keepalive === false) return () => {}   // 显式关闭（测试/排障用）
    let running = false       // 运行锁：上一轮没跑完就跳过本轮，绝不重入
    let stopped = false
    const tick = async () => {
      if (stopped || running) return
      running = true
      try {
        const auth = loadAuth(P.state)
        if (!auth?.access_token) return                     // 未登录：跳过，不写健康档
        const result = await refreshIfNeeded(P.state, { thresholdMs: KEEPALIVE_THRESHOLD_MS })
        if (result.ok) {
          if (result.refreshed) noteAuthHealth('refresh-ok') // 成功 → 连续失败清零
          else noteAuthCheckOnly()                          // 未到阈值 → 不算成功也不算失败
        } else if (result.reason === 'no-credentials') {
          return                                            // 没有 refresh_token：交给重新登录
        } else {
          // 刷新失败 → 计数加一；官方 12153 直接按 session-dead 记（共用同一计数器）
          noteAuthHealth(result.sessionDead ? 'session-dead' : 'refresh-fail', result.error)
        }
      } catch (error) {
        noteAuthHealth('refresh-fail', error)               // 兜底：任何异常都算一次失败
      } finally {
        running = false
      }
    }
    // 「开服先巡检」：立刻排一次，但用 setTimeout 0 让出加载流程（不阻塞 apply）
    const first = setTimeout(() => { void tick() }, 0)
    const timer = setInterval(() => { void tick() }, AUTH_KEEPALIVE_INTERVAL_MS)
    // unref：定时器不把进程吊住（短命进程 / 测试里不会因为它在后台而挂住）
    first.unref?.(); timer.unref?.()
    return () => { stopped = true; clearTimeout(first); clearInterval(timer) }
  }, 'workbuddy-hub: auth keepalive timer')

  /**
   * 官方连接器落地（连接器安装的唯一真源）：官方注册表该行 → 本地 mcp.json。
   * 密钥只以 `${WORKBUDDY_TOKEN}` 引用落盘，绝不写明文。
   *
   * 返回 { ok:true, dest, row, flags, bytes, defHash } 或 { ok:false, status, error }。
   * 用返回值而不是抛错，是为了让两条调用方（POST /connectors/install 与 POST /install）
   * 各自保留原有的状态码语义（404 未收录 / 400 无 MCP 网关 / 502 上游失败）。
   */
  const landOfficialConnector = async entryName => {
    let rows
    try {
      rows = await connectorRegistry(P.state)
    } catch (error) {
      return { ok: false, status: 502, error: `connector install failed: ${String(error?.message || error)}` }
    }
    const row = rows.find(r => r.name === entryName)
    if (!row) return { ok: false, status: 404, error: `connector not in official registry: ${entryName}` }
    const gateway = row.mcp?.gateway_url
    if (!gateway) return { ok: false, status: 400, error: 'connector has no MCP gateway (CLI or skill-only connector)' }
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
    return {
      ok: true, dest, row, flags,
      bytes: Buffer.byteLength(mcpText),
      defHash: connectorDefHash(row.mcp),
    }
  }

  /**
   * 安装一个条目（官方优先，mirrorFallback 灾备）—— **路由（POST /install）与工具
   * （workbuddy_install）共用的唯一实现**，避免两条安装链路分叉。
   *
   * @param {object} ctx0 Hub 宿主 ctx（连接器凭据写入 credentials 用；与 apply 的 ctx 相同）
   * @param {object} P storePaths(cfg) 的路径表
   * @param {object} cfg0 插件配置（skillPrefix / skillsMount / mirrorFallback / storeRoot 等）
   * @param {{kind:'expert'|'skill'|'connector', name:string, source?:'official'|'mirror'}} spec
   * @returns {Promise<{key:string, report:{files,bytes,flags}, linked:boolean, dest:string}>}
   *   与原 POST /install 成功响应等价（key/report/linked）。
   * @throws {Error} 失败时抛错；错误对象带 `installFailure = { status }`（路由据此
   *   回原状态码 502/404/400；工具 handler 直接把 message 给模型）。
   */
  const installEntry = async (ctx0, P, cfg0, { kind, name: entryName, source }) => {
    const fail = (status, message) => {
      const error = new Error(message)
      error.installFailure = { status }
      throw error
    }
    // 官方源优先（官方是唯一真源）：技能/专家/连接器都先走官方，
    // 官方拿不到时才回落到 GitHub 镜像（灾备；连接器见 landOfficialConnector 说明）。
    let files, dest, report, officialMeta = null
    // 官方溯源：安装时把「装的是官方哪一版 / 哪份定义」如实记进注册表，
    // 供 /updates 做纯官方元数据比对（技能 version / 专家 updatedAt / 连接器 defHash）。
    let provenance = null
    let officialFailure = ''
    if (kind === 'skill' && source !== 'mirror') {
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
        // 官方版本 / updated_at：老记录没有 officialMeta → /updates 给 unknown，不伪造
        provenance = skillProvenance(rec)
        files = entries
        report = { files: count, bytes: total, flags: officialMeta.flags }
      } catch (error) {
        officialFailure = String(error?.message || error)
        // 官方装不上：只有显式打开灾备（mirrorFallback=true）才允许装镜像内容；
        // 默认关时必须如实失败 —— 否则「官方是唯一真源」就成了一句空话。
        if (!mirrorFallback) {
          fail(502, `官方技能安装失败，且镜像兜底已关闭（mirrorFallback=false）：${officialFailure}`)
        }
        officialMeta = null // 灾备：回落到镜像内容（记录不带 officialMeta，/updates 会如实报 unknown）
      }
    } else if (kind === 'expert' && source !== 'mirror') {
      try {
        officialMeta = await installExpert(entryName, P.experts, skillPrefix)
        dest = officialMeta.dest
        report = { files: officialMeta.files, bytes: officialMeta.bytes, flags: officialMeta.flags }
        provenance = expertProvenance(officialMeta)
        invalidateExpertCache() // 人设文件更新过，缓存作废
      } catch (error) {
        officialFailure = String(error?.message || error)
        if (source === 'official') throw error
        if (!mirrorFallback) {
          fail(502, `官方专家安装失败，且镜像兜底已关闭（mirrorFallback=false）：${officialFailure}`)
        }
        officialMeta = null // 灾备：回落到镜像内容
      }
    } else if (kind === 'connector') {
      // 连接器只认官方注册表（与 POST /connectors/install 同一条链路）：
      // 镜像里的 connectors 数据不参与安装；官方拿不到时才回落到镜像灾备。
      const landed = await landOfficialConnector(entryName)
      if (landed.ok) {
        dest = landed.dest
        report = { files: 1, bytes: landed.bytes, flags: landed.flags }
        provenance = connectorProvenance(landed.row)
        officialMeta = {
          kind: 'connector', name: entryName, dest,
          displayName: landed.row.displayName || entryName,
          description: landed.row.description || '',
          icon: landed.row.icon || '',
          source: 'official', officialId: null,
        }
      } else if (!mirrorFallback) {
        // 官方拿不到（未登录 / 上游失败）且灾备关闭 → 如实失败，不静默装镜像内容。
        officialFailure = String(landed.error || 'official connector install failed')
        fail(landed.status || 502, `官方连接器安装失败，且镜像兜底已关闭（mirrorFallback=false）：${officialFailure}`)
      } else {
        // 灾备：回落到镜像内容，此时记录**不带** officialMeta —— /updates 会如实报 unknown。
        officialMeta = null
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
      try { linkSkill(P, skillPrefix, officialMeta?.name ?? entryName, skillsMount); record.linked = true } catch (error) {
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
      // 官方溯源（可能为 null：官方记录本身缺字段时如实留空，/updates 会报 unknown）
      record.officialMeta = provenance
    }
    registry.installed[key] = record
    saveJson(P.registry, registry)
    return { key, report, linked: record.linked, dest }
  }

  /* ---------------------------------------------------------------- *
   * workbuddy_install 工具：装前只读预检 → DSH 原生审批 → 才真装。
   *
   * 审批语义（对齐 @deepseek-ai/dsh-user-approval 的封闭词表）：
   *  · allowed-once  唯一授权：装；
   *  · rejected / cancelled  用户说不/撤回：不装，如实转述；
   *  · unavailable   没有可用审批通道：**fail-closed**，绝不静默放过；
   *  · ctx.approval 服务缺位 / exec.agent 缺位：同样 fail-closed（没有 agent
   *    就没有会话可审计、没有 UI 可弹窗 —— 这两处都不能装）。
   *
   * 注意：ctx.tools.register 用**普通对象**（不 import @deepseek-ai/dsh-tools：
   * 本插件目录解析不到该包，实测 MODULE_NOT_FOUND；registry 只要求
   * output { schema, render } 与 execute 的形状）。
   * ---------------------------------------------------------------- */
  const installTool = {
    name: 'workbuddy_install',
    description: '安装一个 WorkBuddy 官方市场的专家/技能/连接器到本机 DSH。'
      + '**预检由本工具内部自动完成**（会先做只读安全预检，并把结果摘要与风险标记写进审批理由），'
      + '所以你不需要自己去找脚本或另行下载；只需：①用自己的话向用户讲清这个条目是干什么的、解决什么问题、有什么风险'
      + '（可用 scripts/hub-find.mjs inspect <kind> <name> 拿到更细的安全卡，该脚本随插件发布，路径见插件目录下的 skills/ 文档）；'
      + '②得到用户口头同意；③调用本工具。'
      + '调用后仍会弹出 DSH 原生审批，用户在审批里批准才会真的安装；被拒绝/取消/无审批通道时一律不装（fail-closed）。',
    // ⚠️ 必须是**已投影的 JSON Schema**（object 根 + properties + required 数组）：
    // workflow 插件那种 schemastery 写法（属性内 required: true）只有在过 defineTool
    // 编译时才成立；我们不走 defineTool（@deepseek-ai/dsh-tools 在插件目录解析不到），
    // 所以框架会把这里的对象**原样**发给模型 —— 实测扁平映射会被上游判为非法参数结构并
    // 整轮 INVALID_REQUEST（工具的参数结构不符合当前模型要求）。对照官方工具发出的形状：
    // {"type":"object","properties":{…},"required":[…]}
    parameters: {
      type: 'object',
      properties: {
        kind: { type: 'string', enum: ['expert', 'skill', 'connector'], description: '条目类型。' },
        name: { type: 'string', description: '条目名（目录名 / 官方 name 字段）。' },
        source: { type: 'string', enum: ['official', 'mirror'], description: '可选；默认官方优先（官方失败且 mirrorFallback 开启时才回落镜像）。' },
      },
      required: ['kind', 'name'],
      additionalProperties: false,
    },
    output: {
      // ⚠️ 普通（未过 defineTool 编译）的对象走 raw assertSupportedJsonSchema：
      // 它不认 author-only 的 `type: "json"`（实测 JsonSchemaError）。annotation-only
      //（无 type）就是官方认可的「任意 JSON 值」raw 形式。
      schema: { description: 'workbuddy_install 结果（文本说明 + 结构化字段）' },
      render: (_args, value) => {
        // 失败/未批准走文本块；成功是 JSON value → 紧凑文本（模型与 UI 都可读）。
        const v = value && typeof value === 'object' && !Array.isArray(value) ? value : { text: String(value ?? '') }
        const text = typeof v.text === 'string'
          ? v.text
          : [
            `已安装 ${v.kind}/${v.name}（来源：${v.source === 'official' ? '官方' : '镜像'}）`,
            `落盘: ${v.dest || ''}`,
            `体量: ${v.files ?? '?'} 文件 / ${(Number(v.bytes ?? 0) / 1024).toFixed(1)} KB`,
            `安全标记: ${(Array.isArray(v.flags) && v.flags.length > 0) ? v.flags.join('; ') : '无'}`,
            v.linked ? '技能已符号链接进挂载目录，下一轮对话生效。' : '',
            v.note || '',
          ].filter(Boolean).join('\n')
        return [{ type: 'text', text }]
      },
    },
    async execute(args, exec) {
      const kind = String(args.kind || '')
      const entryName = String(args.name || '')
      // ---- 1) 只读预检（与 hub-find.mjs inspect 同一实现，不落盘）----
      let card = null
      try {
        card = kind === 'expert' ? await inspectExpert(entryName)
          : kind === 'skill' ? await inspectSkill(entryName, { stateDir: P.state })
          : await inspectConnector(entryName, { stateDir: P.state })
      } catch (error) {
        return { text: `预检失败，未安装 ${kind}/${entryName}：${String(error?.message || error)}` }
      }
      const riskText = card.riskFlags.length > 0 ? card.riskFlags.join('; ') : '无'
      // ---- 2) DSH 原生审批（fail-closed：没有服务 / 没有 agent / 非 allowed-once 一律不装）----
      const approval = pluginCtx?.approval ?? ctx.approval ?? undefined
      if (approval === undefined) {
        console.info(`[wbh] install ${kind}/${entryName}: approval=unavailable (no approval service) flags=${riskText} source=${args.source || 'official'}`)
        return { text: `该环境无法完成用户确认（没有可用的审批服务），出于安全未安装 ${kind}/${entryName}。请改用插件的 Web 设置页安装，或让用户在会话里直接确认后重试。` }
      }
      if (exec.agent === undefined) {
        console.info(`[wbh] install ${kind}/${entryName}: approval=unavailable (no agent) flags=${riskText}`)
        return { text: `当前调用没有可路由的 agent（无法弹出审批、无法留审计），出于安全未安装 ${kind}/${entryName}。` }
      }
      const reason = [
        `安装 WorkBuddy ${kind}「${card.displayName || entryName}」`,
        `体量: ${card.files} 文件 / 约 ${(card.bytes / 1024).toFixed(1)} KB；可执行脚本: ${card.scriptCount > 0 ? card.scriptCount + ' 个' : '无'}`,
        `风险标记: ${riskText}`,
        card.external && (card.external.urls.length || card.external.commandExecution || card.external.credentialHeaders.length)
          ? `外网/命令/凭据: ${card.external.commandExecution ? '声明命令执行；' : ''}${card.external.urls.length ? card.external.urls.join(', ') : ''}${card.external.credentialHeaders.length ? `；凭据相关 ${card.external.credentialHeaders.length} 处` : ''}`
          : '外网/命令/凭据: 无',
        `来源: ${args.source || 'official（官方优先）'}`,
      ].filter(Boolean).join('；')
      const outcome = await approval.request({
        agent: exec.agent,
        toolName: 'workbuddy_install',
        callId: exec.callId,
        reason,
        signal: exec.signal,
      })
      // ---- 3) 四分支：只有 allowed-once 才真装 ----
      if (outcome !== 'allowed-once') {
        console.info(`[wbh] install ${kind}/${entryName}: approval=${outcome} flags=${riskText} source=${args.source || 'official'}`)
        const why = outcome === 'rejected' ? '用户未批准（拒绝），未安装'
          : outcome === 'cancelled' ? '审批被取消，未安装'
          : '当前没有可用的审批通道，出于安全未安装（fail-closed）'
        return { text: `${why} ${kind}/${entryName}。` }
      }
      // ---- 4) 真装（与 POST /install 同一实现）+ 收尾说明 ----
      let result
      try {
        result = await installEntry(ctx, P, cfg, { kind, name: entryName, source: args.source })
      } catch (error) {
        console.info(`[wbh] install ${kind}/${entryName}: approved but install failed: ${String(error?.message || error)}`)
        return { text: `安装失败（已获批准）：${String(error?.message || error)}` }
      }
      console.info(`[wbh] install ${kind}/${entryName}: approval=allowed-once flags=${riskText} source=${result.report && Array.isArray(result.report.flags) ? 'landed' : 'landed'} at=${new Date().toISOString()}`)
      const registryRecord = loadJson(P.registry, { version: 1, installed: {} })?.installed?.[result.key]
      const note = kind === 'skill'
        ? '技能已符号链接进挂载目录，下一轮对话生效。'
        : kind === 'expert'
          ? '专家已落地并记录官方溯源；可用 /expert 或既有语义召唤。'
          : '连接器已落地但保持停用（enabled=false）：带凭据的 MCP 传输要用户显式启用（/connector 或设置页开关）才会建立。'
      return {
        text: note,
        kind, name: registryRecord?.name ?? entryName,
        source: registryRecord?.source === 'official' ? 'official' : 'mirror',
        dest: result.dest,
        files: result.report?.files ?? 0,
        bytes: result.report?.bytes ?? 0,
        flags: result.report?.flags ?? [],
        linked: Boolean(result.linked),
        official: registryRecord?.official === true,
      }
    },
  }
  // tools 服务缺位的 ctx（老测试 / 精简环境）跳过工具注册：其余功能不受影响。
  if (ctx.tools && typeof ctx.tools.register === 'function') {
    ctx.effect(() => ctx.tools.register(installTool), 'workbuddy-hub: workbuddy_install tool')
  }

  /* ---------------------------------------------------------------- *
   * 卸载一个条目 —— **路由（POST /uninstall）与工具（workbuddy_uninstall）
   * 共用的唯一实现**，避免两条卸载链路分叉（与 installEntry 同一原则）。
   *
   * 顺序与原 POST /uninstall 保持一致（现有测试钉着它）：
   *   连接器先拆 MCP 传输（否则 mcp-client 行悬空）→ 拆技能链接 → 删文件 →
   *   更新注册表 → pruneMounts（摘掉所有会话里的挂载，含 invalidateExpertCache）
   *   → 专家 best-effort 删 agent preset。
   * 只删注册表里真实存在的记录；调用方负责「没装」的用户呈现。
   * ---------------------------------------------------------------- */
  const uninstallEntry = async (P0, cfg0, { kind, name: entryName }) => {
    const key = `${kind}/${entryName}`
    const registry = loadJson(P0.registry, { version: 1, installed: {} })
    const record = registry.installed?.[key]
    if (!record) return null
    // Tear the transport down (and await it) before deleting its files.
    if (kind === 'connector') {
      await connectors.disable(key)
      unlinkConnectorSkills(skillPrefix, record.linkedSkills, skillsMount)
    }
    if (kind === 'skill') unlinkSkill(skillPrefix, entryName, skillsMount)
    rmSync(record.dest, { recursive: true, force: true })
    delete registry.installed[key]
    saveJson(P0.registry, registry)
    // 卸载必须连带摘掉挂载：只删文件与注册表，会留下一位「人设文件已被删掉」的
    // 专家 —— 界面 chip 还在、注入却失败或静默为空。全量清理所有会话里等于该 key
    // 的条目（pruneMounts 内部会 invalidateExpertCache，保证下一步 assembly 不用旧人设）。
    const prunedSessions = pruneMounts(P0, key)
    // 专家卸载后 best-effort 释放它对应的 agent preset（按 `workbuddy-<name>`
    // 现算，不改安装记录结构）；删不掉（没建过 / 已不存在 / 被占用）不影响卸载。
    // 0.1.7 起 preset 不再是磁盘目录，只有**声明方**持有的 disposer 能撤销它。
    if (kind === 'expert') {
      try { await disposeExpertPreset(ctx, expertPresetId(entryName)) } catch { /* best effort */ }
    }
    return { key, prunedSessions }
  }

  /** 工具预检用：卸载前只读盘算「将移除什么」（不写盘、不动挂载、不拆传输）。 */
  const uninstallPreview = (P0, { kind, name: entryName }) => {
    const key = `${kind}/${entryName}`
    const record = loadJson(P0.registry, { version: 1, installed: {} }).installed?.[key]
    if (!record) return null
    return {
      key,
      displayName: record.displayName || entryName,
      installedAt: typeof record.installedAt === 'string' ? record.installedAt : '',
      files: Number(record.files) || 0,
      bytes: Number(record.bytes) || 0,
      source: record.source === 'official' ? 'official' : 'mirror',
      enabled: record.enabled === true,
      hasMcp: record.kind === 'connector' ? record.mcp !== false : undefined,
    }
  }

  /* ---------------------------------------------------------------- *
   * workbuddy_uninstall 工具：只读说清将移除什么 → DSH 原生审批 → 才真卸。
   * 与 workbuddy_install 同一套写法与分支语义：
   *  · allowed-once  唯一授权：卸；
   *  · rejected / cancelled  用户说不/撤回：不卸，如实转述；
   *  · unavailable   没有可用审批通道：**fail-closed**（绝不静默放过）；
   *  · ctx.approval / exec.agent 缺位：同样 fail-closed。
   * ---------------------------------------------------------------- */
  const uninstallTool = {
    name: 'workbuddy_uninstall',
    description: '从本机 DSH 移除一个已安装的 WorkBuddy 专家/技能/连接器（会同时摘掉所有会话里的挂载；连接器先停用 MCP 传输再删）。'
      + '调用前先用你自己的话向用户讲清将要移除什么（可用 scripts/hub-find.mjs installed 查看本机已装清单）、'
      + '征得用户同意，再调用本工具。调用后会弹出 DSH 原生审批，用户在审批里批准才会真的卸载；'
      + '被拒绝/取消/无审批通道时一律不卸载（fail-closed）。',
    // ⚠️ 必须是**已投影的 JSON Schema**（object 根 + properties + required 数组）——
    // 与 workbuddy_install 相同的坑：schemastery 扁平映射（属性内 required: true）会被
    // 框架原样发给模型，上游整轮 INVALID_REQUEST。见 installTool.parameters 处的长注释。
    parameters: {
      type: 'object',
      properties: {
        kind: { type: 'string', enum: ['expert', 'skill', 'connector'], description: '条目类型。' },
        name: { type: 'string', description: '条目名（目录名 / 注册表里的 name）。' },
      },
      required: ['kind', 'name'],
      additionalProperties: false,
    },
    output: {
      schema: { description: 'workbuddy_uninstall 结果（文本说明 + 结构化字段）' },
      render: (_args, value) => {
        const v = value && typeof value === 'object' && !Array.isArray(value) ? value : { text: String(value ?? '') }
        const text = typeof v.text === 'string'
          ? v.text
          : [
            `已移除 ${v.kind}/${v.name}（${v.prunedSessions ? `从 ${v.prunedSessions} 个会话摘除挂载` : '没有会话挂着它'}）`,
            v.removedFiles != null ? `删除: ${v.removedFiles} 个文件 / ${(Number(v.removedBytes ?? 0) / 1024).toFixed(1)} KB` : '',
          ].filter(Boolean).join('\n')
        return [{ type: 'text', text }]
      },
    },
    async execute(args, exec) {
      const kind = String(args.kind || '')
      const entryName = String(args.name || '')
      if (!['expert', 'skill', 'connector'].includes(kind) || !/^[\w.-]+$/.test(entryName)) {
        return { text: `参数无效：kind 必须是 expert|skill|connector，name 只允许字母数字._-（收到 kind=${oneLineOf(kind)} name=${oneLineOf(entryName)}）。未做任何改动。` }
      }
      // ---- 1) 只读预览：说清将移除什么（不写盘、不拆传输、不动挂载）----
      const preview = uninstallPreview(P, { kind, name: entryName })
      if (!preview) {
        return { text: `${kind}/${entryName} 本机没有安装（或注册表里没有这条记录），无需卸载。` }
      }
      // ---- 2) DSH 原生审批（fail-closed：没有服务 / 没有 agent / 非 allowed-once 一律不卸）----
      const approval = pluginCtx?.approval ?? ctx.approval ?? undefined
      if (approval === undefined) {
        console.info(`[wbh] uninstall ${kind}/${entryName}: approval=unavailable (no approval service) remote=unknown at=${new Date().toISOString()}`)
        return { text: `该环境无法完成用户确认（没有可用的审批服务），出于安全未卸载 ${kind}/${entryName}。请改用插件 Web 设置页的「移除」按钮，或让用户在会话里直接确认后重试。` }
      }
      if (exec.agent === undefined) {
        console.info(`[wbh] uninstall ${kind}/${entryName}: approval=unavailable (no agent) at=${new Date().toISOString()}`)
        return { text: `当前调用没有可路由的 agent（无法弹出审批、无法留审计），出于安全未卸载 ${kind}/${entryName}。` }
      }
      const reason = [
        `移除 WorkBuddy ${kind}「${preview.displayName}」`,
        `${preview.files} 个文件 / 约 ${(preview.bytes / 1024).toFixed(1)} KB（安装于 ${preview.installedAt || '未知时间'}，来源 ${preview.source === 'official' ? '官方' : '镜像'}）`,
        kind === 'connector'
          ? (preview.enabled ? '该连接器当前已启用：会先停用 MCP 传输再删除' : '该连接器当前未启用；删除后其 MCP 行彻底消失')
          : kind === 'expert' ? '会同时从所有会话摘掉该专家的挂载' : '会同时摘掉技能软链与各会话挂载',
        '此操作删除本机文件，不可撤销。',
      ].join('；')
      const outcome = await approval.request({
        agent: exec.agent,
        toolName: 'workbuddy_uninstall',
        callId: exec.callId,
        reason,
        signal: exec.signal,
      })
      // ---- 3) 四分支：只有 allowed-once 才真卸 ----
      if (outcome !== 'allowed-once') {
        console.info(`[wbh] uninstall ${kind}/${entryName}: approval=${outcome} at=${new Date().toISOString()}`)
        const why = outcome === 'rejected' ? '用户未批准（拒绝），未卸载'
          : outcome === 'cancelled' ? '审批被取消，未卸载'
          : '当前没有可用的审批通道，出于安全未卸载（fail-closed）'
        return { text: `${why} ${kind}/${entryName}。` }
      }
      // ---- 4) 真卸（与 POST /uninstall 同一实现）----
      let result
      try {
        result = await uninstallEntry(P, cfg, { kind, name: entryName })
      } catch (error) {
        console.info(`[wbh] uninstall ${kind}/${entryName}: approved but uninstall failed: ${String(error?.message || error)}`)
        return { text: `卸载失败（已获批准）：${String(error?.message || error)}` }
      }
      if (!result) {
        return { text: `${kind}/${entryName} 在审批通过后已不存在（可能被并行移除），无需重复卸载。` }
      }
      console.info(`[wbh] uninstall ${kind}/${entryName}: approval=allowed-once prunedSessions=${result.prunedSessions} at=${new Date().toISOString()}`)
      return {
        text: `已移除 ${kind}/${entryName}${result.prunedSessions ? `，并从 ${result.prunedSessions} 个会话摘除挂载` : ''}。`,
        kind,
        name: entryName,
        removedFiles: preview.files,
        removedBytes: preview.bytes,
        prunedSessions: result.prunedSessions,
      }
    },
  }
  if (ctx.tools && typeof ctx.tools.register === 'function') {
    ctx.effect(() => ctx.tools.register(uninstallTool), 'workbuddy-hub: workbuddy_uninstall tool')
  }

  const handler = async (req, res) => {
    const url = new URL(req.url, 'http://localhost')
    if (!url.pathname.startsWith(PREFIX)) return false
    if (rejected(req, res)) return true
    const route = `${req.method} ${url.pathname.slice(PREFIX.length) || '/'}`

    if (route === 'GET /health') {
      json(res, 200, {
        ok: true, store: P.root, mirror: mirrorRepo, branch: mirrorBranch,
        // 官方是唯一真源；这里如实报告灾备开关状态（默认 false）
        mirrorFallback,
        // 本地 MCP 管理门（默认 false；true 时才允许注册/启停本地 MCP 服务器）
        localMcp: localMcpEnabled,
      })
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
      const health = loadAuthHealth(P.state)
      const configured = Boolean(auth?.access_token)
      json(res, 200, {
        // 以下三个字段保持原样（客户端已在用，只增不改）
        configured,
        uid: auth?.uid, nickname: auth?.nickname,
        expiresAt: auth ? (auth.obtainedAt ?? 0) + (auth.expires_in ?? 3600) * 1000 : null,
        // 新增：保活健康度。stale = 连续 3 次刷新失败（或官方 12153 累计到阈值）
        // → 凭证已彻底失效，需要用户重新扫码登录。
        stale: configured && isStale(health),
        lastError: health.lastError || '',
        keepalive: {
          lastCheckAt: health.lastCheckAt || 0,
          consecutiveFailures: health.consecutiveFailures || 0,
        },
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
        // 重新登录成功 = 一次成功：清空保活健康档（stale 立即解除）
        clearAuthHealth(P.state)
        rmSync(P.loginState, { force: true })
        json(res, 200, { ok: true, nickname: auth.nickname, uid: auth.uid })
      } catch (error) {
        json(res, error.pending ? 202 : 502, { error: error.message, pending: Boolean(error.pending) })
      }
      return true
    }
    if (route === 'POST /wb-auth/logout') {
      // 修 bug：P.state 是**字符串**路径，旧代码写 P.state.join(...) 必然抛 TypeError
      // （被兜底 handler 变成 500），注销从来没真正删掉凭证 —— 用户点了注销仍显示已登录。
      rmSync(join(P.state, 'workbuddy-auth.json'), { force: true })
      // 注销后不该残留「会话失效」状态（否则下次登录前会显示旧错误）
      clearAuthHealth(P.state)
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
      const q0 = (url.searchParams.get('q') || '').trim()
      const configured = Boolean(loadAuth(P.state)?.access_token)
      /** 官方失败时的可读原因：未登录就直说「需要登录」，否则原样带出上游错误。 */
      const officialListError = (kind, error) => {
        const what = kind === 'skill' ? '技能' : '专家'
        const detail = error ? String(error?.message || error) : ''
        if (!configured) return `需要登录才能查看官方${what}目录${detail ? `（${detail}）` : ''}`
        return `官方${what}目录暂不可用${detail ? `：${detail}` : ''}`
      }
      const mirrorHits = (bucket, matcher) => {
        if (!mirrorFallback) return []
        const cache = loadIndex()
        if (!cache) return []
        return Object.values(cache.index?.[bucket] ?? {}).filter(matcher)
      }
      if (kindQ === 'connector') {
        // 官方连接器注册表需要登录。未登录时前端显示就地登录卡（不显示镜像目录）。
        // mirrorFallback 打开时才用镜像 catalog 的 connectors 兜底（灾备），并如实标 source=mirror。
        let rows = []
        let officialError = ''
        try { rows = await connectorRegistry(P.state) } catch (error) { officialError = String(error?.message || error) }
        if (rows.length > 0) {
          // 修 bug：官方注册表接口没有关键词参数，此前直接把 24 条全量原样返回，
          // **完全忽略 q**（实测：搜「地图」和不搜都是 24 条）。官方不支持就得本地过滤：
          // 与 scripts/hub-find.mjs filterRows 同一口径 —— name / displayName /
          // description / authType 的**大小写不敏感** includes；空关键词不过滤；
          // 无命中给空列表（客户端走既有「暂无连接器」空态，不报错）。
          const q1 = q0.toLowerCase()
          if (q1) {
            rows = rows.filter(e => [e.name, e.displayName, e.description, e.authType]
              .some(v => String(v || '').toLowerCase().includes(q1)))
          }
          json(res, 200, { ok: true, source: 'official', total: rows.length, rows })
          return true
        }
        const q2 = q0.toLowerCase()
        const mirrorRows = configured
          ? mirrorHits('connectors', e => !q2 || `${e.name} ${e.displayName || ''} ${e.description || ''}`.toLowerCase().includes(q2))
          : []
        const reason = !configured
          ? '需要登录才能查看官方连接器目录'
          : (officialError || '官方连接器注册表为空或暂不可用')
        json(res, 200, {
          ok: true,
          // 有镜像内容才标 mirror（灾备）；否则如实标 official + 空列表 + 原因
          source: mirrorRows.length ? 'mirror' : 'official',
          total: mirrorRows.length,
          rows: mirrorRows,
          error: mirrorRows.length ? (officialError || undefined) : reason,
        })
        return true
      }
      const kind = kindQ === 'skill' ? 'skill' : 'expert'
      const payload = {
        page: Math.max(1, Number(url.searchParams.get('page') || 1) || 1),
        pageSize: Math.min(100, Number(url.searchParams.get('pageSize') || 60) || 60),
      }
      // 修 bug：此前写成 page_size/keyword —— marketList 的解构签名是
      // ({ page, pageSize, query })，两个名字都对不上：pageSize 静默落回 60，
      // keyword 整个被丢掉 → 官方收到的 body 里没有 keyword，**任何关键词都返回
      // 全量列表**（隔离实例实测：q=表格 / q=zzzz不存在zzzz 与 q=空逐字节一致）。
      // 官方后端的 keyword 过滤本身是好的：marketList('skill', { query:'表格' })
      // → total 335，query='zzzz不存在zzzz' → total 0。技能与专家共用本分支；
      // 专家在客户端优先走 /official-experts（本地注册表过滤），仅在其空/失败时落回这里。
      if (q0) payload.query = q0
      const cat = url.searchParams.get('category')
      if (cat && cat !== 'all') payload.categories = [cat]
      try {
        const { total, rows } = await marketList(kind, payload, P.state)
        json(res, 200, { ok: true, source: 'official', total, rows })
      } catch (error) {
        const q2 = q0.toLowerCase()
        const hits = mirrorHits(kind === 'expert' ? 'experts' : 'skills',
          e => !q2 || (e.displayName || '').toLowerCase().includes(q2) || (e.description || '').toLowerCase().includes(q2))
          .slice(0, payload.pageSize)
        if (hits.length === 0) {
          // mirrorFallback=false（默认）：不静默换成镜像内容，如实暴露失败
          json(res, 200, {
            ok: true, source: 'official', total: 0, rows: [],
            error: officialListError(kind, error),
          })
          return true
        }
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
        json(res, 200, { ok: true, source: 'official', items: [], error: error.message })
      }
      return true
    }

    if (route === 'GET /catalog') {
      // 镜像目录索引：官方是唯一真源，这里只在灾备开关打开时可用
      if (!mirrorFallback) {
        json(res, 503, {
          error: '镜像目录兜底已关闭（mirrorFallback=false）：官方源是唯一真源，不再静默换成镜像内容',
        })
        return true
      }
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
      // 镜像检索：同 /catalog，只在灾备开关打开时可用
      if (!mirrorFallback) {
        json(res, 503, {
          error: '镜像检索已关闭（mirrorFallback=false）：官方源是唯一真源，不再静默换成镜像内容',
        })
        return true
      }
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
      // 图标回填：官方 icon 能取到的就取，取不到保持原样（前端用官方 fallback）。
      //  · 专家：expert_center.json（按 name，其次按 displayName）
      //  · 技能：按记录里的 officialId 查官方 skill 详情；拿到后写回 registry，
      //    所以只有第一次会走网络
      const backfilled = []
      const expertMissing = Object.values(registry.installed ?? {})
        .filter(r => r.kind === 'expert' && !r.icon)
      if (expertMissing.length > 0) {
        try {
          const all = await listExperts({ limit: 5000 })
          const byName = new Map(all.rows.map(r => [r.name, r.icon]))
          const byLabel = new Map(all.rows.map(r => [r.displayName, r.icon]))
          for (const record of expertMissing) {
            const icon = byName.get(record.name) || byLabel.get(record.displayName)
            if (icon) { record.icon = icon; backfilled.push(record) }
          }
        } catch { /* 取不到就算了 */ }
      }
      const skillMissing = Object.values(registry.installed ?? {})
        .filter(r => r.kind === 'skill' && r.officialId && (!r.icon || r.icon === 'letter:auto'))
      if (skillMissing.length > 0) {
        try {
          const details = await skillDetails(skillMissing.map(r => r.officialId), P.state)
          for (const record of skillMissing) {
            const hit = details.find(d => d.skill_id === record.officialId || d.skillId === record.officialId)
            const icon = hit?.icon || hit?.icon_url || ''
            if (icon) { record.icon = icon; backfilled.push(record) }
          }
        } catch { /* 未登录/网络失败都不影响其它字段 */ }
      }
      if (backfilled.length > 0) {
        try { saveJson(P.registry, registry) } catch { /* 只读场景也能返回 */ }
      }
      json(res, 200, registry)
      return true
    }

    // ---- 检查更新（只读；不写注册表、不动文件）----
    // 判定依据（**纯官方元数据**，永远不用镜像，与 mirrorFallback 无关）：
    //  · 技能   → 官方 skill 记录的 version vs 安装时记的 officialMeta.version；
    //  · 专家   → 官方注册表原始条目的 updatedAt vs officialMeta.updatedAt（老记录退回 installedAt）；
    //  · 连接器 → 官方注册表该行 mcp 定义的规范化 sha256 vs officialMeta.defHash。
    // 纪律：取不到官方数据（未登录 / 接口失败 / 记录缺 officialMeta）一律 unknown + 原因，
    //       **绝不**判 current —— 静默的假「已是最新」比报错更糟。
    if (route === 'GET /updates') {
      const force = url.searchParams.get('refresh') === '1'
      const now = Date.now()
      if (!force && updatesResultCache && now - updatesResultCache.at < UPDATES_RESULT_TTL_MS) {
        json(res, 200, { ...updatesResultCache.body, cached: true })
        return true
      }

      const registry = loadJson(P.registry, { version: 1, installed: {} })
      const records = Object.entries(registry.installed ?? {})
      const kindOf = record => String(record?.kind || '')
      const needs = {
        expert: records.some(([, record]) => kindOf(record) === 'expert'),
        skill: records.some(([, record]) => kindOf(record) === 'skill'),
        connector: records.some(([, record]) => kindOf(record) === 'connector'),
      }
      // 技能（market/skill/get-by-ids）与连接器（registry2c/list）都需要登录；
      // 专家注册表是公开的，未登录也能正常比对。
      const loggedIn = Boolean(loadAuth(P.state)?.access_token)
      const failures = []
      const sourceError = { expert: '', skill: '', connector: '' }

      // 专家：官方注册表原始条目（按 agentName / plugin / id 建索引；后写覆盖前写）
      let expertIndex = null
      if (needs.expert) {
        try {
          const data = await officialRegistry()
          expertIndex = new Map()
          for (const raw of data?.experts ?? []) {
            if (raw?.id) expertIndex.set(String(raw.id), raw)
            if (raw?.plugin) expertIndex.set(String(raw.plugin), raw)
            if (raw?.agentName) expertIndex.set(String(raw.agentName), raw)
          }
        } catch (error) {
          sourceError.expert = String(error?.message || error)
          failures.push(`官方专家注册表不可用：${sourceError.expert}`)
        }
      }

      // 技能：按记录里的 officialId 批量取官方记录（缺 officialId 的条目单独报 unknown）
      let skillIndex = null
      if (needs.skill) {
        if (!loggedIn) {
          failures.push('技能：需要登录才能读取官方技能数据')
        } else {
          const ids = [...new Set(records
            .filter(([, record]) => kindOf(record) === 'skill')
            .map(([, record]) => (record?.officialId === undefined || record?.officialId === null ? '' : String(record.officialId)))
            .filter(Boolean))]
          try {
            const skills = ids.length ? await skillDetails(ids, P.state) : []
            skillIndex = new Map(skills.map(row => [String(row?.skill_id ?? row?.skillId ?? ''), row]))
          } catch (error) {
            sourceError.skill = String(error?.message || error)
            failures.push(`官方技能接口不可用：${sourceError.skill}`)
          }
        }
      }

      // 连接器：官方注册表（需要登录；未登录拿不到 → 该条 unknown，绝不判 current）
      let connectorIndex = null
      if (needs.connector) {
        if (!loggedIn) {
          failures.push('连接器：需要登录才能读取官方连接器注册表')
        } else {
          try {
            const rows = await connectorRegistry(P.state)
            connectorIndex = new Map(rows.map(row => [String(row?.name ?? ''), row]))
          } catch (error) {
            sourceError.connector = String(error?.message || error)
            failures.push(`官方连接器注册表不可用：${sourceError.connector}`)
          }
        }
      }

      const entries = records.map(([key, record]) => {
        const slash = key.indexOf('/')
        const kind = record?.kind || (slash > 0 ? key.slice(0, slash) : '')
        const entryName = record?.name || (slash > 0 ? key.slice(slash + 1) : key)
        const base = {
          key, kind, name: entryName,
          displayName: record?.displayName || entryName,
          installedAt: typeof record?.installedAt === 'string' ? record.installedAt : '',
          files: Number(record?.files) || 0,
          bytes: Number(record?.bytes) || 0,
          // 元数据比对没有「远端字节数」这个概念：保持字段形状（前端据此退回本地估算并标「约」）
          remoteBytes: null,
          changedFiles: 0,
          remoteAt: '',
          localAt: '',
          remoteVersion: '',
          localVersion: '',
          remoteHash: '',
          localHash: '',
          reason: '',
        }
        if (kind === 'expert') {
          if (expertIndex === null) {
            return { ...base, status: 'unknown', reason: `官方专家注册表不可用：${sourceError.expert}` }
          }
          const cmp = compareOfficial(record, expertIndex.get(String(entryName)) ?? null)
          return { ...base, status: cmp.status, remoteAt: cmp.remoteAt, localAt: cmp.localAt, reason: cmp.reason }
        }
        if (kind === 'skill') {
          if (!loggedIn) {
            return { ...base, status: 'unknown', reason: '需要登录才能检查官方技能（官方技能数据需要 WorkBuddy 账号）' }
          }
          if (skillIndex === null) {
            return { ...base, status: 'unknown', reason: `官方技能接口不可用：${sourceError.skill}` }
          }
          const officialId = record?.officialId === undefined || record?.officialId === null ? '' : String(record.officialId)
          if (!officialId) {
            return {
              ...base, status: 'unknown',
              reason: '本地记录缺少官方技能 ID（officialId），无法与官方比对；重装一次即可记录',
            }
          }
          const cmp = compareSkillVersion(record, skillIndex.get(officialId) ?? null)
          return { ...base, status: cmp.status, remoteVersion: cmp.remoteVersion, localVersion: cmp.localVersion, reason: cmp.reason }
        }
        if (kind === 'connector') {
          if (!loggedIn) {
            return { ...base, status: 'unknown', reason: '需要登录才能检查官方连接器' }
          }
          if (connectorIndex === null) {
            return { ...base, status: 'unknown', reason: `官方连接器注册表不可用：${sourceError.connector}` }
          }
          const cmp = compareConnectorDef(record, connectorIndex.get(String(entryName)) ?? null)
          return { ...base, status: cmp.status, remoteHash: cmp.remoteHash, localHash: cmp.localHash, reason: cmp.reason }
        }
        return { ...base, status: 'unknown', reason: `未知条目类型：${kind || '(空)'}` }
      })

      const body = {
        ok: true,
        checkedAt: new Date(now).toISOString(),
        cached: false,
        sources: {
          // 只有一个真源：官方。ok=false 时 reason 说明是哪一路取不到（未登录/接口失败）
          official: { ok: failures.length === 0, at: now, reason: failures.join('；') },
        },
        counts: summarizeUpdates(entries),
        entries,
      }
      updatesResultCache = { at: now, body }
      json(res, 200, body)
      return true
    }

    if (route === 'GET /connector-registry') {
      const configured = Boolean(loadAuth(P.state)?.access_token)
      if (!configured) {
        json(res, 200, { ok: true, source: 'official', rows: [], error: '需要登录才能读取官方连接器注册表' })
        return true
      }
      try {
        const rows = await connectorRegistry(P.state)
        json(res, 200, {
          ok: true,
          source: rows.length ? 'official' : (mirrorFallback ? 'mirror' : 'official'),
          rows,
          error: rows.length ? undefined : '官方连接器注册表为空',
        })
      } catch (error) {
        json(res, 200, {
          ok: true,
          source: mirrorFallback ? 'mirror' : 'official',
          rows: [],
          error: String(error?.message || error),
        })
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
        const registry = loadJson(P.registry, { version: 1, installed: {} })
        const dshSkills = join(homedir(), '.dsh', 'skills')
        for (const dirent of readdirSync(dshSkills, { withFileTypes: true })) {
          // 目录与符号链接都要（hub 装的技能是 workbuddy-* 软链）
          if (!dirent.isDirectory() && !dirent.isSymbolicLink()) continue
          const dir = join(dshSkills, dirent.name)
          const skillMd = join(dir, 'SKILL.md')
          if (!existsSync(skillMd)) continue
          let description = ''
          let frontName = ''
          try {
            const head = readFileSync(skillMd, 'utf8').slice(0, 2000)
            const m = head.match(/^description:\s*(.+)$/m)
            if (m) description = m[1].replace(/^["']|["']$/g, '').slice(0, 160)
            // DSH 用 SKILL.md 的 frontmatter name 作为 /调用名（packages/skill/skill-filesystem: parsed.name）
            const n = head.match(/^name:\s*(.+)$/m)
            if (n) frontName = n[1].replace(/^["']|["']$/g, '').trim()
          } catch { /* unreadable description is fine */ }
          const bare = skillPrefix && dirent.name.startsWith(skillPrefix)
            ? dirent.name.slice(skillPrefix.length) : dirent.name
          const record = registry.installed?.[`skill/${bare}`]
            ?? registry.installed?.[`skill/${frontName}`]
            ?? null
          rows.push({
            kind: 'skill',
            name: frontName || bare,
            displayName: record?.displayName || frontName || bare,
            description: record?.description || description,
            icon: record?.icon && record.icon !== 'letter:auto' ? record.icon : '',
            local: !record,
            hub: Boolean(record),
            dir,
          })
        }
        rows.sort((a, b) => (a.hub === b.hub ? a.name.localeCompare(b.name) : (a.hub ? -1 : 1)))
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
      const landed = await landOfficialConnector(entryName)
      if (!landed.ok) { json(res, landed.status, { error: landed.error }); return true }
      const { dest, row, flags, bytes, defHash } = landed
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
        files: 1, bytes, flags,
        linked: false,
        enabled: Boolean(previous?.enabled),
        // 官方溯源：连接器没有 version/updatedAt，只有「安装时官方那行 MCP 定义」的哈希，
        // 供 /updates 纯元数据比对（不碰 GitHub、不算文件 sha）。
        source: 'official',
        officialId: null,
        official: true,
        officialMeta: defHash ? { defHash } : null,
      }
      saveJson(P.registry, registry)
      json(res, 200, { ok: true, key, dest, flags })
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

    /* ---------------------------------------------------------------- *
     * 本地 MCP 服务器：注册/列表/启用/停用/移除
     * 栅栏 a) localMcp 默认 false → 写路由 403，列表不给条目数据（guarded:true）
     * 栅栏 c) v1 只收 streamable-http；stdio 在 localMcpSpec 里直接拒绝
     * 栅栏 b) URL 白名单 loopback（localMcpSpec.isLoopbackUrl）
     * 栅栏 d) 每个写动作 console 日志 + 条目时间戳；disable/remove 立即 dispose
     * ---------------------------------------------------------------- */
    // 宿主侧 MCP 总清单（含 DSH 机制加载的）。只读；即使 localMcp 关着也返回，
    // 好让 picker 至少能把「DSH 已加载了哪些 MCP」如实显示出来。
    if (route === 'GET /mcp/host') {
      json(res, 200, {
        ok: true,
        guarded: !localMcpEnabled,
        reason: localMcpEnabled ? '' : LOCAL_MCP_GUARD,
        servers: hostMcpInventory(),
      })
      return true
    }

    if (route === 'GET /mcp/local') {
      if (!localMcpEnabled) {
        json(res, 200, { ok: true, guarded: true, reason: LOCAL_MCP_GUARD, servers: [] })
        return true
      }
      json(res, 200, { ok: true, guarded: false, servers: listLocalMcp().map(localMcpView) })
      return true
    }

    if (route === 'POST /mcp/local') {
      if (!localMcpEnabled) { json(res, 403, { ok: false, error: LOCAL_MCP_GUARD }); return true }
      const body = JSON.parse((await readBody(req)) || '{}')
      const name = String(body.name || '').trim()
      const url = String(body.url || '').trim()
      const token = String(body.token ?? '')
      const tokenRef = String(body.tokenRef || '').trim()
      // 1) 传输白名单（栅栏 c）：stdio 会在本机执行任意命令，本版本不提供；
      //    除 streamable-http 外的其余 transport 同样拒绝（v1 只支持这一种）。
      const wantedTransport = String(body.transport || 'streamable-http').toLowerCase()
      if (wantedTransport === 'stdio') {
        json(res, 400, { ok: false, error: 'v1 只支持 streamable-http；stdio 会在本机执行任意命令，本版本不提供' })
        return true
      }
      if (wantedTransport !== 'streamable-http') {
        json(res, 400, { ok: false, error: `不支持的 transport: ${wantedTransport}（v1 只支持 streamable-http）` })
        return true
      }
      // 2) 准入（名称 + loopback 白名单（栅栏 b） + tokenRef 形状）
      const spec = localMcpSpec({ name, url, tokenRef })
      if (!spec.ok) { json(res, 400, { ok: false, error: spec.error }); return true }
      // 3) token：只写凭据库；明文不落条目、不进响应、不进日志
      if (token !== '') {
        try { await ctx.credentials?.set?.(spec.tokenRef, token) }
        catch (error) {
          json(res, 502, { ok: false, error: `凭据写入失败：${String(error?.message || error).slice(0, 200)}` })
          return true
        }
      }
      const now = new Date().toISOString()
      const prev = readLocalMcp(spec.serverName) || readLocalMcp(name)
      const entry = {
        name: spec.serverName,
        transport: 'streamable-http',
        url: spec.server.url,
        tokenRef: spec.tokenRef,
        enabled: false,
        serverName: spec.serverName,
        createdAt: prev?.createdAt || now,
        updatedAt: now,
        lastEnabledAt: prev?.lastEnabledAt || '',
        note: String(body.note || prev?.note || ''),
      }
      saveLocalMcp(entry)
      auditLog('register', entry.name, `${auditNote(req)} url=${entry.url} tokenRef=${entry.tokenRef}${token !== '' ? ' token=updated' : ' token=unchanged'} at=${now}`)
      json(res, 200, { ok: true, server: localMcpView(entry) })
      return true
    }

    if (route === 'POST /mcp/local/enable') {
      if (!localMcpEnabled) { json(res, 403, { ok: false, error: LOCAL_MCP_GUARD }); return true }
      const body = JSON.parse((await readBody(req)) || '{}')
      const name = String(body.name || '').trim()
      const entry = readLocalMcp(name)
      if (!entry) { json(res, 404, { ok: false, error: `未注册的本地 MCP：${name}` }); return true }
      try {
        const result = await enableLocalMcp(entry)
        const now = new Date().toISOString()
        entry.enabled = true
        entry.serverName = result.serverName
        entry.lastEnabledAt = now
        entry.updatedAt = now
        entry.lastError = ''
        entry.authMode = result.authMode
        saveLocalMcp(entry)
        auditLog('enable', entry.name, `${auditNote(req)} serverName=${result.serverName} auth=${result.authMode} at=${now}`)
        json(res, 200, { ok: true, server: localMcpView(entry) })
      } catch (error) {
        const message = String(error?.message || error).slice(0, 300)
        // 失败保持 disabled：绝不留下「声称已启用但实际没挂上」的中间态
        entry.enabled = false
        entry.lastError = message
        entry.updatedAt = new Date().toISOString()
        saveLocalMcp(entry)
        auditLog('enable-failed', entry.name, `error=${message}`)
        json(res, 502, { ok: false, error: `启用失败：${message}`, status: 'failed' })
      }
      return true
    }

    if (route === 'POST /mcp/local/disable') {
      if (!localMcpEnabled) { json(res, 403, { ok: false, error: LOCAL_MCP_GUARD }); return true }
      const body = JSON.parse((await readBody(req)) || '{}')
      const name = String(body.name || '').trim()
      const entry = readLocalMcp(name)
      if (!entry) { json(res, 404, { ok: false, error: `未注册的本地 MCP：${name}` }); return true }
      const disposed = await disableLocalMcp(name)
      const now = new Date().toISOString()
      entry.enabled = false
      entry.lastDisabledAt = now
      entry.updatedAt = now
      saveLocalMcp(entry)
      auditLog('disable', entry.name, `${auditNote(req)} disposed=${disposed} at=${now}`)
      json(res, 200, { ok: true, server: localMcpView(entry) })
      return true
    }

    if (route === 'POST /mcp/local/remove') {
      if (!localMcpEnabled) { json(res, 403, { ok: false, error: LOCAL_MCP_GUARD }); return true }
      const body = JSON.parse((await readBody(req)) || '{}')
      const name = String(body.name || '').trim()
      const entry = readLocalMcp(name)
      if (!entry) { json(res, 404, { ok: false, error: `未注册的本地 MCP：${name}` }); return true }
      // 先拆传输再删文件：工具先从注册表消失，条目才被移除（与 /uninstall 顺序一致）
      await disableLocalMcp(name)
      rmSync(localMcpPath(name), { force: true })
      const now = new Date().toISOString()
      auditLog('remove', name, `${auditNote(req)} at=${now}`)
      json(res, 200, { ok: true, name, removedAt: now })
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

    // 只读：把该会话的 system prompt 真实 assemble 出来，验证专家人设段是否真的
    // 进了 assembled 结果——这是「模型这一步会收到什么」的精确答案，无需真实模型回合。
    if (route === 'GET /expert-assemble') {
      try {
        const sessionId = String(url.searchParams.get('sessionId') || '').trim()
        if (!sessionId) { json(res, 400, { error: 'missing sessionId' }); return true }
        const sp = ctx.get?.('systemPrompt') ?? ctx.systemPrompt
        if (!sp || typeof sp.assemble !== 'function') {
          json(res, 200, { ok: false, reason: 'systemPrompt unavailable' }); return true
        }
        // 优先用真实 agent 作 scope；没有活跃 agent 时退回 {id}（section 在 global 层，
        // 两种 scope 都能拼出同一份全局 section）。
        const scope = resolveAgent(sessionId) ?? { id: sessionId }
        const assembly = await sp.assemble({ scope })
        const sections = Array.isArray(assembly?.sections) ? assembly.sections : []
        const section = sections.find(item => item?.name === 'workbuddy-expert-persona')
        const deploymentPersona = sections.find(item => item?.name === 'deployment:persona-prefix')
        const rendered = sections.map(item => item?.text ?? '').join('\n\n')
        json(res, 200, {
          ok: true, sessionId,
          sectionCount: sections.length,
          personaPresent: Boolean(section && section.text),
          personaChars: section?.text?.length ?? 0,
          personaText: section?.text ?? '',
          promptContainsMarker: rendered.includes('【已选专家角色】'),
          deploymentPersonaChars: deploymentPersona?.text?.length ?? 0,
          deploymentPersonaText: deploymentPersona?.text ?? '',
        })
      } catch (error) {
        json(res, 500, { ok: false, error: String(error?.message || error) })
      }
      return true
    }

    // 验收用：向某会话发一条用户消息（走官方 sessionController.prompt），
    // 之后读会话日志的 system/message 与 assistant/message 验证人设与回复。
    if (route === 'POST /expert-ask') {
      try {
        const body = JSON.parse((await readBody(req)) || '{}')
        const sessionId = String(body.sessionId || '').trim()
        const text = String(body.text || '').trim()
        if (!sessionId || !text) { json(res, 400, { ok: false, error: 'missing sessionId/text' }); return true }
        const sc = ctx.get?.('sessionController') ?? ctx.sessionController
        if (!sc || typeof sc.prompt !== 'function') { json(res, 503, { ok: false, error: 'sessionController unavailable' }); return true }
        const result = await sc.prompt({
          requestId: `wbh-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          sessionId,
          mode: 'queue',
          content: [{ type: 'text', text }],
        }, new AbortController().signal)
        json(res, 200, { ok: true, accepted: result?.accepted === true })
      } catch (error) {
        json(res, 500, { ok: false, error: String(error?.message || error) })
      }
      return true
    }

    // 排障：读某会话的 header.cwd 与所属工作区（验收工作区落点用）
    if (route === 'GET /expert-session-cwd') {
      try {
        const sessionId = String(url.searchParams.get('sessionId') || '').trim()
        const near = ctx.sessions?.get?.(sessionId)
        const cwd = near?.header?.cwd
        let wsId = ''
        if (cwd) {
          try {
            const reg = ctx.get?.('workspaceRegistry') ?? ctx.workspaceRegistry
            const ws = typeof reg?.resolveByPath === 'function' ? await reg.resolveByPath(cwd) : null
            wsId = ws?.workspaceId || ''
          } catch { /* ignore */ }
        }
        json(res, 200, { ok: true, sessionId, cwd: cwd || '', workspaceId: wsId, hasWorkspaceRegistry: Boolean(ctx.get?.('workspaceRegistry') ?? ctx.workspaceRegistry) })
      } catch (error) { json(res, 500, { ok: false, error: String(error?.message || error) }) }
      return true
    }

    // 排障/验收：用 agent preset 直接建一个会话（等价于官方「新会话 + 选 preset」），
    // 返回会话 id 与 assemble 出的 deployment persona 片段，用来确认 preset 真的
    // 把 agent 的人设换成了专家（无需真实模型回合）。
    // 只读：解析 nearSessionId 所属工作区 id（不建会话）—— 供客户端用 openWorkspace 建会话
    if (route === 'GET /expert-resolve-workspace') {
      try {
        const nearSessionId = String(url.searchParams.get('nearSessionId') || '').trim()
        const workspaceId = nearSessionId ? await resolveWorkspaceIdForSession(ctx, nearSessionId) : ''
        json(res, 200, { ok: true, workspaceId })
      } catch (error) { json(res, 500, { ok: false, error: String(error?.message || error) }) }
      return true
    }

    if (route === 'POST /expert-new-session') {
      try {
        const body = JSON.parse((await readBody(req)) || '{}')
        const presetId = String(body.presetId || '').trim()
        if (presetId && !/^[\w.-]+$/.test(presetId)) { json(res, 400, { ok: false, error: 'invalid presetId' }); return true }
        const sc = ctx.get?.('sessionController') ?? ctx.sessionController
        if (!sc || typeof sc.create !== 'function') { json(res, 503, { ok: false, error: 'sessionController unavailable' }); return true }
        let workspaceId = body.workspaceId ? String(body.workspaceId) : undefined
        if (!workspaceId) workspaceId = await resolveWorkspaceIdForSession(ctx, body.nearSessionId)
        if (!workspaceId) {
          json(res, 409, { ok: false, error: `无法确定新会话的工作区（nearSessionId=${body.nearSessionId || ''}）` })
          return true
        }
        const created = await sc.create({
          ...(presetId ? { agentPreset: presetId } : {}),
          ...(workspaceId ? { workspaceId } : {}),
        })
        json(res, 200, { ok: true, sessionId: created.sessionId, agentPreset: created.agentPreset, attached: true })
      } catch (error) {
        json(res, 500, { ok: false, error: String(error?.message || error) })
      }
      return true
    }

    // 只读：当前会话的专家人设注入状态（排障用：能看到命中哪个专家、注入了多少字）。
    if (route === 'GET /expert-injection') {
      try {
        const sessionId = String(url.searchParams.get('sessionId') || '').trim()
        const disabled = cfg.injectExperts === false
        const expertName = disabled ? '' : firstMountedExpert(P.mounts, sessionId)
        const text = injectedExpertPersona(P, sessionId, disabled)
        json(res, 200, {
          ok: true,
          sessionId,
          disabled,
          sectionRegistered: personaSectionRegistered,
          expert: expertName ? `expert/${expertName}` : '',
          injected: text !== '',
          text,
          chars: text.length,
        })
      } catch (error) {
        json(res, 500, { ok: false, error: String(error?.message || error) })
      }
      return true
    }

    // 方案 B：为某专家准备一份 agent preset（幂等），供「在新会话中召唤」使用。
    if (route === 'POST /expert-preset-ensure') {
      try {
        const body = JSON.parse((await readBody(req)) || '{}')
        const result = await ensureExpertPreset(ctx, P, String(body.name || ''))
        json(res, result.ok ? 200 : 400, result)
      } catch (error) {
        json(res, 500, { ok: false, error: String(error?.message || error) })
      }
      return true
    }

    // 方案 B：把某个**空白**会话的 agent 换成该专家 preset（DSH 语义：会话一旦开始
    // 过回合，preset 就固定，select 会抛 agent-preset/locked，原文回给界面）。

    if (route === 'POST /mount' || route === 'POST /unmount') {
      const body = JSON.parse((await readBody(req)) || '{}')
      const kind = String(body.kind || '')
      const entryName = String(body.name || '')
      const sessionId = String(body.sessionId || '').trim()
      if (!['expert', 'skill', 'connector'].includes(kind) || !/^[\w.-]+$/.test(entryName)) {
        json(res, 400, { error: 'invalid kind or name' }); return true
      }
      // 写操作必须显式指定会话：这里**不**走 resolveSessionId 的 recent-fallback。
      // 兜底取「最近会话」会把条目挂进用户没在看的会话（界面无 chip、却在别的
      // 会话里生效），是静默的错误。缺 sessionId 一律 409，让客户端补齐后重试。
      if (sessionId === '') {
        json(res, 409, { error: 'sessionId is required for mount/unmount' }); return true
      }
      const key = `${kind}/${entryName}`
      const list = route === 'POST /mount'
        ? mountEntry(P, sessionId, key)
        : unmountEntry(P, sessionId, key)
      json(res, 200, { ok: true, sessionId, sessionSource: 'client', keys: list })
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
      if (!resolved) { json(res, 409, { error: 'no session to summon into' }); return true }
      const parent = resolveSummonParent(resolved)
      const agent = parent.agent
      if (!agent) {
        json(res, 409, {
          error: '该会话还没有活跃 agent（先在会话里发一条消息），因此无法为专家建会话',
          sessionId: resolved, parentSource: parent.source,
        })
        return true
      }
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
        json(res, 200, {
          ok: true, childId: started.childId, sessionId: resolved,
          sessionSource: resolvedSession.source, parentSource: parent.source,
        })
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
      // 与工具 handler（workbuddy_install）共用同一条安装实现 —— 逻辑只有一份，
      // 差异只在失败时如何呈现（路由回 JSON 状态码，工具抛带可读信息的错误）。
      try {
        const { key, report, linked } = await installEntry(ctx, P, cfg, { kind, name: entryName, source: body.source })
        json(res, 200, { ok: true, key, report, linked })
      } catch (error) {
        // installFailure 把内部失败翻译回**原有的** HTTP 语义（400/404/502），
        // 状态码与抽取前保持一致（现有测试必须继续绿）。
        const fail = error?.installFailure
        json(res, fail?.status ?? 502, { error: String(error?.message || error) })
      }
      return true
    }

    if (route === 'POST /uninstall') {
      const body = JSON.parse((await readBody(req)) || '{}')
      const kind = String(body.kind || '')
      const entryName = String(body.name || '')
      if (!['expert', 'skill', 'connector'].includes(kind) || !/^[\w.-]+$/.test(entryName)) {
        json(res, 400, { error: 'invalid kind or name' }); return true
      }
      // 与工具 handler（workbuddy_uninstall）共用同一条卸载实现 —— 逻辑只有一份，
      // 差异只在「没装」时如何呈现（路由回 404 JSON，工具给模型一段可读文本）。
      const removed = await uninstallEntry(P, cfg, { kind, name: entryName })
      if (!removed) { json(res, 404, { error: 'not installed' }); return true }
      json(res, 200, { ok: true, removed: removed.key, prunedSessions: removed.prunedSessions })
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

  // 启动时恢复已启用的本地 MCP：与连接器恢复同一处/同一风格（延迟 1.5s，逐条恢复）。
  // 失败只记 lastError，**绝不让插件启动失败** —— 本地服务器（如 Docker 容器）完全
  // 可能在 DSH 之后才起来。
  ctx.effect(() => {
    let cancelled = false
    const timer = setTimeout(async () => {
      try {
        if (!localMcpEnabled) return
        for (const entry of listLocalMcp()) {
          if (cancelled) return
          if (entry.enabled !== true) continue
          try {
            const result = await enableLocalMcp(entry)
            const now = new Date().toISOString()
            entry.serverName = result.serverName
            entry.lastEnabledAt = now
            entry.updatedAt = now
            entry.lastError = ''
            entry.authMode = result.authMode
            saveLocalMcp(entry)
            auditLog('restore', entry.name, `serverName=${result.serverName} auth=${result.authMode} at=${now}`)
          } catch (error) {
            const message = String(error?.message || error).slice(0, 300)
            try {
              const now = new Date().toISOString()
              entry.enabled = false
              entry.lastError = message
              entry.updatedAt = now
              saveLocalMcp(entry)
            } catch { /* 落盘失败也只影响可见性 */ }
            auditLog('restore-failed', entry.name, `error=${message}`)
          }
        }
      } catch { /* 列表读不出来 → 没有可恢复的记录 */ }
    }, 1500)
    return () => { cancelled = true; clearTimeout(timer) }
  }, 'workbuddy-hub: restore enabled local MCP servers')

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
