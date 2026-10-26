import React, { useEffect, useRef, useState } from 'react'
import { PickIcon } from './picker-icons.js'
import MarketPage from './MarketPage.jsx'
import ComposerAdd from './ComposerAdd.jsx'
import AttachedRail from './AttachedRail.jsx'
import SettingsPage from './SettingsPage.jsx'
import IdleSlot from './IdleSlot.jsx'
import {
  setMarketNavigator, setSessionOpener, setSessionStarter, setPresetSelector, openMarket,
  openSessionById, startNewSession, composerSession, summonExpertInNewSession,
} from './hub.js'

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

function resolveWorkspaceId(workspaces, sessionsById, currentSessionId) {
  const items = Array.isArray(workspaces?.items) ? workspaces.items : []
  // 1) 当前主会话所属 workspace
  if (currentSessionId) {
    const ws = items.find(w => Array.isArray(w?.sessionIds) && w.sessionIds.includes(currentSessionId))
    if (ws?.workspaceId) return ws.workspaceId
  }
  // 2) 最近活跃会话的 cwd 精确匹配 workspace.path（比 updatedAt 排序更稳）
  let latestCwd = null; let latestTime = Number.NEGATIVE_INFINITY
  for (const id of Object.keys(sessionsById || {})) {
    const s = sessionsById?.[id]
    if (s?.cwd && (s.updatedAt ?? 0) > latestTime) { latestTime = s.updatedAt; latestCwd = s.cwd }
  }
  if (latestCwd) {
    const ws = items.find(w => w?.path === latestCwd)
    if (ws?.workspaceId) return ws.workspaceId
  }
  // 3) 兜底：updatedAt 排序
  let selected = null; let selectedTime = Number.NEGATIVE_INFINITY
  for (const w of items) {
    let latest = Number.NEGATIVE_INFINITY
    for (const sid of (Array.isArray(w?.sessionIds) ? w.sessionIds : [])) {
      const s = sessionsById?.[sid]
      if (s?.updatedAt != null) latest = Math.max(latest, s.updatedAt)
    }
    if (latest === Number.NEGATIVE_INFINITY && w?.createdAt) latest = Date.parse(w.createdAt)
    if (selected === null || latest > selectedTime) { selected = w.workspaceId; selectedTime = latest }
  }
  return selected || undefined
}

function HubPageWithSessions({ useSessions, useWorkspaces, sessionId }) {
  const mainSessionId = useSessions(MAIN_SESSION_SELECTOR)
  const sessionsById = useSessions(state => state?.byId ?? {})
  const workspaces = typeof useWorkspaces === 'function' ? useWorkspaces(state => state) : null
  const workspaceId = resolveWorkspaceId(workspaces, sessionsById, mainSessionId)
  return <MarketPage sessionId={sessionId || mainSessionId} workspaceId={workspaceId} runCommand={runCommand} />
}

function HubPage(props) {
  const useSessions = props?.useSessions
  // 规则：hook 不能条件调用——只有在官方确实下发了 useSessions 时才渲染订阅子树。
  if (typeof useSessions !== 'function') {
    return <MarketPage sessionId={props?.sessionId} runCommand={runCommand} />
  }
  return <HubPageWithSessions useSessions={useSessions} useWorkspaces={props?.useWorkspaces} sessionId={props?.sessionId} />
}

// 侧栏入口：图标与悬停弹出的三项，都照官方（官方入口图标就是「专家」那枚，
// 悬停弹出 placement-right 的 162px 面板：专家/技能/连接器，点击进入对应页）。
const SIDEBAR_ENTRIES = [
  { id: 'expert', label: '专家', icon: 'menuExpert' },
  { id: 'skill', label: '技能', icon: 'menuSkill' },
  { id: 'connector', label: '连接器', icon: 'menuConnector' },
]

function PanelIcon() {
  const [anchor, setAnchor] = useState(null)
  const ref = useRef(null)
  const open = () => {
    // 官方是「整行悬停」出浮层，而本组件的 DOM 只有图标那一小块，
    // 所以把监听挂到最近的 button 祖先（侧栏那一行）上。
    const host = ref.current?.closest?.('button') || ref.current
    const rect = host?.getBoundingClientRect?.()
    if (rect) setAnchor({ top: Math.round(rect.top), left: Math.round(rect.right - 12) })
  }
  useEffect(() => {
    const host = ref.current?.closest?.('button') || ref.current
    if (!host) return undefined
    const onEnter = () => open()
    const onLeave = event => {
      // 鼠标移进浮层不算离开（浮层是我们的 DOM 后代，但仍做一次兜底判断）
      const pop = ref.current?.querySelector?.('.wbh-sideEntryPop')
      if (pop && event.relatedTarget && pop.contains(event.relatedTarget)) return
      setAnchor(null)
    }
    host.addEventListener('mouseenter', onEnter)
    host.addEventListener('mouseleave', onLeave)
    return () => {
      host.removeEventListener('mouseenter', onEnter)
      host.removeEventListener('mouseleave', onLeave)
    }
  }, [])
  return (
    <span className="wbh-sideEntry" ref={ref}>
      <PickIcon name="menuExpert" size={16} />
      {anchor && (
        <span className="wbh-sideEntryPop" style={{ top: `${anchor.top}px`, left: `${anchor.left}px` }}>
          <span className="wbh-sideEntryList" role="menu" aria-label="专家·技能·连接器">
            {SIDEBAR_ENTRIES.map(item => (
              <span key={item.id} className="wbh-sideEntryItem" role="menuitem" tabIndex={0}
                onClick={() => { setAnchor(null); openMarket({ kind: item.id, view: 'market' }) }}
                onKeyDown={event => {
                  if (event.key !== 'Enter') return
                  setAnchor(null); openMarket({ kind: item.id, view: 'market' })
                }}>
                <span className="wbh-sideEntryIcon"><PickIcon name={item.icon} size={16} /></span>
                <span className="wbh-sideEntryLabel">{item.label}</span>
              </span>
            ))}
          </span>
        </span>
      )}
    </span>
  )
}

