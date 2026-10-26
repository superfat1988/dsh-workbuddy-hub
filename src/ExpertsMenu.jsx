// 官方 experts-submenu 结构的 React 移植。
// 类名、层级、元素属性全部照搬 renderer/assets/src-C-yvPLiT.js 里的 ExpertsSubmenu，
// 样式来自 out/official-picker.css + 两份 scoped 变量表，不手抄。
import React from 'react'

const P = 'cr-experts-submenu'

function Avatar({ entry }) {
  const seed = entry.displayName || entry.name || '?'
  const initial = seed.trim().slice(0, 1).toUpperCase()
  if (entry.icon) {
    return (
      <span className={`${P}__avatar`} aria-hidden="true">
        <img src={entry.icon} alt="" draggable={false} onError={e => { e.currentTarget.style.display = 'none' }} />
      </span>
    )
  }
  return (
    <span className={`${P}__avatar`} aria-hidden="true" style={{ background: fallbackBg(seed) }}>
      {initial}
    </span>
  )
}

// 官方 getAvatarFallbackBackground 的等价实现：同一 seed 恒定同色。
function fallbackBg(seed) {
  const palette = ['#00614d', '#7a4ed9', '#1f7ae0', '#b5333a', '#0f7b6c', '#8a5a20']
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return palette[h % palette.length]
}

export default function ExpertsMenu({
  entries = [], pinned = new Set(), picked = new Set(),
  query = '', onQuery, onPick, onTogglePin, onSummonMore, loading = false,
}) {
  const q = query.trim().toLowerCase()
  const rows = q
    ? entries.filter(e => `${e.displayName || ''} ${e.name || ''} ${e.description || ''}`.toLowerCase().includes(q))
    : entries

  // 官方排序：置顶项全出，其余只取前 5（源码 `[...pinned, ...rest.slice(0, 5)]`）
  const pinnedRows = rows.filter(e => pinned.has(e.name))
  const restRows = q ? rows.filter(e => !pinned.has(e.name)) : rows.filter(e => !pinned.has(e.name)).slice(0, 5)

  const renderRow = entry => {
    const isPinned = pinned.has(entry.name)
    const isPicked = picked.has(entry.name)
    return (
      <div
        key={entry.name}
        className={`${P}__item${isPicked ? ` ${P}__item--selected` : ''}`}
        role="menuitem"
        aria-checked={isPicked}
        tabIndex={0}
        onClick={() => onPick?.(entry)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick?.(entry) } }}
      >
        <Avatar entry={entry} />
        <span className={`${P}__name`}>{entry.displayName || entry.name}</span>
        <button
          type="button"
          className={`${P}__pin${isPinned ? ` ${P}__pin--active` : ''}`}
          aria-label={isPinned ? '取消置顶' : '置顶'}
          onClick={e => { e.preventDefault(); e.stopPropagation(); onTogglePin?.(entry) }}
        >
          <span className={`${P}__pin-icon-rest`}><PinIcon /></span>
          <span className={`${P}__pin-icon-hover`}><PinOffIcon /></span>
        </button>
        {isPicked && <span className={`${P}__check`}><CheckIcon /></span>}
      </div>
    )
  }

  return (
    <div className={`${P}${q ? ` ${P}--searching` : ''}`} role="menu">
      <div className={`${P}__search`}>
        <input
          className="cr-search-input"
          type="text"
          value={query}
          placeholder="搜索专家"
          onChange={e => onQuery?.(e.target.value)}
          onKeyDown={e => { if (e.key === 'Escape' && query) { e.stopPropagation(); onQuery?.('') } }}
        />
      </div>

      {rows.length === 0 ? (
        <div className={`${P}__empty`} role="button" tabIndex={0}>{loading ? '加载中…' : '没有匹配的专家'}</div>
      ) : (
        <div className={`${P}__list`}>
          {pinnedRows.map(renderRow)}
          {restRows.map(renderRow)}
        </div>
      )}

      <div className={`${P}__divider`} />
      <div
        className={`${P}__summon-more`} role="button" tabIndex={0}
        onClick={() => onSummonMore?.()}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSummonMore?.() } }}
      >
        <span className={`${P}__summon-more-icon`}><PlusIcon /></span>
        <span className={`${P}__summon-more-label`}>召唤更多专家</span>
      </div>
    </div>
  )
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 2h4M8 2v5l3 3v1H5V10l3-3V2M8 11v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function PinOffIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 2h4M8 2v5l3 3v1H5V10l3-3V2M8 11v3M2 2l12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8.5l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
