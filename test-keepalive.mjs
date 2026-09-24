/**
 * 账号保活（keepalive）与「会话失效」判定的测试。
 *
 * 覆盖三层：
 *  1) 纯逻辑（src/keepalive.js）：阈值边界（刚好 2 小时 / 差 1 毫秒）、
 *     「连续 3 次失败才 stale、第 1、2 次不判、成功清零」、session-dead 与
 *     refresh-fail 混合计数、健康档归一。
 *  2) 主动保活 refreshIfNeeded（wb-market.js）：**假 stateDir + 假凭证**，
 *     未到阈值必须一次网络都不发（证明不会误刷）；force 才真刷（fetch 打桩）；
 *     官方 12153 → reason=session-dead；落盘 0600。
 *  3) 宿主集成（index.js）：GET /wb-auth 新增字段（stale / lastError / keepalive）
 *     且旧字段不变；官方 12153 连续 3 次才 stale；重新登录/注销清空健康档；
 *     开服先巡检真的跑过一次；keepalive:false 能彻底关掉定时器。
 *
 * 安全约束：**全程不碰真实凭证、不碰 ~/workbuddyskills、不发真实网络请求** ——
 * 所有 fetch 都是本地打桩，stateDir 全是 mkdtemp 出来的临时目录。
 */
