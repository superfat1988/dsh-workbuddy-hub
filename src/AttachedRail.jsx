import React, { useEffect, useState, useCallback } from 'react'
import { hub, onSelectionChange, selectedItems, removeSelection, onCatalogChange, clearPendingExpert } from './hub.js'
import { WbIcon } from './icons.js'

/**
 * 连接器 chip 的图标：优先显示官方注册表的 `icon`（远端 URL，16-18px），
 * 加载失败（断网 / CSP 拦截 / 404）或根本没有 icon 时退回现有的纯文字 + 通用
 * link 图标，**绝不渲染破图**。回退由 img 的 onError 驱动：图标加载失败后
 * 本组件记为 broken，整个 rail 重渲染成原文字 chip 形态。（导出仅为测试可见。）
 */
export function RailConnectorIcon({ icon, name }) {
  const [broken, setBroken] = useState(false)
  if (!icon || broken) return <WbIcon name="link" size={13} />
  return (
    <img src={icon} alt={name} title={name} aria-label={name}
      onError={() => setBroken(true)}
      className="wbh-railIconImg" />
  )
}

/**
 * 已选专家/技能/连接器 —— 官方显示在聊天输入区（composer 下方 dock）的 chip：
 * 圆形 icon + 名字，鼠标悬停才出现删除块，点击删除即取消选择。
 * 数据来源是客户端选择态 store（选中立刻可见），不依赖槽位能否拿到 sessionId。
 */
export default function AttachedRail({ sessionId }) {
  const [items, setItems] = useState(selectedItems(sessionId))
  const [busy, setBusy] = useState('')

  const sync = useCallback(() => setItems([...selectedItems(sessionId)]), [sessionId])
  useEffect(() => onSelectionChange(sync), [sync])
  useEffect(() => onCatalogChange(sync), [sync])

  const detach = async item => {
    setBusy(item.key)
    removeSelection(sessionId, item.kind, item.name)
    // 移除专家 chip = 用户不想要这个专家了：同步清掉「待生效专家」，
    // 否则它还会继续跟着跑进后面的新会话
    if (item.kind === 'expert') clearPendingExpert()
    try {
      if (item.kind === 'connector') await hub.disableConnector(item.name)
      if (sessionId) await hub.unmount(sessionId, item.kind, item.name)
    } catch { /* 取消选择不因后端失败而回弹 */ } finally { setBusy('') }
  }

  if (items.length === 0) return null

  return (
    <div className="wbh-rail" data-rail-count={items.length} data-session={sessionId || 'none'}>
      {items.map(item => (
        <span key={item.key} className="wbh-railChip" title={`${item.kind}：${item.displayName}`}>
          <span className={`wbh-railIcon${item.kind === 'connector' ? ' is-connector' : ''}`}>
            {/* 连接器走官方 MCP icon（独立小图标分支）；专家/技能语义不同，保持原样 */}
            {item.kind === 'connector'
              ? <RailConnectorIcon icon={item.icon} name={item.displayName} />
              : item.icon
                ? <img src={item.icon} alt="" onError={e => { e.currentTarget.style.display = 'none' }} />
                : <WbIcon name={item.kind === 'expert' ? 'person' : 'sparkle'} size={13} />}
          </span>
          <span className="wbh-railName" aria-hidden="true">{item.displayName}</span>
          <button type="button" className="wbh-railX" disabled={busy === item.key}
            aria-label={`移除 ${item.displayName}`} onClick={() => void detach(item)}>
            <WbIcon name="close" size={11} />
          </button>
        </span>
      ))}
    </div>
  )
}
