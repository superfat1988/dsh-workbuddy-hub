import React, { useEffect, useState, useCallback, useRef } from 'react'
import { hub, refreshAuth, onAuthChange, STALE_LOGIN_REASON } from './hub.js'
import { WbIcon } from './icons.js'
import WbAuthCard from './WbAuthCard.jsx'

/**
 * 卸载结果 → 给用户看的一句话（纯函数）。
 * 失败必须带上宿主返回的原因（未安装 404 / 连接器停用失败 / 删除文件失败…），
 * 绝不静默：这是「点了移除但什么都没发生」这类缺陷的根源。
 */
export function uninstallNotice(kind, label, result) {
  if (!result || result.ok !== true) {
    const reason = String(result?.error || result?.message || '宿主未返回原因')
    const status = result?.status ? `（HTTP ${result.status}）` : ''
    return { ok: false, text: `移除「${label}」失败：${reason}${status}` }
  }
  if (kind === 'connector') return { ok: true, text: `已移除连接器「${label}」（已先停用再删除）` }
  if (kind === 'expert') return { ok: true, text: `已移除专家「${label}」，并已从会话中移除挂载` }
  return { ok: true, text: `已移除技能「${label}」` }
}

/** 二次确认行里那句「顺带做了什么」的说明（危险动作必须说清楚影响面）。 */
function removeHint(kind) {
  if (kind === 'connector') return '先停用再删除'
  if (kind === 'expert') return '并从会话中移除'
  return '并解除技能链接'
}

const KIND_LABEL = { expert: '专家', skill: '技能', connector: '连接器' }

/* ------------------------------------------------------------------ *
 * 「检查更新 / 一键更新」的纯函数（导出以便直接单测）
 * ------------------------------------------------------------------ */

