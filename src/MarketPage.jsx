import React, { useState, useEffect, useCallback } from 'react'
import { hub, addSelection } from './hub.js'
import { WbIcon } from './icons.js'
import Catalogue from './Catalogue.jsx'
import SummonModal from './SummonModal.jsx'
import ConnectorAuthModal from './ConnectorAuthModal.jsx'
import { insertPromptIntoComposer } from './insert-prompt.js'
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
        // 宿主侧解析会话，客户端不需要 sessionId
        await hub.mount(sessionId, entry.kind, entry.name)
        const r = await hub.summon(entry.name, task, sessionId)
        setNotice(r.ok ? `已召唤「${entry.displayName}」：子会话 ${r.childId}`
                       : `已挂载，但召唤失败：${r.error}`)
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
  const onAction = useCallback(entry => { void attach(entry) }, [attach])

  const loggedIn = auth?.configured === true
  return (
    <div className="expert-center-page wbh-page">
      <div className="wbh-authBar">
        <span className="wbh-authState">
          <i className={`wbh-dot${loggedIn ? '' : ' off'}`} />
          {loggedIn ? `官方账号已登录${auth?.nickname ? ' · ' + auth.nickname : ''}`
                    : '官方账号未登录（技能/用量数据需登录）'}
        </span>
        {loggedIn
          ? <button type="button" className="wbh-btnGhost" onClick={async () => { await hub.authLogout(); await refresh() }}>注销</button>
          : <button type="button" className="wbh-btnPrimary" onClick={() => setShowAuth(true)}>扫码登录</button>}
      </div>
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
            insertPromptIntoComposer(text)
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
