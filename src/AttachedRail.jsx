import React, { useEffect, useState, useCallback } from 'react'
import { hub, onSelectionChange, selectedItems, removeSelection, onCatalogChange } from './hub.js'
import { WbIcon } from './icons.js'

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
          <span className="wbh-railIcon">
            {item.icon
              ? <img src={item.icon} alt="" onError={e => { e.currentTarget.style.display = 'none' }} />
              : <WbIcon name={item.kind === 'expert' ? 'person' : item.kind === 'skill' ? 'sparkle' : 'link'} size={13} />}
          </span>
          <span className="wbh-railName">{item.displayName}</span>
          <button type="button" className="wbh-railX" disabled={busy === item.key}
            aria-label={`移除 ${item.displayName}`} onClick={() => void detach(item)}>
            <WbIcon name="close" size={11} />
          </button>
        </span>
      ))}
    </div>
  )
}
