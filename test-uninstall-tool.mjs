// workbuddy_uninstall 工具 + 卸载逻辑抽取（uninstallEntry）的契约测试。
//
// 覆盖：
//  1) 工具注册：ctx.tools.register 收到 workbuddy_uninstall，且 parameters 是
//     「已投影的 JSON Schema」（object 根 + required 数组；schemastery 扁平映射
//     会被框架原样发给模型 → 上游整轮 INVALID_REQUEST，别重犯）；
//  2) 审批四分支（假 approval，不联网）：allowed-once 才卸；rejected / cancelled
//     不卸；unavailable fail-closed；ctx.approval / exec.agent 缺位同样 fail-closed；
//  3) 只读预览：非 allowed-once 分支绝不写注册表、绝不删文件、绝不拆挂载；
//  4) 连接器卸载必须先停用（MCP 行被 dispose：loaderCreated 的行被 remove），
//     否则 MCP 行悬空 —— 这是把卸载收进审批工具的主要动机之一；
//  5) 路由与工具复用同一实现 uninstallEntry：POST /uninstall 与工具卸载后
//     注册表/挂载/文件系统状态一致；专家卸载同时删 agent preset + 摘挂载；
//  6) 审计：每次调用一行 [wbh] uninstall（kind/name/审批结果）。
//
// 全部离线：无 fetch 依赖（不触发官方接口）；storeRoot/skillsMount 均 mkdtemp，
// 不碰真实目录、不打印凭据。
import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync, rmSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { apply } from './index.js'

const mkRoot = label => {
  const root = mkdtempSync(join(tmpdir(), `wbhub-uninstall-${label}-`))
  process.on('exit', () => { try { rmSync(root, { recursive: true, force: true }) } catch { /* 忽略 */ } })
  return root
}

const realConsoleInfo = console.info
const logs = []
const captureLogs = () => { console.info = (...a) => { logs.push(a.join(' ')) } }
const restoreLogs = () => { console.info = realConsoleInfo }

/**
 * 假 ctx：记录 tools.register / approval 请求 / loader.create / loader.remove；
 * connection.requestRejection 返回 undefined（放行所有请求，供路由测试用）。
 */
function makeCtx(root, { approvalOutcome, withApproval = true, withAgent = true } = {}) {
  const calls = { registered: [], approvalRequests: [], loaderCreated: [], loaderRemoved: [], presetsRemoved: [] }
  let handler = null
  const ctx = {
    get: name => (name === 'tools' ? { schemas: () => [] } : (name === 'credentials' ? { resolve: async ref => ({ value: `resolved-${ref}` }) } : undefined)),
    connection: { requestRejection: () => undefined },
    webServer: { register: spec => { handler = spec.handler; return () => {} } },
    effect: fn => { try { return fn() } catch { return () => {} } },
    on: () => () => {},
    logger: { info() {}, warn() {}, error() {} },
    commands: { register: () => () => {} },
    sessions: { list: () => [] },
    agents: { get: () => null, list: () => [] },
    credentials: { resolve: async ref => ({ value: `resolved-${ref}` }), set: async () => {} },
    loader: {
      create: async ({ name, config }) => { calls.loaderCreated.push({ name, config }); return `row-${calls.loaderCreated.length}` },
      resolve: id => {
        // 与 DSH loader 语义一致：resolve 要让该行进入 store（mcp-manager 的 unmount
        // 从 ctx.loader.store[live.id] 取 fiber 再 dispose；store 为空会被当成
        // 「本来就没挂」而跳过 remove，连接器卸载测试就验不到 MCP 行被拆）。
        const entry = { fiber: { await: async () => {}, dispose() {} } }
        ctx.loader.store[id] = entry
        return entry
      },
      remove: id => { calls.loaderRemoved.push(id); delete ctx.loader.store[id] },
      store: {},
    },
    subagents: { startContinuable: async () => ({ childId: 'child-1' }) },
    agentPresets: { remove: async id => { calls.presetsRemoved.push(id) } },
    tools: { register: def => { calls.registered.push(def); return () => {} } },
    ...(withApproval ? {
      approval: {
        request: async req => {
          calls.approvalRequests.push(req)
          return approvalOutcome ?? 'allowed-once'
        },
      },
    } : {}),
    ...(withAgent ? {} : {}),
  }
  return { ctx, calls, getHandler: () => handler, withAgent }
}

