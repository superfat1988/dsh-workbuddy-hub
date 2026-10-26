/**
 * 闲置能力提示卡。
 *
 * 结构照 WorkBuddy 的 `idle-capability-pill` 复刻（JSX 从 renderer/assets/
 * idle-capability-Du2TTTDz.js 还原，CSS 由 scripts/build-idle-css.mjs 从官方表里抽出来）。
 *
 * 与官方不同的两处，都是刻意的：
 *  1. 官方文案里的 `days:14` 是硬编码，跟后端阈值各写一份。这里一律读后端给的
 *     `threshold`，改配置不会再出现「说 14 天、判 7 天」。
 *  2. 官方把 plugin/connector 也算进候选。DSH 没有 plugin 层，候选只有 skill / mcp，
 *     所以类型图标与文案表也只留这两项。
 */
import React, { useMemo, useState } from 'react'
import './cr-idle-light.css'
import './cr-idle-dark.css'
import './cr-idle.patch.css'

const TYPE_LABEL = { skill: '技能', mcp: 'MCP' }

const ICON = {
  skill: (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <path d="M8 2.2 13 5v6l-5 2.8L3 11V5l5-2.8Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M3.2 5.1 8 7.8l4.8-2.7M8 7.8V13.6" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  ),
  mcp: (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <rect x="2.4" y="2.4" width="11.2" height="11.2" rx="3" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
}

const CARET = `<svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`

function keyOf(row) { return `${row.type}:${row.id}` }

function lastUsedText(row, today) {
  if (!row.lastUsedDate) return '从未使用'
  if (row.lastUsedDate === today) return '今天'
  // 列头已经写了「最后使用」，值只放相对天数 —— 否则 88px 的列放不下会被 ellipsis 吃掉。
  return `${row.idleDays} 天前`
}

function Checkbox({ checked, onChange, label }) {
  return (
    <span
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      tabIndex={0}
      className={'cb-checkbox ' + (checked ? 'cb-checkbox--checked' : '')}
      onClick={event => { event.stopPropagation(); onChange() }}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); onChange() }
      }}
    >
      <span className="cb-checkbox__box" />
    </span>
  )
}

export default function IdleCard({ data, onClose, onDismiss, onDismissGlobal, onDisable, onManage, defaultExpanded = false }) {
  const rows = data?.candidates ?? []
  const threshold = data?.threshold ?? 14
  const today = data?.today ?? ''

  const [expanded, setExpanded] = useState(defaultExpanded)
  const [checkedKeys, setCheckedKeys] = useState(() => new Set())
  const [busy, setBusy] = useState(false)

  const activeKeys = useMemo(() => new Set(rows.map(keyOf)), [rows])
  // 候选会随关闭动作收缩，选集里留下的旧 key 必须过滤掉，否则「已选 N 项」会虚高
  const selected = useMemo(() => [...checkedKeys].filter(k => activeKeys.has(k)), [checkedKeys, activeKeys])
  const allChecked = rows.length > 0 && selected.length === rows.length

  if (rows.length === 0) return null

  const toggle = row => {
    const key = keyOf(row)
    setCheckedKeys(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }
  const toggleAll = () => {
    setCheckedKeys(allChecked ? new Set() : new Set(rows.map(keyOf)))
  }

  const disableSelected = async () => {
    if (selected.length === 0 || busy) return
    setBusy(true)
    try {
      await onDisable?.(selected.map(k => {
        const [type, ...rest] = k.split(':')
        return { type, id: rest.join(':') }
      }))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="wbh-port">
    <div
      className={'idle-capability-pill' + (expanded ? ' idle-capability-pill--detail' : '')}
      role="region"
      aria-label="闲置能力提醒"
    >
      <button type="button" className="idle-capability-pill__close" onClick={onClose} aria-label="关闭提醒">✕</button>

      <div className="idle-capability-pill__title">
        {rows.length} 项技能或 MCP 已至少 {threshold} 天未使用，建议检查后关闭。
      </div>

      <div className="idle-capability-pill__body">
        已挂载的技能和已启用的 MCP 会把说明送进模型上下文，闲置的仍然占用额度。
        <button type="button" className="idle-capability-pill__manage-link" onClick={onManage}>管理页</button>
        里可以随时开回来。
      </div>

      {expanded && (
        <>
          <div className="idle-capability-pill__select-row">
            <span className="idle-capability-pill__select-count">已选 {selected.length} 项</span>
          </div>

          <div className="idle-capability-pill__list">
            <div className="idle-capability-pill__list-head">
              <Checkbox checked={allChecked} onChange={toggleAll} label="全选" />
              <span className="idle-capability-pill__list-head-name">类型与名称</span>
              <span className="idle-capability-pill__list-head-date">最后使用</span>
            </div>
            {rows.map(row => {
              const key = keyOf(row)
              const on = selected.includes(key)
              return (
                <div key={key} className="idle-capability-pill__list-row" onClick={() => toggle(row)}>
                  <Checkbox checked={on} onChange={() => toggle(row)} label={row.name} />
                  <span className="idle-capability-pill__list-icon" aria-label={TYPE_LABEL[row.type] ?? row.type}>
                    {ICON[row.type] ?? ICON.skill}
                  </span>
                  <span className="idle-capability-pill__list-name">{row.name}</span>
                  <span className="idle-capability-pill__list-date">{lastUsedText(row, today)}</span>
                </div>
              )
            })}
          </div>
        </>
      )}

      <div className="idle-capability-pill__actions">
        <button type="button" className="idle-capability-pill__detail-link" onClick={() => setExpanded(v => !v)}>
          <span>{expanded ? '收起详情' : '查看详情'}</span>
          <span
            className={'idle-capability-pill__detail-caret' + (expanded ? ' idle-capability-pill__detail-caret--up' : '')}
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: CARET }}
          />
        </button>
        <button type="button" className="wbh-idle-btn wbh-idle-btn--secondary" onClick={onDismissGlobal} disabled={busy}>
          不再提醒
        </button>
        <button
          type="button"
          className="wbh-idle-btn wbh-idle-btn--primary"
          onClick={disableSelected}
          disabled={selected.length === 0 || busy}
        >
          {busy ? '关闭中…' : '一键关闭'}
        </button>
      </div>
    </div>
    </div>
  )
}
