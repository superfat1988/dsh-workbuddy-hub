import React, { useState } from 'react'
import MarketPage from './MarketPage.jsx'

const plugin = {
  async apply(ctx) {
    function HubPage(props) {
      const [notice, setNotice] = useState('')
      return (
        <div className="ec-expert-center">
          <MarketPage sessionId={props?.sessionId} onNotice={setNotice} />
          {notice && <p className="ec-notice">{notice}</p>}
        </div>
      )
    }
    function PanelIcon() {
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 4.5h5.5V10H5zM13.5 4.5H19V10h-5.5zM5 13.5h5.5V19H5zM13.5 13.5H19V19h-5.5z" /></svg>
    }
    ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: 'workbuddy-hub' }, HubPage))
    ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
      name: 'sidebar.panellist', id: 'workbuddy-hub', order: -90, label: () => '专家·技能·连接器',
    }, PanelIcon))
  },
}
plugin.inject = ['slots', 'remote.commands']

module.exports = plugin
