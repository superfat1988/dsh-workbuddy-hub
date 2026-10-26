// MCP OAuth 2.1 接入层单测（**全离线**：本地 http 服务器 + 打桩 fetch）。
//
// 覆盖：PKCE / WWW-Authenticate 解析 / 授权服务器发现 / 动态注册 / 授权 URL 组成 /
//       换 token / 刷新 / 凭据引用命名 / loopback 回调（含 state 校验与超时）。
// 真实协议行为由 scripts/accept-desktop-live.mjs 的端到端场景（假 AS + 假 MCP）验证。
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { createHash } from 'node:crypto'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  codeVerifier, codeChallengeS256, parseWwwAuthenticate, discoverMcpOAuth, registerClient,
  buildAuthorizeUrl, exchangeCode, refreshAccessToken, tokenRefFor, startCallbackServer,
  loadClients, saveClient, oauthPaths, DEFAULT_CALLBACK_PORT,
} from './wb-mcp-oauth.js'

let passed = 0
const ok = (label, fn) => { fn(); passed++; console.log(`  ok  ${label}`) }
const okAsync = async (label, fn) => { await fn(); passed++; console.log(`  ok  ${label}`) }

/** 造一个 fetch 桩：按 URL 分派固定响应。 */
const stubFetch = routes => async (url, init = {}) => {
  for (const [pattern, handler] of routes) {
    if (String(url).includes(pattern)) {
      const out = typeof handler === 'function' ? handler(url, init) : handler
      return {
        status: out.status ?? 200,
        headers: { get: k => (out.headers ?? {})[String(k).toLowerCase()] ?? null },
        text: async () => (typeof out.body === 'string' ? out.body : JSON.stringify(out.body ?? {})),
      }
    }
  }
  throw new Error(`unstubbed fetch: ${url}`)
}

console.log('wb-mcp-oauth.js 单测')

ok('PKCE：verifier 合法且 challenge = base64url(sha256(verifier))', () => {
  const v = codeVerifier()
  assert.match(v, /^[A-Za-z0-9_-]{43}$/, 'verifier 应为 43 字符 base64url')
  const expect = createHash('sha256').update(v).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  assert.equal(codeChallengeS256(v), expect)
  assert.notEqual(codeChallengeS256(codeVerifier()), codeChallengeS256(codeVerifier()))
})

ok('WWW-Authenticate 解析：取到 realm 与 resource_metadata；非 Bearer 返回 null', () => {
  const p = parseWwwAuthenticate('Bearer realm="QQMail Service", resource_metadata="https://api.mail.qq.com/.well-known/oauth-protected-resource"')
  assert.equal(p.realm, 'QQMail Service')
  assert.equal(p.resource_metadata, 'https://api.mail.qq.com/.well-known/oauth-protected-resource')
  assert.equal(parseWwwAuthenticate('Basic realm="x"'), null)
  assert.equal(parseWwwAuthenticate(''), null)
})

ok('凭据引用命名：连接器名 → ${WORKBUDDY_OAUTH_<NAME>_TOKEN}', () => {
  assert.equal(tokenRefFor('qq-mail'), 'WORKBUDDY_OAUTH_QQ_MAIL_TOKEN')
  assert.equal(tokenRefFor('tencent-docs-oa'), 'WORKBUDDY_OAUTH_TENCENT_DOCS_OA_TOKEN')
  assert.match(tokenRefFor('***'), /^WORKBUDDY_OAUTH_[A-Z0-9_]+_TOKEN$/)
})

await okAsync('发现：401 头里的 resource_metadata → 授权服务器 → AS 元数据', async () => {
  const fetchImpl = stubFetch([
    ['.well-known/oauth-protected-resource', { body: { resource: 'https://api.example.com/mcp', authorization_servers: ['https://as.example.com'] } }],
    ['.well-known/oauth-authorization-server', {
      body: {
        issuer: 'https://as.example.com', authorization_endpoint: 'https://as.example.com/oauth/authorize',
        token_endpoint: 'https://as.example.com/oauth/token', registration_endpoint: 'https://as.example.com/oauth/register',
        scopes_supported: ['mail:read', 'mail:send'],
      },
    }],
  ])
  const d = await discoverMcpOAuth('https://api.example.com/mcp', {
    fetchImpl,
    wwwAuthenticate: 'Bearer realm="x", resource_metadata="https://api.example.com/.well-known/oauth-protected-resource"',
  })
  assert.equal(d.ok, true)
  assert.equal(d.authorizationServer, 'https://as.example.com')
  assert.equal(d.metadata.authorizationEndpoint, 'https://as.example.com/oauth/authorize')
  assert.equal(d.metadata.tokenEndpoint, 'https://as.example.com/oauth/token')
  assert.equal(d.metadata.registrationEndpoint, 'https://as.example.com/oauth/register')
  assert.deepEqual(d.metadata.scopesSupported, ['mail:read', 'mail:send'])
  assert.equal(d.resource, 'https://api.example.com/mcp')
})

