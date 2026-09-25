#!/usr/bin/env node
/**
 * hub-find —— WorkBuddy 市场检索的**本地脚本入口**（给 agent 用，替代裸 curl）。
 *
 * 为什么需要它：
 *  1) **省 token**：裸 curl 会把整段 JSON 塞进上下文（实测一次「合同」查询 = 12.7KB，
 *     还不带关键词时能到 473KB）；本脚本在本地过滤/排序/排版，只把 top-N 的紧凑结果
 *     交给模型（实测约 0.4KB，≈30 倍差距），模型也不必在上下文里解析 JSON。
 *  2) **裸 curl 根本走不通**：hub 的 HTTP 路由在 DSH 的连接栅栏后面，实测生产上
 *     `curl http://127.0.0.1:3080/workbuddy-hub/health` 返回 **401**（连 /health 都是）。
 *     本脚本改为**直接 import 插件自己的模块**（wb-experts.js / wb-market.js）：
 *     无鉴权依赖、与宿主同一套逻辑、没有任何重复实现。
 *
 * 用法（从插件仓库根目录）：
 *   node scripts/hub-find.mjs expert    合同 [--limit 5] [--json]
 *   node scripts/hub-find.mjs skill     表格 [--limit 5]
 *   node scripts/hub-find.mjs connector 地图 [--limit 5]
 *   node scripts/hub-find.mjs installed            # 本机已装清单
 *   node scripts/hub-find.mjs inspect  <expert|skill|connector> <name> [--json]
 *                                  # 装前只读安全预检（不落盘、不执行包内代码）
 *   node scripts/hub-find.mjs update-check [kind|name] [--json]
 *                                  # 只读检查更新（复用 src/updates.js 与内容仓注册表）
 *
 * 输出（默认，每行一条，便于模型直接引用）：
 *   expert/content-creator | 文博凯 | 擅长创作引人入胜的多平台内容 | 内容策略,多平台创作
 *   # 命中 11 条，显示 5 条（--limit 最多 20）
 *
 * 机器可读的**一行**结论（失败时只输出一行，便于模型据此行动）：
 *   NO_MATCH        没有命中（建议换关键词，中英都试）
 *   NEED_LOGIN      技能/连接器需要 WorkBuddy 账号登录（专家不需要）
 *   ERROR <原因>    其它失败
 *   NOT_FOUND <原因>  inspect：官方市场/注册表没有这个条目
 *
 * update-check 的语义纪律（与 GET /updates、设置页同一口径）：
 *  · 每行一条：`kind/name | 状态 | 本地→远端`，状态只有「已是最新 / 有更新 / 无法检查」；
 *  · 信息不足（官方版本缺失、老记录没有 officialMeta、未登录、接口失败）一律
 *    **无法检查**，绝不许说成「已是最新」——静默的假「已是最新」比报错更糟；
 *  · 末尾一行汇总：`# 共 N 项：有更新 x / 已是最新 y / 无法检查 z`；
 *  · 全程只读：不写任何文件、不触发任何启用或重装。
 *
 * 环境变量：WBH_STORE 覆盖内容仓路径（默认 ~/workbuddyskills）。
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { listExperts, registry as officialRegistry } from '../wb-experts.js'
import { marketList, connectorRegistry, loadAuth, skillDetails } from '../wb-market.js'
import { inspectExpert, inspectSkill, inspectConnector, formatInspectCard, inspectError } from '../wb-inspect.js'
// 更新判定与宿主 GET /updates 共用同一份纯模块（无 IO、无 DSH 依赖）。
import {
  compareOfficial, compareSkillVersion, compareConnectorDef, summarizeUpdates,
} from '../src/updates.js'

export const DEFAULT_LIMIT = 5
export const MAX_LIMIT = 20

/** 把一行里的分隔符/换行清掉，避免破坏「一行一条」的契约。 */
export function oneLine(text, max = 0) {
  const s = String(text ?? '').replace(/\s+/g, ' ').replace(/\|/g, '/').trim()
  return max > 0 && s.length > max ? s.slice(0, max - 1) + '…' : s
}

