// 「官方档案缺口 → 按条目回落镜像」的契约测试（离线：fetch 全打桩）。
//
// 真机缺陷背景：官方注册表（expert_center.json）里列着某个专家，但官方 CDN 上**没有**
// 他的人设文件（实测 personal-knowledge-architect 的 promptFile 返回 404，429 位里约
// 四分之一如此）。此前 installExpert 直接抛错，而客户端从官方目录点「召唤」时传的是
// source='official' → 严格分支立即重抛 → 用户在 picker 里点「召唤」永远只拿到失败，
// 专家永远挂不进对话。同一件事还留下一个空目录 experts/<name>/（注册表里没有记录）。
//
// 现在的契约：
//   1) 官方 persona 404（档案缺口）→ 按**条目**回落镜像仓，装了并如实标注来源；
//      展示标签仍取官方注册表（名字/简介），但绝不写 official/officialMeta。
//   2) 官方 persona 200 → 照旧是官方安装（不碰镜像）。
//   3) 官方 5xx（服务不可用）→ 维持原有严格语义：source='official' 时如实失败。
//   4) 缺口 + 镜像也没有 → 502，且错误信息说清「官方缺文件 + 镜像也没有」。
//   5) 失败不留半成品目录；但**已存在**的目录（上一份可用副本）不许删。
import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { mkdtempSync, mkdirSync, existsSync, writeFileSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { apply } from './index.js'
import { readExpertPersona } from './expert-persona.js'

const REGISTRY = 'https://acc-1258344699.cos.accelerate.myqcloud.com/workbuddy/expert-marketplace'
const GH_RAW = 'https://raw.githubusercontent.com'

const EXPERT_MD = '---\nname: demo\n---\n\n人设正文：测试用。\n'
const OFFICIAL_EXPERTS = [
  { id: 'GapExpert', agentName: 'gap-expert', displayName: JSON.stringify({ zh: '缺口专家' }), profession: '', description: JSON.stringify({ zh: '官方缺人设的那位' }), tags: [], promptFile: '/personas/gap.md', avatar: '' },
  { id: 'OkExpert', agentName: 'ok-expert', displayName: JSON.stringify({ zh: '正常专家' }), profession: '', description: JSON.stringify({ zh: '官方档案完整' }), tags: [], promptFile: '/personas/ok.md', avatar: '' },
  { id: 'OrphanExpert', agentName: 'orphan-expert', displayName: JSON.stringify({ zh: '孤儿专家' }), profession: '', description: '', tags: [], promptFile: '/personas/orphan.md', avatar: '' },
]

/** 镜像仓的 tree：只有 gap-expert 有文件（orphan-expert 故意没有）。 */
const MIRROR_TREE = [
  { type: 'blob', path: 'experts/gap-expert/agents/gap-expert.md', size: EXPERT_MD.length },
  { type: 'blob', path: 'experts/gap-expert/.codebuddy-plugin/plugin.json', size: 60 },
]

let personaStatus = { gap: 404, ok: 200, orphan: 404 }
const hits = []
const realFetch = globalThis.fetch
globalThis.fetch = async (url, init) => {
  const u = String(url)
  hits.push(u)
  const reply = (status, body) => ({
    ok: status >= 200 && status < 300,
    status,
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
    json: async () => (typeof body === 'string' ? JSON.parse(body) : body),
    arrayBuffer: async () => Buffer.from(typeof body === 'string' ? body : JSON.stringify(body)),
  })
  if (u.includes('expert_center.json')) return reply(200, { experts: OFFICIAL_EXPERTS })
  if (u.startsWith(`${REGISTRY}/personas/gap.md`)) return reply(personaStatus.gap, personaStatus.gap === 200 ? EXPERT_MD : 'not found')
  if (u.startsWith(`${REGISTRY}/personas/ok.md`)) return reply(personaStatus.ok, personaStatus.ok === 200 ? EXPERT_MD : 'boom')
  if (u.startsWith(`${REGISTRY}/personas/orphan.md`)) return reply(personaStatus.orphan, 'not found')
  if (u.includes('/git/trees/')) return reply(200, { tree: MIRROR_TREE })
  if (u.startsWith(GH_RAW)) {
    // https://raw.githubusercontent.com/<repo>/<branch>/<path…>
    const path = u.replace(`${GH_RAW}/superfat1988/workbuddyskills/`, '').split('/').slice(1).join('/')
    const hit = MIRROR_TREE.find(b => b.path === path)
    if (!hit) return reply(404, 'not found')
    return reply(200, path.endsWith('plugin.json') ? JSON.stringify({ name: 'gap-expert', agentName: 'gap-expert' }) : EXPERT_MD)
  }
  return reply(404, 'unexpected fetch: ' + u)
}

const mkRoot = label => {
  const root = mkdtempSync(join(tmpdir(), `wbhub-gap-${label}-`))
  process.on('exit', () => { try { rmSync(root, { recursive: true, force: true }) } catch { /* 忽略 */ } })
  return root
}

/** 假 ctx（与 test-install-tool.mjs 同形）：捕获路由 handler。 */
function boot(root, cfg = {}) {
  let handler = null
  const ctx = {
    get: name => (name === 'tools' ? { schemas: () => [] } : undefined),
    connection: {},
    webServer: { register: spec => { handler = spec.handler; return () => {} } },
    effect: fn => { try { return fn() } catch { return () => {} } },
    on: () => () => {},
    logger: { info() {}, warn() {}, error() {} },
    commands: { register: () => () => {} },
    sessions: { list: () => [] },
    agents: { get: () => null },
    credentials: { resolve: async ref => ({ value: `resolved-${ref}` }), set: async () => {} },
    loader: { create: async () => 'row', resolve: () => ({ fiber: { await: async () => {}, dispose() {} } }), remove: () => {}, store: {} },
    subagents: { startContinuable: async () => ({ childId: 'child-1' }) },
    tools: { register: () => () => {} },
  }
  apply(ctx, { storeRoot: root, skillsMount: join(root, 'mount'), mirrorFallback: false, keepalive: false, ...cfg })
  return { handler, root }
}

async function install(handler, payload) {
  const chunks = []
  const req = new EventEmitter()
  req.method = 'POST'; req.url = '/workbuddy-hub/install'; req.headers = {}
  const res = {
    statusCode: 0, headers: {},
    setHeader(k, v) { this.headers[k.toLowerCase()] = v },
    end(c) { if (c !== undefined) chunks.push(String(c)) },
    get body() { return chunks.join('') },
  }
  const done = handler(req, res)
  setImmediate(() => { req.emit('data', Buffer.from(JSON.stringify(payload))); req.emit('end') })
  await done
  return { status: res.statusCode, body: chunks.join('') }
}
const readRegistry = root => {
  const file = join(root, '.meta', 'registry.json')
  if (!existsSync(file)) return {}
  return JSON.parse(readFileSync(file, 'utf8')).installed || {}
}

const realWarn = console.warn
console.warn = () => {}   // 缺口回落会打一行 warn；测试里静音（断言靠返回值）

try {
  /* ---- 1) 官方 404（档案缺口）→ 镜像副本装上，来源如实标注 ---- */
  console.log('1. 官方 persona 404 → 按条目回落镜像，来源如实标注 …')
  {
    const root = mkRoot('gap')
    const { handler } = boot(root)
    const out = await install(handler, { kind: 'expert', name: 'gap-expert', source: 'official' })
    assert.equal(out.status, 200, `应安装成功：${out.body}`)
    const body = JSON.parse(out.body)
    assert.equal(body.source, 'mirror', '来源必须如实报 mirror')
    assert.equal(body.mirrorReason, 'official-asset-missing', '要带上缺口原因')
    const record = readRegistry(root)['expert/gap-expert']
    assert.ok(record, '注册表里应有记录')
    assert.equal(record.source, undefined, '镜像内容不得标成官方来源')
    assert.equal(record.official, undefined, '镜像内容不得标 official')
    assert.equal(record.officialMeta, undefined, '镜像内容不得带官方溯源（/updates 报 unknown）')
    assert.equal(record.displayName, '缺口专家', '展示标签仍取官方注册表')
    assert.equal(record.mirrorFallback?.reason, 'official-asset-missing', '记录里要留下缺口原因')
    const read = readExpertPersona(join(root, 'experts'), 'gap-expert')
    assert.equal(read.ok, true, `镜像装好后人设必须可读：${read.error}`)
    assert.ok(String(read.persona || '').includes('人设正文'), '人设正文应来自镜像副本')
    console.log('   OK')
  }

  /* ---- 2) 官方 200 → 照旧官方安装（不碰镜像） ---- */
  console.log('2. 官方 persona 200 → 照旧官方安装 …')
  {
    const root = mkRoot('ok')
    const { handler } = boot(root)
    const before = hits.length
    const out = await install(handler, { kind: 'expert', name: 'ok-expert', source: 'official' })
    assert.equal(out.status, 200, `应 200：${out.body}`)
    const body = JSON.parse(out.body)
    assert.equal(body.source, 'official', '官方内容必须报 official')
    assert.equal(body.mirrorReason, '', '没有缺口就不该有 mirrorReason')
    const record = readRegistry(root)['expert/ok-expert']
    assert.equal(record.official, true, '官方安装要标 official')
    assert.ok(record.officialMeta, '官方安装要记录官方溯源')
    assert.ok(!hits.slice(before).some(u => u.includes('github')), '官方成功时不该请求镜像仓')
    console.log('   OK')
  }

  /* ---- 3) 官方 5xx（服务不可用）→ 维持严格语义，且不留半成品目录 ---- */
  console.log('3. 官方 persona 5xx → 如实失败（不回落），不留半成品 …')
  {
    const root = mkRoot('5xx')
    const { handler } = boot(root)
    personaStatus = { ...personaStatus, gap: 500 }
    const out = await install(handler, { kind: 'expert', name: 'gap-expert', source: 'official' })
    personaStatus = { ...personaStatus, gap: 404 }
    assert.equal(out.status, 502, `应失败：${out.body}`)
    assert.ok(JSON.parse(out.body).error.includes('persona HTTP 500'), '错误信息要含官方失败原因')
    assert.ok(!existsSync(join(root, 'experts', 'gap-expert')), '失败不得留下空目录')
    assert.equal(readRegistry(root)['expert/gap-expert'], undefined, '失败不得写注册表')
    console.log('   OK')
  }

  /* ---- 4) 缺口 + 镜像也没有 → 502，且说清两边都缺 ---- */
  console.log('4. 官方缺口 + 镜像也没有 → 502 且信息可读 …')
  {
    const root = mkRoot('orphan')
    const { handler } = boot(root)
    const out = await install(handler, { kind: 'expert', name: 'orphan-expert', source: 'official' })
    assert.equal(out.status, 502, `应失败：${out.body}`)
    const message = JSON.parse(out.body).error
    assert.ok(message.includes('官方缺') && message.includes('镜像仓也没有'), `错误信息要说清两边：${message}`)
    assert.ok(!existsSync(join(root, 'experts', 'orphan-expert')), '失败不得留下空目录')
    console.log('   OK')
  }

  /* ---- 5) 已有的目录不许被失败的安装删掉（上一份可用副本要保住） ---- */
  console.log('5. 已存在的专家目录在安装失败时必须保留 …')
  {
    const root = mkRoot('keep')
    const { handler } = boot(root)
    const dest = join(root, 'experts', 'gap-expert')
    mkdirSync(join(dest, 'agents'), { recursive: true })
    writeFileSync(join(dest, 'agents', 'gap-expert.md'), '上一份可用人设')
    personaStatus = { ...personaStatus, gap: 500 }
    const out = await install(handler, { kind: 'expert', name: 'gap-expert', source: 'official' })
    personaStatus = { ...personaStatus, gap: 404 }
    assert.equal(out.status, 502, `应失败：${out.body}`)
    assert.equal(readFileSync(join(dest, 'agents', 'gap-expert.md'), 'utf8'), '上一份可用人设', '旧副本不得被删')
    console.log('   OK')
  }

  /* ---- 6) 缺口回落只在专家分支生效：镜像兜底开关仍默认关闭 ---- */
  console.log('6. mirrorFallback 全局开关语义未被改动（默认 false）…')
  {
    const root = mkRoot('flag')
    const { handler } = boot(root)
    const out = await install(handler, { kind: 'expert', name: 'ok-expert', source: undefined })
    assert.equal(out.status, 200, `官方成功时不受开关影响：${out.body}`)
    assert.equal(JSON.parse(out.body).source, 'official')
    console.log('   OK')
  }

  console.log('\nexpert archive-gap (official missing persona → mirror fallback) contract tests: OK')
} finally {
  console.warn = realWarn
  globalThis.fetch = realFetch
}
