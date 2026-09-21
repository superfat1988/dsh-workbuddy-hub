import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { hub } from './hub.js'
import { WbIcon } from './icons.js'
import './official-skill.css'

const KINDS = [
  { id: 'expert', label: '专家', icon: 'person' },
  { id: 'skill', label: '技能', icon: 'sparkle' },
  { id: 'connector', label: '连接器', icon: 'link' },
]

/** 官方 skill-card：icon + 名称 + "+" 安装钮 + 两行描述。 */
function SkillCard({ entry, busy, onDetail, onAction }) {
  const key = `${entry.kind}/${entry.name}`
  return (
    <div className="skill-card" role="button" tabIndex={0}
      onClick={() => onDetail?.(entry)}
      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onDetail?.(entry) } }}>
      <div className="skill-card-content">
        <div className="skill-card-icon">
          {entry.icon
            ? <img src={entry.icon} alt={entry.displayName} width={28} height={28}
                style={{ borderRadius: 6, objectFit: 'cover', flexShrink: 0, background: 'rgba(128,128,128,.15)' }} />
            : <span className="wbh-avatar-letter" style={{ width: 28, height: 28, borderRadius: 6, fontSize: 13 }}>{(entry.displayName || '?').slice(0, 1)}</span>}
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

/** 官方专家卡：头像/职称/描述/标签 + 悬停召唤钮。 */
function ExpertCard({ entry, kindLabel, busy, onDetail, onAction }) {
  const key = `${entry.kind}/${entry.name}`
  const label = busy === key ? '…' : entry.kind === 'expert' ? '召唤' : '连接'
  return (
    <article className={`ec-expert-card${entry.kind === 'expert' ? ' ec-expert-card--selectable' : ''}`}
      role="button" tabIndex={0}
      onClick={() => onDetail?.(entry)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onDetail?.(entry) } }}>
      <button type="button" className="ec-card-summon-btn ec-card-summon-btn--top"
        disabled={busy === key}
        aria-label={`${label}${entry.displayName}`}
        onClick={e => { e.stopPropagation(); onAction?.(entry) }}>
        {label}
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
            <div className="ec-card-subtitle">{entry.subtitle || kindLabel}</div>
          </div>
        </div>
        <div className="ec-card-desc">{entry.description || entry.name}</div>
        <div className="ec-card-tags">
          {(entry.tags ?? []).slice(0, 3).map(t => <span key={t} className="ec-card-tag">{t}</span>)}
        </div>
      </div>
    </article>
  )
}

