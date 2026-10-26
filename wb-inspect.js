/**
 * dsh-workbuddy-hub — 装前只读安全预检（inspect）的唯一实现。
 *
 * 被两处共用（同一实现，不分叉）：
 *  · scripts/hub-find.mjs 的 `inspect` 子命令（模型在终端里跑，结果打给模型）；
 *  · index.js 里 workbuddy_install 工具的 execute()（装前强制预检 → 拿安全卡去请求审批）。
 *
 * 铁律：**绝对不落盘、绝不执行包内代码**。
 *  · expert：官方注册表原始条目 → 拉人设 md（纯文本）→ scanFlags 扫；头像只记体积不记内容；
 *  · skill：skillDetails 拿 download_url → zip 下载进**内存** → unzip → 逐条目扫描（二进制只记体积）；
 *  · connector：connectorRegistry 该行 → scanMcpDefinitionFlags 扫它的 mcp 定义
 *    （外部 URL / 声明命令执行 / 凭据头 / 凭据查询参数）。
 *
 * 失败语义与 hub-find 现有风格一致：NOT_FOUND / NEED_LOGIN / ERROR <原因>。
 */
import { scanFlags, scanMcpDefinitionFlags } from './scan.js'
import { unzip } from './wb-unzip.js'

/** 与宿主 install 路由一致的包大小上限。 */
export const INSPECT_MAX_PACKAGE_BYTES = 8 * 1024 * 1024
/** 每个文本条目最多扫描前 20KB（与安装链路的取样一致）。 */
export const INSPECT_SCAN_SAMPLE_BYTES = 20000
/** 头部摘要长度（安全卡「头部」行）。 */
export const INSPECT_HEADER_CHARS = 120

/** skill 包条目里算「可执行脚本」的扩展名（.json 定义文件不算脚本）。 */
const SCRIPT_EXT = /\.(py|js|mjs|cjs|ts|sh|ps1|cmd|bat)$/i
/** 二进制扩展名（只记体积，不做文本扫描）。 */
const BINARY_EXT = /\.(tgz|tar|gz|zip|7z|rar|png|jpe?g|gif|webp|ico|bmp|pdf|woff2?|ttf|otf|eot|wasm|so|dylib|dll|exe|bin|node|jar|class|db|sqlite|mp3|mp4|wav|ogg)$/i

/** 一段人读文本 → 一行摘要（换行/竖线收敛，供「一行一条」的安全卡用）。 */
export function inspectOneLine(text, max = 0) {
  const s = String(text ?? '').replace(/\s+/g, ' ').replace(/\|/g, '/').trim()
  return max > 0 && s.length > max ? s.slice(0, max - 1) + '…' : s
}

/** 安全卡 → 默认人类可读的紧凑行（一行一条）。 */
export function formatInspectCard(card) {
  const risk = (card.riskFlags || []).length > 0 ? card.riskFlags.join('; ') : '无'
  const ext = card.external
  const extText = ext && (ext.urls.length > 0 || ext.commandExecution || ext.credentialHeaders.length > 0)
    ? [
      ext.urls.length > 0 ? `外链 ${ext.urls.length} 个` : '',
      ext.commandExecution ? '声明命令执行' : '',
      ext.credentialHeaders.length > 0 ? `凭据头/参数 ${ext.credentialHeaders.length} 处` : '',
    ].filter(Boolean).join(' / ')
    : '无'
  const size = card.bytes >= 1024 ? `${(card.bytes / 1024).toFixed(1)} KB` : `${card.bytes} B`
  const lines = [
    `INSPECT ${card.kind}/${card.name} | ${inspectOneLine(card.displayName || card.name, 40)}`,
    `体量: ${card.files} 文件 / 约 ${size}`,
    `可执行脚本: ${card.scriptCount > 0 ? `有(${card.scriptCount} 个)` : '无'}`,
    `风险标记: ${risk}`,
    `外网/命令/凭据: ${extText}`,
    `头部: ${inspectOneLine(card.head, INSPECT_HEADER_CHARS)}`,
  ]
  if (card.note) lines.push(`备注: ${inspectOneLine(card.note, 120)}`)
  return lines
}

