// CLI-shape connector: bundled skills must become loadable DSH skills, and the
// CLI requirements must be recorded without persisting command templates.
import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync, rmSync, existsSync, readlinkSync, lstatSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'
import { connectorSkillDirs, linkConnectorSkills, unlinkConnectorSkills, readCliMeta } from './index.js'

const PREFIX = 'wbh-selftest-'
const root = '/tmp/wbh-cli-connector'
rmSync(root, { recursive: true, force: true })

// shape A: single skill at skills/SKILL.md (like tc-chengxin)
const single = join(root, 'single')
mkdirSync(join(single, 'skills', 'scripts'), { recursive: true })
writeFileSync(join(single, 'skills', 'SKILL.md'), '---\nname: single\n---\nbody')
writeFileSync(join(single, 'cli.json'), JSON.stringify({
  runtime: { type: 'node', version: '>=18' },
  versionCheck: { minVersion: '1.0.3' },
  auth: { win32: 'do-not-persist-me' },
  authUrlDomain: 'm.ly.com',
  init: { win32: 'npm install -g "%TC_CONNECTOR_HOME%\\cli\\x.tgz"' },
}))

// shape B: several skills at skills/<child>/SKILL.md (like 77ircloud)
const multi = join(root, 'multi')
mkdirSync(join(multi, 'skills', 'alpha'), { recursive: true })
mkdirSync(join(multi, 'skills', 'beta'), { recursive: true })
mkdirSync(join(multi, 'skills', 'notaskill'), { recursive: true })
writeFileSync(join(multi, 'skills', 'alpha', 'SKILL.md'), '---\nname: alpha\n---\n')
writeFileSync(join(multi, 'skills', 'beta', 'SKILL.md'), '---\nname: beta\n---\n')

// MCP-only connector has no skills
const mcpOnly = join(root, 'mcponly')
mkdirSync(mcpOnly, { recursive: true })
writeFileSync(join(mcpOnly, 'mcp.json'), JSON.stringify({ mcpServers: {} }))

assert.deepEqual(connectorSkillDirs(single).map(d => d.child), [''])
assert.deepEqual(connectorSkillDirs(multi).map(d => d.child).sort(), ['alpha', 'beta'])
assert.deepEqual(connectorSkillDirs(mcpOnly), [])
assert.equal(readCliMeta(mcpOnly), null)

const links = []
try {
  const s1 = linkConnectorSkills(PREFIX, 'single', single)
  assert.equal(s1.length, 1)
  links.push(...s1)
  assert.ok(existsSync(s1[0].linkPath), 'single skill link must exist')
  assert.equal(readlinkSync(s1[0].linkPath), join(single, 'skills'))

  const s2 = linkConnectorSkills(PREFIX, 'multi', multi)
  assert.equal(s2.length, 2, 'both child skills link, dirs without SKILL.md do not')
  links.push(...s2)
  assert.deepEqual(s2.map(x => x.name).sort(), ['multi-alpha', 'multi-beta'])

  const cli = readCliMeta(single)
  assert.equal(cli.runtime, 'node >=18')
  assert.equal(cli.minVersion, '1.0.3')
  assert.equal(cli.authDomain, 'm.ly.com')
  assert.equal(cli.needsAuth, true)
  assert.ok(!JSON.stringify(cli).includes('do-not-persist-me'), 'command templates must not be persisted')
  assert.ok(!JSON.stringify(cli).includes('npm install'))

  // uninstall path removes every link it created
  unlinkConnectorSkills(PREFIX, links)
  for (const l of links) assert.ok(!existsSync(l.linkPath), `link should be gone: ${l.linkPath}`)
} finally {
  unlinkConnectorSkills(PREFIX, links)
  for (const l of links) { try { lstatSync(l.linkPath) && rmSync(l.linkPath, { force: true }) } catch { /* gone */ } }
  rmSync(root, { recursive: true, force: true })
}

console.log('CLI connector skill linking and cli metadata: OK')
