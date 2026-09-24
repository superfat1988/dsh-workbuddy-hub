import React, { useState, useEffect, useCallback } from 'react'
import { hub, addSelection, summonExpertInNewSession, authState, onAuthChange, refreshAuth, onAuthRequired, claimAuthGate, settleAuthGate } from './hub.js'
import { insertPromptIntoComposer } from './insert-prompt.js'
import { WbIcon } from './icons.js'
import Catalogue from './Catalogue.jsx'
import SummonModal from './SummonModal.jsx'
import ConnectorAuthModal from './ConnectorAuthModal.jsx'
import WbAuthCard from './WbAuthCard.jsx'
import './official.css'
import './app.css'

/**
 * 顶栏右侧账号胶囊（紧邻搜索框）：
 *  · 未登录 → 可点胶囊「未登录 · 登录」，点开 modal 登录卡
 *  · 已登录 → 显示昵称（无昵称退化为 uid /「已登录」），点开小下拉：账号信息 + 注销
 */
function AccountCapsule({ auth, onLogin }) {
  const [open, setOpen] = useState(false)
  const loggedIn = auth?.configured === true
  const label = loggedIn ? (auth?.nickname || auth?.uid || '已登录') : '未登录 · 登录'
  // 登录态还没拉到时先不猜：显示占位胶囊，避免「已登录」被闪成「未登录」
  if (auth == null) return <span className="wbh-accountChip is-loading" aria-hidden="true">…</span>
  if (!loggedIn) {
    return (
      <button type="button" className="wbh-accountChip" aria-label="登录 WorkBuddy 账号" onClick={onLogin}>
        <i className="wbh-dot off" />{label}
      </button>
    )
  }
  return (
    <div className="wbh-accountWrap">
      <button type="button" className="wbh-accountChip is-on" aria-haspopup="menu" aria-expanded={open}
        onClick={() => setOpen(v => !v)}>
        <i className="wbh-dot" />{label}
      </button>
      {open && (
        <>
          <div className="wbh-addScrim" onClick={() => setOpen(false)} />
          <div className="wbh-accountPop" role="menu">
            <div className="wbh-accountRow"><span className="wbh-muted">昵称</span><span>{auth?.nickname || '—'}</span></div>
            <div className="wbh-accountRow"><span className="wbh-muted">uid</span><span>{auth?.uid || '—'}</span></div>
            {auth?.expiresAt
              ? <div className="wbh-accountRow"><span className="wbh-muted">授权到期</span><span>{new Date(auth.expiresAt).toLocaleString('zh-CN')}</span></div>
              : null}
            <button type="button" className="wbh-accountLogout"
              onClick={async () => { setOpen(false); await hub.authLogout(); await refreshAuth() }}>注销</button>
          </div>
        </>
      )}
    </div>
  )
}

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
  const [auth, setAuth] = useState(() => authState())
  const [showAuth, setShowAuth] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const [inst, mnt] = await Promise.all([hub.installed(), hub.mounted(sessionId)])
      setInstalled(inst); setMounted(new Set(mnt))
    } catch { /* keep previous */ }
    await refreshAuth()
  }, [sessionId])
  useEffect(() => { void refresh() }, [refresh])
  // 登录态 store：登录成功/注销都会通知（设置区或 picker 里登录也同步反映到这里）
  useEffect(() => onAuthChange(setAuth), [])
  // 动作级 JIT 登录门：被拦下的动作（连接器等）需要登录时，由本页负责弹登录卡
  useEffect(() => onAuthRequired(() => { if (claimAuthGate('page')) setShowAuth(true) }), [])

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
        topbarRight={<AccountCapsule auth={auth} onLogin={() => setShowAuth(true)} />}
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
      {showAuth && (
        <WbAuthCard variant="modal"
          onClose={() => { setShowAuth(false); settleAuthGate(false); void refresh() }}
          onDone={() => { void refresh() }} />
      )}
    </div>
  )
}
