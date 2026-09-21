// 端到端测试：catalog → search → install → land → link
import { ghTree, buildIndex, downloadEntry, landEntry, loadRegistry, saveRegistry, linkSkill, unlinkSkill } from './index.js'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { existsSync, readFileSync, mkdirSync } from 'node:fs'

const REPO = 'superfat1988/workbuddyskills', BR = 'main'
const root = '/tmp/wbhub-test'
mkdirSync(join(root, '.meta'), { recursive: true })
const paths = {
  root, store: join(root, '.store'), skills: join(root, 'skills'),
  experts: join(root, 'experts'), connectors: join(root, 'connectors'),
  meta: join(root, '.meta'), registry: join(root, '.meta', 'registry.json'),
  catalogCache: join(root, '.meta', 'catalog-cache.json'),
}
for (const d of [paths.skills, paths.experts, paths.connectors]) mkdirSync(d, { recursive: true })

console.log('1. ghTree…')
const blobs = await ghTree(REPO, BR)
console.log(`   blobs: ${blobs.length}`)

console.log('2. buildIndex…')
const index = buildIndex(blobs)
console.log(`   experts=${index.experts.length} skills=${index.skills.length} connectors=${index.connectors.length}`)

console.log('3. install skill: meituan-coupon-workbuddy')
const files = await downloadEntry(REPO, BR, 'skills', 'meituan-coupon-workbuddy')
console.log(`   downloaded: ${Object.keys(files).length} files`)
const { dest, report } = landEntry(paths, 'skill', 'meituan-coupon-workbuddy', files)
console.log(`   landed: ${dest}`)
console.log(`   report: files=${report.files} flags=${report.flags.length ? report.flags.slice(0,5).join('; ') : 'none'}`)

console.log('4. install expert: tmap-lbs-plugin (lite avatars)')
const ef = await downloadEntry(REPO, BR, "experts", "meituan-living-assistant", { liteAvatars: true })
console.log(`   downloaded: ${Object.keys(ef).length} files (avatars skipped: ${Object.keys(ef).every(k => !k.includes('avatars'))})`)
const e2 = landEntry(paths, 'expert', 'tencent-docs', ef)
console.log(`   expert flags: ${e2.report.flags.length}`)

console.log('5. install connector: tencent-map')
const cf = await downloadEntry(REPO, BR, 'connectors', 'tencent-map')
const c1 = landEntry(paths, 'connector', 'tencent-map', cf)
console.log(`   connector files: ${c1.report.files}; mcp.json exists: ${existsSync(join(c1.dest, 'mcp.json'))}`)

console.log('6. registry + symlink')
const reg = { version: 1, installed: {
  'skill/meituan-coupon-workbuddy': { kind: 'skill', name: 'meituan-coupon-workbuddy', dest, linked: true },
} }
saveRegistry(paths.registry, reg)
const link = linkSkill(paths, 'workbuddy-', 'meituan-coupon-workbuddy')
const linkedTarget = readFileSync(join(link, 'SKILL.md'), 'utf8').slice(0, 80)
console.log(`   symlink: ${link}`)
console.log(`   SKILL.md via symlink: ${linkedTarget.replace(/\n/g, ' ').slice(0, 60)}…`)

console.log('7. cleanup link')
unlinkSkill('workbuddy-', 'meituan-coupon-workbuddy')
console.log('\nALL TESTS PASSED')