/** 官方注册表 / 市场抛错 → 失败语义（NOT_FOUND / NEED_LOGIN / ERROR）。 */
export function inspectError(error) {
  const msg = String(error?.message || error)
  // HTTP 404 单独看上下文：包下载 404 常是「下架/地址失效」，归类 ERROR 更如实；
  // 「官方市场/注册表里根本没有这个条目」才判 NOT_FOUND。
  const notFound = /not found|not in official|no package/i.test(msg) && !/HTTP 404/.test(msg)
  if (notFound) return { code: 'NOT_FOUND', message: msg }
  const needLogin = /401|403|login|unauthor|需要登录|token/i.test(msg)
  if (needLogin) return { code: 'NEED_LOGIN', message: msg }
  return { code: 'ERROR', message: msg }
}

/** 预检（skill zip 条目 / 专家人设）共用的文本扫描汇总。 */
function summarizeEntries(entries) {
  // entries: [{ name, text? , bytes: number }]
  let files = 0
  let totalBytes = 0
  let scriptCount = 0
  const flags = []
  let headEntry = null
  for (const e of entries) {
    files += 1
    totalBytes += e.bytes || 0
    if (SCRIPT_EXT.test(e.name)) scriptCount += 1
    if (typeof e.text === 'string') {
      for (const f of scanFlags(e.name, e.text.slice(0, INSPECT_SCAN_SAMPLE_BYTES))) {
        flags.push(`${e.name}: ${f}`)
      }
      if (headEntry === null && /\.(md|txt)$/i.test(e.name) && e.text.trim() !== '') headEntry = e.text
    }
  }
  return { files, bytes: totalBytes, scriptCount, riskFlags: [...new Set(flags)], head: headEntry ?? '' }
}

/**
 * 预检一位官方专家。
 * @param deps 依赖注入（registry 原始数据获取），测试可注入假 fetcher。
 */
export async function inspectExpert(name, deps = {}) {
  const getRegistry = deps.expertRegistry || (async () => {
    const { registry } = await import('./wb-experts.js')
    return registry()
  })
  let data
  try { data = await getRegistry() } catch (error) { throw Object.assign(new Error(String(error?.message || error)), { inspectFail: true }) }
  const raw = (data.experts ?? []).find(e => (e.agentName || e.id) === name) ?? (data.experts ?? []).find(e => e.id === name)
  if (!raw) throw new Error(`expert not in official registry: ${name}`)
  const base = raw.avatar ? new URL(raw.avatar, 'https://expert.invalid').pathname : ''
  const displayName = pickZh(raw.displayName) || name
  const files = []
  let head = ''
  let avatarBytes = 0
  const regBase = deps.registryBase || 'https://acc-1258344699.cos.accelerate.myqcloud.com/workbuddy/expert-marketplace'
  if (raw.promptFile) {
    const res = await fetch(`${regBase}${raw.promptFile}`)
    if (!res.ok) throw new Error(`persona HTTP ${res.status}`)
    const md = await res.text()
    if (md.length > 256 * 1024) throw new Error('persona too large')
    if (md.includes('\u0000')) throw new Error('persona contains NUL')
    files.push({ name: `agents/${name}.md`, text: md, bytes: Buffer.byteLength(md) })
    head = md
  }
  if (raw.avatar) {
    // 头像只记体积，不记内容（无需也不该把图片字节拉进上下文）
    try {
      const res = await fetch(`${regBase}${raw.avatar}`, { method: 'HEAD' })
      avatarBytes = Number(res.headers.get('content-length') || 0)
    } catch { /* 头像体积拿不到不影响预检结论 */ }
  }
  const sum = summarizeEntries(files)
  if (avatarBytes > 0) sum.files += 1
  sum.bytes += avatarBytes
  return {
    kind: 'expert', name, displayName,
    files: sum.files, bytes: sum.bytes, scriptCount: 0,
    riskFlags: sum.riskFlags,
    external: { urls: [], commandExecution: false, credentialHeaders: [] },
    head: head || `（人设文件 promptFile=${inspectOneLine(raw.promptFile || '', 60)}，avatar=${inspectOneLine(base || raw.avatar || '', 60)}）`,
    note: avatarBytes > 0 ? `头像约 ${(avatarBytes / 1024).toFixed(1)} KB（只记录体积，未拉内容）` : '',
  }
}

/**
 * 预检一个官方技能：skillDetails → download_url → zip 进内存 → unzip → 逐条目扫描。
 */
