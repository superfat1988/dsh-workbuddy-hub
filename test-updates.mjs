// 「检查更新」纯逻辑单测（src/updates.js）。
//
// 为什么必须有这一套：更新判定一旦把「查不到」判成「已是最新」，用户就会以为一切
// 正常 —— 这是静默的错误结论，比报错更糟。所以这里把三条判定规则钉死：
//  ① gitBlobSha 与 `git hash-object --stdin` 同口径（含空内容 / 带换行 / 无换行 / 二进制）；
//  ② compareOfficial 只认「官方 updatedAt 比本地 installedAt 新」为 update，缺/非法时间戳一律 unknown；
//  ③ compareMirror 只有 rel 集合与每个 sha 完全相同才 current，远端多/本地多/内容变都算 update。
// 全部离线，不联网、不碰真实 storeRoot。
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { gitBlobSha, compareOfficial, compareMirror, summarizeUpdates } from './src/updates.js'

/* ---------------- ① gitBlobSha：自检向量 + git hash-object 交叉验证 ---------------- */

const VECTORS = [
  ['', 'e69de29bb2d1d6434b8b29ae775ad8c2e48c5391', '空内容'],
  ['hello\n', 'ce013625030ba8dba906f756967f9e9ca394464a', '带换行'],
  ['hello', 'b6fc4c620b67d95f953a5c1c1230aaab5db5a1b0', '无换行'],
]
for (const [content, expected, why] of VECTORS) {
  assert.equal(gitBlobSha(content), expected, `gitBlobSha 自检向量失败（${why}）：${JSON.stringify(content)}`)
  assert.equal(gitBlobSha(Buffer.from(content, 'utf8')), expected, `Buffer 输入必须与 string 同值（${why}）`)
}
// 非 UTF-8 字节（含 NUL）必须走二进制路径，不能被当成文本处理
const BINARY = Buffer.from([0x00, 0xff, 0x0a, 0x00, 0xc3, 0x28])
assert.equal(gitBlobSha(BINARY), gitBlobSha(Buffer.from([0x00, 0xff, 0x0a, 0x00, 0xc3, 0x28])))
assert.notEqual(gitBlobSha(BINARY), gitBlobSha(BINARY.toString('latin1')), '二进制与文本不得同值')
// null / undefined 视为空内容（与 git 的「无输入」一致），不得抛错
assert.equal(gitBlobSha(null), VECTORS[0][1])
assert.equal(gitBlobSha(undefined), VECTORS[0][1])

// 与 git 本身交叉验证：`printf hello | git hash-object --stdin`
let crossChecked = 0
try {
  for (const [content, expected, why] of VECTORS) {
    const out = execFileSync('git', ['hash-object', '--stdin'], { input: content, encoding: 'utf8' }).trim()
    assert.equal(out, expected, `git hash-object 与已知向量不一致（${why}）`)
    assert.equal(gitBlobSha(content), out, `git hash-object 交叉验证失败（${why}）`)
    crossChecked += 1
  }
  const binOut = execFileSync('git', ['hash-object', '--stdin'], { input: BINARY }).toString('utf8').trim()
  assert.equal(gitBlobSha(BINARY), binOut, 'git hash-object 交叉验证失败（二进制）')
  crossChecked += 1
  console.log(`   git hash-object 交叉验证：${crossChecked} 例一致`)
} catch (error) {
  if (error?.code === 'ENOENT') {
    console.log('   环境无 git：跳过 hash-object 交叉验证（上面的已知向量断言仍然有效）')
  } else {
    throw error
  }
}

/* ---------------- ② compareOfficial：官方 updatedAt vs 本地 installedAt ---------------- */

