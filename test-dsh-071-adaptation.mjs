// DSH 0.1.7 适配的静态验收（对应 `DSH/dsh-upgrade-prep/HANDOFF-workbuddy-hub.md`）。
//
// 两处破坏：
//   ① 专家预设 —— 0.1.7 删了 `agentPresets.copy()` / `.remove()`，预设只能**声明**
//      （`register(definition)`，disposer 由声明方持有）。
//   ② 会话 cwd 读取 —— 旧实现硬编码 `/home/USER/.dsh/sessions` 与 `session.v3.jsonl.zstd`，
//      升级后新写入的是 `session.v4.*`，静默读不到。
//
// 这里用**0.1.7 形状的假 presets**（只有 register/resolve，**故意不提供 copy/remove**）跑真实
// 代码：只要新路径碰一下旧 API，就会 TypeError —— 这比 grep 更强，是"新路径不依赖已删 API"
// 的**可执行证明**。同时覆盖 0.1.6 形状（有 copy）不会被误判。
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir, homedir } from 'node:os'
import { execSync } from 'node:child_process'
import {
  ensureExpertPreset, injectPersonaRows, usesPresetDeclarations, standardPresetDeclaration,
  disposeExpertPreset, disposeAllExpertPresets, expertPresetId,
  dshHomeRoot, sessionLogsNewestFirst, readSessionCwdFromDisk,
} from './index.js'

const roots = []
const makeRoot = label => {
  const root = mkdtempSync(join(tmpdir(), `wbhub-071-${label}-`))
  roots.push(root)
  return root
}
process.on('exit', () => { for (const root of roots) { try { rmSync(root, { recursive: true, force: true }) } catch {} } })

/** 造一个已安装专家的最小磁盘现场：plugin.json 指 agentName，persona 在 agents/<id>.md。 */
function seedExpert(root, name, { displayName = '演示专家', description = '用于测试的专家', body = '# 角色\n你是一位演示专家。' } = {}) {
  const dir = join(root, 'experts', name)
  mkdirSync(join(dir, '.codebuddy-plugin'), { recursive: true })
  mkdirSync(join(dir, 'agents'), { recursive: true })
  writeFileSync(join(dir, '.codebuddy-plugin', 'plugin.json'), JSON.stringify({
    agentName: 'demo-agent', displayName, displayDescription: description,
  }))
  writeFileSync(join(dir, 'agents', 'demo-agent.md'), body)
  return dir
}

function seedRegistry(root, installed) {
  mkdirSync(join(root, '.meta'), { recursive: true })
  writeFileSync(join(root, '.meta', 'registry.json'), JSON.stringify({ version: 1, installed }, null, 2))
}

/** 0.1.7 形状的假 presets：**没有 copy / 没有 remove**。 */
function fakePresets071({ brokenAfterRegister, duplicateOnRegister } = {}) {
  const calls = { register: [], resolve: [], disposed: [] }
  const registered = new Map()
  return {
    calls,
    register: async definition => {
      calls.register.push(definition)
      if (duplicateOnRegister) throw new Error(`Duplicate agent preset: ${definition.id}`)
      registered.set(definition.id, definition)
      return async () => { calls.disposed.push(definition.id); registered.delete(definition.id) }
    },
    resolve: async id => {
      calls.resolve.push(id)
      if (!registered.has(id)) throw new Error(`Unknown agent preset: ${id}`)
      return brokenAfterRegister ? { id, broken: brokenAfterRegister } : { id }
    },
  }
}

/** 0.1.7 形状的假 ctx：loader 里有一条已解析的 `preset-standard` 声明行。 */
function fakeCtx071({ rows, order = 1, viaEntries = false } = {}) {
  const standardRow = {
    options: {
      id: 'preset-standard',
      name: '@deepseek-ai/dsh-agent-preset',
      config: {
        id: 'standard',
        order,
        plugins: rows ?? [
          { id: 'persona', name: '@deepseek-ai/dsh-persona', config: { suffix: 'cwd is {{cwd}}', prefix: 'standard prefix' } },
          { id: 'agent-instructions', name: '@deepseek-ai/dsh-agent-instructions', config: { maxBytes: 65536 } },
          { id: 'tool-bash', name: '@deepseek-ai/dsh-tool-bash', disabled: { __jsExpr: 'process.platform === "win32"' } },
        ],
      },
    },
  }
  return {
    loader: {
      resolve: id => {
        if (viaEntries || id !== 'preset-standard') throw new Error(`cannot resolve entry ${id}`)
        return standardRow
      },
      entries: function* () { yield { options: { id: 'other', name: 'x' } }; yield standardRow },
    },
  }
}

