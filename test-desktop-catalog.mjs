// 桌面端静态目录接入层单测（**全离线**：合成一个最小 bundle zip，不碰网络）。
//
// 覆盖：
//   1. 网关地址推导规则（含「带 ${VAR} 的 query 不外推」）
//   2. 传输类型判别（streamable-http / sse 可用；stdio、未知一律 fail-closed）
//   3. 占位符扫描口径（url / headers / env 全扫 —— 与 mcp-manager.credentialRefsIn 同）
//   4. 端点决策：用户凭据型 → 直连上游；其余 → 网关 + WorkBuddy bearer
//   5. 落盘 mcp.json：凭据只以 `${VAR}` 引用，绝不落明文；stdio/cli 不产可挂载定义
//   6. parseCatalogZip 端到端（中文名/图标/skills/token-schema/版本）
//   7. mergeConnectorRows：官方优先、同名不重复、关键词过滤与空关键词不回退
//   8. 与 index.js 的凭据引用字面量一致性（两处必须同一个 ref 名）
import assert from 'node:assert/strict'
import { deflateRawSync } from 'node:zlib'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import {
  gatewayUrlFor, upstreamPathOf, classifyServer, placeholdersIn, endpointFor,
  buildDesktopMcpJson, parseCatalogZip, mergeConnectorRows, desktopRow, desktopProvenance,
  desktopPaths, WB_TOKEN_REF, DESKTOP_CATALOG_URL, DESKTOP_GATEWAY_BASE, probeEndpoint,
} from './wb-desktop.js'

const here = dirname(fileURLToPath(import.meta.url))
let passed = 0
const ok = (label, fn) => { fn(); passed++; console.log(`  ok  ${label}`) }
const okAsync = async (label, fn) => { await fn(); passed++; console.log(`  ok  ${label}`) }

/* ---- 最小 zip 构造器（store 模式，仅测试用） ------------------------------ */
function makeZip(entries) {
  const chunks = []
  const central = []
  let offset = 0
  for (const [name, content] of entries) {
    const data = Buffer.isBuffer(content) ? content : Buffer.from(String(content), 'utf8')
    const nameBuf = Buffer.from(name, 'utf8')
    const crc = crc32(data)
    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034b50, 0)
    local.writeUInt16LE(20, 4)
    local.writeUInt16LE(0, 6)
    local.writeUInt16LE(0, 8)          // store
    local.writeUInt32LE(0, 10)         // time/date
    local.writeUInt32LE(crc, 14)
    local.writeUInt32LE(data.length, 18)
    local.writeUInt32LE(data.length, 22)
    local.writeUInt16LE(nameBuf.length, 26)
    local.writeUInt16LE(0, 28)
    chunks.push(local, nameBuf, data)
    central.push({ name: nameBuf, crc, size: data.length, offset })
    offset += local.length + nameBuf.length + data.length
  }
  const centralChunks = []
  let centralSize = 0
  for (const entry of central) {
    const head = Buffer.alloc(46)
    head.writeUInt32LE(0x02014b50, 0)
    head.writeUInt16LE(20, 4)
    head.writeUInt16LE(20, 6)
    head.writeUInt16LE(0, 8)
    head.writeUInt16LE(0, 10)
    head.writeUInt32LE(0, 12)
    head.writeUInt32LE(entry.crc, 16)
    head.writeUInt32LE(entry.size, 20)
    head.writeUInt32LE(entry.size, 24)
    head.writeUInt16LE(entry.name.length, 28)
    head.writeUInt16LE(0, 30)
    head.writeUInt16LE(0, 32)
    head.writeUInt16LE(0, 34)
    head.writeUInt16LE(0, 36)
    head.writeUInt32LE(0, 38)
    head.writeUInt32LE(entry.offset, 42)
    centralChunks.push(head, entry.name)
    centralSize += head.length + entry.name.length
  }
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(central.length, 8)
  end.writeUInt16LE(central.length, 10)
  end.writeUInt32LE(centralSize, 12)
  end.writeUInt32LE(offset, 16)
  return Buffer.concat([...chunks, ...centralChunks, end])
}

// 与 zlib 无关的 CRC32（zip 头要求）
const CRC_TABLE = (() => {
  const table = new Int32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[i] = c
  }
  return table
})()
function crc32(buf) {
  let c = -1
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}

