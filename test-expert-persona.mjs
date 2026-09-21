import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync, rmSync, symlinkSync } from 'node:fs'
import { join } from 'node:path'
import { confinedPath, selectAgentId, readExpertPersona, buildPersonaLine, buildSummonPrompt } from './expert-persona.js'

const root = '/tmp/wbh-expert-test'
rmSync(root, { recursive: true, force: true })
mkdirSync(join(root, 'experts', 'solo', '.codebuddy-plugin'), { recursive: true })
mkdirSync(join(root, 'experts', 'solo', 'agents'), { recursive: true })
mkdirSync(join(root, 'experts', 'teamex', '.codebuddy-plugin'), { recursive: true })
mkdirSync(join(root, 'experts', 'teamex', 'agents'), { recursive: true })

writeFileSync(join(root, 'experts/solo/.codebuddy-plugin/plugin.json'), JSON.stringify({
  name: 'solo', agentName: 'advisor', displayName: { zh: '税务顾问' }, displayDescription: { zh: '处理个税与增值税问题' },
}))
writeFileSync(join(root, 'experts/solo/agents/advisor.md'), '# 税务顾问\n你是资深税务顾问。\n')

writeFileSync(join(root, 'experts/teamex/.codebuddy-plugin/plugin.json'), JSON.stringify({
  name: 'teamex', teamInfo: { leadAgent: 'lead', memberAgents: ['lead', 'm1', 'm2'] }, displayName: '研究团队',
}))
writeFileSync(join(root, 'experts/teamex/agents/lead.md'), '# 团长\n负责拆解与整合。\n')
mkdirSync(join(root, 'experts/nopersona/.codebuddy-plugin'), { recursive: true })
writeFileSync(join(root, 'experts/nopersona/.codebuddy-plugin/plugin.json'), JSON.stringify({ name: 'nopersona', agentName: 'ghost' }))

// path confinement
assert.throws(() => confinedPath(join(root, 'experts'), '..', 'etc'), /escapes/)
assert.equal(confinedPath(join(root, 'experts'), 'ok'), join(root, 'experts', 'ok'))

// agent selection
assert.equal(selectAgentId({ agentName: 'a' }).agentId, 'a')
assert.equal(selectAgentId({ teamInfo: { leadAgent: 'lead', memberAgents: ['lead', 'x'] } }).mode, 'team')
assert.deepEqual(selectAgentId({ teamInfo: { leadAgent: 'lead', memberAgents: ['lead', 'x'] } }).members, ['x'])
assert.equal(selectAgentId({}).ok, false)
assert.equal(selectAgentId({ agentName: '../evil' }).ok, false)

// single expert
const solo = readExpertPersona(join(root, 'experts'), 'solo')
assert.equal(solo.ok, true, solo.error)
assert.equal(solo.title, '税务顾问')
assert.equal(solo.mode, 'single')
assert.ok(solo.persona.includes('资深税务顾问'))

// team expert
const team = readExpertPersona(join(root, 'experts'), 'teamex')
assert.equal(team.ok, true, team.error)
assert.equal(team.mode, 'team')
assert.deepEqual(team.members, ['m1', 'm2'])
assert.equal(team.title, '研究团队')

// failures are explicit, never silent
assert.equal(readExpertPersona(join(root, 'experts'), 'nopersona').ok, false)
assert.equal(readExpertPersona(join(root, 'experts'), 'missing').ok, false)
assert.equal(readExpertPersona(join(root, 'experts'), '../etc').ok, false)

// escaping symlink is refused
try {
  symlinkSync('/etc', join(root, 'experts', 'link'), 'dir')
  assert.equal(readExpertPersona(join(root, 'experts'), 'link').ok, false)
} catch { /* symlink unsupported here */ }

// persona line strips template braces; prompt carries the full file
const line = buildPersonaLine({ title: 'A{{B}}', description: 'x' })
assert.ok(!line.includes('{{') && !line.includes('}}'))
const prompt = buildSummonPrompt({ title: '税务顾问', mode: 'single', agentId: 'advisor', persona: '# 税务顾问\n正文' }, '帮我算个税')
assert.ok(prompt.includes('帮我算个税') && prompt.includes('正文') && prompt.includes('税务顾问'))
assert.ok(buildSummonPrompt({ title: 't', mode: 'single', agentId: 'a', persona: 'p' }, '').includes('尚未给出具体任务'))

rmSync(root, { recursive: true, force: true })
console.log('expert persona parser tests: OK')
