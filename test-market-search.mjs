/**
 * 市场搜索（GET /market-list）路由级测试 —— 修「三种 kind 的搜索栏没按预期工作」。
 *
 * 覆盖的 bug（均在隔离实例 + 真实 UI 复现过，证据见验收报告）：
 *  1) 连接器分支把官方注册表全量原样返回，**完全忽略 q**（搜「地图」和不搜都是 24 条）。
 *     修复：官方接口没有关键词参数 → 宿主本地过滤，口径与 scripts/hub-find.mjs
 *     filterRows 一致（name/displayName/description/authType，大小写不敏感 includes，
 *     空关键词不过滤，无命中给空列表走既有空态）。
 *  2) 技能/专家分支把 `payload.keyword = q0` 交给 marketList，而 marketList 的解构
 *     签名是 ({ page, pageSize, query }) —— keyword 被静默丢掉，官方 body 里没有
 *     keyword → **任何关键词都返回全量列表**（q=表格 与 q=zzzz不存在zzzz 与 q=空
 *     逐字节一致）。修复：改为 payload.query（page_size → pageSize 同批修正）。
 *
 * 全程不联网：wb-market.js 的 call() 走 globalThis.fetch，这里对两种上游接口打桩
 * （连接器注册表 GET registry2c/list / 市场 list POST）；stateDir 用 mkdtemp 临时目录。
 */
import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { apply } from './index.js'
import { saveAuth, AUTH_HEALTH_FILE } from './wb-market.js'

const realFetch = globalThis.fetch
const tempDirs = []
const mkTmp = prefix => { const d = mkdtempSync(join(tmpdir(), prefix)); tempDirs.push(d); return d }

/* ---------------- 打桩的上游数据 ---------------- */

// 连接器注册表：两条 + 一个 authType 里带关键词的（大小写不敏感要用）
const STUB_CONNECTORS = [
  { name: 'amap-open', auth_type: 'oauth', is_connected: false,
    data: { display_name: '高德地图', description: '地图与路线规划', icon_url: 'https://x/y.png' } },
  { name: 'tdocs-app', auth_type: 'oauth', is_connected: false,
    data: { display_name: '腾讯文档', description: '在线文档协作' } },
  { name: 'plain-http-hook', auth_type: 'APIKey', is_connected: false,
    data: { display_name: '普通钩子', description: '示例' } },
]
// 市场 list：回显收到的 body，既断言「官方确实收到了什么」，也按 body.keyword 出数
let lastMarketBody = null
const STUB_SKILLS_FULL = [
  { skill_id: 'xlsx', display_name_zh: 'Excel 表格处理', description_zh: '表格公式' },
  { skill_id: 'pdf', display_name_zh: 'PDF 文档处理', description_zh: 'PDF 拆分' },
]

function upstream(_kind, path, init) {
  if (path === '/console/as/connector/registry2c/list?scope=all') {
    return { status: 200, text: async () => JSON.stringify({ code: 0, data: { list: STUB_CONNECTORS } }) }
  }
  const m = path.match(/^\/v2\/operation-platform\/market\/(skill|expert)\/list$/)
  if (m) {
    lastMarketBody = JSON.parse(init.body)
    const kw = String(lastMarketBody.keyword || '')
    const rows = kw ? STUB_SKILLS_FULL.filter(s => (s.display_name_zh || '').includes(kw)) : STUB_SKILLS_FULL
    return { status: 200, text: async () => JSON.stringify({ code: 0, data: { total_count: rows.length, [`${m[1]}s`]: rows } }) }
  }
  return { status: 404, text: async () => JSON.stringify({ code: 404, msg: 'stub: unexpected ' + path }) }
}

/* ---------------- 宿主路由 harness（同 test-keepalive.mjs） ---------------- */

let handler = null
const ctx = {
  get: () => undefined,
  sessions: { list: () => [] },
  agents: { get: () => null },
  connection: {},
  webServer: { register: spec => { handler = spec.handler; return () => {} } },
  effect: fn => { const d = fn(); return typeof d === 'function' ? d : () => {} },
  on: () => () => {},
  commands: { register: () => () => {} },
  loader: { create: () => ({ dispose() {}, disposeAll() {} }) },
  credentials: { resolve: async () => 'token', set: async () => {} },
  subagents: { startContinuable: async () => ({ childId: 'child-1' }) },
}
const makeRes = () => {
  const chunks = []
  return {
    statusCode: 0, headers: {},
    setHeader(k, v) { this.headers[k.toLowerCase()] = v },
    end(chunk) { if (chunk !== undefined) chunks.push(String(chunk)) },
    get body() { return chunks.join('') },
  }
}
const call = async (method, path) => {
  const req = new EventEmitter()
  req.method = method
  req.url = '/workbuddy-hub' + path
  req.headers = {}
  req.destroy = () => {}
  const res = makeRes()
  const done = handler(req, res)
  req.emit('end')
  await done
  let parsed = null
  try { parsed = JSON.parse(res.body) } catch { parsed = null }
  return { status: res.statusCode, json: parsed }
}

