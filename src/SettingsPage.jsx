import React, { useEffect, useState, useCallback, useRef } from 'react'
import { hub, refreshAuth, onAuthChange, STALE_LOGIN_REASON } from './hub.js'
import { WbIcon } from './icons.js'
import WbAuthCard from './WbAuthCard.jsx'

/**
 * 卸载结果 → 给用户看的一句话（纯函数）。
 * 失败必须带上宿主返回的原因（未安装 404 / 连接器停用失败 / 删除文件失败…），
 * 绝不静默：这是「点了移除但什么都没发生」这类缺陷的根源。
 */
export function uninstallNotice(kind, label, result) {
  if (!result || result.ok !== true) {
    const reason = String(result?.error || result?.message || '宿主未返回原因')
    const status = result?.status ? `（HTTP ${result.status}）` : ''
    return { ok: false, text: `移除「${label}」失败：${reason}${status}` }
  }
  if (kind === 'connector') return { ok: true, text: `已移除连接器「${label}」（已先停用再删除）` }
  if (kind === 'expert') return { ok: true, text: `已移除专家「${label}」，并已从会话中移除挂载` }
  return { ok: true, text: `已移除技能「${label}」` }
}

/** 二次确认行里那句「顺带做了什么」的说明（危险动作必须说清楚影响面）。 */
function removeHint(kind) {
  if (kind === 'connector') return '先停用再删除'
  if (kind === 'expert') return '并从会话中移除'
  return '并解除技能链接'
}

/**
 * 单条已安装记录。空闲态右侧是次要样式的「移除」；点它进入**行内**二次确认
 * （不使用 window.confirm）：`确认移除？[移除][取消]`，两态都由 aria-label 指明条目。
 * 键盘：进入确认态即把焦点放到「移除」上（Enter 原生激活 = 确认，Escape = 取消）。
 * 抽成独立组件是为了让它两种状态都能被真实渲染测试覆盖。
 */
export function InstalledRow({ entry, confirming, busy, confirmRef, onAskRemove, onCancel, onConfirm }) {
  const label = entry.record.displayName || entry.name
  return (
    <div className="wbh-row wbh-installedRow">
      <span className="wbh-installedName">{label}
        <span className="wbh-muted"> · {entry.kind}</span>
      </span>
      <span className="wbh-installedActions">
        <span className="wbh-muted">
          {entry.record.files || 0} 文件
          {entry.record.mcp ? ' · MCP' : ''}
          {entry.record.source === 'official' ? ' · 官方' : ''}
        </span>
        {confirming ? (
          <span
            className="wbh-confirmRow"
            role="group"
            aria-label={`确认移除 ${label}`}
            onKeyDown={event => {
              // Escape 取消（Enter 由「移除」按钮原生激活，进确认态即自动聚焦它）
              if (event.key === 'Escape') { event.preventDefault(); onCancel() }
            }}
          >
            <span className="wbh-confirmText">确认移除？<span className="wbh-muted">（{removeHint(entry.kind)}）</span></span>
            <button
              ref={confirmRef}
              type="button"
              className="wbh-btnDanger"
              disabled={busy}
              aria-label={`确认移除 ${label}`}
              onClick={onConfirm}
            >{busy ? '移除中…' : '移除'}</button>
            <button
              type="button"
              className="wbh-btnGhost"
              disabled={busy}
              aria-label={`取消移除 ${label}`}
              onClick={onCancel}
            >取消</button>
          </span>
        ) : (
          <button
            type="button"
            className="wbh-btnGhost wbh-removeBtn"
            disabled={busy}
            aria-label={`移除 ${label}`}
            onClick={onAskRemove}
          >{busy ? '移除中…' : '移除'}</button>
        )}
      </span>
    </div>
  )
}

