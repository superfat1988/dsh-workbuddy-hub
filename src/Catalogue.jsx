import React, { useEffect, useState, useCallback } from 'react'
import { hub } from './hub.js'
import { WbIcon } from './icons.js'

const KINDS = [
  { id: 'expert', label: '专家', icon: 'person' },
  { id: 'skill', label: '技能', icon: 'sparkle' },
  { id: 'connector', label: '连接器', icon: 'link' },
]

/**
 * The official marketplace surface: um-tab kind selector, ec-search-wrapper,
 * ec-category-tabs and the ec-expert-grid of ec-expert-card. Rendered both as
 * the main page and inside the composer picker popup.
 */
export default function Catalogue({ sessionId, kind, onKind, query, onQuery, onAction, installed = {}, mounted = new Set(), busy = '', variant = 'page' }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState('')

  useEffect(() => {
    let live = true
    setLoading(true); setFailed('')
    hub.list(kind, { query, limit: 60 })
      .then(r => { if (live) { setRows(r); setLoading(false) } })
      .catch(e => { if (live) { setFailed(e.message); setRows([]); setLoading(false) } })
    return () => { live = false }
  }, [kind, query])

  const actionLabel = useCallback(entry => {
    const key = `${entry.kind}/${entry.name}`
    if (busy === key) return '…'
    if (entry.kind === 'expert') return mounted.has(key) ? '已挂载' : '召唤'
    if (entry.kind === 'connector') return installed[key]?.enabled ? '已连接' : '连接'
    return mounted.has(key) ? '已挂载' : '挂载'
  }, [busy, installed, mounted])

  return (
    <div className={variant === 'picker' ? 'ec-picker-panel' : 'ec-market-panel'}>
      <div className={variant === 'picker' ? 'ec-picker-header' : 'wbh-market-head'}>
        <div className="um-header__tabs">
          {KINDS.map(k => (
            <button key={k.id} type="button"
              className={`um-tab${kind === k.id ? ' um-tab--active' : ''}`}
              onClick={() => onKind(k.id)}>
              <WbIcon name={k.icon} size={14} />
              <span>{k.label}</span>
            </button>
          ))}
        </div>
        <div className="ec-picker-header-right">
          <div className="ec-search-wrapper">
            <WbIcon name="search" size={14} />
            <input value={query} placeholder={`搜索${KINDS.find(k => k.id === kind).label}`}
              aria-label={`搜索${KINDS.find(k => k.id === kind).label}`}
              onChange={e => onQuery(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="ec-category-tabs-wrap">
        <div className="ec-category-tabs">
          <button type="button" className="ec-category-tab is-active">全部</button>
        </div>
      </div>

      <div className="ec-expert-grid">
        {loading && <div className="wbh-state">正在读取市场目录…</div>}
        {!loading && failed && <div className="wbh-state">读取失败：{failed}</div>}
        {!loading && !failed && rows.length === 0 && (
          <div className="wbh-state">
            <WbIcon name={KINDS.find(k => k.id === kind).icon} size={40} />
            <p>暂无该分类的条目</p>
          </div>
        )}
        {rows.map(entry => {
          const key = `${entry.kind}/${entry.name}`
          return (
            <article key={key} className={`ec-expert-card${entry.kind === 'expert' ? ' ec-expert-card--selectable' : ''}`}>
              <button type="button" className="ec-card-summon-btn ec-card-summon-btn--top"
                disabled={busy === key} onClick={() => onAction(entry)}>
                {actionLabel(entry)}
              </button>
              <div className="ec-card-main">
                <div className="ec-card-head">
                  <div className="ec-card-avatar-sq">
                    {entry.icon
                      ? <img src={entry.icon} alt="" loading="lazy" />
                      : <span className="wbh-avatar-letter">{(entry.displayName || '?').slice(0, 1)}</span>}
                  </div>
                  <div className="ec-card-body">
                    <div className="ec-card-title-row">
                      <div className="ec-card-role-wrap">
                        <div className="ec-card-role">{entry.displayName}</div>
                      </div>
                    </div>
                    <div className="ec-card-subtitle">{entry.subtitle || KINDS.find(k => k.id === kind).label}</div>
                  </div>
                </div>
                <div className="ec-card-desc">{entry.description || entry.name}</div>
                <div className="ec-card-tags">
                  {(entry.tags ?? []).slice(0, 3).map(t => <span key={t} className="ec-card-tag">{t}</span>)}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