try {
  const root = mkTmp('wbh-market-search-')
  const stateDir = join(root, '.meta', 'state')
  mkdirSync(stateDir, { recursive: true })
  // 假凭证（剩余寿命新鲜 → bearer 不会触发 refresh 网络请求）；健康档写 0600 同生产语义
  saveAuth(stateDir, { access_token: 'stub-token', refresh_token: 'stub-refresh', expires_in: 6 * 3600, obtainedAt: Date.now(), uid: 'u-search', nickname: '搜索测试' })
  writeFileSync(join(stateDir, AUTH_HEALTH_FILE), JSON.stringify({ consecutiveFailures: 0, lastError: '', lastCheckAt: 0, staleAt: null }), { mode: 0o600 })

  globalThis.fetch = async (url, init = {}) => upstream(null, String(url).replace(/^https:\/\/[^/]+/, ''), init)
  apply(ctx, { storeRoot: root, skillsMount: join(root, '.dsh-skills'), keepalive: false })
  assert.equal(typeof handler, 'function', '插件必须注册 webServer 前缀路由')

  /* ========== 1) 连接器：服务端本地过滤 ========== */

  // 全量（无 q）
  let r = await call('GET', '/market-list?kind=connector&pageSize=60&q=')
  assert.equal(r.status, 200)
  assert.equal(r.json.source, 'official')
  assert.equal(r.json.total, 3, '空关键词不过滤：3 条全给')
  assert.equal(r.json.rows.length, 3)
  assert.equal(r.json.error, undefined, '成功路径不得带 error（客户端靠它区分空态与失败）')

  // 命中 displayName（高德地图 → amap-open）
  r = await call('GET', '/market-list?kind=connector&q=' + encodeURIComponent('地图'))
  assert.equal(r.json.total, 1)
  assert.deepEqual(r.json.rows.map(x => x.name), ['amap-open'])
  assert.equal(r.json.rows[0].displayName, '高德地图')

  // 命中 name（tdocs → 腾讯文档）
  r = await call('GET', '/market-list?kind=connector&q=tdocs')
  assert.deepEqual(r.json.rows.map(x => x.name), ['tdocs-app'], 'name 也要参与匹配')

  // 命中 description
  r = await call('GET', '/market-list?kind=connector&q=' + encodeURIComponent('路线规划'))
  assert.deepEqual(r.json.rows.map(x => x.name), ['amap-open'], 'description 参与匹配')

  // authType：大小写不敏感（官方数据 APIKey，搜 apikey 要能命中 plain-http-hook）
  r = await call('GET', '/market-list?kind=connector&q=apikey')
  assert.deepEqual(r.json.rows.map(x => x.name), ['plain-http-hook'], 'authType 大小写不敏感匹配')

  // 无命中 → 空列表（客户端走既有「暂无连接器」空态，不报错）
  r = await call('GET', '/market-list?kind=connector&q=' + encodeURIComponent('zzzz不存在zzzz'))
  assert.equal(r.status, 200)
  assert.equal(r.json.ok, true)
  assert.equal(r.json.total, 0)
  assert.deepEqual(r.json.rows, [], '无命中必须是空列表，不能回落全量')
  assert.equal(r.json.error, undefined, '官方成功但无命中 ≠ 失败，不得带 error 文案')

  /* ========== 2) 技能：keyword 必须真的透传给官方市场 API ========== */

  // 路由转发：q → marketList payload.query → 官方 body.keyword（此前 keyword 会被丢掉）
  r = await call('GET', '/market-list?kind=skill&page=1&pageSize=60&q=' + encodeURIComponent('表格'))
  assert.equal(r.status, 200)
  assert.equal(r.json.source, 'official')
  assert.equal(lastMarketBody.keyword, '表格', 'q 必须以 keyword 写进官方 body（旧代码传 payload.keyword 但 marketList 读 query，被丢）')
  assert.equal(lastMarketBody.page_size, 60, 'pageSize 也要按 marketList 的契约传（旧代码 page_size 被丢弃）')
  assert.equal(r.json.total, 1, '官方按 keyword 过滤后的结果要如实返回')

  // 空关键词 → body 里没有 keyword 字段
  await call('GET', '/market-list?kind=skill&q=')
  assert.ok(!('keyword' in lastMarketBody), '空关键词不得携带 keyword（口径：空关键词不过滤）')

  // 无命中 → 空列表 + 无 error（官方 200 正常返回，不算失败）
  r = await call('GET', '/market-list?kind=skill&q=' + encodeURIComponent('没有这个词'))
  assert.equal(r.json.total, 0)
  assert.deepEqual(r.json.rows, [])
  assert.equal(r.json.error, undefined)

  /* ========== 3) 专家分支（同一个 payload 代码路径）也要透传 ========== */

  r = await call('GET', '/market-list?kind=expert&q=' + encodeURIComponent('表格'))
  assert.equal(lastMarketBody.keyword, '表格', 'expert 与 skill 共用分支，同样要透传')

  console.log('market search (route-level, stubbed upstream) tests: OK')
} finally {
  globalThis.fetch = realFetch
  for (const d of tempDirs) rmSync(d, { recursive: true, force: true })
}