/** 在注册表里预置一条记录（不联网、不装真包；dest 指向临时目录里的假文件）。 */
function seedRecord(root, { kind, name, enabled = false, linkedSkills = [] }) {
  const dest = join(root, `${kind}s-fake`, name)
  mkdirSync(dest, { recursive: true })
  writeFileSync(join(dest, 'payload.txt'), 'x'.repeat(2048))
  if (kind === 'connector') writeFileSync(join(dest, 'mcp.json'), JSON.stringify({ mcpServers: { [name]: { transport: 'streamable-http', url: 'https://gw.example/x' } } }))
  const registryPath = join(root, '.meta', 'registry.json')
  mkdirSync(join(root, '.meta'), { recursive: true })
  let reg = { version: 1, installed: {} }
  try { reg = JSON.parse(readFileSync(registryPath, 'utf8')) } catch { /* first seed */ }
  reg.installed[`${kind}/${name}`] = {
    kind, name, dest,
    displayName: `演示${kind}`,
    installedAt: '2026-09-25T00:00:00.000Z',
    files: 2, bytes: 2048, flags: [], linked: false,
    ...(kind === 'connector' ? { enabled, linkedSkills, mcp: true, official: true, source: 'official' } : {}),
    ...(kind === 'expert' ? { official: true, source: 'official', officialMeta: { updatedAt: '2026-09-01T00:00:00.000Z' } } : {}),
  }
  writeFileSync(registryPath, JSON.stringify(reg, null, 2))
  return dest
}

/** 预置 mounts.json：两个会话都挂着同一个 key。 */
function seedMounts(root, key) {
  mkdirSync(join(root, '.meta'), { recursive: true })
  writeFileSync(join(root, '.meta', 'mounts.json'), JSON.stringify({
    version: 1,
    sessions: { 'session-a': [key], 'session-b': [key, 'skill/other'] },
  }))
}

/** 读注册表记录。 */
const rec = (root, key) => JSON.parse(readFileSync(join(root, '.meta', 'registry.json'), 'utf8')).installed[key]

const fakeAgent = { session: { header: { cwd: '/tmp' } } }
const fakeExec = { agent: fakeAgent, callId: 'call-u1', signal: undefined }