/**
 * The official marketplace surface. expert/connector pages use the
 * ec-topbar + ec-page-layout skeleton; the skill page uses the official
 * skills-view skeleton (featured strip, 推荐/套件 segment, category chips).
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
  const [segment, setSegment] = useState(0)          // 0=推荐 1=套件 (skill only)
  const [featured, setFeatured] = useState([])       // 精选技能 (skill only)

  useEffect(() => { setCategory(''); setSegment(0) }, [kind])

  useEffect(() => {
    let live = true
    hub.categories(kind).then(c => { if (live) setCategories(c) }).catch(() => {})
    return () => { live = false }
  }, [kind])

  useEffect(() => {
    let live = true
    setLoading(true); setFailed('')
    hub.list(kind, { query, category, limit: 60 })
      .then(r => {
        if (!live) return
        setRows(r); setLoading(false)
        if (kind === 'skill') setFeatured(shuffle(r).slice(0, 5))
      })
      .catch(e => { if (live) { setFailed(e.message); setRows([]); setLoading(false) } })
    return () => { live = false }
  }, [kind, query, category])

  const kindMeta = KINDS.find(k => k.id === kind) || KINDS[0]
  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5)

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

  const searchBox = (
    <div className="ec-search-wrapper">
      <WbIcon name="search" size={14} />
      <input value={query} placeholder={`搜索${kindMeta.label}`}
        aria-label={`搜索${kindMeta.label}`}
        onChange={e => onQuery(e.target.value)} />
    </div>
  )

  /* ---------- 技能页骨架 ---------- */
  const skillGrid = (
    <div className="skills-grid">
      {loading && <div className="wbh-state">正在读取市场目录…</div>}
      {!loading && failed && <div className="wbh-state">读取失败：{failed}</div>}
      {!loading && !failed && rows.length === 0 && (
        <div className="wbh-state"><p>暂无技能</p></div>
      )}
      {rows.map(entry => (
        <SkillCard key={`${entry.kind}/${entry.name}`} entry={entry} busy={busy}
          onDetail={onDetail} onAction={onAction} />
      ))}
    </div>
  )

  const skillCategoryRow = (
    <div className="category-chip-list">
      <button type="button"
        className={`category-chip${category === '' ? ' category-chip--active' : ''}`}
        onClick={() => setCategory('')}>
        <span className="category-chip-label">全部</span>
      </button>
      {categories.map(c => (
        <button key={c.id} type="button"
          className={`category-chip${category === c.id ? ' category-chip--active' : ''}`}
          onClick={() => setCategory(c.id)}>
          <span className="category-chip-label">{c.label}</span>
        </button>
      ))}
    </div>
  )

  const skillSegment = (
    <div className="skills-segment-bar">
      <div className="skills-segment-group">
        {['推荐', '套件'].map((s, i) => (
          <button key={s} type="button"
            className={`skills-segment-item${segment === i ? ' skills-segment-item--active' : ''}`}
            onClick={() => setSegment(i)}>{s}</button>
        ))}
      </div>
    </div>
  )

  const skillPage = (
    <div className="skills-view">
      <div className="skills-content">
        {!query && segment === 0 && featured.length > 0 && (
          <div className="skills-featured-section">
            <div className="skills-featured-header">
              <div className="skills-featured-title">精选技能</div>
              <button type="button" className="skills-featured-refresh-btn"
                onClick={() => setFeatured(shuffle(rows).slice(0, 5))}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                </svg>
                <span>换一换</span>
              </button>
            </div>
            <div className="skills-grid">
              {featured.map(entry => (
                <SkillCard key={`f-${entry.kind}/${entry.name}`} entry={entry} busy={busy}
                  onDetail={onDetail} onAction={onAction} />
              ))}
            </div>
          </div>
        )}
        {skillSegment}
        {skillCategoryRow}
        {skillGrid}
      </div>
    </div>
  )

  /* ---------- 专家/连接器页骨架 ---------- */
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

  const cardGrid = kind === 'connector'
    ? <div className="skills-grid">{rows.map(entry => (
        <SkillCard key={`${entry.kind}/${entry.name}`} entry={entry} busy={busy}
          onDetail={onDetail} onAction={onAction} />
      ))}</div>
    : (
      <div className="ec-expert-grid">
        {loading && <div className="wbh-state">正在读取市场目录…</div>}
        {!loading && failed && <div className="wbh-state">读取失败：{failed}</div>}
        {!loading && !failed && rows.length === 0 && (
          <div className="wbh-state"><WbIcon name={kindMeta.icon} size={40} /><p>暂无该分类的条目</p></div>
        )}
        {rows.map(entry => (
          <ExpertCard key={`${entry.kind}/${entry.name}`} entry={entry} kindLabel={kindMeta.label}
            busy={busy} onDetail={onDetail} onAction={onAction} />
        ))}
      </div>
    )

  const mainPage = (
    <div className="ec-market-panel">
      <header className="ec-topbar">
        <div className="ec-topbar__left">
          <div className="um-header__inner">{kindTabs}</div>
        </div>
        <div className="ec-topbar__right">
          {searchBox}
          {kind === 'skill' && (
            <>
              <button type="button" className="wbh-btnGhost">我安装的</button>
              <button type="button" className="wbh-btnGhost">添加技能</button>
            </>
          )}
        </div>
      </header>
      <div className="ec-page-layout">
        <div className="ec-main-content">
          {kind === 'skill' ? skillPage : (<>{categoryRow}<div className="ec-main-scroll">{cardGrid}</div></>)}
        </div>
      </div>
    </div>
  )

  /* ---------- picker 弹窗骨架 ---------- */
  const pickerGrid = (
    <div className={kind === 'expert' ? 'ec-expert-grid' : 'skills-grid'}>
      {loading && <div className="wbh-state">正在读取…</div>}
      {!loading && failed && <div className="wbh-state">读取失败：{failed}</div>}
      {rows.map(entry => kind === 'expert'
        ? <ExpertCard key={`${entry.kind}/${entry.name}`} entry={entry} kindLabel={kindMeta.label}
            busy={busy} onDetail={onDetail} onAction={onAction} />
        : <SkillCard key={`${entry.kind}/${entry.name}`} entry={entry} busy={busy}
            onDetail={onDetail} onAction={onAction} />)}
    </div>
  )

  if (variant === 'picker') {
    return (
      <div className="ec-picker-panel">
        <div className="ec-picker-header">
          {kindTabs}
          <div className="ec-picker-header-right">{searchBox}</div>
        </div>
        {kind === 'skill' ? skillCategoryRow : categoryRow}
        <div className="ec-picker-scroll">{pickerGrid}</div>
      </div>
    )
  }

  return mainPage
}
