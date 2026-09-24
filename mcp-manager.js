/**
 * dsh-workbuddy-hub — MCP connector manager.
 *
 * A downloaded connector ships a WorkBuddy `mcp.json` (`{ mcpServers: {...} }`).
 * That file is UNTRUSTED DATA, never Cordis config: it is parsed through a
 * narrow validator, and only a fully admitted server is mounted.
 *
 * Visibility (source-backed): a connector must be mounted directly on the
 * unscoped Hub Host context — `ctx.loader.create({ name, config })` — so its
 * tools register globally and every Agent's next preStep sees them. Mounting
 * inside an arbitrary `createScope` key would make the tools invisible to
 * normal agents. Per-session mounting would need the real `agent.ctx`.
 *
 * The loader root is in-memory (write() is a no-op), so mounting a row can
 * never leak into the profile's cordis.patch.yml.
 *
 * Lifecycle: the manager owns a fiber id per connector. Enable awaits the
 * fiber so a failed connection rolls back transactionally; disable removes the
 * row and awaits its disposal, which clears reconnect, closes the transport,
 * and unregisters the model-visible tools. Secrets are resolved transiently at
 * activation time (mcp-client captures headers/env into its transport), so a
 * credential change requires a disable → re-resolve → enable cycle.
 */

const MCP_CLIENT_PACKAGE = '@deepseek-ai/dsh-mcp-client'
/** 供宿主（本地 MCP 路由）复用同一常量，避免第二处字面量。 */
export { MCP_CLIENT_PACKAGE }
const SERVER_NAME_MAX = 32
const NAME_PATTERN = /^[A-Za-z0-9_-]{1,32}$/

/** Transports this manager admits; WorkBuddy writes `sse`/`streamableHttp`. */
export function normalizeTransport(raw) {
  const value = String(raw ?? '').toLowerCase().replace(/[-_\s]/g, '')
  if (value === 'streamablehttp' || value === 'http' || value === 'sse') return 'streamable-http'
  if (value === 'stdio') return 'stdio'
  return ''
}

/** Stable, collision-resistant namespace: workbuddy_<slug>_<hash8>. */
export function serverNameFor(connectorName, hashHex) {
  const slug = String(connectorName).toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12) || 'conn'
  const name = `workbuddy_${slug}_${String(hashHex).slice(0, 8)}`
  return name.slice(0, SERVER_NAME_MAX)
}

/** `${VAR}` placeholders are credential references, never inline secrets. */
export function credentialRefsIn(value) {
  const refs = new Set()
  const walk = node => {
    if (typeof node === 'string') {
      for (const m of node.matchAll(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g)) refs.add(m[1])
      return
    }
    if (Array.isArray(node)) { node.forEach(walk); return }
    if (node && typeof node === 'object') Object.values(node).forEach(walk)
  }
  walk(value)
  return [...refs]
}

function substitute(value, resolved) {
  return String(value).replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g, (_, key) => {
    const hit = resolved[key]
    return hit === undefined ? '' : hit
  })
}

const HTTP_KEYS = new Set(['transport', 'type', 'serverName', 'url', 'headers', 'timeout', 'toolCallTimeoutMs', 'disabled'])
const STDIO_KEYS = new Set(['transport', 'type', 'serverName', 'command', 'args', 'env', 'cwd', 'timeout', 'toolCallTimeoutMs', 'disabled'])

/**
 * Admit exactly one server from a connector's mcp.json.
 * @returns {{ok:true, server:object, refs:string[], summary:object}|{ok:false, error:string}}
 */
