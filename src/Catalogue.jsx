import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { hub, onCatalogChange, addSelection } from './hub.js'
import { insertPromptIntoComposer } from './insert-prompt.js'
import { WbIcon } from './icons.js'
import './official-skill.css'
import './official-connector.css'
import './official-skeleton.css'
import './official-button.css'

const KINDS = [
  { id: 'expert', label: '专家', icon: 'person' },
  { id: 'skill', label: '技能', icon: 'sparkle' },
  { id: 'connector', label: '连接器', icon: 'link' },
]

/** 官方排序控件（.ec-sort-group / .ec-sort-btn）。 */
const SORTS = [
  { id: 'reco', label: '综合' },
  { id: 'hot', label: '最热' },
  { id: 'new', label: '最新' },
]

const FALLBACK_COLORS = 6

/** 官方按条目稳定取一个 fallback 底色（--ec-avatar-fallback-bg-N）。 */
function fallbackIndex(seed = '') {
  let h = 0
  for (const ch of String(seed)) h = (h * 31 + ch.codePointAt(0)) >>> 0
  return (h % FALLBACK_COLORS) + 1
}

function numeric(value) {
  const n = parseFloat(String(value ?? '').replace(/[^\d.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

/**
 * 官方图标显示逻辑：有 icon 用 <img>；加载失败或没有 icon 时退化为官方
 * .ec-avatar-sq-fallback（首字 + 稳定底色），不显示破图。
 */
function EntryIcon({ entry, size = 44, round = true }) {
  const [broken, setBroken] = useState(false)
  const label = entry.displayName || entry.name || '?'
  const radius = round ? '50%' : `${Math.max(6, Math.round(size * 0.21))}px`
  if (!entry.icon || broken) {
    return (
      <div className="ec-avatar-sq-fallback"
        style={{
          background: `var(--ec-avatar-fallback-bg-${fallbackIndex(entry.name || label)})`,
          borderRadius: radius,
          fontSize: Math.max(11, Math.round(size * 0.42)),
          width: '100%', height: '100%',
        }}>
        {label.slice(0, 1)}
      </div>
    )
  }
  return (
    <img src={entry.icon} alt="" loading="lazy" decoding="async"
      onError={() => setBroken(true)}
      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: radius, flexShrink: 0, background: 'rgba(128,128,128,.15)' }} />
  )
}

function SkillCard({ entry, busy, onDetail, onAction }) {
  const key = `${entry.kind}/${entry.name}`
  return (
    <div className="skill-card" role="button" tabIndex={0}
      onClick={() => onDetail?.(entry)}
      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onDetail?.(entry) } }}>
      <div className="skill-card-content">
        <div className="skill-card-icon">
          <EntryIcon entry={entry} size={28} round={false} />
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
            <EntryIcon entry={entry} size={44} round />
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

function ConnectorCard({ entry, busy, onDetail, onAction, onConnectorAction, bound }) {
  const key = `${entry.kind}/${entry.name}`
  const enabled = bound ? bound.includes(entry.name) : Boolean(entry._enabled || entry.isConnected)
  const dot = busy === key ? 'connecting' : enabled ? 'connected' : ''
  return (
    <div className={`connector-card${enabled ? ' connector-card--installed' : ''}`} role="button" tabIndex={0}
      onClick={() => onDetail?.(entry)}
      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onDetail?.(entry) } }}>
      <div className="connector-card-icon">
        <EntryIcon entry={entry} size={28} round />
      </div>
      <div className="connector-card-main">
        <div className="connector-card-name-row">
          <div className="connector-card-name">{entry.displayName}</div>
          {dot && <span className={`connector-card-status-dot connector-card-status-dot--${dot}`} />}
        </div>
        <div className="connector-card-desc">{entry.description || entry.name}</div>
      </div>
      <div className="connector-card-action">
        <button type="button" className="wb-button wb-button--secondary wb-button--medium"
          disabled={busy === key} aria-label={`${enabled ? '解绑' : '连接'} ${entry.displayName}`}
          onClick={e => { e.stopPropagation(); void onConnectorAction?.(entry) }}>
          {busy === key ? '…' : enabled ? '解绑' : '连接'}
        </button>
      </div>
    </div>
  )
}