/** 解析 argv（--limit / --json / --store）。 */
export function parseArgs(argv) {
  const out = { kind: '', query: '', limit: DEFAULT_LIMIT, json: false, store: '' }
  const rest = []
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i]
    if (a === '--json') out.json = true
    else if (a === '--limit') { const n = Number(argv[++i]); out.limit = Number.isFinite(n) ? n : DEFAULT_LIMIT }
    else if (a === '--store') out.store = String(argv[++i] || '')
    else if (a.startsWith('--limit=')) { const n = Number(a.slice(8)); out.limit = Number.isFinite(n) ? n : DEFAULT_LIMIT }
    else if (a.startsWith('--store=')) out.store = a.slice(8)
    else rest.push(a)
  }
  out.kind = (rest[0] || '').toLowerCase()
  out.query = rest.slice(1).join(' ').trim()
  // 上限硬约束：脚本层面就不允许「翻全表」（这是上一轮 473KB 事故的根因）
  out.limit = Math.max(1, Math.min(MAX_LIMIT, Math.floor(out.limit)))
  return out
}

/** 内容仓 → 凭证/状态目录（与宿主 storePaths 的默认一致）。 */
export function storePaths(storeRoot) {
  const root = storeRoot || process.env.WBH_STORE || join(homedir(), 'workbuddyskills')
  return { root, state: join(root, '.meta', 'state'), registry: join(root, '.meta', 'registry.json') }
}

/** 官方技能行 → 紧凑记录。字段名兼容 snake_case（官方市场）与 camelCase。 */
export function shapeSkill(row) {
  return {
    kind: 'skill',
    name: row.name || row.skill_id || '',
    displayName: row.display_name_zh || row.displayName || row.name || '',
    note: oneLine(row.description_zh || row.description || '', 60),
    version: row.version || '',
    tags: [],
  }
}

/** 官方连接器行（connectorRegistry 已整形）→ 紧凑记录。 */
export function shapeConnector(row) {
  return {
    kind: 'connector',
    name: row.name || '',
    displayName: row.displayName || row.name || '',
    note: oneLine(row.description || '', 60),
    version: '',
    tags: [row.authType || '', row.mcp ? 'mcp' : 'cli'].filter(Boolean),
  }
}

/** 专家行 → 紧凑记录。 */
export function shapeExpert(row) {
  return {
    kind: 'expert',
    name: row.name || '',
    displayName: row.displayName || row.name || '',
    note: oneLine(row.subtitle || row.description || '', 60),
    version: '',
    tags: Array.isArray(row.tags) ? row.tags.slice(0, 3) : [],
  }
}

/**
 * 紧凑记录 → 一行文本。
 * **每一列都过 oneLine**：这个函数的输出就是模型看到的全部内容，只要有一列夹带换行/竖线，
 * 「一行一条」的契约就破了（模型解析会错位），所以这里自己做兜底，不依赖调用方先清洗。
 */
export function formatRow(row) {
  const tags = (row.tags || []).filter(Boolean).join(',')
  return [
    oneLine(row.kind + '/' + row.name, 48),
    oneLine(row.displayName, 24),
    oneLine(row.note, 80),
    oneLine(tags, 60),
  ].filter((x, i) => i < 2 || x !== '').join(' | ')
}

/** 连接器/技能由本地过滤（connectorRegistry 无 keyword 参数）。 */
export function filterRows(rows, query) {
  const q = String(query || '').trim().toLowerCase()
  if (!q) return rows
  return rows.filter(r => [r.name, r.displayName, r.description, r.subtitle, r.authType]
    .some(v => String(v || '').toLowerCase().includes(q)))
}

/**
 * update-check 的一行输出。状态词只有三个，与设置页徽标同口径：
 * 「已是最新 / 有更新 / 无法检查」—— unknown **绝不**渲染成「已是最新」。
 * 每一列都单独过 oneLine（竖线/换行在列内被清掉），再用「 | 」拼行 —— 与 formatRow
 * 同一做法：整行直接过 oneLine 会把分列符自己也替换掉（实测 `|` → `/`）。
 */
export function formatUpdateLine(entry) {
  const local = entry.localVersion || entry.localAt || entry.localHash || ''
  const remote = entry.remoteVersion || entry.remoteAt || entry.remoteHash || ''
  const pair = [local, remote].filter(Boolean).join('→') || '—'
  return [
    oneLine(`${entry.kind}/${entry.name}`, 48),
    oneLine(entry.label, 8),
    oneLine(pair, 80),
  ].join(' | ')
}

/** 状态 → 中文标签（唯一映射，防止各处措辞漂移）。 */
export const UPDATE_LABELS = { update: '有更新', current: '已是最新', unknown: '无法检查' }

/**
 * update-check 主实现（与宿主 GET /updates 同一判定来源，但**独立读盘/读官方**，
 * 不经过 hub HTTP —— 裸 curl 会 401）。只读：不写注册表、不触发任何启用或重装。
 *
 * @returns {Promise<{code:number, lines:string[]}>}
 */