export async function inspectSkill(name, deps = {}) {
  const getDetails = deps.skillDetailsFor || (async () => {
    const { marketList, skillDetails } = await import('./wb-market.js')
    return { marketList, skillDetails }
  })
  const stateDir = deps.stateDir
  // name → skill_id（与安装链路同一解析顺序）
  const { marketList, skillDetails } = await getDetails()
  const { rows } = await marketList('skill', { page: 1, pageSize: 10, query: name }, stateDir)
  const hit = rows.find(r => r.name === name)
    ?? rows.find(r => (r.display_name_zh || r.display_name_en) === name)
    ?? rows[0]
  if (!hit?.skill_id) throw new Error(`official skill not found: ${name}`)
  const details = await skillDetails([hit.skill_id], stateDir)
  const rec = details.find(x => x.skill_id === hit.skill_id) ?? details[0]
  if (!rec?.download_url) throw new Error('official skill has no package')

  const res = await fetch(rec.download_url)
  if (!res.ok) throw new Error(`skill package HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length > INSPECT_MAX_PACKAGE_BYTES) throw new Error('skill package too large')
  if (!(buf[0] === 0x50 && buf[1] === 0x4b)) throw new Error('skill package is not a zip')

  const entries = unzip(buf).filter(e => !e.name.endsWith('/'))
  const safeName = /^([\w.-]+)\//.exec(entries[0]?.name ?? '')
  const root = safeName ? safeName[1] : name
  if (!/^[\w.-]+$/.test(root)) throw new Error('unsafe package layout')
  const files = entries.map(e => {
    const rel = e.name.startsWith(root + '/') ? e.name.slice(root.length + 1) : e.name
    if (!rel || rel.includes('..')) return null
    if (BINARY_EXT.test(rel) || !isProbablyText(e.data)) return { name: rel, bytes: e.data.length }
    return { name: rel, text: e.data.toString('utf8'), bytes: e.data.length }
  }).filter(Boolean)
  const sum = summarizeEntries(files)
  return {
    kind: 'skill', name, displayName: pickZh(rec.display_name_zh || rec.display_name_en) || root,
    files: sum.files, bytes: sum.bytes, scriptCount: sum.scriptCount,
    riskFlags: sum.riskFlags,
    external: externalOfFiles(files),
    head: sum.head,
    note: `官方 skill_id=${rec.skill_id}，版本 ${rec.version || '未知'}`,
  }
}

/**
 * 预检一个官方连接器：connectorRegistry 该行 → 结构化扫它的 mcp 定义。
 */
export async function inspectConnector(name, deps = {}) {
  const getRows = deps.connectorRows || (async () => {
    const { connectorRegistry } = await import('./wb-market.js')
    return connectorRegistry(deps.stateDir)
  })
  const rows = await getRows()
  const row = rows.find(r => r.name === name)
  if (!row) throw new Error(`connector not in official registry: ${name}`)
  const mcp = row.mcp || null
  const riskFlags = mcp ? scanMcpDefinitionFlags({ mcpServers: { [name]: mcpDefinitionForScan(mcp) } }) : []
  const urls = collectUrls(mcp)
  const commandExecution = Boolean(mcp && (mcp.transport === 'stdio' || mcp.type === 'stdio' || mcp.command !== undefined))
  const credentialHeaders = riskFlags
    .filter(f => /sensitive-header|sensitive-query-param/.test(f))
    .map(f => f.split(': ')[1] ?? f)
  const declaredName = mcp?.ide_server_name || name
  // 目录包随附文件（桌面端公开目录的连接器会带 skills/scripts/token-schema）：
  // 与技能预检**同一套扫描口径**，让审批卡如实显示会装下多少可执行脚本与风险标记。
  let bundle = null
  if (Array.isArray(deps.bundleFiles) && deps.bundleFiles.length > 0) {
    const files = deps.bundleFiles
      .filter(f => f && typeof f.rel === 'string' && f.rel !== 'mcp.json' && !f.rel.includes('..'))
      .map(f => (BINARY_EXT.test(f.rel) || !isProbablyText(f.data) ? { name: f.rel, bytes: f.data.length } : { name: f.rel, text: f.data.toString('utf8'), bytes: f.data.length }))
    const sum = summarizeEntries(files)
    bundle = { files: sum.files, bytes: sum.bytes, scriptCount: sum.scriptCount, riskFlags: sum.riskFlags, external: externalOfFiles(files), head: sum.head }
  }
  const mergedFlags = [...new Set([...riskFlags, ...(bundle?.riskFlags ?? [])])]
  const mergedExternal = {
    urls: [...new Set([...urls, ...(bundle?.external?.urls ?? [])])],
    commandExecution: commandExecution || Boolean(bundle?.external?.commandExecution),
    credentialHeaders: [...new Set([...credentialHeaders, ...(bundle?.external?.credentialHeaders ?? [])])],
  }
  return {
    kind: 'connector', name, displayName: row.displayName || name,
    files: (mcp ? 1 : 0) + (bundle?.files ?? 0),
    bytes: (mcp ? Buffer.byteLength(JSON.stringify(mcp)) : 0) + (bundle?.bytes ?? 0),
    scriptCount: bundle?.scriptCount ?? 0,
    riskFlags: mergedFlags,
    external: mergedExternal,
    head: mcp
      ? `MCP 定义：transport=${mcp.transport || mcp.type || '未知'}，服务名=${declaredName}，鉴权=${row.authType || mcp.auth_mode || '未知'}${mcp.gateway_url ? '，经官方网关中转' : ''}`
      : (bundle?.head
        ? inspectOneLine(bundle.head.replace(/^---[\s\S]*?---/, ''), INSPECT_HEADER_CHARS)
        : `无 mcp.json（${row.authType ? `authType=${row.authType}` : 'CLI/技能型连接器'}）：安装后只登记，不建 MCP 传输。`),
    note: '连接器落地后保持停用：要显式启用才会建立 MCP 传输（可能带凭据）。'
      + (bundle ? ` 随附文件 ${bundle.files} 个（其中可执行脚本 ${bundle.scriptCount} 个），与技能预检同一套扫描口径。` : ''),
  }
}

/** 官方 mcp 定义 → scanMcpDefinitionFlags 认识的服务器形状（url/headers/command 都可能带上 ${REF} 占位）。 */
function mcpDefinitionForScan(mcp) {
  const server = {}
  if (mcp.gateway_url) server.url = mcp.gateway_url
  if (mcp.upstream_url) server.upstream_url = mcp.upstream_url
  if (mcp.sandbox_url) server.sandbox_url = mcp.sandbox_url
  if (mcp.transport || mcp.type) server.transport = mcp.transport || mcp.type
  if (mcp.command !== undefined) server.command = mcp.command
  if (mcp.headers && typeof mcp.headers === 'object') server.headers = mcp.headers
  return server
}

/** 从 mcp 定义里收集所有 http(s) URL（供「外网」列）。 */
function collectUrls(mcp) {
  if (!mcp || typeof mcp !== 'object') return []
  const out = []
  for (const key of ['gateway_url', 'upstream_url', 'sandbox_url']) {
    const v = mcp[key]
    if (typeof v === 'string' && /^https?:\/\//i.test(v)) out.push(v.replace(/^https?:\/\//, '').slice(0, 60))
  }
  return out
}

/** 预检条目集合的「外网/命令/凭据」汇总。 */
function externalOfFiles(files) {
  const urls = new Set()
  let commandExecution = false
  const credentialHeaders = new Set()
  for (const f of files) {
    if (typeof f.text !== 'string') continue
    for (const m of f.text.matchAll(/https?:\/\/[^\s"'`)\]]+/g)) {
      const raw = m[0]
      if (/raw\.githubusercontent\.com|github\.com/.test(raw)) continue
      urls.add(raw.replace(/^https?:\/\//, '').slice(0, 60))
    }
    if (/child_process|subprocess|execSync|spawnSync|spawn\(|exec\(/.test(f.text)) commandExecution = true
    for (const m of f.text.matchAll(/(?:authorization|api[_-]?key|token|secret)\s*[:=]\s*['"][^'"]{4,}/gi)) {
      credentialHeaders.add(inspectOneLine(m[0].replace(/['"]/g, '').slice(0, 60)))
    }
  }
  return { urls: [...urls].slice(0, 8), commandExecution, credentialHeaders: [...credentialHeaders].slice(0, 8) }
}

/** 启发式：像文本（UTF-8 可解码、无大量控制字符）才算文本；否则按二进制只记体积。 */
function isProbablyText(buf) {
  const sample = buf.slice(0, 4096)
  let suspicious = 0
  for (const b of sample) {
    if (b === 0) return false
    if (b < 9 || (b > 13 && b < 32)) suspicious += 1
  }
  return suspicious / Math.max(1, sample.length) < 0.1
}

/** WorkBuddy 官方字段的 zh/en 双语壳 → 中文优先。 */
function pickZh(v) {
  if (v == null) return ''
  if (typeof v === 'string') {
    try { const p = JSON.parse(v); return p.zh ?? p.en ?? v } catch { return v }
  }
  return v.zh ?? v.en ?? ''
}
