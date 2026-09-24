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
 *
 * 输出（默认，每行一条，便于模型直接引用）：
 *   expert/content-creator | 文博凯 | 擅长创作引人入胜的多平台内容 | 内容策略,多平台创作
 *   # 命中 11 条，显示 5 条（--limit 最多 20）
 *
 * 机器可读的**一行**结论（失败时只输出一行，便于模型据此行动）：
 *   NO_MATCH        没有命中（建议换关键词，中英都试）
 *   NEED_LOGIN      技能/连接器需要 WorkBuddy 账号登录（专家不需要）
 *   ERROR <原因>    其它失败
 *
 * 环境变量：WBH_STORE 覆盖内容仓路径（默认 ~/workbuddyskills）。
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { listExperts } from '../wb-experts.js'
import { marketList, connectorRegistry } from '../wb-market.js'

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

/** 主流程（可被测试调用，返回 { code, lines }）。 */
export async function run(argv, deps = {}) {
  const args = parseArgs(argv)
  const paths = storePaths(args.store)
  const experts = deps.listExperts || listExperts
  const market = deps.marketList || marketList
  const connectors = deps.connectorRegistry || connectorRegistry

  if (!args.kind || !['expert', 'skill', 'connector', 'installed'].includes(args.kind)) {
    return { code: 2, lines: ['ERROR 用法：hub-find.mjs <expert|skill|connector|installed> [关键词] [--limit N] [--json]'] }
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
