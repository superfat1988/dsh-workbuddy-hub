/**
 * 账号保活（keepalive）与「会话失效」判定的**纯逻辑** —— 不依赖 DSH、不依赖网络、
 * 不做文件 IO，便于单测（与 src/auth-flow.js 同一思路）。
 *
 * 规则来源（上游 workbuddy2api 的两个实现，照此复刻）：
 *  · ardeyouxipianyi/workbuddy2api-hub · wb_scheduler.py
 *    「Token 保活 (Keepalive)：定期检查 Token 剩余寿命，不足 2 小时自动调用 Refresh Token。」
 *    实现要点：算出凭证到期时间 exp；exp 存在且 (exp - now) < 7200 秒时主动 refresh；
 *    成功计数、失败记录 last_error；巡检由后台调度器按整点触发，并用运行锁防重入。
 *  · linguo2625469/workbuddy2api-panel · internal/pool/sessiondead_test.go
 *    官方错误码 12153 = session 失效（session dead）。判定规则：**连续**出现 12153 时，
 *    第 1 次、第 2 次都**不**判失效（误判防护），**连续第 3 次**才判失效并清零计数；
 *    中间成功一次即清零计数。
 *
 * 本模块只放常量与纯函数；文件读写（凭证 / 健康档）在 wb-market.js，调度在 index.js。
 */

/** 主动保活阈值：剩余寿命不足 2 小时就刷新（上游 wb_scheduler.py 的 7200 秒）。 */
export const KEEPALIVE_THRESHOLD_MS = 2 * 3600 * 1000

/** 连续失败达到多少次判「会话失效」（上游 sessiondead_test.go：连续第 3 次才判）。 */
export const MAX_CONSECUTIVE_FAILURES = 3

/** 官方错误码：session 失效 —— 登录态彻底过期，需要用户重新扫码。 */
export const SESSION_DEAD_CODE = 12153

/** 健康档初始值（与落盘 JSON 的字段一一对应）。 */
export function initialHealth() {
  return { consecutiveFailures: 0, lastError: '', lastCheckAt: 0, staleAt: null }
}

/** 把任意（含残缺 / 脏）健康档归一成完整形状，避免脏文件把判定带偏。 */
export function normalizeHealth(health) {
  const raw = health && typeof health === 'object' ? health : {}
  const failures = Number(raw.consecutiveFailures)
  const lastCheckAt = Number(raw.lastCheckAt)
  const staleAt = Number(raw.staleAt)
  return {
    consecutiveFailures: Number.isFinite(failures) && failures > 0 ? Math.floor(failures) : 0,
    lastError: typeof raw.lastError === 'string' ? raw.lastError : '',
    lastCheckAt: Number.isFinite(lastCheckAt) && lastCheckAt > 0 ? lastCheckAt : 0,
    staleAt: Number.isFinite(staleAt) && staleAt > 0 ? staleAt : null,
  }
}

/**
 * 凭证到期时间（毫秒）：obtainedAt + expires_in*1000。
 * 与宿主 GET /wb-auth 的 expiresAt 算法一致（缺 expires_in 时按 3600s 兜底，同旧实现）。
 */
export function expiresAtOf(auth) {
  if (!auth) return 0
  const obtainedAt = Number(auth.obtainedAt) || 0
  const expiresIn = Number(auth.expires_in)
  const ttl = Number.isFinite(expiresIn) && expiresIn > 0 ? expiresIn : 3600
  return obtainedAt + ttl * 1000
}

/**
 * 是否该主动刷新：剩余寿命 < 阈值（阈值边界取**严格小于**：刚好 2 小时不刷，
 * 差 1 毫秒就刷）。没有可用到期时间时保守刷新（宁可多刷一次，也不要放任过期）。
 */
export function shouldRefresh(expiresAt, now = Date.now(), thresholdMs = KEEPALIVE_THRESHOLD_MS) {
  const exp = Number(expiresAt)
  if (!Number.isFinite(exp) || exp <= 0) return true
  return exp - now < thresholdMs
}

/** 是否已判「会话失效」（连续失败达到阈值）。 */
export function isStale(health) {
  return normalizeHealth(health).consecutiveFailures >= MAX_CONSECUTIVE_FAILURES
}

/** 事件归一：接受 'refresh-ok' 这样的字符串，或 { type, at, error } 对象。 */
function normalizeEvent(event) {
  if (typeof event === 'string') return { type: event, at: undefined, error: '' }
  const raw = event && typeof event === 'object' ? event : {}
  return { type: raw.type, at: raw.at, error: raw.error == null ? '' : String(raw.error) }
}

/**
 * 应用一次保活事件（纯函数）：
 *  · 'refresh-ok'   成功一次即清零（含 lastError / staleAt）；
 *  · 'refresh-fail' 连续失败 +1，**达到 MAX_CONSECUTIVE_FAILURES 才 stale**（第 1、2 次不判）；
 *  · 'session-dead' 官方 12153，与 refresh-fail **共用同一计数器**（混着来也照样累计）。
 * @param {object} health 现有健康档
 * @param {string|{type:string,at?:number,error?:string}} event
 * @returns {{consecutiveFailures:number,lastError:string,lastCheckAt:number,staleAt:number|null}}
 */
export function reduceHealth(health, event) {
  const base = normalizeHealth(health)
  const { type, at, error } = normalizeEvent(event)
  const atMs = Number(at)
  const checkAt = Number.isFinite(atMs) && atMs > 0 ? atMs : base.lastCheckAt

  if (type === 'refresh-ok') {
    return { consecutiveFailures: 0, lastError: '', lastCheckAt: checkAt, staleAt: null }
  }
  if (type !== 'refresh-fail' && type !== 'session-dead') return base

  const consecutiveFailures = base.consecutiveFailures + 1
  const stale = consecutiveFailures >= MAX_CONSECUTIVE_FAILURES
  const fallback = type === 'session-dead' ? `官方返回 ${SESSION_DEAD_CODE}（session 失效）` : ''
  return {
    consecutiveFailures,
    lastError: error || base.lastError || fallback,
    lastCheckAt: checkAt,
    // staleAt 只在**首次**判失效时落一次（重试期间不刷新它，方便排障看「什么时候开始失效的」）
    staleAt: stale ? (base.staleAt ?? checkAt ?? null) : base.staleAt,
  }
}

/**
 * 只更新巡检时间：未到阈值、没有真正发起刷新时用 —— 既不算成功也不算失败，
 * 失败计数保持不动（不能因为「这次没刷」就把之前真实的失败抹掉）。
 */
export function touchCheck(health, at = Date.now()) {
  return { ...normalizeHealth(health), lastCheckAt: Number(at) || 0 }
}