// ---- 0. 形状判定 ------------------------------------------------------------
console.log('0. usesPresetDeclarations 形状判定 …')
assert.equal(usesPresetDeclarations({ register: async () => {}, resolve: async () => {} }), true, '0.1.7（有 register 无 copy）走声明模型')
assert.equal(usesPresetDeclarations({ copy: async () => {}, resolve: async () => {} }), false, '0.1.6（有 copy）走磁盘副本模型')
assert.equal(usesPresetDeclarations({ register: async () => {}, copy: async () => {}, resolve: async () => {} }), false, '同时存在时保守走 0.1.6')
assert.equal(usesPresetDeclarations(undefined), false, '没有 agentPresets 时不为声明模型')

// ---- 1. standard 声明行的取用 ------------------------------------------------
console.log('1. standardPresetDeclaration：从 loader 取已解析 config …')
{
  const config = standardPresetDeclaration(fakeCtx071())
  assert.equal(config.id, 'standard')
  assert.equal(config.plugins.length, 3, '拿到的是完整 rows（含 config）')
  // 约定行 id 不存在时，退化为遍历 entries
  const viaEntries = standardPresetDeclaration(fakeCtx071({ viaEntries: true }))
  assert.equal(viaEntries?.id, 'standard', '行 id 被改过时仍能靠遍历找到声明行')
  assert.equal(standardPresetDeclaration({ loader: { resolve: () => { throw new Error('x') }, entries: function* () {} } }), undefined)
  assert.equal(standardPresetDeclaration({}), undefined, '没有 loader 时返回 undefined（调用方据此报错）')
}

// ---- 2. 人设注入只动 persona 行 ----------------------------------------------
console.log('2. injectPersonaRows：只替换 persona 行的 config.prefix …')
{
  const rows = fakeCtx071().loader.resolve('preset-standard').options.config.plugins
  const out = injectPersonaRows(rows, '我是专家人设')
  assert.equal(out.find(r => r.id === 'persona').config.prefix, '我是专家人设', 'prefix 被换成专家人设')
  assert.equal(out.find(r => r.id === 'persona').config.suffix, 'cwd is {{cwd}}', '同行的 suffix 原样保留')
  assert.deepEqual(out.find(r => r.id === 'agent-instructions'), rows[1], '其它行逐字节不动')
  assert.deepEqual(out.find(r => r.id === 'tool-bash').disabled, { __jsExpr: 'process.platform === "win32"' }, '!!js 表达式原样带过去')
  assert.equal(rows.find(r => r.id === 'persona').config.prefix, 'standard prefix', '不修改入参（纯函数）')
  assert.throws(() => injectPersonaRows([{ id: 'tool-bash', name: '@deepseek-ai/dsh-tool-bash' }], 'x'), /persona/,
    '没有 persona 行必须抛错（宁可失败也不留没有人设的空壳）')
}

// ---- 3. 声明路径：0.1.7 假 presets（无 copy/remove） ---------------------------
console.log('3. ensureExpertPreset（0.1.7 声明模型）…')
{
  const root = makeRoot('declare')
  seedExpert(root, 'demo-expert')
  seedRegistry(root, {
    'expert/demo-expert': { kind: 'expert', name: 'demo-expert', displayName: '演示专家', description: '官方描述' },
  })
  const ctx = fakeCtx071()
  const presets = fakePresets071()
  ctx.agentPresets = presets

  const first = await ensureExpertPreset(ctx, { experts: join(root, 'experts'), registry: join(root, '.meta', 'registry.json') }, 'demo-expert')
  assert.equal(first.ok, true, `声明应成功：${first.error || ''}`)
  assert.equal(first.presetId, expertPresetId('demo-expert'))
  assert.equal(presets.calls.register.length, 1, 'register 恰好调用一次')

  const definition = presets.calls.register[0]
  assert.equal(definition.id, 'workbuddy-demo-expert', 'id = workbuddy-<专家名>（沿用既有约定，不能改，否则老会话失效）')
  assert.equal(definition.name, '演示专家', 'name 来自专家 plugin.json 的 displayName')
  assert.equal(definition.description, '官方描述', 'description 优先取注册表里的官方描述')
  assert.equal(definition.order, 101, 'order 排在官方 standard(1) 之后')
  assert.equal(definition.plugins.length, 3, 'plugins = standard 的完整 rows')
  assert.equal(definition.plugins.find(r => r.id === 'persona').config.prefix.includes('你是一位演示专家'), true,
    'persona 行带上了专家人设正文')

  // 幂等：第二次调用必须先 resolve 探活，且不得再 register（0.1.7 重复 register 会抛）
  const second = await ensureExpertPreset(ctx, { experts: join(root, 'experts'), registry: join(root, '.meta', 'registry.json') }, 'demo-expert')
  assert.equal(second.ok, true)
  assert.equal(presets.calls.register.length, 1, '重复调用不得再次 register')

  // 释放：声明方持有的 disposer 生效
  assert.equal(await disposeExpertPreset(ctx, first.presetId), true, 'disposeExpertPreset 应释放自己声明的预设')
  assert.deepEqual(presets.calls.disposed, ['workbuddy-demo-expert'])
  assert.equal(await disposeExpertPreset(ctx, first.presetId), false, '已释放过 → 不再假装成功（0.1.7 下没有 remove 可退）')

  // 释放后可以重新声明（热重载场景）
  const third = await ensureExpertPreset(ctx, { experts: join(root, 'experts'), registry: join(root, '.meta', 'registry.json') }, 'demo-expert')
  assert.equal(third.ok, true)
  assert.equal(presets.calls.register.length, 2, '释放后可重新声明（否则 HMR 会撞 Duplicate agent preset）')
  await disposeAllExpertPresets()
  assert.equal(presets.calls.disposed.length, 2, 'disposeAllExpertPresets 清空全部声明')
}

