/**
 * 能力闲置统计。
 *
 * 数据源是 DSH 自己的会话记录 `~/.dsh/sessions/**\/session.v*.jsonl.zstd`。
 * 每条 `tool/call` 事件带 name 与 arguments，据此还原三件事：
 *   - 哪个 skill 被 load 过（工具名 `skill`，arguments.name 是 skill 名）
 *   - 哪个 MCP server 被用过（工具名 `mcp__<server>__<tool>`）
 *   - 哪几天有活动（activeDays，用于压掉「刚装就判闲置」）
 *
 * 实测：30 天 425 个文件 / 299MB，zstd 8 路并行解压 + 逐行匹配约 1.4s。
 * 所以默认全量重扫 + 5 分钟内存缓存，不做增量落盘 —— 增量会引入一致性问题，
 * 而全量成本已经在可接受范围内。
 */
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { execFile } from 'node:child_process'
import { readdirSync, statSync, existsSync } from 'node:fs'

const PARALLEL = 8
const CACHE_TTL_MS = 5 * 60 * 1000

function dshHome() {
  const raw = String(process.env?.DSH_HOME ?? '')
  return raw.trim() === '' ? join(homedir(), '.dsh') : resolve(raw.trim())
}

export function sessionsRoot() { return join(dshHome(), 'sessions') }

/** YYYY-MM-DD（本地时区，与 WorkBuddy 的日期粒度一致） */
export function dayOf(ms) {
  const d = new Date(ms)
  const p = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export function today() { return dayOf(Date.now()) }

/** 两个 YYYY-MM-DD 之间的天数差 */
export function daysBetween(from, to) {
  if (!from || !to) return null
  const [y1, m1, d1] = from.split('-').map(Number)
  const [y2, m2, d2] = to.split('-').map(Number)
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000)
}

function walk(dir, out, cutoffMs, depth = 0) {
  if (depth > 4) return
  let entries
  try { entries = readdirSync(dir, { withFileTypes: true }) } catch { return }
  for (const e of entries) {
    const p = join(dir, e.name)
    if (e.isDirectory()) { walk(p, out, cutoffMs, depth + 1); continue }
    if (!/^session\.v\d+\.jsonl\.zstd$/.test(e.name)) continue
    let st
    try { st = statSync(p) } catch { continue }
    if (st.mtimeMs < cutoffMs) continue
    out.push({ path: p, mtimeMs: st.mtimeMs, size: st.size })
  }
}

function decode(file) {
  return new Promise(resolvePromise => {
    execFile('zstd', ['-dc', file], { maxBuffer: 256 * 1024 * 1024 }, (error, stdout) => {
      resolvePromise(error ? '' : String(stdout))
    })
  })
}

/** 从一个已解压的会话文本里抽使用事件 */
function collectFromText(text, acc) {
  const lines = text.split('\n')
  for (const line of lines) {
    // 便宜的前置过滤：绝大多数行不是 tool/call
    if (!line.includes('"type":"tool/call"')) continue
    let rec
    try { rec = JSON.parse(line) } catch { continue }
    if (rec?.type !== 'tool/call') continue
    const name = String(rec.data?.name ?? '')
    const at = Number(rec.time ?? rec.data?.time ?? 0)
    if (!name || !at) continue
    const day = dayOf(at)
    acc.activeDays.add(day)

    if (name === 'skill') {
      let skillName = ''
      try {
        const args = typeof rec.data.arguments === 'string' ? JSON.parse(rec.data.arguments) : rec.data.arguments
        skillName = String(args?.name ?? args?.skill ?? '')
      } catch { /* 参数不是 JSON 就跳过 */ }
      if (skillName) bump(acc.skills, skillName, day, at)
      continue
    }
    if (name.startsWith('mcp__')) {
      // mcp__<server>__<tool>；server 名里本身可能带下划线，用第一段作 server
      const rest = name.slice(5)
      const cut = rest.indexOf('__')
      const server = cut > 0 ? rest.slice(0, cut) : rest
      if (server) bump(acc.mcp, server, day, at)
    }
  }
}

function bump(map, key, day, at) {
  const cur = map[key]
  if (!cur) { map[key] = { lastDay: day, lastAt: at, count: 1 }; return }
  cur.count += 1
  if (at > cur.lastAt) { cur.lastAt = at; cur.lastDay = day }
}

let cache = null

/**
 * 扫描会话记录，返回使用统计。
 * @param {{days?: number, force?: boolean}} options days 默认 90 天
 */
