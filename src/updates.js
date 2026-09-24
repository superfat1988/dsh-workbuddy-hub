/**
 * 「检查更新」纯逻辑 —— 宿主（index.js 的 GET /updates）与安装链路共用。
 *
 * 这里刻意**不依赖 DSH、不做任何 IO**（不读盘、不联网、不写注册表）：判定规则
 * 必须能被离线单测钉死，尤其是「查不到时不能判成已是最新」这条语义纪律 ——
 * 静默的假「已是最新」比报错更糟，用户会以为一切正常。
 *
 * 判定依据（**只认官方元数据**，不再碰 GitHub 镜像、不再算任何文件 sha）：
 *  · 技能：官方 skill 记录的 `version` vs 安装时记下的 `officialMeta.version`；
 *  · 专家：官方注册表原始条目的 `updatedAt` vs 安装时记下的 `officialMeta.updatedAt`
 *    （老记录没有该字段时退回 `installedAt`）；
 *  · 连接器：官方注册表该行 `mcp` 定义的规范化 JSON sha256 vs
 *    安装时记下的 `officialMeta.defHash`。
 *
 * 安装链路用下面的 provenance 构造器把「装的是什么」如实记进注册表；老记录没有
 * `officialMeta` 时一律 unknown（**不伪造**），提示用户重装一次即可记录。
 */
import { createHash } from 'node:crypto'

/* ------------------------------------------------------------------ *
 * 官方连接器 MCP 定义的规范化哈希
 * ------------------------------------------------------------------ */

/** 参与哈希的字段（只取有语义的：地址、传输、鉴权、服务名）。顺序即规范顺序。 */
export const MCP_DEF_FIELDS = [
  'auth_mode',
  'gateway_url',
  'ide_server_name',
  'sandbox_url',
  'transport',
  'upstream_url',
]

/** 稳定的 JSON 序列化：对象键按字典序，数组保序，其它按 JSON 原样。 */
function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null'
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
  const keys = Object.keys(value).sort()
  return `{${keys.map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`
}

/** 标量 → 文本；null/undefined → ''（字段缺失与空串同值，避免「补了字段」就报更新）。 */
function scalarText(value) {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return stableStringify(value)
}

/**
 * 规范化 JSON：只取 {@link MCP_DEF_FIELDS}，每个字段都出现（缺失为 ''），键序固定。
 * 非对象输入 → ''（调用方按「无法比对」处理，绝不猜）。
 */
export function canonicalMcpDef(mcp) {
  if (mcp === null || typeof mcp !== 'object' || Array.isArray(mcp)) return ''
  const out = {}
  for (const key of MCP_DEF_FIELDS) out[key] = scalarText(mcp[key])
  return JSON.stringify(out)
}

/** 官方 MCP 定义的 sha256（hex）。非对象 → ''。 */
export function connectorDefHash(mcp) {
  const canonical = canonicalMcpDef(mcp)
  if (!canonical) return ''
  return createHash('sha256').update(canonical, 'utf8').digest('hex')
}

/* ------------------------------------------------------------------ *
 * 安装时记录的官方溯源（registry.installed[key].officialMeta）
 * ------------------------------------------------------------------ */

/** 技能：官方记录的 version / updated_at（缺 → null，不伪造）。 */
export function skillProvenance(rec) {
  if (!rec || typeof rec !== 'object') return null
  const version = scalarText(rec.version) || null
  const updatedAt = scalarText(rec.updated_at ?? rec.updatedAt) || null
  return { version, updatedAt }
}

/** 专家：官方原始条目的 updatedAt（专家没有 version 字段）。 */
export function expertProvenance(raw) {
  if (!raw || typeof raw !== 'object') return null
  return { updatedAt: scalarText(raw.updatedAt) || null }
}

/** 连接器：官方该行 mcp 定义的规范化 sha256（没有 mcp 定义 → null）。 */
export function connectorProvenance(row) {
  const defHash = connectorDefHash(row?.mcp)
  return defHash ? { defHash } : null
}

/* ------------------------------------------------------------------ *
 * 三类比对
 * ------------------------------------------------------------------ */

function str(value) {
  return typeof value === 'string' ? value : (value === null || value === undefined ? '' : String(value))
}

/**
 * 官方专家：官方 updatedAt vs 安装时记录的官方 updatedAt（老记录退回 installedAt）。
 * 缺任一时间戳（或日期非法）→ unknown，绝不退化成 current。
 * @param {{installedAt?: string, officialMeta?: {updatedAt?: string}}} record 注册表记录
 * @param {{updatedAt?: string}|null|undefined} officialEntry 官方注册表**原始**条目
 *   （注意：wb-experts.normalise() 会把 updatedAt 丢掉，所以必须用 registry() 的原始条目）
 * @returns {{status:'current'|'update'|'unknown', remoteAt:string, localAt:string, reason:string}}
 */
