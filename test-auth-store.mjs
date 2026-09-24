/**
 * 登录态 store + 动作级 JIT 登录门（requireAuth）的纯逻辑测试。
 *
 * 覆盖：
 *  1) authState / refreshAuth / onAuthChange 的订阅与通知（含取消订阅、失败退化）
 *  2) requireAuth 的 resolve / reject 语义（认领、取消、已被登录、无人认领、被新请求取代）
 *  3) auth-flow 状态机（waiting / expired / error / done）与 poll 结果归一
 */
import assert from 'node:assert/strict'
import {
  authState, refreshAuth, onAuthChange,
  requireAuth, onAuthRequired, claimAuthGate, settleAuthGate, authGatePending,
} from './src/hub.js'
import {
  initialAuthFlow, reduceAuthFlow, pollEvent, qrDeadline, remainingMs, formatCountdown,
  LOCAL_QR_TTL_MS,
} from './src/auth-flow.js'

// ---- 1) 登录态 store -------------------------------------------------------
const realFetch = globalThis.fetch
let authBody = { configured: false }
let authCalls = 0
globalThis.fetch = async url => {
  if (String(url).includes('/wb-auth')) {
    authCalls += 1
    return { ok: true, json: async () => authBody }
  }
  throw new Error(`unexpected fetch: ${url}`)
}

try {
  assert.equal(authState(), null, '未拉取过时缓存必须是 null（界面据此显示「正在读取登录状态」）')

  const seen = []
  const off = onAuthChange(value => seen.push(value))

  authBody = { configured: true, nickname: '演示用户', uid: 'u-1', expiresAt: 123 }
  const first = await refreshAuth()
  assert.equal(first.configured, true)
  assert.equal(authCalls, 1, 'refreshAuth 必须真的重新拉一次 /wb-auth')
  assert.equal(seen.length, 1, 'refreshAuth 必须通知订阅者')
  assert.equal(seen[0].nickname, '演示用户')
  assert.equal(authState().uid, 'u-1', 'authState 返回缓存值')

  authBody = { configured: false }
  await refreshAuth()
  assert.equal(seen.length, 2)
  assert.equal(authState().configured, false)

  off()
  await refreshAuth()
  assert.equal(seen.length, 2, '取消订阅后不再收到通知')

  // 拉取失败 → 退化为未登录（而不是抛错）
  globalThis.fetch = async () => ({ ok: false, status: 502, json: async () => ({ error: 'boom' }) })
  const failed = await refreshAuth()
  assert.equal(failed.configured, false, '拉取失败必须退化为未登录')
} finally {
  globalThis.fetch = realFetch
}

// ---- 2) requireAuth -------------------------------------------------------
const realFetch2 = globalThis.fetch
try {
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ configured: false }) })
  await refreshAuth()
  assert.equal(authState().configured, false)

  // 2a) 已登录 → 直接 resolve，不发「需要登录」事件
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ configured: true, nickname: 'n' }) })
  await refreshAuth()
  let events = 0
  const offNoop = onAuthRequired(() => { events += 1 })
  const done = await requireAuth({ reason: '已登录时不该弹卡' })
  assert.equal(done.configured, true)
  assert.equal(events, 0, '已登录时不能触发登录卡')
  offNoop()

  // 2b) 未登录 + 有界面认领 → 登录成功后 resolve，且只有第一个认领者拿到门
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ configured: false }) })
  await refreshAuth()
  const reasons = []
  const claimed = []
  // 先注册一个「市场页」订阅者，再注册一个「picker」订阅者；本次动作来自 picker
  const offA = onAuthRequired(info => { reasons.push(info.reason); const g = claimAuthGate('page'); if (g) claimed.push('page') })
  const offB = onAuthRequired(() => { const g = claimAuthGate('picker'); if (g) claimed.push('picker') })
  const waiting = requireAuth({ reason: '连接「演示连接器」需要 WorkBuddy 账号', surface: 'picker' })
  assert.deepEqual(claimed, ['picker'], 'surface 不匹配的界面不得认领（picker 发起的动作不能弹在市场页）')
  assert.equal(authGatePending()?.claimed, true)
  assert.deepEqual(reasons, ['连接「演示连接器」需要 WorkBuddy 账号'], 'reason 必须传给界面')
  // 登录成功：先把 store 刷成已登录，再结算登录门
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ configured: true, nickname: '登录后' }) })
  await refreshAuth()
  assert.equal(settleAuthGate(true), true, '结算成功应返回 true')
  const resolved = await waiting
  assert.equal(resolved.configured, true, '登录成功后 requireAuth 必须 resolve 成已登录态')
  assert.equal(authGatePending(), null, '结算后不应残留登录门')
  assert.equal(settleAuthGate(true), false, '没有未决登录门时结算返回 false（重复结算无害）')
  offA(); offB()

  // 2b-2) 没有匹配的界面时门保持未认领 → 走「无人认领」的明确失败（不挂起）
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ configured: false }) })
  await refreshAuth()
  const offPage = onAuthRequired(() => { claimAuthGate('page') })
  await assert.rejects(() => requireAuth({ reason: '来自 picker', surface: 'picker' }), /无法显示登录入口/)
  offPage()

  // 2c) 用户取消 → reject
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ configured: false }) })
  await refreshAuth()
  const offC = onAuthRequired(() => { claimAuthGate() })
  const cancelled = requireAuth({ reason: '取消场景' })
  assert.equal(settleAuthGate(false), true)
  await assert.rejects(() => cancelled, /用户取消了登录/, '取消登录必须 reject')
  offC()

  // 2d) 没有任何界面能显示登录卡 → 立刻 reject（绝不挂起调用方）
  const orphan = requireAuth({ reason: '无人认领' })
  await assert.rejects(() => orphan, /无法显示登录入口/, '无人认领时必须明确报错')
  assert.equal(authGatePending(), null, '无人认领后不能残留登录门')

  // 2e) 新动作取代旧动作：旧请求 reject，新请求可正常结算
  const offD = onAuthRequired(() => { claimAuthGate() })
  const oldOne = requireAuth({ reason: '旧动作' })
  const newOne = requireAuth({ reason: '新动作' })
  await assert.rejects(() => oldOne, /取代/, '被新请求取代的旧登录门必须 reject')
  assert.equal(settleAuthGate(true), true)
  await newOne
  offD()
} finally {
  globalThis.fetch = realFetch2
}