/** 字节 → 人读格式（B / KB / MB）。非法或非正值按 0 B 处理，绝不显示 NaN。 */
export function humanBytes(bytes) {
  const n = Number(bytes)
  if (!Number.isFinite(n) || n <= 0) return '0 B'
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * 一次更新的下载量：优先用宿主给的远端字节数；官方专家没有远端清单（人设 + 头像
 * 是直链下载），只能退回本地已装字节数估算 —— 此时 approximate=true，界面显示「约」。
 */
export function downloadSize(entry) {
  // 注意两种形状：/updates 的条目把判定挂在 row.status 上（如 expert/xxx），而
  // 单独调用时也可能直接把该条目对象传进来。此前只读 entry.remoteBytes，于是
  // 从行对象调用时恒取不到 → 确认文案显示成「约 0 B」（实测：真实要下 9.4MB）。
  const remote = Number(entry?.remoteBytes ?? entry?.status?.remoteBytes)
  if (Number.isFinite(remote) && remote > 0) return { bytes: remote, approximate: false }
  return { bytes: Number(entry?.bytes ?? entry?.status?.bytes) || 0, approximate: true }
}

/** 「全部更新」的确认文案里那个总下载量（任一项是估算值就整体标「约」）。 */
export function updatesSizeLabel(entries) {
  let total = 0
  let approximate = false
  for (const entry of entries ?? []) {
    const size = downloadSize(entry)
    total += size.bytes
    if (size.approximate) approximate = true
  }
  return `${approximate ? '约 ' : ''}${humanBytes(total)}`
}

/**
 * 更新失败 → 用户看得懂的一句话。必须区分「限流 / 断网 / 安装失败」，
 * 并带上 HTTP 状态码（宿主把上游原因放在 message 里，POST /install 还会给 500）。
 */
export function updateFailureReason(error) {
  const message = String(error?.message || error || '宿主未返回原因')
  const status = Number(error?.status) || 0
  const withStatus = status ? `（HTTP ${status}）` : ''
  if (/\b(403|429)\b|rate limit|api rate/i.test(message)) return `接口限流：${message}${withStatus}`
  if (/fetch failed|ENOTFOUND|ETIMEDOUT|ECONNRESET|EAI_AGAIN|socket hang up|network|请求超时/i.test(message)) {
    return `网络不可达：${message}${withStatus}`
  }
  return `安装失败：${message}${withStatus}`
}

/** 单条更新结果 → 通知文案（成功/失败都不静默）。 */
export function updateNotice(kind, label, result) {
  const what = KIND_LABEL[kind] || '条目'
  if (!result || result.ok !== true) {
    return { ok: false, text: `更新${what}「${label}」失败：${updateFailureReason(result)}` }
  }
  return { ok: true, text: `已更新${what}「${label}」` }
}

/** 检查失败时给整块区域的一句话（语义纪律：查不到就说查不到，绝不说「已是最新」）。 */
export function checkFailureText(result) {
  return `检查失败：${String(result?.error || '宿主未返回原因')}（本次结果不可用，所有条目显示「无法检查」）`
}

/** 检查结果摘要（有更新 / 已是最新 / 无法检查），checking 时给忙碌文案。 */
export function checkSummaryText(result, checking) {
  if (checking) return '正在检查更新…'
  if (!result) return '尚未检查更新'
  if (result.ok === false) return checkFailureText(result)
  const counts = result.counts ?? {}
  const at = result.checkedAt ? new Date(result.checkedAt).toLocaleTimeString('zh-CN') : ''
  const cached = result.cached ? '（缓存）' : ''
  return `检查于 ${at}${cached} · 有更新 ${counts.update ?? 0} · 已是最新 ${counts.current ?? 0} · 无法检查 ${counts.unknown ?? 0}`
}

/* ------------------------------------------------------------------ *
 * 本地 MCP 服务器（设置区新节）的纯函数（导出以便直接单测）
 * ------------------------------------------------------------------ */

/** 徽标：本地 MCP 状态 → {className, text}（enabled 优先于 lastError）。 */
export function localMcpBadge(server) {
  if (server?.enabled) return { className: 'wbh-badge wbh-badgeCurrent', text: '已启用' }
  if (String(server?.lastError || '')) return { className: 'wbh-badge wbh-badgeUnknown', text: `连不上：${server.lastError}` }
  return { className: 'wbh-badge wbh-badgeIdle', text: '已停用' }
}

/** 工具数显示：宿主拿不到活注册表时回 null → 显示「—」。 */
export function localMcpToolCount(server) {
  const n = Number(server?.toolCount)
  return Number.isFinite(n) && n >= 0 ? String(n) : '—'
}

/** 表单提交前的客户端校验（与服务端同规则的前置；服务端仍是权威）。 */
export function validateLocalMcpForm(name, url, token) {
  if (!/^[\w.-]+$/.test(String(name || ''))) return '名称只允许字母数字、点、下划线、连字符'
  if (String(name || '').length > 80) return '名称过长（≤80）'
  const trimmedUrl = String(url || '').trim()
  if (!/^https?:\/\//i.test(trimmedUrl)) return 'URL 必须以 http:// 或 https:// 开头'
  let host = ''
  try { host = new URL(trimmedUrl).hostname.toLowerCase() } catch { return 'URL 无法解析' }
  const isLoopback = host === 'localhost' || host === '::1' || /^127(\.\d{1,3}){3}$/.test(host.replace(/^\[|\]$/g, ''))
  if (!isLoopback) return '只允许本机地址（127.0.0.1 / localhost / ::1）—— 非本机 MCP 一律不收'
  if (String(token || '').length > 4096) return 'token 过长（≤4096）'
  return ''
}

/** 注册结果 → 通知文案（失败必带宿主原因；成功不回显任何 token 信息）。 */
export function localMcpSaveNotice(result) {
  if (!result || result.ok !== true) {
    return { ok: false, text: `注册失败：${String(result?.error || '宿主未返回原因')}` }
  }
  return { ok: true, text: `已注册本地 MCP「${result.server?.name}」（工具命名空间 mcp__${result.server?.serverName}__）` }
}

/** 启停/移除结果 → 通知文案。 */
export function localMcpActionNotice(action, name, result) {
  const what = { enable: '启用', disable: '停用', remove: '移除' }[action] || action
  if (!result || result.ok !== true) {
    return { ok: false, text: `${what}「${name}」失败：${String(result?.error || '宿主未返回原因')}` }
  }
  if (action === 'enable') return { ok: true, text: `已启用「${name}」（命名空间 mcp__${result.server?.serverName || name}__）` }
  if (action === 'remove') return { ok: true, text: `已移除「${name}」（已先停用并拆除传输）` }
  return { ok: true, text: `已停用「${name}」` }
}


/** 徽标：状态 → {className, text}（null = 还没检查过，不显示任何徽标）。 */
export function statusBadge(status) {
  if (status === 'update') return { className: 'wbh-badgeUpdate', text: '有更新' }
  if (status === 'current') return { className: 'wbh-badgeCurrent', text: '已是最新' }
  if (status === 'unknown') return { className: 'wbh-badgeUnknown', text: '无法检查' }
  return null
}

/**
 * 单条已安装记录。空闲态右侧是次要样式的「更新」（仅有更新时）+「移除」；点「移除」
 * 或「更新」都进入**行内**二次确认（不使用 window.confirm）：两态互斥，同一行永远
 * 只有一个确认态。键盘：进入确认态即把焦点放到确认按钮上（Enter 确认，Escape 取消）。
 * 抽成独立组件是为了让它两种状态都能被真实渲染测试覆盖。
 */
export function InstalledRow({
  entry, confirming, busy, confirmRef, onAskRemove, onCancel, onConfirm,
  status, checking, updateConfirming, updateBusy, updateConfirmRef, onAskUpdate, onCancelUpdate, onConfirmUpdate,
}) {
  const label = entry.record.displayName || entry.name
  const badge = statusBadge(status?.status)
  const reason = String(status?.reason || '')
  const size = updatesSizeLabel([status ?? {}])
  return (
    <div className="wbh-row wbh-installedRow" aria-busy={checking || updateBusy ? 'true' : undefined}>
      <span className="wbh-installedName">{label}
        <span className="wbh-muted"> · {entry.kind}</span>
      </span>
      <span className="wbh-installedActions">
        {badge && (
          <span
            className={`wbh-badge ${badge.className}`}
            title={reason ? `${badge.text}：${reason}` : badge.text}
            aria-label={`${badge.text} ${label}${reason ? `：${reason}` : ''}`}
          >{badge.text}</span>
        )}
        <span className="wbh-muted">
          {entry.record.files || 0} 文件
          {entry.record.mcp ? ' · MCP' : ''}
          {entry.record.source === 'official' ? ' · 官方' : ''}
        </span>
        {updateConfirming ? (
          <span
            className="wbh-confirmRow"
            role="group"
            aria-label={`确认更新 ${label}`}
            onKeyDown={event => {
              if (event.key === 'Escape') { event.preventDefault(); onCancelUpdate() }
            }}
          >
            <span className="wbh-confirmText">确认更新？<span className="wbh-muted">（下载 {size}）</span></span>
            <button
              ref={updateConfirmRef}
              type="button"
              className="wbh-btnPrimary wbh-updateConfirmBtn"
              disabled={updateBusy}
              aria-label={`确认更新 ${label}`}
              onClick={onConfirmUpdate}
            >{updateBusy ? '更新中…' : '更新'}</button>
            <button
              type="button"
              className="wbh-btnGhost"
              disabled={updateBusy}
              aria-label={`取消更新 ${label}`}
              onClick={onCancelUpdate}
            >取消</button>
          </span>
        ) : confirming ? (
          <span
            className="wbh-confirmRow"
            role="group"
            aria-label={`确认移除 ${label}`}
            onKeyDown={event => {
              // Escape 取消（Enter 由「移除」按钮原生激活，进确认态即自动聚焦它）
              if (event.key === 'Escape') { event.preventDefault(); onCancel() }
            }}
          >
            <span className="wbh-confirmText">确认移除？<span className="wbh-muted">（{removeHint(entry.kind)}）</span></span>
            <button
              ref={confirmRef}
              type="button"
              className="wbh-btnDanger"
              disabled={busy}
              aria-label={`确认移除 ${label}`}
              onClick={onConfirm}
            >{busy ? '移除中…' : '移除'}</button>
            <button
              type="button"
              className="wbh-btnGhost"
              disabled={busy}
              aria-label={`取消移除 ${label}`}
              onClick={onCancel}
            >取消</button>
          </span>
        ) : (
          <>
            {status?.status === 'update' && (
              <button
                type="button"
                className="wbh-btnGhost wbh-updateBtn"
                disabled={updateBusy || checking}
                aria-label={`更新 ${label}`}
                title={reason || `下载 ${size}`}
                onClick={onAskUpdate}
              >{updateBusy ? '更新中…' : '更新'}</button>
            )}
            <button
              type="button"
              className="wbh-btnGhost wbh-removeBtn"
              disabled={busy}
              aria-label={`移除 ${label}`}
              onClick={onAskRemove}
            >{busy ? '移除中…' : '移除'}</button>
          </>
        )}
      </span>
    </div>
  )
}

/**
 * 本地 MCP 行：状态徽标 + 工具数 + 启停按钮（行内确认只用于移除，与已安装列表一致）。
 * aria-label 一律带名字；busy 时 aria-busy；按钮全部真实 <button>（键盘可达）。
 */
export function LocalMcpRow({
  server, confirming, busy, confirmRef, onAskRemove, onCancel, onConfirm, onToggle, toggling,
}) {
  const label = server.name
  const badge = localMcpBadge(server)
  return (
    <div className="wbh-row wbh-localMcpRow" aria-busy={busy || toggling ? 'true' : undefined}>
      <span className="wbh-installedName">
        {label}
        <span className="wbh-muted"> · {server.url}</span>
        <span
          className={`wbh-badge ${badge.className}`}
          title={badge.text}
          aria-label={`${badge.text} ${label}`}
        >{badge.text}</span>
        <span className="wbh-muted">
          工具 {localMcpToolCount(server)}
          {server.tokenRef ? ` · 凭据 ${server.tokenRef}` : ''}
        </span>
      </span>
      <span className="wbh-installedActions">
        {confirming ? (
          <span
            className="wbh-confirmRow"
            role="group"
            aria-label={`确认移除 ${label}`}
            onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); onCancel() } }}
          >
            <span className="wbh-confirmText">确认移除？<span className="wbh-muted">（先停用并拆除传输）</span></span>
            <button
              ref={confirmRef}
              type="button"
              className="wbh-btnDanger"
              disabled={busy}
              aria-label={`确认移除 ${label}`}
              onClick={onConfirm}
            >{busy ? '移除中…' : '移除'}</button>
            <button
              type="button"
              className="wbh-btnGhost"
              disabled={busy}
              aria-label={`取消移除 ${label}`}
              onClick={onCancel}
            >取消</button>
          </span>
        ) : (
          <>
            <button
              type="button"
              className="wbh-btnGhost"
              disabled={toggling || busy}
              aria-label={`${server.enabled ? '停用' : '启用'} ${label}`}
              aria-busy={toggling ? 'true' : undefined}
              onClick={onToggle}
            >{toggling ? (server.enabled ? '停用中…' : '启用中…') : (server.enabled ? '停用' : '启用')}</button>
            <button
              type="button"
              className="wbh-btnGhost wbh-removeBtn"
              disabled={busy || toggling}
              aria-label={`移除 ${label}`}
              onClick={onAskRemove}
            >{busy ? '移除中…' : '移除'}</button>
          </>
        )}
      </span>
    </div>
  )
}