export async function runUpdateCheck({ args, paths, positional, deps }) {
  const hookable = deps.hooks || {}
  // ---- 1) 读注册表（只读；读不到 = 什么都没装）----
  let reg = { installed: {} }
  try { reg = JSON.parse(readFileSync(paths.registry, 'utf8')) } catch { reg = { installed: {} } }
  let records = Object.entries(reg.installed || {})
  // 位置参数：可以是 kind（expert/skill/connector）过滤，也可以是具体 name。
  const wanted = (positional.slice(1).join(' ') || '').trim().toLowerCase()
  const KINDS = ['expert', 'skill', 'connector']
  if (wanted && KINDS.includes(wanted)) records = records.filter(([, rec]) => String(rec?.kind || '') === wanted)
  else if (wanted) records = records.filter(([key, rec]) => key.toLowerCase().includes(wanted)
    || String(rec?.name || '').toLowerCase().includes(wanted)
    || String(rec?.displayName || '').toLowerCase().includes(wanted))
  if (records.length === 0) return { code: 0, lines: ['NO_MATCH 内容仓里没有可检查的条目（没装任何东西，或名称不匹配）'] }

  // ---- 2) 拉官方数据（各自尽力，失败只把相关条目判 unknown，绝不影响别的 kind）----
  const sourceError = { expert: '', skill: '', connector: '' }
  let expertIndex = null, skillIndex = null, connectorIndex = null
  let loggedIn = false
  try { loggedIn = Boolean(deps.loadAuth?.(paths.state)?.access_token) } catch { loggedIn = false }
  if (records.some(([, r]) => r?.kind === 'expert')) {
    try {
      const data = await (hookable.expertRegistry || deps.registry)()
      expertIndex = new Map()
      for (const raw of data?.experts ?? []) {
        if (raw?.id) expertIndex.set(String(raw.id), raw)
        if (raw?.plugin) expertIndex.set(String(raw.plugin), raw)
        if (raw?.agentName) expertIndex.set(String(raw.agentName), raw)
      }
    } catch (error) { sourceError.expert = String(error?.message || error) }
  }
  if (records.some(([, r]) => r?.kind === 'skill')) {
    if (!loggedIn) sourceError.skill = 'NEED_LOGIN 需要登录才能读取官方技能数据'
    else {
      const ids = [...new Set(records
        .filter(([, r]) => r?.kind === 'skill')
        .map(([, r]) => (r?.officialId == null ? '' : String(r.officialId))).filter(Boolean))]
      try {
        const rows = ids.length ? await (hookable.skillDetails || deps.skillDetailsFor)(ids, paths.state) : []
        skillIndex = new Map(rows.map(row => [String(row?.skill_id ?? row?.skillId ?? ''), row]))
      } catch (error) { sourceError.skill = String(error?.message || error) }
    }
  }
  if (records.some(([, r]) => r?.kind === 'connector')) {
    if (!loggedIn) sourceError.connector = 'NEED_LOGIN 需要登录才能读取官方连接器注册表'
    else {
      try {
        const rows = await (hookable.connectorRegistry || deps.connectors)(paths.state)
        connectorIndex = new Map(rows.map(row => [String(row?.name ?? ''), row]))
      } catch (error) { sourceError.connector = String(error?.message || error) }
    }
  }

  // ---- 3) 逐条判定（纯函数来自 src/updates.js，与 GET /updates 同一份）----
  const entries = records.map(([key, record]) => {
    const slash = key.indexOf('/')
    const kind = record?.kind || (slash > 0 ? key.slice(0, slash) : '')
    const entryName = record?.name || (slash > 0 ? key.slice(slash + 1) : key)
    if (kind === 'expert') {
      if (expertIndex === null) {
        return { key, kind, name: entryName, status: 'unknown', reason: `官方专家注册表不可用：${sourceError.expert}`, localAt: '', remoteAt: '' }
      }
      const cmp = compareOfficial(record, expertIndex.get(String(entryName)) ?? null)
      return { key, kind, name: entryName, status: cmp.status, reason: cmp.reason, localAt: cmp.localAt, remoteAt: cmp.remoteAt }
    }
    if (kind === 'skill') {
      if (skillIndex === null) {
        return { key, kind, name: entryName, status: 'unknown', reason: sourceError.skill || '官方技能数据不可用', localVersion: '', remoteVersion: '' }
      }
      const officialId = record?.officialId == null ? '' : String(record.officialId)
      if (!officialId) {
        return { key, kind, name: entryName, status: 'unknown', reason: '本地记录缺少官方技能 ID（officialId），无法与官方比对；重装一次即可记录', localVersion: '', remoteVersion: '' }
      }
      const cmp = compareSkillVersion(record, skillIndex.get(officialId) ?? null)
      return { key, kind, name: entryName, status: cmp.status, reason: cmp.reason, localVersion: cmp.localVersion, remoteVersion: cmp.remoteVersion }
    }
    if (kind === 'connector') {
      if (connectorIndex === null) {
        return { key, kind, name: entryName, status: 'unknown', reason: sourceError.connector || '官方连接器注册表不可用', localHash: '', remoteHash: '' }
      }
      const cmp = compareConnectorDef(record, connectorIndex.get(String(entryName)) ?? null)
      return { key, kind, name: entryName, status: cmp.status, reason: cmp.reason, localHash: cmp.localHash, remoteHash: cmp.remoteHash }
    }
    return { key, kind, name: entryName, status: 'unknown', reason: `未知条目类型：${kind || '(空)'}` }
  })

  // ---- 4) 输出：一行一条 + 汇总；失败时一行机器可读结论 ----
  if (args.json) {
    return { code: 0, lines: [JSON.stringify(entries.map(e => ({ ...e, label: UPDATE_LABELS[e.status] })))] }
  }
  const counts = summarizeUpdates(entries)
  const lines = entries.map(entry => {
    const line = formatUpdateLine({ ...entry, label: UPDATE_LABELS[entry.status] || UPDATE_LABELS.unknown })
    return entry.status === 'unknown' ? `${line}（${oneLine(entry.reason, 60)}）` : line
  })
  // 源级失败单独一行提示（NEED_LOGIN / ERROR 一行结论，模型据此行动）。
  if (sourceError.skill.startsWith('NEED_LOGIN') || sourceError.connector.startsWith('NEED_LOGIN')) {
    lines.push(`NEED_LOGIN ${sourceError.skill || sourceError.connector}`.slice(0, 160))
  }
  lines.push(`# 共 ${entries.length} 项：有更新 ${counts.update} / 已是最新 ${counts.current} / 无法检查 ${counts.unknown}`)
  return { code: 0, lines }
}


