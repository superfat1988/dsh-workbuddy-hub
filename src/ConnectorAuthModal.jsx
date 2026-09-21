import React from 'react'
import { WbIcon } from './icons.js'

/** 连接器授权：需要凭证时给出步骤，必要时外跳授权页。 */
export default function ConnectorAuthModal({ entry, refs = [], error, authDomain = '', retryable = true, busy, onClose, onRetry }) {
  const domain = authDomain || entry?.cli?.authDomain || ''
  const authUrl = domain ? `https://${domain.replace(/^https?:\/\//, '')}` : ''
  return (
    <div className="ec-modal-overlay" role="dialog" aria-modal="true" aria-label={`连接 ${entry.displayName || entry.name}`}>
      <div className="ec-modal-card" style={{ opacity: 1 }}>
        <div className="ec-modal-top">
          <div className="ec-modal-avatar">
            {entry.icon
              ? <img src={entry.icon} alt="" />
              : <span className="ec-modal-avatar-fallback"><WbIcon name="link" size={22} /></span>}
          </div>
          <div className="ec-modal-info">
            <div className="ec-modal-title-row">
              <h3 className="ec-modal-role">连接 {entry.displayName || entry.name}</h3>
              <div className="ec-modal-actions">
                <button type="button" className="ec-modal-close" onClick={onClose} aria-label="关闭">
                  <WbIcon name="close" size={14} />
                </button>
              </div>
            </div>
            <div className="ec-modal-meta">
              <span className="ec-modal-name">授权完成后回到本对话框重试</span>
            </div>
          </div>
        </div>
        <div className="ec-modal-scroll-shell">
          <div className="ec-modal-body">
            <div className="ec-modal-content">
              <p className="ec-modal-desc">{error || entry.description || ''}</p>
              {refs.length > 0 ? (
                <>
                  <div className="ec-modal-section-title" style={{ marginTop: 14 }}>该连接器需要以下凭证</div>
                  <div className="ec-modal-tags-list">
                    {refs.map(r => (
                      <span key={r} className="ec-modal-tag-chip" style={{ fontFamily: 'ui-monospace, monospace' }}>{r}</span>
                    ))}
                  </div>
                </>
              ) : !retryable ? (
                <div className="ec-modal-tags-list" style={{ marginTop: 14 }}>
                  <span className="ec-modal-tag-chip">CLI · 技能已挂载</span>
                </div>
              ) : null}
              <p className="ec-modal-desc" style={{ marginTop: 14 }}>
                {authUrl
                  ? `该连接器的授权入口在 ${domain}；点击「打开授权页」会新开标签页，授权后回来重试。`
                  : '凭证由 DSH 凭证管理持有；配置后点「重试连接」即可。'}
              </p>
            </div>
          </div>
        </div>
        <div className="ec-modal-footer" style={{ gap: 10 }}>
          <button type="button" className="wbh-btnGhost" onClick={onClose}>关闭</button>
          {authUrl && (
            <button type="button" className="wbh-btnGhost" onClick={() => window.open(authUrl, '_blank', 'noopener')}>
              <WbIcon name="external" size={13} /> 打开授权页
            </button>
          )}
          {retryable && (
            <button type="button" className="ec-modal-summon-btn" style={{ width: 'auto' }} disabled={busy} onClick={onRetry}>
              <WbIcon name="refresh" size={13} /> {busy ? '连接中…' : '重试连接'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
