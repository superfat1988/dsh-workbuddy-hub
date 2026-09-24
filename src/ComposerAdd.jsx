import React, { useState, useEffect, useLayoutEffect, useCallback, useRef, useMemo } from 'react'
import { hub, addSelection, peekPendingExpert, clearPendingExpert, onCatalogChange, onMarketRequest, setComposerSession, authState, onAuthChange, refreshAuth, onAuthRequired, claimAuthGate, settleAuthGate, STALE_LOGIN_REASON } from './hub.js'
import { WbIcon } from './icons.js'
import { PickIcon } from './picker-icons.js'
import Catalogue from './Catalogue.jsx'
import SummonModal from './SummonModal.jsx'
import ConnectorAuthModal from './ConnectorAuthModal.jsx'
import WbAuthCard from './WbAuthCard.jsx'
import AttachedRail from './AttachedRail.jsx'
import { insertPromptIntoComposer } from './insert-prompt.js'
import './official-picker.css'

// 官方二级面板的自然宽度（与 official-picker.css 的 .is-* 规则同源）
const PANEL_WIDTH = { expert: 200, skill: 320, connector: 240 }

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
export default function ComposerAdd({ sessionId, runCommand, sessionBlank }) {
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
  const [auth, setAuth] = useState(() => authState())
  const [showAuth, setShowAuth] = useState(false)
  // 二级面板几何：官方做法是把面板「夹」进视口（8px 边距）——高度上限 vh−16、
  // 宽度 min(自然宽, vw−8−面板左缘)，先按悬停行对齐，放不下就整体上移，永不翻转。
  const [geom, setGeom] = useState({ top: 8, maxH: 0, maxW: 0, shift: 0 })
  const anchor = useRef(null)
  const itemRefs = useRef({})
  const wrapRef = useRef(null)
  const layerRef = useRef(null)

  const refresh = useCallback(async () => {
    try {
      const [inst, mnt] = await Promise.all([hub.installed(), hub.mounted(sessionId)])
      setInstalled(inst)
      setMounted(new Set(mnt))
    } catch { /* keep previous */ }
  }, [sessionId])

  useEffect(() => { setComposerSession(sessionId) }, [sessionId])
  // 「待生效专家」落位：召唤后，**每个新会话**的 composer 一挂载/切换就渲染 chip 并把
  // 专家挂到那个会话 —— 所以换任意工作区都生效（不依赖工作区解析）。两种结束条件：
  //   ① 该会话开聊了（不再是空会话）→ 待生效使命完成，清掉，避免继续跟着跑到别的新会话；
  //   ② 用户在 chip 上点 X 移除（AttachedRail 里同步清待生效）；或超过 5 分钟 TTL。
  // 旧对话（非空会话）不落位，避免污染用户点开的历史会话。
  useEffect(() => {
    if (!sessionId) return
    const pending = peekPendingExpert()   // 只看不取：换工作区/换新会话要能反复生效
    if (!pending) return
    if (sessionBlank === false) { clearPendingExpert(); return }
    addSelection(pending, sessionId)
    void hub.mount(sessionId, 'expert', pending.name)
      .then(() => console.info('[wbh] pending expert applied:', pending.name, '-> session', sessionId))
      .catch(error => console.warn('[wbh] pending expert mount failed:', String(error?.message || error)))
  }, [sessionId, sessionBlank])
  useEffect(() => { void refresh() }, [refresh])
  useEffect(() => onCatalogChange(refresh), [refresh])
  // 登录态 store：picker footer 的登录行、以及登录成功后的目录刷新都订阅它
  useEffect(() => {
    if (authState() === null) void refreshAuth()
    return onAuthChange(setAuth)
  }, [])
  // 动作级 JIT 登录门：composer 侧（picker 里的连接器等）被拦下时由这里弹登录卡
  useEffect(() => onAuthRequired(() => { if (claimAuthGate('picker')) setShowAuth(true) }), [])

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
    // 官方：二级面板 top 先对齐「当前悬停的那一行」的顶边（实测 transform 位移 = 行 offsetTop），
    // 随后按视口夹取（见下面的 layout effect）。
    const row = itemRefs.current[k]
    if (row) setGeom(prev => ({ ...prev, top: row.offsetTop }))
    setMenuOpen(true); setPickerOpen(true)
  }, [])

  // 面板几何随内容/视口变化重算（ResizeObserver 覆盖「加载完行数后才变高」的情况）。
  useLayoutEffect(() => {
    if (!pickerOpen) return undefined
    const MARGIN = 8
    const shift = geom.shift
    const compute = () => {
      const wrapEl = wrapRef.current
      const menuEl = anchor.current ? anchor.current.querySelector('.wbh-menu') : null
      const rowEl = itemRefs.current[kind]
      if (!wrapEl || !menuEl || !rowEl) return
      const vw = window.innerWidth || document.documentElement.clientWidth || 0
      const vh = window.innerHeight || document.documentElement.clientHeight || 0
      if (!vw || !vh) return
      const menuRect = menuEl.getBoundingClientRect()
      const menuTop = menuRect.top
      const limit = vw - MARGIN
      // 面板左缘 = 菜单右缘 − 5（官方实测）；layer 可能已被整体左移，这里先还原再算
      const naturalW = PANEL_WIDTH[kind] || 240
      const unshiftedMenuLeft = menuRect.left + shift
      const desiredWrapLeft = unshiftedMenuLeft + 194
      // 官方只夹宽度、不翻转；但 DSH 的「+」比官方靠右，窄窗时右侧空间会不足，
      // 这时把整个 picker（一级菜单+面板）一起左移，保证两边都不出窗。
      const overflow = desiredWrapLeft + naturalW - limit
      const nextShift = overflow > 0
        ? Math.max(0, Math.round(Math.min(overflow, Math.max(0, unshiftedMenuLeft - MARGIN))))
        : 0
      const wrapLeft = desiredWrapLeft - nextShift
      const maxH = Math.max(140, Math.round(vh - MARGIN * 2))
      const maxW = Math.max(140, Math.round(limit - wrapLeft))
      // 当前（可能已被上限夹住的）高度；上限生效时高度就是 maxH
      const h = Math.min(wrapEl.offsetHeight || 0, maxH)
      let top = rowEl.offsetTop
      if (menuTop + top + h > vh - MARGIN) top = (vh - MARGIN - h) - menuTop
      if (menuTop + top < MARGIN) top = MARGIN - menuTop
      top = Math.round(top)
      setGeom(prev => (prev.top === top && prev.maxH === maxH && prev.maxW === maxW && prev.shift === nextShift
        ? prev : { top, maxH, maxW, shift: nextShift }))
    }
    compute()
    let observer = null
    const wrapEl = wrapRef.current
    if (wrapEl && typeof ResizeObserver === 'function') {
      observer = new ResizeObserver(compute)
      observer.observe(wrapEl)
    }
    window.addEventListener('resize', compute)
    return () => {
      if (observer) observer.disconnect()
      window.removeEventListener('resize', compute)
    }
  }, [pickerOpen, kind, geom.maxH, geom.shift])

  const attach = useCallback(async (entry, task = '') => {
    const key = `${entry.kind}/${entry.name}`
    setBusy(key); setNotice('')
    // 官方逻辑：选中即刻在聊天框出现该项的 chip（按会话隔离）。
    addSelection(entry, sessionId)
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
          addSelection(entry, sessionId)
          setNotice(`已连接「${entry.displayName}」（工具命名空间 ${r.serverName}），下一次模型步骤起可用。`)
        }
      } else if (entry.kind === 'expert') {
        // picker 在 composer 里 → 用户已在一个会话中：选中即加载到**当前会话**
        // （不新建会话）。「新建会话 + 该专家」的场景走市场页的「召唤」。
        // 专家是**单槽位**：宿主 mountEntry 会摘掉旧专家，这里 chip 同步替换并提示。
        await hub.mount(sessionId, entry.kind, entry.name)
        const replacedExperts = addSelection(entry, sessionId)
        setNotice(replacedExperts.length
          ? `已替换「${replacedExperts[0].displayName}」→「${entry.displayName}」，下一步起以该专家身份回答`
          : `已选中「${entry.displayName}」，下一步起以该专家身份回答`)
      } else {
        await hub.mount(sessionId, entry.kind, entry.name)
        addSelection(entry, sessionId)
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

  // 二级面板底部：未登录（或已登录但凭证失效）时加一行登录入口（三个面板都能看到，
  // 因为放在 footer 里）。登录方式只有二维码一种，点开的是 variant="modal" 的同一个登录卡组件。
  // auth 还没拉到时先不显示（避免「已登录」被闪成未登录）。
  const authStaleNow = auth?.configured === true && auth?.stale === true
  const authFooter = (auth == null || (auth.configured === true && !authStaleNow)) ? null : (
    <div className="wbh-flyoutFooterItem wbh-flyoutLogin" role="menuitem" tabIndex={0}
      onClick={e => { e.stopPropagation(); setShowAuth(true) }}
      onKeyDown={e => { if (e.key === 'Enter') setShowAuth(true) }}>
      <span className="wbh-flyoutFooterIcon"><PickIcon name="tabExpert" size={16} /></span>
      <span className="wbh-flyoutFooterLabel">{authStaleNow ? '登录已失效 · 重新扫码' : '未登录 · 登录后可加载官方目录'}</span>
    </div>
  )

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
          <div className="wbh-pickerLayer" ref={layerRef}
            style={geom.shift ? { transform: `translateX(-${geom.shift}px)` } : undefined}>
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
              <div className="wbh-flyoutWrap" ref={wrapRef}
                style={{
                  top: `${geom.top}px`,
                  '--wbh-maxh': geom.maxH ? `${geom.maxH}px` : 'none',
                  '--wbh-maxw': geom.maxW ? `${geom.maxW}px` : 'none',
                }}>
                <Catalogue
                  variant="picker" sessionId={sessionId} kind={kind} onKind={setKind}
                  query={query} onQuery={setQuery} onDetail={onDetail} onAction={onAction}
                  installed={installed} mounted={mounted} busy={busy}
                  footerExtra={authFooter}
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
      {showAuth && (
        <WbAuthCard variant="modal"
          reason={authStaleNow ? STALE_LOGIN_REASON : ''}
          onClose={() => { setShowAuth(false); settleAuthGate(false); void refreshAuth() }}
          onDone={() => { void refresh() }} />
      )}
    </div>
  )
}