/** 主流程（可被测试调用，返回 { code, lines }）。 */
export async function run(argv, deps = {}) {
  const args = parseArgs(argv)
  // 位置参数（去掉 --xxx 选项后的原始序列）：inspect 需要按位置取子类型与名称，
  // 而 parseArgs 只暴露 kind/query 两个槽。
  const positional = []
  for (let i = 0; i < argv.length; i += 1) {
    const a = String(argv[i] || '')
    if (a === '--limit' || a === '--store') i += 1
    else if (!a.startsWith('--')) positional.push(a)
  }
  const paths = storePaths(args.store)
  const experts = deps.listExperts || listExperts
  const market = deps.marketList || marketList
  const connectors = deps.connectorRegistry || connectorRegistry

  if (!args.kind || !['expert', 'skill', 'connector', 'installed', 'inspect', 'update-check'].includes(args.kind)) {
    return { code: 2, lines: ['ERROR 用法：hub-find.mjs <expert|skill|connector|installed|inspect|update-check> [关键词|名称] [--limit N] [--json]'] }
  }

  // ---- inspect：装前只读安全预检（不落盘、不碰 storeRoot、不执行包内代码）----
  if (args.kind === 'inspect') {
    // 调用形态：inspect <expert|skill|connector> <name>。
    const wanted = { kind: (positional[1] || '').toLowerCase(), name: positional.slice(2).join(' ').trim() }
    // 预检函数可整体注入（deps.inspect.inspectExpert / inspectSkill / inspectConnector），
    // 测试据此钉格式契约；生产路径用 wb-inspect.js 的真实现。
    const hooks = deps.inspect || {}
    if (!['expert', 'skill', 'connector'].includes(wanted.kind) || !/^[\w.-]+$/.test(wanted.name)) {
      return { code: 2, lines: ['ERROR 用法：hub-find.mjs inspect <expert|skill|connector> <name> [--json]'] }
    }
    try {
      const card = wanted.kind === 'expert' ? await (hooks.inspectExpert || inspectExpert)(wanted.name, hooks)
        : wanted.kind === 'skill' ? await (hooks.inspectSkill || inspectSkill)(wanted.name, { stateDir: paths.state, ...hooks })
        : await (hooks.inspectConnector || inspectConnector)(wanted.name, { stateDir: paths.state, ...hooks })
      if (args.json) return { code: 0, lines: [JSON.stringify(card)] }
      return { code: 0, lines: formatInspectCard(card) }
    } catch (error) {
      const fail = inspectError(error)
      if (fail.code === 'NOT_FOUND') return { code: 3, lines: [`NOT_FOUND 官方市场/注册表没有「${wanted.kind}/${wanted.name}」：${oneLine(fail.message, 100)}`] }
      if (fail.code === 'NEED_LOGIN') return { code: 1, lines: [`NEED_LOGIN inspect ${wanted.kind}/${wanted.name} 需要登录（${oneLine(fail.message, 100)}）`] }
      return { code: 1, lines: ['ERROR ' + oneLine(fail.message, 160)] }
    }
  }

  if (args.kind === 'installed') {
    let reg = { installed: {} }
    try { reg = JSON.parse(readFileSync(paths.registry, 'utf8')) } catch { /* 未装任何东西 */ }
    const rows = Object.entries(reg.installed || {}).map(([key, rec]) => ({
      kind: rec.kind || key.split('/')[0], name: rec.name || key.split('/')[1],
      displayName: oneLine(rec.displayName || rec.name || '', 24),
      note: oneLine(rec.source === 'official' ? '官方' : '镜像时代安装', 12), tags: [],
    }))
    return finish(rows, args, rows.length)
  }

  // ---- update-check：只读检查更新（复用 src/updates.js，与 GET /updates 同一判定）----
  // 语义纪律：信息不足（缺官方版本 / 缺 officialMeta / 未登录 / 接口失败 / 已下架）
  // 一律「无法检查」，**绝不能**说成「已是最新」；全程不写盘、不触发启用或重装。
  if (args.kind === 'update-check') {
    return runUpdateCheck({ args, paths, positional, deps: {
      registry: deps.registry || officialRegistry, connectors: deps.connectorRegistry || connectorRegistry,
      skillDetailsFor: deps.skillDetailsFor || skillDetails, loadAuth: deps.loadAuth || loadAuth,
    } })
  }

  let rows = []
  if (args.kind === 'expert') {
    // 官方注册表：公开，无需登录
    const out = await experts({ query: args.query, limit: args.limit })
    rows = (out.rows || []).map(shapeExpert)
    return finish(rows, args, out.total ?? rows.length)
  }

  try {
    if (args.kind === 'skill') {
      // 真实签名：marketList(kind, { page, pageSize, query, categoryId, categories }, stateDir)
      const out = await market('skill', { page: 1, pageSize: args.limit, query: args.query }, paths.state)
      rows = (out.rows || []).map(shapeSkill)
      return finish(rows, args, out.total ?? rows.length)
    }
    const all = await connectors(paths.state)
    const matched = filterRows(all, args.query)
    if (!matched.length) {
      return { code: 0, lines: [`NO_MATCH 官方连接器共 ${all.length} 个，没有匹配「${oneLine(args.query, 20)}」的（换关键词，或用 --limit 列前几个）`] }
    }
    rows = matched.slice(0, args.limit).map(shapeConnector)
    return finish(rows, args, matched.length)
  } catch (error) {
    const msg = String(error?.message || error)
    const needLogin = /401|403|login|unauthor|需要登录|token/i.test(msg)
    return { code: 1, lines: [needLogin ? 'NEED_LOGIN' : 'ERROR ' + oneLine(msg, 120)] }
  }
}

function finish(rows, args, total) {
  if (!rows.length) return { code: 0, lines: ['NO_MATCH'] }
  if (args.json) return { code: 0, lines: [JSON.stringify(rows)] }
  const lines = rows.map(formatRow)
  lines.push(`# 命中 ${total} 条，显示 ${rows.length} 条（--limit 最多 ${MAX_LIMIT}）`)
  return { code: 0, lines }
}

// 直接执行时才打印（被 import 做测试时不打印）。
// 注意：不能用 endsWith('hub-find.mjs') —— test-hub-find.mjs 也以它结尾，会把测试进程带跑偏。
const invokedPath = process.argv[1] ? fileURLToPath(import.meta.url) === resolve(process.argv[1]) : false
if (invokedPath) {
  const { code, lines } = await run(process.argv.slice(2)).catch(error => ({
    code: 1, lines: ['ERROR ' + oneLine(String(error?.message || error), 120)],
  }))
  process.stdout.write(lines.join('\n') + '\n')
  process.exit(code)
}
