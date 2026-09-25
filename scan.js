/**
 * dsh-workbuddy-hub — safety scan module（宿主与脚本共用的唯一扫描实现）。
 *
 * 从 index.js 原样搬出（逻辑一字不改）：SCAN_EXT / SCAN_RULES / scanMcpDefinitionFlags / scanFlags。
 * 搬出动机：scripts/hub-find.mjs 的 inspect 子命令要在**不落盘**的前提下对官方内容做
 * 同一套安全扫描 —— 扫描规则必须只有一份，否则「预检看到的」与「安装时记下的」会分叉。
 *
 * ⚠️ 这是「可见性」（标记），不是准入判定 —— 准入由 mcp-manager 的
 * validateConnectorMcp 负责。
 */

// .json 也在扫描范围内：连接器的 mcp.json 恰恰是声明 command/url/headers 的地方，
// 此前被排除意味着「声明命令执行」「外连非官方域名」这类最高价值的信号永远扫不到。
export const SCAN_EXT = new Set(['.py', '.js', '.mjs', '.cjs', '.sh', '.ps1', '.cmd', '.bat', '.json'])

/** 通用规则：任何被扫描的文本都适用。 */
const SCAN_RULES = [
  [/curl\s+[^|]*\|\s*(ba)?sh/i, 'piped-to-shell'],
  [/\beval\s*\(/, 'eval'],
  [/new\s+Function\s*\(/, 'dynamic-function'],
  [/child_process|subprocess/i, 'spawns-process'],
  [/credentials?|api[_-]?key|secret|token/i, 'mentions-credentials'],
  [/https?:\/\/(?!raw\.githubusercontent\.com|github\.com)/i, 'external-url'],
]

/**
 * mcp.json / cli.json 这类「定义文件」的结构化扫描：对 command / url / headers
 * 的值逐个判断并给出明确旗标，而不是只做全文正则。注意这是**可见性**（标记），
 * 不是准入判定 —— 准入由 mcp-manager 的 validateConnectorMcp 负责。
 */
export function scanMcpDefinitionFlags(raw) {
  const flags = []
  const servers = raw?.mcpServers
  if (servers && typeof servers === 'object' && !Array.isArray(servers)) {
    for (const [name, server] of Object.entries(servers)) {
      const label = `mcpServers.${name}`
      if (server && typeof server === 'object' && !Array.isArray(server)) {
        // 声明了 stdio = 声明了本机命令执行（即便最终未被挂载，也要标记可见）
        if (server.transport === 'stdio' || server.type === 'stdio' || server.command !== undefined) {
          flags.push(`${label}: declares-command-execution`)
        }
        for (const [key, value] of Object.entries(server)) {
          if (typeof value !== 'string') continue
          if (/^https?:\/\//i.test(value) && !/^(https?:\/\/)(raw\.githubusercontent\.com|github\.com)\//.test(value)) {
            flags.push(`${label}.${key}: external-url (${value.replace(/^https?:\/\//, '').slice(0, 60)})`)
          }
          if (/authorization|cookie|api[-_]?key|token|secret/i.test(key)) {
            flags.push(`${label}.${key}: sensitive-header`)
          }
          // URL 查询串里的凭据型参数（官方连接器就有 ?key=${TENCENT_MAP_KEY} 这种形态）
          if (/^https?:\/\//i.test(value)) {
            try {
              const parsed = new URL(value.replace(/\$\{[^}]+\}/g, 'x'))
              for (const q of parsed.searchParams.keys()) {
                if (/^(api[-_]?key|key|token|secret|access[-_]?token|password|sig(nature)?)$/i.test(q)) {
                  flags.push(`${label}.${key}: sensitive-query-param (${q})`)
                }
              }
            } catch { /* 非法 URL：解析不了就不猜 */ }
          }
        }
      }
    }
  }
  return flags
}

export function scanFlags(fileName, text) {
  const flags = []
  const dot = fileName.lastIndexOf('.')
  if (dot < 0) return flags
  const ext = fileName.slice(dot).toLowerCase()
  if (!SCAN_EXT.has(ext)) return flags
  const src = String(text)
  for (const [re, tag] of SCAN_RULES) if (re.test(src)) flags.push(tag)
  // 定义类文件额外做结构化扫描（值级判定；解析失败就退回纯文本规则的结果）
  if (ext === '.json') {
    try { flags.push(...scanMcpDefinitionFlags(JSON.parse(src))) } catch { /* not a definition file */ }
  }
  return flags
}
