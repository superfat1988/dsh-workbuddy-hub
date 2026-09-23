import React, { useState, useEffect, useCallback } from 'react'
import { hub, addSelection, openSessionById, startNewSession, composerSession } from './hub.js'
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
        // 官方：点「召唤」= 新建对话并选中该专家（实测会跳到 /app 并给出专家 chip）。
        // DSH 里对应「专家的会话」——宿主为该专家建一个带人设的 durable 子会话，
        // 再把它打开到主视图，用户直接就在专家的对话里。
        // 官方召唤时若还没有对话会先开一个新对话；宿主也需要一个真实会话才能建专家会话。
        let target = sessionId || composerSession()
        if (!target) {
          startNewSession()
          for (let i = 0; i < 20 && !target; i++) {
            await new Promise(resolve => setTimeout(resolve, 250))
            target = composerSession()
          }
        }
        if (!target) { setNotice('召唤失败：没有可用会话，且新建对话未就绪'); return }
        await hub.mount(target, entry.kind, entry.name)
        const r = await hub.summon(entry.name, task, target)
        if (!r.ok) { setNotice(`召唤失败：${r.error}`); return }
        const opened = openSessionById(r.childId)
        setNotice(opened
          ? `已召唤「${entry.displayName}」，已在新对话中打开`
          : `已召唤「${entry.displayName}」（会话 ${r.childId}；导航不可用，未能自动打开）`)
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
  // 专家卡片右上角的「召唤」：官方即新建对话并选中该专家（打开模态的是点卡片本体）
  const onAction = useCallback(entry => {
    if (entry.kind === 'expert') { setSummoning(null); void attach(entry) }
    else void attach(entry)
  }, [attach])

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
          onQuickPrompt={text => {
            setSummoning(null)
            void attach(summoning, text)
            // 官方把示例预填进新对话的输入框；新会话的 composer 挂载需要一点时间
            setTimeout(() => { try { insertPromptIntoComposer(text) } catch { /* 忽略 */ } }, 600)
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
