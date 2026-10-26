/**
 * 闲置能力判定的边界测试。
 *
 * 重点是四条闸门和 idleDays 的两个上限，它们决定「会不会弹」——
 * 弹错一次用户就会关掉，所以每个分支都要钉死。
 */
import assert from 'node:assert/strict'
import { computeCandidates, dayOfMs, daysBetween } from './wb-idle.js'

const TODAY = '2026-10-26'
const daysAgo = n => dayOfMs(Date.now() - n * 86400000)

// 都用固定日期串，不依赖真实当天
// scanUsage 的字段名就是 skills / mcp / lastDay，别在这儿改成别的
const usage = {
  skills: {
    usedToday: { lastDay: TODAY, count: 3 },
    usedLongAgo: { lastDay: '2026-09-01', count: 1 },
  },
  mcp: { busy: { lastDay: TODAY, count: 9 } },
  activeDays: Array.from({ length: 20 }, (_, i) => daysAgo(i)),
}

const skills = [
  { id: 'usedToday', name: 'workbuddy-used-today', installedDay: '2026-09-01' },
  { id: 'usedLongAgo', name: 'workbuddy-used-long-ago', installedDay: '2026-08-01' },
  { id: 'neverUsed', name: 'workbuddy-never-used', installedDay: '2026-09-21' },
  { id: 'brandNew', name: 'workbuddy-brand-new', installedDay: TODAY },
]
const mcps = [
  { id: 'busy', name: 'busy', installedDay: '2026-08-01' },
  { id: 'idle', name: 'idle', installedDay: '2026-08-01' },
]

const ids = r => r.candidates.map(c => c.id).sort()

// 1) 基本筛选：当天用过的排除，从未用过按安装日算
{
  const r = computeCandidates({ usage, skills, mcps, state: {}, today: TODAY })
  assert.equal(r.blockedBy, null)
  assert.deepEqual(ids(r), ['idle', 'neverUsed', 'usedLongAgo'])
  const never = r.candidates.find(c => c.id === 'neverUsed')
  assert.equal(never.lastUsedDate, null)
  assert.equal(never.idleDays, daysBetween('2026-09-21', TODAY))
}

// 2) 新装即用：安装当天不判闲置（官方也 cap）
{
  const r = computeCandidates({ usage, skills, mcps, state: {}, today: TODAY })
  assert.ok(!ids(r).includes('brandNew'), '安装当天不该入选')
}

// 3) 当天已弹过
{
  const r = computeCandidates({ usage, skills, mcps, state: { lastShownDate: TODAY }, today: TODAY })
  assert.equal(r.blockedBy, 'shown-today')
  assert.equal(r.candidates.length, 0)
}

// 4) 全局不再提醒（版本 >= 3）
{
  const r = computeCandidates({ usage, skills, mcps, state: { globalDismissed: true, globalDismissedVersion: 3 }, today: TODAY })
  assert.equal(r.blockedBy, 'global-dismissed')
  assert.equal(r.candidates.length, 0)
}

// 5) 旧版本号不算数 —— 升级后要重新提示
{
  const r = computeCandidates({ usage, skills, mcps, state: { globalDismissed: true, globalDismissedVersion: 2 }, today: TODAY })
  assert.equal(r.blockedBy, null)
}

// 6) 新用户保护：活跃天数不够 ceil(threshold/2) 就不弹（官方漏了这条）
{
  const r = computeCandidates({
    usage: { skills: {}, mcp: {}, activeDays: [daysAgo(0), daysAgo(1)] },
    skills, mcps, state: {}, today: TODAY,
  })
  assert.equal(r.blockedBy, 'too-new')
}

// 7) 阈值参数与排序
{
  const r = computeCandidates({ usage, skills, mcps, state: {}, today: TODAY, idleThreshold: 7 })
  assert.equal(r.threshold, 7)
  const days = r.candidates.map(c => c.idleDays)
  assert.deepEqual(days, [...days].sort((a, b) => b - a), '应按闲置天数降序')
  // 阈值高于任何一条的「安装至今」年龄时，全被 cap 掉 —— 这是防新装误判的必然结果
  const strict = computeCandidates({ usage, skills, mcps, state: {}, today: TODAY, idleThreshold: 100 })
  assert.deepEqual(strict.candidates.map(c => c.id), [], '没有任何一条装够 100 天')

  // cap 生效：usedLongAgo 最后用 09-01（55 天前），但装于 08-01（86 天前），取小的那个
  const long = r.candidates.find(c => c.id === 'usedLongAgo')
  assert.equal(long.idleDays, daysBetween('2026-09-01', TODAY))
}

// 8) mcp 也参与判定
{
  const r = computeCandidates({ usage, skills: [], mcps, state: {}, today: TODAY })
  assert.deepEqual(ids(r), ['idle'])
}

console.log('test-idle: ok')
