import React, { useState } from 'react'
import { WbIcon } from './icons.js'
import MarketPage from './MarketPage.jsx'
import ComposerAdd from './ComposerAdd.jsx'
import AttachedRail from './AttachedRail.jsx'
import SettingsPage from './SettingsPage.jsx'

let pluginCtx = null

/** Resolve the commands Remote at CALL time (the remotes module may load later). */
function runCommand(sessionId, line) {
  if (!sessionId) return Promise.resolve({ ok: false, error: '当前没有会话，无法执行命令' })
  let remote = null
  try { remote = pluginCtx?.get?.('remote.commands') ?? null } catch { remote = null }
  if (!remote) return Promise.resolve({ ok: false, error: '命令通道不可用（remotes 未就绪）' })
  return remote.execute(sessionId, line, [])
    .then(result => result?.ok
      ? { ok: true, value: result.value?.result }
      : { ok: false, error: result?.error?.message || '命令执行失败' })
    .catch(error => ({ ok: false, error: String(error?.message || error) }))
}

function HubPage(props) {
  return <MarketPage sessionId={props?.sessionId} runCommand={runCommand} />
}

function PanelIcon() {
  return <WbIcon name="grid" size={16} />
}

function ComposerSlot(props) {
  return <ComposerAdd sessionId={props?.sessionId} runCommand={runCommand} />
}

function RailSlot(props) {
  return <AttachedRail sessionId={props?.sessionId} />
}

const plugin = {
  apply(ctx) {
    pluginCtx = ctx
    const reg = (name, options, component) => ctx.slots.register(options, component)
    ctx.slots.inject('main', () => reg('main', { name: 'main', key: 'workbuddy-hub' }, HubPage))
    ctx.slots.inject('sidebar.panellist', () => reg('sidebar.panellist', { name: 'sidebar.panellist', id: 'workbuddy-hub', order: -90, label: () => '专家·技能·连接器' }, PanelIcon))
    ctx.slots.inject('conversation.input.left', () => reg('conversation.input.left', {
      name: 'conversation.input.left', id: 'workbuddy-hub-add', order: -90,
      label: () => '专家·技能·连接器',
    }, ComposerSlot))
    // Never input.overlay: it floats INSIDE the card and would cover the placeholder.
    ctx.slots.inject('conversation.composer.dock', () => reg('conversation.composer.dock', {
      name: 'conversation.composer.dock', id: 'workbuddy-hub-attached', order: -90,
      label: () => '已挂载 WorkBuddy 条目',
    }, RailSlot))
    ctx.slots.inject('settings.section', () => reg('settings.section', {
      name: 'settings.section', id: 'workbuddy-hub', order: 85,
      label: () => '专家·技能·连接器',
    }, SettingsPage))
    ctx.slots.inject('settings.plugins.tab', () => reg('settings.plugins.tab', {
      name: 'settings.plugins.tab', id: 'workbuddy-hub', order: 80,
      label: () => 'WorkBuddy 市场',
    }, SettingsPage))
  },
}
plugin.inject = ['slots']

module.exports = plugin
