import React, { useState, useEffect, useRef, useCallback } from 'react'
import QRCode from 'qrcode'

/** 添加腾讯账号 — workbuddy2api-style device-login card. Single account. */
export default function WbAuthCard({ onClose, onDone, hub }) {
  const [phase, setPhase] = useState('starting') // starting | waiting | done | error
  const [authUrl, setAuthUrl] = useState('')
  const [qr, setQr] = useState('')
  const [error, setError] = useState('')
  const [nickname, setNickname] = useState('')
  const timer = useRef(null)
  const stopped = useRef(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const start = await hub.post('/wb-auth/start', {})
        if (cancelled) return
        setAuthUrl(start.authUrl)
        setQr(await QRCode.toDataURL(start.authUrl, { width: 320, margin: 1 }))
        setPhase('waiting')
        // poll until the browser login completes
        const tick = async () => {
          if (cancelled) return
          try {
            const r = await hub.post('/wb-auth/poll', {})
            if (cancelled) return
            if (r.ok) { setNickname(r.nickname || ''); setPhase('done'); onDone?.(); return }
          } catch (e) {
            if (e.body && e.body.pending === false) { if (!cancelled) { setError(e.message); setPhase('error') } return }
          }
          timer.current = setTimeout(tick, 2500)
        }
        timer.current = setTimeout(tick, 2000)
      } catch (e) {
        if (!cancelled) { setError(e.message); setPhase('error') }
      }
    })()
    return () => { cancelled = true; if (timer.current) clearTimeout(timer.current) }
  }, [])

  const copy = useCallback(async () => {
    try { await navigator.clipboard.writeText(authUrl) } catch { /* clipboard denied */ }
  }, [authUrl])

  return (
    <div className="wbh-modalRoot" role="dialog" aria-modal="true" aria-label="添加腾讯账号">
      <div className="wbh-modalScrim" onClick={onClose} />
      <div className="wbh-authCard">
        <div className="wbh-authHead">
          <h3 className="wbh-authTitle">添加腾讯账号 · 国内版</h3>
          <button type="button" className="wbh-authClose" onClick={onClose} aria-label="关闭">✕</button>
        </div>
        <p className="wbh-authDesc">
          点开下方链接（或用微信 / QQ 扫码）在浏览器里完成授权，页面支持手机号登录；成功后会自动签到并纳管
        </p>
        {phase === 'starting' && <div className="wbh-authWaiting">正在向官方发起授权…</div>}
        {phase === 'waiting' && (
          <>
            <div className="wbh-authQr">{qr && <img src={qr} alt="授权二维码" width={320} height={320} />}</div>
            <button type="button" className="wbh-authLink" onClick={() => window.open(authUrl, '_blank', 'noopener')}>
              ↗ {authUrl.slice(0, 72)}…
            </button>
            <button type="button" className="wbh-authCopy" onClick={copy}>⧉ 复制链接</button>
            <div className="wbh-authWaiting">◌ 等待授权完成（打开链接在浏览器里登录，或扫码；手机号登录也可以）…</div>
            <button type="button" className="wbh-btnGhost wbh-authCancel" onClick={onClose}>取消</button>
          </>
        )}
        {phase === 'done' && (
          <div className="wbh-authDone">
            <p>已登录{nickname ? `：${nickname}` : ''}。官方市场数据已可用。</p>
            <button type="button" className="wbh-btnPrimary" onClick={onClose}>完成</button>
          </div>
        )}
        {phase === 'error' && (
          <div className="wbh-authDone">
            <p className="wbh-authError">授权失败：{error}</p>
            <button type="button" className="wbh-btnPrimary" onClick={onClose}>关闭</button>
          </div>
        )}
      </div>
    </div>
  )
}
