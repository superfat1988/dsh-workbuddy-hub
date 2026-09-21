import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { hub, onCatalogChange } from './hub.js'
import { WbIcon } from './icons.js'
import Catalogue from './Catalogue.jsx'
import SummonModal from './SummonModal.jsx'
import ConnectorAuthModal from './ConnectorAuthModal.jsx'

const KINDS = [
  { id: 'expert', label: '专家', icon: 'person' },
  { id: 'skill', label: '技能', icon: 'sparkle' },
  { id: 'connector', label: '连接器', icon: 'link' },
]

/**
 * The composer "+" control. Official two-stage interaction:
 * stage 1 is a compact row-menu (avatar 16px + name 14px rows, divider,
 * 召唤更多专家 footer); stage 2 is the searchable picker.
 */
export default function ComposerAdd({ sessionId, runCommand }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [kind, setKind] = useState('expert')
  const [query, setQuery] = useState('')
  const [installed, setInstalled] = useState({})
  const [mounted, setMounted] = useState(new Set())
  const [busy, setBusy] = useState('')
  const [notice, setNotice] = useState('')
  const [summoning, setSummoning] = useState(null)
  const [authorising, setAuthorising] = useState(null)
  const [recent, setRecent] = useState([])
  const anchor = useRef(null)

  const refresh = useCallback(async () => {
    try {
      const [inst, mnt] = await Promise.all([hub.installed(), hub.mounted(sessionId)])
      setInstalled(inst)
      setMounted(new Set(mnt))
    } catch { /* keep previous */ }
  }, [sessionId])

  useEffect(() => { void refresh() }, [refresh])
  useEffect(() => onCatalogChange(refresh), [refresh])

  // close on outside click
  useEffect(() => {
    if (!menuOpen && !pickerOpen) return undefined
    const onDown = event => {
      if (anchor.current && !anchor.current.contains(event.target)) {
        setMenuOpen(false)
        setPickerOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [menuOpen, pickerOpen])

  const openPicker = useCallback(k => {
    setKind(k); setQuery('')
    setMenuOpen(false); setPickerOpen(true)
  }, [])

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
      setRecent(prev => [entry, ...prev.filter(e => e.key !== key)].slice(0, 5))
      await refresh()
    } catch (error) {
      const refs = error.body?.credentialRefs ?? []
      if (refs.length > 0) setAuthorising({ entry, refs, error: error.message })
      else setNotice(`失败：${error.message}`)
    } finally { setBusy('') }
  }, [installed, refresh, runCommand, sessionId])

  const onDetail = useCallback(entry => {
    if (entry.kind === 'expert') { setSummoning(entry); setPickerOpen(false) }
    else void attach(entry)
  }, [attach])

  const onAction = useCallback(entry => { void attach(entry) }, [attach])

  // 一段菜单条目：官方是「最近使用的 + 召唤更多」; here: installed entries
  // of the active kind plus the 召唤更多 footer opening the full picker.
  const menuEntries = useMemo(() => {
    const pool = []
    for (const key of mounted) {
      const [k, name] = key.split('/')
      const rec = installed[key]
      if (rec) pool.push({ kind: k, name, displayName: rec.displayName || name, icon: rec.icon || '', key })
    }
    for (const [key, rec] of Object.entries(installed)) {
      if (pool.length >= 6) break
      if (pool.some(p => p.key === key)) continue
      const [k, name] = key.split('/')
      pool.push({ kind: k, name, displayName: rec.displayName || name, icon: rec.icon || '', key })
    }
    return pool
  }, [installed, mounted])

  return (
    <div className="wbh-anchor" ref={anchor}>
      <button type="button" className="wbh-plus" aria-label="专家·技能·连接器"
        aria-expanded={menuOpen || pickerOpen || undefined} title="专家 · 技能 · 连接器"
        onClick={() => { setMenuOpen(v => !v); setPickerOpen(false) }}>
        <WbIcon name="plus" size={14} />
      </button>

      {menuOpen && (
        <>
          <div className="wbh-popScrim" onClick={() => setMenuOpen(false)} />
          <div className="wbh-menu" role="menu">
            <div className="wbh-menu-list">
              {menuEntries.length === 0 && (
                <div className="wbh-menu-item is-empty">暂无可选条目</div>
              )}
              {menuEntries.map(e => (
                <div key={e.key} className="wbh-menu-item" role="menuitem" tabIndex={0}
                  aria-checked={mounted.has(e.key) || undefined}
                  onClick={() => { setMenuOpen(false); onDetail({ kind: e.kind, name: e.name, displayName: e.displayName, icon: e.icon }) }}
                  onKeyDown={ev => { if (ev.key === 'Enter') { setMenuOpen(false); onDetail({ kind: e.kind, name: e.name, displayName: e.displayName, icon: e.icon }) } }}>
                  <span className="wbh-menu-avatar" aria-hidden="true">
                    {e.icon ? <img src={e.icon} alt="" /> : <span>{(e.displayName || '?').slice(0, 1)}</span>}
                  </span>
                  <span className="wbh-menu-name">{e.displayName}</span>
                </div>
              ))}
            </div>
            <div className="wbh-menu-divider" role="separator" />
            <div className="wbh-menu-item wbh-menu-summonMore" role="menuitem" tabIndex={0}
              onClick={() => openPicker(kind)}
              onKeyDown={ev => { if (ev.key === 'Enter') openPicker(kind) }}>
              <span className="wbh-menu-summonMoreIcon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M5 4.5h6.5V11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M11.5 4.5L4.5 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="wbh-menu-summonMoreLabel">召唤更多{KINDS.find(k => k.id === kind)?.label || ''}</span>
            </div>
          </div>
        </>
      )}

      {pickerOpen && (
        <>
          <div className="wbh-popScrim" onClick={() => setPickerOpen(false)} />
          <div className="wbh-pop">
            <Catalogue
              variant="picker" sessionId={sessionId} kind={kind} onKind={setKind}
              query={query} onQuery={setQuery} onDetail={onDetail} onAction={onAction}
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