export function validateConnectorMcp(raw, connectorName) {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, error: 'mcp.json is not an object' }
  }
  const servers = raw.mcpServers
  if (servers === null || typeof servers !== 'object' || Array.isArray(servers)) {
    return { ok: false, error: 'mcp.json has no mcpServers object' }
  }
  const names = Object.keys(servers)
  if (names.length === 0) return { ok: false, error: 'mcpServers is empty' }
  // Prefer the entry named after the connector; otherwise accept a sole entry.
  const picked = names.find(n => n === connectorName) ?? (names.length === 1 ? names[0] : undefined)
  if (picked === undefined) {
    return { ok: false, error: `mcpServers declares ${names.length} servers and none matches "${connectorName}"` }
  }
  const server = servers[picked]
  if (server === null || typeof server !== 'object' || Array.isArray(server)) {
    return { ok: false, error: `server "${picked}" is not an object` }
  }
  const transport = normalizeTransport(server.transport ?? server.type)
  if (transport === '') {
    return { ok: false, error: `unsupported transport "${server.transport ?? server.type}" (need stdio or streamable-http)` }
  }
  const allowed = transport === 'stdio' ? STDIO_KEYS : HTTP_KEYS
  const unknown = Object.keys(server).filter(k => !allowed.has(k))
  if (unknown.length > 0) return { ok: false, error: `unexpected keys: ${unknown.join(', ')}` }

  if (transport === 'streamable-http') {
    const url = String(server.url ?? '')
    if (url === '') return { ok: false, error: 'url is required' }
    let parsed
    try { parsed = new URL(url.replace(/\$\{[^}]+\}/g, 'x')) } catch { return { ok: false, error: 'url is not a valid URL' } }
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return { ok: false, error: `url protocol "${parsed.protocol}" is not allowed` }
    }
    const headers = server.headers ?? {}
    if (headers === null || typeof headers !== 'object' || Array.isArray(headers)) {
      return { ok: false, error: 'headers must be an object' }
    }
    for (const [key, value] of Object.entries(headers)) {
      if (typeof value !== 'string') return { ok: false, error: `header "${key}" must be a string` }
      try {
        new Headers([[key, value.replace(/\$\{[^}]+\}/g, 'x')]])
      } catch {
        return { ok: false, error: `header "${key}" is not a valid HTTP header` }
      }
    }
  } else {
    const command = String(server.command ?? '').trim()
    if (command === '') return { ok: false, error: 'command is required for stdio' }
    if (Array.isArray(server.args) && server.args.some(a => typeof a !== 'string')) {
      return { ok: false, error: 'args must be strings' }
    }
    const env = server.env ?? {}
    if (env === null || typeof env !== 'object' || Array.isArray(env)) return { ok: false, error: 'env must be an object' }
    for (const [key, value] of Object.entries(env)) {
      if (typeof value !== 'string') return { ok: false, error: `env "${key}" must be a string` }
    }
  }

  const refs = credentialRefsIn(server)
  const summary = transport === 'streamable-http'
    ? { transport, url: String(server.url), headers: Object.keys(server.headers ?? {}) }
    : { transport, command: String(server.command), args: (server.args ?? []).length, env: Object.keys(server.env ?? {}) }
  return { ok: true, server, refs, summary }
}

/** Build the mcp-client config from an admitted server (secrets substituted). */
export function buildMcpConfig(server, serverName, resolved) {
  const transport = normalizeTransport(server.transport ?? server.type)
  const base = {
    serverName,
    toolCallTimeoutMs: Number.isInteger(server.toolCallTimeoutMs) ? server.toolCallTimeoutMs : 60_000,
    // Transactional UI: a connector that cannot connect must fail its enable.
    failOnStartupError: true,
    maxInstructionBytes: 8192,
  }
  if (transport === 'streamable-http') {
    const headers = {}
    for (const [key, value] of Object.entries(server.headers ?? {})) headers[key] = substitute(value, resolved)
    return { ...base, transport, url: substitute(server.url, resolved), headers }
  }
  const env = {}
  for (const [key, value] of Object.entries(server.env ?? {})) env[key] = substitute(value, resolved)
  return {
    ...base,
    transport,
    command: substitute(server.command, resolved),
    args: (server.args ?? []).map(a => substitute(a, resolved)),
    env,
    cwd: typeof server.cwd === 'string' ? substitute(server.cwd, resolved) : '',
  }
}

/* ------------------------------------------------------------------ *
 * 本地 MCP 服务器（用户手工注册，与官方连接器分开管理）
 *
 * 两者共用 validateConnectorMcp / buildMcpConfig / createConnectorManager：
 * 本地服务器只是「用户亲自注册的一个 mcp.json 条目」，准入与配置构造完全一致，
 * 没必要也不应该存在第二套 mcp-client 配置逻辑。
 * ------------------------------------------------------------------ */

/** 条目名与官方连接器同一风格（路径安全字符）。 */
export const LOCAL_MCP_NAME_PATTERN = /^[\w.-]+$/

/** mcp-client 对 serverName 的硬约束（照抄官方包声明）。 */
export const MCP_SERVER_NAME_PATTERN = /^[A-Za-z0-9_-]{1,32}$/

/** 默认凭据引用：SCRAPLING → SCRAPLING_MCP_TOKEN。 */
export function localTokenRefFor(name) {
  return `${String(name || '').toUpperCase().replace(/[^A-Z0-9]/g, '_')}_MCP_TOKEN`
}