// ---- 3) 登录卡状态机（auth-flow）-------------------------------------------
let s = initialAuthFlow()
assert.equal(s.phase, 'starting')
s = reduceAuthFlow(s, { type: 'started', authUrl: 'https://example.invalid/x', qr: 'data:image/png;base64,AA', deadline: qrDeadline(0) })
assert.equal(s.phase, 'waiting')
assert.equal(s.authUrl, 'https://example.invalid/x')

// 倒计时未到点 → 保持 waiting
s = reduceAuthFlow(s, { type: 'tick', remaining: 1000 })
assert.equal(s.phase, 'waiting', '倒计时未到点不能过期')
// 到点 → expired（本地估算；官方未下发 TTL）
s = reduceAuthFlow(s, { type: 'tick', remaining: 0 })
assert.equal(s.phase, 'expired', '倒计时到点 → 二维码已过期')
// 过期后一键刷新 → 重新 starting → waiting
s = reduceAuthFlow(s, { type: 'start' })
assert.equal(s.phase, 'starting')
s = reduceAuthFlow(s, { type: 'started', authUrl: 'https://example.invalid/y', qr: 'q', deadline: qrDeadline(0) })
assert.equal(s.phase, 'waiting')
// 成功
s = reduceAuthFlow(s, { type: 'polled', nickname: '昵称' })
assert.equal(s.phase, 'done')
assert.equal(s.nickname, '昵称')
assert.equal(reduceAuthFlow(s, { type: 'pollFailed', error: 'late' }).phase, 'done', '终态不可被 poll 覆盖')

// 失败 + 重试
let f = reduceAuthFlow(initialAuthFlow(), { type: 'startFailed', error: 'HTTP 502' })
assert.equal(f.phase, 'error')
assert.equal(f.error, 'HTTP 502')
f = reduceAuthFlow(f, { type: 'start' })
assert.equal(f.phase, 'starting')
f = reduceAuthFlow(f, { type: 'started', authUrl: 'u', qr: 'q', deadline: qrDeadline(0) })
f = reduceAuthFlow(f, { type: 'pollFailed', error: 'no login in progress' })
assert.equal(f.phase, 'error', '明确失败 → error（可重试）')

// poll 结果归一：宿主 202 pending / 200 ok / 400 明确失败
assert.deepEqual(pollEvent(null, Object.assign(new Error('x'), { body: { pending: true } })), { type: 'pending' })
assert.equal(pollEvent({ ok: true, nickname: 'n' }, null).type, 'polled')
assert.equal(pollEvent(null, Object.assign(new Error('no login in progress'), { body: { pending: false } })).type, 'pollFailed')
assert.equal(reduceAuthFlow(initialAuthFlow(), { type: 'pending' }).phase, 'starting', 'pending 不改变状态')

// 倒计时工具
assert.equal(LOCAL_QR_TTL_MS, 180000, '本地二维码有效期是 180s（估算值，官方未下发）')
assert.equal(remainingMs(1000, 400), 600)
assert.equal(remainingMs(1000, 5000), 0, '剩余时间不为负')
assert.equal(formatCountdown(65000), '1:05')
assert.equal(formatCountdown(0), '0:00')

console.log('auth store + requireAuth + auth-flow state machine: OK')