await okAsync('发现失败路径：没有 protected-resource 元数据 → 如实报「不是 MCP OAuth 端点」', async () => {
  const fetchImpl = stubFetch([['/.well-known/oauth-protected-resource', { status: 404, body: {} }]])
  const d = await discoverMcpOAuth('https://plain.example.com/mcp', { fetchImpl })
  assert.equal(d.ok, false)
  assert.match(d.reason, /没有提供 OAuth protected-resource 元数据/)
})

await okAsync('动态注册：公开客户端 + loopback 回调 + PKCE（body 形状要对）', async () => {
  let seenBody = null
  const fetchImpl = stubFetch([['/oauth/register', (url, init) => {
    seenBody = JSON.parse(init.body)
    return { status: 201, body: { client_id: 'cid-123', redirect_uris: ['http://127.0.0.1:8788/callback'], token_endpoint_auth_method: 'none' } }
  }]])
  const r = await registerClient({ metadata: { registrationEndpoint: 'https://as.example.com/oauth/register' } }, {
    redirectUri: 'http://127.0.0.1:8788/callback', scope: 'mail:read mail:send', fetchImpl,
  })
  assert.equal(r.ok, true)
  assert.equal(r.clientId, 'cid-123')
  assert.equal(seenBody.token_endpoint_auth_method, 'none', '公开客户端（无 secret）')
  assert.deepEqual(seenBody.redirect_uris, ['http://127.0.0.1:8788/callback'])
  assert.deepEqual(seenBody.grant_types, ['authorization_code', 'refresh_token'])
  assert.equal(seenBody.scope, 'mail:read mail:send')
  const noReg = await registerClient({ metadata: {} }, { redirectUri: 'http://127.0.0.1:1/callback', fetchImpl })
  assert.equal(noReg.ok, false)
  assert.match(noReg.reason, /不支持动态客户端注册/)
})

ok('授权 URL：response_type/client_id/redirect_uri/PKCE/state/scope/resource 齐全', () => {
  const url = new URL(buildAuthorizeUrl(
    { metadata: { authorizationEndpoint: 'https://as.example.com/oauth/authorize' }, resource: 'https://api.example.com/mcp' },
    { clientId: 'cid-1', redirectUri: 'http://127.0.0.1:8788/callback', state: 'st-1', verifier: 'v-1', scope: 'mail:read', resource: 'https://api.example.com/mcp' },
  ))
  assert.equal(url.origin + url.pathname, 'https://as.example.com/oauth/authorize')
  assert.equal(url.searchParams.get('response_type'), 'code')
  assert.equal(url.searchParams.get('client_id'), 'cid-1')
  assert.equal(url.searchParams.get('redirect_uri'), 'http://127.0.0.1:8788/callback')
  assert.equal(url.searchParams.get('code_challenge_method'), 'S256')
  assert.equal(url.searchParams.get('code_challenge'), codeChallengeS256('v-1'))
  assert.equal(url.searchParams.get('state'), 'st-1')
  assert.equal(url.searchParams.get('scope'), 'mail:read')
  assert.equal(url.searchParams.get('resource'), 'https://api.example.com/mcp')
})

await okAsync('换 token / 刷新：form-urlencoded + code_verifier / refresh_token', async () => {
  let seen = []
  const fetchImpl = stubFetch([['/oauth/token', (url, init) => {
    seen.push(init.body)
    return { body: { access_token: 'at-1', refresh_token: 'rt-1', expires_in: 3600, token_type: 'Bearer', scope: 'mail:read' } }
  }]])
  const discovery = { metadata: { tokenEndpoint: 'https://as.example.com/oauth/token' }, resource: 'https://api.example.com/mcp' }
  const tok = await exchangeCode(discovery, { code: 'c-1', verifier: 'v-1', clientId: 'cid-1', redirectUri: 'http://127.0.0.1:8788/callback', resource: 'https://api.example.com/mcp', fetchImpl })
  assert.equal(tok.ok, true)
  assert.equal(tok.accessToken, 'at-1')
  assert.equal(tok.refreshToken, 'rt-1')
  assert.equal(tok.expiresIn, 3600)
  const first = new URLSearchParams(seen[0])
  assert.equal(first.get('grant_type'), 'authorization_code')
  assert.equal(first.get('code'), 'c-1')
  assert.equal(first.get('code_verifier'), 'v-1')
  assert.equal(first.get('resource'), 'https://api.example.com/mcp')

  const refreshed = await refreshAccessToken(discovery, { refreshToken: 'rt-1', clientId: 'cid-1', fetchImpl })
  assert.equal(refreshed.ok, true)
  const second = new URLSearchParams(seen[1])
  assert.equal(second.get('grant_type'), 'refresh_token')
  assert.equal(second.get('refresh_token'), 'rt-1')

  const bad = await exchangeCode({ metadata: { tokenEndpoint: 'https://as.example.com/oauth/token' } }, { code: '', verifier: '', clientId: '', redirectUri: '', fetchImpl: stubFetch([['/oauth/token', { status: 400, body: { error: 'invalid_grant' } }]]) })
  assert.equal(bad.ok, false)
  assert.match(bad.reason, /换 token 被拒（HTTP 400）/)
})

