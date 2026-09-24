// 「检查更新」纯逻辑单测（src/updates.js）。
//
// 为什么必须有这一套：更新判定一旦把「查不到」判成「已是最新」，用户就会以为一切
// 正常 —— 这是静默的错误结论，比报错更糟。所以这里把新的判定规则钉死：
//  ① 官方 MCP 定义规范化：只取 6 个有语义字段、键序固定、字段缺失 == 空串；
//  ② connectorDefHash 对同一份定义稳定、对任一字段变化敏感（含嵌套对象键序）；
//  ③ compareOfficial（专家）：官方 updatedAt vs officialMeta.updatedAt（老记录退回 installedAt），
//     缺/非法时间戳一律 unknown；
//  ④ compareSkillVersion（技能）：官方 version 与安装时记录的 version 比，缺任一侧 → unknown；
//  ⑤ compareConnectorDef（连接器）：官方 MCP 定义哈希与安装时记录比，缺任一 → unknown；
//  ⑥ 安装时溯源构造器：官方字段缺失时如实记 null，不伪造。
// 全部离线，不联网、不碰真实 storeRoot、不读任何文件。
import assert from 'node:assert/strict'
import {
  MCP_DEF_FIELDS, canonicalMcpDef, connectorDefHash,
  skillProvenance, expertProvenance, connectorProvenance,
  compareOfficial, compareSkillVersion, compareConnectorDef, summarizeUpdates,
} from './src/updates.js'

/* ---------------- ① 规范化 JSON：只取有语义字段、键序固定 ---------------- */

const DEF = {
  gateway_url: 'https://gw.example/mcp',
  transport: 'streamable-http',
  auth_mode: 'oauth',
  ide_server_name: 'demo',
  upstream_url: '',
  sandbox_url: '',
}
// 已知向量（sha256），保证规范化算法不会被无声改掉
const DEF_CANONICAL = '{"auth_mode":"oauth","gateway_url":"https://gw.example/mcp","ide_server_name":"demo","sandbox_url":"","transport":"streamable-http","upstream_url":""}'
const DEF_HASH = '7a85b6723ad27862c6343e926bf3e92e253d7ed5484cf78d2f55cf61a7ecac79'
assert.deepEqual(MCP_DEF_FIELDS, ['auth_mode', 'gateway_url', 'ide_server_name', 'sandbox_url', 'transport', 'upstream_url'],
  '参与哈希的字段集合与顺序必须是固定的 6 个')
assert.equal(canonicalMcpDef(DEF), DEF_CANONICAL)
assert.equal(connectorDefHash(DEF), DEF_HASH)

// 键序无关（同一定义换个书写顺序，规范化结果必须相同）
const shuffled = { sandbox_url: '', auth_mode: 'oauth', upstream_url: '', transport: 'streamable-http', ide_server_name: 'demo', gateway_url: 'https://gw.example/mcp' }
assert.equal(canonicalMcpDef(shuffled), DEF_CANONICAL, '键序不得影响规范化结果')
assert.equal(connectorDefHash(shuffled), DEF_HASH)

// 无关字段不参与（官方以后加字段不应报「有更新」）
assert.equal(connectorDefHash({ ...DEF, some_new_field: 'x', displayName: '演示' }), DEF_HASH,
  '不参与哈希的字段变化不得改变 defHash')

// 每个有语义字段都敏感（改任何一个都必须换哈希）
for (const field of MCP_DEF_FIELDS) {
  const changed = { ...DEF, [field]: `${DEF[field] || ''}-changed` }
  assert.notEqual(connectorDefHash(changed), DEF_HASH, `${field} 变化必须改变 defHash`)
}

// 缺失字段 == 空串（不是「没有这个键」），所以「补了一个空字段」不报更新
assert.equal(canonicalMcpDef({}), '{"auth_mode":"","gateway_url":"","ide_server_name":"","sandbox_url":"","transport":"","upstream_url":""}')
assert.equal(connectorDefHash({}), '13810f6fc9d6ec7a402e60154b0a518f29beead223c52a79f24af320a573cd74')
assert.equal(connectorDefHash({ gateway_url: undefined, transport: null }), connectorDefHash({}),
  'undefined/null 与缺失同值')

// 非对象 / 数组 → 无法规范化（'' + 空哈希），调用方据此报 unknown，绝不猜
assert.equal(canonicalMcpDef(null), '')
assert.equal(canonicalMcpDef('https://gw.example/mcp'), '')
assert.equal(canonicalMcpDef([DEF]), '')
assert.equal(connectorDefHash(undefined), '')
assert.equal(connectorDefHash(null), '')
assert.equal(connectorDefHash('x'), '')

