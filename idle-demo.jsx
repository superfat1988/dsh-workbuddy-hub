import React from 'react'
import { createRoot } from 'react-dom/client'
import IdleCard from './src/IdleCard.jsx'

const data = {
  threshold: 14,
  today: '2026-10-26',
  candidates: [
    { type: 'skill', id: 'meituan-coupon-workbuddy', name: 'meituan-coupon-workbuddy', idleDays: 35, lastUsedDate: null },
    { type: 'mcp', id: 'douyin', name: 'douyin', idleDays: 26, lastUsedDate: '2026-09-30' },
    { type: 'skill', id: 'experts', name: 'experts', idleDays: 19, lastUsedDate: '2026-10-07' },
  ],
}
const noop = () => {}
const card = <IdleCard data={data} onClose={noop} onDismiss={noop} onDismissGlobal={noop} onDisable={noop} onManage={noop} />

function Frame() {
  return (
    <div className="row">
      <div className="col"><div className="tag">LIGHT</div>{card}</div>
      <div className="col dk" data-ds-dark-theme><div className="tag">DARK</div>{card}</div>
      <div className="col"><div className="tag">EXPANDED</div>
        <IdleCard data={data} defaultExpanded onClose={noop} onDismiss={noop} onDismissGlobal={noop} onDisable={noop} onManage={noop} />
      </div>
    </div>
  )
}
createRoot(document.getElementById('app')).render(<Frame />)
