/**
 * 「检查更新」纯逻辑 —— 宿主（index.js 的 GET /updates）与单测共用。
 *
 * 这里刻意**不依赖 DSH、不做任何 IO**（不读盘、不联网、不写注册表）：判定规则
 * 必须能被离线单测钉死，尤其是「查不到时不能判成已是最新」这条语义纪律 ——
 * 静默的假「已是最新」比报错更糟，用户会以为一切正常。
 *
 * 判定依据（数据事实）：
 *  · 官方专家有 updatedAt（expert_center.json 原始条目）→ 与本地 installedAt 比时间戳；
 *  · 技能/连接器没有版本字段 → 只能内容比对：镜像 tree API 的 blob sha 就是
 *    git blob sha1（"blob <len>\0<content>" 的 sha1），本地同法算一遍即可精确比对。
 */
import { createHash } from 'node:crypto'

/** git blob sha1：`blob <字节长度>\0<内容>` 的 SHA-1 十六进制。
 *  与 `git hash-object --stdin` 完全一致（test-updates.mjs 会交叉验证）。
 *  @param {Buffer|string} content 二进制请直接传 Buffer（文本按 UTF-8 编码）
 */
export function gitBlobSha(content) {
  const buf = Buffer.isBuffer(content)
    ? content
    : Buffer.from(content == null ? '' : String(content), 'utf8')
  const header = Buffer.from(`blob ${buf.length}\u0000`, 'utf8')
  return createHash('sha1').update(header).update(buf).digest('hex')
}

/**
 * 官方专家：官方 updatedAt vs 本地 installedAt。
 * 缺任一时间戳（或日期非法）→ unknown，绝不退化成 current。
 * @param {{installedAt?: string}} record 注册表记录
 * @param {{updatedAt?: string}|null|undefined} officialEntry 官方注册表**原始**条目
 *   （注意：wb-experts.normalise() 会把 updatedAt 丢掉，所以必须用 registry() 的原始条目）
 * @returns {{status:'current'|'update'|'unknown', remoteAt:string, localAt:string, reason:string}}
 */
export function compareOfficial(record, officialEntry) {
  const localAt = typeof record?.installedAt === 'string' ? record.installedAt : ''
  if (!officialEntry) return { status: 'unknown', remoteAt: '', localAt, reason: '官方注册表未收录该条目' }
  const remoteAt = typeof officialEntry.updatedAt === 'string' ? officialEntry.updatedAt : ''
  if (!localAt) return { status: 'unknown', remoteAt, localAt, reason: '本地记录缺少 installedAt' }
  if (!remoteAt) return { status: 'unknown', remoteAt, localAt, reason: '官方条目缺少 updatedAt' }
  const remote = Date.parse(remoteAt)
  const local = Date.parse(localAt)
  if (Number.isNaN(remote)) return { status: 'unknown', remoteAt, localAt, reason: `官方 updatedAt 非法：${remoteAt}` }
  if (Number.isNaN(local)) return { status: 'unknown', remoteAt, localAt, reason: `本地 installedAt 非法：${localAt}` }
  // 相等 = 已是最新（官方时间戳不会比安装时刻更晚才是更新）
  return { status: remote > local ? 'update' : 'current', remoteAt, localAt, reason: '' }
}

/**
 * 镜像条目：远端 blob 清单 vs 本地文件清单（rel 都是相对条目目录）。
 * **只有 rel 集合与每个 rel 的 sha 完全相同才判 current**；远端多一个（missing）、
 * 本地多一个（extra）、内容变了（changed）都算有差异 → update。
 * 远端清单为空 → unknown（镜像里根本没有这个条目，无法判断，绝不能当最新）。
 * @param {object} record 注册表记录（签名保留，便于将来加入更多依据）
 * @param {Array<{rel:string,sha:string,size?:number}>} remoteBlobs
 * @param {Array<{rel:string,sha:string,size?:number}>} localFiles
 * @returns {{status:'current'|'update'|'unknown', changed:string[], missing:string[],
 *   extra:string[], remoteBytes:number, reason:string}}
 */
export function compareMirror(record, remoteBlobs, localFiles) {
  const remote = Array.isArray(remoteBlobs) ? remoteBlobs : null
  const local = Array.isArray(localFiles) ? localFiles : null
  const remoteBytes = remote ? remote.reduce((sum, blob) => sum + (Number(blob?.size) || 0), 0) : 0
  if (!remote || !local) {
    return { status: 'unknown', changed: [], missing: [], extra: [], remoteBytes, reason: '缺少远端或本地文件清单' }
  }
  const remoteMap = new Map(remote.map(blob => [String(blob?.rel ?? ''), String(blob?.sha ?? '')]))
  const localMap = new Map(local.map(blob => [String(blob?.rel ?? ''), String(blob?.sha ?? '')]))
  const changed = []
  const missing = []
  const extra = []
  for (const [rel, sha] of remoteMap) {
    if (!localMap.has(rel)) missing.push(rel)
    else if (localMap.get(rel) !== sha) changed.push(rel)
  }
  for (const rel of localMap.keys()) if (!remoteMap.has(rel)) extra.push(rel)
  changed.sort(); missing.sort(); extra.sort()
  if (remote.length === 0) {
    return { status: 'unknown', changed, missing, extra, remoteBytes, reason: '镜像里找不到该条目的文件' }
  }
  if (changed.length === 0 && missing.length === 0 && extra.length === 0) {
    return { status: 'current', changed, missing, extra, remoteBytes, reason: '' }
  }
  const parts = []
  if (changed.length > 0) parts.push(`${changed.length} 个文件内容已变化`)
  if (missing.length > 0) parts.push(`${missing.length} 个文件本地缺失`)
  if (extra.length > 0) parts.push(`本地多出 ${extra.length} 个文件`)
  return { status: 'update', changed, missing, extra, remoteBytes, reason: parts.join('、') }
}

/** 汇总计数：只认 current / update / unknown 三种状态（其它值忽略，不臆造桶）。 */
export function summarizeUpdates(entries) {
  const counts = { update: 0, current: 0, unknown: 0 }
  for (const entry of Array.isArray(entries) ? entries : []) {
    const status = entry?.status
    if (status === 'update' || status === 'current' || status === 'unknown') counts[status] += 1
  }
  return counts
}
