// Unit tests for the connector admission validator, server namespace and
// credential-reference extraction. No network or DSH runtime required.
import { buildNativeRow, declaredServerNames } from './mcp-manager.js'
import assert from 'node:assert/strict'
import {
  normalizeTransport, serverNameFor, credentialRefsIn, validateConnectorMcp, buildMcpConfig,
} from './mcp-manager.js'

const NAME = /^[A-Za-z0-9_-]{1,32}$/

// transport normalization covers WorkBuddy's spellings
assert.equal(normalizeTransport('streamableHttp'), 'streamable-http')
assert.equal(normalizeTransport('streamable-http'), 'streamable-http')
assert.equal(normalizeTransport('sse'), 'streamable-http')
assert.equal(normalizeTransport('stdio'), 'stdio')
assert.equal(normalizeTransport('websocket'), '')

// namespace stays inside the mcp-client budget and pattern
const ns = serverNameFor('tc-chengxin', 'abcdef0123456789')
assert.ok(NAME.test(ns), `bad serverName: ${ns}`)
assert.ok(ns.length <= 32)
assert.notEqual(serverNameFor('a', 'deadbeefdeadbeef'), serverNameFor('b', 'deadbeefdeadbeef'))

// credential placeholders become refs, never inline secrets
assert.deepEqual(credentialRefsIn({ url: 'https://x/?key=${TENCENT_MAP_KEY}', headers: { A: '${TOKEN}' } }).sort(),
  ['TENCENT_MAP_KEY', 'TOKEN'])

// a real WorkBuddy http connector admits; the summary keeps the ${VAR}
// TEMPLATE (the UI needs it to say "configure this credential") while the
// resolved value never enters any summary.
const httpOk = validateConnectorMcp({
  mcpServers: {
    'tencent-map': { type: 'sse', url: 'https://mcp.map.qq.com/sse?key=${TENCENT_MAP_KEY}&format=0', timeout: 30000 },
  },
}, 'tencent-map')
assert.equal(httpOk.ok, true, httpOk.error)
assert.equal(httpOk.summary.transport, 'streamable-http')
assert.deepEqual(httpOk.refs, ['TENCENT_MAP_KEY'])
assert.ok(JSON.stringify(httpOk.summary).includes('${TENCENT_MAP_KEY}'), 'template should be visible to the UI')

// stdio shape admits, unknown keys and bad transports are rejected
assert.equal(validateConnectorMcp({ mcpServers: { s: { transport: 'stdio', command: 'node', args: ['x.js'] } } }, 's').ok, true)
assert.equal(validateConnectorMcp({ mcpServers: { s: { transport: 'stdio', command: 'node', evil: 1 } } }, 's').ok, false)
assert.equal(validateConnectorMcp({ mcpServers: { s: { type: 'websocket', url: 'https://x' } } }, 's').ok, false)
assert.equal(validateConnectorMcp({ mcpServers: { s: { type: 'sse', url: 'file:///etc/passwd' } } }, 's').ok, false)
assert.equal(validateConnectorMcp({ mcpServers: { s: { type: 'sse', url: 'https://x', headers: { 'bad header': 'v' } } } }, 's').ok, false)
assert.equal(validateConnectorMcp({ mcpServers: { s: { type: 'sse', url: 'https://x', headers: { A: 5 } } } }, 's').ok, false)
assert.equal(validateConnectorMcp({ mcpServers: {} }, 's').ok, false)
assert.equal(validateConnectorMcp({ mcpServers: { a: {}, b: {} } }, 's').ok, false)
assert.equal(validateConnectorMcp(null, 's').ok, false)

// built config substitutes refs, forces transactional startup and a bounded prompt
const cfg = buildMcpConfig(
  { type: 'sse', url: 'https://x/?k=${K}', headers: { Authorization: 'Bearer ${K}' } },
  'workbuddy_x_12345678',
  { K: 'secret-value' },
)
assert.equal(cfg.transport, 'streamable-http')
assert.equal(cfg.failOnStartupError, true)
assert.ok(cfg.maxInstructionBytes <= 8192)
assert.equal(cfg.url, 'https://x/?k=secret-value')
assert.equal(cfg.headers.Authorization, 'Bearer secret-value')

console.log('mcp-manager validator, namespace and credential-ref tests: OK')

// Native overlay export: the row must match the documented mcp-client shape and
// must never carry an inline secret.
const row = buildNativeRow({ serverName: 'tdocs-app', transport: 'streamable-http', url: 'https://example.test/mcp', credentialRef: 'WORKBUDDY_TOKEN', connector: 'tdocs-app' }, '2026-09-23T00:00:00.000Z')
assert.ok(row.includes("name: '@deepseek-ai/dsh-mcp-client'"), 'row must declare the native mcp-client package')
assert.ok(row.includes('serverName: tdocs-app'), 'row must carry the runtime server name')
assert.ok(row.includes('Bearer ${WORKBUDDY_TOKEN}'), 'row must reference the credential, not a secret')
assert.ok(row.includes('2026-09-23T00:00:00.000Z'), 'row must embed the generation time')
assert.deepEqual(declaredServerNames('serverName: a\n  serverName: "b"\n'), ['a', 'b'])
console.log('native MCP row export tests: OK')
