import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { hub, onCatalogChange, addSelection, removeSelection, openMarket, onMarketRequest, consumePendingMarket, recentExpertNames, authState, onAuthChange, refreshAuth, requireAuth, authStale, STALE_LOGIN_REASON } from './hub.js'
import { insertPromptIntoComposer } from './insert-prompt.js'
import { WbIcon } from './icons.js'
import { PickIcon } from './picker-icons.js'
import WbAuthCard from './WbAuthCard.jsx'
import './official-skill.css'
import './official-connector.css'
import './official-skeleton.css'
import './official-button.css'

const KINDS = [
  { id: 'expert', label: '专家', icon: 'person' },
  { id: 'skill', label: '技能', icon: 'sparkle' },
  { id: 'connector', label: '连接器', icon: 'link' },
]

/** 官方排序控件（.ec-sort-group / .ec-sort-btn）。 */
const SORTS = [
  { id: 'reco', label: '综合' },
  { id: 'hot', label: '最热' },
  { id: 'new', label: '最新' },
]

// 官方顶栏三个 tab 的图标（取自官方 .um-tab 内联 SVG 原文）
const TAB_ICON = { expert: 'tabExpert', skill: 'tabSkill', connector: 'tabConnector' }

// 官方每个页面的搜索占位文案（CDP 实测：专家页更长）
const SEARCH_PLACEHOLDER = {
  expert: '搜索专家职称或描述',
  skill: '搜索技能',
  connector: '搜索连接器',
}

const FALLBACK_COLORS = 6

/** 官方按条目稳定取一个 fallback 底色（--ec-avatar-fallback-bg-N）。 */
function fallbackIndex(seed = '') {
  let h = 0
  for (const ch of String(seed)) h = (h * 31 + ch.codePointAt(0)) >>> 0
  return (h % FALLBACK_COLORS) + 1
}

function numeric(value) {
  const n = parseFloat(String(value ?? '').replace(/[^\d.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

/**
 * 官方图标显示逻辑：有 icon 用 <img>；加载失败或没有 icon 时退化为官方
 * .ec-avatar-sq-fallback（首字 + 稳定底色），不显示破图。
 */
/**
 * 官方「无图标」逻辑分两套，按场景各用各的（都是从线上产物实测得到的值）：
 *  1) 市场卡片 .ec-avatar-sq-fallback + --ec-avatar-fallback-bg-N 稳定取色（official.css）
 *  2) picker 小图标（本函数 fallbackTint 传入）：连接器/专家为中性灰底 rgba(0,0,0,.08)
 *     + rgba(0,0,0,.7) 首字 10px/400（官方 4 例实测）；技能为品牌浅底 #dbe4ff +
 *     #4263eb 首字 9px/600 圆角 6px（官方 1 例实测，具体调色板未取到，官方疑似按条目着色）
 */
function EntryIcon({ entry, size = 44, round = true, radius: radiusOverride, fallbackTint }) {
  const [broken, setBroken] = useState(false)
  const label = entry.displayName || entry.name || '?'
  // 官方 picker 的圆角：技能 6px、连接器 3px、专家 50%（各自取自官方 _itemIcon_* 规则）
  const radius = radiusOverride ?? (round ? '50%' : `${Math.max(6, Math.round(size * 0.21))}px`)
  if (!entry.icon || broken) {
    const tint = fallbackTint || null
    return (
      <div className="ec-avatar-sq-fallback"
        style={{
          background: tint ? tint.bg : `var(--ec-avatar-fallback-bg-${fallbackIndex(entry.name || label)})`,
          color: tint ? tint.color : undefined,
          fontWeight: tint ? tint.fontWeight : undefined,
          borderRadius: radius,
          fontSize: tint ? tint.fontSize : (size <= 16 ? 9 : Math.max(11, Math.round(size * 0.42))),
          width: '100%', height: '100%',
        }}>
        {label.slice(0, 1)}
      </div>
    )
  }
  return (
    <img src={entry.icon} alt="" loading="lazy" decoding="async"
      onError={() => setBroken(true)}
      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: radius, flexShrink: 0, background: 'rgba(128,128,128,.15)' }} />
  )
}

/** 官方 picker 无图标时的着色（取值见 EntryIcon 注释）。 */
const PICKER_TINT = {
  expert: { bg: 'rgba(0,0,0,.08)', color: 'rgba(0,0,0,.7)', fontSize: 10, fontWeight: 400 },
  connector: { bg: 'rgba(0,0,0,.08)', color: 'rgba(0,0,0,.7)', fontSize: 10, fontWeight: 400 },
  skill: { bg: '#dbe4ff', color: '#4263eb', fontSize: 9, fontWeight: 600 },
}

function SkillCard({ entry, busy, onDetail, onAction }) {
  const key = `${entry.kind}/${entry.name}`
  return (
    <div className="skill-card" role="button" tabIndex={0}
      onClick={() => onDetail?.(entry)}
      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onDetail?.(entry) } }}>
      <div className="skill-card-content">
        <div className="skill-card-icon">
          <EntryIcon entry={entry} size={28} round={false} />
        </div>
        <div className="skill-card-top">
          <div className="skill-card-body">
            <div className="skill-card-name-row">
              <span className="skill-card-name">{entry.displayName}</span>
            </div>
          </div>
        </div>
        <button type="button" className="skill-add-btn" aria-label={`安装 ${entry.displayName}`}
          disabled={busy === key}
          onClick={e => { e.stopPropagation(); onAction?.(entry) }}>
          <WbIcon name="plus" size={14} />
        </button>
      </div>
      <div className="skill-card-desc skill-card-desc--two-lines">{entry.description || entry.name}</div>
    </div>
  )
}

function ExpertCard({ entry, kindLabel, busy, onDetail, onAction }) {
  const key = `${entry.kind}/${entry.name}`
  const label = busy === key ? '…' : entry.kind === 'expert' ? '召唤' : '连接'
  return (
    <article className={`ec-expert-card${entry.kind === 'expert' ? ' ec-expert-card--selectable' : ''}`}
      role="button" tabIndex={0}
      onClick={() => onDetail?.(entry)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onDetail?.(entry) } }}>
      <button type="button" className="ec-card-summon-btn ec-card-summon-btn--top"
        disabled={busy === key}
        aria-label={`${label}${entry.displayName}`}
        onClick={e => { e.stopPropagation(); onAction?.(entry) }}>
        {label}
      </button>
      <div className="ec-card-main">
        <div className="ec-card-head">
          <div className="ec-card-avatar-sq">
            <EntryIcon entry={entry} size={44} round />
          </div>
          <div className="ec-card-body">
            <div className="ec-card-title-row">
              <div className="ec-card-role-wrap">
                <div className="ec-card-role">{entry.displayName}</div>
              </div>
            </div>
            <div className="ec-card-subtitle">{entry.subtitle || kindLabel}</div>
          </div>
        </div>
        <div className="ec-card-desc">{entry.description || entry.name}</div>
        <div className="ec-card-tags">
          {(entry.tags ?? []).slice(0, 3).map(t => <span key={t} className="ec-card-tag">{t}</span>)}
        </div>
      </div>
    </article>
  )
}

