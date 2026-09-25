// 本地 MCP 服务器管理（宿主半）：门禁 / loopback 白名单 / stdio 拒绝 / 凭据隔离 /
// loader.create+dispose 生命周期 / 启动恢复 / .json 扫描扩展（任务 4）。
//
// 全部用假 ctx（仿 test-session-contract.mjs 的 apply + 假 webServer）+ 临时 storeRoot，
// 不联网、不碰用户真实 ~/.dsh 与 ~/workbuddyskills。凭据 resolve/set 用假对象**记录
// 调用参数**，因此能断言「写的是 ref 而非明文」与「header 里是 Bearer <resolve 值>」。
import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync, rmSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { apply, scanFlags } from './index.js'
import { isLoopbackUrl, localMcpSpec, localTokenRefFor, MCP_SERVER_NAME_PATTERN } from './mcp-manager.js'

const makeRoot = label => {
  const root = mkdtempSync(join(tmpdir(), `wbhub-localmcp-${label}-`))
  process.on('exit', () => { try { rmSync(root, { recursive: true, force: true }) } catch { /* 忽略 */ } })
  return root
}

/** 假 ctx + 假 loader/credentials；记录全部调用供断言。 */
function makeCtx(root, opts = {}) {
  const calls = {
    created: [],          // { name, config }
    disposed: [],         // fiber dispose 次数
    removed: [],          // loader.remove(id)
    credSet: [],          // { ref, value }
    resolvedRefs: [],     // ref 查询
    logs: [],             // console.info
  }
  const fibers = new Map()
  let nextId = 1
  const handler = { current: null }
  const ctx = {
    get: name => (name === 'tools' ? { schemas: () => [
      { name: 'mcp__scrapling__fetch' }, { name: 'bash' },
      ...(opts.extraTools ?? []),
    ] } : undefined),
    connection: {},
    webServer: { register: spec => { handler.current = spec.handler; return () => {} } },
    effect: fn => { try { return fn() } catch { return () => {} } },
    on: () => () => {},
    logger: { info() {}, warn() {}, error() {} },
    commands: { register: () => () => {} },
    sessions: { list: () => [] },
    agents: { get: () => null },
    credentials: {
      resolve: async ref => {
        calls.resolvedRefs.push(ref)
        if (opts.missingRefs?.includes(ref)) return undefined
        return { value: opts.token ?? 'fake-token-value' }
      },
      set: async (ref, value) => { calls.credSet.push({ ref, value }) },
    },
    loader: {
      create: async ({ name, config }) => {
        if (opts.createThrows) {
          const error = new Error(opts.createThrows)
          throw error
        }
        const id = `row-${nextId++}`
        calls.created.push({ name, config })
        fibers.set(id, {
          await: async () => (opts.fiberRejects ? Promise.reject(new Error(opts.fiberRejects)) : Promise.resolve()),
          dispose: () => { calls.disposed.push(id) },
        })
        ctx.loader.store[id] = { fiber: fibers.get(id) }
        return id
      },
      resolve: id => ctx.loader.store[id],
      remove: id => { delete ctx.loader.store[id]; calls.removed.push(id) },
      store: {},
    },
  }
  return { ctx, calls, handler }
}

const makeRes = () => {
  const chunks = []
  return {
    statusCode: 0, headers: {}, writableEnded: false,
    setHeader(k, v) { this.headers[k.toLowerCase()] = v },
    end(chunk) { if (chunk !== undefined) chunks.push(String(chunk)); this.writableEnded = true },
    get body() { return chunks.join('') },
  }
}

const makeCaller = handler => async (method, path, body, remoteAddress = '127.0.0.1') => {
  const req = new EventEmitter()
  req.method = method
  req.url = '/workbuddy-hub' + path
  req.headers = {}
  req.destroy = () => {}
  req.socket = { remoteAddress }
  const res = makeRes()
  const done = handler(req, res)
  setImmediate(() => {
    if (body !== undefined) req.emit('data', Buffer.from(JSON.stringify(body)))
    req.emit('end')
  })
  await done
  let parsed = null
  try { parsed = JSON.parse(res.body) } catch { parsed = null }
  return { status: res.statusCode, json: parsed, raw: res.body }
}