// 嵌套对象也走稳定序列化（键序无关）
assert.equal(connectorDefHash({ ...DEF, auth_mode: { b: 1, a: 2 } }), connectorDefHash({ ...DEF, auth_mode: { a: 2, b: 1 } }))

/* ---------------- ② 安装时溯源构造器 ---------------- */

assert.deepEqual(skillProvenance({ version: '1.0.0', updated_at: '2026-09-03T08:47:48Z' }),
  { version: '1.0.0', updatedAt: '2026-09-03T08:47:48Z' })
assert.deepEqual(skillProvenance({ version: '1.0.0', updatedAt: '2026-09-03T08:47:48Z' }),
  { version: '1.0.0', updatedAt: '2026-09-03T08:47:48Z' }, 'updatedAt 驼峰写法同样接受')
assert.deepEqual(skillProvenance({}), { version: null, updatedAt: null }, '官方缺字段 → 如实记 null，不伪造')
assert.deepEqual(skillProvenance(null), null)

assert.deepEqual(expertProvenance({ updatedAt: '2024-06-01T00:00:00.000Z' }), { updatedAt: '2024-06-01T00:00:00.000Z' })
assert.deepEqual(expertProvenance({ updatedAt: 123 }), { updatedAt: '123' })
assert.deepEqual(expertProvenance({}), { updatedAt: null })
assert.deepEqual(expertProvenance(null), null)

assert.deepEqual(connectorProvenance({ mcp: DEF }), { defHash: DEF_HASH })
assert.equal(connectorProvenance({ mcp: null }), null, '没有 MCP 定义 → null（不伪造哈希）')
assert.equal(connectorProvenance(null), null)

/* ---------------- ③ compareOfficial：专家 ---------------- */

const T = iso => iso
// 官方更新 → update
assert.deepEqual(
  compareOfficial({ officialMeta: { updatedAt: T('2024-01-01T00:00:00.000Z') } }, { updatedAt: T('2024-06-01T00:00:00.000Z') }),
  { status: 'update', remoteAt: '2024-06-01T00:00:00.000Z', localAt: '2024-01-01T00:00:00.000Z', reason: '' },
)
// 老记录没有 officialMeta → 退回 installedAt
assert.equal(
  compareOfficial({ installedAt: T('2024-01-01T00:00:00.000Z') }, { updatedAt: T('2024-06-01T00:00:00.000Z') }).status,
  'update', '老记录（无 officialMeta）退回 installedAt 仍能比对',
)
// 远端更旧 / 完全相等 → current
assert.equal(compareOfficial({ officialMeta: { updatedAt: T('2024-06-01T00:00:00.000Z') } }, { updatedAt: T('2024-01-01T00:00:00.000Z') }).status, 'current')
assert.equal(compareOfficial({ officialMeta: { updatedAt: T('2024-06-01T00:00:00.000Z') } }, { updatedAt: T('2024-06-01T00:00:00.000Z') }).status, 'current')
// 同一时刻的不同写法（带毫秒 / 不带毫秒）也必须相等 → current
assert.equal(compareOfficial({ officialMeta: { updatedAt: T('2024-06-01T00:00:00.000Z') } }, { updatedAt: T('2024-06-01T00:00:00Z') }).status, 'current')
// officialMeta.updatedAt 为空 → 退回 installedAt
assert.equal(compareOfficial({ officialMeta: { updatedAt: null }, installedAt: T('2024-06-01T00:00:00.000Z') }, { updatedAt: T('2024-06-01T00:00:00.000Z') }).status, 'current')
// 官方条目找不到 / 缺 updatedAt / 本地缺时间戳 / 非法日期 → 全部 unknown
const noEntry = compareOfficial({ officialMeta: { updatedAt: T('2024-01-01T00:00:00.000Z') } }, null)
assert.equal(noEntry.status, 'unknown')
assert.ok(noEntry.reason.includes('未收录'), '原因要说明官方注册表未收录（可能已下架）')
const noRemote = compareOfficial({ officialMeta: { updatedAt: T('2024-01-01T00:00:00.000Z') } }, { updatedAt: undefined })
assert.equal(noRemote.status, 'unknown')
assert.ok(noRemote.reason.includes('updatedAt'), '原因必须指出缺的是 updatedAt')
const noLocal = compareOfficial({}, { updatedAt: T('2024-01-01T00:00:00.000Z') })
assert.equal(noLocal.status, 'unknown')
assert.ok(noLocal.reason.includes('installedAt'), '原因要指出本地缺时间戳（officialMeta.updatedAt / installedAt）')
assert.equal(compareOfficial({ officialMeta: { updatedAt: T('2024-01-01T00:00:00.000Z') } }, { updatedAt: 'not-a-date' }).status, 'unknown')
assert.equal(compareOfficial({ officialMeta: { updatedAt: 'not-a-date' } }, { updatedAt: T('2024-01-01T00:00:00.000Z') }).status, 'unknown')
assert.equal(compareOfficial(null, null).status, 'unknown')

