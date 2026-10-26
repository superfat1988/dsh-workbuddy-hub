// 接入测试（只读）：桌面端 WorkBuddy 自带的公开静态市场能否被本插件直接吃下。
//
// 数据源（全部从 WorkBuddy 桌面端 app.asar / marketplace-meta 元数据中提取，匿名可取）：
//   · 连接器目录 + 图标 + mcp.json/skills  https://static.workbuddy.cn/connectors-config-v2/connectors-config.zip
//   · 连接器插件包（marketplace.json + plugin.json + skills）
//                                          https://static.workbuddy.cn/connector-agent-plugins/connector-plugins.zip
//   · 专家中心清单                          https://acc-1258344699.cos.accelerate.myqcloud.com/workbuddy/expert-marketplace/expert_center.json
//
// 本脚本只下载、解析、映射、打印结论；不写入插件 storeRoot，不改任何路由。
//
//   node scripts/probe-desktop-catalog.mjs [--cache <dir>] [--handshake N] [--json <file>]
import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { unzip } from '../wb-unzip.js'

const CONFIG_ZIP = 'https://static.workbuddy.cn/connectors-config-v2/connectors-config.zip'
const PLUGIN_ZIP = 'https://static.workbuddy.cn/connector-agent-plugins/connector-plugins.zip'
const EXPERT_CENTER = 'https://acc-1258344699.cos.accelerate.myqcloud.com/workbuddy/expert-marketplace/expert_center.json'
const ICON_BASE = 'https://static.workbuddy.cn/connectors-config-v2/icons'

const argv = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = argv.indexOf(name)
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback
}
const CACHE = flag('--cache', join(tmpdir(), 'wb-desktop-probe'))
const HANDSHAKE = Number(flag('--handshake', '4')) || 0
const JSON_OUT = flag('--json', join(CACHE, 'report.json'))
mkdirSync(CACHE, { recursive: true })

const log = (...a) => console.log(...a)
const sha256 = buf => createHash('sha256').update(buf).digest('hex')
const pct = (n, d) => `${n}/${d} (${d ? Math.round((n / d) * 100) : 0}%)`

