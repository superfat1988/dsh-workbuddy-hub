import React, { useEffect, useState, useCallback } from 'react'
import { hub, refreshAuth, onAuthChange, STALE_LOGIN_REASON } from './hub.js'
import { WbIcon } from './icons.js'
import WbAuthCard from './WbAuthCard.jsx'

/** Settings section: official account state + installed entries. */
export default function SettingsPage() {
  const [auth, setAuth] = useState(null)
  const [installed, setInstalled] = useState({})
  const [showAuth, setShowAuth] = useState(false)

  const refresh = useCallback(async () => {
    try { setAuth(await refreshAuth()) } catch { setAuth({ configured: false }) }
    try { setInstalled(await hub.installed()) } catch { /* ignore */ }
  }, [])
  useEffect(() => { void refresh() }, [refresh])
  // 登录态 store：在别的界面（市场页/picker/连接器页）登录或注销后，设置区同步反映
  useEffect(() => onAuthChange(setAuth), [])

  const loggedIn = auth?.configured === true
  // 已登录但凭证彻底失效（连续保活刷新失败 / 官方 12153 达阈值）→ 显示重新登录
  const stale = loggedIn && auth?.stale === true
  const entries = Object.values(installed)

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
      {entries.length === 0 && <div className="wbh-state"><p>在输入框「＋」或左侧入口浏览市场。</p></div>}
      {entries.map(entry => (
        <div className="wbh-row" key={`${entry.kind}/${entry.name}`}>
          <span>{entry.displayName || entry.name}
            <span className="wbh-muted"> · {entry.kind}</span>
          </span>
          <span className="wbh-muted">
            {entry.files || 0} 文件
            {entry.mcp ? ' · MCP' : ''}
            {entry.source === 'official' ? ' · 官方' : ''}
          </span>
        </div>
      ))}

      <p className="wbh-muted" style={{ marginTop: 16 }}>
        需要 OAuth 或 API Key 的连接器会在启用时发起独立授权；本页与浏览器端不会展示任何凭据值。
      </p>
      {showAuth && <WbAuthCard reason={stale ? STALE_LOGIN_REASON : ''} onClose={() => { setShowAuth(false); void refresh() }} />}
    </section>
  )
}