// 「待生效专家」需要知道当前会话是不是空会话（新会话）：用官方全局标准 prop
// useSessions 读 session summary 的 blank。hook 不能条件调用 —— 沿用 HubPage 的做法：
// 只有框架确实下发了 useSessions 时才渲染订阅子树。
function ComposerSlotWithSessions({ useSessions, sessionId }) {
  const blank = useSessions(state => state?.byId?.[sessionId]?.blank)
  return <ComposerAdd sessionId={sessionId} runCommand={runCommand} sessionBlank={blank} />
}

function ComposerSlot(props) {
  const useSessions = props?.useSessions
  if (typeof useSessions !== 'function') {
    return <ComposerAdd sessionId={props?.sessionId} runCommand={runCommand} />
  }
  return <ComposerSlotWithSessions useSessions={useSessions} sessionId={props?.sessionId} />
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
    // 召唤专家要「新建对话并选中该专家」：DSH 里对应的动作是把该专家的会话打开到主视图
    setSessionOpener(sessionId => {
      if (!sessionId) return false
      let workspace = null
      try { workspace = ctx.get?.('uiWorkspace') ?? null } catch { workspace = null }
      const ok = typeof workspace?.openSession === 'function'
      console.info('[wbh] openSession ->', sessionId, 'uiWorkspace:', Boolean(workspace), 'openSession:', ok)
      if (!ok) return false
      try { workspace.openSession({ sessionId }); return true } catch (error) {
        console.warn('[wbh] openSession failed:', String(error?.message || error)); return false
      }
    })
    setPresetSelector((sessionId, presetId) => {
      const remote = ctx.remote ?? null
      if (typeof remote?.agentPresets?.select !== 'function') {
        return { ok: false, error: 'agentPresets remote 不可用' }
      }
      return remote.agentPresets.select(sessionId, presetId)
    })
    setSessionStarter(() => {
      let workspace = null
      try { workspace = ctx.get?.('uiWorkspace') ?? null } catch { workspace = null }
      const ok = typeof workspace?.startSession === 'function'
      console.info('[wbh] startSession -> uiWorkspace:', Boolean(workspace), 'startSession:', ok)
      if (!ok) return false
      try { workspace.startSession(); return true } catch (error) {
        console.warn('[wbh] startSession failed:', String(error?.message || error)); return false
      }
    })
    // 排障用：可在控制台直接验证「打开会话 / 新建对话」这两条桥是否可用
    // （vConsole 里敲 __wbh.openSessionById('session-…')）
    try {
      // 只暴露只读/导航类排查口；归档这类会改状态的入口不随插件发布
      window.__wbh = { openSessionById, startNewSession, composerSession, summonExpertInNewSession }
    } catch { /* 非浏览器环境忽略 */ }
    ctx.slots.inject('main', () => reg('main', { name: 'main', key: 'workbuddy-hub' }, HubPage))
    ctx.slots.inject('sidebar.panellist', () => reg('sidebar.panellist', { name: 'sidebar.panellist', id: 'workbuddy-hub', order: -90, label: () => '专家·技能·连接器' }, PanelIcon))
    ctx.slots.inject('conversation.input.left', () => reg('conversation.input.left', {
      name: 'conversation.input.left', id: 'workbuddy-hub-add', order: -90,
      label: () => '专家·技能·连接器',
    }, ComposerSlot))
    // 已选专家/技能/连接器的 chip 由 input.left 内的 AttachedRail 渲染，
    // 与官方一致地紧挨「+」按钮显示在输入卡左下角（不再单独注册 dock 槽）。
    // 闲置能力提醒：挂输入框 dock，每个会话都在；卡片自身 fixed 定位，不占布局。
    ctx.slots.inject('conversation.composer.dock', () => reg('conversation.composer.dock', {
      name: 'conversation.composer.dock', id: 'workbuddy-hub-idle', order: 60,
    }, IdleSlot))
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
plugin.inject = ['slots', 'remote', 'remote.agentPresets']

module.exports = plugin