async function fetchMeta(url) {
  const head = await fetch(url, { method: 'HEAD', redirect: 'follow' })
  if (!head.ok) throw new Error(`HEAD ${url} → HTTP ${head.status}`)
  return {
    url,
    status: head.status,
    etag: (head.headers.get('etag') || '').replace(/"/g, ''),
    lastModified: head.headers.get('last-modified') || '',
    contentLength: Number(head.headers.get('content-length') || 0),
    contentType: head.headers.get('content-type') || '',
  }
}

async function download(url, file) {
  if (existsSync(file)) {
    const buf = readFileSync(file)
    return { buf, cached: true }
  }
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) throw new Error(`GET ${url} → HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  writeFileSync(file, buf)
  return { buf, cached: false }
}

// ---- 目录记录 → 插件 connector 行（形状对齐 wb-market.js connectorRegistry）----
function mapRow(record, iconIndex) {
  const name = record.id || record.source || record.name
  const icon = iconIndex.get(name) || iconIndex.get(record.source) || ''
  return {
    kind: 'connector',
    name,
    displayName: record.name || name,
    description: record.description_zh || record.description || record.description_en || '',
    icon,
    authType: record.auth_mode || '',
    mcp: null, // 由 mcp.json 解析后回填
    isConnected: false,
    official: false,
    source: 'desktop-static',
    provenance: { nameZh: record.name, nameEn: record.name_en, type: record.type, visibleIn: record.visible_in || [] },
  }
}

// ---- mcp.json → 插件 transport 口径 ----
function mapMcp(json) {
  const servers = json?.mcpServers && typeof json.mcpServers === 'object' ? json.mcpServers : {}
  const picked = Object.keys(servers)[0]
  if (!picked) return { ok: false, reason: 'no mcpServers entry' }
  const server = servers[picked] || {}
  const declared = String(server.type || server.transport || '').toLowerCase()
  const placeholders = [...new Set([...JSON.stringify(server.headers ?? {}).matchAll(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g)].map(m => m[1]))]
  let transport = 'streamable-http'
  if (server.command) transport = 'stdio'
  else if (declared === 'sse') transport = 'sse'
  else if (declared === 'streamable-http' || declared === 'streamablehttp' || server.url) transport = 'streamable-http'
  else transport = declared || 'unknown'
  return {
    ok: true, serverName: picked, transport, declared,
    url: server.url || '', command: server.command || '',
    args: server.args || [], env: server.env ? Object.keys(server.env) : [],
    placeholders, hasHeaders: Boolean(server.headers),
    supported: transport === 'streamable-http',
  }
}

async function main() {
  const out = { at: new Date().toISOString(), cache: CACHE }

  log('=== 1. 源可达性与身份 ===')
  const metas = {}
  for (const [key, url] of [['config', CONFIG_ZIP], ['plugins', PLUGIN_ZIP], ['experts', EXPERT_CENTER]]) {
    const meta = await fetchMeta(url)
    metas[key] = meta
    log(`  ${key.padEnd(8)} HTTP ${meta.status}  ${(meta.contentLength / 1048576).toFixed(2)} MB  etag=${meta.etag || '-'}  lm=${meta.lastModified}`)
  }
  out.sources = metas

  log('\n=== 2. 下载 + 校验（连接器目录包）===')
  const { buf: cfgBuf, cached: cfgCached } = await download(CONFIG_ZIP, join(CACHE, 'connectors-config.zip'))
  const cfgHash = sha256(cfgBuf)
  log(`  bytes=${cfgBuf.length}  sha256=${cfgHash.slice(0, 16)}…  ${cfgCached ? '(本地缓存)' : '(新下载)'}`)

  const cfgFiles = unzip(cfgBuf)
  const byName = new Map(cfgFiles.map(f => [f.name, f]))
  const catalogFile = byName.get('.codebuddy-connector/connectors.json')
  if (!catalogFile) throw new Error('包内缺少 .codebuddy-connector/connectors.json')
  const catalog = JSON.parse(catalogFile.data.toString('utf8'))
  const records = catalog.connectors ?? []
  log(`  zip 条目=${cfgFiles.length}  目录记录=${records.length}  (catalog=${catalog.name} owner=${catalog.owner || '-'})`)
  out.configZip = { sha256: cfgHash, entries: cfgFiles.length, records: records.length, etag: metas.config.etag }

  // 图标索引：icons/<id>.(png|svg|jpg|webp)
  const iconIndex = new Map()
  for (const f of cfgFiles) {
    const m = /^icons\/(.+)\.(png|svg|jpg|jpeg|webp)$/i.exec(f.name)
    if (m && !iconIndex.has(m[1])) iconIndex.set(m[1], `${ICON_BASE}/${m[1]}.${m[2]}`)
  }

  log('\n=== 3. 目录 → 插件行映射 ===')
  const rows = records.map(r => mapRow(r, iconIndex))
  const missingIcon = rows.filter(r => !r.icon)
  log(`  行数=${rows.length}  有中文描述=${rows.filter(r => r.description).length}  有图标=${rows.length - missingIcon.length}`)
  if (missingIcon.length) log(`  缺图标(${missingIcon.length}): ${missingIcon.slice(0, 8).map(r => r.name).join(', ')}${missingIcon.length > 8 ? ' …' : ''}`)
  log(`  authType 分布: ${dist(rows.map(r => r.authType || '(none)'))}`)
  log(`  示例行: ${JSON.stringify(rows[0])}`)

  // mcp.json / cli.json 覆盖
  const dirs = new Set()
  for (const f of cfgFiles) {
    const m = /^connectors\/([^/]+)\//.exec(f.name)
    if (m) dirs.add(m[1])
  }
  const mcpFiles = [...byName.keys()].filter(n => /^connectors\/[^/]+\/mcp\.json$/.test(n))
  const cliFiles = [...byName.keys()].filter(n => /^connectors\/[^/]+\/cli\.json$/.test(n))
  const skillFiles = [...byName.keys()].filter(n => /^connectors\/[^/]+\/skills\/.+SKILL\.md$/.test(n))
  const tokenSchemas = [...byName.keys()].filter(n => /^connectors\/[^/]+\/token-schema\.json$/.test(n))
  log(`\n  连接器目录=${dirs.size}  mcp.json=${mcpFiles.length}  cli.json=${cliFiles.length}  SKILL.md=${skillFiles.length}  token-schema=${tokenSchemas.length}`)

  const mcpMapped = []
  const unsupported = []
  const broken = []
  for (const record of records) {
    const name = record.id || record.source || record.name
    const file = byName.get(`connectors/${name}/mcp.json`)
    if (!file) continue
    let parsed = null
    try { parsed = JSON.parse(file.data.toString('utf8')) } catch (e) { broken.push(`${name}: ${e.message}`); continue }
    const mapped = mapMcp(parsed)
    if (!mapped.ok) { broken.push(`${name}: ${mapped.reason}`); continue }
    const row = rows.find(r => r.name === name)
    if (row) row.mcp = mapped
    mcpMapped.push({ name, displayName: record.name || name, ...mapped })
    if (!mapped.supported) unsupported.push(`${name} [${mapped.transport}${mapped.command ? ':' + mapped.command : ''}]`)
  }
  log(`  mcp.json 解析成功=${mcpMapped.length}  解析失败=${broken.length}${broken.length ? ': ' + broken.slice(0, 5).join('; ') : ''}`)
  log(`  transport 分布: ${dist(mcpMapped.map(m => m.transport))}`)
  log(`  非 streamable-http（按插件 v1 策略需 fail-closed）=${unsupported.length}`)
  for (const u of unsupported.slice(0, 12)) log(`    - ${u}`)
  const withPlaceholders = mcpMapped.filter(m => m.placeholders.length)
  log(`  含 \${VAR} 头占位符=${withPlaceholders.length}  变量: ${dist(withPlaceholders.flatMap(m => m.placeholders))}`)
  const withHeaders = mcpMapped.filter(m => m.hasHeaders)
  log(`  带 headers=${withHeaders.length}  无 headers（可直接匿名试调）=${mcpMapped.length - withHeaders.length}`)

  // 与官方注册表合并后的规模
  log('\n=== 4. 与现有官方注册表合并 ===')
  let officialRows = []
  try {
    const { connectorRegistry } = await import('../wb-market.js')
    const state = process.env.WB_STATE || join(process.env.HOME || '', 'workbuddyskills/.meta/state')
    officialRows = await connectorRegistry(state)
    log(`  官方 registry2c 行数=${officialRows.length}`)
  } catch (e) {
    log(`  官方注册表读取失败（不影响本测试）: ${String(e?.message || e).slice(0, 120)}`)
  }
  const officialNames = new Set(officialRows.map(r => r.name))
  const desktopNames = new Set(rows.map(r => r.name))
  const overlap = [...desktopNames].filter(n => officialNames.has(n))
  log(`  桌面静态=${desktopNames.size}  官方=${officialNames.size}  交集=${overlap.length}  合并后=${new Set([...desktopNames, ...officialNames]).size}`)
  out.merge = { desktop: desktopNames.size, official: officialNames.size, overlap, union: new Set([...desktopNames, ...officialNames]).size }
  out.mcp = { parsed: mcpMapped.length, transport: dist(mcpMapped.map(m => m.transport)), unsupported }
  out.rows = rows.length

  log('\n=== 5. 专家中心清单 ===')
  const { buf: expBuf } = await download(EXPERT_CENTER, join(CACHE, 'expert_center.json'))
  const exp = JSON.parse(expBuf.toString('utf8'))
  log(`  专家=${exp.experts?.length ?? 0}  分类=${exp.categories?.length ?? 0}  updated=${exp.lastUpdated}  license=${exp.author?.license || '-'}`)
  out.experts = { count: exp.experts?.length ?? 0, categories: exp.categories?.length ?? 0, lastUpdated: exp.lastUpdated }

  // 插件现有的工具枚举口径：POST tools/list，headers 里 ${VAR} → WorkBuddy bearer
  const probeTools = async (url, headers) => {
    const started = Date.now()
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', ...headers },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} }),
        signal: AbortSignal.timeout(20000),
      })
      const text = await res.text()
      let payload = null
      try { payload = JSON.parse(text) } catch {
        const line = text.split('\n').filter(l => l.startsWith('data:')).pop()
        if (line) { try { payload = JSON.parse(line.slice(5).trim()) } catch { payload = null } }
      }
      const tools = payload?.result?.tools ?? []
      return { http: res.status, tools: tools.length, names: tools.slice(0, 5).map(t => t.name), ms: Date.now() - started, error: payload?.error?.message || '' }
    } catch (e) {
      return { http: 0, tools: 0, names: [], ms: Date.now() - started, error: String(e?.message || e).slice(0, 140) }
    }
  }

  const authModeOf = new Map(records.map(r => [r.id || r.source, r.auth_mode || '']))

  log('\n=== 6. 真实 MCP 握手 A：匿名（无 headers 的 streamable-http）===')
  const anon = mcpMapped
    .filter(m => m.supported && !m.hasHeaders && m.url.startsWith('https://'))
    .slice(0, HANDSHAKE)
  const handshakes = []
  for (const c of anon) {
    const result = await probeTools(c.url)
    handshakes.push({ group: 'anonymous', name: c.name, url: c.url, ...result })
    log(`  ${c.name.padEnd(24)} HTTP ${result.http}  tools=${result.tools}  ${result.ms}ms  ${result.error || result.names.join(',')}`)
  }

  log('\n=== 6b. 真实 MCP 握手 B：server-side（插件既有的 WorkBuddy bearer 透传）===')
  let bearerToken = ''
  try {
    const { bearer } = await import('../wb-market.js')
    bearerToken = await bearer(process.env.WB_STATE || join(process.env.HOME || '', 'workbuddyskills/.meta/state'))
  } catch (e) {
    log(`  取 WorkBuddy bearer 失败: ${String(e?.message || e).slice(0, 120)}（跳过本组）`)
  }
  const serverSide = mcpMapped
    .filter(m => m.supported && !m.hasHeaders && m.url.startsWith('https://') && authModeOf.get(m.name) === 'server-side')
    .slice(0, HANDSHAKE)
  for (const c of serverSide) {
    const withToken = bearerToken ? await probeTools(c.url, { authorization: `Bearer ${bearerToken}` }) : { http: 0, tools: 0, names: [], ms: 0, error: 'no bearer' }
    const bare = await probeTools(c.url)
    handshakes.push({ group: 'server-side', name: c.name, url: c.url, withBearer: { http: withToken.http, tools: withToken.tools }, withoutBearer: { http: bare.http, tools: bare.tools } })
    log(`  ${c.name.padEnd(24)} 带 bearer: HTTP ${withToken.http} tools=${withToken.tools}  |  不带: HTTP ${bare.http} tools=${bare.tools}  ${withToken.error || withToken.names.join(',')}`)
  }
  out.handshakes = handshakes

  writeFileSync(JSON_OUT, JSON.stringify(out, null, 2))
  log(`\n报告写入 ${JSON_OUT}`)
}

function dist(values) {
  const m = {}
  for (const v of values) m[v] = (m[v] || 0) + 1
  return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}×${v}`).join('  ')
}

main().catch(error => {
  console.error('探测失败:', error)
  process.exit(1)
})