// ---- 4. 声明路径的失败/竞态分支 ----------------------------------------------
console.log('4. 失败与竞态：broken / Duplicate …')
{
  const root = makeRoot('broken')
  seedExpert(root, 'demo-expert')
  seedRegistry(root, {})
  const paths = { experts: join(root, 'experts'), registry: join(root, '.meta', 'registry.json') }

  // 4a) 声明成功但激活失败（broken）→ 必须回滚并报错，不能留一个坏预设
  const brokenPresets = fakePresets071({ brokenAfterRegister: 'rows do not mount' })
  const brokenCtx = fakeCtx071(); brokenCtx.agentPresets = brokenPresets
  const broken = await ensureExpertPreset(brokenCtx, paths, 'demo-expert')
  assert.equal(broken.ok, false)
  assert.match(broken.error, /不可用/, `broken 要如实报错：${broken.error}`)
  assert.equal(brokenPresets.calls.disposed.length, 1, 'broken 时必须释放刚声明的预设（否则重试会撞 Duplicate）')

  // 4b) 竞态：别人已经声明过同一 id → 视为既存成功，不报错、不重复持有 disposer
  const dupPresets = fakePresets071({ duplicateOnRegister: true })
  const dupCtx = fakeCtx071(); dupCtx.agentPresets = dupPresets
  const dup = await ensureExpertPreset(dupCtx, paths, 'demo-expert')
  assert.equal(dup.ok, true, 'Duplicate 竞态应视为已存在')
  assert.equal(await disposeExpertPreset(dupCtx, dup.presetId), false, '别人的声明不由我们释放')

  // 4c) loader 里没有 standard 声明 → 明确报错（而不是静默成功）
  const noStandardPresets = fakePresets071()
  const noStandardCtx = { agentPresets: noStandardPresets, loader: { resolve: () => { throw new Error('x') }, entries: function* () {} } }
  const noStandard = await ensureExpertPreset(noStandardCtx, paths, 'demo-expert')
  assert.equal(noStandard.ok, false)
  assert.match(noStandard.error, /standard/, `找不到 standard 要说明：${noStandard.error}`)

  // 4d) 人设不可用（专家没装）→ 如实报错
  const missingCtx = fakeCtx071(); missingCtx.agentPresets = fakePresets071()
  const missing = await ensureExpertPreset(missingCtx, paths, 'not-installed')
  assert.equal(missing.ok, false)
  assert.match(missing.error, /人设不可用/)
}

// ---- 5. 0.1.6 形状仍然可走（不回归生产现版本） --------------------------------
console.log('5. 0.1.6 形状（有 copy）不被误判为声明模型 …')
{
  const root = makeRoot('legacy')
  seedExpert(root, 'demo-expert')
  seedRegistry(root, {})
  const calls = { copy: [] }
  const legacy = {
    resolve: async () => { throw new Error('not found') },
    copy: async (...args) => { calls.copy.push(args); throw new Error('legacy copy path reached') },
  }
  const ctx = { agentPresets: legacy, loader: { resolve: () => { throw new Error('x') }, entries: function* () {} } }
  const result = await ensureExpertPreset(ctx, { experts: join(root, 'experts'), registry: join(root, '.meta', 'registry.json') }, 'demo-expert')
  assert.equal(calls.copy.length, 1, '0.1.6 形状必须继续走 copy（生产现在仍是 0.1.6）')
  assert.equal(result.ok, false)
  assert.match(result.error, /创建专家预设失败/, 'copy 失败要如实转述')
}

