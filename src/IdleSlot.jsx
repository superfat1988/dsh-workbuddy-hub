/**
 * 闲置能力提醒的宿主壳。
 *
 * 挂 conversation.composer.dock —— 每个会话都在，卡片自己是 fixed 定位挂右上角。
 * 数据只在挂载后拉一次；`GET /idle` 背后要解压近月的会话记录，属于重活，
 * 不做轮询。用户关掉/一键关闭后本会话内不再自动回来。
 */
import React, { useEffect, useRef, useState } from 'react'
import IdleCard from './IdleCard.jsx'
import { idleList, idleShown, idleDismissGlobal, idleClose, openMarket } from './hub.js'

export default function IdleSlot({ ctx }) {
  const [data, setData] = useState(null)
  const [closed, setClosed] = useState(false)
  const [toast, setToast] = useState(null)   // {count} 一键关闭后的成功提示
  const reported = useRef(false)
  const toastTimer = useRef(null)

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current) }, [])

  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(async () => {
      try {
        const result = await idleList()
        if (cancelled) return
        if (result?.candidates?.length > 0 && !result.blockedBy) {
          setData(result)
          // 记「今天弹过」，当天不再重复打扰（官方同款闸门）
          if (!reported.current) { reported.current = true; idleShown().catch(() => {}) }
        }
      } catch { /* 拉不到就不打扰用户，静默 */ }
    }, 3000)   // 首屏先让人看见对话，别一进来就抢注意力
    return () => { cancelled = true; clearTimeout(timer) }
  }, [])

  if (closed || !data) return null

  const onDisable = async items => {
    const result = await idleClose(items)
    const closedKeys = new Set(result?.succeeded ?? [])
    // 只把真正关掉的从候选里摘掉；失败的原样留着，让人能再试一次
    setData(prev => {
      if (!prev) return prev
      const rest = prev.candidates.filter(c => !closedKeys.has(`${c.type}:${c.id}`))
      return { ...prev, candidates: rest }
    })
    if (closedKeys.size > 0) {
      // 关完给退路：告诉用户关了什么、去哪开回来。不弹确认、不拦下一步。
      setToast({ count: closedKeys.size })
      if (toastTimer.current) clearTimeout(toastTimer.current)
      toastTimer.current = setTimeout(() => setToast(null), 5000)
    }
    if (result?.failed?.length) {
      console.warn('[wbh] idle close partially failed:', result.failed)
    }
  }

  const onDismissGlobal = async () => {
    setClosed(true)
    await idleDismissGlobal().catch(() => {})
  }

  const gotoManage = () => { try { openMarket?.() } catch { /* 导航不可用时忽略 */ } }

  return (
    <>
      {data && !closed && (
        <IdleCard
          data={data}
          onClose={() => setClosed(true)}
          onDismissGlobal={onDismissGlobal}
          onDisable={onDisable}
          onManage={gotoManage}
        />
      )}
      {toast && (
        <div className="wbh-port">
          <div className="idle-capability-toast" role="status">
            <span>已关闭 {toast.count} 项技能或 MCP，可随时在</span>
            <button type="button" className="idle-capability-toast__manage-link" onClick={gotoManage}>管理页</button>
            <span>重新开启。</span>
          </div>
        </div>
      )}
    </>
  )
}
