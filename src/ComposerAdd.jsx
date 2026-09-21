import React, { useState, useEffect, useCallback, useRef } from 'react'
import { hub } from './hub.js'
import { WbIcon } from './icons.js'
import Catalogue from './Catalogue.jsx'
import SummonModal from './SummonModal.jsx'
import ConnectorAuthModal from './ConnectorAuthModal.jsx'

/** The composer "+" control: official bare plus, opening the picker popup. */
export default function ComposerAdd({ sessionId, runCommand }) {
  const [open, setOpen] = useState(false)
  const [kind, setKind] = useState('expert')
  const [query, setQuery] = useState('')
  const [installed, setInstalled] = useState({})
  const [mounted, setMounted] = useState(new Set())
  const [busy, setBusy] = useState('')
  const [notice, setNotice] = useState('')
  const [summoning, setSummoning] = useState(null)
  const [authorising, setAuthorising] = useState(null)
  const anchor = useRef(null)

  const refresh = useCallback(async () => {
    try {
      const [inst, mnt] = await Promise.all([hub.installed(), hub.mounted(sessionId)])
      setInstalled(inst)
      setMounted(new Set(mnt))
    } catch { /* keep previous */ }
  }, [sessionId])

  useEffect(() => { void refresh() }, [refresh])

  // close on outside click
  useEffect(() => {
    if (!open) return undefined
    const onDown = event => {
      if (anchor.current && !anchor.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const attach = useCallback(async (entry, task = '') => {
    const key = `${entry.kind}/${entry.name}`
    setBusy(key); setNotice('')
    try {
      if (!installed[key]) {
        await hub.install(entry.kind, entry.name, entry.official ? 'official' : undefined)
      }
      if (entry.kind === 'connector') {
        if (installed[key]?.enabled) {
          await hub.disableConnector(entry.name)
          if (sessionId) await hub.unmount(sessionId, entry.kind, entry.name)
          setNotice(`已断开「${entry.displayName}」`)
        } else {
          const r = await hub.enableConnector(entry.name)
          if (sessionId) await hub.mount(sessionId, entry.kind, entry.name)
          setNotice(`已连接「${entry.displayName}」（工具命名空间 ${r.serverName}），下一次模型步骤起可用。`)
        }
      } else if (entry.kind === 'expert') {
        if (sessionId) await hub.mount(sessionId, entry.kind, entry.name)
        const line = `/expert ${entry.name}${task.trim() ? ` ${task.trim()}` : ''}`
        const r = await runCommand(sessionId, line)
        setNotice(r.ok ? `已召唤「${entry.displayName}」：${r.value?.text || '专家会话已创建'}`
                       : `已挂载，但召唤失败：${r.error}`)
      } else {
        if (sessionId) await hub.mount(sessionId, entry.kind, entry.name)
        setNotice(`已挂载「${entry.displayName}」`)
      }
      await refresh()
    } catch (error) {
      const refs = error.body?.credentialRefs ?? []
      if (refs.length > 0) setAuthorising({ entry, refs, error: error.message })
      else setNotice(`失败：${error.message}`)
    } finally { setBusy('') }
  }, [installed, refresh, runCommand, sessionId])

  const onAction = useCallback(entry => {
    if (entry.kind === 'expert') setSummoning(entry)
    else void attach(entry)
  }, [attach])

  return (
    <div className="wbh-anchor" ref={anchor}>
      <button type="button" className="wbh-plus" aria-label="专家·技能·连接器"
        aria-expanded={open || undefined} title="专家 · 技能 · 连接器"
        onClick={() => setOpen(v => !v)}>
        <WbIcon name="plus" size={14} />
      </button>
      {open && (
        <>
          <div className="wbh-popScrim" onClick={() => setOpen(false)} />
          <div className="wbh-pop">
            <Catalogue
              variant="picker" sessionId={sessionId} kind={kind} onKind={setKind}
              query={query} onQuery={setQuery} onAction={onAction}
              installed={installed} mounted={mounted} busy={busy}
            />
            {notice && <div className="wbh-popNotice">{notice}</div>}
          </div>
        </>
      )}
      {summoning && (
        <SummonModal
          entry={summoning} busy={busy === `${summoning.kind}/${summoning.name}`}
          onClose={() => setSummoning(null)}
          onConfirm={async task => { await attach(summoning, task); setSummoning(null) }}
        />
      )}
      {authorising && (
        <ConnectorAuthModal
          entry={authorising.entry} refs={authorising.refs} error={authorising.error}
          busy={busy === `${authorising.entry.kind}/${authorising.entry.name}`}
          onClose={() => setAuthorising(null)}
          onRetry={async () => { await attach(authorising.entry); setAuthorising(null) }}
        />
      )}
    </div>
  )
}
