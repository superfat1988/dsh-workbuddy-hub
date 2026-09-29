import React, { useState } from 'react'
import { WbIcon } from './icons.js'
import Catalogue from './Catalogue.jsx'

const TITLES = {
  expert: { title: '更多专家', hint: '选中即加载到当前对话' },
  skill: { title: '更多技能', hint: '选中即加载到当前对话' },
  connector: { title: '连接器市场', hint: '选中即连接并挂到当前对话' },
}

/**
 * picker 里「召唤更多专家 / 更多技能 / 管理连接器」弹出的小窗口。
 *
 * 内容与插件市场页**同一个 Catalogue**（`variant="page"`：搜索、分类、排序、卡片全一致），
 * 区别只在**动作落点**：
 *   · 市场页：专家的「召唤」= 新建会话 + 该专家（官方语义）；
 *   · 本弹窗：任何条目的动作都**直接作用于打开它的那个对话**（picker 所在会话）——
 *     专家/技能挂到该会话并出 chip，连接器启用后挂到该会话。
 * 也就是说 `onAction` / `onDetail` 由调用方（ComposerAdd）注入，这里不自己决定会话。
 */
export default function ExpertMarketModal({
  sessionId, kind: initialKind = 'expert', installed = {}, mounted = new Set(),
  busy = '', notice = '', onAction, onClose, onRefresh,
}) {
  const [kind, setKind] = useState(initialKind)
  const [query, setQuery] = useState('')
  const meta = TITLES[kind] || TITLES.expert

  return (
    <div className="ec-modal-overlay wbh-marketOverlay" role="dialog" aria-modal="true"
      aria-label={meta.title}
      onClick={event => { if (event.target === event.currentTarget) onClose?.() }}>
      <div className="ec-modal-card wbh-marketModal" data-wbh-market-kind={kind}>
        <div className="wbh-marketModalHead">
          <span className="wbh-marketModalTitle">{meta.title}</span>
          <span className="wbh-marketModalHint">{meta.hint}</span>
          <button type="button" className="ec-modal-close wbh-marketModalClose" onClick={onClose} aria-label="关闭">
            <WbIcon name="close" size={14} />
          </button>
        </div>
        {notice ? <div className="wbh-marketModalNotice">{notice}</div> : null}
        <div className="wbh-marketModalBody">
          {/* 与市场页同一个组件、同一份数据源：搜索/分类/排序/卡片完全一致 */}
          <Catalogue
            variant="page" sessionId={sessionId} kind={kind} onKind={setKind}
            query={query} onQuery={setQuery} installed={installed} mounted={mounted} busy={busy}
            onAction={onAction} onDetail={onAction} onRefresh={onRefresh}
          />
        </div>
      </div>
    </div>
  )
}
