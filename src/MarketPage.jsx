import React, { useState, useEffect, useCallback } from 'react'
import { hub, addSelection, startNewSession, composerSession, selectPreset } from './hub.js'
import { insertPromptIntoComposer } from './insert-prompt.js'
import { WbIcon } from './icons.js'
import Catalogue from './Catalogue.jsx'
import SummonModal from './SummonModal.jsx'
import ConnectorAuthModal from './ConnectorAuthModal.jsx'
import './official.css'
import './app.css'

/** Main panel: the official marketplace page plus the account bar. */
export default function MarketPage({ sessionId, runCommand }) {
  const [kind, setKind] = useState('expert')
  const [query, setQuery] = useState('')
  const [installed, setInstalled] = useState({})
  const [mounted, setMounted] = useState(new Set())
  const [busy, setBusy] = useState('')
  const [notice, setNotice] = useState('')
  const [summoning, setSummoning] = useState(null)
  const [authorising, setAuthorising] = useState(null)
  const [auth, setAuth] = useState(null)
  const [showAuth, setShowAuth] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const [inst, mnt, a] = await Promise.all([hub.installed(), hub.mounted(sessionId), hub.auth()])
      setInstalled(inst); setMounted(new Set(mnt)); setAuth(a)
    } catch { /* keep previous */ }
  }, [sessionId])
  useEffect(() => { void refresh() }, [refresh])

  // task 由召唤模态框传入；阶段 1 只做挂载，任务文本暂不消费（保留签名兼容调用方）。
  const attach = useCallback(async (entry, task = '') => {
    const key = `${entry.kind}/${entry.name}`
    setBusy(key); setNotice('')
    // 官方逻辑：在 picker 里选中即刻在聊天框出现该项的 chip（选择态），
    // 安装/挂载是后续动作，失败也不回滚这次选择。
    addSelection(entry)
    try {
      if (!installed[key]) await hub.install(entry.kind, entry.name, entry.official ? 'official' : undefined)
      if (entry.kind === 'connector') {
        if (installed[key]?.enabled) {
          await hub.disableConnector(entry.name)
          if (sessionId) await hub.unmount(sessionId, entry.kind, entry.name)
          setNotice(`已断开「${entry.displayName}」`)
        } else {
          const r = await hub.enableConnector(entry.name)
          await hub.mount(sessionId, entry.kind, entry.name)
          addSelection(entry)
          setNotice(`已连接「${entry.displayName}」（工具命名空间 ${r.serverName}），下一次模型步骤起可用。`)
        }
      } else if (entry.kind === 'expert') {
        // 阶段 1 / 方案 A：召唤 = 把这位专家挂到**当前会话**，宿主把它的人设作为
        // 一段 system prompt section 动态注入，每个 step 的 assembly 都会重算，
        // 因此「下一步起」就以该专家身份回答（不建子会话、不写 agent preset）。
        await hub.mount(sessionId, entry.kind, entry.name)
        addSelection(entry)
        setNotice(`已选中「${entry.displayName}」，下一步起以该专家身份回答`)
      } else {
        await hub.mount(sessionId, entry.kind, entry.name)
        addSelection(entry)
        setNotice(`已挂载「${entry.displayName}」`)
      }
      await refresh()
    } catch (error) {
      const refs = error.body?.credentialRefs ?? []
      if (refs.length > 0) setAuthorising({ entry, refs, error: error.message })
      else setNotice(`失败：${error.message}`)
    } finally { setBusy('') }
  }, [installed, refresh, runCommand, sessionId])

  const onDetail = useCallback(entry => {
    if (entry.kind === 'expert') setSummoning(entry)
    else void attach(entry)
  }, [attach])
  // 专家卡片右上角的「召唤」：把该专家挂到当前会话（人设下一步注入）；
  // 打开模态框的是点卡片本体。
  const onAction = useCallback(entry => {
    if (entry.kind === 'expert') { setSummoning(null); void attach(entry) }
    else void attach(entry)
  }, [attach])

  // 阶段 2 / 方案 B：新建一个会话，并把该专家设成这个会话的 agent preset
  // （真接管：preset 决定该会话的 persona/工具面，不再靠 system prompt 叠加）。
  // 顺序照官方：先确保 preset 存在 → 新建会话 → 等会话真的切过去 → select。
  const summonInNewSession = useCallback(async entry => {
    const key = `${entry.kind}/${entry.name}`
    setBusy(key); setNotice('')
    addSelection(entry) // 先让 chip 出现（与官方「选中即显示」一致）
    try {
      const ensure = await hub.expertPresetEnsure(entry.name)
      if (!ensure?.ok || !ensure.presetId) {
        setNotice(`失败：${ensure?.error || '无法创建专家预设'}`)
        return
      }
      const before = composerSession() || sessionId || ''
      startNewSession()
      // 新会话是异步出现的（uiWorkspace.startSession 内部 connectWorkspace）；
      // 等 composer 槽拿到新的 sessionId，最多 6 秒。
      let target = ''
      for (let i = 0; i < 24; i += 1) {
        await new Promise(resolve => setTimeout(resolve, 250))
        const now = composerSession()
        if (now && now !== before) { target = now; break }
      }
      // 没等到变化时退回当前会话：若它本来就是那个空白会话，select 依然成立。
      if (!target) target = composerSession() || sessionId || ''
      if (!target) { setNotice('失败：没有等到新会话，请手动新建对话后重试'); return }
      // 官方 remote：把 sessionId 解析成 agent 再 select；只对空白会话生效
      const picked = await selectPreset(target, ensure.presetId)
      if (!picked?.ok) {
        const detail = picked?.error?.details?.reason ?? picked?.error?.message ?? picked?.error
        setNotice(`失败：${typeof detail === 'string' ? detail : '切换 agent preset 被拒绝'}`)
        return
      }
      setNotice(`已在新会话中以「${entry.displayName || entry.name}」身份开始`)
    } catch (error) {
      // 409（该会话没有活跃 agent）等非 2xx 会走这里，error.message 即宿主原文。
      setNotice(`失败：${error.message}`)
    } finally { setBusy('') }
  }, [sessionId])

  const loggedIn = auth?.configured === true
  return (
    <div className="expert-center-page wbh-page" data-wbh-session={sessionId || ''}>
      <Catalogue
        sessionId={sessionId} kind={kind} onKind={setKind} query={query} onQuery={setQuery}
        onDetail={onDetail} onAction={onAction} installed={installed} mounted={mounted} busy={busy}
        onRefresh={refresh}
      />
      {notice && <p className="wbh-notice">{notice}</p>}
      {summoning && (
        <SummonModal entry={summoning} busy={busy === `${summoning.kind}/${summoning.name}`}
          onClose={() => setSummoning(null)}
          onConfirm={async task => { await attach(summoning, task); setSummoning(null) }}
          onNewSession={() => { const picked = summoning; setSummoning(null); void summonInNewSession(picked) }}
          onQuickPrompt={text => {
            setSummoning(null)
            void attach(summoning, text)
            // 不再新建会话：composer 已挂载，示例文本直接预填进输入框
            try { insertPromptIntoComposer(text) } catch { /* 忽略 */ }
          }} />
      )}
      {authorising && (
        <ConnectorAuthModal entry={authorising.entry} refs={authorising.refs} error={authorising.error}
          busy={busy === `${authorising.entry.kind}/${authorising.entry.name}`}
          onClose={() => setAuthorising(null)}
          onRetry={async () => { await attach(authorising.entry); setAuthorising(null) }} />
      )}
      {showAuth && <WbAuthCardLazy onClose={() => { setShowAuth(false); void refresh() }} />}
    </div>
  )
}

// lazy-ish import kept simple (single bundle)
import WbAuthCardLazy from './WbAuthCard.jsx'