ok('注册信息落盘 → 可读回（clients.json，原子写）', () => {
  const root = mkdtempSync(join(tmpdir(), 'wbh-oauth-store-'))
  try {
    assert.deepEqual(loadClients(root), {})
    saveClient(root, 'https://as.example.com|http://127.0.0.1:8788/callback', { clientId: 'cid-9', redirectUri: 'http://127.0.0.1:8788/callback' })
    const back = loadClients(root)
    assert.equal(Object.keys(back).length, 1)
    assert.equal(back['https://as.example.com|http://127.0.0.1:8788/callback'].clientId, 'cid-9')
    assert.equal(oauthPaths(root).clients, join(root, '.meta', 'oauth', 'clients.json'))
  } finally { rmSync(root, { recursive: true, force: true }) }
})

await okAsync('loopback 回调：state 不匹配不终止流程，正确回调仍能收到 code', async () => {
  const cb = await startCallbackServer({ preferredPort: 0, state: 'st-ok', ttlMs: 5000 })
  assert.equal(cb.ok, true, '回调服务器应能起来（端口由系统分配）')
  assert.match(cb.redirectUri, /^http:\/\/127\.0\.0\.1:\d+\/callback$/, '默认只绑回环')
  const cbHost = await startCallbackServer({ preferredPort: 0, host: '0.0.0.0', state: 'st-host', ttlMs: 2000 })
  assert.match(cbHost.redirectUri, /^http:\/\/0\.0\.0\.0:\d+\/callback$/, 'host 可配（LAN IP 场景）')
  cbHost.close()
  const bad = await fetch(`${cb.redirectUri}?code=c-1&state=wrong`)
  assert.equal(bad.status, 200)
  assert.match(await bad.text(), /授权未完成/, 'state 不匹配要如实回「不匹配」，但不能当成授权失败把流程结束掉')
  const noCode = await fetch(`${cb.redirectUri}?state=st-ok`)
  assert.match(await noCode.text(), /授权未完成/)
  const good = await fetch(`${cb.redirectUri}?code=c-2&state=st-ok`)
  assert.match(await good.text(), /授权已完成/)
  const outcome = await cb.wait
  assert.equal(outcome.ok, true)
  assert.equal(outcome.code, 'c-2')
})

await okAsync('loopback 回调：用户拒绝（error=access_denied）是终止性的，如实返回原因', async () => {
  const cb = await startCallbackServer({ preferredPort: 0, state: 'st-deny', ttlMs: 5000 })
  assert.equal(cb.ok, true)
  const res = await fetch(`${cb.redirectUri}?error=access_denied&error_description=user%20said%20no&state=st-deny`)
  assert.match(await res.text(), /授权未完成/)
  const outcome = await cb.wait
  assert.equal(outcome.ok, false)
  assert.match(outcome.error, /access_denied/)
})

await okAsync('loopback 回调：超时后如实返回（不永远挂着）', async () => {
  const cb = await startCallbackServer({ preferredPort: 0, state: 'st-timeout', ttlMs: 300 })
  assert.equal(cb.ok, true)
  const outcome = await cb.wait
  assert.equal(outcome.ok, false)
  assert.match(outcome.error, /超时/)
})

await okAsync('loopback 回调：非 /callback 路径 404（不误收）', async () => {
  const cb = await startCallbackServer({ preferredPort: 0, state: 'st-path', ttlMs: 3000 })
  const port = new URL(cb.redirectUri).port
  const res = await fetch(`http://127.0.0.1:${port}/other?code=x&state=st-path`)
  assert.equal(res.status, 404)
  cb.close()
})

console.log(`\nALL MCP-OAUTH TESTS PASSED (${passed})`)