/**
 * 设置区「本地 MCP 服务器」一节。config.localMcp=false 时只显示一行说明
 * （未开启 + 怎么开），不渲染表单与列表数据。
 */
export function LocalMcpSection({
  guarded, reason, servers, loading, form, onChange, onSubmit, notice,
  confirmKey, busyKey, toggleKey, confirmRef, onAskRemove, onCancel, onConfirm, onToggle,
}) {
  if (guarded) {
    return (
      <div className="wbh-localMcpSection">
        <h2 className="wbh-secTitle" style={{ marginTop: 22 }}>本地 MCP 服务器</h2>
        <p className="wbh-muted" role="note">{reason || '本地 MCP 管理未开启：请在插件配置里设 localMcp: true（默认关闭）'}</p>
      </div>
    )
  }
  return (
    <div className="wbh-localMcpSection">
      <h2 className="wbh-secTitle" style={{ marginTop: 22 }}>本地 MCP 服务器（{servers.length}）</h2>
      <p className="wbh-muted">
        只有本机地址（127.0.0.1 / localhost / ::1）可以注册；token 只存入 DSH 凭据库
        （~/.dsh/.credentials.yaml，0600），不落任何配置文件、不回显。启用的服务器会以
        mcp__&lt;名字&gt;__&lt;工具&gt; 的命名空间暴露给模型。
      </p>
      {notice && (
        <p className={`wbh-removeNotice${notice.ok ? '' : ' is-error'}`} role={notice.ok ? 'status' : 'alert'} aria-live="polite">
          {notice.text}
        </p>
      )}
      {servers.length === 0 && !loading && <p className="wbh-muted">尚未注册任何本地 MCP 服务器。</p>}
      {servers.map(server => (
        <LocalMcpRow
          key={server.name}
          server={server}
          confirming={confirmKey === server.name}
          busy={busyKey === server.name}
          toggling={toggleKey === server.name}
          confirmRef={confirmRef}
          onAskRemove={() => onAskRemove(server.name)}
          onCancel={onCancel}
          onConfirm={() => onConfirm(server.name)}
          onToggle={() => onToggle(server.name)}
        />
      ))}
      <form
        className="wbh-localMcpForm"
        aria-label="注册本地 MCP 服务器"
        onSubmit={event => { event.preventDefault(); onSubmit() }}
      >
        <input
          className="wbh-localMcpInput"
          type="text"
          value={form.name}
          placeholder="名称（如 scrapling）"
          aria-label="本地 MCP 名称"
          onChange={event => onChange({ ...form, name: event.target.value })}
        />
        <input
          className="wbh-localMcpInput wbh-localMcpUrl"
          type="text"
          value={form.url}
          placeholder="http://127.0.0.1:8002/mcp"
          aria-label="本地 MCP URL（仅本机地址）"
          onChange={event => onChange({ ...form, url: event.target.value })}
        />
        <input
          className="wbh-localMcpInput wbh-localMcpToken"
          type="password"
          autoComplete="off"
          value={form.token}
          placeholder="token（可选，存入凭据库，不回显）"
          aria-label="本地 MCP token（可选，存入凭据库，不回显）"
          onChange={event => onChange({ ...form, token: event.target.value })}
        />
        <button type="submit" className="wbh-btnPrimary" aria-label="注册本地 MCP 服务器" aria-busy={form.busy ? 'true' : undefined} disabled={form.busy}>
          {form.busy ? '注册中…' : '注册'}
        </button>
      </form>
    </div>
  )
}

