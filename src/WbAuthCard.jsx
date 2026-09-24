import React, { useState, useEffect, useRef, useCallback } from 'react'
import QRCode from 'qrcode'
import { hub, refreshAuth, settleAuthGate } from './hub.js'
import {
  initialAuthFlow, reduceAuthFlow, pollEvent, qrDeadline, remainingMs, formatCountdown,
  POLL_INTERVAL_MS, FIRST_POLL_DELAY_MS,
} from './auth-flow.js'

/**
 * 腾讯账号登录卡（唯一登录方式：官方 OAuth 设备码 / 二维码）。
 *
 * 同一个组件支持两种形态（不复制两份）：
 *  · variant="modal"  弹窗（遮罩 + 可关闭）—— 市场页账号胶囊、picker footer、设置区用
 *  · variant="inline" 就地卡片（无遮罩、不可关闭）—— 连接器页未登录时直接嵌在页面里
 *
 * 状态机见 auth-flow.js（waiting / expired / error / done 四态）。
 * 「已扫码待确认」官方 API 未暴露（探测结论见 auth-flow.js 顶部注释），故不实现。
 */
export default function WbAuthCard({ variant = 'modal', onClose, onDone, reason = '', title = '添加腾讯账号 · 国内版' }) {
  const inline = variant === 'inline'
  const [flow, setFlow] = useState(() => initialAuthFlow())
  const [remaining, setRemaining] = useState(0)
  const timer = useRef(null)
  const ticker = useRef(null)
  const stopped = useRef(false)
  const deadlineRef = useRef(0)
  // onDone 用 ref 持有：父组件每次渲染都会换函数身份，直接进依赖数组会不断重启轮询
  const onDoneRef = useRef(onDone)
  useEffect(() => { onDoneRef.current = onDone }, [onDone])

  const start = useCallback(async () => {
    stopped.current = false
    setFlow(prev => reduceAuthFlow(prev, { type: 'start' }))
    setRemaining(0)
    try {
      const res = await hub.post('/wb-auth/start', {})
      if (stopped.current) return
      const url = res.authUrl || ''
      const qr = url ? await QRCode.toDataURL(url, { width: 320, margin: 1 }) : ''
      if (stopped.current) return
      const deadline = qrDeadline()
      deadlineRef.current = deadline
      setRemaining(remainingMs(deadline))
      setFlow(prev => reduceAuthFlow(prev, { type: 'started', authUrl: url, qr, deadline }))
    } catch (error) {
      if (!stopped.current) setFlow(prev => reduceAuthFlow(prev, { type: 'startFailed', error: String(error?.message || error) }))
    }
  }, [])

  useEffect(() => {
    stopped.current = false
    void start()
    return () => {
      stopped.current = true
      if (timer.current) clearTimeout(timer.current)
      if (ticker.current) clearInterval(ticker.current)
    }
  }, [start])

  // 倒计时：官方未下发二维码 TTL，这里用本地估算；到点 → expired（一键刷新重新 start）
  useEffect(() => {
    if (flow.phase !== 'waiting') return undefined
    setRemaining(remainingMs(deadlineRef.current))
    ticker.current = setInterval(() => {
      const left = remainingMs(deadlineRef.current)
      setRemaining(left)
      setFlow(prev => reduceAuthFlow(prev, { type: 'tick', remaining: left }))
    }, 1000)
    return () => { if (ticker.current) clearInterval(ticker.current) }
  }, [flow.phase])

  // 轮询：只在 waiting 期间跑（expired/error/done 都会停）
  useEffect(() => {
    if (flow.phase !== 'waiting') return undefined
    let cancelled = false
    const tick = async () => {
      if (cancelled) return
      let response = null
      let error = null
      try {
        response = await hub.post('/wb-auth/poll', {})
      } catch (e) { error = e }
      if (cancelled) return
      const event = pollEvent(response, error)
      if (event.type === 'pending') { timer.current = setTimeout(tick, POLL_INTERVAL_MS); return }
      if (event.type === 'polled') {
        await refreshAuth()
        if (cancelled) return
        setFlow(prev => reduceAuthFlow(prev, event))
        // 登录成功 → 结算可能存在的「动作级 JIT 登录门」，被拦下的动作据此自动继续
        // （用户是在设置区/胶囊里登录的也算：登录成功了，等着的动作就该继续）
        settleAuthGate(true)
        onDoneRef.current?.()
        return
      }
      setFlow(prev => reduceAuthFlow(prev, event))
    }
    timer.current = setTimeout(tick, FIRST_POLL_DELAY_MS)
    return () => { cancelled = true; if (timer.current) clearTimeout(timer.current) }
  }, [flow.phase])

  const copy = useCallback(async () => {
    try { await navigator.clipboard.writeText(flow.authUrl) } catch { /* 剪贴板被拒时忽略 */ }
  }, [flow.authUrl])

  const body = (
    <>
      <div className="wbh-authHead">
        <h3 className="wbh-authTitle">{title}</h3>
        {!inline && (
          <button type="button" className="wbh-authClose" onClick={onClose} aria-label="关闭">✕</button>
        )}
      </div>
      {reason ? <p className="wbh-authReason">{reason}</p> : null}
      <p className="wbh-authDesc">
        点开下方链接（或用微信 / QQ 扫码）在浏览器里完成授权，页面支持手机号登录；成功后会自动签到并纳管
      </p>

      {flow.phase === 'starting' && <div className="wbh-authWaiting">正在向官方发起授权…</div>}

      {flow.phase === 'waiting' && (
        <>
          <div className="wbh-authQr">{flow.qr && <img src={flow.qr} alt="授权二维码" width={320} height={320} />}</div>
          <button type="button" className="wbh-authLink" onClick={() => window.open(flow.authUrl, '_blank', 'noopener')}>
            ↗ {flow.authUrl.slice(0, 72)}…
          </button>
          <button type="button" className="wbh-authCopy" onClick={copy}>⧉ 复制链接</button>
          <div className="wbh-authWaiting">
            ◌ 等待扫码（{formatCountdown(remaining)}）· 打开链接在浏览器里登录，或扫码；手机号登录也可以
          </div>
          {!inline && <button type="button" className="wbh-btnGhost wbh-authCancel" onClick={onClose}>取消</button>}
        </>
      )}

      {flow.phase === 'expired' && (
        <div className="wbh-authDone">
          <p className="wbh-authExpired">二维码已过期（本地倒计时到点；官方未下发有效期，这是估算）</p>
          <button type="button" className="wbh-btnPrimary" onClick={() => void start()}>刷新二维码</button>
          {/* 无手机/无相机的兜底入口在过期态也保留：官方 state 可能仍然有效 */}
          {flow.authUrl && (
            <>
              <button type="button" className="wbh-authLink wbh-authLink--block" onClick={() => window.open(flow.authUrl, '_blank', 'noopener')}>
                ↗ 打开授权链接（可能仍有效）
              </button>
              <button type="button" className="wbh-authCopy" onClick={copy}>⧉ 复制链接</button>
            </>
          )}
          {!inline && <button type="button" className="wbh-btnGhost wbh-authCancel" onClick={onClose}>取消</button>}
        </div>
      )}

      {flow.phase === 'done' && (
        <div className="wbh-authDone">
          <p>已登录{flow.nickname ? `：${flow.nickname}` : ''}。官方市场数据已可用。</p>
          {inline
            ? <p className="wbh-muted">正在加载连接器目录…</p>
            : <button type="button" className="wbh-btnPrimary" onClick={onClose}>完成</button>}
        </div>
      )}

      {flow.phase === 'error' && (
        <div className="wbh-authDone">
          <p className="wbh-authError">授权失败：{flow.error}</p>
          <button type="button" className="wbh-btnPrimary" onClick={() => void start()}>重试</button>
          {!inline && <button type="button" className="wbh-btnGhost wbh-authCancel" onClick={onClose}>关闭</button>}
        </div>
      )}
    </>
  )

  // inline：就地渲染，无遮罩、无关闭按钮（连接器页未登录态直接嵌在页面里）
  if (inline) return <div className="wbh-authCard wbh-authCard--inline" aria-label="登录 WorkBuddy 账号">{body}</div>

  return (
    <div className="wbh-modalRoot" role="dialog" aria-modal="true" aria-label="添加腾讯账号">
      <div className="wbh-modalScrim" onClick={onClose} />
      <div className="wbh-authCard">{body}</div>
    </div>
  )
}