function ConnectorCard({ entry, busy, onDetail, onAction, onConnectorAction, bound }) {
  const key = `${entry.kind}/${entry.name}`
  const enabled = bound ? bound.includes(entry.name) : Boolean(entry._enabled || entry.isConnected)
  const dot = busy === key ? 'connecting' : enabled ? 'connected' : ''
  return (
    <div className={`connector-card ${enabled ? 'connector-card--installed' : 'connector-card--available'}`} role="button" tabIndex={0}
      onClick={() => onDetail?.(entry)}
      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onDetail?.(entry) } }}>
      <div className="connector-card-icon">
        <EntryIcon entry={entry} size={28} round />
      </div>
      <div className="connector-card-main">
        <div className="connector-card-name-row">
          <div className="connector-card-name">{entry.displayName}</div>
          {dot && <span className={`connector-card-status-dot connector-card-status-dot--${dot}`} />}
        </div>
        <div className="connector-card-desc">{entry.description || entry.name}</div>
      </div>
      <div className="connector-card-action">
        <button type="button" className="wb-button wb-button--secondary wb-button--medium"
          disabled={busy === key} aria-label={`${enabled ? '解绑' : '连接'} ${entry.displayName}`}
          onClick={e => { e.stopPropagation(); void onConnectorAction?.(entry) }}>
          {busy === key ? '…' : enabled ? '解绑' : '连接'}
        </button>
      </div>
    </div>
  )
}

