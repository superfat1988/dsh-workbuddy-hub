/**
 * 「待生效专家」语义测试。
 *
 * 方案：召唤 = 记下「待生效的专家」+ 进入 DSH 官方新建会话流程；用户选任意工作区，
 * 新会话的 composer 一挂载（拿到那个会话的 sessionId）就把专家挂上去。
 * 专家跟「会话」走而不是跟「插件猜的工作区」走 —— 不依赖工作区解析，也不改官方框架。
 */
import assert from 'node:assert/strict'
import {
  setPendingExpert, takePendingExpert, peekPendingExpert, clearPendingExpert,
  setSessionStarter, summonExpertInNewSession,
  markExpertRecent, recentExpertNames,
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
      ? {
        installed: {
          'expert/demo': { kind: 'expert', name: 'demo' },
          'expert/demo2': { kind: 'expert', name: 'demo2' },
        },
      }
      : {}),
  })
  const r = await summonExpertInNewSession({ kind: 'expert', name: 'demo', displayName: '演示专家' })
  assert.equal(r.ok, true, '召唤应成功进入新建会话流程')
  assert.equal(r.pending, true)
  assert.equal(r.replaced, '', '首次召唤没有被替换的专家')
  assert.equal(takePendingExpert()?.name, 'demo', '召唤必须把该专家记为待生效')

  // 5) 重复召唤（不开始新对话）：单个槽位，后者替换前者，并回传 replaced 供界面提示
  const a = await summonExpertInNewSession({ kind: 'expert', name: 'demo', displayName: '演示专家' })
  assert.equal(a.replaced, '', '槽位为空时 replaced 应为空')
  const b = await summonExpertInNewSession({ kind: 'expert', name: 'demo2', displayName: '第二位专家' })
  assert.equal(b.ok, true)
  assert.equal(b.replaced, 'demo', '再次召唤必须回传被替换的专家名（界面据此提示用户）')
  assert.equal(peekPendingExpert()?.name, 'demo2', '单槽位：只保留最后一次召唤的专家')

  // 6) peek 不消费 → 换工作区/换新会话可以反复落位；take 才消费（显式取消用）
  assert.equal(peekPendingExpert()?.name, 'demo2', 'peek 必须可重复调用（每次新会话都要能渲染 chip）')
  assert.equal(peekPendingExpert()?.name, 'demo2')
  clearPendingExpert()
  assert.equal(peekPendingExpert(), null, 'clear 之后 peek 也必须为空')
} finally {
  globalThis.fetch = realFetch
  setSessionStarter(null)
}

// 7) 「最近加载过的专家」：最近优先、去重、上限 8；无记录时为空（picker 回落到原排序）
const mem = new Map()
globalThis.localStorage = {
  getItem: k => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: k => mem.delete(k),
}
try {
  assert.deepEqual(recentExpertNames(), [], '没有记录时必须为空，picker 才能回落到原排序')
  markExpertRecent({ name: 'e1' })
  markExpertRecent({ name: 'e2' })
  assert.deepEqual(recentExpertNames(), ['e2', 'e1'], '最新加载的排最前')
  markExpertRecent({ name: 'e1' })
  assert.deepEqual(recentExpertNames(), ['e1', 'e2'], '重复加载要提到最前且不重复出现')
  for (let i = 0; i < 10; i += 1) markExpertRecent({ name: 'x' + i })
  assert.equal(recentExpertNames().length, 8, '最多保留 8 个')
  assert.equal(recentExpertNames()[0], 'x9', '最新的仍在最前')
} finally {
  delete globalThis.localStorage
}

console.log('pending expert (summon -> composer mount) semantics: OK')
console.log('recent experts (picker ordering input) semantics: OK')