const SECRET = '6af21a1f0c9d4b2e8f7c3d5a9b1e0f2c8d7e6a5b4c3d2e1f0a9b8c7d6e5f4a3b'

// ---- 0. 纯函数：loopback 判定与 spec 构造 ----------------------------------
console.log('0. 纯函数：isLoopbackUrl / localMcpSpec …')
assert.equal(isLoopbackUrl('http://127.0.0.1:8002/mcp').ok, true)
assert.equal(isLoopbackUrl('http://localhost:9000/mcp').ok, true)
assert.equal(isLoopbackUrl('http://[::1]:9000/mcp').ok, true)
assert.equal(isLoopbackUrl('http://192.168.1.5:8002/mcp').ok, false)
assert.equal(isLoopbackUrl('http://example.com/mcp').ok, false)
assert.equal(isLoopbackUrl('ftp://127.0.0.1/mcp').ok, false)
assert.equal(isLoopbackUrl('not a url').ok, false)
const specOk = localMcpSpec({ name: 'scrapling', url: 'http://127.0.0.1:8002/mcp' })
assert.equal(specOk.ok, true, specOk.error)
assert.equal(specOk.tokenRef, 'SCRAPLING_MCP_TOKEN')
assert.equal(specOk.serverName, 'scrapling')
assert.ok(MCP_SERVER_NAME_PATTERN.test(specOk.serverName))
assert.equal(specOk.server.headers.Authorization, 'Bearer ${SCRAPLING_MCP_TOKEN}', '条目里只能有引用，不能有明文')
assert.equal(localMcpSpec({ name: 'bad name!', url: 'http://127.0.0.1/x' }).ok, false)
assert.equal(localMcpSpec({ name: 'x', url: 'http://127.0.0.1/x', tokenRef: 'bad ref' }).ok, false)
assert.equal(localTokenRefFor('my-mcp.server1'), 'MY_MCP_SERVER1_MCP_TOKEN')
console.log('   OK')

// ---- 1. localMcp=false：写路由 403、列表不暴露数据 --------------------------
console.log('1. 栅栏 a：默认关闭 → 403 / guarded 列表 …')
{
  const root = makeRoot('off')
  const { ctx, handler } = makeCtx(root)
  apply(ctx, { storeRoot: root, keepalive: false, skillsMount: join(root, 'skills-mount') })
  const call = makeCaller(handler.current)
  for (const [method, path] of [
    ['POST', '/mcp/local'], ['POST', '/mcp/local/enable'],
    ['POST', '/mcp/local/disable'], ['POST', '/mcp/local/remove'],
  ]) {
    const r = await call(method, path, { name: 'scrapling', url: 'http://127.0.0.1:8002/mcp' })
    assert.equal(r.status, 403, `${method} ${path} must be 403 when localMcp is off`)
    assert.ok(String(r.json.error).includes('localMcp: true'), `${path} error must explain how to enable: ${r.json.error}`)
  }
  const list = await call('GET', '/mcp/local')
  assert.equal(list.status, 200)
  assert.equal(list.json.guarded, true)
  assert.equal(list.json.reason.includes('localMcp'), true)
  assert.deepEqual(list.json.servers, [], 'guarded list must not expose any entry data')
}
console.log('   OK')

