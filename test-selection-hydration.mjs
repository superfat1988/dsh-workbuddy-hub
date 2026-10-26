// 客户端 chip 的**宿主对账**（hydration）契约测试。
//
// 真机缺陷背景：chip 原先只活在客户端内存（_selectedBySession），而「这个会话挂了什么」的
// 真源是宿主 mounts.json。于是刷新页面（含插件重启）或切换会话时，客户端列表是空的 →
// 输入框下方已加载的 MCP / 专家一个都不渲染，而宿主其实还挂着。
//
// 这里直接 import 真实的 src/hub.js（模块级只有常量与 Map/Set，浏览器 API 都在函数里且
// 有 try/catch），断言 reconcileSelections 的补/删/幂等/专家单槽位语义。
import assert from 'node:assert/strict'
import {
  addSelection, removeSelection, selectedItems, reconcileSelections,
  markMountPending, clearMountPending, pendingMounts,
  beginReconcile, isCurrentReconcile,
} from './src/hub.js'

const SID = 'session-hydration-1'
const OTHER = 'session-hydration-2'
const registry = {
  'connector/tdocs-app': { kind: 'connector', name: 'tdocs-app', displayName: '腾讯文档', icon: 'https://cdn/tdocs.png' },
  'expert/chatlaw-team-lead': { kind: 'expert', name: 'chatlaw-team-lead', displayName: '中文法律咨询团', icon: '' },
  'skill/xlsx': { kind: 'skill', name: 'xlsx', displayName: 'Excel 表格处理', icon: '' },
}

// 1) 空客户端 + 宿主有挂载 → 补齐 chip（刷新页面后的场景），名称/图标取自 registry
{
  const list = reconcileSelections(SID, ['connector/tdocs-app', 'expert/chatlaw-team-lead'], registry)
  assert.deepEqual(list.map(x => x.key), ['connector/tdocs-app', 'expert/chatlaw-team-lead'])
  assert.equal(list[0].displayName, '腾讯文档', 'chip 文案要用 registry 的 displayName')
  assert.equal(list[0].icon, 'https://cdn/tdocs.png', 'chip 图标要用 registry 的 icon（MCP 显示样式靠它）')
  assert.deepEqual(selectedItems(SID).map(x => x.key), list.map(x => x.key), '必须写进选中 store，rail 才会渲染')
}

// 2) 幂等：同一份挂载再对一次，不产生重复、不重复通知
{
  const before = selectedItems(SID)
  const again = reconcileSelections(SID, ['connector/tdocs-app', 'expert/chatlaw-team-lead'], registry)
  assert.equal(again.length, 2, '不得重复补齐')
  assert.equal(again, before, '内容不变时应返回同一个引用（避免无谓重渲染）')
}

// 3) 幽灵 chip：客户端有、宿主没有 → 丢掉（宿主赢）
{
  addSelection({ kind: 'skill', name: 'ghost', displayName: '幽灵技能' }, SID)
  assert.equal(selectedItems(SID).length, 3)
  const list = reconcileSelections(SID, ['connector/tdocs-app', 'expert/chatlaw-team-lead'], registry)
  assert.deepEqual(list.map(x => x.key).sort(), ['connector/tdocs-app', 'expert/chatlaw-team-lead'])
  assert.ok(!selectedItems(SID).some(x => x.name === 'ghost'), '宿主没有的挂载不得留在 chip 里')
}

// 4) 新挂载：宿主多出一条 → 补上（例如另一个客户端挂的，或切会话后新加载的）
{
  const list = reconcileSelections(SID, ['connector/tdocs-app', 'expert/chatlaw-team-lead', 'skill/xlsx'], registry)
  assert.ok(list.some(x => x.key === 'skill/xlsx'), '宿主新挂载的条目要出现在 chip 里')
}

// 5) 宿主为空（全卸载 / 空会话）→ chip 清空
{
  const list = reconcileSelections(SID, [], registry)
  assert.deepEqual(list, [])
  assert.deepEqual(selectedItems(SID), [])
}

// 6) 会话隔离：对账 A 会话不影响 B 会话
{
  addSelection({ kind: 'connector', name: 'other', displayName: '另一个' }, OTHER)
  reconcileSelections(SID, ['connector/tdocs-app'], registry)
  assert.deepEqual(selectedItems(OTHER).map(x => x.key), ['connector/other'], '别的会话的 chip 不能被牵连')
}

// 7) 专家单槽位：宿主只有一位专家，对账后客户端也只留一位
{
  addSelection({ kind: 'expert', name: 'old-expert', displayName: '旧专家' }, SID)
  const list = reconcileSelections(SID, ['connector/tdocs-app', 'expert/chatlaw-team-lead'], registry)
  assert.equal(list.filter(x => x.kind === 'expert').length, 1, '一个会话只挂一位专家')
  assert.equal(list.find(x => x.kind === 'expert').name, 'chatlaw-team-lead')
}

