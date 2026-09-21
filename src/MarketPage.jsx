import { useEffect, useState } from 'react'
import { hub } from './hub.js'
import './marketplace.css'

const KINDS = [
  { id: 'expert', label: '专家', icon: 'user' },
  { id: 'skill', label: '技能', icon: 'wand' },
  { id: 'connector', label: '连接器', icon: 'link' },
]

export default function MarketPage({ sessionId, onNotice }) {
  const [kind, setKind] = useState('expert')
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState([])
  const [cats, setCats] = useState([])
  const [installed, setInstalled] = useState({})
  useEffect(() => { hub.installed().then(setInstalled).catch(() => {}) }, [])
  useEffect(() => { hub.categories(kind).then(setCats).catch(() => setCats([])) }, [kind])
  useEffect(() => {
    let live = true
    hub.marketList(kind, { page: 1, pageSize: 60, query })
      .then(h => { if (live) setHits(h) })
      .catch(() => { if (live) hub.search(query, kind).then(h => setHits(h)).catch(() => setHits([])) })
    return () => { live = false }
  }, [kind, query])

  return (
    <div className="ec-picker-panel">
      <div className="um-header__tabs">
        {KINDS.map(k => (
          <button key={k.id} type="button"
            className={`um-tab${kind === k.id ? ' um-tab--active' : ''}`}
            onClick={() => setKind(k.id)}>
            <span>{k.label}</span>
          </button>
        ))}
      </div>
      <div className="ec-picker-header-right">
        <div className="ec-search-wrapper">
          <input value={query} placeholder={`搜索${KINDS.find(k => k.id === kind).label}`}
            onChange={e => setQuery(e.target.value)} />
        </div>
      </div>
      <div className="ec-category-tabs-wrap"><div className="ec-category-tabs">
        <button type="button" className="ec-category-tab is-active">全部</button>
        {cats.map(c => <button key={c.id} type="button" className="ec-category-tab">{c.label}{c.count != null ? ` ${c.count}` : ''}</button>)}
      </div></div>
      <div className="ec-expert-grid">
        {hits.map(entry => (
          <article key={`${entry.kind}/${entry.name}`} className="ec-expert-card ec-expert-card--selectable">
            <button type="button" className="ec-card-summon-btn ec-card-summon-btn--top"
              onClick={() => onNotice?.(`${entry.kind}/${entry.name}`)}>
              {entry.kind === 'expert' ? '召唤' : '连接'}
            </button>
            <div className="ec-card-main">
              <div className="ec-card-head">
                <div className="ec-card-avatar-sq">{entry.icon ? <img src={entry.icon} alt="" /> : <span>{(entry.displayName || entry.name || '?').slice(0, 1)}</span>}</div>
                <div className="ec-card-body">
                  <div className="ec-card-title-row"><div className="ec-card-role-wrap"><div className="ec-card-role">{entry.displayName || entry.name}</div></div></div>
                  <div className="ec-card-subtitle">{entry.subtitle || entry.kind}</div>
                </div>
              </div>
              <div className="ec-card-desc">{entry.description || entry.dir}</div>
              <div className="ec-card-tags">{(entry.tags ?? []).slice(0, 3).map(t => <span key={t} className="ec-card-tag">{t}</span>)}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