export default function Catalogue({
  sessionId, kind, onKind, query, onQuery, onDetail, onAction,
  installed = {}, mounted = new Set(), busy = '', variant = 'page', onRefresh, footerExtra = null,
  topbarRight = null, onSettled = null, onMore = null,
}) {
  const [rows, setRows] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [failed, setFailed] = useState('')
  const [source, setSource] = useState('')      // 列表来源：official | mirror（如实标注给用户看）
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('reco')
  const [featured, setFeatured] = useState([])
  const [localRows, setLocalRows] = useState([])
  const [segment, setSegment] = useState(0)
  const [view, setView] = useState('market')      // market | installed | local
  const [addMenu, setAddMenu] = useState(false)
  const [localOnly, setLocalOnly] = useState(false)
  const [detail, setDetail] = useState(null)   // 技能/连接器的二级界面
  const [bound, setBound] = useState([])       // 官方已绑定的连接器（真实连接态）
  const [hostMcp, setHostMcp] = useState([])   // 宿主侧 MCP 总清单（含 DSH 机制加载的）
  const [notice, setNotice] = useState('')     // 操作结果提示（连接/解绑失败等）
  const [busyLocal, setBusyLocal] = useState('')  // 本组件内发起的连接/解绑进行中态
  const [pendingAuth, setPendingAuth] = useState(null)  // 待完成的授权（含可点链接）
  const [nativeRow, setNativeRow] = useState(null)      // 只读导出的原生 mcp-client 行
  const [toolInfo, setToolInfo] = useState(null)        // 连接器暴露的工具清单
  const [pinned, setPinned] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('wbh-pinned') || '[]')) } catch { return new Set() }
  })
  // 置顶条目连数据一起存，保证它会「永远显示」（即使它不在当前列表来源里）
  const [pinnedEntries, setPinnedEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wbh-pinned-entries') || '[]') } catch { return [] }
  })
  const scrollRef = useRef(null)

  const PAGE_SIZE = 60
  const hubSkills = useMemo(
    () => Object.entries(installed)
      .filter(([, rec]) => rec?.kind === 'skill')
      .map(([key, rec]) => ({
        key, kind: 'skill', name: rec.name || key.split('/')[1],
        displayName: rec.displayName || rec.name, description: rec.description || '', icon: rec.icon || '',
      })),
    [installed],
  )

  useEffect(() => { setCategory(''); setSort('reco'); setSegment(0); setPage(1); setView('market'); setDetail(null) }, [kind])

  useEffect(() => {
    let live = true
    hub.categories(kind).then(c => { if (live) setCategories(c) }).catch(() => {})
    if (kind === 'skill') hub.localSkills().then(r => { if (live) setLocalRows(r) }).catch(() => {})
    hub.boundConnectors().then(r => { if (live) setBound(r.map(x => x.name)) }).catch(() => {})
    return () => { live = false }
  }, [kind])

  // 「最近专家」顺序快照（见下方 picker 排序处的说明）
  const [recentSnapshot, setRecentSnapshot] = useState(() => recentExpertNames())
  useEffect(() => { setRecentSnapshot(recentExpertNames()) }, [kind, query])

  // 宿主侧 MCP 总清单（picker 的「本机 MCP」一节）：本插件托管的本地 MCP + DSH 自己
  // 加载的（其它插件/配置行）。后者只读展示——插件不代管别人的配置。
  const refreshHostMcp = useCallback(() => {
    hub.hostMcpList()
      .then(r => setHostMcp(Array.isArray(r?.servers) ? r.servers : []))
      .catch(() => setHostMcp([]))
  }, [])
  useEffect(() => { if (variant === 'picker') refreshHostMcp() }, [variant, kind, refreshHostMcp])

  // 本机 MCP 的启/停（picker 里那一节的开关调用）。失败如实提示，绝不乐观改状态。
  const localMcpAction = useCallback(async entry => {
    const key = `mcp/${entry.name}`
    setBusyLocal(key); setNotice('')
    try {
      const r = entry.enabled ? await hub.localMcpDisable(entry.name) : await hub.localMcpEnable(entry.name)
      if (r && r.ok === false) setNotice(`${entry.enabled ? '停用' : '启用'}「${entry.name}」失败：${r.error || ''}`)
      else setNotice(entry.enabled
        ? `已停用本机 MCP「${entry.name}」`
        : `已启用本机 MCP「${entry.name}」，${Number(r?.toolCount ?? 0) || '其'}个工具下一次模型步骤起可用`)
    } catch (error) {
      setNotice(`操作失败：${String(error?.message || error)}`)
    } finally {
      setBusyLocal('')
      refreshHostMcp()
      await onRefresh?.()
    }
  }, [onRefresh, refreshHostMcp])

  // 行加载完成后通知父组件（picker 用它把面板位置定下来再显示，避免异步加载导致面板
  // 在鼠标底下跳位）。loading 由 true 变 false 那一刻即「就绪」。
  useEffect(() => { if (!loading) onSettled?.() }, [loading, kind, query, onSettled])

  const load = useCallback(async (targetPage, replace) => {
    if (replace) { setLoading(true); setFailed('') } else setLoadingMore(true)
    try {
      const r = await hub.list(kind, { query, category, page: targetPage, pageSize: PAGE_SIZE })
      if (replace && kind === 'skill') setFeatured([...r.rows].sort(() => Math.random() - 0.5).slice(0, 5))
      if (replace) setSource(r.source || '')
      setRows(prev => {
        if (replace) return r.rows
        const seen = new Set(prev.map(p => `${p.kind}/${p.name}`))
        return [...prev, ...r.rows.filter(x => !seen.has(`${x.kind}/${x.name}`))]
      })
      setHasMore(Boolean(r.hasMore))
    } catch (e) {
      if (replace) { setFailed(e.message); setRows([]); setSource('') }
      setHasMore(false)
    } finally { setLoading(false); setLoadingMore(false) }
  }, [kind, query, category])

  useEffect(() => { setPage(1); void load(1, true) }, [load])
  // 面板刚被切过来时，请求是在本组件挂载前发出的：挂载后补消费一次。
  useEffect(() => {
    const pending = consumePendingMarket()
    if (!pending) return
    if (pending.kind) onKind?.(pending.kind)
    setView(pending.view || 'market')
  }, [onKind])

  useEffect(() => onMarketRequest(req => {
    if (req?.kind) onKind?.(req.kind)
    setView(req?.view || 'market')
  }), [onKind])

  useEffect(() => onCatalogChange(() => {
    void load(1, true)
    hub.boundConnectors().then(r => setBound(r.map(x => x.name))).catch(() => {})
  }), [load])

  // 登录态：市场页 / picker / 连接器页共用同一个 store（见 hub.js 的 authState/onAuthChange）
  const [auth, setAuth] = useState(() => authState())
  const authRef = useRef(authState())
  useEffect(() => {
    if (authState() === null) void refreshAuth()
    return onAuthChange(next => {
      const was = authRef.current
      authRef.current = next
      setAuth(next)
      // 登录成功（未登录 → 已登录）后自动刷新连接器列表：登录完就能看到数据。
      // was 为 null（首次拉取）时不算「登录成功」，避免和挂载时的 load 重复请求。
      // 「stale → 重新登录成功」也走这里：was.stale 为真说明凭证失效过，必须重拉。
      if (next?.configured === true && next?.stale !== true && was
        && (was.configured !== true || was.stale === true)) {
        void load(1, true)
        hub.boundConnectors().then(r => setBound(r.map(x => x.name))).catch(() => {})
      }
    })
  }, [load])
  const loggedIn = auth?.configured === true
  // 已登录但凭证已失效（stale）→ 连接器页视同未登录：显示登录卡而不是一堆静默失败
  const authStaleNow = loggedIn && auth?.stale === true
  const isBound = useCallback(entry => bound.includes(entry.name), [bound])

  // 卸载必须带**显式 sessionId**：宿主路由缺 sessionId 一律 409（防「挂到用户没在看的会话」
  // 的老缺陷），所以 hub.unmount(undefined,…) 是静默失败——本会话的挂载会残留下来。
  const unmountHere = useCallback((kind, name) => (
    sessionId ? hub.unmount(sessionId, kind, name).catch(() => {}) : Promise.resolve()
  ), [sessionId])

  // 懒加载：接近底部继续取下一页
  const onScroll = useCallback(e => {
    const el = e.currentTarget
    if (!hasMore || loading || loadingMore) return
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 480) setPage(p => p + 1)
  }, [hasMore, loading, loadingMore])

  useEffect(() => { if (page > 1) void load(page, false) }, [page, load])

  const visible = useMemo(() => {
    // 连接器：官方把已安装/已绑定的排在最前（实测 .connector-card--installed 是第 0 张），
    // 其余保持服务端顺序（stable sort）。
    if (kind === 'connector') {
      if (bound.length === 0) return rows
      const rank = x => (bound.includes(x.name) ? 0 : 1)
      return [...rows].sort((a, b) => rank(a) - rank(b))
    }
    if (kind !== 'expert' || sort === 'reco') return rows
    const copy = [...rows]
    if (sort === 'hot') copy.sort((a, b) => numeric(b.useCount) - numeric(a.useCount))
    else if (sort === 'new') copy.sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))
    return copy
  }, [rows, sort, kind, bound])

  // 连接器：已绑定=解绑；未绑定=发起官方 OAuth 并打开授权页；失败明确报错
  // 只读导出：生成可粘贴的原生 mcp-client overlay 行（不写 profile）
  const exportNativeRow = useCallback(async entry => {
    setBusyLocal(`${entry.kind}/${entry.name}`); setNotice('')
    try {
      const r = await hub.connectorNativeRow(entry.name)
      if (r?.ok) { setNativeRow(r); setNotice(r.conflict ? '注意：该 serverName 已在 profile 中声明，粘贴前请改名' : '') }
      else setNotice(`导出失败：${r?.error || '未知错误'}`)
    } catch (error) { setNotice(`导出失败：${String(error?.message || error)}`) } finally { setBusyLocal('') }
  }, [])

  const loadTools = useCallback(async entry => {
    setBusyLocal(`${entry.kind}/${entry.name}`); setNotice('')
    try {
      const r = await hub.connectorTools(entry.name)
      if (r?.ok) setToolInfo(r)
      else setNotice(`读取工具清单失败：${r?.error || '未知错误'}`)
    } catch (error) { setNotice(`读取工具清单失败：${String(error?.message || error)}`) } finally { setBusyLocal('') }
  }, [])

  const connectorRevoke = useCallback(async entry => {
    const key = `${entry.kind}/${entry.name}`
    setBusyLocal(key); setNotice('')
    try {
      await hub.disableConnector(entry.name).catch(() => {})
      const r = await hub.connectorUnbind(entry.name)
      if (r?.ok) await unmountHere(entry.kind, entry.name)
      setNotice(r?.ok ? `已解绑「${entry.displayName}」` : `解绑失败：${r?.message || '官方未确认'}`)
      const fresh = await hub.boundConnectors().catch(() => [])
      setBound(fresh.map(x => x.name))
      await onRefresh?.()
    } catch (error) { setNotice(`解绑失败：${String(error?.message || error)}`) } finally { setBusyLocal('') }
  }, [onRefresh])

  const pollOauth = useCallback(async entry => {
    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 3000))
      try {
        const st = await hub.connectorOauthStatus(entry.name)
        if (st?.connected) {
          const fresh = await hub.boundConnectors().catch(() => [])
          setBound(fresh.map(x => x.name))
          setPendingAuth(null)
          const ins = await hub.connectorInstall(entry.name).catch(() => null)
          const en = ins?.ok ? await hub.enableConnector(entry.name).catch(() => null) : null
          setNotice(en?.ok ? `「${entry.displayName}」已连接并启用，可在对话中使用`
                           : `「${entry.displayName}」已连接（本地启用：${ins?.flags?.[0] || en?.error || '待重试'}）`)
          await onRefresh?.()
          return
        }
      } catch { /* 继续轮询 */ }
    }
    setNotice(`「${entry.displayName}」授权尚未完成，可稍后重试`)
  }, [onRefresh])

  const connectorAction = useCallback(async entry => {
    const key = `${entry.kind}/${entry.name}`
    setBusyLocal(key); setNotice('')
    // 动作级 JIT 登录：连接/绑定/启用都走官方 OAuth，未登录时先就地拉起登录卡，
    // 登录成功后**自动继续**刚才被拦下的动作（requireAuth 的 resolve 语义）。
    // 「已登录但 stale」同样要拦：凭证已彻底失效，继续下去只会静默失败。
    const staleNow = authStale(authState())
    if (authState()?.configured !== true || staleNow) {
      setBusyLocal('')
      setNotice(staleNow
        ? `登录已失效，请重新扫码后再连接「${entry.displayName}」`
        : `连接「${entry.displayName}」需要 WorkBuddy 账号，请扫码登录`)
      try {
        await requireAuth({
          reason: staleNow ? STALE_LOGIN_REASON : `连接「${entry.displayName}」需要 WorkBuddy 账号`,
          // 由发起动作的那个界面显示登录卡：page=市场页，picker=输入框「＋」
          surface: variant === 'picker' ? 'picker' : 'page',
        })
      } catch (error) {
        setNotice(String(error?.message || error) === '用户取消了登录' ? '已取消登录' : `无法登录：${String(error?.message || error)}`)
        return
      }
      setBusyLocal(key)
      setNotice('登录成功，正在继续…')
    }
    // 浏览器只允许在「用户手势」的同步阶段开窗；await 之后再 window.open 会被拦截。
    // 因此这里先同步开一个空窗，拿到授权链接后再把地址写进去。
    let authWindow = null
    if (!isBound(entry)) { try { authWindow = window.open('about:blank', '_blank') } catch { authWindow = null } }
    try {
      // 已授权连接器：行内开关只做「本地启用/停用」，不撤销官方授权（解绑在详情弹窗里）。
      if (isBound(entry)) {
        const rec = installed[`connector/${entry.name}`]
        if (rec?.enabled) {
          await hub.disableConnector(entry.name)
          await unmountHere(entry.kind, entry.name)
          // 关掉 = 不再「已加载」→ 输入框下方的 chip 也要撤掉（rail 只表示真的开着）
          removeSelection(sessionId, entry.kind, entry.name)
          setNotice(`已停用「${entry.displayName}」（官方授权仍保留）`)
        } else {
          const ins = await hub.connectorInstall(entry.name)
          if (!ins?.ok) setNotice(`启用失败：${ins?.error || '本地登记失败'}`)
          else {
            const en = await hub.enableConnector(entry.name)
            if (en?.ok) {
              // 打开 = 启用 + 挂到当前会话 → 立刻在输入框下方出现该 MCP 的 chip（带官方 icon）
              if (sessionId) await hub.mount(sessionId, entry.kind, entry.name).catch(() => {})
              addSelection(entry, sessionId)
              setNotice(`已启用「${entry.displayName}」，已加到本会话，工具下一次模型步骤起可用`)
            } else {
              setNotice(`启用失败：${en?.error || ''}`)
            }
          }
        }
        await onRefresh?.()
        return
      }
      if (isBound(entry)) {
        const r = await hub.connectorUnbind(entry.name)
        if (r?.ok) await unmountHere(entry.kind, entry.name)
        setNotice(r?.ok ? `已解绑「${entry.displayName}」` : `解绑失败：${r?.message || '官方未确认'}`)
      } else {
        const r = await hub.connectorAuthStart(entry.name)
        if (r?.ok && r.url) {
          if (authWindow && !authWindow.closed) authWindow.location.href = r.url
          setPendingAuth({ name: entry.name, displayName: entry.displayName, url: r.url })
          setNotice(`请在打开的页面完成「${entry.displayName}」授权；若没有自动打开，点下面链接`)
          // 官方同样是 start 之后轮询 status 等授权完成
          void pollOauth(entry)
        } else {
          try { authWindow?.close() } catch { /* 忽略 */ }
          setNotice(`连接「${entry.displayName}」失败：${r?.message || '官方未返回授权链接'}`)
        }
      }
      const fresh = await hub.boundConnectors().catch(() => [])
      setBound(fresh.map(x => x.name))
      await onRefresh?.()
    } catch (error) {
      try { authWindow?.close() } catch { /* 忽略 */ }
      setNotice(`操作失败：${String(error?.message || error)}`)
      // 失败原因可能是凭证失效（官方 12153）：顺手重拉一次登录态，
      // 宿主一旦判 stale，本页立刻切成登录卡，而不是让用户继续撞同一堵墙。
      void refreshAuth()
    } finally { setBusyLocal('') }
  }, [isBound, onRefresh, installed])

  const handleDetail = useCallback(entry => {
    if (entry.kind === 'expert') { onDetail?.(entry); return }
    setDetail(entry)
  }, [onDetail])

  // 技能：选中即把「/技能名」写进聊天输入框（DSH 的 skill 调用样式），并显示 chip
  const handleSkillPick = useCallback(entry => {
    insertPromptIntoComposer(`/${entry.name} `)
    addSelection(entry, sessionId)
  }, [sessionId])

  const togglePin = useCallback(entry => {
    const key = `${entry.kind}/${entry.name}`
    setPinned(prev => {
      const next = new Set(prev)
      const on = !next.has(key)
      if (on) next.add(key); else next.delete(key)
      try { localStorage.setItem('wbh-pinned', JSON.stringify([...next])) } catch { /* 忽略 */ }
      setPinnedEntries(list => {
        const nextList = on
          ? [...list.filter(x => `${x.kind}/${x.name}` !== key), { kind: entry.kind, name: entry.name, displayName: entry.displayName, description: entry.description || '', icon: entry.icon || '' }]
          : list.filter(x => `${x.kind}/${x.name}` !== key)
        try { localStorage.setItem('wbh-pinned-entries', JSON.stringify(nextList)) } catch { /* 忽略 */ }
        return nextList
      })
      return next
    })
  }, [])

  // 未装任何专家时：随机 5 个，但按「当天」做种子，保证同一天内稳定不变。
  const expertFallback = useMemo(() => {
    const seedText = new Date().toISOString().slice(0, 10)
    let h = 0
    for (const ch of seedText) h = (h * 31 + ch.codePointAt(0)) >>> 0
    const pool = [...rows]
    const picked = []
    while (picked.length < 5 && pool.length > 0) {
      h = (h * 1103515245 + 12345) >>> 0
      picked.push(pool.splice(h % pool.length, 1)[0])
    }
    return picked
  }, [rows])

  const kindMeta = KINDS.find(k => k.id === kind) || KINDS[0]

  const busyAll = busyLocal || busy

  // 连接器页 / 技能页未登录（或已登录但凭证失效）：不显示「暂无连接器/技能」空白、
  // 也不显示镜像目录，直接就地嵌登录卡（无遮罩、不可关闭），并在卡上说明原因。
  // 技能与连接器的官方数据都需要账号（技能目录 + 技能包下载、连接器注册表 + 授权）。
  // picker（variant==='picker'）不改：它的 footer 登录行已覆盖三个面板。
  const pageLoginGate = (variant === 'page' && (kind === 'connector' || kind === 'skill'))
    ? (auth === null
      ? <div className="wbh-state"><p>正在读取登录状态…</p></div>
      : (loggedIn && !authStaleNow
        ? null
        : (
          <div className="wbh-loginGate">
            <WbAuthCard variant="inline" title="登录 WorkBuddy 账号"
              reason={authStaleNow ? STALE_LOGIN_REASON
                : (kind === 'connector'
                  ? '连接器目录、账号绑定与授权需要 WorkBuddy 账号'
                  : '技能目录与技能包下载需要 WorkBuddy 账号')} />
          </div>
        )))
    : null

  // 已登录但官方接口失败 → 宿主用镜像目录兜底；来源必须如实标注给用户
  const sourceNote = kind === 'connector' && loggedIn && source === 'mirror'
    ? <div className="wbh-sourceNote">官方连接器接口暂不可用，当前显示镜像目录（source: mirror）</div>
    : null

  const skeletonCards = (
    <>{Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="wbh-skelCard">
        <div className="wbh-skelHead">
          <div className="wbh-skelAvatar" />
          <div className="wbh-skelLines">
            <div className="wbh-skelRow" style={{ width: '45%' }} />
            <div className="wbh-skelRow short" />
          </div>
        </div>
        <div className="wbh-skelRow" />
        <div className="wbh-skelRow short" />
      </div>
    ))}</>
  )

  // 官方 tab：.um-tab 28px / p 0 10 / gap 4 / r8 / 14px 600；激活态黑底白字
  // (rgba(0,0,0,.75))，图标用官方 SVG（14px）
  const kindTabs = (
    <div className="um-header__tabs ec-topbar__left" role="tablist">
      {KINDS.map(k => (
        <button key={k.id} type="button" role="tab" aria-selected={kind === k.id}
          className={`um-tab${kind === k.id ? ' um-tab--active' : ''}`}
          data-track-name="专家/技能/连接器"
          onClick={() => onKind(k.id)}>
          <PickIcon name={TAB_ICON[k.id]} size={14} />
          <span>{k.label}</span>
        </button>
      ))}
    </div>
  )

  // 搜索关键词变化时重置「推荐/套件」分段（官方搜索结果是平铺列表，没有分段）：
  // 否则切到「套件」后搜索，segment 仍是 1，行为说不清（真实 UI 复现过）。
  const trimmedQuery = String(query ?? '').trim()
  useEffect(() => { setSegment(0) }, [trimmedQuery])

  // 官方搜索框：.ec-search-wrapper 220x32 > .wb-input-wrapper--medium
  // (p 0 8 / gap 4 / r8 / #f2f2f2 / border 1px rgba(0,0,0,.08)) + prefix 图标 14px
  // + input 16px + placeholder rgba(0,0,0,.3)；占位文案官方每页不同
  const searchBox = (
    <div className="ec-search-wrapper">
      <span className="wb-input-wrapper wb-input-wrapper--medium">
        <span className="wb-input__prefix"><PickIcon name="searchFilled" size={14} /></span>
        <input className="wb-input__inner" value={query} placeholder={SEARCH_PLACEHOLDER[kind]}
          aria-label={`搜索${kindMeta.label}`} onChange={e => onQuery(e.target.value)} />
      </span>
    </div>
  )

  const sortGroup = kind === 'expert' ? (
    <div className="ec-sort-group" role="tablist" aria-label="排序">
      {SORTS.map(s => (
        <button key={s.id} type="button" role="tab" aria-selected={sort === s.id}
          className={`ec-sort-btn${sort === s.id ? ' is-active' : ''}`}
          onClick={() => setSort(s.id)}>{s.label}</button>
      ))}
    </div>
  ) : null

  // 官方三页的分类栏各不相同，逐页对齐（CDP 实测）：
  //   专家页 → .ec-category-tabs，带条目数（技术工程(826)）
  //   技能页 → .category-chip（全部/OPC·一人公司/办公协同/…）
  //   连接器页 → 没有分类栏（此前误用了专家分类，且点哪个都不生效）
  const categoryChips = kind === 'skill'
    ? (
      <div className="category-chip-list">
        <button type="button" className={`category-chip${category === '' ? ' category-chip--active' : ''}`} onClick={() => setCategory('')}>
          <span className="category-chip-label">全部</span></button>
        {categories.map(c => (
          <button key={c.id} type="button" className={`category-chip${category === c.id ? ' category-chip--active' : ''}`} onClick={() => setCategory(c.id)}>
            <span className="category-chip-label">{c.label}</span></button>
        ))}
      </div>
    )
    : kind === 'expert'
      ? (
        <div className="ec-category-tabs-wrap">
          <div className="ec-category-tabs">
            <button type="button" className={`ec-category-tab${category === '' ? ' is-active' : ''}`} onClick={() => setCategory('')}>全部</button>
            {categories.map(c => (
              <button key={c.id} type="button" className={`ec-category-tab${category === c.id ? ' is-active' : ''}`} onClick={() => setCategory(c.id)}>
                {c.label}{c.count != null ? <span className="ec-category-tab-count">({c.count})</span> : null}
              </button>
            ))}
          </div>
        </div>
      )
      : null

  const cardGrid = kind === 'expert'
    ? (
      <div className="ec-expert-grid">
        {loading && skeletonCards}
        {!loading && failed && <div className="wbh-state">读取失败：{failed}</div>}
        {!loading && !failed && visible.length === 0 && (
          <div className="wbh-state"><WbIcon name={kindMeta.icon} size={40} />
            <p>{String(query).trim()
              ? `没有找到与「${String(query).trim()}」匹配的${kindMeta.label}，试试其他关键词`
              : `暂无该分类的条目`}</p>
          </div>
        )}
        {visible.map(entry => (
          <ExpertCard key={`${entry.kind}/${entry.name}`} entry={entry} kindLabel={kindMeta.label}
            busy={busy} onDetail={handleDetail} onAction={onAction} />
        ))}
        {loadingMore && skeletonCards}
      </div>
    )
    : (
      <div className="skills-grid">
        {loading && skeletonCards}
        {!loading && failed && <div className="wbh-state">读取失败：{failed}</div>}
        {!loading && !failed && visible.length === 0 && (
          // 与专家页同口径：有搜索词给「没找到」，没搜索词才是「暂无」——
          // 搜索无命中时「暂无技能」读起来像目录本身空了，误导。
          <div className="wbh-state"><WbIcon name={kindMeta.icon} size={40} />
            <p>{trimmedQuery
              ? `没有找到与「${trimmedQuery}」匹配的${kindMeta.label}，试试其他关键词`
              : `暂无${kindMeta.label}`}</p>
          </div>
        )}
        {visible.map(entry => kind === 'connector'
          ? <ConnectorCard key={`${entry.kind}/${entry.name}`} entry={entry} busy={busyAll} onDetail={handleDetail} onAction={onAction} onConnectorAction={connectorAction} bound={bound} />
          : <SkillCard key={`${entry.kind}/${entry.name}`} entry={entry} busy={busy} onDetail={handleDetail} onAction={onAction} />)}
        {loadingMore && skeletonCards}
      </div>
    )

  const featuredSection = (
    <div className="skills-featured-section">
      <div className="skills-featured-header">
        <div className="skills-featured-title">精选技能</div>
        <button type="button" className="skills-featured-refresh-btn"
          onClick={() => setFeatured([...rows].sort(() => Math.random() - 0.5).slice(0, 5))}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
          </svg>
          <span>换一换</span>
        </button>
      </div>
      <div className="skills-grid">
        {featured.map(entry => (
          <SkillCard key={`f-${entry.kind}/${entry.name}`} entry={entry} busy={busy} onDetail={handleDetail} onAction={onAction} />
        ))}
      </div>
    </div>
  )

  const segmentBar = (
    <div className="skills-segment-bar">
      <div className="skills-segment-group">
        {['推荐', '套件'].map((label, i) => (
          <button key={label} type="button"
            className={`skills-segment-item${segment === i ? ' skills-segment-item--active' : ''}`}
            onClick={() => setSegment(i)}>{label}</button>
        ))}
      </div>
    </div>
  )

  // 官方技能二级页面：.skills-view--detail 顶层，自带 ec-topbar--subpage（返回按钮），
  // 其下 .skill-detail-view = header（名称 + 安装 + 描述）+ content-box（toolbar + preview/meta）。
  const skillDetailView = detail && detail.kind === 'skill' ? (
    <div className="skills-view skills-view--detail">
      <header className="workbuddy-topbar ec-topbar ec-topbar--subpage">
        <div className="ec-topbar__left">
          <button type="button" className="ec-topbar__back" onClick={() => setDetail(null)}>
            <WbIcon name="chevronLeft" size={14} />
            技能
          </button>
        </div>
      </header>
      <div className="skill-detail-view">
        <button type="button" className="skill-detail-back" onClick={() => setDetail(null)} hidden>技能</button>
        <div className="skill-detail-header">
          <div className="skill-detail-header-main">
            <h2>{detail.displayName}</h2>
            <div className="skill-detail-actions">
              <button type="button" className="skillhub-install-btn skillhub-install-btn--install"
                onClick={() => onAction?.(detail)}>
                {busy === `${detail.kind}/${detail.name}` ? '安装中…' : '安装'}
              </button>
            </div>
          </div>
          <p>{detail.description || detail.name}</p>
        </div>
        <div className="skill-detail-content-box">
          <div className="skill-detail-toolbar">
            <button type="button" className="active">概览</button>
          </div>
          <div className="skill-detail-preview">
            <div className="skill-detail-meta-grid">
              <div className="skill-detail-meta-item">
                <span className="skill-detail-meta-label">name</span>
                <span className="skill-detail-meta-value">{detail.name}</span>
              </div>
              <div className="skill-detail-meta-item">
                <span className="skill-detail-meta-label">version</span>
                <span className="skill-detail-meta-value">{detail.version || '1.0.0'}</span>
              </div>
              {detail.subtitle ? (
                <div className="skill-detail-meta-item">
                  <span className="skill-detail-meta-label">profession</span>
                  <span className="skill-detail-meta-value">{detail.subtitle}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null

  const connectorDetailModal = detail && detail.kind === 'connector' ? (
    <div className="connector-detail-overlay connector-detail-modal-overlay"
      onClick={() => setDetail(null)}>
      <div className={`connector-detail-modal${isBound(detail) ? ' connector-detail-modal--connected' : ''}`}
        role="dialog" aria-modal="true" aria-label={detail.displayName}
        onClick={e => e.stopPropagation()}>
        <button type="button" className="connector-detail-close" aria-label="关闭" onClick={() => setDetail(null)}>
          <WbIcon name="close" size={16} />
        </button>
        <div className="connector-detail-modal-fade" aria-hidden="true" />
        <div className="connector-detail-modal-bottom-fade" aria-hidden="true" />
        <div className="connector-detail-modal-body">
          <div className="connector-detail-flow">
            <div className="connector-detail-flow-avatar connector-detail-flow-avatar--workbuddy">
              <span className="wbh-flowBrand">W</span>
            </div>
            {/* 官方 .connector-detail-flow-icon 是三个 6px 圆点（gap 6 → 宽 30×6） */}
            <span className="connector-detail-flow-icon" aria-hidden="true">
              <span /><span /><span />
            </span>
            <div className="connector-detail-flow-avatar connector-detail-flow-avatar--connector">
              <EntryIcon entry={detail} size={28} round />
            </div>
          </div>
          <h3 className="connector-detail-name">{detail.displayName}</h3>
          <p className="connector-detail-desc">{detail.description || detail.name}</p>
          {toolInfo ? (
            <div className="wbh-toolBox">
              <div className="wbh-toolHead">该连接器向模型暴露 <b>{toolInfo.count}</b> 个工具 · 命名空间 <code>{toolInfo.namespace}</code></div>
              <div className="wbh-toolList">
                {toolInfo.labelled.slice(0, 40).map(t => (
                  <div className="wbh-toolRow" key={t.name}>
                    <code>{t.name}</code>
                    <span>{t.description}</span>
                  </div>
                ))}
              </div>
              {toolInfo.count > 40 ? <div className="wbh-toolMore">仅显示前 40 个，共 {toolInfo.count} 个</div> : null}
            </div>
          ) : null}
          {nativeRow ? (
            <div className="wbh-nativeRowBox">
              <pre className="wbh-nativeRow">{nativeRow.row}</pre>
              <div className="wbh-nativeRowFoot">
                <button type="button" className="wb-button wb-button--secondary wb-button--small"
                  onClick={() => { try { void navigator.clipboard?.writeText(nativeRow.row) } catch { /* 忽略 */ } }}>
                  复制
                </button>
                <span className="wbh-nativeRowNote">{nativeRow.note}</span>
              </div>
            </div>
          ) : null}
          <div className="connector-detail-actions">
            <button type="button" className="connector-detail-btn connector-detail-btn--secondary connector-detail-btn--reset"
              disabled={busyLocal === `${detail.kind}/${detail.name}`}
              onClick={() => void (isBound(detail) ? connectorRevoke(detail) : connectorAction(detail))}>
              {isBound(detail) ? '解绑' : '连接'}
            </button>
            <button type="button" className="wb-button wb-button--secondary wb-button--medium"
              disabled={busyLocal === `${detail.kind}/${detail.name}`}
              onClick={() => void exportNativeRow(detail)}>
              导出原生 MCP 配置
            </button>
            <button type="button" className="wb-button wb-button--secondary wb-button--medium"
              disabled={busyLocal === `${detail.kind}/${detail.name}`}
              onClick={() => void loadTools(detail)}>
              {toolInfo ? `可用工具 ${toolInfo.count}` : '查看可用工具'}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null

  const installedGrid = (
    <div className="skills-grid">
      {hubSkills.length === 0 && <div className="wbh-state"><p>还没有通过 WorkBuddy Hub 安装的技能</p></div>}
      {hubSkills.map(entry => (
        <div className="wbh-installedCard" key={entry.key}>
          <SkillCard entry={entry} busy={busy} onDetail={handleDetail} onAction={onAction} />
          <button type="button" className="wb-button wb-button--secondary wb-button--small wbh-uninstallBtn"
            onClick={async e => { e.stopPropagation(); await hub.uninstall('skill', entry.name); await onRefresh?.() }}>卸载</button>
        </div>
      ))}
    </div>
  )

  const localGrid = (
    <div className="skills-grid">
      {localRows.length === 0 && <div className="wbh-state"><p>本机 ~/.dsh/skills 下没有可添加的技能</p></div>}
      {localRows.map(entry => (
        <SkillCard key={`local-${entry.name}`} entry={entry} busy={busy} onDetail={handleDetail} onAction={onAction} />
      ))}
    </div>
  )

  const skillTopRight = kind === 'skill' ? (
    <>
      <button type="button" className="wb-button wb-button--secondary wb-button--medium"
        aria-label="我安装的" aria-pressed={view === 'installed'}
        onClick={() => setView(v => (v === 'installed' ? 'market' : 'installed'))}>
        <span className="wb-button__icon wb-button__icon--left"><WbIcon name="download" size={14} /></span>
        我安装的{hubSkills.length > 0 && <span className="wbh-btnCount">{hubSkills.length}</span>}
      </button>
      <div className="wbh-addWrap">
        <button type="button" className="wb-button wb-button--secondary wb-button--medium"
          aria-label="添加技能" aria-haspopup="menu" aria-expanded={addMenu}
          onClick={() => setAddMenu(v => !v)}>
          <span className="wb-button__icon wb-button__icon--left"><WbIcon name="plus" size={14} /></span>
          添加技能
        </button>
        {addMenu && (
          <>
            <div className="wbh-addScrim" onClick={() => setAddMenu(false)} />
            <div className="wbh-addMenu" role="menu">
              <div className="wbh-addMenuItem" role="menuitem" tabIndex={0}
                onClick={() => { setAddMenu(false); setView('local') }}>
                <WbIcon name="download" size={14} />从本地添加技能
              </div>
              <div className="wbh-addMenuItem" role="menuitem" tabIndex={0}
                onClick={() => { setAddMenu(false); setView('installed') }}>
                <WbIcon name="gear" size={14} />管理技能
              </div>
            </div>
          </>
        )}
      </div>
    </>
  ) : null

  // ---------- picker：官方二级面板（三套官方结构 expert/skill/connector）----------
  if (variant === 'picker') {
    const footerNode = kind === 'connector' ? (
      <div className="wbh-flyoutFooterItem" role="menuitem" tabIndex={0}
        onClick={() => openMarket({ kind: 'connector', view: 'market' })}>
        <span className="wbh-flyoutFooterIcon"><PickIcon name="connManage" size={16} /></span>
        <span className="wbh-flyoutFooterLabel">管理连接器</span>
      </div>
    ) : kind === 'expert' ? (
      /* 「召唤更多专家」在 picker 里**弹小窗口**（内容 = 市场页目录），弹窗里的召唤直接
         加载到打开它的那个对话 —— 由父组件注入 onMore；没有注入时退回旧行为（跳市场页）。 */
      <div className="wbh-flyoutFooterItem" role="menuitem" tabIndex={0}
        onClick={e => {
          e.stopPropagation()
          if (onMore) onMore('expert')
          else openMarket({ kind: 'expert', view: 'market' })
        }}>
        <span className="wbh-flyoutFooterIcon"><PickIcon name="summonMore" size={16} /></span>
        <span className="wbh-flyoutFooterLabel">召唤更多专家</span>
      </div>
    ) : (
      <>
        <div className="wbh-flyoutFooterItem" role="menuitem" tabIndex={0}
          onClick={e => { e.stopPropagation(); openMarket({ kind: 'skill', view: 'local' }) }}>
          <span className="wbh-flyoutFooterIcon"><PickIcon name="skillUpload" size={16} /></span>
          <span className="wbh-flyoutFooterLabel">从本地添加技能</span>
        </div>
        <div className="wbh-flyoutFooterItem" role="menuitem" tabIndex={0}
          onClick={e => { e.stopPropagation(); openMarket({ kind: 'skill', view: 'installed' }) }}>
          <span className="wbh-flyoutFooterIcon"><PickIcon name="skillManage" size={16} /></span>
          <span className="wbh-flyoutFooterLabel">管理技能</span>
        </div>
      </>
    )

    const installedExperts = Object.entries(installed)
      .filter(([, rec]) => rec?.kind === 'expert')
      .map(([key, rec]) => ({ key, kind: 'expert', name: rec.name || key.split('/')[1], displayName: rec.displayName || rec.name, description: rec.description || '', icon: rec.icon || '' }))
    // 技能面板只列 DSH 本机已装技能（官方二级面板列的是本机技能）。
    const localSkills = (query
      ? localRows.filter(e => (e.displayName || e.name || '').toLowerCase().includes(query.toLowerCase()))
      : localRows)
    const baseRows = kind === 'expert'
      // 专家面板：**有搜索词就搜官方注册表**（结果来自上面那次 hub.list(kind,{query})，
      // 即 visible）。此前这里只用「本机已装专家 / 随机兜底」，搜索请求发出去了却被丢弃，
      // 于是输入关键词列表纹丝不动 —— 真机复现：搜「合同」后行仍是 架构通/体验达。
      ? (String(query ?? '').trim()
        ? visible
        : (installedExperts.length ? installedExperts : expertFallback))
      : kind === 'skill'
        ? localSkills
        : visible
    // 图钉项**不能绕过搜索**：置顶只影响顺序，不该让「搜什么都还有对象、永远看不到没找到」。
    // 真机反馈：图钉过的条目在任何关键词下都留在列表里 → 用户以为搜索没生效。
    const activeQuery = String(query ?? '').trim().toLowerCase()
    const matchesQuery = x => activeQuery === ''
      || [x.name, x.displayName, x.description].some(v => String(v || '').toLowerCase().includes(activeQuery))
    const pinnedOfKind = pinnedEntries.filter(x => x.kind === kind && matchesQuery(x))
    const merged = [...pinnedOfKind, ...baseRows.filter(b => !pinnedOfKind.some(p => p.name === b.name && p.kind === b.kind))]
    // 官方实测排序：**已打开**的连接器置顶（带开关）→ 已授权未打开 → 图钉置顶项 → 其余。
    // 注意「已打开」必须看本地启用态（installed[].enabled），不是官方账号绑定态：绑定态会让
    // 一个实际已关闭的 MCP 也显示成 ON（真机复现：腾讯文档 enabled=false 却显示「停用」）。
    const rowRank = x => {
      if (x.kind === 'connector') {
        if (installed[`connector/${x.name}`]?.enabled) return 0
        if (bound.includes(x.name)) return 1
      }
      if (pinned.has(`${x.kind}/${x.name}`)) return 2
      return 3
    }
    // 专家面板：同档内按「最近加载过的专家」优先（越近越靠前）；没有记录时返回同值，
    // 排序保持稳定 = 回落到原有顺序（置顶逻辑不受影响）。
    //
    // 顺序用**快照**（kind/query 变化时才重取），不在每次渲染时现读：否则「点选 → 记为最近
    // → 立即重排」，用户鼠标底下的行会换位并点到隔壁行（验收缺陷 2 的成因之一）。重开面板或
    // 换搜索词才会刷新顺序。
    const recentExperts = kind === 'expert' ? recentSnapshot : []
    const recencyRank = name => {
      const i = recentExperts.indexOf(name)
      return i < 0 ? Number.MAX_SAFE_INTEGER : i
    }
    const visibleRows = [...merged].sort((a, b) => {
      const byRank = rowRank(a) - rowRank(b)
      if (byRank !== 0) return byRank
      if (kind !== 'expert') return 0
      return recencyRank(a.name) - recencyRank(b.name)
    })

    const rowNode = entry => {
      const key = `${entry.kind}/${entry.name}`
      // 连接器行尾控件的三种形态（对齐官方）：
      //   ① 本地已启用 → 绿色开关，点 = 停用（并撤掉本会话的 chip）
      //   ② 已授权但未启用 → 灰开关，点 = 启用 + 挂到本会话（chip 出现，带官方 icon）
      //   ③ 未授权 → 「连接」文字按钮，点 = 走授权/连接流程
      // 判断依据必须是**本地启用态**：用官方绑定态（bound）会把已关闭的 MCP 显示成 ON。
      const connectorEnabled = entry.kind === 'connector' ? Boolean(installed[`connector/${entry.name}`]?.enabled) : false
      const connectorAuthorised = entry.kind === 'connector' && bound.includes(entry.name)
      const connected = entry.kind === 'connector' ? connectorEnabled : Boolean(entry._enabled || entry.isConnected)
      const isPinned = pinned.has(key)
      return (
        // 点击整行 = attach（与回车一致）：连接器挂到当前会话并出 chip；技能写输入框；
        // 专家走 onAction（召唤）。行内开关只承载「启/停用」这一种语义（见行尾）。
        <div key={key} className={`wbh-flyoutRow is-${entry.kind}`} role="menuitem" tabIndex={0}
          onClick={() => {
            if (entry.kind === 'skill') handleSkillPick(entry)
            else onAction?.(entry)
          }}
          onKeyDown={e => { if (e.key === 'Enter') onAction?.(entry) }}>
          <span className={`wbh-flyoutIcon${entry.kind === 'expert' ? ' is-round' : ''}`}>
            <EntryIcon entry={entry} size={16} round={entry.kind === 'expert'}
              fallbackTint={PICKER_TINT[entry.kind]}
              radius={entry.kind === 'expert' ? '50%' : entry.kind === 'skill' ? '6px' : '3px'} />
          </span>
          {entry.kind === 'skill' ? (
            <div className="wbh-rowBody">
              <div className="wbh-rowTitle"><span className="wbh-rowTitleText">{entry.displayName}</span></div>
              <div className="wbh-rowDesc">{entry.description || ''}</div>
            </div>
          ) : (
            <span className="wbh-flyoutName">{entry.displayName}</span>
          )}
          {entry.kind !== 'connector' && (
            <button type="button"
              className={`wbh-pinBtn${isPinned ? ' is-pinned' : ''}`}
              aria-label={isPinned ? '取消置顶' : '置顶'}
              onClick={e => { e.stopPropagation(); togglePin(entry) }}>
              <span className="wbh-pinRest"><PickIcon name="pinRest" size={16} /></span>
              <span className="wbh-pinHover"><PickIcon name="pinHover" size={16} /></span>
            </button>
          )}
          {/* 连接器行尾控件：见 rowNode 顶部注释（① 已启用=绿开关 / ② 已授权=灰开关 /
              ③ 未授权=「连接」文字按钮，与官方一致）。点击整行仍是 attach 语义。 */}
          {entry.kind === 'connector' && (connectorEnabled || connectorAuthorised ? (
            <button type="button" className={`wbh-toggle${connectorEnabled ? ' is-on' : ''}`}
              role="switch" aria-checked={connectorEnabled}
              aria-label={`${connectorEnabled ? '停用' : '启用'} ${entry.displayName}`}
              disabled={busyLocal === key}
              onClick={e => { e.stopPropagation(); void connectorAction(entry) }}>
              <i />
            </button>
          ) : (
            <button type="button" className="wbh-linkAction" disabled={busyLocal === key}
              aria-label={`连接 ${entry.displayName}`}
              onClick={e => { e.stopPropagation(); void connectorAction(entry) }}>
              <PickIcon name="connLink" size={14} />
              <span>连接</span>
            </button>
          ))}
          {busyLocal === key && <span className="wbh-flyoutBusy">…</span>}
        </div>
      )
    }

    // picker「连接器」面板顶部的「本机 MCP」一节：把**宿主侧真的加载了哪些 MCP** 摆出来
    // （本插件托管的本地 MCP 可开关；DSH 自己加载的只读展示，插件不代管别人的配置）。
    // connector 来源不在这里重复列——它在下面就是普通的官方连接器行。
    const hostMcpRows = (variant === 'picker' && kind === 'connector')
      ? hostMcp.filter(s => s && s.source !== 'connector')
      : []
    const hostMcpSection = hostMcpRows.length > 0 ? (
      <div className="wbh-mcpSection">
        <div className="wbh-mcpSectionTitle">本机 MCP</div>
        {hostMcpRows.map(server => {
          const key = `mcp/${server.name}`
          const managed = Boolean(server.managed)
          return (
            <div key={key} className="wbh-flyoutRow is-mcp" role="menuitem" tabIndex={managed ? 0 : -1}
              onClick={managed ? () => void localMcpAction(server) : undefined}
              onKeyDown={managed ? (e => { if (e.key === 'Enter') void localMcpAction(server) }) : undefined}>
              <span className="wbh-flyoutIcon is-mcp"><PickIcon name="connLink" size={16} /></span>
              <span className="wbh-flyoutName">{server.name}</span>
              <span className="wbh-mcpMeta">
                {server.source === 'dsh' ? 'DSH 加载' : '本插件托管'} · {Number(server.toolCount) || 0} 个工具
              </span>
              {managed ? (
                <button type="button" className={`wbh-toggle${server.enabled ? ' is-on' : ''}`}
                  role="switch" aria-checked={Boolean(server.enabled)}
                  aria-label={`${server.enabled ? '停用' : '启用'} ${server.name}`}
                  disabled={busyLocal === key}
                  onClick={e => { e.stopPropagation(); void localMcpAction(server) }}>
                  <i />
                </button>
              ) : (
                <span className="wbh-mcpBadge" title={server.note || ''}>只读</span>
              )}
            </div>
          )
        })}
      </div>
    ) : null

    const listNode = (
      <div className="wbh-flyoutList" ref={scrollRef} onScroll={onScroll}>
        {hostMcpSection}
        {loading && <div className="wbh-flyoutState">正在读取…</div>}
        {!loading && !failed && visibleRows.length === 0 && (
          <div className="wbh-flyoutState">{String(query).trim()
            ? `没有找到与「${String(query).trim()}」匹配的${kindMeta.label}`
            : `暂无可用${kindMeta.label}`}</div>
        )}
        {visibleRows.map(rowNode)}
        {loadingMore && <div className="wbh-flyoutState">加载中…</div>}
      </div>
    )

    return (
      <div className={`wbh-flyout is-${kind}`} role="dialog" aria-label={`选择${kindMeta.label}`}>
        {notice ? <div className="wbh-notice">{notice}</div> : null}
        {pendingAuth ? (
          <a className="wbh-authLink" href={pendingAuth.url} target="_blank" rel="noreferrer">
            打开「{pendingAuth.displayName}」授权页
          </a>
        ) : null}
        {/* 三个面板都带搜索框（专家面板此前被误判为「官方没有」而缺失） */}
        <div className="wbh-flyoutSearch">
          <span className="wbh-flyoutSearchIcon"><PickIcon name="search" size={16} /></span>
          <input value={query} placeholder={`搜索${kindMeta.label}`} aria-label={`搜索${kindMeta.label}`}
            onChange={e => onQuery(e.target.value)} />
        </div>
        {kind === 'skill' ? <div className="wbh-flyoutBody">{listNode}</div> : listNode}
        <div className="wbh-flyoutDivider" />
        <div className="wbh-flyoutFooter">{footerNode}{footerExtra}</div>
      </div>
    )
  }

  // 技能二级页面是整页替换（官方进入详情后顶栏变成 subpage 返回栏），不是页内嵌一块
  if (detail && detail.kind === 'skill') return skillDetailView

  return (
    <div className="ec-market-panel">
      <header className="ec-topbar">
        <div className="ec-topbar__left">
          <div className="um-header__inner">{kindTabs}</div>
        </div>
        <div className="ec-topbar__right">
          {searchBox}
          {topbarRight}
          {skillTopRight}
        </div>
      </header>
      {notice ? <div className="wbh-notice wbh-notice--page">{notice}</div> : null}
      {pendingAuth ? (
        <a className="wbh-authLink wbh-authLink--page" href={pendingAuth.url} target="_blank" rel="noreferrer">
          打开「{pendingAuth.displayName}」授权页
        </a>
      ) : null}
      <div className="ec-page-layout">
        <div className="ec-main-content">
          {view !== 'market' && (
            <div className="wbh-viewBar">
              <button type="button" className="wb-button wb-button--secondary wb-button--small"
                onClick={() => setView('market')}>← 返回{kindMeta.label}市场</button>
              <span className="wbh-viewTitle">{view === 'installed' ? '我安装的' : '从本地添加技能'}</span>
            </div>
          )}
          {view === 'market' && (
            <>
              {/* 官方版面：排序控件独占一行（高 28、右对齐），分类栏在其下 12px，
                  两者不是同一行左右分列 */}
              {sortGroup ? <div className="wbh-sortRow">{sortGroup}</div> : null}
              <div className="wbh-filterRow">{categoryChips}</div>
            </>
          )}
          <div className="ec-main-scroll" ref={scrollRef} onScroll={onScroll}>
            {view === 'installed' ? installedGrid : view === 'local' ? localGrid : (
              pageLoginGate || skillDetailView || (
                <>
                  {sourceNote}
                  {kind === 'skill' && !query && segment === 0 && featured.length > 0 && featuredSection}
                  {kind === 'skill' && segmentBar}
                  {cardGrid}
                </>
              )
            )}
          </div>
        </div>
      </div>
      {connectorDetailModal}
    </div>
  )
}
