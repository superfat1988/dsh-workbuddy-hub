import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { hub, addSelection, onCatalogChange, onMarketRequest } from './hub.js'
import { WbIcon } from './icons.js'
import { PickIcon } from './picker-icons.js'
import Catalogue from './Catalogue.jsx'
import SummonModal from './SummonModal.jsx'
import ConnectorAuthModal from './ConnectorAuthModal.jsx'
import AttachedRail from './AttachedRail.jsx'
import { insertPromptIntoComposer } from './insert-prompt.js'
import './official-picker.css'

// 图标名取自官方一级菜单 _itemIcon_1h7yd_144 的 SVG 原文
const KINDS = [
  { id: 'expert', label: '专家', icon: 'menuExpert' },
  { id: 'skill', label: '技能', icon: 'menuSkill' },
  { id: 'connector', label: '连接器', icon: 'menuConnector' },
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
  const [flyoutTop, setFlyoutTop] = useState(8)
  const anchor = useRef(null)
  const itemRefs = useRef({})

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

  useEffect(() => onMarketRequest(() => { setMenuOpen(false); setPickerOpen(false) }), [])

  const openPicker = useCallback(k => {
    setKind(k); setQuery('')
    // 官方：二级面板 top 对齐「当前悬停的那一行」的顶边（实测 transform 位移 = 行 offsetTop）
    const row = itemRefs.current[k]
    if (row) setFlyoutTop(row.offsetTop)
    setMenuOpen(true); setPickerOpen(true)
  }, [])

  const attach = useCallback(async (entry, task = '') => {
    const key = `${entry.kind}/${entry.name}`
    setBusy(key); setNotice('')
    // 官方逻辑：在 picker 里选中即刻在聊天框出现该项的 chip（选择态），
    // 安装/挂载是后续动作，失败也不回滚这次选择。
    addSelection(entry)
    try {
      let already = Boolean(installed[key])
      if (!already) {
        try {
          const fresh = await hub.installed()
          already = Boolean(fresh[key])
        } catch { /* 读不到就按下述安装路径处理 */ }
      }
      if (!already) {
        try {
          await hub.install(entry.kind, entry.name, entry.official ? 'official' : undefined)
        } catch (error) {
          // 已经装过时后端会 400；以注册表再确认一次，避免把「已安装」当失败。
          const fresh = await hub.installed().catch(() => ({}))
          if (!fresh[key]) throw error
        }
      }
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
        data-wbh-session={sessionId || ''}
        onClick={() => { setMenuOpen(v => !v); setPickerOpen(false) }}>
        <WbIcon name="plus" size={14} />
      </button>
      <AttachedRail sessionId={sessionId} />

      {menuOpen && (
        <>
          <div className="wbh-popScrim" onClick={() => { setMenuOpen(false); setPickerOpen(false) }} />
          <div className="wbh-pickerLayer">
          <div className="wbh-menu" role="menu">
            <div className="wbh-menu-group">
              {KINDS.map(k => (
                <div key={k.id}
                  className={`wbh-menu-item${pickerOpen && kind === k.id ? ' is-open' : ''}`}
                  role="menuitem" tabIndex={0}
                  ref={el => { itemRefs.current[k.id] = el }}
                  onMouseEnter={() => openPicker(k.id)}
                  onClick={() => openPicker(k.id)}
                  onKeyDown={e => { if (e.key === 'Enter') openPicker(k.id) }}>
                  <span className="wbh-menu-icon"><PickIcon name={k.icon} size={16} /></span>
                  <span className="wbh-menu-name">{k.label}</span>
                  <span className="wbh-menu-chevron" aria-hidden="true">
                    <PickIcon name="menuChevron" size={14} />
                  </span>
                </div>
              ))}
            </div>
            {pickerOpen && (
              <div className="wbh-flyoutWrap" style={{ top: `${flyoutTop}px` }}>
                <Catalogue
                  variant="picker" sessionId={sessionId} kind={kind} onKind={setKind}
                  query={query} onQuery={setQuery} onDetail={onDetail} onAction={onAction}
                  installed={installed} mounted={mounted} busy={busy}
                />
              </div>
            )}
          </div>
          </div>
          {notice && <div className="wbh-flyoutNotice">{notice}</div>}
        </>
      )}

      {summoning && (
        <SummonModal
          entry={summoning} busy={busy === `${summoning.kind}/${summoning.name}`}
          onClose={() => setSummoning(null)}
          onConfirm={async task => { await attach(summoning, task); setSummoning(null) }}
          onQuickPrompt={text => {
            setSummoning(null)
            void attach(summoning, text)
            insertPromptIntoComposer(text)
          }}
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
