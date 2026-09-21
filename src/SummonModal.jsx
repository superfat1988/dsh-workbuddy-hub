import React, { useState } from 'react'
import { WbIcon } from './icons.js'

/**
 * 召唤专家 — the official .ec-modal-card detail view:
 * circle avatar + role (profession · name) + use-count + close, a header
 * summon button, and quick-prompt examples. No free-form textarea (the task
 * is captured in the composer after selection in the official app); here a
 * clicked quick prompt seeds the summon task.
 */
export default function SummonModal({ entry, busy, onClose, onConfirm, onQuickPrompt }) {
  const [task, setTask] = useState('')
  const prompts = (entry.quickPrompts ?? []).slice(0, 3)
  const profession = entry.subtitle || '专家'
  const useCount = entry.useCount ? `${entry.useCount}次使用` : ''

  return (
    <div className="ec-modal-overlay" role="dialog" aria-modal="true" aria-label={`召唤 ${entry.displayName}`}>
      <div className="ec-modal-card is-expert-view">
        <div className="ec-modal-top">
          <div className="ec-modal-avatar">
            {entry.icon
              ? <img src={entry.icon} alt="" />
              : <span className="ec-modal-avatar-fallback">{(entry.displayName || '?').slice(0, 1)}</span>}
          </div>
          <div className="ec-modal-info">
            <div className="ec-modal-title-row">
              <div className="ec-modal-role">
                <span className="ec-modal-role-primary">{profession}</span>
                <span className="ec-modal-role-separator" aria-hidden="true" />
                <span className="ec-modal-role-secondary">{entry.displayName}</span>
              </div>
              <div className="ec-modal-actions">
                {useCount && <span className="ec-modal-use-count">{useCount}</span>}
                <button type="button" className="ec-modal-close" onClick={onClose} aria-label="关闭">
                  <WbIcon name="close" size={14} />
                </button>
              </div>
            </div>
            <button type="button" className="ec-modal-summon-btn ec-modal-header-summon-btn"
              disabled={busy} onClick={() => onConfirm(task)}>
              {busy ? '召唤中…' : '召唤专家'}
            </button>
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
                <div className="ec-modal-section-title">专家帮你做</div>
                <div className="ec-modal-quick-prompts-list">
                  {prompts.map((p, i) => (
                    <button key={i} type="button" className="ec-modal-quick-prompt-btn"
                      onClick={() => onQuickPrompt?.(p)}>
                      <span className="ec-modal-quick-prompt-text">{p}</span>
                      <span className="ec-modal-quick-prompt-action"><WbIcon name="chevronRight" size={14} /></span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
