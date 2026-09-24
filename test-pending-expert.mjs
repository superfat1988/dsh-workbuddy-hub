/**
 * 「待生效专家」语义测试。
 *
 * 方案：召唤 = 记下「待生效的专家」+ 进入 DSH 官方新建会话流程；用户选任意工作区，
 * 新会话的 composer 一挂载（拿到那个会话的 sessionId）就把专家挂上去。
 * 专家跟「会话」走而不是跟「插件猜的工作区」走 —— 不依赖工作区解析，也不改官方框架。
 */
import assert from 'node:assert/strict'
import {
  setPendingExpert, takePendingExpert, clearPendingExpert,
  setSessionStarter, summonExpertInNewSession,
} from './src/hub.js'

// 1) 设置 → 取用一次 → 再取为空（一次性消费，避免误挂到别的会话）
setPendingExpert({ name: 'demo', kind: 'expert' })
assert.equal(takePendingExpert()?.name, 'demo')
assert.equal(takePendingExpert(), null, '待生效专家只能被消费一次')

// 2) clear 后取不到
setPendingExpert({ name: 'demo2', kind: 'expert' })
clearPendingExpert()
assert.equal(takePendingExpert(), null, 'clear 之后不应再取到')

// 3) 超过 5 分钟过期（避免很久以后切会话时误挂）
const realNow = Date.now
try {
  Date.now = () => 0
  setPendingExpert({ name: 'stale', kind: 'expert' })
  Date.now = () => 6 * 60 * 1000
  assert.equal(takePendingExpert(), null, '超过 TTL 的待生效专家必须失效')
} finally { Date.now = realNow }

// 4) 召唤写入「待生效专家」并进入新建会话流程（已安装的专家不触发下载）
const realFetch = globalThis.fetch
try {
  setSessionStarter(() => true)
  globalThis.fetch = async url => ({
    ok: true,
    json: async () => (String(url).includes('/installed')
      ? { installed: { 'expert/demo': { kind: 'expert', name: 'demo' } } }
      : {}),
  })
  const r = await summonExpertInNewSession({ kind: 'expert', name: 'demo', displayName: '演示专家' })
  assert.equal(r.ok, true, '召唤应成功进入新建会话流程')
  assert.equal(r.pending, true)
  assert.equal(takePendingExpert()?.name, 'demo', '召唤必须把该专家记为待生效')
} finally {
  globalThis.fetch = realFetch
  setSessionStarter(null)
}

console.log('pending expert (summon -> composer mount) semantics: OK')
