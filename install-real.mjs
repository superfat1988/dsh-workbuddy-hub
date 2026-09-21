import { downloadEntry, landEntry, linkSkill } from './index.js'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { mkdirSync } from 'node:fs'
const root = join(homedir(), 'workbuddyskills')
const paths = {
  root, skills: join(root, 'skills'), experts: join(root, 'experts'),
  connectors: join(root, 'connectors'), meta: join(root, '.meta'),
}
const [,, kind, name] = process.argv
const files = await downloadEntry('superfat1988/workbuddyskills', 'main', `${kind}s`, name)
const { dest, report } = landEntry(paths, kind, name, files)
console.log(`installed ${kind}/${name}: ${report.files} files -> ${dest}`)
if (report.flags.length) console.log(`flags: ${report.flags.length}`)
if (kind === 'skill') console.log('link:', linkSkill(paths, 'workbuddy-', name))
