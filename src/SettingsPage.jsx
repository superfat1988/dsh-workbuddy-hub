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
  if (/\b(403|429)\b|rate limit|api rate/i.test(message)) return `镜像接口限流：${message}${withStatus}`
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
  const officialDown = sources.official?.ok === false
  const mirrorDown = sources.mirror?.ok === false

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

      {(officialDown || mirrorDown) && (
        <p className="wbh-updateWarn" role="status">
          {officialDown && <>官方注册表不可用：{sources.official.reason} —— 相关专家显示「无法检查」。</>}
          {officialDown && mirrorDown && <br />}
          {mirrorDown && <>镜像不可用：{sources.mirror.reason} —— 相关技能/连接器显示「无法检查」。</>}
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

      <p className="wbh-muted" style={{ marginTop: 16 }}>
        需要 OAuth 或 API Key 的连接器会在启用时发起独立授权；本页与浏览器端不会展示任何凭据值。
        移除连接器会先停用（拆掉 MCP 传输）再删文件；移除专家会一并摘掉各会话里的挂载。
        更新 = 重新下载安装（先清目录再落盘），官方专家按官方注册表的时间戳判断，
        技能/连接器按镜像内容逐文件比对；取不到远端时显示「无法检查」而不是「已是最新」。
      </p>
      {showAuth && <WbAuthCard reason={stale ? STALE_LOGIN_REASON : ''} onClose={() => { setShowAuth(false); void refresh() }} />}
    </section>
  )
}