export function compareOfficial(record, officialEntry) {
  const localAt = str(record?.officialMeta?.updatedAt) || str(record?.installedAt)
  if (!officialEntry) {
    return { status: 'unknown', remoteAt: '', localAt, reason: '官方注册表未收录该专家（可能已下架）' }
  }
  const remoteAt = str(officialEntry.updatedAt)
  if (!localAt) {
    return { status: 'unknown', remoteAt, localAt, reason: '本地记录缺少官方安装时间戳（officialMeta.updatedAt / installedAt）' }
  }
  if (!remoteAt) return { status: 'unknown', remoteAt, localAt, reason: '官方条目缺少 updatedAt' }
  const remote = Date.parse(remoteAt)
  const local = Date.parse(localAt)
  if (Number.isNaN(remote)) return { status: 'unknown', remoteAt, localAt, reason: `官方 updatedAt 非法：${remoteAt}` }
  if (Number.isNaN(local)) return { status: 'unknown', remoteAt, localAt, reason: `本地时间戳非法：${localAt}` }
  // 相等 = 已是最新（官方时间戳不会比安装时刻更晚才是更新）
  return { status: remote > local ? 'update' : 'current', remoteAt, localAt, reason: '' }
}

/**
 * 官方技能：官方记录的 version vs 安装时记录的 officialMeta.version。
 * 找不到官方记录 / 本地缺 version / 官方缺 version → unknown。
 * @param {{officialMeta?: {version?: string}}} record 注册表记录
 * @param {{version?: string}|null|undefined} officialSkill 官方 skill 记录（按 skill_id 匹配）
 * @returns {{status:'current'|'update'|'unknown', remoteVersion:string, localVersion:string, reason:string}}
 */
export function compareSkillVersion(record, officialSkill) {
  const localVersion = str(record?.officialMeta?.version)
  if (!officialSkill) {
    return { status: 'unknown', remoteVersion: '', localVersion, reason: '官方市场已下架该技能（按 skill_id 查不到）' }
  }
  const remoteVersion = str(officialSkill.version)
  if (!localVersion) {
    return {
      status: 'unknown', remoteVersion, localVersion,
      reason: '缺少安装时记录的官方版本（officialMeta.version），重装一次即可记录',
    }
  }
  if (!remoteVersion) {
    return { status: 'unknown', remoteVersion, localVersion, reason: '官方技能记录缺少 version，无法比对' }
  }
  if (remoteVersion !== localVersion) {
    return {
      status: 'update', remoteVersion, localVersion,
      reason: `官方版本 ${remoteVersion} 与本地记录的 ${localVersion} 不同`,
    }
  }
  return { status: 'current', remoteVersion, localVersion, reason: '' }
}

/**
 * 官方连接器：官方该行 mcp 定义的规范化 sha256 vs 安装时记录的 officialMeta.defHash。
 * 找不到官方行 / 本地缺 defHash / 官方缺 mcp 定义 → unknown。
 * @param {{officialMeta?: {defHash?: string}}} record 注册表记录
 * @param {{mcp?: object}|null|undefined} officialRow 官方注册表行
 * @returns {{status:'current'|'update'|'unknown', remoteHash:string, localHash:string, reason:string}}
 */
export function compareConnectorDef(record, officialRow) {
  const localHash = str(record?.officialMeta?.defHash)
  if (!officialRow) {
    return { status: 'unknown', remoteHash: '', localHash, reason: '官方连接器注册表未收录该连接器（可能已下架）' }
  }
  if (!localHash) {
    return {
      status: 'unknown', remoteHash: '', localHash,
      reason: '缺少安装时记录的官方 MCP 定义哈希（officialMeta.defHash），重装一次即可记录',
    }
  }
  if (!officialRow.mcp) {
    return { status: 'unknown', remoteHash: '', localHash, reason: '官方连接器条目缺少 MCP 定义，无法比对' }
  }
  const remoteHash = connectorDefHash(officialRow.mcp)
  if (!remoteHash) {
    return { status: 'unknown', remoteHash: '', localHash, reason: '官方 MCP 定义无法规范化，无法比对' }
  }
  if (remoteHash !== localHash) {
    return { status: 'update', remoteHash, localHash, reason: '官方 MCP 定义已变化' }
  }
  return { status: 'current', remoteHash, localHash, reason: '' }
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