/**
 * 只允许 loopback（127.0.0.1 / localhost / ::1，任意端口）。
 * 返回 { ok:true } 或 { ok:false, reason }；DNS 一律不做 —— 名字只认字面
 * localhost，绝不发起解析（解析本身就是一次信息泄漏 + TOCTOU 窗口）。
 */
export function isLoopbackUrl(rawUrl) {
  let parsed
  try { parsed = new URL(String(rawUrl ?? '')) } catch { return { ok: false, reason: '不是合法 URL' } }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { ok: false, reason: `协议必须是 http/https（当前 ${parsed.protocol}）` }
  }
  const host = parsed.hostname.toLowerCase().replace(/\.$/, '').replace(/^\[|\]$/g, '')
  if (host === 'localhost' || host === '::1' || /^127(\.\d{1,3}){3}$/.test(host)) return { ok: true }
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    return { ok: false, reason: `只允许本机地址（127.0.0.1 / localhost / ::1），当前是 ${host}` }
  }
  return { ok: false, reason: `只允许本机地址（127.0.0.1 / localhost / ::1），当前主机名 ${host} 无法静态判定为本机，一律拒绝` }
}

/**
 * 注册表单 → 一个「与官方连接器等价」的 mcp 服务器定义。
 * @param {{name:string, url:string, tokenRef?:string}} spec
 * @returns {{ok:true, server:object, serverName:string, refs:string[]}|{ok:false, error:string}}
 */
export function localMcpSpec(spec) {
  const name = String(spec?.name ?? '')
  if (!LOCAL_MCP_NAME_PATTERN.test(name)) return { ok: false, error: `名称只允许字母数字._-（当前 "${name.slice(0, 40)}"）` }
  if (name.length > 80) return { ok: false, error: '名称过长（≤80）' }
  const serverName = name.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 32)
  if (!MCP_SERVER_NAME_PATTERN.test(serverName)) {
    return { ok: false, error: `无法从名称推导出合法 serverName（mcp-client 要求 ${MCP_SERVER_NAME_PATTERN}）` }
  }
  const url = String(spec?.url ?? '').trim()
  const verdict = isLoopbackUrl(url)
  if (!verdict.ok) return { ok: false, error: verdict.reason }
  const tokenRef = String(spec?.tokenRef ?? '').trim() || localTokenRefFor(name)
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(tokenRef)) {
    return { ok: false, error: 'tokenRef 必须是合法凭据引用名（字母数字下划线）' }
  }
  const server = { transport: 'streamable-http', url, headers: {} }
  // token 缺省 = 服务器可能不鉴权（比如还没换到 0.0.0.0+auth-token 时的 scrapling）；
  // 有值则只以 ${REF} 引用进 header，明文永远只进凭据库。启用时若 ref 解析不到值，
  // 宿主会把这个 header 摘掉按「未鉴权」连接（降级是可见的，写进条目 auth 字段）。
  if (tokenRef) server.headers.Authorization = `Bearer \${${tokenRef}}`
  return { ok: true, server, serverName, tokenRef, refs: [tokenRef] }
}

/**
 * Create the connector manager bound to one Hub Host context.
 * @param ctx - Hub host context (must carry `loader`, optionally `credentials`).
 */