/* ---------------- ④ compareSkillVersion：技能 ---------------- */

assert.deepEqual(compareSkillVersion({ officialMeta: { version: '1.0.0' } }, { version: '1.0.0' }),
  { status: 'current', remoteVersion: '1.0.0', localVersion: '1.0.0', reason: '' })
assert.deepEqual(compareSkillVersion({ officialMeta: { version: '1.0.0' } }, { version: '1.0.1' }),
  { status: 'update', remoteVersion: '1.0.1', localVersion: '1.0.0', reason: '官方版本 1.0.1 与本地记录的 1.0.0 不同' })
// 官方记录按 skill_id 查不到 → unknown（已下架）
const gone = compareSkillVersion({ officialMeta: { version: '1.0.0' }, officialId: 's1' }, null)
assert.equal(gone.status, 'unknown')
assert.ok(gone.reason.includes('下架'), '原因要说明官方市场已下架该技能')
// 老记录缺 officialMeta.version → unknown，且提示重装
const noLocalVersion = compareSkillVersion({ officialId: 's1' }, { version: '1.0.0' })
assert.equal(noLocalVersion.status, 'unknown')
assert.ok(noLocalVersion.reason.includes('officialMeta.version') && noLocalVersion.reason.includes('重装'),
  '原因要指出缺 officialMeta.version 并给出「重装一次即可记录」')
assert.equal(compareSkillVersion({ officialMeta: { version: '1.0.0' } }, { version: '' }).status, 'unknown')
assert.equal(compareSkillVersion(null, null).status, 'unknown')
// 数字版本也按字符串比（官方偶尔给数字）
assert.equal(compareSkillVersion({ officialMeta: { version: 2 } }, { version: '2' }).status, 'current')

/* ---------------- ⑤ compareConnectorDef：连接器 ---------------- */

assert.deepEqual(compareConnectorDef({ officialMeta: { defHash: DEF_HASH } }, { mcp: DEF }),
  { status: 'current', remoteHash: DEF_HASH, localHash: DEF_HASH, reason: '' })
const moved = compareConnectorDef({ officialMeta: { defHash: DEF_HASH } }, { mcp: { ...DEF, gateway_url: 'https://gw2.example/mcp' } })
assert.equal(moved.status, 'update')
assert.ok(moved.reason.includes('MCP 定义'), '原因要说明官方 MCP 定义已变化')
assert.notEqual(moved.remoteHash, moved.localHash)
// 官方行找不到 / 本地缺 defHash / 官方缺 mcp → unknown
assert.equal(compareConnectorDef({ officialMeta: { defHash: DEF_HASH } }, null).status, 'unknown')
const noHash = compareConnectorDef({}, { mcp: DEF })
assert.equal(noHash.status, 'unknown')
assert.ok(noHash.reason.includes('officialMeta.defHash') && noHash.reason.includes('重装'),
  '原因要指出缺 defHash 并提示重装')
assert.equal(compareConnectorDef({ officialMeta: { defHash: DEF_HASH } }, { mcp: null }).status, 'unknown')
assert.equal(compareConnectorDef(null, { mcp: DEF }).status, 'unknown')
// 每一个 unknown 都必须带非空原因（否则界面只能显示「无法检查」而说不出为什么）
for (const cmp of [compareConnectorDef({}, { mcp: DEF }), compareSkillVersion({}, { version: '1' }), compareOfficial({}, {})]) {
  assert.equal(cmp.status, 'unknown')
  assert.ok(cmp.reason.length > 0, 'unknown 必须给出原因')
}

/* ---------------- ⑥ summarizeUpdates：只认三种状态 ---------------- */

assert.deepEqual(
  summarizeUpdates([{ status: 'update' }, { status: 'current' }, { status: 'unknown' }, { status: 'update' }]),
  { update: 2, current: 1, unknown: 1 },
)
assert.deepEqual(summarizeUpdates([]), { update: 0, current: 0, unknown: 0 })
assert.deepEqual(summarizeUpdates(null), { update: 0, current: 0, unknown: 0 }, '非数组不得抛错')
assert.deepEqual(summarizeUpdates([{ status: 'weird' }, {}, null]), { update: 0, current: 0, unknown: 0 },
  '未知状态不得被塞进任何桶')

console.log('updates: canonical MCP def hash + compareOfficial / compareSkillVersion / compareConnectorDef / summarizeUpdates: OK')
