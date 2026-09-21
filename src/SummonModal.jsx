import React, { useState } from 'react'
import { WbIcon } from './icons.js'

/** 召唤专家 — the official .ec-modal-card layout with quick-prompt examples. */
export default function SummonModal({ entry, busy, onClose, onConfirm }) {
  const [task, setTask] = useState('')
  const prompts = (entry.quickPrompts ?? []).slice(0, 3)
  return (
    <div className="ec-modal-overlay" role="dialog" aria-modal="true" aria-label={`召唤 ${entry.displayName}`}>
      <div className="ec-modal-card is-expert-view" style={{ opacity: 1 }}>
        <div className="ec-modal-top">
          <div className="ec-modal-avatar">
            {entry.icon
              ? <img src={entry.icon} alt="" />
              : <span className="ec-modal-avatar-fallback">{(entry.displayName || '?').slice(0, 1)}</span>}
          </div>
          <div className="ec-modal-info">
            <div className="ec-modal-title-row">
              <h3 className="ec-modal-role">{entry.displayName}</h3>
              <div className="ec-modal-actions">
                <button type="button" className="ec-modal-close" onClick={onClose} aria-label="关闭">
                  <WbIcon name="close" size={14} />
                </button>
              </div>
            </div>
            <div className="ec-modal-meta">
              {entry.subtitle && <span className="ec-modal-name">{entry.subtitle}</span>}
              <span className="ec-modal-category-badge">专家</span>
            </div>
          </div>
        </div>
        <div className="ec-modal-scroll-shell">
          <div className="ec-modal-body">
            <div className="ec-modal-content">
              <p className="ec-modal-desc">{entry.description || '专家运行在独立会话中，主对话只接收结论。'}</p>
              {entry.tags?.length > 0 && (
                <div className="ec-modal-tags-list">
                  {entry.tags.map(t => <span key={t} className="ec-modal-tag-chip">{t}</span>)}
                </div>
              )}
            </div>
            {prompts.length > 0 && (
              <div className="ec-modal-quick-prompts">
                <div className="ec-modal-section-title">试试这样问</div>
                <div className="ec-modal-quick-prompts-list">
                  {prompts.map((p, i) => (
                    <button key={i} type="button" className="ec-modal-quick-prompt-btn" onClick={() => setTask(p)}>
                      <span className="ec-modal-quick-prompt-text">{p}</span>
                      <span className="ec-modal-quick-prompt-action"><WbIcon name="chevronRight" size={14} /></span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="ec-modal-content">
              <div className="ec-modal-section-title">任务（可选）</div>
              <textarea
                className="wbh-modalInput" rows={3} value={task}
                placeholder="留空则先确认角色，也可以直接写下要交给这位专家的任务"
                aria-label="任务描述"
                onChange={e => setTask(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="ec-modal-footer">
          <button type="button" className="ec-modal-summon-btn" disabled={busy} onClick={() => onConfirm(task)}>
            {busy ? '召唤中…' : '召唤专家'}
          </button>
        </div>
      </div>
    </div>
  )
}