export function createConnectorManager(ctx) {
  /** key (`connector/<name>`) → { id, serverName, refs, startedAt } */
  const mounted = new Map()

  const statusOf = key => {
    const live = mounted.get(key)
    return live
      ? { state: 'enabled', serverName: live.serverName, since: live.startedAt }
      : { state: 'disabled' }
  }

  const unmount = async key => {
    const live = mounted.get(key)
    if (live === undefined) return
    mounted.delete(key)
    const entry = ctx.loader.store[live.id]
    if (entry === undefined) return
    const disposal = entry.fiber?.dispose()
    ctx.loader.remove(live.id)
    await disposal
  }

  /**
   * Mount one validated connector. Rejects when the transport cannot be
   * established, leaving nothing mounted (rollback is transactional).
   */
  const enable = async (key, rawMcp, connectorName) => {
    const verdict = validateConnectorMcp(rawMcp, connectorName)
    if (!verdict.ok) throw new Error(verdict.error)
    if (mounted.has(key)) await unmount(key)

    const resolved = {}
    const missing = []
    const credentials = ctx.get?.('credentials')
    for (const ref of verdict.refs) {
      // CredentialRef is a type-only brand; first-party callers pass the plain
      // string key, so no @deepseek-ai/dsh-credentials import is needed here.
      const value = credentials === undefined
        ? undefined
        : (await credentials.resolve(ref))?.value
      if (value === undefined) missing.push(ref)
      else resolved[ref] = value
    }
    if (missing.length > 0) {
      throw new Error(`missing credentials: ${missing.join(', ')}`)
    }

    const { createHash } = await import('node:crypto')
    const fallback = serverNameFor(connectorName, createHash('sha256').update(key).digest('hex'))
    // 与 DSH 原生 mcp-client 保持一致：优先采用连接器自己的 MCP 服务名（官方
    // ide_server_name，也就是 mcp.json 里 mcpServers 的键），这样暴露给模型的工具
    // 命名空间就是 mcp__<name>__<tool>，与原生配置的服务器完全相同；只有该名字非法
    // 或已被其它 mcp-client 实例占用时，才退回带哈希的内部名。
    const declared = Object.keys((rawMcp && rawMcp.mcpServers) || {})
    const preferred = declared.find(n => n === connectorName && /^[A-Za-z0-9._-]{1,64}$/.test(n))
    let serverName = preferred ?? fallback
    let id
    try {
      id = await ctx.loader.create({ name: MCP_CLIENT_PACKAGE, config: buildMcpConfig(verdict.server, serverName, resolved) })
    } catch (error) {
      if (serverName === fallback) throw error
      serverName = fallback
      id = await ctx.loader.create({ name: MCP_CLIENT_PACKAGE, config: buildMcpConfig(verdict.server, serverName, resolved) })
    }
    const entry = ctx.loader.resolve(id)
    if (entry?.fiber === undefined) {
      ctx.loader.remove(id)
      throw new Error('mcp-client did not expose a fiber')
    }
    try {
      await entry.fiber.await()
    } catch (cause) {
      const disposal = entry.fiber.dispose()
      ctx.loader.remove(id)
      await disposal
      throw cause instanceof Error ? cause : new Error(String(cause))
    }
    mounted.set(key, { id, serverName, refs: verdict.refs, startedAt: new Date().toISOString() })
    return { serverName, summary: verdict.summary, refs: verdict.refs }
  }

  return {
    enable,
    disable: unmount,
    statusOf,
    mountedKeys: () => [...mounted.keys()],
    /** Credential refs each mounted connector depends on (for rotation). */
    refsOf: key => mounted.get(key)?.refs ?? [],
    disposeAll: async () => { for (const key of [...mounted.keys()]) await unmount(key) },
  }
}

/**
 * Render the native `mcp-client` overlay row for one connector, ready to paste
 * into a profile patch. Read-only: nothing here writes to the profile. The row
 * mirrors the documented shape (`- insert:` entry with id/name/config) so the
 * server loads exactly like a hand-written native MCP server.
 * @param {{serverName:string, transport:string, url:string, credentialRef:string, connector:string}} spec
 * @param {string} generatedAt ISO timestamp, embedded so a stale snapshot is visible.
 */
export function buildNativeRow(spec, generatedAt) {
  const { serverName, transport, url, credentialRef, connector } = spec
  const yaml = [
    '- insert:',
    `    - id: workbuddy-${connector}`,
    "      name: '@deepseek-ai/dsh-mcp-client'",
    '      config:',
    `        serverName: ${serverName}`,
    `        transport: ${transport}`,
    `        url: ${url}`,
    '        headers:',
    `          Authorization: Bearer \${${credentialRef}}`,
  ].join('\n')
  const header = [
    `# workbuddy-hub 导出 · 连接器 ${connector}`,
    `# 生成时间：${generatedAt}`,
    '# 这是快照：连接器改绑/换账号/凭据变更后请重新导出。',
    `# 工具命名空间：mcp__${serverName}__<tool>`,
    `# 依赖凭据：${credentialRef}（${transport === 'streamable-http' ? '由 DSH credentials 每次调用时解析' : '由 DSH credentials 解析'}）`,
  ].join('\n')
  return `${header}\n${yaml}\n`
}

/** Names already declared in a profile's own patch/config text. */
export function declaredServerNames(text) {
  const out = new Set()
  for (const m of String(text ?? '').matchAll(/serverName\s*:\s*['"]?([A-Za-z0-9._-]+)/g)) out.add(m[1])
  return [...out]
}