/* ---- 合成 bundle --------------------------------------------------------- */
const catalog = {
  name: 'codebuddy-connectors-official',
  owner: { name: 'workbuddy' },
  auth_injection_rules: [{ id: 'demo-rule' }],
  connectors: [
    {
      id: 'demo-gateway', name: '演示网关连接器', name_en: 'Demo Gateway',
      description_zh: '走网关的演示连接器', description_en: 'gateway demo',
      auth_mode: 'server-side', type: 'mcp', visible_in: ['internal', 'iOA'],
      examples_zh: ['示例问题一'], source: 'demo-gateway',
    },
    {
      id: 'demo-token', name: '演示凭据连接器', name_en: 'Demo Token',
      description_zh: '需要用户自备 token 的连接器', description_en: 'token demo',
      auth_mode: 'token', type: 'mcp', visible_in: [],
      examples_zh: ['示例问题二'], source: 'demo-token',
    },
    {
      id: 'demo-stdio', name: '演示 stdio 连接器', description_zh: 'stdio 必须 fail-closed',
      auth_mode: 'token', type: 'mcp', visible_in: [], source: 'demo-stdio',
    },
    {
      id: 'demo-cli', name: '演示 CLI 连接器', description_zh: 'cli 必须 fail-closed',
      auth_mode: '', type: 'cli', visible_in: [], source: 'demo-cli',
    },
  ],
}
const bundle = makeZip([
  ['.codebuddy-connector/connectors.json', JSON.stringify(catalog)],
  ['connectors/demo-gateway/mcp.json', JSON.stringify({ mcpServers: { 'demo-gateway': { url: 'https://gateway.example.com/v1/mcp', type: 'streamableHttp', timeout: 30000 } } })],
  ['connectors/demo-gateway/skills/demo-gateway/SKILL.md', '# demo gateway skill'],
  ['connectors/demo-token/mcp.json', JSON.stringify({ mcpServers: { 'demo-token': { url: 'https://api.example.com/mcp/?token=${DEMO_TOKEN}', type: 'streamable-http', headers: { 'X-Api-Key': '${DEMO_KEY}' } } } })],
  ['connectors/demo-token/token-schema.json', JSON.stringify({ fields: [{ key: 'DEMO_KEY', label: '演示 Key', required: true }] })],
  ['connectors/demo-stdio/mcp.json', JSON.stringify({ mcpServers: { 'demo-stdio': { command: 'npx', args: ['-y', 'demo-mcp'] } } })],
  ['connectors/demo-cli/cli.json', JSON.stringify({ runtime: { type: 'node' }, init: { linux: 'npm install -g demo-cli' } })],
  ['icons/demo-gateway.png', Buffer.from([0x89, 0x50, 0x4e, 0x47])],
])

console.log('wb-desktop.js 单测')

ok('网关地址推导 = 基址 + 连接器名 + 上游 path', () => {
  assert.equal(gatewayUrlFor('tdx', 'https://txmcp.tdx.com.cn:3001/txmcp'), `${DESKTOP_GATEWAY_BASE}/tdx/txmcp`)
  assert.equal(gatewayUrlFor('x', 'https://a.example.com/v1/mcp?a=1'), `${DESKTOP_GATEWAY_BASE}/x/v1/mcp?a=1`)
})
ok('带 ${VAR} 的 query 不外推进网关地址（凭据不进 URL 记录）', () => {
  assert.equal(gatewayUrlFor('y', 'https://a.example.com/mcp?token=${SECRET}'), `${DESKTOP_GATEWAY_BASE}/y/mcp`)
})
ok('非 https / 非法名 / 空 path → 不推导', () => {
  assert.equal(gatewayUrlFor('z', 'http://a.example.com/mcp'), '')
  assert.equal(gatewayUrlFor('bad name', 'https://a.example.com/mcp'), '')
  assert.equal(gatewayUrlFor('z', 'https://a.example.com'), '')
  assert.equal(upstreamPathOf('https://a.example.com/mcp?x=1'), '/mcp?x=1')
  assert.equal(upstreamPathOf('nonsense'), '')
})
ok('传输判别：http/sse 可用，stdio 与未知 fail-closed', () => {
  assert.deepEqual(classifyServer({ url: 'https://a/mcp' }).supported, true)
  assert.equal(classifyServer({ url: 'https://a/mcp', type: 'sse' }).transport, 'sse')
  assert.equal(classifyServer({ url: 'https://a/mcp', type: 'streamableHttp' }).transport, 'streamable-http')
  assert.equal(classifyServer({ command: 'npx' }).supported, false)
  assert.equal(classifyServer({ url: 'https://a/mcp', type: 'weird' }).transport, 'streamable-http', '有 url 时按 http 处理')
  assert.equal(classifyServer({}).supported, false)
})
ok('占位符扫描覆盖 url / headers / env', () => {
  const refs = placeholdersIn({ url: 'https://a/mcp?token=${A}', headers: { Authorization: 'Bearer ${B}' }, env: { K: '${C}' } })
  assert.deepEqual(refs.sort(), ['A', 'B', 'C'])
})