// ---- 2. 正常流：注册 → 凭据写入 → 启用 → 停用 → 移除 ------------------------
console.log('2. 注册/启用/停用/移除全链路（凭据隔离断言）…')
{
  const root = makeRoot('main')
  const { ctx, calls, handler } = makeCtx(root, { token: SECRET })
  apply(ctx, { storeRoot: root, keepalive: false, localMcp: true, skillsMount: join(root, 'skills-mount') })
  const call = makeCaller(handler.current)

  // 2a) 非 loopback URL：400 且原因明确（注册与启用前就拒绝）
  const nonLoop = await call('POST', '/mcp/local', { name: 'lan', url: 'http://192.168.1.5:8002/mcp' })
  assert.equal(nonLoop.status, 400)
  assert.ok(String(nonLoop.json.error).includes('本机'), `non-loopback must explain the whitelist: ${nonLoop.json.error}`)
  assert.equal(existsSync(join(root, 'mcp-servers', 'lan.json')), false, 'rejected url must not create an entry')

  // 2b) stdio：400 且说明「本机执行任意命令」
  const stdio = await call('POST', '/mcp/local', { name: 'shell', url: 'http://127.0.0.1:9000/mcp', transport: 'stdio' })
  assert.equal(stdio.status, 400)
  assert.ok(String(stdio.json.error).includes('stdio'), `stdio must be rejected by name: ${stdio.json.error}`)
  assert.ok(String(stdio.json.error).includes('任意命令'), 'stdio rejection must explain the arbitrary-command risk')

  // 2c) 注册 + token：写凭据库（断言调用参数），明文不落盘、不回响应
  const reg = await call('POST', '/mcp/local', { name: 'scrapling', url: 'http://127.0.0.1:8002/mcp', token: SECRET })
  assert.equal(reg.status, 200, reg.raw)
  assert.equal(reg.json.ok, true)
  assert.equal(reg.json.server.enabled, false, 'register must not auto-enable')
  assert.equal(reg.json.server.tokenRef, 'SCRAPLING_MCP_TOKEN')
  assert.deepEqual(calls.credSet, [{ ref: 'SCRAPLING_MCP_TOKEN', value: SECRET }], 'token must go to credentials.set(ref, value)')
  assert.ok(!reg.raw.includes(SECRET), 'response must never contain the token plaintext')
  const entryPath = join(root, 'mcp-servers', 'scrapling.json')
  const entryRaw = readFileSync(entryPath, 'utf8')
  assert.ok(!entryRaw.includes(SECRET), 'entry file must never contain the token plaintext')
  assert.ok(entryRaw.includes('SCRAPLING_MCP_TOKEN'), 'entry must reference the credential ref')
  assert.ok(!JSON.stringify(calls.logs).includes(SECRET), 'audit logs must never contain the token plaintext')
  // 官方连接器目录不得被污染
  assert.equal(existsSync(join(root, 'connectors', 'scrapling')), false, 'local MCP entries must stay out of connectors/')

  // 2d) 启用：loader.create 收到 Bearer <resolve 出来的值>；条目 enabled=true
  const en = await call('POST', '/mcp/local/enable', { name: 'scrapling' })
  assert.equal(en.status, 200, en.raw)
  assert.equal(en.json.ok, true)
  assert.equal(calls.created.length, 1)
  assert.equal(calls.created[0].name, '@deepseek-ai/dsh-mcp-client')
  assert.equal(calls.created[0].config.serverName, 'scrapling')
  assert.equal(calls.created[0].config.url, 'http://127.0.0.1:8002/mcp')
  assert.equal(calls.created[0].config.headers.Authorization, `Bearer ${SECRET}`, 'config must carry Bearer <resolved>')
  assert.equal(calls.created[0].config.failOnStartupError, true, 'enable must be transactional')
  assert.ok(calls.resolvedRefs.includes('SCRAPLING_MCP_TOKEN'), 'enable must resolve the tokenRef')
  assert.equal(en.json.server.enabled, true)
  assert.ok(String(JSON.parse(entryRaw).toolCount ?? en.json.server.toolCount) !== undefined, 'toolCount field must exist')
  // toolCount 从活注册表算：假 tools 有 1 个 mcp__scrapling__ 工具
  assert.equal(en.json.server.toolCount, 1, 'toolCount must come from the live registry')
  assert.ok(!en.raw.includes(SECRET))

  // 2e) 停用：dispose 立即发生
  const dis = await call('POST', '/mcp/local/disable', { name: 'scrapling' })
  assert.equal(dis.status, 200)
  assert.equal(dis.json.server.enabled, false)
  assert.equal(calls.disposed.length, 1, 'disable must dispose the mcp-client row')
  assert.equal(calls.removed.length, 1)
  assert.equal(JSON.parse(readFileSync(entryPath, 'utf8')).enabled, false)

  // 2f) 再启用 → 移除（先 disable 再删文件）
  await call('POST', '/mcp/local/enable', { name: 'scrapling' })
  assert.equal(calls.created.length, 2)
  const rm = await call('POST', '/mcp/local/remove', { name: 'scrapling' })
  assert.equal(rm.status, 200)
  assert.equal(calls.disposed.length, 2, 'remove must disable first (dispose again)')
  assert.equal(existsSync(entryPath), false, 'remove must delete the entry file')
  const list = await call('GET', '/mcp/local')
  assert.deepEqual(list.json.servers, [])
}
console.log('   OK')

