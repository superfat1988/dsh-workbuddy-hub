import React, { useEffect, useState, useCallback } from 'react'
import { hub } from './hub.js'
import { WbIcon } from './icons.js'

/** Selected experts/skills/connectors, as chips below the composer card. */
export default function AttachedRail({ sessionId }) {
  const [items, setItems] = useState([])
  const [busy, setBusy] = useState('')

  const refresh = useCallback(async () => {
    if (!sessionId) { setItems([]); return }
    try {
      const keys = await hub.mounted(sessionId)
      const installed = await hub.installed()
      setItems(keys.map(key => {
        const [kind, name] = key.split('/')
        const rec = installed[key] || {}
        return { key, kind, name, displayName: rec.displayName || name, icon: rec.icon || '' }
      }))
    } catch { /* keep previous */ }
  }, [sessionId])

  useEffect(() => { void refresh() }, [refresh])
  if (items.length === 0) return null

  const detach = async item => {
    setBusy(item.key)
    try {
      if (item.kind === 'connector') await hub.disableConnector(item.name)
      await hub.unmount(sessionId, item.kind, item.name)
      await refresh()
    } catch { /* ignore */ } finally { setBusy('') }
  }

  return (
    <div className="wbh-rail">
      {items.map(item => (
        <span key={item.key} className="wbh-railChip" title={`${item.kind}：${item.displayName}`}>
          <span className="wbh-railIcon">
            {item.icon ? <img src={item.icon} alt="" /> : <WbIcon name={item.kind === 'expert' ? 'person' : item.kind === 'skill' ? 'sparkle' : 'link'} size={13} />}
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