const parsed = parseCatalogZip(bundle, { pluginsMarketplace: { plugins: [{ name: 'demo-gateway', version: '1.2.3' }] } })
ok('parseCatalogZip：4 条记录、中文名/描述/示例/图标', () => {
  assert.equal(parsed.connectors.length, 4)
  const gw = parsed.connectors.find(c => c.name === 'demo-gateway')
  assert.equal(gw.displayName, '演示网关连接器')
  assert.equal(gw.description, '走网关的演示连接器')
  assert.deepEqual(gw.examples, ['示例问题一'])
  // 图标只在包内：记录里是 iconFile（包内路径），行映射时才变成插件自己的 /icon 路由。
  // 曾经编造过 https://static.workbuddy.cn/connectors-config-v2/icons/… —— 实测 404。
  assert.equal(gw.iconFile, 'icons/demo-gateway.png')
  assert.equal(gw.icon, '')
  assert.match(desktopRow(gw).icon, /\/workbuddy-hub\/icon\?kind=connector&source=desktop&name=demo-gateway$/)
  assert.equal(gw.version, '1.2.3')
  assert.equal(gw.gatewayUrl, `${DESKTOP_GATEWAY_BASE}/demo-gateway/v1/mcp`)
})
ok('parseCatalogZip：skills / token-schema / stdio / cli 判定', () => {
  const gw = parsed.connectors.find(c => c.name === 'demo-gateway')
  assert.deepEqual(gw.skills, ['demo-gateway'])
  assert.equal(gw.supported, true)
  const tk = parsed.connectors.find(c => c.name === 'demo-token')
  assert.deepEqual(tk.placeholders.sort(), ['DEMO_KEY', 'DEMO_TOKEN'])
  assert.deepEqual(tk.tokenFields, [{ key: 'DEMO_KEY', label: '演示 Key', required: true }])
  const sd = parsed.connectors.find(c => c.name === 'demo-stdio')
  assert.equal(sd.supported, false)
  assert.match(sd.unsupportedReason, /stdio/)
  const cli = parsed.connectors.find(c => c.name === 'demo-cli')
  assert.equal(cli.supported, false)
  assert.match(cli.unsupportedReason, /CLI/)
})
ok('端点决策：用户凭据型 → 直连上游；其余 → 网关 bearer', () => {
  const tk = parsed.connectors.find(c => c.name === 'demo-token')
  const tkEnd = endpointFor(tk)
  assert.equal(tkEnd.mode, 'direct')
  assert.equal(tkEnd.url, 'https://api.example.com/mcp/?token=${DEMO_TOKEN}')
  assert.deepEqual(tkEnd.credentialRefs.sort(), ['DEMO_KEY', 'DEMO_TOKEN'])
  const gwEnd = endpointFor(parsed.connectors.find(c => c.name === 'demo-gateway'))
  assert.equal(gwEnd.mode, 'gateway')
  assert.deepEqual(gwEnd.credentialRefs, [WB_TOKEN_REF])
})
ok('落盘 mcp.json：凭据只以 ${VAR} 引用，网关型带 bearer 头、直连型不带', () => {
  const gwMcp = buildDesktopMcpJson(parsed.connectors.find(c => c.name === 'demo-gateway'))
  const gwServer = Object.values(gwMcp.mcpServers)[0]
  assert.equal(gwServer.url, `${DESKTOP_GATEWAY_BASE}/demo-gateway/v1/mcp`)
  assert.equal(gwServer.headers.Authorization, `Bearer \${${WB_TOKEN_REF}}`)
  assert.equal(gwServer.transport, 'streamable-http')

  const tkMcp = buildDesktopMcpJson(parsed.connectors.find(c => c.name === 'demo-token'))
  const tkServer = Object.values(tkMcp.mcpServers)[0]
  assert.equal(tkServer.headers['X-Api-Key'], '${DEMO_KEY}')
  assert.equal(tkServer.headers.Authorization, undefined, '直连型不注入 WorkBuddy bearer')
  assert.ok(!JSON.stringify(tkMcp).includes('eyJ'), '不落任何明文令牌')
})
ok('行映射与溯源：source=desktop、official=false、带端点/凭据信息', () => {
  const row = desktopRow(parsed.connectors.find(c => c.name === 'demo-gateway'))
  assert.equal(row.source, 'desktop')
  assert.equal(row.official, false)
  assert.equal(row.desktop.endpoint, 'gateway')
  assert.equal(row.kind, 'connector')
  const index = { catalogEtag: 'e1', catalogSha256: 's1', fetchedAtIso: 'now' }
  const prov = desktopProvenance(index, parsed.connectors.find(c => c.name === 'demo-gateway'))
  assert.equal(prov.source, 'desktop')
  assert.equal(prov.bundle.sha256, 's1')
  assert.equal(prov.endpoint, 'gateway')
})
ok('mergeConnectorRows：官方优先、两级去重、关键词过滤', () => {
  const official = [
    { name: 'demo-gateway', displayName: '官方版网关连接器', description: 'official', authType: 'mcp_oauth' },
    { name: 'official-only', displayName: '只有官方有', description: '', authType: '' },
  ]
  const desk = parsed.connectors.map(c => desktopRow(c))
  const all = mergeConnectorRows(official, desk, '')
  assert.equal(all.rows.length, 5, '4 条桌面 + 1 条官方独有（gateway 同名被去重）')
  assert.deepEqual({ official: all.official, desktop: all.desktop, dup: all.desktopDuplicates }, { official: 2, desktop: 3, dup: 1 })
  assert.equal(all.rows[0].source, 'official')
  assert.equal(all.rows.find(r => r.name === 'demo-gateway').displayName, '官方版网关连接器')
  const hit = mergeConnectorRows(official, desk, '凭据')
  assert.deepEqual(hit.rows.map(r => r.name), ['demo-token'])
  assert.deepEqual(mergeConnectorRows(official, desk, 'zzz不存在zzz').rows.map(r => r.name), [])
})
ok('mergeConnectorRows：官方与桌面 id 不同但同一连接器时，按「展示名+描述」去重（生产 GUI 实测的腾讯文档重复）', () => {
  const official = [{
    name: 'tdocs-app', displayName: '腾讯文档', description: '创建、编辑和协作腾讯文档。用自然语言管理在线表格、文档和幻灯片。', authType: 'mcp_oauth',
  }]
  const desk = [
    desktopRow({ name: 'tencent-docs', displayName: '腾讯文档', description: '创建、编辑和协作腾讯文档。用自然语言管理在线表格、文档和幻灯片。', transport: 'streamable-http', supported: true, upstreamUrl: 'https://x.example.com/mcp', gatewayUrl: 'https://copilot.tencent.com/console/agent-gateway/tencent-docs/mcp', placeholders: [], skills: [], tokenFields: [], icon: '', version: '' }),
    desktopRow({ name: 'tencent-docx', displayName: '腾讯文档插件版', description: '另一个连接器，名字不同不该被隐藏', transport: 'streamable-http', supported: true, upstreamUrl: 'https://y.example.com/mcp', gatewayUrl: '', placeholders: [], skills: [], tokenFields: [], icon: '', version: '' }),
  ]
  const merged = mergeConnectorRows(official, desk, '')
  assert.equal(merged.rows.length, 2, '同名的桌面条目被隐藏，官方保留')
  assert.equal(merged.desktopDuplicates, 1)
  assert.equal(merged.rows[0].source, 'official')
  assert.deepEqual(merged.rows.map(r => r.name), ['tdocs-app', 'tencent-docx'])
})
await okAsync('端点探测必须做真实握手：宽松端点「未初始化也回 tools/list」不得被判可用', async () => {
  const record = parsed.connectors.find(c => c.name === 'demo-gateway')
  // ① 宽松端点：tools/list 回 200+12 个工具，但 initialize 回 401（生产实测 qq-mail 的行为）
  const lenient = async (url, init = {}) => {
    const body = JSON.parse(init.body || '{}')
    if (body.method === 'initialize') {
      return { status: 401, headers: { get: () => '' }, text: async () => JSON.stringify({ jsonrpc: '2.0', id: 1, error: { code: 40101, message: 'Bearer token is missing' } }) }
    }
    return { status: 200, headers: { get: () => '' }, text: async () => JSON.stringify({ jsonrpc: '2.0', id: 2, result: { tools: Array.from({ length: 12 }, (_, i) => ({ name: `t${i}` })) } }) }
  }
  const bad = await probeEndpoint(record, { fetchImpl: lenient })
  assert.equal(bad.ok, false, '未通过 initialize 的端点不能算可用')
  assert.equal(bad.http, 401)
  assert.equal(bad.code, 40101)
  assert.match(bad.error, /Bearer token is missing/)

  // ② 完整握手（initialize 200 → initialized → tools/list 200）：可用，并记录工具数
  const good = async (url, init = {}) => {
    const body = JSON.parse(init.body || '{}')
    if (body.method === 'initialize') {
      return { status: 200, headers: { get: k => (String(k).toLowerCase() === 'mcp-session-id' ? 'sess-1' : '') }, text: async () => JSON.stringify({ jsonrpc: '2.0', id: 1, result: { protocolVersion: '2025-06-18' } }) }
    }
    if (body.method === 'notifications/initialized') return { status: 202, headers: { get: () => '' }, text: async () => '' }
    return { status: 200, headers: { get: () => '' }, text: async () => JSON.stringify({ jsonrpc: '2.0', id: 2, result: { tools: [{ name: 'a' }, { name: 'b' }] } }) }
  }
  const pass = await probeEndpoint(record, { fetchImpl: good })
  assert.equal(pass.ok, true)
  assert.equal(pass.tools, 2)
  assert.equal(pass.mode, 'gateway')

  // ③ SSE 形态（data: 行）也要能解析
  const sse = async (url, init = {}) => {
    const body = JSON.parse(init.body || '{}')
    if (body.method === 'initialize') return { status: 200, headers: { get: () => '' }, text: async () => 'event: message\ndata: {"jsonrpc":"2.0","id":1,"result":{"protocolVersion":"2025-06-18"}}\n\n' }
    if (body.method === 'notifications/initialized') return { status: 202, headers: { get: () => '' }, text: async () => '' }
    return { status: 200, headers: { get: () => '' }, text: async () => 'event: message\ndata: {"jsonrpc":"2.0","id":2,"result":{"tools":[{"name":"x"}]}}\n\n' }
  }
  const viaSse = await probeEndpoint(record, { fetchImpl: sse })
  assert.equal(viaSse.ok, true)
  assert.equal(viaSse.tools, 1)
})
ok('凭据引用名与 index.js 的字面量一致（两处必须是同一个 ref）', () => {
  const src = readFileSync(join(here, 'index.js'), 'utf8')
  const m = /const WB_TOKEN_REF = '([^']+)'/.exec(src)
  assert.ok(m, 'index.js 里应能找到 WB_TOKEN_REF 定义')
  assert.equal(m[1], WB_TOKEN_REF)
  assert.equal(WB_TOKEN_REF, 'WORKBUDDY_TOKEN')
})
ok('desktopPaths：缓存包与索引都落在 <root>/.meta/desktop', () => {
  const paths = desktopPaths('/tmp/root')
  assert.equal(paths.catalogZip, '/tmp/root/.meta/desktop/connectors-config.zip')
  assert.equal(paths.index, '/tmp/root/.meta/desktop/index.json')
})
ok('源常量是桌面端自带的公开 CDN（不是私有接口）', () => {
  assert.equal(DESKTOP_CATALOG_URL, 'https://static.workbuddy.cn/connectors-config-v2/connectors-config.zip')
})

console.log(`\nALL DESKTOP-CATALOG TESTS PASSED (${passed})`)