/** Settings section: official account state + installed entries. */
export default function SettingsPage() {
  const [auth, setAuth] = useState(null)
  const [installed, setInstalled] = useState({})
  const [showAuth, setShowAuth] = useState(false)
  // 行内二次确认：同一时刻只允许一行处于确认态（'' = 没有）；更新/移除互斥
  const [confirmKey, setConfirmKey] = useState('')
  const [busyKey, setBusyKey] = useState('')
  const [notice, setNotice] = useState(null)
  const confirmRef = useRef(null)
  // 检查更新：结果 / 忙碌 / 二次确认（条目 key 或 '__all__'）/ 通知
  const [updates, setUpdates] = useState(null)
  const [checking, setChecking] = useState(false)
  const [updateConfirmKey, setUpdateConfirmKey] = useState('')
  const [updateBusyKey, setUpdateBusyKey] = useState('')
  const [updateNoticeState, setUpdateNoticeState] = useState(null)
  const updateConfirmRef = useRef(null)

  const loadInstalled = useCallback(async () => {
    try { setInstalled(await hub.installed()) } catch { /* 刷新失败保留旧列表 */ }
  }, [])

  const refresh = useCallback(async () => {
    try { setAuth(await refreshAuth()) } catch { setAuth({ configured: false }) }
    await loadInstalled()
  }, [loadInstalled])
  useEffect(() => { void refresh() }, [refresh])
  // 登录态 store：在别的界面（市场页/picker/连接器页）登录或注销后，设置区同步反映
  useEffect(() => onAuthChange(setAuth), [])
  // 进入确认态就把焦点放到确认按钮上：Enter 直接确认、Escape 取消（键盘可达）
  useEffect(() => { if (confirmKey) confirmRef.current?.focus?.() }, [confirmKey])
  useEffect(() => { if (updateConfirmKey) updateConfirmRef.current?.focus?.() }, [updateConfirmKey])

  const loggedIn = auth?.configured === true
  // 已登录但凭证彻底失效（连续保活刷新失败 / 官方 12153 达阈值）→ 显示重新登录
  const stale = loggedIn && auth?.stale === true
  // 以 registry 的键 `${kind}/${name}` 为准：它才是宿主的卸载主键
  // （官方技能的 record.name 是包目录名，可能和安装时用的名字不同，用错会 404）
  const entries = Object.entries(installed).map(([key, record]) => {
    const slash = key.indexOf('/')
    return {
      key,
      kind: slash > 0 ? key.slice(0, slash) : (record?.kind || ''),
      name: slash > 0 ? key.slice(slash + 1) : (record?.name || ''),
      record: record || {},
    }
  })

  /**
   * 检查更新（只读路由）。失败时把整块结果标成不可用 —— 语义纪律：查不到就说
   * 查不到，**绝不**把「没查到」渲染成「已是最新」。
   */
  const checkUpdates = useCallback(async ({ refresh: force = false } = {}) => {
    setChecking(true)
    setUpdateNoticeState(null)
    try {
      setUpdates(await hub.updates({ refresh: force }))
    } catch (error) {
      setUpdates({
        ok: false,
        entries: [],
        counts: { update: 0, current: 0, unknown: 0 },
        sources: {},
        error: updateFailureReason(error),
      })
    } finally {
      setChecking(false)
    }
  }, [])

  // 每条已装记录的更新状态：整次检查失败 → 全部「无法检查」（带原因），不冒充最新
  const statusByKey = new Map((updates?.ok === false ? [] : (updates?.entries ?? [])).map(item => [item.key, item]))
  const statusFor = useCallback(entry => {
    if (!updates) return null
    if (updates.ok === false) return { status: 'unknown', reason: updates.error || '检查失败' }
    return statusByKey.get(entry.key) ?? { status: 'unknown', reason: '本次检查未返回该条目' }
  }, [updates, statusByKey])
  const rows = entries.map(entry => ({ ...entry, status: statusFor(entry) }))
  const updatable = rows.filter(row => row.status?.status === 'update')
  const checkFailed = updates?.ok === false
  const sources = updates?.sources ?? {}
  // 只有一个真源：官方。ok=false 时 reason 说明哪一路取不到（未登录 / 接口失败）
  const officialDown = sources.official?.ok === false

  const remove = useCallback(async entry => {
    const label = entry.record.displayName || entry.name
    setBusyKey(entry.key)
    setNotice(null)
    let result = { ok: true }
    try {
      await hub.uninstall(entry.kind, entry.name)
    } catch (error) {
      result = { ok: false, error: String(error?.message || error), status: error?.status }
    }
    setNotice(uninstallNotice(entry.kind, label, result))
    setBusyKey('')
    setConfirmKey('')
    // hub.uninstall 内部已 _emitChange（市场页 / picker 跟着刷新）；本页清单要自己重读。
    await loadInstalled()
  }, [loadInstalled])

  /** 更新 = 重新安装（安装链路先 rm -rf 再落盘，天然幂等）。 */
  const installEntry = useCallback(async entry => {
    const result = await hub.install(
      entry.kind,
      entry.name,
      entry.record.source === 'official' ? 'official' : undefined,
    )
    // 连接器特例：只重装文件不会重建 MCP 传输，会出现「注册表 enabled=true 但传输已断」
    // 的中间态。原本就启用着的，更新后停一次再启一次，让传输按新文件重挂。
    if (entry.kind === 'connector' && entry.record.enabled) {
      try { await hub.disableConnector(entry.name) } catch { /* 没挂上也继续 */ }
      await hub.enableConnector(entry.name)
    }
    return result
  }, [])

  const updateOne = useCallback(async entry => {
    const label = entry.record.displayName || entry.name
    setUpdateBusyKey(entry.key)
    setUpdateNoticeState(null)
    let result = { ok: true }
    try {
      await installEntry(entry)
    } catch (error) {
      result = { ok: false, message: String(error?.message || error), status: error?.status }
    }
    setUpdateNoticeState(updateNotice(entry.kind, label, result))
    setUpdateBusyKey('')
    setUpdateConfirmKey('')
    await loadInstalled()
    // 成功后重查（含该项）：用 refresh=1 绕开 60s 结果缓存，拿到最新判定
    if (result.ok) await checkUpdates({ refresh: true })
  }, [checkUpdates, installEntry, loadInstalled])

  const updateAll = useCallback(async list => {
    setUpdateBusyKey('__all__')
    setUpdateNoticeState(null)
    const failures = []
    let done = 0
    for (const entry of list) {
      const label = entry.record.displayName || entry.name
      try {
        await installEntry(entry)
        done += 1
      } catch (error) {
        failures.push(`${label}：${updateFailureReason({ message: String(error?.message || error), status: error?.status })}`)
      }
    }
    setUpdateNoticeState(failures.length === 0
      ? { ok: true, text: `已更新 ${done} 项` }
      : { ok: false, text: `已更新 ${done} 项，${failures.length} 项失败 —— ${failures.join('；')}` })
    setUpdateBusyKey('')
    setUpdateConfirmKey('')
    await loadInstalled()
    await checkUpdates({ refresh: true })
  }, [checkUpdates, installEntry, loadInstalled])

  /* ---------------------------------------------------------------- *
   * 本地 MCP 服务器（localMcp:true 才显示可操作界面）
   * ---------------------------------------------------------------- */
  const [localMcp, setLocalMcp] = useState(null)          // {guarded, reason, servers}
  const [localForm, setLocalForm] = useState({ name: '', url: '', token: '', busy: false })
  const [localNotice, setLocalNotice] = useState(null)
  const [localConfirmKey, setLocalConfirmKey] = useState('')
  const [localBusyKey, setLocalBusyKey] = useState('')
  const [localToggleKey, setLocalToggleKey] = useState('')
  const localConfirmRef = useRef(null)
  useEffect(() => { if (localConfirmKey) localConfirmRef.current?.focus?.() }, [localConfirmKey])

  const loadLocalMcp = useCallback(async () => {
    try { setLocalMcp(await hub.localMcpList()) } catch { /* 保留旧列表 */ }
  }, [])
  useEffect(() => { void loadLocalMcp() }, [loadLocalMcp])

  const submitLocalMcp = useCallback(async () => {
    const problem = validateLocalMcpForm(localForm.name, localForm.url, localForm.token)
    if (problem) { setLocalNotice({ ok: false, text: problem }); return }
    setLocalForm(prev => ({ ...prev, busy: true }))
    setLocalNotice(null)
    let result = null
    try {
      // token 只在这一次请求体里出现；提交后立即清空 state（不留存、不回显）
      result = await hub.localMcpSave(localForm.name.trim(), localForm.url.trim(), localForm.token)
      setLocalForm({ name: '', url: '', token: '', busy: false })
      setLocalNotice(localMcpSaveNotice(result))
    } catch (error) {
      setLocalForm(prev => ({ ...prev, token: '', busy: false }))
      setLocalNotice(localMcpSaveNotice({ ok: false, error: String(error?.message || error), status: error?.status }))
      return
    }
    await loadLocalMcp()
    // 注册成功且当前未启用 → 自动尝试启用（scrapling 用例：注册完即可用）
    if (result?.ok === true && result.server?.enabled !== true) {
      try {
        const enabled = await hub.localMcpEnable(result.server.name)
        setLocalNotice(localMcpActionNotice('enable', result.server.name, enabled))
        await loadLocalMcp()
      } catch (error) {
        setLocalNotice(localMcpActionNotice('enable', result.server.name, { ok: false, error: String(error?.message || error) }))
      }
    }
  }, [localForm, loadLocalMcp])

  const toggleLocalMcp = useCallback(async name => {
    const server = (localMcp?.servers ?? []).find(s => s.name === name)
    const action = server?.enabled ? 'disable' : 'enable'
    setLocalToggleKey(name)
    setLocalNotice(null)
    try {
      const result = action === 'enable' ? await hub.localMcpEnable(name) : await hub.localMcpDisable(name)
      setLocalNotice(localMcpActionNotice(action, name, result))
    } catch (error) {
      setLocalNotice(localMcpActionNotice(action, name, { ok: false, error: String(error?.message || error), status: error?.status }))
    }
    setLocalToggleKey('')
    await loadLocalMcp()
  }, [localMcp, loadLocalMcp])

  const removeLocalMcp = useCallback(async name => {
    setLocalBusyKey(name)
    setLocalNotice(null)
    let result = { ok: true }
    try { await hub.localMcpRemove(name) } catch (error) {
      result = { ok: false, error: String(error?.message || error), status: error?.status }
    }
    setLocalNotice(localMcpActionNotice('remove', name, result))
    setLocalBusyKey('')
    setLocalConfirmKey('')
    await loadLocalMcp()
  }, [loadLocalMcp])

  return (
    <section className="wbh-settings">
      <h2 className="wbh-secTitle">腾讯账号（官方市场数据）</h2>
      <div className="wbh-row">
        <span className="wbh-authState">
          <i className={`wbh-dot${loggedIn && !stale ? '' : ' off'}`} />
          {stale
            ? `登录已失效${auth?.nickname ? ` · ${auth.nickname}` : ''} — ${auth?.lastError || STALE_LOGIN_REASON}`
            : (loggedIn
              ? `已登录${auth?.nickname ? ` · ${auth.nickname}` : ''}`
              : '未登录 — 官方专家/技能目录与用量数据需要登录')}
        </span>
        {loggedIn && !stale
          ? <button type="button" className="wbh-btnGhost" onClick={async () => { await hub.authLogout(); await refresh() }}>注销</button>
          : <button type="button" className="wbh-btnPrimary" onClick={() => setShowAuth(true)}>扫码登录</button>}
      </div>
      {loggedIn && !stale && auth?.expiresAt && (
        <div className="wbh-row">
          <span className="wbh-muted">授权到期：{new Date(auth.expiresAt).toLocaleString('zh-CN')}；token 到期前自动刷新（后台每 30 分钟巡检一次保活）</span>
        </div>
      )}
      {stale && (
        <div className="wbh-row">
          <span className="wbh-muted">
            后台保活已连续失败 {auth?.keepalive?.consecutiveFailures ?? 0} 次
            {auth?.keepalive?.lastCheckAt ? `（最后巡检 ${new Date(auth.keepalive.lastCheckAt).toLocaleString('zh-CN')}）` : ''}
            ；refresh_token 已失效，需要重新扫码登录。
          </span>
        </div>
      )}

      <h2 className="wbh-secTitle" style={{ marginTop: 22 }}>已安装（{entries.length}）</h2>

      <div className="wbh-row wbh-updateBar">
        <span
          className={`wbh-updateSummary${checkFailed ? ' is-error' : ''}`}
          role="status"
          aria-live="polite"
        >{checkSummaryText(updates, checking)}</span>
        <span className="wbh-installedActions">
          {updatable.length > 0 && (updateConfirmKey === '__all__' ? (
            <span
              className="wbh-confirmRow"
              role="group"
              aria-label="确认全部更新"
              onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); setUpdateConfirmKey('') } }}
            >
              <span className="wbh-confirmText">
                确认更新 {updatable.length} 项？<span className="wbh-muted">（总下载量 {updatesSizeLabel(updatable)}）</span>
              </span>
              <button
                ref={updateConfirmRef}
                type="button"
                className="wbh-btnPrimary"
                disabled={updateBusyKey === '__all__'}
                aria-label={`确认全部更新 ${updatable.length} 项`}
                onClick={() => void updateAll(updatable)}
              >{updateBusyKey === '__all__' ? '更新中…' : '更新'}</button>
              <button
                type="button"
                className="wbh-btnGhost"
                disabled={updateBusyKey === '__all__'}
                aria-label="取消全部更新"
                onClick={() => setUpdateConfirmKey('')}
              >取消</button>
            </span>
          ) : (
            <button
              type="button"
              className="wbh-btnGhost wbh-updateAllBtn"
              disabled={updateBusyKey !== '' || checking}
              aria-label={`全部更新 ${updatable.length} 项`}
              onClick={() => { setNotice(null); setConfirmKey(''); setUpdateConfirmKey('__all__') }}
            >{updateBusyKey === '__all__' ? '更新中…' : `全部更新（${updatable.length}）`}</button>
          ))}
          <button
            type="button"
            className="wbh-btnGhost wbh-checkBtn"
            aria-busy={checking ? 'true' : undefined}
            disabled={checking || updateBusyKey !== ''}
            aria-label="检查更新"
            onClick={() => void checkUpdates({ refresh: true })}
          >{checking ? '检查中…' : '检查更新'}</button>
        </span>
      </div>

      {officialDown && (
        <p className="wbh-updateWarn" role="status">
          官方数据源不可用：{sources.official.reason} —— 相关条目显示「无法检查」。
          {!loggedIn && '（技能与连接器的检查需要登录官方账号）'}
        </p>
      )}
      {updateNoticeState && (
        <p
          className={`wbh-removeNotice${updateNoticeState.ok ? '' : ' is-error'}`}
          role={updateNoticeState.ok ? 'status' : 'alert'}
          aria-live="polite"
        >{updateNoticeState.text}</p>
      )}
      {notice && (
        <p className={`wbh-removeNotice${notice.ok ? '' : ' is-error'}`} role={notice.ok ? 'status' : 'alert'} aria-live="polite">
          {notice.text}
        </p>
      )}
      {entries.length === 0 && <div className="wbh-state"><p>在输入框「＋」或左侧入口浏览市场。</p></div>}
      {rows.map(row => (
        <InstalledRow
          key={row.key}
          entry={row}
          status={row.status}
          checking={checking}
          confirming={confirmKey === row.key}
          busy={busyKey === row.key}
          confirmRef={confirmRef}
          onAskRemove={() => { setNotice(null); setUpdateConfirmKey(''); setConfirmKey(row.key) }}
          onCancel={() => setConfirmKey('')}
          onConfirm={() => void remove(row)}
          updateConfirming={updateConfirmKey === row.key}
          updateBusy={updateBusyKey === row.key}
          updateConfirmRef={updateConfirmRef}
          onAskUpdate={() => { setUpdateNoticeState(null); setConfirmKey(''); setUpdateConfirmKey(row.key) }}
          onCancelUpdate={() => setUpdateConfirmKey('')}
          onConfirmUpdate={() => void updateOne(row)}
        />
      ))}

      <LocalMcpSection
        guarded={localMcp?.guarded === true}
        reason={localMcp?.reason || ''}
        servers={localMcp?.servers ?? []}
        loading={localMcp === null}
        form={localForm}
        onChange={setLocalForm}
        onSubmit={() => void submitLocalMcp()}
        notice={localNotice}
        confirmKey={localConfirmKey}
        busyKey={localBusyKey}
        toggleKey={localToggleKey}
        confirmRef={localConfirmRef}
        onAskRemove={name => { setLocalNotice(null); setLocalConfirmKey(name) }}
        onCancel={() => setLocalConfirmKey('')}
        onConfirm={name => void removeLocalMcp(name)}
        onToggle={name => void toggleLocalMcp(name)}
      />

      <p className="wbh-muted" style={{ marginTop: 16 }}>
        需要 OAuth 或 API Key 的连接器会在启用时发起独立授权；本页与浏览器端不会展示任何凭据值。
        移除连接器会先停用（拆掉 MCP 传输）再删文件；移除专家会一并摘掉各会话里的挂载。
        更新 = 重新下载安装（先清目录再落盘）。检查更新只比**官方元数据**：技能比官方 version、
        专家比官方 updatedAt、连接器比官方 MCP 定义哈希；取不到官方数据（未登录/接口不可用/
        记录缺安装时溯源）一律显示「无法检查」，绝不显示「已是最新」。
      </p>
      {showAuth && <WbAuthCard reason={stale ? STALE_LOGIN_REASON : ''} onClose={() => { setShowAuth(false); void refresh() }} />}
    </section>
  )
}