export async function scanUsage(options = {}) {
  const days = options.days ?? 90
  // 会话根必须可覆盖：patch overlay 会把 root 换到别处，写死 $DSH_HOME/sessions
  // 会读到生产会话（隔离验收里就是越界）。缓存按 root 分键，否则两个根互相顶掉。
  const root = options.root || sessionsRoot()
  const cacheKey = `${root}|${days}`
  if (!options.force && cache && cache.key === cacheKey && Date.now() - cache.at < CACHE_TTL_MS) return cache.value

  if (!existsSync(root)) {
    const empty = { skills: {}, mcp: {}, activeDays: [], files: 0, scannedAt: Date.now(), root }
    cache = { at: Date.now(), key: cacheKey, value: empty }
    return empty
  }

  const cutoffMs = Date.now() - days * 86400000
  const files = []
  walk(root, files, cutoffMs)

  const acc = { skills: {}, mcp: {}, activeDays: new Set() }
  for (let i = 0; i < files.length; i += PARALLEL) {
    const batch = files.slice(i, i + PARALLEL)
    const texts = await Promise.all(batch.map(f => decode(f.path)))
    for (const t of texts) if (t) collectFromText(t, acc)
  }

  const value = {
    skills: acc.skills,
    mcp: acc.mcp,
    activeDays: [...acc.activeDays].sort(),
    files: files.length,
    scannedAt: Date.now(),
    root,
  }
  cache = { at: Date.now(), key: cacheKey, value }
  return value
}

export function clearUsageCache() { cache = null }

/**
 * 从已装清单里挑出「闲置」的条目。
 *
 * 判定口径照搬 WorkBuddy 的 computeIdleCandidates，但补了它漏掉的默认值：
 *   - idleDays 从「上次使用日」算；从没有记录则从「安装日」算
 *   - 两者都要被「安装至今」压住上限，防新装当天就被判闲置
 *   - WorkBuddy 那边 activeDays 采而不用（3 天活跃账号照样弹），这里拿来当护栏：
 *     账号活跃天数不足门槛的一半，直接不弹 —— 否则新用户第一次打开就是一片红。
 *
 * @param {object} input
 * @param {{skills: Record<string,{lastDay:string}>, mcp: Record<string,{lastDay:string}>, activeDays: string[]}} input.usage
 * @param {Array<{id:string, name:string, installedDay?:string}>} input.skills 已挂载的技能
 * @param {Array<{id:string, name:string, installedDay?:string}>} input.mcps 已启用的本地 MCP
 * @param {{dismissed?: Record<string, number>, lastShownDate?: string}} input.state
 * @param {number} [input.idleThreshold]
 * @param {string} [input.today]
 */
export function computeCandidates(input) {
  const threshold = input.idleThreshold ?? 14
  const now = input.today ?? today()
  const state = input.state ?? {}
  const dismissed = state.dismissed ?? {}
  const activeDays = input.usage?.activeDays ?? []

  const meta = {
    threshold,
    today: now,
    activeDays: activeDays.length,
    lastShownDate: state.lastShownDate ?? null,
    blockedBy: null,
    candidates: [],
  }

  // 今天已经弹过 → 不再弹（官方同款闸门）
  if (state.lastShownDate === now) { meta.blockedBy = 'shown-today'; return meta }
  if (state.globalDismissed && (state.globalDismissedVersion ?? 0) >= 3) {
    meta.blockedBy = 'global-dismissed'
    return meta
  }
  // 账号本身刚上手，别拿闲置糊脸
  if (activeDays.length > 0 && activeDays.length < Math.ceil(threshold / 2)) {
    meta.blockedBy = 'too-new'
    return meta
  }

  const consider = (type, list, usageMap) => {
    for (const item of list ?? []) {
      const key = `${type}:${item.id}`
      if (dismissed[key]) continue
      const used = usageMap?.[item.id] ?? usageMap?.[item.name]
      const lastUsedDate = used?.lastDay ?? null
      const anchor = lastUsedDate ?? item.installedDay ?? null
      if (!anchor) continue
      let idleDays = daysBetween(anchor, now)
      if (idleDays === null || idleDays < 0) continue
      // 压到「安装至今」上限：装了两天不可能闲置两周
      if (item.installedDay) {
        const ageDays = daysBetween(item.installedDay, now)
        if (ageDays !== null && ageDays >= 0) idleDays = Math.min(idleDays, ageDays)
      }
      if (idleDays < threshold) continue
      meta.candidates.push({ type, id: item.id, name: item.name, idleDays, lastUsedDate, installedDay: item.installedDay ?? null })
    }
  }

  consider('skill', input.skills, input.usage?.skills)
  consider('mcp', input.mcps, input.usage?.mcp)

  meta.candidates.sort((a, b) => b.idleDays - a.idleDays)
  return meta
}

/** 把毫秒时间戳转成本地 YYYY-MM-DD，供「安装日」用 */
export function dayOfMs(ms) { return dayOf(ms) }