// ---- 6. 会话 cwd：DSH_HOME 派生 -------------------------------------------------
console.log('6. dshHomeRoot：$DSH_HOME 优先、空白视为未设置 …')
{
  assert.equal(dshHomeRoot({ DSH_HOME: '/srv/dsh' }), '/srv/dsh')
  assert.equal(dshHomeRoot({ DSH_HOME: '   ' }), join(homedir(), '.dsh'), '全空白等于未设置（照抄上游语义）')
  assert.equal(dshHomeRoot({}), join(homedir(), '.dsh'))
  assert.equal(dshHomeRoot({ DSH_HOME: '~/custom' }), join(homedir(), 'custom'), '支持 ~ 展开')
}

// ---- 7. 会话 cwd：代际无关 + 最新代际优先 ---------------------------------------
console.log('7. sessionLogsNewestFirst + readSessionCwdFromDisk …')
{
  const writeZstdSession = (file, payload) => {
    const line = `${JSON.stringify(payload)}\n`
    execSync(`printf '%s' ${JSON.stringify(line)} | zstd -q -f -o '${file}'`)
  }
  const home = makeRoot('home')
  const dir = join(home, 'sessions', '--proj--', 'session-abc123')
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'session.v3.jsonl.zstd'), 'x')          // 旧代际（内容无效，只为排位）
  writeFileSync(join(dir, 'session.v4.jsonl'), 'plain')           // 明文新代际
  writeFileSync(join(dir, 'notes.txt'), 'ignore me')

  const ordered = sessionLogsNewestFirst(dir).map(row => `${row.version}:${row.zstd ? 'zstd' : 'plain'}`)
  assert.deepEqual(ordered, ['4:plain', '3:zstd'], 'v4 在前（v4 是 v3 的后继：新事件写 v4，v3 只是天然备份）')

  // 真读：v4（zstd）+ v3 同时存在 → 取 v4 的 cwd（这正是升级后会写的那一代）
  writeZstdSession(join(dir, 'session.v4.jsonl.zstd'), { type: 'session', version: 4, cwd: '/from/v4' })
  writeZstdSession(join(dir, 'session.v3.jsonl.zstd'), { type: 'session', version: 3, cwd: '/from/v3' })
  assert.equal(readSessionCwdFromDisk('session-abc123', { DSH_HOME: home }), '/from/v4',
    '两代同时存在时读最新代际（v4）')

  // 只有 v3（未升级过的老会话）仍要能读 —— 向后兼容
  const home3 = makeRoot('home3')
  const dir3 = join(home3, 'sessions', '--proj--', 'session-old999')
  mkdirSync(dir3, { recursive: true })
  writeZstdSession(join(dir3, 'session.v3.jsonl.zstd'), { type: 'session', version: 3, cwd: '/only/v3' })
  assert.equal(readSessionCwdFromDisk('session-old999', { DSH_HOME: home3 }), '/only/v3', '只有 v3 的老会话照常可读')

  // 明文（无 .zstd）也要能读
  const homePlain = makeRoot('homePlain')
  const dirPlain = join(homePlain, 'sessions', '--proj--', 'session-plain555')
  mkdirSync(dirPlain, { recursive: true })
  writeFileSync(join(dirPlain, 'session.v4.jsonl'), `${JSON.stringify({ type: 'session', version: 4, cwd: '/plain/v4' })}\n`)
  assert.equal(readSessionCwdFromDisk('session-plain555', { DSH_HOME: homePlain }), '/plain/v4', '明文 .jsonl 同样可读')

  // 最高代际损坏 → 退到下一代（不能因为一个坏文件就整条读不到）
  const homeBroken = makeRoot('homeBroken')
  const dirBroken = join(homeBroken, 'sessions', '--proj--', 'session-brk777')
  mkdirSync(dirBroken, { recursive: true })
  writeFileSync(join(dirBroken, 'session.v4.jsonl.zstd'), 'not a zstd stream')
  writeZstdSession(join(dirBroken, 'session.v3.jsonl.zstd'), { type: 'session', version: 3, cwd: '/fallback/v3' })
  assert.equal(readSessionCwdFromDisk('session-brk777', { DSH_HOME: homeBroken }), '/fallback/v3',
    'v4 读不出来时要退到 v3，而不是返回空')

  // 非法会话 id / 不存在的会话 → 空串（不抛）
  assert.equal(readSessionCwdFromDisk('../etc/passwd', { DSH_HOME: home }), '')
  assert.equal(readSessionCwdFromDisk('session-nope', { DSH_HOME: home }), '')
  assert.equal(readSessionCwdFromDisk('session-abc123', { DSH_HOME: join(home, 'missing') }), '', '目录不存在也不抛')
}

console.log('ALL 0.1.7 ADAPTATION TESTS PASSED')