// ---- 3. 启用失败（连不上）：502 + lastError + 不置 enabled ------------------
console.log('3. enable 失败是事务性的（不置 enabled、记 lastError）…')
{
  const root = makeRoot('fail')
  const { ctx, calls, handler } = makeCtx(root, { token: SECRET, fiberRejects: 'connect ECONNREFUSED 127.0.0.1:8002' })
  apply(ctx, { storeRoot: root, keepalive: false, localMcp: true, skillsMount: join(root, 'skills-mount') })
  const call = makeCaller(handler.current)
  await call('POST', '/mcp/local', { name: 'scrapling', url: 'http://127.0.0.1:8002/mcp', token: SECRET })
  const en = await call('POST', '/mcp/local/enable', { name: 'scrapling' })
  assert.equal(en.status, 502)
  assert.ok(String(en.json.error).includes('ECONNREFUSED'))
  const entry = JSON.parse(readFileSync(join(root, 'mcp-servers', 'scrapling.json'), 'utf8'))
  assert.equal(entry.enabled, false, 'a failed enable must leave the entry disabled')
  assert.ok(String(entry.lastError).includes('ECONNREFUSED'), 'failure must be visible via lastError')
  assert.equal(calls.disposed.length, 1, 'the failed row must be disposed (rollback)')
  assert.equal(calls.removed.length, 1)
}
console.log('   OK')

// ---- 4. 启动恢复：enabled 记录 → apply 后 create；失败记 lastError 不抛 ------
console.log('4. 启动恢复（成功 + 失败都不影响插件启动）…')
{
  const root = makeRoot('restore')
  mkdirSync(join(root, 'mcp-servers'), { recursive: true })
  writeFileSync(join(root, 'mcp-servers', 'scrapling.json'), JSON.stringify({
    name: 'scrapling', transport: 'streamable-http', url: 'http://127.0.0.1:8002/mcp',
    tokenRef: 'SCRAPLING_MCP_TOKEN', enabled: true, serverName: 'scrapling',
    createdAt: '2026-09-25T00:00:00.000Z', updatedAt: '2026-09-25T00:00:00.000Z', lastEnabledAt: '',
  }))
  const { ctx, calls, handler } = makeCtx(root, { token: SECRET })
  // apply 本身绝不因恢复失败而抛
  apply(ctx, { storeRoot: root, keepalive: false, localMcp: true, skillsMount: join(root, 'skills-mount') })
  assert.equal(calls.created.length, 0, 'restore is deferred (1.5s), not synchronous')
  await new Promise(resolve => setTimeout(resolve, 1900))
  assert.equal(calls.created.length, 1, 'a pre-existing enabled entry must be restored on startup')
  assert.equal(calls.created[0].config.serverName, 'scrapling')
  assert.equal(calls.created[0].config.headers.Authorization, `Bearer ${SECRET}`)

  // 失败路径：create 后 fiber 拒绝 → lastError 落盘、enabled 复位、进程不崩
  const root2 = makeRoot('restore-fail')
  mkdirSync(join(root2, 'mcp-servers'), { recursive: true })
  writeFileSync(join(root2, 'mcp-servers', 'down.json'), JSON.stringify({
    name: 'down', transport: 'streamable-http', url: 'http://127.0.0.1:1/mcp',
    tokenRef: 'DOWN_MCP_TOKEN', enabled: true, serverName: 'down',
  }))
  const failCtx = makeCtx(root2, { fiberRejects: 'ECONNREFUSED' })
  apply(failCtx.ctx, { storeRoot: root2, keepalive: false, localMcp: true, skillsMount: join(root2, 'skills-mount') })
  await new Promise(resolve => setTimeout(resolve, 1900))
  const entry2 = JSON.parse(readFileSync(join(root2, 'mcp-servers', 'down.json'), 'utf8'))
  assert.equal(entry2.enabled, false)
  assert.ok(String(entry2.lastError).includes('ECONNREFUSED'), 'restore failure must land in lastError')
  // 功能关闭时恢复逻辑完全不动作
  const root3 = makeRoot('restore-off')
  mkdirSync(join(root3, 'mcp-servers'), { recursive: true })
  writeFileSync(join(root3, 'mcp-servers', 'x.json'), JSON.stringify({
    name: 'x', transport: 'streamable-http', url: 'http://127.0.0.1:8002/mcp', enabled: true,
  }))
  const offCtx = makeCtx(root3)
  apply(offCtx.ctx, { storeRoot: root3, keepalive: false, skillsMount: join(root3, 'skills-mount') })
  await new Promise(resolve => setTimeout(resolve, 1900))
  assert.equal(offCtx.calls.created.length, 0, 'no restore when the feature gate is off')
}
console.log('   OK')