// 8) 脏数据：空串 / 缺名 / 非字符串 一律忽略，不抛错
{
  const list = reconcileSelections(SID, ['', '/', 'connector', null, undefined, 'connector/'], registry)
  assert.deepEqual(list, [], '非法挂载键必须被忽略')
}

// 9) 未登记的条目（registry 里没有）也要能补出来，用 name 兜底
{
  const list = reconcileSelections(SID, ['connector/unknown-app'], registry)
  assert.equal(list.length, 1)
  assert.equal(list[0].displayName, 'unknown-app', '缺 registry 记录时用 name 兜底')
  assert.equal(list[0].icon, '')
}

// 10) removeSelection 与对账一致（用户点 chip 上的 X 之后宿主动作由 detach 负责）
{
  reconcileSelections(SID, ['connector/tdocs-app', 'connector/unknown-app'], registry)
  removeSelection(SID, 'connector', 'unknown-app')
  assert.deepEqual(selectedItems(SID).map(x => x.key), ['connector/tdocs-app'])
}

/* ------------------------------------------------------------------ *
 * 11-13) 挂载在途（pending mount）—— 真机缺陷：召唤后 chip 永久消失
 *
 * 场景：attach 先乐观出 chip，然后 POST /mount。安装成功会触发一次 refresh，
 * 那次 GET /mounted 的快照**早于** mount，宿主里自然没有这条 —— 若把在途
 * 条目按幽灵删掉，且这次对账的响应后到，最终 chip 就没了（宿主其实挂着）。
 * ------------------------------------------------------------------ */

// 11) 在途的挂载不被当做幽灵 chip 删掉
{
  const sid = 'session-pending-1'
  addSelection({ kind: 'expert', name: 'gap-expert', displayName: '缺口专家' }, sid)
  markMountPending(sid, 'expert/gap-expert')
  assert.deepEqual(pendingMounts(sid), ['expert/gap-expert'], '在途标记要能查到')
  const list = reconcileSelections(sid, [], registry)   // 早于 mount 的空快照
  assert.deepEqual(list.map(x => x.key), ['expert/gap-expert'], '在途条目不得被当幽灵删掉')
  assert.deepEqual(selectedItems(sid).map(x => x.key), ['expert/gap-expert'], 'chip 必须还在')
  assert.equal(list, selectedItems(sid), '内容没变时应返回同一引用，不触发无谓重渲染')
}

// 12) mount 落定后（清除在途）同样的空快照要照旧清空 —— 不能变成「永不删除」
{
  const sid = 'session-pending-1'
  clearMountPending(sid, 'expert/gap-expert')
  assert.deepEqual(pendingMounts(sid), [], '落定后在途标记要清掉')
  const list = reconcileSelections(sid, [], registry)
  assert.deepEqual(list, [], '落定后宿主没有的条目照旧按幽灵清掉')
}

// 13) 专家单槽位：在途专家要把快照里的旧专家顶掉（不能同时留两位）
{
  const sid = 'session-pending-2'
  addSelection({ kind: 'expert', name: 'old-expert', displayName: '旧专家' }, sid)
  reconcileSelections(sid, ['expert/old-expert'], registry)
  assert.deepEqual(selectedItems(sid).map(x => x.name), ['old-expert'])
  addSelection({ kind: 'expert', name: 'new-expert', displayName: '新专家' }, sid)
  markMountPending(sid, 'expert/new-expert')
  const list = reconcileSelections(sid, ['expert/old-expert'], registry)  // 早于 mount 的快照
  assert.deepEqual(list.map(x => x.name), ['new-expert'], '在途专家必须顶掉快照里的旧专家')
  clearMountPending(sid, 'expert/new-expert')
}

// 14) 对账序号：过期的快照必须被丢弃（先发后到的响应不许覆盖新状态）
{
  const sid = 'session-epoch-1'
  const older = beginReconcile(sid)
  const newer = beginReconcile(sid)
  assert.ok(newer > older, '序号必须单调递增')
  assert.equal(isCurrentReconcile(sid, newer), true, '最新一次快照允许落地')
  assert.equal(isCurrentReconcile(sid, older), false, '过期快照必须被丢弃')
  const fresh = beginReconcile(sid)
  assert.equal(isCurrentReconcile(sid, fresh), true, '再领新号后旧号继续被丢弃')
  assert.equal(isCurrentReconcile(sid, newer), false)
  // 未领号（undefined）的调用方（老测试/直连调用）保持可用
  assert.equal(isCurrentReconcile('session-epoch-never', undefined), true)
}

console.log('selection hydration (host mounts → chips) contract tests: OK')