/** Settings section: official account state + installed entries. */
export default function SettingsPage() {
  const [auth, setAuth] = useState(null)
  const [installed, setInstalled] = useState({})
  const [showAuth, setShowAuth] = useState(false)
  // 行内二次确认：同一时刻只允许一行处于确认态（'' = 没有）
  const [confirmKey, setConfirmKey] = useState('')
  const [busyKey, setBusyKey] = useState('')
  const [notice, setNotice] = useState(null)
  const confirmRef = useRef(null)

  const refresh = useCallback(async () => {
    try { setAuth(await refreshAuth()) } catch { setAuth({ configured: false }) }
    try { setInstalled(await hub.installed()) } catch { /* ignore */ }
  }, [])
  useEffect(() => { void refresh() }, [refresh])
  // 登录态 store：在别的界面（市场页/picker/连接器页）登录或注销后，设置区同步反映
  useEffect(() => onAuthChange(setAuth), [])
  // 进入确认态就把焦点放到「移除」上：Enter 直接确认、Escape 取消（键盘可达）
  useEffect(() => { if (confirmKey) confirmRef.current?.focus?.() }, [confirmKey])

  const loggedIn = auth?.configured === true
  // 已登录但凭证彻底失效（连续保活刷新失败 / 官方 12153 达阈值）→ 显示重新登录
  const stale = loggedIn && auth?.stale === true
  // 以 registry 的键 `${kind}/${name}` 为准：它才是宿主的卸载主键
  // （官方技能的 record.name 是包目录名，可能和安装时用的名字不同，用错会 404）
  const entries = Object.entries(installed).map(([key, record]) => {
    const slash = key.indexOf('/')
    return {
      key,
      kind: slash > 0 ? key.slice(0, slash) : (record?.kind || ''),
      name: slash > 0 ? key.slice(slash + 1) : (record?.name || ''),
      record: record || {},
    }
  })

  const remove = useCallback(async entry => {
    const label = entry.record.displayName || entry.name
    setBusyKey(entry.key)
    setNotice(null)
    let result = { ok: true }
    try {
      await hub.uninstall(entry.kind, entry.name)
    } catch (error) {
      result = { ok: false, error: String(error?.message || error), status: error?.status }
    }
    setNotice(uninstallNotice(entry.kind, label, result))
    setBusyKey('')
    setConfirmKey('')
    // hub.uninstall 内部已 _emitChange（市场页 / picker 跟着刷新）；本页清单要自己重读。
    try { setInstalled(await hub.installed()) } catch { /* 刷新失败保留旧列表 */ }
  }, [])

  return (
    <section className="wbh-settings">
      <h2 className="wbh-secTitle">腾讯账号（官方市场数据）</h2>
      <div className="wbh-row">
        <span className="wbh-authState">
          <i className={`wbh-dot${loggedIn && !stale ? '' : ' off'}`} />
          {stale
            ? `登录已失效${auth?.nickname ? ` · ${auth.nickname}` : ''} — ${auth?.lastError || STALE_LOGIN_REASON}`
            : (loggedIn
              ? `已登录${auth?.nickname ? ` · ${auth.nickname}` : ''}`
              : '未登录 — 官方专家/技能目录与用量数据需要登录')}
        </span>
        {loggedIn && !stale
          ? <button type="button" className="wbh-btnGhost" onClick={async () => { await hub.authLogout(); await refresh() }}>注销</button>
          : <button type="button" className="wbh-btnPrimary" onClick={() => setShowAuth(true)}>扫码登录</button>}
      </div>
      {loggedIn && !stale && auth?.expiresAt && (
        <div className="wbh-row">
          <span className="wbh-muted">授权到期：{new Date(auth.expiresAt).toLocaleString('zh-CN')}；token 到期前自动刷新（后台每 30 分钟巡检一次保活）</span>
        </div>
      )}
      {stale && (
        <div className="wbh-row">
          <span className="wbh-muted">
            后台保活已连续失败 {auth?.keepalive?.consecutiveFailures ?? 0} 次
            {auth?.keepalive?.lastCheckAt ? `（最后巡检 ${new Date(auth.keepalive.lastCheckAt).toLocaleString('zh-CN')}）` : ''}
            ；refresh_token 已失效，需要重新扫码登录。
          </span>
        </div>
      )}

      <h2 className="wbh-secTitle" style={{ marginTop: 22 }}>已安装（{entries.length}）</h2>
      {notice && (
        <p className={`wbh-removeNotice${notice.ok ? '' : ' is-error'}`} role={notice.ok ? 'status' : 'alert'} aria-live="polite">
          {notice.text}
        </p>
      )}
      {entries.length === 0 && <div className="wbh-state"><p>在输入框「＋」或左侧入口浏览市场。</p></div>}
      {entries.map(entry => (
        <InstalledRow
          key={entry.key}
          entry={entry}
          confirming={confirmKey === entry.key}
          busy={busyKey === entry.key}
          confirmRef={confirmRef}
          onAskRemove={() => { setNotice(null); setConfirmKey(entry.key) }}
          onCancel={() => setConfirmKey('')}
          onConfirm={() => void remove(entry)}
        />
      ))}

      <p className="wbh-muted" style={{ marginTop: 16 }}>
        需要 OAuth 或 API Key 的连接器会在启用时发起独立授权；本页与浏览器端不会展示任何凭据值。
        移除连接器会先停用（拆掉 MCP 传输）再删文件；移除专家会一并摘掉各会话里的挂载。
      </p>
      {showAuth && <WbAuthCard reason={stale ? STALE_LOGIN_REASON : ''} onClose={() => { setShowAuth(false); void refresh() }} />}
    </section>
  )
}