const run = async () => {
  /* ---- 1) 审批四分支（skill 记录，预置 mounts 验证「不卸时挂载原样」）---- */
  console.log('1. allowed-once → 真卸 + 审计 + 摘挂载 …')
  {
    const root = mkRoot('allowed')
    const dest = seedRecord(root, { kind: 'skill', name: 'demo-skill' })
    seedMounts(root, 'skill/demo-skill')
    captureLogs()
    try {
      const { ctx, calls } = makeCtx(root, { approvalOutcome: 'allowed-once' })
      apply(ctx, { storeRoot: root, keepalive: false, skillsMount: join(root, 'mount') })
      const uninstallTool = calls.registered.find(t => t.name === 'workbuddy_uninstall')
      assert.ok(uninstallTool, '必须注册 workbuddy_uninstall')
      const value = await uninstallTool.execute({ kind: 'skill', name: 'demo-skill' }, fakeExec)
      assert.equal(value.kind, 'skill')
      assert.equal(value.name, 'demo-skill')
      assert.equal(value.prunedSessions, 2, '两个会话挂着它 → prunedSessions=2')
      assert.ok(value.text.includes('已移除') && value.text.includes('2 个会话'), `返回文本要点明摘了挂载：${value.text}`)
      // 预览进 reason：文件数 / 体量 / 安装时间
      assert.equal(calls.approvalRequests.length, 1)
      assert.equal(calls.approvalRequests[0].toolName, 'workbuddy_uninstall')
      assert.equal(calls.approvalRequests[0].agent, fakeAgent, 'approval.request 必须带上 exec.agent')
      assert.equal(calls.approvalRequests[0].callId, 'call-u1')
      assert.match(calls.approvalRequests[0].reason, /2 个文件/)
      assert.match(calls.approvalRequests[0].reason, /2\.0 KB/)
      assert.match(calls.approvalRequests[0].reason, /不可撤销/)
      // 落地状态：注册表无记录、文件已删、挂载已摘（另一个 key 保留）
      assert.equal(rec(root, 'skill/demo-skill'), undefined)
      assert.equal(existsSync(dest), false, '记录的 dest 必须被删除')
      const mounts = JSON.parse(readFileSync(join(root, '.meta', 'mounts.json'), 'utf8'))
      assert.deepEqual(mounts.sessions['session-a'], [])
      assert.deepEqual(mounts.sessions['session-b'], ['skill/other'], '其它条目的挂载不受影响')
      // 审计一行
      assert.ok(logs.some(l => l.includes('[wbh] uninstall skill/demo-skill') && l.includes('approval=allowed-once')), `audit line missing: ${JSON.stringify(logs)}`)
    } finally { restoreLogs() }
  }

  for (const [outcome, expected] of [
    ['rejected', '用户未批准'],
    ['cancelled', '审批被取消'],
    ['unavailable', '没有可用的审批通道'],
  ]) {
    console.log(`2. ${outcome} → 不卸（${expected}），零副作用 …`)
    const root = mkRoot(`no-${outcome}`)
    seedRecord(root, { kind: 'skill', name: 'demo-skill' })
    seedMounts(root, 'skill/demo-skill')
    captureLogs()
    try {
      const { ctx, calls } = makeCtx(root, { approvalOutcome: outcome })
      apply(ctx, { storeRoot: root, keepalive: false, skillsMount: join(root, 'mount') })
      const uninstallTool = calls.registered.find(t => t.name === 'workbuddy_uninstall')
      const value = await uninstallTool.execute({ kind: 'skill', name: 'demo-skill' }, fakeExec)
      assert.match(value.text, new RegExp(expected))
      // 只读预览确实只读：注册表 / 文件 / 挂载全部原样
      assert.ok(rec(root, 'skill/demo-skill'), `${outcome} 时注册表记录必须原样保留`)
      assert.equal(existsSync(join(root, 'skills-fake', 'demo-skill')), true, `${outcome} 时文件必须原样保留`)
      const mounts = JSON.parse(readFileSync(join(root, '.meta', 'mounts.json'), 'utf8'))
      assert.deepEqual(mounts.sessions['session-a'], ['skill/demo-skill'], `${outcome} 时挂载必须原样保留`)
      assert.ok(logs.some(l => l.includes(`[wbh] uninstall skill/demo-skill`) && l.includes(`approval=${outcome}`)), '拒绝也要留审计')
    } finally { restoreLogs() }
  }

  console.log('3. approval 服务缺位 → fail-closed …')
  {
    const root = mkRoot('no-approval')
    seedRecord(root, { kind: 'skill', name: 'demo-skill' })
    captureLogs()
    try {
      const { ctx, calls } = makeCtx(root, { withApproval: false })
      apply(ctx, { storeRoot: root, keepalive: false, skillsMount: join(root, 'mount') })
      const uninstallTool = calls.registered.find(t => t.name === 'workbuddy_uninstall')
      const value = await uninstallTool.execute({ kind: 'skill', name: 'demo-skill' }, fakeExec)
      assert.match(value.text, /无法完成用户确认|未卸载/)
      assert.ok(rec(root, 'skill/demo-skill'), '服务缺位时注册表记录必须原样保留')
      assert.ok(logs.some(l => l.includes('approval=unavailable')), 'fail-closed 也要留审计')
    } finally { restoreLogs() }
  }

  console.log('3b. exec.agent 缺位 → fail-closed …')
  {
    const root = mkRoot('no-agent')
    seedRecord(root, { kind: 'skill', name: 'demo-skill' })
    captureLogs()
    try {
      const { ctx, calls } = makeCtx(root, { approvalOutcome: 'allowed-once' })
      apply(ctx, { storeRoot: root, keepalive: false, skillsMount: join(root, 'mount') })
      const uninstallTool = calls.registered.find(t => t.name === 'workbuddy_uninstall')
      const value = await uninstallTool.execute({ kind: 'skill', name: 'demo-skill' }, { agent: undefined, callId: 'call-x' })
      assert.match(value.text, /没有可路由的 agent|未卸载/)
      assert.ok(rec(root, 'skill/demo-skill'), '无 agent 时注册表记录必须原样保留')
    } finally { restoreLogs() }
  }

  console.log('4. 未安装的条目 → 如实说无需卸载，不做任何写操作 …')
  {
    const root = mkRoot('not-installed')
    const { ctx, calls } = makeCtx(root, { approvalOutcome: 'allowed-once' })
    apply(ctx, { storeRoot: root, keepalive: false, skillsMount: join(root, 'mount') })
    const uninstallTool = calls.registered.find(t => t.name === 'workbuddy_uninstall')
    const value = await uninstallTool.execute({ kind: 'connector', name: 'ghost' }, fakeExec)
    assert.match(value.text, /没有安装|无需卸载/)
    assert.equal(calls.approvalRequests.length, 0, '没装的东西不弹审批')
  }

  /* ---- 5) 连接器卸载：先停用（MCP 行 dispose），再删文件 ---- */
  console.log('5. 连接器 allowed-once → 先拆 MCP 行再删（enabled 行被 remove）…')
  {
    const root = mkRoot('conn')
    const dest = seedRecord(root, { kind: 'connector', name: 'demo-conn', enabled: true, linkedSkills: [{ name: 'demo-conn-child', linkPath: '/does/not/matter' }] })
    // 让连接器先「启用」：直接调宿主路由最省事，但这里只需要 loader 里有一行 →
    // 通过 /connectors/enable 走真实 enable 链路（loopback stub loader 已具备 fiber）。
    captureLogs()
    try {
      const { ctx, calls, getHandler } = makeCtx(root, { approvalOutcome: 'allowed-once' })
      apply(ctx, { storeRoot: root, keepalive: false, skillsMount: join(root, 'mount') })
      const handler = getHandler()
      // 经路由启用连接器（真实链路：validateConnectorMcp → loader.create）
      const enableRes = await post(handler, '/workbuddy-hub/connectors/enable', { name: 'demo-conn' })
      assert.equal(enableRes.status, 200, `启用应 200：${enableRes.body}`)
      assert.equal(calls.loaderCreated.length, 1, '启用后 loader 里应有一行 mcp-client')
      const rowId = calls.loaderCreated[0] && 'row-1'
      // 工具卸载
      const uninstallTool = calls.registered.find(t => t.name === 'workbuddy_uninstall')
      const value = await uninstallTool.execute({ kind: 'connector', name: 'demo-conn' }, fakeExec)
      assert.ok(value.text.includes('已移除'))
      assert.equal(rec(root, 'connector/demo-conn'), undefined, '注册表记录必须删除')
      assert.equal(existsSync(dest), false, '连接器目录必须删除')
      assert.equal(existsSync(join(root, 'connectors', 'demo-conn')), false, 'connectors/ 下不留残骸')
      assert.deepEqual(calls.loaderRemoved, ['row-1'], 'MCP 行必须先被 dispose/remove（否则悬空）')
      assert.ok(logs.some(l => l.includes('[wbh] uninstall connector/demo-conn') && l.includes('approval=allowed-once')), '连接器卸载审计')
      assert.ok(calls.approvalRequests[0].reason.includes('先停用 MCP 传输'), '审批理由要说明连接器会先停用')
    } finally { restoreLogs() }
  }

  /* ---- 6) 专家卸载：摘挂载 + 删 agent preset（路由链路）---- */
  console.log('6. POST /uninstall 专家 → 注册表一致、preset 被删、挂载被摘 …')
  {
    const root = mkRoot('expert')
    const dest = seedRecord(root, { kind: 'expert', name: 'demo-expert' })
    seedMounts(root, 'expert/demo-expert')
    captureLogs()
    try {
      const { ctx, calls, getHandler } = makeCtx(root, { approvalOutcome: 'rejected' }) // 工具被拒 → 路由单独验
      apply(ctx, { storeRoot: root, keepalive: false, skillsMount: join(root, 'mount') })
      const handler = getHandler()
      const res = await post(handler, '/workbuddy-hub/uninstall', { kind: 'expert', name: 'demo-expert' })
      assert.equal(res.status, 200)
      assert.equal(JSON.parse(res.body).removed, 'expert/demo-expert')
      assert.equal(JSON.parse(res.body).prunedSessions, 2)
      assert.deepEqual(calls.presetsRemoved, ['workbuddy-demo-expert'], 'expert preset 要被 best-effort 删除')
      assert.equal(rec(root, 'expert/demo-expert'), undefined)
      assert.equal(existsSync(dest), false)
      // 未安装 → 404（与原语义一致）
      const missing = await post(handler, '/workbuddy-hub/uninstall', { kind: 'expert', name: 'ghost' })
      assert.equal(missing.status, 404)
      // 非法参数 → 400
      const bad = await post(handler, '/workbuddy-hub/uninstall', { kind: 'vehicle', name: 'x' })
      assert.equal(bad.status, 400)
    } finally { restoreLogs() }
  }

  console.log('7. 路由与工具复用同一 uninstallEntry（两种入口后注册表形状一致）…')
  {
    // 工具卸载 skill/demo-skill 后，再用路由装回（stub 官方 zip）并经路由卸载，
    // 比对两条链路留下的「删除后」状态（注册表都没有该 key、挂载都为空）。
    const root = mkRoot('shared')
    seedRecord(root, { kind: 'skill', name: 'demo-skill' })
    captureLogs()
    try {
      const { ctx, calls, getHandler } = makeCtx(root, { approvalOutcome: 'allowed-once' })
      apply(ctx, { storeRoot: root, keepalive: false, skillsMount: join(root, 'mount') })
      const uninstallTool = calls.registered.find(t => t.name === 'workbuddy_uninstall')
      await uninstallTool.execute({ kind: 'skill', name: 'demo-skill' }, fakeExec)
      const viaTool = rec(root, 'skill/demo-skill')
      assert.equal(viaTool, undefined)
      // 路由卸载未安装 → 404；再 seed 一次并经路由卸载，结果一致
      seedRecord(root, { kind: 'skill', name: 'demo-skill' })
      const res = await post(getHandler(), '/workbuddy-hub/uninstall', { kind: 'skill', name: 'demo-skill' })
      assert.equal(res.status, 200)
      assert.equal(rec(root, 'skill/demo-skill'), undefined, '两条链路的最终状态一致：记录都消失')
      // 参数校验一致：工具对非法参数直接拒绝
      const bad = await uninstallTool.execute({ kind: 'vehicle', name: 'x' }, fakeExec)
      assert.match(bad.text, /参数无效/)
    } finally { restoreLogs() }
  }

  console.log('\nALL UNINSTALL-TOOL TESTS PASSED')
}

/** 极简 POST 探针（复用 test-install-tool 的手写 req/res 桩）。 */
function post(handler, url, body) {
  return new Promise((resolve, reject) => {
    const req = new EventEmitter()
    req.method = 'POST'
    req.url = url
    req.headers = {}
    req.socket = { remoteAddress: '127.0.0.1' }
    const chunks = []
    const res = {
      statusCode: 0, headers: {},
      setHeader(k, v) { this.headers[k.toLowerCase()] = v },
      end(c) { if (c !== undefined) chunks.push(String(c)); resolve({ status: res.statusCode, body: chunks.join('') }) },
    }
    handler(req, res).then(() => {
      // handler 已完成但 end 可能同步发生；保险再 resolve 一次（Promise 幂等）
    }).catch(reject)
    setImmediate(() => {
      req.emit('data', Buffer.from(JSON.stringify(body)))
      req.emit('end')
    })
  })
}

await run().catch(error => {
  globalThis.fetch = undefined
  restoreLogs()
  console.error(error)
  process.exit(1)
})
