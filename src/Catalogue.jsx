import React, { useEffect, useState, useCallback } from 'react'
import { hub } from './hub.js'
import { WbIcon } from './icons.js'
import './official-skill.css'

const KINDS = [
  { id: 'expert', label: '专家', icon: 'person' },
  { id: 'skill', label: '技能', icon: 'sparkle' },
  { id: 'connector', label: '连接器', icon: 'link' },
]

/**
 * The official marketplace surface: um-tab kind selector, sort tabs,
 * category chips and the ec-expert-grid of ec-expert-card. Rendered both as
 * the main page and inside the composer picker popup.
 */
export default function Catalogue({
  sessionId, kind, onKind, query, onQuery,
  onDetail, onAction, installed = {}, mounted = new Set(), busy = '', variant = 'page',
}) {
  const [rows, setRows] = useState([])
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState('')

  useEffect(() => { setCategory('') }, [kind])

  useEffect(() => {
    let live = true
    hub.categories(kind).then(c => { if (live) setCategories(c) }).catch(() => {})
    return () => { live = false }
  }, [kind])

  useEffect(() => {
    let live = true
    setLoading(true); setFailed('')
    hub.list(kind, { query, category, limit: 60 })
      .then(r => { if (live) { setRows(r); setLoading(false) } })
      .catch(e => { if (live) { setFailed(e.message); setRows([]); setLoading(false) } })
    return () => { live = false }
  }, [kind, query, category])

  const actionLabel = useCallback(entry => {
    const key = `${entry.kind}/${entry.name}`
    if (busy === key) return '…'
    if (entry.kind === 'expert') return '召唤'
    if (entry.kind === 'connector') return '连接'
    return '挂载'
  }, [busy])

  const kindMeta = KINDS.find(k => k.id === kind) || KINDS[0]

  const kindTabs = (
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
  )

  const categoryRow = (
    <div className="ec-category-tabs-wrap">
      <div className="ec-category-tabs">
        <button type="button"
          className={`ec-category-tab${category === '' ? ' is-active' : ''}`}
          onClick={() => setCategory('')}>全部</button>
        {categories.map(c => (
          <button key={c.id} type="button"
            className={`ec-category-tab${category === c.id ? ' is-active' : ''}`}
            onClick={() => setCategory(c.id)}>
            {c.label}
            {typeof c.count === 'number' && <span className="ec-expert-count">{c.count}</span>}
          </button>
        ))}
      </div>
    </div>
  )

  const grid = (
    <div className="ec-expert-grid">
      {loading && <div className="wbh-state">正在读取市场目录…</div>}
      {!loading && failed && <div className="wbh-state">读取失败：{failed}</div>}
      {!loading && !failed && rows.length === 0 && (
        <div className="wbh-state">
          <WbIcon name={kindMeta.icon} size={40} />
          <p>暂无该分类的条目</p>
        </div>
      )}
      {rows.map(entry => {
        const key = `${entry.kind}/${entry.name}`
        if (entry.kind === 'skill') {
          // Official skill-card: icon + name + "+" install button + two-line desc.
          return (
            <div key={key} className="skill-card" role="button" tabIndex={0}
              onClick={() => onDetail?.(entry)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onDetail?.(entry) } }}>
              <div className="skill-card-content">
                <div className="skill-card-icon">
                  {entry.icon
                    ? <img src={entry.icon} alt={entry.displayName} width={28} height={28}
                        style={{ borderRadius: 6, objectFit: 'cover', flexShrink: 0, background: 'rgba(128,128,128,.15)' }} />
                    : <span className="wbh-avatar-letter" style={{ width: 28, height: 28, borderRadius: 6 }}>{(entry.displayName || '?').slice(0, 1)}</span>}
                </div>
                <div className="skill-card-top">
                  <div className="skill-card-body">
                    <div className="skill-card-name-row">
                      <span className="skill-card-name">{entry.displayName}</span>
                    </div>
                  </div>
                </div>
                <button type="button" className="skill-add-btn" aria-label={`安装 ${entry.displayName}`}
                  disabled={busy === key}
                  onClick={e => { e.stopPropagation(); onAction?.(entry) }}>
                  <WbIcon name="plus" size={14} />
                </button>
              </div>
              <div className="skill-card-desc skill-card-desc--two-lines">{entry.description || entry.name}</div>
            </div>
          )
        }
        return (
          <article key={key}
            className={`ec-expert-card${entry.kind === 'expert' ? ' ec-expert-card--selectable' : ''}`}
            role="button" tabIndex={0}
            onClick={() => onDetail?.(entry)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onDetail?.(entry) } }}>
            <button type="button" className="ec-card-summon-btn ec-card-summon-btn--top"
              disabled={busy === key}
              aria-label={`${actionLabel(entry)}${entry.displayName}`}
              onClick={e => { e.stopPropagation(); onAction?.(entry) }}>
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
                  <div className="ec-card-subtitle">{entry.subtitle || kindMeta.label}</div>
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
  )

  const searchBox = (
    <div className="ec-search-wrapper">
      <WbIcon name="search" size={14} />
      <input value={query} placeholder={`搜索${kindMeta.label}`}
        aria-label={`搜索${kindMeta.label}`}
        onChange={e => onQuery(e.target.value)} />
    </div>
  )

  if (variant === 'picker') {
    return (
      <div className="ec-picker-panel">
        <div className="ec-picker-header">
          {kindTabs}
          <div className="ec-picker-header-right">{searchBox}</div>
        </div>
        {categoryRow}
        <div className="ec-picker-scroll">{grid}</div>
      </div>
    )
  }

  return (
    <div className="ec-market-panel">
      <header className="ec-topbar">
        <div className="ec-topbar__left">
          <div className="um-header__inner">{kindTabs}</div>
        </div>
        <div className="ec-topbar__right">{searchBox}</div>
      </header>
      <div className="ec-page-layout">
        <div className="ec-main-content">
          {categoryRow}
          <div className="ec-main-scroll">{grid}</div>
        </div>
      </div>
    </div>
  )
}