const T = (iso) => iso
// 远端更新 → update
assert.deepEqual(
  compareOfficial({ installedAt: T('2024-01-01T00:00:00.000Z') }, { updatedAt: T('2024-06-01T00:00:00.000Z') }),
  { status: 'update', remoteAt: '2024-06-01T00:00:00.000Z', localAt: '2024-01-01T00:00:00.000Z', reason: '' },
)
// 远端更旧 → current
assert.equal(
  compareOfficial({ installedAt: T('2024-06-01T00:00:00.000Z') }, { updatedAt: T('2024-01-01T00:00:00.000Z') }).status,
  'current',
)
// 边界：时间戳完全相等 → current（不能因为「非严格更旧」就报更新）
assert.equal(
  compareOfficial({ installedAt: T('2024-06-01T00:00:00.000Z') }, { updatedAt: T('2024-06-01T00:00:00.000Z') }).status,
  'current',
)
// 同一时刻的不同写法（带毫秒 / 不带毫秒）也必须相等 → current
assert.equal(
  compareOfficial({ installedAt: T('2024-06-01T00:00:00.000Z') }, { updatedAt: T('2024-06-01T00:00:00Z') }).status,
  'current',
)
// 缺官方条目 → unknown（不能当最新）
const noEntry = compareOfficial({ installedAt: T('2024-01-01T00:00:00.000Z') }, null)
assert.equal(noEntry.status, 'unknown')
assert.ok(noEntry.reason.length > 0, 'unknown 必须给出原因')
// 官方条目缺 updatedAt → unknown
const noRemote = compareOfficial({ installedAt: T('2024-01-01T00:00:00.000Z') }, { updatedAt: undefined })
assert.equal(noRemote.status, 'unknown')
assert.ok(noRemote.reason.includes('updatedAt'), '原因必须指出缺的是 updatedAt')
// 本地记录缺 installedAt → unknown
const noLocal = compareOfficial({}, { updatedAt: T('2024-01-01T00:00:00.000Z') })
assert.equal(noLocal.status, 'unknown')
assert.ok(noLocal.reason.includes('installedAt'))
// 非法日期 → unknown（不能 NaN 比较后静默判 current）
assert.equal(compareOfficial({ installedAt: T('2024-01-01T00:00:00.000Z') }, { updatedAt: 'not-a-date' }).status, 'unknown')
assert.equal(compareOfficial({ installedAt: 'not-a-date' }, { updatedAt: T('2024-01-01T00:00:00.000Z') }).status, 'unknown')
assert.equal(compareOfficial(null, null).status, 'unknown')

/* ---------------- ③ compareMirror：逐文件 sha 比对 ---------------- */

const remote3 = [
  { rel: 'SKILL.md', sha: 'a'.repeat(40), size: 100 },
  { rel: 'scripts/run.py', sha: 'b'.repeat(40), size: 900 },
  { rel: 'docs/x.md', sha: 'c'.repeat(40), size: 1000 },
]
const localSame = [
  { rel: 'docs/x.md', sha: 'c'.repeat(40), size: 1000 },
  { rel: 'scripts/run.py', sha: 'b'.repeat(40), size: 900 },
  { rel: 'SKILL.md', sha: 'a'.repeat(40), size: 100 },
]
// 顺序无关、sha 全同 → current，remoteBytes = 远端全部字节数
const same = compareMirror({}, remote3, localSame)
assert.equal(same.status, 'current')
assert.deepEqual([same.changed, same.missing, same.extra], [[], [], []])
assert.equal(same.remoteBytes, 2000)

// 内容变化 → update + changed 列表
const changed = compareMirror({}, remote3, localSame.map(f => (f.rel === 'SKILL.md' ? { ...f, sha: 'd'.repeat(40) } : f)))
assert.equal(changed.status, 'update')
assert.deepEqual(changed.changed, ['SKILL.md'])
assert.deepEqual(changed.missing, [])
assert.deepEqual(changed.extra, [])
assert.ok(changed.reason.includes('1'))

// 远端多一个文件（本地缺）→ update + missing
const missing = compareMirror({}, remote3, localSame.filter(f => f.rel !== 'SKILL.md'))
assert.equal(missing.status, 'update')
assert.deepEqual(missing.missing, ['SKILL.md'])
assert.deepEqual(missing.changed, [])

// 本地多一个文件（远端没有）→ 也**不是** current（rel 集合不同），extra 如实列出
const extra = compareMirror({}, remote3, [...localSame, { rel: 'local-note.txt', sha: 'e'.repeat(40), size: 5 }])
assert.equal(extra.status, 'update', '本地多出文件说明两边不一致，不能判 current')
assert.deepEqual(extra.extra, ['local-note.txt'])
assert.deepEqual(extra.changed, [])
assert.deepEqual(extra.missing, [])
assert.equal(extra.remoteBytes, 2000, 'remoteBytes 只算远端清单')

// 远端清单为空（镜像里没有这个条目）→ unknown，绝不是 current
const empty = compareMirror({}, [], localSame)
assert.equal(empty.status, 'unknown')
assert.ok(empty.reason.length > 0)
assert.equal(compareMirror({}, [], []).status, 'unknown', '两边都空同样无法证明「最新」')

// 缺输入 → unknown
assert.equal(compareMirror({}, null, localSame).status, 'unknown')
assert.equal(compareMirror({}, remote3, null).status, 'unknown')

/* ---------------- ④ summarizeUpdates：只认三种状态 ---------------- */

assert.deepEqual(
  summarizeUpdates([{ status: 'update' }, { status: 'current' }, { status: 'unknown' }, { status: 'update' }]),
  { update: 2, current: 1, unknown: 1 },
)
assert.deepEqual(summarizeUpdates([]), { update: 0, current: 0, unknown: 0 })
assert.deepEqual(summarizeUpdates(null), { update: 0, current: 0, unknown: 0 }, '非数组不得抛错')
assert.deepEqual(summarizeUpdates([{ status: 'weird' }, {}, null]), { update: 0, current: 0, unknown: 0 },
  '未知状态不得被塞进任何桶')

console.log('updates: git blob sha + compareOfficial / compareMirror / summarizeUpdates: OK')