import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { mkdtempSync, mkdirSync, readFileSync, statSync, existsSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import {
  KEEPALIVE_THRESHOLD_MS, MAX_CONSECUTIVE_FAILURES, SESSION_DEAD_CODE,
  initialHealth, normalizeHealth, expiresAtOf, shouldRefresh, isStale, reduceHealth, touchCheck,
} from './src/keepalive.js'
import {
  refreshIfNeeded, saveAuth, loadAuth, loadAuthHealth, saveAuthHealth, clearAuthHealth,
  onAuthEvent, marketList, AUTH_HEALTH_FILE,
} from './wb-market.js'
import { apply } from './index.js'

const sleep = ms => new Promise(r => setTimeout(r, ms))
const realFetch = globalThis.fetch
const tempDirs = []
const mkTmp = prefix => { const d = mkdtempSync(join(tmpdir(), prefix)); tempDirs.push(d); return d }

try {
  /* ================================================================== *
   * 1) 纯逻辑
   * ================================================================== */

  // 常量：来自上游（wb_scheduler.py 的 7200 秒 / sessiondead_test.go 的连续第 3 次）
  assert.equal(KEEPALIVE_THRESHOLD_MS, 7200 * 1000, '保活阈值必须是上游的 2 小时 = 7200 秒')
  assert.equal(MAX_CONSECUTIVE_FAILURES, 3, '连续第 3 次才判失效')
  assert.equal(SESSION_DEAD_CODE, 12153, '官方 session 失效错误码')

  // 到期时间：obtainedAt + expires_in*1000（与 GET /wb-auth 的 expiresAt 同算法）
  assert.equal(expiresAtOf({ obtainedAt: 1000, expires_in: 3600 }), 1000 + 3600 * 1000)
  assert.equal(expiresAtOf({ obtainedAt: 1000 }), 1000 + 3600 * 1000, '缺 expires_in 时按 3600s 兜底（同旧实现）')
  assert.equal(expiresAtOf(null), 0)

  // 阈值边界：剩余寿命**刚好** 2 小时 → 不刷；差 1 毫秒 → 刷；多 1 毫秒 → 不刷
  const NOW = 1_700_000_000_000
  assert.equal(shouldRefresh(NOW + KEEPALIVE_THRESHOLD_MS, NOW), false, '刚好 2 小时：不刷新（阈值取严格小于）')
  assert.equal(shouldRefresh(NOW + KEEPALIVE_THRESHOLD_MS - 1, NOW), true, '差 1 毫秒：必须刷新')
  assert.equal(shouldRefresh(NOW + KEEPALIVE_THRESHOLD_MS + 1, NOW), false, '多 1 毫秒：不刷新')
  assert.equal(shouldRefresh(NOW - 1, NOW), true, '已过期：刷新')
  assert.equal(shouldRefresh(0, NOW), true, '没有到期时间：保守刷新')
  assert.equal(shouldRefresh(undefined, NOW), true)
  assert.equal(shouldRefresh(NOW + 1000, NOW, 2000), true, '阈值可注入（测试与排障用）')
  assert.equal(shouldRefresh(NOW + 3000, NOW, 2000), false)

  // 连续失败：第 1、2 次不判失效，第 3 次才判；staleAt 只落一次
  let h = initialHealth()
  assert.deepEqual(h, { consecutiveFailures: 0, lastError: '', lastCheckAt: 0, staleAt: null })
  assert.equal(isStale(h), false, '初始不该是失效')

  h = reduceHealth(h, { type: 'refresh-fail', at: 1000, error: 'HTTP 500' })
  assert.equal(h.consecutiveFailures, 1)
  assert.equal(h.lastError, 'HTTP 500')
  assert.equal(h.lastCheckAt, 1000)
  assert.equal(isStale(h), false, '第 1 次失败不得判失效（误判防护）')

  h = reduceHealth(h, { type: 'refresh-fail', at: 2000, error: 'HTTP 500' })
  assert.equal(h.consecutiveFailures, 2)
  assert.equal(isStale(h), false, '第 2 次失败仍不得判失效（误判防护）')

  h = reduceHealth(h, { type: 'refresh-fail', at: 3000, error: 'HTTP 503' })
  assert.equal(h.consecutiveFailures, 3)
  assert.equal(isStale(h), true, '连续第 3 次失败 → 判会话失效')
  assert.equal(h.staleAt, 3000, '判失效时落 staleAt')
  assert.equal(h.lastError, 'HTTP 503', 'lastError 记最新一次')

  h = reduceHealth(h, { type: 'refresh-fail', at: 4000, error: 'HTTP 503' })
  assert.equal(h.consecutiveFailures, 4)
  assert.equal(h.staleAt, 3000, 'staleAt 只落首次判失效的时间（便于排障）')

  // 成功一次 → 清零（含 lastError / staleAt）
  h = reduceHealth(h, { type: 'refresh-ok', at: 5000 })
  assert.deepEqual(h, { consecutiveFailures: 0, lastError: '', lastCheckAt: 5000, staleAt: null }, '成功一次即清空')
  assert.equal(isStale(h), false)

  // session-dead 与 refresh-fail 混合：共用同一计数器
  let m = initialHealth()
  m = reduceHealth(m, 'refresh-fail')
  assert.equal(m.consecutiveFailures, 1)
  assert.equal(m.lastError, '', '没有错误文案时不编造')
  m = reduceHealth(m, { type: 'session-dead', at: 10, error: '' })
  assert.equal(m.consecutiveFailures, 2, 'session-dead 与 refresh-fail 必须累计到同一个计数器')
  assert.equal(isStale(m), false, '混合到第 2 次仍不判失效')
  assert.ok(m.lastError.includes(String(SESSION_DEAD_CODE)), 'session-dead 没带文案时用 12153 兜底文案')
  m = reduceHealth(m, 'refresh-fail')
  assert.equal(m.consecutiveFailures, 3)
  assert.equal(isStale(m), true, '混合事件到第 3 次照样判失效')
  assert.ok(m.lastError.includes(String(SESSION_DEAD_CODE)), '没有新错误文案时保留上一次（12153 兜底文案）')

  // 中间成功一次要清零：session-dead, session-dead, ok, session-dead → 计数 1
  let mix = initialHealth()
  mix = reduceHealth(mix, 'session-dead')
  mix = reduceHealth(mix, 'session-dead')
  assert.equal(mix.consecutiveFailures, 2)
  mix = reduceHealth(mix, 'refresh-ok')
  assert.equal(mix.consecutiveFailures, 0, '中间成功一次必须清零')
  mix = reduceHealth(mix, 'session-dead')
  assert.equal(mix.consecutiveFailures, 1)
  assert.equal(isStale(mix), false, '清零后再来一次不能直接判失效')

  // session-dead 无错误文案时的兜底提示必须带上官方错误码
  const dead = reduceHealth(initialHealth(), 'session-dead')
  assert.ok(dead.lastError.includes(String(SESSION_DEAD_CODE)), 'session-dead 的默认文案要写明 12153')

  // 未知事件不改动；脏健康档要归一
  const stable = { consecutiveFailures: 1, lastError: 'x', lastCheckAt: 7, staleAt: null }
  assert.deepEqual(reduceHealth(stable, 'whatever'), stable, '未知事件不得改变健康档')
  assert.deepEqual(reduceHealth(stable, undefined), stable)
  assert.equal(reduceHealth({ consecutiveFailures: 'NaN' }, 'refresh-fail').consecutiveFailures, 1, '脏文件不能把计数带偏')
  assert.equal(normalizeHealth({ consecutiveFailures: -5, staleAt: -1 }).consecutiveFailures, 0)
  assert.equal(normalizeHealth({ staleAt: -1 }).staleAt, null)

  // touchCheck：只更新巡检时间，成功/失败计数都不动
  const touched = touchCheck(stable, 99)
  assert.equal(touched.lastCheckAt, 99)
  assert.equal(touched.consecutiveFailures, 1, '「这次没刷」不能抹掉之前真实的失败')
  assert.equal(touched.lastError, 'x')

  /* ================================================================== *
   * 2) refreshIfNeeded：假 stateDir + 假凭证（绝不碰真实凭证）
   * ================================================================== */

  const stateDir = mkTmp('wbh-keepalive-state-')
  const authPath = join(stateDir, 'workbuddy-auth.json')

  // 2a) 没有凭证 / 没有 refresh_token → no-credentials（一次网络都不发）
  let netCalls = 0
  globalThis.fetch = async () => { netCalls += 1; throw new Error('不该发网络请求') }
  assert.deepEqual(await refreshIfNeeded(stateDir), { ok: false, reason: 'no-credentials' })
  saveAuth(stateDir, { access_token: 'a0', expires_in: 3600, obtainedAt: Date.now() })   // 只有 access_token
  assert.deepEqual(await refreshIfNeeded(stateDir), { ok: false, reason: 'no-credentials' })
  assert.equal(netCalls, 0, 'no-credentials 路径不得发任何请求')

  // 2b) 未到阈值 → 不刷新（证明不会误刷；凭证文件原封不动）
  const farAuth = { access_token: 'a1', refresh_token: 'r1', expires_in: 6 * 3600, obtainedAt: Date.now(), uid: 'u-1', nickname: '假用户' }
  saveAuth(stateDir, farAuth)
  const beforeBytes = readFileSync(authPath, 'utf8')
  const notDue = await refreshIfNeeded(stateDir, { thresholdMs: KEEPALIVE_THRESHOLD_MS })
  assert.equal(notDue.ok, true)
  assert.equal(notDue.refreshed, false, '剩余 6 小时 > 2 小时阈值：不得刷新')
  assert.deepEqual(notDue.auth, farAuth)
  assert.equal(netCalls, 0, '未到阈值绝不能调用官方 refresh 接口（不消耗 refresh_token）')
  assert.equal(readFileSync(authPath, 'utf8'), beforeBytes, '未刷新时凭证文件不得被改写')

  // 2c) 到阈值（阈值放宽到 8 小时 > 剩余 6 小时）→ 真刷；fetch 打桩，成功落盘 0600
  const events = []
  const offEvents = onAuthEvent(e => events.push(e.type))
  const fetchCalls = []
  globalThis.fetch = async (url, init) => {
    fetchCalls.push({ url: String(url), body: init?.body })
    return {
      status: 200,
      text: async () => JSON.stringify({ code: 0, data: { accessToken: 'a2', refreshToken: 'r2', expiresIn: 7200 } }),
    }
  }
  const due = await refreshIfNeeded(stateDir, { thresholdMs: 8 * 3600 * 1000 })
  assert.equal(due.ok, true)
  assert.equal(due.refreshed, true, '剩余 6 小时 < 8 小时阈值：必须刷新')
  assert.equal(fetchCalls.length, 1, '恰好一次 refresh 调用')
  assert.ok(fetchCalls[0].url.endsWith('/v2/plugin/auth/refresh'), `refresh 端点：${fetchCalls[0].url}`)
  assert.deepEqual(JSON.parse(fetchCalls[0].body), { refresh_token: 'r1' })
  const saved = loadAuth(stateDir)
  assert.equal(saved.access_token, 'a2')
  assert.equal(saved.refresh_token, 'r2')
  assert.equal(saved.expires_in, 7200)
  assert.ok(saved.obtainedAt > 0)
  assert.deepEqual(events, ['refresh-ok'], 'refresh 成功要广播 refresh-ok（宿主据此清零失败计数）')

  // 凭证文件权限：0600（审计项：此前是默认 0644）
  assert.equal(statSync(authPath).mode & 0o777, 0o600, '凭证明文必须以 0600 落盘')

  // 2d) 官方 12153 → reason=session-dead（且 refresh 端点自身不广播 session-dead，避免重复记账）
  events.length = 0
  globalThis.fetch = async () => ({ status: 200, text: async () => JSON.stringify({ code: SESSION_DEAD_CODE, msg: 'session dead' }) })
  const deadResult = await refreshIfNeeded(stateDir, { force: true })
  assert.equal(deadResult.ok, false)
  assert.equal(deadResult.reason, 'session-dead')
  assert.equal(deadResult.sessionDead, true)
  assert.equal(deadResult.error.code, SESSION_DEAD_CODE, '错误上要带官方 code，调用方才能判定')
  assert.deepEqual(events, [], 'refresh 自身的 12153 不广播（由调用方计数，同一次失败不能记两遍）')

  // 2e) 其它失败 → reason=refresh-failed（不是 session-dead）
  globalThis.fetch = async () => ({ status: 500, text: async () => JSON.stringify({ code: 500, msg: 'boom' }) })
  const boom = await refreshIfNeeded(stateDir, { force: true })
  assert.equal(boom.ok, false)
  assert.equal(boom.reason, 'refresh-failed')
  assert.equal(boom.sessionDead, false)

  // 2f) 非 refresh 端点的官方 12153 要广播 session-dead（宿主据此走同一套计数）
  events.length = 0
  saveAuth(stateDir, { access_token: 'a3', refresh_token: 'r3', expires_in: 6 * 3600, obtainedAt: Date.now() })
  globalThis.fetch = async () => ({ status: 200, text: async () => JSON.stringify({ code: SESSION_DEAD_CODE, msg: 'session dead' }) })
  await marketList('expert', {}, stateDir).then(() => assert.fail('12153 必须抛错'), () => {})
  assert.deepEqual(events, ['session-dead'], '官方市场接口返回 12153 必须广播 session-dead')

  // 2g) 健康档读写：0600 落盘、脏文件归一、清空
  saveAuthHealth(stateDir, { consecutiveFailures: 2, lastError: 'HTTP 500', lastCheckAt: 1234, staleAt: null })
  assert.deepEqual(loadAuthHealth(stateDir), { consecutiveFailures: 2, lastError: 'HTTP 500', lastCheckAt: 1234, staleAt: null })
  assert.equal(statSync(join(stateDir, AUTH_HEALTH_FILE)).mode & 0o777, 0o600)
  clearAuthHealth(stateDir)
  assert.deepEqual(loadAuthHealth(stateDir), initialHealth(), '清空后回到初始值')
  assert.equal(existsSync(join(stateDir, AUTH_HEALTH_FILE)), false)
  offEvents()

  /* ================================================================== *
   * 3) 宿主集成：GET /wb-auth 字段 + 12153 连续计数 + 开服先巡检
   * ================================================================== */

  const root = mkTmp('wbh-keepalive-host-')
  const hostState = join(root, '.meta', 'state')
  mkdirSync(hostState, { recursive: true })
  // 假凭证：剩余 6 小时（> 2 小时阈值）→ 保活巡检不会真的去刷（本测试全程只打桩 fetch）
  saveAuth(hostState, { access_token: 'host-token', refresh_token: 'host-refresh', expires_in: 6 * 3600, obtainedAt: Date.now(), uid: 'u-9', nickname: '保活用户' })

  const disposers = []
  let handler = null
  const ctx = {
    get: () => undefined,
    sessions: { list: () => [] },
    agents: { get: () => null },
    connection: {},
    webServer: { register: spec => { handler = spec.handler; return () => {} } },
    effect: fn => { const d = fn(); disposers.push(typeof d === 'function' ? d : () => {}); return d },
    on: () => () => {},
    commands: { register: () => () => {} },
    loader: { create: () => ({ dispose() {}, disposeAll() {} }) },
    credentials: { resolve: async () => 'token', set: async () => {} },
    subagents: { startContinuable: async () => ({ childId: 'child-1' }) },
  }
  // 官方市场接口一律回 12153（session 失效）—— 本地打桩，不出网
  globalThis.fetch = async () => ({ status: 200, text: async () => JSON.stringify({ code: SESSION_DEAD_CODE, msg: 'session dead' }) })

  const makeRes = () => {
    const chunks = []
    return {
      statusCode: 0, headers: {},
      setHeader(k, v) { this.headers[k.toLowerCase()] = v },
      end(chunk) { if (chunk !== undefined) chunks.push(String(chunk)) },
      get body() { return chunks.join('') },
    }
  }
  const call = async (method, path, body) => {
    const req = new EventEmitter()
    req.method = method
    req.url = '/workbuddy-hub' + path
    req.headers = {}
    req.destroy = () => {}
    const res = makeRes()
    const done = handler(req, res)
    setImmediate(() => {
      if (body !== undefined) req.emit('data', Buffer.from(JSON.stringify(body)))
      req.emit('end')
    })
    await done
    let parsed = null
    try { parsed = JSON.parse(res.body) } catch { parsed = null }
    return { status: res.statusCode, json: parsed }
  }

  apply(ctx, { storeRoot: root })
  assert.equal(typeof handler, 'function', '插件必须注册 webServer 前缀路由')
  await sleep(80)   // 等「开服先巡检」（setTimeout 0，不阻塞 apply）

  const fresh = await call('GET', '/wb-auth')
  assert.equal(fresh.status, 200)
  // 旧字段必须原样保留（客户端已在用，只增不改）
  assert.equal(fresh.json.configured, true)
  assert.equal(fresh.json.uid, 'u-9')
  assert.equal(fresh.json.nickname, '保活用户')
  assert.ok(fresh.json.expiresAt > Date.now(), 'expiresAt 仍是 obtainedAt + expires_in*1000')
  // 新增字段
  assert.equal(fresh.json.stale, false, '刚巡检成功不该是失效')
  assert.equal(fresh.json.lastError, '')
  assert.equal(fresh.json.keepalive.consecutiveFailures, 0)
  assert.ok(fresh.json.keepalive.lastCheckAt > 0, '开服先巡检必须真的跑过一次（未到阈值只更新时间）')

  // 官方 12153 连续 3 次：第 1、2 次不 stale，第 3 次才 stale
  for (let i = 1; i <= 3; i += 1) {
    const market = await call('GET', '/market-list?kind=expert')
    assert.equal(market.status, 200, '官方失败时路由仍要 200 + 镜像兜底')
    const state = await call('GET', '/wb-auth')
    assert.equal(state.json.keepalive.consecutiveFailures, i, `第 ${i} 次 12153 后计数应为 ${i}`)
    assert.equal(state.json.stale, i >= MAX_CONSECUTIVE_FAILURES, `第 ${i} 次 12153 的 stale 判定`)
  }
  const staleRes = await call('GET', '/wb-auth')
  assert.equal(staleRes.json.stale, true, '连续第 3 次 12153 → 需要重新扫码登录')
  assert.ok(staleRes.json.lastError.includes(String(SESSION_DEAD_CODE)), `lastError 要写明 12153：${staleRes.json.lastError}`)

  // 注销 / 重新登录 → 健康档清空（stale 立即解除）
  await call('POST', '/wb-auth/logout')
  const loggedOut = await call('GET', '/wb-auth')
  assert.equal(loggedOut.json.configured, false)
  assert.equal(loggedOut.json.stale, false)
  assert.equal(loggedOut.json.lastError, '')
  assert.equal(loggedOut.json.keepalive.consecutiveFailures, 0)
  assert.equal(existsSync(join(hostState, AUTH_HEALTH_FILE)), false, '注销后不该残留失效状态')

  // keepalive:false：定时器完全不跑（test-summon.mjs 用真实 storeRoot，靠这个开关避免
  // 测试去消耗用户真实 refresh_token）
  const offRoot = mkTmp('wbh-keepalive-off-')
  const offState = join(offRoot, '.meta', 'state')
  mkdirSync(offState, { recursive: true })
  saveAuth(offState, { access_token: 'x', refresh_token: 'y', expires_in: 3600, obtainedAt: Date.now() - 7200 * 1000 })
  const offCtx = { ...ctx, effect: fn => { const d = fn(); disposers.push(typeof d === 'function' ? d : () => {}); return d }, webServer: { register: () => () => {} } }
  apply(offCtx, { storeRoot: offRoot, keepalive: false })
  await sleep(80)
  assert.equal(existsSync(join(offState, AUTH_HEALTH_FILE)), false, 'keepalive:false 时定时器不得巡检')

  for (const d of disposers.reverse()) { try { d() } catch { /* 清理失败不影响断言 */ } }

  console.log('keepalive: threshold boundaries, 3-strike session-dead, refreshIfNeeded and host /wb-auth: OK')
} finally {
  globalThis.fetch = realFetch
  for (const dir of tempDirs) { try { rmSync(dir, { recursive: true, force: true }) } catch { /* 忽略 */ } }
}
