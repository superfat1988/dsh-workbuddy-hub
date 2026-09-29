// picker 技能栏的**真源**：DSH 技能服务（而不是只扫 ~/.dsh/skills）。
//
// 背景（用户实测）：装了 `dsh-archify` 插件并重启 DSH 后，picker 技能栏里没有它。
// 原因：archify 的技能由插件包自带的 `skills/` 目录经 `@deepseek-ai/dsh-skill-filesystem`
// 的 `bundledSkillDir` 提供，**不在 `~/.dsh/skills` 下**；我们当时只扫那一个目录，
// 所以任何"由别的 provider 提供"的技能都看不见，系统更新也不会自动出现。
//
// 这里直接测 `collectDshSkills(ctx, registry, prefix)`：它问 `ctx.get('skills').list()`，
// 返回 null 时调用方退回目录扫描（老版本/极简组合）。
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { collectDshSkills } from './index.js'

const roots = []
const makeRoot = label => {
  const root = mkdtempSync(join(tmpdir(), `wbhub-skills-${label}-`))
  roots.push(root)
  return root
}
process.on('exit', () => { for (const root of roots) { try { rmSync(root, { recursive: true, force: true }) } catch {} } })

const ctxWith = skills => ({ get: name => (name === 'skills' ? skills : undefined) })

// ---- 1. 没有 skills 服务 → null（调用方必须退回目录扫描，不能当成"没有技能"）----
console.log('1. 服务缺位 → null（交由调用方兜底）…')
assert.equal(await collectDshSkills({ get: () => undefined }, {}, 'workbuddy-'), null)
assert.equal(await collectDshSkills({}, {}, 'workbuddy-'), null)
assert.equal(await collectDshSkills(ctxWith({}), {}, 'workbuddy-'), null, '没有 list() 也算缺位')
assert.equal(await collectDshSkills(ctxWith({ list: 'not-a-function' }), {}, 'workbuddy-'), null)

// ---- 2. list() 抛错 → null（不把插件打挂）----
console.log('2. list() 抛错 → null …')
assert.equal(await collectDshSkills(ctxWith({ list: async () => { throw new Error('boom') } }), {}, 'x'), null)
assert.equal(await collectDshSkills(ctxWith({ list: async () => 'nope' }), {}, 'x'), null, '非数组也算缺位')

// ---- 3. 插件包自带的技能必须出现（用户实测的 archify 场景）----
console.log('3. 插件自带 skills（archify 场景）…')
{
  const pluginDir = join(makeRoot('archify'), 'node_modules', 'dsh-archify')
  mkdirSync(join(pluginDir, 'skills', 'archify'), { recursive: true })
  writeFileSync(join(pluginDir, 'skills', 'archify', 'SKILL.md'), '---\nname: archify\ndescription: x\n---\n')
  const rows = await collectDshSkills(ctxWith({
    list: async () => [{
      name: 'archify',
      description: 'Create polished, validated architecture diagrams…',
      provider: 'archify-plugin',
      path: join(pluginDir, 'skills', 'archify', 'SKILL.md'),
      invocation: { modelInvocable: true },
    }],
  }), { installed: {} }, 'workbuddy-')
  assert.equal(rows.length, 1, '插件提供的技能必须出现在清单里')
  assert.deepEqual(
    { name: rows[0].name, provider: rows[0].provider, local: rows[0].local, hub: rows[0].hub, invocable: rows[0].modelInvocable },
    { name: 'archify', provider: 'archify-plugin', local: true, hub: false, invocable: true },
    '第三方插件技能：local=true / hub=false，且保留 provider 供排查')
  assert.equal(rows[0].dir, join(pluginDir, 'skills', 'archify'), 'dir 取指令文件所在目录')
}

// ---- 4. hub 装的技能仍要带官方展示名/图标，并排在最前 ----
console.log('4. hub 装的技能（按技能名 / 去前缀 / 落地目录 三种匹配）…')
{
  const store = makeRoot('store')
  const destX = join(store, 'skills', 'xlsx')
  const destY = join(store, 'skills', 'pdf')
  const destZ = join(store, 'skills', 'demo')
  for (const dest of [destX, destY, destZ]) mkdirSync(dest, { recursive: true })
  const registry = {
    installed: {
      'skill/xlsx': { kind: 'skill', name: 'xlsx', displayName: 'Excel 表格处理', icon: 'https://cdn/xlsx.png', dest: destX },
      // 名字带前缀的情况：服务里叫 workbuddy-pdf，注册表里是 skill/pdf
      'skill/pdf': { kind: 'skill', name: 'pdf', displayName: 'PDF 处理', icon: '', dest: destY },
      // 名字完全对不上的情况：靠 dest 目录反查
      'skill/renamed': { kind: 'skill', name: 'renamed', displayName: '改过名的技能', icon: '', dest: destZ },
    },
  }
  const rows = await collectDshSkills(ctxWith({
    list: async () => [
      { name: 'workbuddy-demo', description: '', provider: 'filesystem', path: join(destZ, 'SKILL.md') },
      { name: 'workbuddy-pdf', description: '服务给的描述', provider: 'filesystem', path: join(destY, 'SKILL.md') },
      { name: 'xlsx', description: '服务给的描述', provider: 'filesystem', path: join(destX, 'SKILL.md') },
      { name: 'zzz-system', description: '系统自带', provider: 'filesystem', path: '/opt/other/SKILL.md' },
    ],
  }), registry, 'workbuddy-')
  const byName = Object.fromEntries(rows.map(row => [row.name, row]))
  assert.equal(byName.xlsx.hub, true, '按技能名直接命中')
  assert.equal(byName.xlsx.displayName, 'Excel 表格处理', 'hub 技能用官方展示名')
  assert.equal(byName.xlsx.icon, 'https://cdn/xlsx.png', 'hub 技能带官方图标')
  assert.equal(byName['workbuddy-pdf'].hub, true, '服务名带前缀时按去前缀命中')
  assert.equal(byName['workbuddy-pdf'].displayName, 'PDF 处理')
  assert.equal(byName['workbuddy-demo'].hub, true, '名字对不上时按落地目录反查命中')
  assert.equal(byName['workbuddy-demo'].displayName, '改过名的技能')
  assert.equal(byName['zzz-system'].hub, false, '非 hub 技能标成系统技能')
  assert.deepEqual(rows.map(row => row.hub), [true, true, true, false], 'hub 技能排在系统技能之前')
}

// ---- 5. 脏数据与不可调用标记 ----
console.log('5. 脏数据 / modelInvocable …')
{
  const rows = await collectDshSkills(ctxWith({
    list: async () => [
      { name: '  ', description: 'x' },
      { description: '没有 name' },
      null,
      { name: 'user-only', description: 'd', invocation: { modelInvocable: false } },
      { name: 'virtual', description: 'd' },   // 虚拟技能：没有 path
    ],
  }), { installed: {} }, 'workbuddy-')
  assert.deepEqual(rows.map(row => row.name).sort(), ['user-only', 'virtual'], '空名/无名/null 一律跳过')
  assert.equal(rows.find(row => row.name === 'user-only').modelInvocable, false, '不可被模型调用的技能要如实标注')
  assert.equal(rows.find(row => row.name === 'virtual').path, '', '虚拟技能没有指令文件路径')
  assert.equal(rows.find(row => row.name === 'virtual').dir, '')
}

console.log('dsh skills service source (picker skill list) tests: OK')