export default function Catalogue({
  sessionId, kind, onKind, query, onQuery, onDetail, onAction,
  installed = {}, mounted = new Set(), busy = '', variant = 'page', onRefresh,
}) {
  const [rows, setRows] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [failed, setFailed] = useState('')
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('reco')
  const [featured, setFeatured] = useState([])
  const [localRows, setLocalRows] = useState([])
  const [segment, setSegment] = useState(0)
  const [view, setView] = useState('market')      // market | installed | local
  const [addMenu, setAddMenu] = useState(false)
  const [localOnly, setLocalOnly] = useState(false)
  const [detail, setDetail] = useState(null)   // 技能/连接器的二级界面
  const [bound, setBound] = useState([])       // 官方已绑定的连接器（真实连接态）
  const [notice, setNotice] = useState('')     // 操作结果提示（连接/解绑失败等）
  const [busyLocal, setBusyLocal] = useState('')  // 本组件内发起的连接/解绑进行中态
  const [pendingAuth, setPendingAuth] = useState(null)  // 待完成的授权（含可点链接）
  const [pinned, setPinned] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('wbh-pinned') || '[]')) } catch { return new Set() }
  })
  // 置顶条目连数据一起存，保证它会「永远显示」（即使它不在当前列表来源里）
  const [pinnedEntries, setPinnedEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wbh-pinned-entries') || '[]') } catch { return [] }
  })
  const scrollRef = useRef(null)

  const PAGE_SIZE = 60
  const hubSkills = useMemo(
    () => Object.entries(installed)
      .filter(([, rec]) => rec?.kind === 'skill')
      .map(([key, rec]) => ({
        key, kind: 'skill', name: rec.name || key.split('/')[1],
        displayName: rec.displayName || rec.name, description: rec.description || '', icon: rec.icon || '',
      })),
    [installed],
  )

  useEffect(() => { setCategory(''); setSort('reco'); setSegment(0); setPage(1); setView('market'); setDetail(null) }, [kind])

  useEffect(() => {
    let live = true
    hub.categories(kind).then(c => { if (live) setCategories(c) }).catch(() => {})
    if (kind === 'skill') hub.localSkills().then(r => { if (live) setLocalRows(r) }).catch(() => {})
    hub.boundConnectors().then(r => { if (live) setBound(r.map(x => x.name)) }).catch(() => {})
    return () => { live = false }
  }, [kind])

  const load = useCallback(async (targetPage, replace) => {
    if (replace) { setLoading(true); setFailed('') } else setLoadingMore(true)
    try {
      const r = await hub.list(kind, { query, category, page: targetPage, pageSize: PAGE_SIZE })
      if (replace && kind === 'skill') setFeatured([...r.rows].sort(() => Math.random() - 0.5).slice(0, 5))
      setRows(prev => {
        if (replace) return r.rows
        const seen = new Set(prev.map(p => `${p.kind}/${p.name}`))
        return [...prev, ...r.rows.filter(x => !seen.has(`${x.kind}/${x.name}`))]
      })
      setHasMore(Boolean(r.hasMore))
    } catch (e) {
      if (replace) { setFailed(e.message); setRows([]) }
      setHasMore(false)
    } finally { setLoading(false); setLoadingMore(false) }
  }, [kind, query, category])

  useEffect(() => { setPage(1); void load(1, true) }, [load])
  useEffect(() => onCatalogChange(() => {
    void load(1, true)
    hub.boundConnectors().then(r => setBound(r.map(x => x.name))).catch(() => {})
  }), [load])
  const isBound = useCallback(entry => bound.includes(entry.name), [bound])

  // 懒加载：接近底部继续取下一页
  const onScroll = useCallback(e => {
    const el = e.currentTarget
    if (!hasMore || loading || loadingMore) return
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 480) setPage(p => p + 1)
  }, [hasMore, loading, loadingMore])

  useEffect(() => { if (page > 1) void load(page, false) }, [page, load])

  const visible = useMemo(() => {
    if (kind !== 'expert' || sort === 'reco') return rows
    const copy = [...rows]
    if (sort === 'hot') copy.sort((a, b) => numeric(b.useCount) - numeric(a.useCount))
    else if (sort === 'new') copy.sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))
    return copy
  }, [rows, sort, kind])

  // 连接器：已绑定=解绑；未绑定=发起官方 OAuth 并打开授权页；失败明确报错
  const pollOauth = useCallback(async entry => {
    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 3000))
      try {
        const st = await hub.connectorOauthStatus(entry.name)
        if (st?.connected) {
          const fresh = await hub.boundConnectors().catch(() => [])
          setBound(fresh.map(x => x.name))
          setPendingAuth(null)
          setNotice(`「${entry.displayName}」已连接`)
          return
        }
      } catch { /* 继续轮询 */ }
    }
    setNotice(`「${entry.displayName}」授权尚未完成，可稍后重试`)
  }, [])

  const connectorAction = useCallback(async entry => {
    const key = `${entry.kind}/${entry.name}`
    setBusyLocal(key); setNotice('')
    // 浏览器只允许在「用户手势」的同步阶段开窗；await 之后再 window.open 会被拦截。
    // 因此这里先同步开一个空窗，拿到授权链接后再把地址写进去。
    let authWindow = null
    if (!isBound(entry)) { try { authWindow = window.open('about:blank', '_blank') } catch { authWindow = null } }
    try {
      if (isBound(entry)) {
        const r = await hub.connectorUnbind(entry.name)
        if (r?.ok) await hub.unmount(undefined, entry.kind, entry.name).catch(() => {})
        setNotice(r?.ok ? `已解绑「${entry.displayName}」` : `解绑失败：${r?.message || '官方未确认'}`)
      } else {
        const r = await hub.connectorAuthStart(entry.name)
        if (r?.ok && r.url) {
          if (authWindow && !authWindow.closed) authWindow.location.href = r.url
          setPendingAuth({ name: entry.name, displayName: entry.displayName, url: r.url })
          setNotice(`请在打开的页面完成「${entry.displayName}」授权；若没有自动打开，点下面链接`)
          // 官方同样是 start 之后轮询 status 等授权完成
          void pollOauth(entry)
        } else {
          try { authWindow?.close() } catch { /* 忽略 */ }
          setNotice(`连接「${entry.displayName}」失败：${r?.message || '官方未返回授权链接'}`)
        }
      }
      const fresh = await hub.boundConnectors().catch(() => [])
      setBound(fresh.map(x => x.name))
      await onRefresh?.()
    } catch (error) {
      try { authWindow?.close() } catch { /* 忽略 */ }
      setNotice(`操作失败：${String(error?.message || error)}`)
    } finally { setBusyLocal('') }
  }, [isBound, onRefresh])

  const handleDetail = useCallback(entry => {
    if (entry.kind === 'expert') { onDetail?.(entry); return }
    setDetail(entry)
  }, [onDetail])

  // 技能：选中即把「/技能名」写进聊天输入框（DSH 的 skill 调用样式），并显示 chip
  const handleSkillPick = useCallback(entry => {
    insertPromptIntoComposer(`/${entry.name} `)
    addSelection(entry)
  }, [])

  const togglePin = useCallback(entry => {
    const key = `${entry.kind}/${entry.name}`
    setPinned(prev => {
      const next = new Set(prev)
      const on = !next.has(key)
      if (on) next.add(key); else next.delete(key)
      try { localStorage.setItem('wbh-pinned', JSON.stringify([...next])) } catch { /* 忽略 */ }
      setPinnedEntries(list => {
        const nextList = on
          ? [...list.filter(x => `${x.kind}/${x.name}` !== key), { kind: entry.kind, name: entry.name, displayName: entry.displayName, description: entry.description || '', icon: entry.icon || '' }]
          : list.filter(x => `${x.kind}/${x.name}` !== key)
        try { localStorage.setItem('wbh-pinned-entries', JSON.stringify(nextList)) } catch { /* 忽略 */ }
        return nextList
      })
      return next
    })
  }, [])

  // 未装任何专家时：随机 5 个，但按「当天」做种子，保证同一天内稳定不变。
  const expertFallback = useMemo(() => {
    const seedText = new Date().toISOString().slice(0, 10)
    let h = 0
    for (const ch of seedText) h = (h * 31 + ch.codePointAt(0)) >>> 0
    const pool = [...rows]
    const picked = []
    while (picked.length < 5 && pool.length > 0) {
      h = (h * 1103515245 + 12345) >>> 0
      picked.push(pool.splice(h % pool.length, 1)[0])
    }
    return picked
  }, [rows])

  const kindMeta = KINDS.find(k => k.id === kind) || KINDS[0]

  const busyAll = busyLocal || busy

  const skeletonCards = (
    <>{Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="wbh-skelCard">
        <div className="wbh-skelHead">
          <div className="wbh-skelAvatar" />
          <div className="wbh-skelLines">
            <div className="wbh-skelRow" style={{ width: '45%' }} />
            <div className="wbh-skelRow short" />
          </div>
        </div>
        <div className="wbh-skelRow" />
        <div className="wbh-skelRow short" />
      </div>
    ))}</>
  )

  const kindTabs = (
    <div className="um-header__tabs" role="tablist">
      {KINDS.map(k => (
        <button key={k.id} type="button" role="tab" aria-selected={kind === k.id}
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
      <input value={query} placeholder={`搜索${kindMeta.label}`} aria-label={`搜索${kindMeta.label}`}
        onChange={e => onQuery(e.target.value)} />
    </div>
  )

  const sortGroup = kind === 'expert' ? (
    <div className="ec-sort-group" role="tablist" aria-label="排序">
      {SORTS.map(s => (
        <button key={s.id} type="button" role="tab" aria-selected={sort === s.id}
          className={`ec-sort-btn${sort === s.id ? ' is-active' : ''}`}
          onClick={() => setSort(s.id)}>{s.label}</button>
      ))}
    </div>
  ) : null

  const categoryChips = kind === 'skill'
    ? (
      <div className="category-chip-list">
        <button type="button" className={`category-chip${category === '' ? ' category-chip--active' : ''}`} onClick={() => setCategory('')}>
          <span className="category-chip-label">全部</span></button>
        {categories.map(c => (
          <button key={c.id} type="button" className={`category-chip${category === c.id ? ' category-chip--active' : ''}`} onClick={() => setCategory(c.id)}>
            <span className="category-chip-label">{c.label}</span></button>
        ))}
      </div>
    )
    : (
      <div className="ec-category-tabs-wrap">
        <div className="ec-category-tabs">
          <button type="button" className={`ec-category-tab${category === '' ? ' is-active' : ''}`} onClick={() => setCategory('')}>全部</button>
          {categories.map(c => (
            <button key={c.id} type="button" className={`ec-category-tab${category === c.id ? ' is-active' : ''}`} onClick={() => setCategory(c.id)}>{c.label}</button>
          ))}
        </div>
      </div>
    )

  const cardGrid = kind === 'expert'
    ? (
      <div className="ec-expert-grid">
        {loading && skeletonCards}
        {!loading && failed && <div className="wbh-state">读取失败：{failed}</div>}
        {!loading && !failed && visible.length === 0 && (
          <div className="wbh-state"><WbIcon name={kindMeta.icon} size={40} /><p>暂无该分类的条目</p></div>
        )}
        {visible.map(entry => (
          <ExpertCard key={`${entry.kind}/${entry.name}`} entry={entry} kindLabel={kindMeta.label}
            busy={busy} onDetail={handleDetail} onAction={onAction} />
        ))}
        {loadingMore && skeletonCards}
      </div>
    )
    : (
      <div className="skills-grid">
        {loading && skeletonCards}
        {!loading && failed && <div className="wbh-state">读取失败：{failed}</div>}
        {!loading && !failed && visible.length === 0 && <div className="wbh-state"><p>暂无{kindMeta.label}</p></div>}
        {visible.map(entry => kind === 'connector'
          ? <ConnectorCard key={`${entry.kind}/${entry.name}`} entry={entry} busy={busyAll} onDetail={handleDetail} onAction={onAction} onConnectorAction={connectorAction} bound={bound} />
          : <SkillCard key={`${entry.kind}/${entry.name}`} entry={entry} busy={busy} onDetail={handleDetail} onAction={onAction} />)}
        {loadingMore && skeletonCards}
      </div>
    )

  const featuredSection = (
    <div className="skills-featured-section">
      <div className="skills-featured-header">
        <div className="skills-featured-title">精选技能</div>
        <button type="button" className="skills-featured-refresh-btn"
          onClick={() => setFeatured([...rows].sort(() => Math.random() - 0.5).slice(0, 5))}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
          </svg>
          <span>换一换</span>
        </button>
      </div>
      <div className="skills-grid">
        {featured.map(entry => (
          <SkillCard key={`f-${entry.kind}/${entry.name}`} entry={entry} busy={busy} onDetail={handleDetail} onAction={onAction} />
        ))}
      </div>
    </div>
  )

  const segmentBar = (
    <div className="skills-segment-bar">
      <div className="skills-segment-group">
        {['推荐', '套件'].map((label, i) => (
          <button key={label} type="button"
            className={`skills-segment-item${segment === i ? ' skills-segment-item--active' : ''}`}
            onClick={() => setSegment(i)}>{label}</button>
        ))}
      </div>
    </div>
  )

  const skillDetailView = detail && detail.kind === 'skill' ? (
    <div className="skills-view skills-view--detail">
      <div className="skill-detail-view">
        <button type="button" className="skill-detail-back" onClick={() => setDetail(null)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          技能
        </button>
        <div className="skill-detail-header">
          <div className="skill-detail-header-main">
            <h2>{detail.displayName}</h2>
            <div className="skill-detail-actions">
              <button type="button" className="skillhub-install-btn skillhub-install-btn--install"
                onClick={() => onAction?.(detail)}>
                {busy === `${detail.kind}/${detail.name}` ? '安装中…' : '安装'}
              </button>
            </div>
          </div>
          <p>{detail.description || detail.name}</p>
        </div>
        <div className="skill-detail-content-box">
          <div className="skill-detail-toolbar">
            <button type="button" className="active">概览</button>
          </div>
          <dl className="wbh-detailMeta">
            <div><dt>name</dt><dd>{detail.name}</dd></div>
            <div><dt>version</dt><dd>{detail.version || '1.0.0'}</dd></div>
            {detail.subtitle ? <div><dt>profession</dt><dd>{detail.subtitle}</dd></div> : null}
          </dl>
        </div>
      </div>
    </div>
  ) : null

  const connectorDetailModal = detail && detail.kind === 'connector' ? (
    <div className="connector-detail-overlay connector-detail-modal-overlay"
      onClick={() => setDetail(null)}>
      <div className={`connector-detail-modal${isBound(detail) ? ' connector-detail-modal--connected' : ''}`}
        onClick={e => e.stopPropagation()}>
        <button type="button" className="connector-detail-close" aria-label="关闭" onClick={() => setDetail(null)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="connector-detail-modal-body">
          <div className="connector-detail-flow">
            <div className="connector-detail-flow-avatar connector-detail-flow-avatar--workbuddy">
              <span className="wbh-flowBrand">W</span>
            </div>
            <span className="wbh-flowLine" aria-hidden="true" />
            <div className="connector-detail-flow-avatar">
              <EntryIcon entry={detail} size={28} round />
            </div>
          </div>
          <div className="wbh-detailName">{detail.displayName}</div>
          <p className="wbh-detailDesc">{detail.description || detail.name}</p>
          <div className="wbh-detailActions">
            <button type="button" className="wb-button wb-button--secondary wb-button--medium"
              disabled={busyLocal === `${detail.kind}/${detail.name}`}
              onClick={() => void connectorAction(detail)}>
              {isBound(detail) ? '解绑' : '连接'}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null

  const installedGrid = (
    <div className="skills-grid">
      {hubSkills.length === 0 && <div className="wbh-state"><p>还没有通过 WorkBuddy Hub 安装的技能</p></div>}
      {hubSkills.map(entry => (
        <div className="wbh-installedCard" key={entry.key}>
          <SkillCard entry={entry} busy={busy} onDetail={handleDetail} onAction={onAction} />
          <button type="button" className="wb-button wb-button--secondary wb-button--small wbh-uninstallBtn"
            onClick={async e => { e.stopPropagation(); await hub.uninstall('skill', entry.name); await onRefresh?.() }}>卸载</button>
        </div>
      ))}
    </div>
  )

  const localGrid = (
    <div className="skills-grid">
      {localRows.length === 0 && <div className="wbh-state"><p>本机 ~/.dsh/skills 下没有可添加的技能</p></div>}
      {localRows.map(entry => (
        <SkillCard key={`local-${entry.name}`} entry={entry} busy={busy} onDetail={handleDetail} onAction={onAction} />
      ))}
    </div>
  )

  const skillTopRight = kind === 'skill' ? (
    <>
      <button type="button" className="wb-button wb-button--secondary wb-button--medium"
        aria-label="我安装的" aria-pressed={view === 'installed'}
        onClick={() => setView(v => (v === 'installed' ? 'market' : 'installed'))}>
        <span className="wb-button__icon wb-button__icon--left"><WbIcon name="download" size={14} /></span>
        我安装的{hubSkills.length > 0 && <span className="wbh-btnCount">{hubSkills.length}</span>}
      </button>
      <div className="wbh-addWrap">
        <button type="button" className="wb-button wb-button--secondary wb-button--medium"
          aria-label="添加技能" aria-haspopup="menu" aria-expanded={addMenu}
          onClick={() => setAddMenu(v => !v)}>
          <span className="wb-button__icon wb-button__icon--left"><WbIcon name="plus" size={14} /></span>
          添加技能
        </button>
        {addMenu && (
          <>
            <div className="wbh-addScrim" onClick={() => setAddMenu(false)} />
            <div className="wbh-addMenu" role="menu">
              <div className="wbh-addMenuItem" role="menuitem" tabIndex={0}
                onClick={() => { setAddMenu(false); setView('local') }}>
                <WbIcon name="download" size={14} />从本地添加技能
              </div>
              <div className="wbh-addMenuItem" role="menuitem" tabIndex={0}
                onClick={() => { setAddMenu(false); setView('installed') }}>
                <WbIcon name="gear" size={14} />管理技能
              </div>
            </div>
          </>
        )}
      </div>
    </>
  ) : null

  // ---------- picker：官方二级面板（行列表 + 搜索 + 分类型底部项） ----------
  if (variant === 'picker') {
    const footerNode = kind === 'connector' ? (
      <div className="wbh-flyoutFooterItem" role="menuitem" tabIndex={0} onClick={() => setView('installed')}>
        <span className="wbh-flyoutFooterIcon">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M5 11L11 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M6.5 5H11V9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>管理连接器</span>
      </div>
    ) : kind === 'expert' ? (
      <div className="wbh-flyoutFooterItem" role="menuitem" tabIndex={0} onClick={() => setView('market')}>
        <span className="wbh-flyoutFooterIcon">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M5 11L11 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M6.5 5H11V9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>召唤更多专家</span>
      </div>
    ) : (
      <>
        <div className="wbh-flyoutFooterItem" role="menuitem" tabIndex={0}
          onClick={e => { e.stopPropagation(); setLocalOnly(true) }}>
          <span className="wbh-flyoutFooterIcon"><WbIcon name="download" size={14} /></span>
          <span>从本地添加技能</span>
        </div>
        <div className="wbh-flyoutFooterItem" role="menuitem" tabIndex={0}
          onClick={e => { e.stopPropagation(); setLocalOnly(false); setView('installed') }}>
          <span className="wbh-flyoutFooterIcon"><WbIcon name="gear" size={14} /></span>
          <span>管理技能</span>
        </div>
      </>
    )

    const installedExperts = Object.entries(installed)
      .filter(([, rec]) => rec?.kind === 'expert')
      .map(([key, rec]) => ({ key, kind: 'expert', name: rec.name || key.split('/')[1], displayName: rec.displayName || rec.name, description: rec.description || '', icon: rec.icon || '' }))
    // 图1：技能面板只列 DSH 本机已装技能，没有就显示「暂无可用技能」。
    const localSkills = (query
      ? localRows.filter(e => (e.displayName || e.name || '').toLowerCase().includes(query.toLowerCase()))
      : localRows)
    const baseRows = kind === 'expert'
      ? (installedExperts.length ? installedExperts : expertFallback)
      : kind === 'skill'
        ? localSkills
        : visible
    const pinnedOfKind = pinnedEntries.filter(x => x.kind === kind)
    const merged = [...pinnedOfKind, ...baseRows.filter(b => !pinnedOfKind.some(p => p.name === b.name && p.kind === b.kind))]
    const visibleRows = [...merged].sort((a, b) => {
      const pa = pinned.has(`${a.kind}/${a.name}`) ? 0 : 1
      const pb = pinned.has(`${b.kind}/${b.name}`) ? 0 : 1
      return pa - pb
    })

    const rowNode = entry => {
      const key = `${entry.kind}/${entry.name}`
      const connected = entry.kind === 'connector' ? isBound(entry) : Boolean(entry._enabled || entry.isConnected)
      return (
        <div key={key} className="wbh-flyoutRow" role="menuitem" tabIndex={0}
          onClick={() => {
            if (entry.kind === 'skill') handleSkillPick(entry)
            else if (entry.kind === 'connector') void connectorAction(entry)
            else onAction?.(entry)
          }}
          onKeyDown={e => { if (e.key === 'Enter') onAction?.(entry) }}>
          <span className="wbh-flyoutIcon"><EntryIcon entry={entry} size={24} round={entry.kind !== 'skill'} /></span>
          <span className="wbh-flyoutName">{entry.displayName}</span>
          {entry.kind !== 'connector' && (
            <button type="button"
              className={`wbh-pinBtn${pinned.has(`${entry.kind}/${entry.name}`) ? ' is-pinned' : ''}`}
              aria-label={pinned.has(`${entry.kind}/${entry.name}`) ? '取消置顶' : '置顶'}
              onClick={e => { e.stopPropagation(); togglePin(entry) }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 2h4l-.6 3.2 2.1 2.1H9.2L9 12.5l-1 1.5-1-1.5-.2-5.2H4.5l2.1-2.1L6 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          {entry.kind === 'connector' && (
            connected
              ? <span className="wbh-toggle is-on" role="switch" aria-checked="true" aria-label="已连接"><i /></span>
              : (
                <span className="wbh-linkAction" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M6.5 9.5a2.5 2.5 0 0 0 3.5 0l2-2a2.5 2.5 0 0 0-3.5-3.5l-.8.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    <path d="M9.5 6.5a2.5 2.5 0 0 0-3.5 0l-2 2a2.5 2.5 0 0 0 3.5 3.5l.8-.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  <span>连接</span>
                </span>
              )
          )}
          {busyLocal === key && <span className="wbh-flyoutBusy">…</span>}
        </div>
      )
    }

    return (
      <div className="wbh-flyout" role="dialog" aria-label={`选择${kindMeta.label}`}>
        {notice ? <div className="wbh-notice">{notice}</div> : null}
        {pendingAuth ? (
          <a className="wbh-authLink" href={pendingAuth.url} target="_blank" rel="noreferrer">
            打开「{pendingAuth.displayName}」授权页
          </a>
        ) : null}
        <div className="wbh-flyoutSearch">
          <WbIcon name="search" size={15} />
          <input value={query} placeholder={`搜索${kindMeta.label}`} aria-label={`搜索${kindMeta.label}`}
            onChange={e => onQuery(e.target.value)} />
        </div>
        <div className="wbh-flyoutList" ref={scrollRef} onScroll={onScroll}>
          {loading && <div className="wbh-flyoutState">正在读取…</div>}
          {!loading && !failed && visibleRows.length === 0 && (
            <div className="wbh-flyoutState">暂无可用{kindMeta.label}</div>
          )}
          {visibleRows.map(rowNode)}
          {loadingMore && <div className="wbh-flyoutState">加载中…</div>}
        </div>
        <div className="wbh-flyoutFooter">{footerNode}</div>
      </div>
    )
  }

  return (
    <div className="ec-market-panel">
      <header className="ec-topbar">
        <div className="ec-topbar__left">
          <div className="um-header__inner">{kindTabs}</div>
        </div>
        <div className="ec-topbar__right">
          {searchBox}
          {skillTopRight}
        </div>
      </header>
      {notice ? <div className="wbh-notice wbh-notice--page">{notice}</div> : null}
      {pendingAuth ? (
        <a className="wbh-authLink wbh-authLink--page" href={pendingAuth.url} target="_blank" rel="noreferrer">
          打开「{pendingAuth.displayName}」授权页
        </a>
      ) : null}
      <div className="ec-page-layout">
        <div className="ec-main-content">
          {view !== 'market' && (
            <div className="wbh-viewBar">
              <button type="button" className="wb-button wb-button--secondary wb-button--small"
                onClick={() => setView('market')}>← 返回{kindMeta.label}市场</button>
              <span className="wbh-viewTitle">{view === 'installed' ? '我安装的' : '从本地添加技能'}</span>
            </div>
          )}
          {view === 'market' && (
            <div className="wbh-filterRow">
              {categoryChips}
              {sortGroup}
            </div>
          )}
          <div className="ec-main-scroll" ref={scrollRef} onScroll={onScroll}>
            {view === 'installed' ? installedGrid : view === 'local' ? localGrid : (
              skillDetailView || (
                <>
                  {kind === 'skill' && !query && segment === 0 && featured.length > 0 && featuredSection}
                  {kind === 'skill' && segmentBar}
                  {cardGrid}
                </>
              )
            )}
          </div>
        </div>
      </div>
      {connectorDetailModal}
    </div>
  )
}
