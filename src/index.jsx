import React, { useState } from 'react'
import { WbIcon } from './icons.js'
import MarketPage from './MarketPage.jsx'
import ComposerAdd from './ComposerAdd.jsx'
import AttachedRail from './AttachedRail.jsx'
import SettingsPage from './SettingsPage.jsx'
import { setMarketNavigator } from './hub.js'

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

/**
 * 会话 id 的官方来源（两种 scope 各走各的官方通道）：
 *  - session scope 槽（conversation.input.left 等）：框架标准 props.sessionId，直接可用
 *  - root scope 槽（main / sidebar.panellist）：没有 sessionId prop，用官方全局标准
 *    prop `useSessions` 选「主视图」会话（retainedBy.mainView > 0），与 DSH 自带的
 *    CordisPanel 用的是同一条选择式（packages/extensions/ui-cordis/src/client/CordisPanel.tsx）。
 */
const MAIN_SESSION_SELECTOR = state => {
  const byId = state?.byId ?? {}
  const current = state?.current
  const mainOf = id => (byId[id]?.retainedBy?.mainView ?? 0) > 0
  if (current && mainOf(current)) return current
  return Object.values(byId).find(session => (session?.retainedBy?.mainView ?? 0) > 0)?.id
}

function HubPageWithSessions({ useSessions, sessionId }) {
  const mainSessionId = useSessions(MAIN_SESSION_SELECTOR)
  return <MarketPage sessionId={sessionId || mainSessionId} runCommand={runCommand} />
}

function HubPage(props) {
  const useSessions = props?.useSessions
  // 规则：hook 不能条件调用——只有在官方确实下发了 useSessions 时才渲染订阅子树。
  if (typeof useSessions !== 'function') {
    return <MarketPage sessionId={props?.sessionId} runCommand={runCommand} />
  }
  return <HubPageWithSessions useSessions={useSessions} sessionId={props?.sessionId} />
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
    // 用官方 layout 服务切换主面板（侧边栏 selectPanel 走的就是它）
    setMarketNavigator(() => {
      let layout = null
      try { layout = ctx.get?.('layout') ?? null } catch { layout = null }
      const ok = typeof layout?.selectPanel === 'function'
      try { if (ok) layout.selectPanel('workbuddy-hub') } catch (error) {
        console.warn('[wbh] selectPanel failed:', String(error?.message || error))
      }
      console.info('[wbh] openMarket -> layout:', Boolean(layout), 'selectPanel:', ok)
    })
    ctx.slots.inject('main', () => reg('main', { name: 'main', key: 'workbuddy-hub' }, HubPage))
    ctx.slots.inject('sidebar.panellist', () => reg('sidebar.panellist', { name: 'sidebar.panellist', id: 'workbuddy-hub', order: -90, label: () => '专家·技能·连接器' }, PanelIcon))
    ctx.slots.inject('conversation.input.left', () => reg('conversation.input.left', {
      name: 'conversation.input.left', id: 'workbuddy-hub-add', order: -90,
      label: () => '专家·技能·连接器',
    }, ComposerSlot))
    // 已选专家/技能/连接器的 chip 由 input.left 内的 AttachedRail 渲染，
    // 与官方一致地紧挨「+」按钮显示在输入卡左下角（不再单独注册 dock 槽）。
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
