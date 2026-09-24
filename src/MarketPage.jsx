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
        // 官方语义：召唤 = 新建一个会话 + 该专家加载进去（方案 C 的注入+接管，不写 preset）。
        // 新会话落在**当前会话所属工作区**（workspaceId 由 main 槽解析），避免落错工作区。
        // 方案：召唤 = 记下「待生效专家」+ 进入新建会话；用户选任意工作区，
        // 新会话一挂载就自动带上该专家（不依赖工作区解析，不改官方框架）
        const r = await summonExpertInNewSession(entry)
        setNotice(summonNotice(r, entry.displayName))
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
  // 专家卡片右上角的「召唤」= 新建会话 + 该专家加载进去（官方语义）。
  const onAction = useCallback(entry => {
    if (entry.kind === 'expert') {
      setBusy(`${entry.kind}/${entry.name}`); setNotice('')
      void summonExpertInNewSession(entry).then(r => {
        setNotice(summonNotice(r, entry.displayName))
      }).catch(error => { setNotice(`失败：${String(error?.message || error)}`) })
        .finally(() => setBusy(''))
    } else void attach(entry)
  }, [attach, workspaceId])

  // 召唤提示文案：单槽位方案下，重复召唤会替换上一次选择的专家，明确告诉用户
  const summonNotice = (r, displayName) => (r?.ok
    ? (r.replaced
      ? `已改为选择「${displayName}」（替换了上一次选择的专家）：新会话里会自动加载`
      : `已选择「${displayName}」：新会话里会自动加载该专家（可自行选择工作区）`)
    : `失败：${r?.error || '未知错误'}`)

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
            void summonExpertInNewSession(picked).then(r => {
              setNotice(summonNotice(r, picked.displayName))
              if (r.ok) setTimeout(() => { try { insertPromptIntoComposer(text) } catch { /* 忽略 */ } }, 900)
            }).catch(error => { setNotice(`失败：${String(error?.message || error)}`) })
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