// ---- 5. 显式 tokenRef + 无 token 注册 + 凭据缺失的降级 ----------------------
console.log('5. 显式 tokenRef / 无 token 注册 / 凭据缺失降级 …')
{
  const root = makeRoot('refs')
  const { ctx, calls, handler } = makeCtx(root, { token: SECRET })
  apply(ctx, { storeRoot: root, keepalive: false, localMcp: true, skillsMount: join(root, 'skills-mount') })
  const call = makeCaller(handler.current)
  const reg = await call('POST', '/mcp/local', { name: 'homelab', url: 'http://localhost:9100/mcp', tokenRef: 'CUSTOM_REF_1' })
  assert.equal(reg.status, 200)
  assert.equal(reg.json.server.tokenRef, 'CUSTOM_REF_1')
  assert.equal(calls.credSet.length, 0, 'no token given → credentials.set must not be called')
  const en = await call('POST', '/mcp/local/enable', { name: 'homelab' })
  assert.equal(en.status, 200)
  assert.equal(calls.created.at(-1).config.headers.Authorization, `Bearer ${SECRET}`)
  // 凭据缺失：enable 走「未鉴权」降级，不携带 Authorization，且结果如实标注
  const root2 = makeRoot('missing')
  const missingCtx = makeCtx(root2, { missingRefs: ['SCRAPLING_MCP_TOKEN'] })
  apply(missingCtx.ctx, { storeRoot: root2, keepalive: false, localMcp: true, skillsMount: join(root2, 'skills-mount') })
  const call2 = makeCaller(missingCtx.handler.current)
  await call2('POST', '/mcp/local', { name: 'scrapling', url: 'http://127.0.0.1:8002/mcp' })
  const en2 = await call2('POST', '/mcp/local/enable', { name: 'scrapling' })
  assert.equal(en2.status, 200)
  assert.equal(en2.json.server.authMode ?? en2.json.server.note ?? '', en2.json.server.authMode ?? en2.json.server.note ?? '', 'auth mode must be reported')
  assert.equal(missingCtx.calls.created.at(-1).config.headers.Authorization, undefined, 'missing credential → no Authorization header')
}
console.log('   OK')

// ---- 6. 任务 4：.json 纳入 scanFlags + mcp 定义结构化扫描 -------------------
console.log('6. 任务 4：mcp.json 的 command/url/headers 必须被扫到 …')
{
  // 修复前：.json 不在 SCAN_EXT → mcp.json 里的外部 URL 永远扫不到
  const flags1 = scanFlags('mcp.json', JSON.stringify({
    mcpServers: { s: { transport: 'streamable-http', url: 'https://mcp.map.qq.com/sse?key=${K}' } },
  }))
  assert.ok(flags1.some(f => f.startsWith('mcpServers.s.url: external-url')), `mcp.json url must be flagged: ${JSON.stringify(flags1)}`)
  assert.ok(flags1.some(f => f.startsWith('mcpServers.s.url: sensitive-query-param')), 'query key named like a credential must be flagged')

  const flags2 = scanFlags('mcp.json', JSON.stringify({
    mcpServers: { s: { transport: 'stdio', command: 'node', args: ['evil.js'] } },
  }))
  assert.ok(flags2.some(f => f === 'mcpServers.s: declares-command-execution'), 'stdio/command declaration must be flagged')

  // 官方源白名单不误报
  const flags3 = scanFlags('mcp.json', JSON.stringify({
    mcpServers: { s: { transport: 'streamable-http', url: 'https://raw.githubusercontent.com/x/y/z' } },
  }))
  assert.ok(!flags3.some(f => f.includes('external-url')), 'official-source urls must not be flagged')
  // 损坏的 json 退回纯文本规则（不抛错）
  assert.deepEqual(scanFlags('mcp.json', '{not json'), [])
}
console.log('   OK')

