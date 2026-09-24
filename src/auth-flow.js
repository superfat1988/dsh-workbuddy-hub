/**
 * 登录卡（WbAuthCard）的纯状态机 —— 不依赖 React，便于单测。
 *
 * 官方 auth API 实测结论（2026-09 探测，见 wb-market.js 的 loginStart/loginPoll）：
 *  · POST /v2/plugin/auth/state?platform=CLI → data 里**只有** { state, authUrl }
 *  · GET  /v2/plugin/auth/token?state=…      → 未完成时 HTTP 200 + { code:11217, msg:'login ing...' }
 *  · 没有 /v2/plugin/auth/status|scan|query，也没有 expiresAt/expireTime/scanned 字段；
 *    甚至「state 不存在」也返回同一个 11217 —— 官方无法区分「等待扫码 / 已扫码待确认 / 已过期」。
 *
 * 因此状态机只有 4 态：waiting（等待扫码）/ expired（过期，本地倒计时估算）/ error（失败）/ done（成功）。
 * 「已扫码待确认」官方没有暴露，故不实现（不假装有）。
 */

/** 二维码本地有效期（估算值：官方未下发 TTL）。到点显示「二维码已过期」并允许一键刷新。 */
export const LOCAL_QR_TTL_MS = 180 * 1000

/** 轮询间隔（沿用原实现）。 */
export const POLL_INTERVAL_MS = 2500

/** 首次轮询延迟（给官方一点时间落 state）。 */
export const FIRST_POLL_DELAY_MS = 2000

/** 初始状态。 */
export function initialAuthFlow() {
  return { phase: 'starting', authUrl: '', qr: '', error: '', nickname: '', deadline: 0 }
}

/** 二维码到期时间（本地估算）。 */
export function qrDeadline(now = Date.now()) { return now + LOCAL_QR_TTL_MS }

/** 剩余毫秒（永不为负）。 */
export function remainingMs(deadline, now = Date.now()) {
  if (!deadline) return 0
  return Math.max(0, deadline - now)
}

/** 倒计时文案 mm:ss。 */
export function formatCountdown(ms) {
  const total = Math.max(0, Math.ceil((ms || 0) / 1000))
  const mm = Math.floor(total / 60)
  const ss = String(total % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

/**
 * 状态迁移（纯函数）。
 * 事件：
 *  · { type:'start' }                        重新发起（刷新二维码/重试）
 *  · { type:'started', authUrl, qr, deadline } start 成功
 *  · { type:'startFailed', error }            start 失败
 *  · { type:'tick', remaining }               倒计时（waiting 且剩余为 0 → expired）
 *  · { type:'polled', nickname }              poll 成功（waiting → done）
 *  · { type:'pollFailed', error }             poll 明确失败（waiting → error）
 */
export function reduceAuthFlow(state, event) {
  const base = state || initialAuthFlow()
  switch (event?.type) {
    case 'start':
      return { ...base, phase: 'starting', error: '', nickname: '', deadline: 0 }
    case 'started':
      return {
        ...base, phase: 'waiting', authUrl: event.authUrl || '',
        qr: event.qr || '', error: '', deadline: event.deadline || 0,
      }
    case 'startFailed':
      return { ...base, phase: 'error', error: String(event.error || '发起授权失败'), deadline: 0 }
    case 'tick':
      if (base.phase !== 'waiting') return base
      return event.remaining > 0 ? base : { ...base, phase: 'expired' }
    case 'polled':
      if (base.phase !== 'waiting') return base
      return { ...base, phase: 'done', nickname: event.nickname || '', deadline: 0 }
    case 'pollFailed':
      if (base.phase !== 'waiting') return base
      return { ...base, phase: 'error', error: String(event.error || '授权失败'), deadline: 0 }
    default:
      return base
  }
}

/**
 * 把宿主 POST /wb-auth/poll 的结果/异常归一成状态机事件。
 * 宿主契约：202 + { pending:true } = 还没登录完成；200 + { ok:true } = 成功；
 * 其它 = 明确失败（含 400「no login in progress」= state 已被消费/失效）。
 */
export function pollEvent(response, error) {
  if (error) {
    if (error.body?.pending === true) return { type: 'pending' }
    return { type: 'pollFailed', error: String(error.message || error) }
  }
  if (response?.ok) return { type: 'polled', nickname: response.nickname || '' }
  if (response?.pending) return { type: 'pending' }
  return { type: 'pollFailed', error: '授权失败：官方未返回登录结果' }
}
