// 安装链路的**联网**端到端验收（可选）：ghTree → buildIndex → downloadEntry → landEntry。
//
// 为什么和 test-install.mjs 分开：这一段依赖 GitHub（镜像仓）网络，挂进 npm test 会让
// 离线环境/限流时红掉。所以这里做成手动/CI 可选：
//     node test-install-live.mjs          （离线会自动 SKIP 并以 0 退出）
//     npm run test:live
// 全程只写 mkdtemp 临时目录，不碰 ~/workbuddyskills 与 ~/.dsh/skills。
import { mkdtempSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { ghTree, buildIndex, downloadEntry, landEntry, linkSkill, unlinkSkill } from './index.js'

// 与插件默认配置一致（见 cordis.patch.yml 的 mirrorRepo/mirrorBranch）
const REPO = process.env.WBH_MIRROR_REPO || 'superfat1988/workbuddyskills'
const BRANCHES = [process.env.WBH_MIRROR_BRANCH || 'mirror', 'main']

const root = mkdtempSync(join(tmpdir(), 'wbhub-live-'))
const skillsMount = join(root, 'dsh-skills')
const paths = {
  root,
  store: join(root, '.store'),
  skills: join(root, 'skills'),
  experts: join(root, 'experts'),
  connectors: join(root, 'connectors'),
  meta: join(root, '.meta'),
  registry: join(root, '.meta', 'registry.json'),
  catalogCache: join(root, '.meta', 'catalog-cache.json'),
}
for (const d of [paths.skills, paths.experts, paths.connectors, paths.meta, skillsMount]) mkdirSync(d, { recursive: true })

let blobs = null
let branch = ''
for (const b of BRANCHES) {
  try {
    blobs = await ghTree(REPO, b)
    branch = b
    break
  } catch (error) {
    console.log(`   ${REPO}@${b} 读取失败：${String(error.message || error)}`)
  }
}
if (!blobs) {
  console.log(`SKIP: 拿不到镜像仓 ${REPO} 的 tree（离线或限流）；离线链路请看 test-install.mjs`)
  rmSync(root, { recursive: true, force: true })
  process.exit(0)
}

console.log(`1. ghTree(${REPO}@${branch}) → ${blobs.length} blobs`)
const index = buildIndex(blobs)
console.log(`2. buildIndex → experts=${index.experts.length} skills=${index.skills.length} connectors=${index.connectors.length}`)
if (!index.skills.length || !index.experts.length) {
  console.error('FAIL: 镜像仓里应当同时有专家与技能')
  process.exit(1)
}

// 3. 真下一个技能并落盘
const skillName = index.skills[0].name
console.log(`3. downloadEntry(skills/${skillName})…`)
const sf = await downloadEntry(REPO, branch, 'skills', skillName)
const s1 = landEntry(paths, 'skill', skillName, sf)
console.log(`   落盘 ${s1.report.files} 个文件 → ${s1.dest}`)
if (!existsSync(join(s1.dest, 'SKILL.md'))) {
  console.error('FAIL: 技能落盘后应有 SKILL.md')
  process.exit(1)
}

// 4. 真下一个专家（跳过 avatar）并落盘
const expertName = index.experts[0].name
console.log(`4. downloadEntry(experts/${expertName}, liteAvatars)…`)
const ef = await downloadEntry(REPO, branch, 'experts', expertName, { liteAvatars: true })
const noAvatars = Object.keys(ef).every(k => !k.includes('avatars'))
const e1 = landEntry(paths, 'expert', expertName, ef)
console.log(`   落盘 ${e1.report.files} 个文件（跳过 avatar：${noAvatars}）→ ${e1.dest}`)

// 5. 软链挂载 + 解除（临时挂载根）
const link = linkSkill(paths, 'workbuddy-', skillName, skillsMount)
console.log(`5. linkSkill → ${link}`)
if (!existsSync(join(link, 'SKILL.md'))) {
  console.error('FAIL: 通过软链应能读到 SKILL.md')
  process.exit(1)
}
unlinkSkill('workbuddy-', skillName, skillsMount)
if (existsSync(link)) {
  console.error('FAIL: 解除后链接应消失')
  process.exit(1)
}

rmSync(root, { recursive: true, force: true })
console.log('\nALL TESTS PASSED (live: ghTree → download → land → link)')