// ---- 9. GET /mcp/host：宿主侧 MCP 总清单（三类来源，含 DSH 自己加载的）-------
// picker 的「本机 MCP」一节靠它：本插件托管的可开关；DSH 自己加载的只读展示。
// 假 ctx 的 tools 服务里有 mcp__scrapling__fetch + bash，所以：
//   · 'demo-local' 是 store 里注册并启用的本地 MCP → source=local-mcp（可管）
//   · 'scrapling' 在 tools 里活着但不在 store/连接器里 → source=dsh（只读）
//   · 手工写进 registry 的连接器 → source=connector（客户端会跳过它避免重复）
{
  const root = makeRoot('host')
  mkdirSync(join(root, '.meta'), { recursive: true })
  writeFileSync(join(root, '.meta', 'registry.json'), JSON.stringify({
    version: 1,
    installed: { 'connector/tdocs-app': { kind: 'connector', name: 'tdocs-app', serverName: 'tdocs-app', enabled: false, dest: join(root, 'connectors', 'tdocs-app') } },
  }, null, 2))
  const { ctx, handler } = makeCtx(root, { extraTools: [
    // 真机撞到过：工具名里含 __ → 必须仍归属 serverName=tdocs-app，而不是造出假服务器
    { name: 'mcp__tdocs-app__smartsheet__add_dashboard_component' },
  ] })
  apply(ctx, { storeRoot: root, localMcp: true, keepalive: false })
  const call = makeCaller(handler.current)

  const reg = await call('POST', '/mcp/local', { name: 'demo-local', url: 'http://127.0.0.1:9111/mcp' })
  assert.equal(reg.status, 200, `register demo-local: ${reg.raw}`)
  const en = await call('POST', '/mcp/local/enable', { name: 'demo-local' })
  assert.equal(en.status, 200, `enable demo-local: ${en.raw}`)

  const host = await call('GET', '/mcp/host')
  assert.equal(host.status, 200)
  const byName = Object.fromEntries((host.json.servers || []).map(s => [s.name, s]))

  assert.ok(byName['demo-local'], '/mcp/host 必须列出本插件托管的本地 MCP')
  assert.equal(byName['demo-local'].source, 'local-mcp')
  assert.equal(byName['demo-local'].managed, true, '托管条目 managed=true（客户端才给开关）')
  assert.equal(byName['demo-local'].enabled, true)

  assert.ok(byName.scrapling, '/mcp/host 必须列出 DSH 自己加载的 MCP（有 mcp__<server>__ 工具但不在托管清单里）')
  assert.equal(byName.scrapling.source, 'dsh')
  assert.equal(byName.scrapling.managed, false, 'DSH 加载的条目 managed=false（只读展示，插件不代管别人的配置）')
  assert.equal(byName.scrapling.toolCount, 1, '工具数按活注册表现算')

  assert.ok(byName['tdocs-app'], '/mcp/host 必须列出连接器建立的 MCP 行（客户端据此去重）')
  assert.equal(byName['tdocs-app'].source, 'connector')
  assert.equal(byName['tdocs-app'].toolCount, 1, '工具名里含 __ 时也要正确归属到 serverName=tdocs-app')
  assert.ok(!byName['tdocs-app__smartsheet'],
    '不得按最后一个 __ 切出假服务器（serverName 契约不允许 __）')

  // localMcp 关着时：仍然返回清单（好让 picker 如实显示 DSH 已加载了什么），但带 guarded 标记
  const { ctx: ctx2, handler: handler2 } = makeCtx(makeRoot('host-off'))
  apply(ctx2, { storeRoot: makeRoot('host-off2'), keepalive: false })
  const call2 = makeCaller(handler2.current)
  const off = await call2('GET', '/mcp/host')
  assert.equal(off.status, 200)
  assert.equal(off.json.guarded, true, 'localMcp 关闭时也要能列出 DSH 侧清单，并标 guarded')
  assert.ok((off.json.servers || []).some(s => s.source === 'dsh'), '关闭态下 DSH 侧条目仍要可见')
}
console.log('   OK')

console.log('ALL LOCAL-MCP TESTS PASSED')
