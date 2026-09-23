import React, { useState, useEffect, useCallback } from 'react'
import { hub, addSelection, summonExpertInNewSession } from './hub.js'
import { insertPromptIntoComposer } from './insert-prompt.js'
import { WbIcon } from './icons.js'
import Catalogue from './Catalogue.jsx'
import SummonModal from './SummonModal.jsx'
import ConnectorAuthModal from './ConnectorAuthModal.jsx'
import './official.css'
import './app.css'

/** Main panel: the official marketplace page plus the account bar. */
export default function MarketPage({ sessionId, workspaceId, runCommand }) {
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
    // 官方逻辑：选中即刻在聊天框出现该项的 chip（按会话隔离）。
    addSelection(entry, sessionId)
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
          addSelection(entry, sessionId)
          setNotice(`已连接「${entry.displayName}」（工具命名空间 ${r.serverName}），下一次模型步骤起可用。`)
        }
      } else if (entry.kind === 'expert') {
        // 官方语义：召唤 = 新建会话 + 该专家成为那个会话的 agent（只影响新会话，
        // 当前会话不动）。走方案 B（agent preset）。
        const r = await summonExpertInNewSession(entry, workspaceId)
        setNotice(r.ok ? `已在新会话中以「${entry.displayName}」身份开始` : `失败：${r.error}`)
      } else {
        await hub.mount(sessionId, entry.kind, entry.name)
        addSelection(entry, sessionId)
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
  // 专家卡片右上角的「召唤」= 官方语义：新建会话 + 该专家（当前会话不动）。
  const onAction = useCallback(entry => {
    if (entry.kind === 'expert') {
      setBusy(`${entry.kind}/${entry.name}`); setNotice('')
      void summonExpertInNewSession(entry, workspaceId).then(r => {
        setNotice(r.ok ? `已在新会话中以「${entry.displayName}」身份开始` : `失败：${r.error}`)
        setBusy('')
      })
    } else void attach(entry)
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
          onConfirm={async () => { const picked = summoning; setSummoning(null); void onAction(picked) }}
          onQuickPrompt={text => {
            const picked = summoning
            setSummoning(null)
            void summonExpertInNewSession(picked, workspaceId).then(r => {
              setNotice(r.ok ? `已在新会话中以「${picked.displayName}」身份开始` : `失败：${r.error}`)
              // 官方会把示例问题预填进新会话输入框
              if (r.ok) setTimeout(() => { try { insertPromptIntoComposer(text) } catch { /* 忽略 */ } }, 800)
            })
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
