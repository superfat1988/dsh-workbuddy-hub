// Render-level smoke test: every slot component the browser half registers must
// survive a server render, and every hub.js symbol a source file uses must be
// imported by it. These two checks exist because undefined identifiers inside a
// component (setBusy, setNotice, onMarketRequest) shipped three times and each
// time silently broke a surface — the picker disappearing entirely was the last.
// Third: the settings "installed" list remove flow (inline confirm, secondary
// danger button, failure reason) is pinned by source/CSS assertions, plus a real
// unit test of its pure notice function via esbuild.
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import vm from 'node:vm'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { build } from 'esbuild'

let registration = null
const slots = []
const sandbox = {
  window: { __ModuleLoader__: { load: r => { registration = r } } },
  document: { createElement: () => ({ setAttribute() {}, style: {}, appendChild() {} }), head: { appendChild() {} } },
  console, setTimeout, clearTimeout,
  fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve({}), text: () => Promise.resolve('') }),
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
}
vm.runInNewContext(readFileSync(new URL('./client.js', import.meta.url), 'utf8'), sandbox, { filename: 'client.js' })

const plugin = registration.factory(name => {
  if (name === 'react' || name === 'react/jsx-runtime') return React
  throw new Error(`unexpected browser require: ${name}`)
})
plugin.apply({
  get: () => undefined,
  slots: {
    inject: (name, fn) => fn(),
    register: (options, component) => { slots.push({ options, component }) },
  },
})

assert.ok(slots.length >= 5, 'expected the five registered surfaces')
const props = { sessionId: 'session-smoke', onKind() {}, onQuery() {}, onDetail() {}, onAction() {}, installed: {}, mounted: new Set(), busy: '' }
// The plugin is browser-only, so components legitimately use useLayoutEffect;
// React's server renderer warns about that and the warning is not a defect.
const realError = console.error
console.error = (...args) => {
  if (String(args[0]).includes('useLayoutEffect does nothing on the server')) return
  realError(...args)
}
try {
  for (const { options, component } of slots) {
    const label = `${options.name}#${options.id ?? options.key ?? ''}`
    try {
      renderToString(React.createElement(component, props))
    } catch (error) {
      assert.fail(`${label} threw during render: ${String(error?.message || error)}`)
    }
  }
} finally { console.error = realError }

// hub.js import completeness: a symbol used in a file must be imported there.
const hubSource = readFileSync(new URL('./src/hub.js', import.meta.url), 'utf8')
const exports = new Set(
  [...hubSource.matchAll(/export\s+(?:async\s+)?(?:function|const|let)\s+([A-Za-z_$][\w$]*)/g)].map(m => m[1]),
)
assert.ok(exports.size > 0, 'hub.js exports not detected')
for (const file of readdirSync(new URL('./src', import.meta.url)).filter(f => (f.endsWith('.jsx') || f.endsWith('.js')) && f !== 'hub.js')) {
  const text = readFileSync(new URL(`./src/${file}`, import.meta.url), 'utf8')
  // 支持多行 import：取 "from './hub.js'" 之前整段导入子句
  const marker = text.indexOf("from './hub.js'")
  const importLine = marker < 0 ? '' : text.slice(Math.max(0, marker - 600), marker)
  const body = text.split('\n').filter(l => !l.includes("from './hub.js'")).join('\n')
    // Strip comments and string literals so a mention inside a message never
    // counts as identifier usage.
    .replace(/\/\/[^\n]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/'(?:[^'\\]|\\.)*'/g, "''")
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')
    .replace(/`(?:[^`\\]|\\.)*`/g, '``')
  for (const name of exports) {
    // 用作标识符才算「用了」：className 字符串（如 wbh-authState）已在上面剥掉，
    // 这里再排除连字符前缀形态，防止 CSS 类名残段误判成标识符使用。
    const used = new RegExp(`(^|[^\\w$.\\-])${name}\\b`).test(body)
    if (!used) continue
    assert.ok(new RegExp(`[{,\\s]${name}[,}\\s]`).test(importLine), `${file} uses hub.${name} without importing it`)
  }
}

// ---- 设置区「已安装」列表的逐项移除：源码/CSS 契约 ---------------------------
// 交互态（点「移除」→ 行内确认 → hub.uninstall）没有 DOM 测试环境（仓库不依赖
// jsdom / testing-library），所以这里把**不可回退的契约**钉在源码与产物上：
// 二次确认必须是行内的、失败必须带原因、危险按钮必须是次要样式、键盘可达。
const settingsSrc = readFileSync(new URL('./src/SettingsPage.jsx', import.meta.url), 'utf8')
// 只看代码：注释里提到 window.confirm（说明「不用它」）不算违规
const settingsCode = settingsSrc.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')
assert.ok(settingsSrc.includes('hub.uninstall('), 'the installed list must be able to uninstall an entry')
assert.ok(!settingsCode.includes('window.confirm'), 'the confirmation must be inline, never window.confirm')
assert.ok(!/\bconfirm\s*\(/.test(settingsCode.replace(/setConfirmKey|confirmKey|confirmRef|onConfirm/g, '')),
  'no global confirm() call may remain in the settings page')
assert.ok(settingsSrc.includes('确认移除'), 'the inline confirm state must be rendered in the row')
assert.ok(settingsSrc.includes("event.key === 'Escape'"), 'Escape must cancel the inline confirmation')
assert.ok(settingsSrc.includes('aria-label={`移除 ${label}`}'), 'the remove button needs an aria-label with the entry name')
assert.ok(settingsSrc.includes('aria-label={`确认移除 ${label}`}'), 'the confirm button needs an aria-label with the entry name')
assert.ok(settingsSrc.includes('aria-label={`取消移除 ${label}`}'), 'the cancel button needs an aria-label with the entry name')
assert.ok(/className="wbh-btnGhost wbh-removeBtn"/.test(settingsSrc),
  'the remove button must use the secondary (ghost) style, not the primary colour')
assert.ok(settingsSrc.includes('uninstallNotice'), 'the uninstall result must be surfaced as a user-visible notice')
assert.ok(settingsSrc.includes('status: error?.status'), 'a failed removal must carry the host reason/status into the notice')
// 连接器/专家的影响面必须写进文案（先停用再删 / 从会话中移除）
assert.ok(settingsSrc.includes('先停用再删除'), 'connector copy must say it disables before deleting')
assert.ok(settingsSrc.includes('从会话中移除'), 'expert copy must say the session mounts are pruned')
// 卸载主键必须取 registry 的 `${kind}/${name}`（官方技能的 record.name 是包目录名）
assert.ok(settingsSrc.includes('Object.entries(installed)'), 'entries must come from the registry map, not its values')

// 样式必须落在 src/app.css（wbh- 前缀）并真的进了产物
const appCss = readFileSync(new URL('./src/app.css', import.meta.url), 'utf8')
for (const cls of ['.wbh-installedRow{', '.wbh-installedActions{', '.wbh-removeBtn{', '.wbh-confirmRow{', '.wbh-btnDanger{', '.wbh-removeNotice{', '.wbh-removeNotice.is-error{']) {
  assert.ok(appCss.includes(cls), `app.css must define ${cls}`)
}
assert.ok(!/wbh-btnDanger|wbh-confirmRow|wbh-removeNotice/.test(
  readFileSync(new URL('./src/official.css', import.meta.url), 'utf8')), 'plugin styles must never be added to official-*.css')
const builtClient = readFileSync(new URL('./client.js', import.meta.url), 'utf8')
assert.ok(builtClient.includes('wbh-btnDanger'), 'the built client must carry the new settings styles')
assert.ok(builtClient.includes('aria-label'), 'the built client must carry the accessible labels')

// ---- 「检查更新 / 一键更新」：源码与 CSS 契约（语义纪律必须写在代码里）--------
assert.ok(settingsSrc.includes('hub.updates('), '检查更新必须调宿主只读路由 /updates')
assert.ok(settingsSrc.includes('aria-label="检查更新"'), '检查更新按钮需要 aria-label')
assert.ok(settingsSrc.includes('aria-busy'), '检查中/更新中必须有可感知的忙碌态（aria-busy）')
assert.ok(settingsSrc.includes('无法检查'), '查不到时必须显示「无法检查」，而不是「已是最新」')
assert.ok(settingsSrc.includes('全部更新'), '存在有更新项时必须提供「全部更新」入口')
assert.ok(settingsSrc.includes('总下载量'), '「全部更新」确认时必须显示总下载量')
assert.ok(settingsSrc.includes("entry.record.source === 'official' ? 'official' : undefined"),
  '更新必须复用安装链路：官方专家传 source=official')
assert.ok(!settingsSrc.includes('sources.mirror'),
  '官方是唯一真源：设置区不得再读镜像源状态（/updates 的 sources 只有 official）')
for (const cls of ['.wbh-badgeUpdate{', '.wbh-badgeCurrent{', '.wbh-badgeUnknown{', '.wbh-updateBar{', '.wbh-updateWarn{', '.wbh-updateBtn,']) {
  assert.ok(appCss.includes(cls), `app.css must define ${cls}`)
}
assert.ok(!/wbh-badgeUpdate|wbh-updateBar/.test(
  readFileSync(new URL('./src/official.css', import.meta.url), 'utf8')), 'plugin styles must never be added to official-*.css')
assert.ok(builtClient.includes('wbh-badgeUpdate'), 'the built client must carry the update badge styles')

// ---- 移除流程的纯逻辑：uninstallNotice（真单测，不是字符串断言）--------------
// SettingsPage.jsx 是 JSX，node 不能直接 import；用构建脚本同款的 esbuild
// （devDependency）把它编成 ESM 后 import 一次，这样「卸载结果 → 用户看到的文案」
// 这条规则有真正的行为覆盖：成功分类型、失败必须带原因与状态码、无原因也不静默。
// 产物落在 node_modules/.cache 下（node 才能解析 react 这类裸导入），跑完即删。
{
  const repoDir = fileURLToPath(new URL('.', import.meta.url))
  const cacheDir = join(repoDir, 'node_modules', '.cache', 'wbh-settings-test')
  mkdirSync(cacheDir, { recursive: true })
  process.on('exit', () => { try { rmSync(cacheDir, { recursive: true, force: true }) } catch { /* 忽略 */ } })
  const outFile = join(cacheDir, 'settings.mjs')
  await build({
    entryPoints: [join(repoDir, 'src', 'SettingsPage.jsx')],
    bundle: true, format: 'esm', platform: 'node', jsx: 'transform',
    external: ['react', 'react-dom', 'qrcode'], outfile: outFile, logLevel: 'silent',
  })
  const {
    uninstallNotice, InstalledRow, humanBytes, updatesSizeLabel,
    updateFailureReason, updateNotice, statusBadge, checkSummaryText,
  } = await import(pathToFileURL(outFile).href)
  assert.equal(typeof uninstallNotice, 'function', 'uninstallNotice must be exported for direct unit testing')
  assert.equal(typeof InstalledRow, 'function', 'InstalledRow must be exported for real render coverage')

  assert.deepEqual(uninstallNotice('connector', 'Demo', { ok: true }),
    { ok: true, text: '已移除连接器「Demo」（已先停用再删除）' }, '连接器：文案要点明先停用再删')
  assert.deepEqual(uninstallNotice('expert', 'Demo', { ok: true }),
    { ok: true, text: '已移除专家「Demo」，并已从会话中移除挂载' }, '专家：文案要点明会话挂载已摘除')
  assert.deepEqual(uninstallNotice('skill', 'Demo', { ok: true }),
    { ok: true, text: '已移除技能「Demo」' })

  const notInstalled = uninstallNotice('expert', 'Demo', { ok: false, error: 'not installed', status: 404 })
  assert.equal(notInstalled.ok, false)
  assert.ok(notInstalled.text.includes('not installed') && notInstalled.text.includes('404'),
    '失败必须原样带上宿主的原因与状态码（404 未安装）')
  const disableFailed = uninstallNotice('connector', 'Demo', { ok: false, error: 'transport still alive', status: 500 })
  assert.ok(disableFailed.text.includes('transport still alive'), '连接器停用失败的原因不得被吞掉')
  assert.ok(uninstallNotice('expert', 'Demo', { ok: false }).text.includes('宿主未返回原因'),
    '宿主没给原因时也要明说，不能静默')

  // 两种行状态都真渲染一遍：空闲态「移除」、确认态「确认移除？[移除][取消]」
  const rowEntry = {
    key: 'connector/demo', kind: 'connector', name: 'demo',
    record: { displayName: '演示连接器', files: 3, mcp: true, source: 'official' },
  }
  const rowProps = {
    entry: rowEntry, busy: false, confirmRef: { current: null },
    onAskRemove() {}, onCancel() {}, onConfirm() {},
  }
  const idleRow = renderToString(React.createElement(InstalledRow, { ...rowProps, confirming: false }))
  assert.ok(idleRow.includes('aria-label="移除 演示连接器"'), '空闲态按钮必须带条目名的 aria-label')
  assert.ok(idleRow.includes('wbh-btnGhost wbh-removeBtn'), '移除按钮必须是次要（ghost）样式')
  assert.ok(!idleRow.includes('wbh-btnPrimary'), '危险动作不得使用主色按钮')
  assert.ok(idleRow.includes('演示连接器') && idleRow.includes('connector'), '行内必须显示条目名与类型')

  const confirmRow = renderToString(React.createElement(InstalledRow, { ...rowProps, confirming: true }))
  assert.ok(confirmRow.includes('确认移除？'), '确认态必须是行内文案，而不是 window.confirm')
  assert.ok(confirmRow.includes('aria-label="确认移除 演示连接器"'), '确认按钮的 aria-label 必须含条目名')
  assert.ok(confirmRow.includes('aria-label="取消移除 演示连接器"'), '取消按钮的 aria-label 必须含条目名')
  assert.ok(confirmRow.includes('wbh-btnDanger'), '确认按钮用危险样式（仍是次要按钮，不是主色）')
  assert.ok(!confirmRow.includes('wbh-btnPrimary'), '确认态也不得出现主色按钮')
  assert.ok(confirmRow.includes('先停用再删除'), '连接器确认文案必须点明「先停用再删除」')
  assert.ok(!confirmRow.includes('aria-label="移除 演示连接器"'), '确认态不再显示空闲态的单个移除按钮')

  // ---- 「检查更新 / 更新」：状态徽标、行内确认、失败分类（真行为覆盖）----------
  // 语义纪律：unknown 只能是「无法检查」，绝不能渲染成「已是最新」。
  assert.equal(statusBadge('update').text, '有更新')
  assert.equal(statusBadge('current').text, '已是最新')
  assert.equal(statusBadge('unknown').text, '无法检查')
  assert.equal(statusBadge(undefined), null, '还没检查过就不显示任何徽标')

  const updateRow = renderToString(React.createElement(InstalledRow, {
    ...rowProps, status: { status: 'update', remoteBytes: 9.8 * 1024 * 1024, reason: '3 个文件内容已变化' },
  }))
  assert.ok(updateRow.includes('有更新'), '有更新的行必须显示徽标')
  assert.ok(updateRow.includes('aria-label="更新 演示连接器"'), '更新按钮的 aria-label 必须含条目名')
  assert.ok(updateRow.includes('aria-label="移除 演示连接器"'), '同一行必须能同时看到「更新」与「移除」')
  assert.ok(!updateRow.includes('wbh-btnPrimary'), '行内动作一律次要样式（更新也是）')

  const currentRow = renderToString(React.createElement(InstalledRow, { ...rowProps, status: { status: 'current' } }))
  assert.ok(currentRow.includes('已是最新'), '官方 version/updatedAt/defHash 相同 → 已是最新')
  assert.ok(!currentRow.includes('aria-label="更新 演示连接器"'), '已是最新不显示更新按钮')

  const unknownRow = renderToString(React.createElement(InstalledRow, {
    ...rowProps, status: { status: 'unknown', reason: '缺少安装时记录的官方 MCP 定义哈希（officialMeta.defHash），重装一次即可记录' },
  }))
  assert.ok(unknownRow.includes('无法检查'), '取不到官方元数据 → 无法检查')
  assert.ok(unknownRow.includes('officialMeta.defHash'), '无法检查必须把原因带给用户（tooltip + aria-label）')
  assert.ok(!unknownRow.includes('已是最新'), '查不到时绝不能显示「已是最新」')
  assert.ok(!unknownRow.includes('aria-label="更新 演示连接器"'), '无法检查时不得提供「更新」')

  const updateConfirmRow = renderToString(React.createElement(InstalledRow, {
    ...rowProps, status: { status: 'update', remoteBytes: 1024 * 1024 },
    updateConfirming: true, updateBusy: false, updateConfirmRef: { current: null },
  }))
  assert.ok(updateConfirmRow.includes('确认更新？'), '更新也要行内二次确认，不用 window.confirm')
  assert.ok(updateConfirmRow.includes('下载') && updateConfirmRow.includes('1.0 MB'),
    '确认态必须显示这次要下载多少（React 会在相邻文本节点间插注释，所以分两段断言）')
  assert.ok(updateConfirmRow.includes('aria-label="确认更新 演示连接器"'))
  assert.ok(updateConfirmRow.includes('aria-label="取消更新 演示连接器"'))
  assert.ok(!updateConfirmRow.includes('确认移除？'), '更新与移除的确认态必须互斥')

  // 下载量格式化 + 失败分类（限流 / 断网 / 安装失败必须区分开）
  assert.equal(humanBytes(9.8 * 1024 * 1024), '9.8 MB')
  assert.equal(humanBytes(2048), '2.0 KB')
  assert.equal(humanBytes(0), '0 B')
  assert.equal(humanBytes(undefined), '0 B')
  assert.equal(updatesSizeLabel([{ remoteBytes: 1024 * 1024 }, { remoteBytes: 2 * 1024 * 1024 }]), '3.0 MB')
  assert.ok(updatesSizeLabel([{ bytes: 1024 }]).startsWith('约 '), '官方专家没有远端清单 → 总下载量标「约」')
  // 回归（实测踩到）：页面上的行对象把 /updates 的判定挂在 row.status 上，不是行本身。
  // 旧实现只读 entry.remoteBytes，于是真实要下 9.4MB 时确认文案显示成「约 0 B」。
  assert.equal(updatesSizeLabel([{ status: { remoteBytes: 9 * 1024 * 1024 } }]), '9.0 MB', '行形状（status.remoteBytes）必须能取到远端字节数')
  assert.ok(updatesSizeLabel([{ status: { bytes: 2048 } }]).startsWith('约 '), '行形状缺远端清单时退回本地并标「约」')
  assert.equal(
    updatesSizeLabel([{ status: { remoteBytes: 1024 * 1024 } }, { remoteBytes: 1024 * 1024 }]),
    '2.0 MB', '裸条目与行形状混用也要算对')
  assert.equal(updatesSizeLabel([{ status: { remoteBytes: 0 }, bytes: 1024 * 1024 }]), '约 1.0 MB', '远端字节为 0 时退回本地估算')
  assert.ok(updateFailureReason({ message: 'tree api 403' }).includes('限流'))
  assert.ok(updateFailureReason({ message: 'fetch failed' }).includes('网络不可达'))
  const installFail = updateFailureReason({ message: 'landEntry failed', status: 500 })
  assert.ok(installFail.includes('安装失败') && installFail.includes('500'), '安装失败必须带 HTTP 状态')
  assert.equal(updateNotice('expert', '演示', { ok: true }).text, '已更新专家「演示」')
  assert.equal(updateNotice('expert', '演示', { ok: false, message: 'tree api 403' }).ok, false)
  const failedSummary = checkSummaryText({ ok: false, error: '接口限流：tree api 403' }, false)
  assert.ok(failedSummary.includes('检查失败'), '整次检查失败要明说失败')
  assert.ok(!failedSummary.includes('已是最新'), '检查失败绝不能给出「已是最新」的结论')
  assert.ok(checkSummaryText(null, true).includes('正在检查'))
  assert.ok(checkSummaryText(null, false).includes('尚未检查'))

  // ---- 技能页 / 连接器页的登录引导：真渲染（不是字符串断言）----------------
  // 技能目录与技能包下载都需要账号；此前只有连接器页有就地登录卡，技能页只显示
  // 「暂无技能」，用户看不出该去登录。这里把 Catalogue 与 hub 一起编出来，用真实
  // 登录态（authState 缓存）驱动渲染，断言四个面：未登录技能页出卡、picker 不出卡、
  // 已登录不出卡、stale 出「重新扫码」卡，且连接器页既有文案没被破坏。
  const catEntry = join(cacheDir, 'catalogue-entry.jsx')
  writeFileSync(catEntry, [
    `export { default as Catalogue } from ${JSON.stringify(join(repoDir, 'src', 'Catalogue.jsx'))}`,
    `export * as hub from ${JSON.stringify(join(repoDir, 'src', 'hub.js'))}`,
  ].join('\n'))
  const catOut = join(cacheDir, 'catalogue.mjs')
  await build({
    entryPoints: [catEntry],
    bundle: true, format: 'esm', platform: 'node', jsx: 'transform',
    external: ['react', 'react-dom', 'qrcode'], outfile: catOut, logLevel: 'silent',
  })
  const { Catalogue, hub: bundledHub } = await import(pathToFileURL(catOut).href)
  const pageProps = {
    sessionId: 'session-gate', onKind() {}, onQuery() {}, onDetail() {}, onAction() {},
    installed: {}, mounted: new Set(), busy: '', variant: 'page',
  }
  const setAuth = async payload => {
    const realFetch = globalThis.fetch
    globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => payload })
    try { await bundledHub.refreshAuth() } finally { globalThis.fetch = realFetch }
  }
  await setAuth({ configured: false })
  const skillPage = renderToString(React.createElement(Catalogue, { ...pageProps, kind: 'skill' }))
  assert.ok(skillPage.includes('技能目录与技能包下载需要 WorkBuddy 账号'),
    '未登录的技能页必须就地显示登录卡，并说明为什么需要登录')
  assert.ok(!skillPage.includes('暂无技能'), '未登录的技能页不得显示「暂无技能」空白态')
  const connPage = renderToString(React.createElement(Catalogue, { ...pageProps, kind: 'connector' }))
  assert.ok(connPage.includes('连接器目录、账号绑定与授权需要 WorkBuddy 账号'),
    '连接器页既有登录卡行为不得被破坏')
  const pickerSkill = renderToString(React.createElement(Catalogue, { ...pageProps, kind: 'skill', variant: 'picker' }))
  assert.ok(!pickerSkill.includes('技能目录与技能包下载需要 WorkBuddy 账号'),
    'picker 不得被加上登录卡（footer 登录行已覆盖三个面板）')
  await setAuth({ configured: true, stale: false })
  const loggedInSkill = renderToString(React.createElement(Catalogue, { ...pageProps, kind: 'skill' }))
  assert.ok(!loggedInSkill.includes('技能目录与技能包下载需要 WorkBuddy 账号'),
    '已登录（且未 stale）时技能页不得再显示登录卡')
  await setAuth({ configured: true, stale: true })
  const staleSkill = renderToString(React.createElement(Catalogue, { ...pageProps, kind: 'skill' }))
  assert.ok(staleSkill.includes('登录已失效，请重新扫码'),
    '已登录但凭证失效（stale）时技能页要与连接器页一样提示重新扫码')

  rmSync(cacheDir, { recursive: true, force: true })
}

// ---- 技能页未登录也必须走登录引导（与连接器页一致，picker 不动）--------------
// 技能目录与技能包下载都需要账号；此前只有连接器页有就地登录卡，技能页只会显示
// 「暂无技能」，用户看不出该去登录。
const catalogueSrc = readFileSync(new URL('./src/Catalogue.jsx', import.meta.url), 'utf8')
assert.ok(catalogueSrc.includes("const pageLoginGate = (variant === 'page' && kind === 'skill')"),
  '技能页仍必须用就地登录卡挡住列表（技能数据全部需要账号）')
assert.ok(catalogueSrc.includes('connectorLoginBanner'),
  '连接器页未登录时应显示说明卡而不是把列表整块挡掉（桌面公开目录不需要登录）')
assert.ok(catalogueSrc.includes('{connectorLoginBanner}') && catalogueSrc.includes("kind === 'connector' && auth !== null"),
  '连接器未登录说明卡必须真的渲染进列表分支（不是死代码）')
assert.ok(catalogueSrc.includes('技能目录与技能包下载需要 WorkBuddy 账号'),
  '技能页登录卡要说清为什么需要登录')
assert.ok(catalogueSrc.includes('pageLoginGate || skillDetailView'),
  '登录卡必须真的渲染进页面主体（不是死代码）')
assert.ok(!catalogueSrc.includes('connectorLoginGate'),
  '旧的「仅连接器」登录卡不得残留（否则技能页会漏掉引导）')
assert.ok(catalogueSrc.includes('STALE_LOGIN_REASON'),
  '已登录但凭证失效（stale）时必须与连接器页同样处理')

// ---- 桌面端公开目录来源必须可见、且不可自动接入的行不能给「连接」按钮 ----
// 连接器目录现在是「官方注册表 ∪ 桌面公开目录」双来源：来源不标出来，用户会把
// 桌面目录条目当成账号已授权的官方条目；stdio/CLI 行若还能点「连接」，就会走到
// 宿主侧 400 才失败（甚至误以为可用）。
assert.ok(catalogueSrc.includes('connector-card-badge') && catalogueSrc.includes("entry.source === 'desktop'"),
  '桌面目录来源必须在卡片上标出来')
assert.ok(catalogueSrc.includes('unsupportedReason') && catalogueSrc.includes('disabled={busy === key || Boolean(unsupported)}'),
  '不可自动接入（stdio/CLI）的连接器必须禁用连接按钮并显示原因')
assert.ok(catalogueSrc.includes('desktop.supported === false'),
  '不可自动接入的判定必须读宿主给的 desktop.supported（不自行猜测）')
// 真机缺陷（2026-10-07）：来源说明里的「已去重 N 条」渲染条件写好了，但 setSourceCounts
// 没有把 duplicates 接进去 → 条件永远 false，界面上看不到去重数量。渲染与接线必须成对断言。
assert.ok(catalogueSrc.includes('duplicates: r.desktopDuplicates ?? 0'),
  '「已去重条数」必须真的接进 setSourceCounts（只留渲染条件 = 永远不显示）')
// 真机缺陷（2026-10-07，生产实测）：未绑定的连接器一律先走官方账号绑定，
// 桌面目录里的连接器大多不在官方注册表（点 QQ邮箱 报 `connector not found: qq-mail`），
// 于是永远到不了安装/启用。桌面行必须「装 → 启用 →（需要授权才）发起 OAuth」。
assert.ok(catalogueSrc.includes("hub.connectorInstall(entry.name, 'desktop')"),
  '桌面目录来源的连接器必须带 source=desktop 安装')
// 用户预期（2026-10-07）：点「连接」应当**先弹授权/登录窗**，授权完成后再建连。
// 桌面目录有三种鉴权家族，必须按家族分派，不能一律「先装再启用」：
//   ① 声明了 ${VAR} → 先要凭据  ② 网关/账号侧鉴权 → 先发起官方 OAuth
//   ③ 官方账号侧不认这条（17008）→ 才回落本地装+启用并如实报错
assert.ok(catalogueSrc.includes('customRefs.length > 0'),
  '用户凭据家族（${VAR}）必须先要凭据，不能直接尝试建连')
// 生产实测：await 之后再 window.open 会被浏览器拦（授权页没弹出来，只剩链接）。
// 必须在用户手势的同步阶段预开空窗，拿到 URL 再写地址。
assert.ok(catalogueSrc.includes("window.open('about:blank', '_blank')") && catalogueSrc.includes('closeAuthWindow'),
  'MCP/官方 OAuth 都要同步预开窗并在失败路径关掉（否则弹窗被拦）')
assert.ok(catalogueSrc.includes('hub.connectorAuthStart(entry.name)'),
  '网关/账号侧鉴权家族必须先发起官方授权（登录窗），授权完成后再连接')
assert.ok(catalogueSrc.includes('官方账号侧不认这条连接器'),
  '官方不认这条连接器时要如实说明为什么跳过了授权窗')
// MCP OAuth 的跨机兜底：授权页开在别的机器时 loopback 回调收不到，必须能手动粘贴回调链接
assert.ok(catalogueSrc.includes('mcpOauthPaste') && catalogueSrc.includes('hub.mcpOauthComplete'),
  'MCP OAuth 必须有「粘贴回调链接」兜底（渲染与 API 都要接线）')
assert.ok(readFileSync(new URL('./client.js', import.meta.url), 'utf8').includes('mcpOauthComplete'),
  '构建产物必须包含 MCP OAuth 兜底接线（改完 src 记得 npm run build:client）')
// 生产实测（2026-10-08）：先授权后安装 → `mcp-oauth/start` 读不到本地 mcp.json 一律 404，
// 「任意连接」都起不来；预开的 about:blank 也没在失败路径关掉（用户看到空白页）。
assert.ok(catalogueSrc.includes("await hub.connectorInstall(entry.name, 'desktop')") &&
  catalogueSrc.indexOf("await hub.connectorInstall(entry.name, 'desktop')") < catalogueSrc.indexOf('hub.mcpOauthStart(entry.name)'),
  '桌面来源必须先安装、再发起授权（mcp-oauth/start 需要本地 mcp.json）')
assert.ok(catalogueSrc.includes('const enableOnly') && catalogueSrc.includes('closeAuthWindow()'),
  '安装/授权分离：enableOnly 独立，且失败路径必须关掉预开的空窗')
assert.ok(catalogueSrc.includes('desktopDirect'),
  '桌面目录里的直连型连接器不应被 WorkBuddy 登录门拦住（它们不需要账号凭据）')
const hubSrc = readFileSync(new URL('./src/hub.js', import.meta.url), 'utf8')
assert.ok(hubSrc.includes('x.source ?? r.source'),
  '连接器来源必须按行判定（整表 source 一刀切会把桌面行误当官方条目去装）')
const marketPageSrc = readFileSync(new URL('./src/MarketPage.jsx', import.meta.url), 'utf8')
assert.ok(marketPageSrc.includes("entry.source === 'desktop' ? 'desktop'"),
  '安装必须把 desktop 来源透传给宿主（否则官方查无此条只能靠宿主兜底）')
assert.ok(readFileSync(new URL('./client.js', import.meta.url), 'utf8').includes('duplicates: r.desktopDuplicates'),
  '构建产物必须包含「已去重条数」接线（改完 src 记得 npm run build:client，否则界面与源码不一致）')
assert.ok(readFileSync(new URL('./client.js', import.meta.url), 'utf8').includes('connector-card-badge'),
  '构建产物 client.js 必须包含新的来源徽标（改完 src 记得 npm run build:client）')

// ---- 连接器 chip 的官方 MCP 图标：源码/渲染契约 --------------------------------
// 官方效果：输入框下方的已加载连接器 chip 显示注册表的 `icon`（远端 URL）。
// 纪律：加载失败（断网 / CSP / 404）必须优雅回退成原文字 chip，绝不出现破图；
// 且只影响连接器 —— 专家/技能的 icon 字段语义不同，不得被牵连改掉。
const railSrc = readFileSync(new URL('./src/AttachedRail.jsx', import.meta.url), 'utf8')
assert.ok(railSrc.includes('onError={() => setBroken(true)}'),
  '连接器图标加载失败必须走 React 状态回退（onError → broken → 通用图标）')
assert.ok(railSrc.includes("kind === 'connector'"), '图标分支必须只对连接器生效')
assert.ok(/alt=\{name\}/.test(railSrc), '连接器图标必须带 displayName 作为 alt')
assert.ok(/title=\{name\}/.test(railSrc), '连接器图标必须带悬停 title（全名）')
assert.ok(/aria-label=\{name\}/.test(railSrc), '连接器图标必须带名字的 aria-label')
{
  // 真渲染两种形态：有 icon（img + 可访问性属性）、没有 icon（回退，不渲染 img）。
  // railEntry.jsx 用 esbuild（构建脚本同款）编成 ESM 后 import —— AttachedRail.jsx
  // 是 JSX，node 不能直接 import。
  const repoDir = fileURLToPath(new URL('.', import.meta.url))
  const cache = join(repoDir, 'node_modules', '.cache', 'wbh-settings-test')
  mkdirSync(cache, { recursive: true })
  const railEntry = join(cache, 'rail-entry.jsx')
  writeFileSync(railEntry, [
    `export { default, RailConnectorIcon as Icon } from ${JSON.stringify(join(repoDir, 'src', 'AttachedRail.jsx'))}`,
  ].join('\n'))
  const railOut = join(cache, 'rail.mjs')
  await build({
    entryPoints: [railEntry],
    bundle: true, format: 'esm', platform: 'node', jsx: 'transform',
    external: ['react', 'react-dom', 'qrcode'], outfile: railOut, logLevel: 'silent',
  })
  const { Icon } = await import(pathToFileURL(railOut).href)
  const label = '腾讯文档'
  const withIcon = renderToString(React.createElement(Icon, { icon: 'https://example.invalid/x.png', name: label }))
  assert.ok(withIcon.includes('<img'), '有官方 icon 时渲染 <img>')
  assert.ok(withIcon.includes(`alt="${label}"`), 'img 的 alt 必须是 displayName')
  assert.ok(withIcon.includes(`aria-label="${label}"`), 'img 的 aria-label 必须带名字')
  assert.ok(withIcon.includes('wbh-chipLogoImg'), '图标必须挂 wbh- 前缀的样式类（官方式 16px 圆形 logo）')
  const withoutIcon = renderToString(React.createElement(Icon, { icon: '', name: label }))
  assert.ok(!withoutIcon.includes('<img'), '没有 icon 时不渲染 img（原通用图标回退）')
  rmSync(cache, { recursive: true, force: true })
}

console.log('render smoke + hub import completeness: OK')

// ---- picker 连接器行：点击 = attach（与回车一致），开关只承载启/停 --------------
// 真机缺陷：点击一行走的是行内开关（connectorAction），不把连接器 attach 到当前会话、
// 不出 chip；只有回车才走 onAction → attach。结果「已加载的连接器在输入框下方显示图标」
// 这条链路点击根本走不到。修复契约（源码层断言）：
//  1) picker 行的 onClick / onKeyDown 收敛到同一 onAction（attach）；连接器不再有分支；
//  2) 行尾有一个显式的 <button> 开关（wbh-toggle）承担原「启/停用」语义，点击带
//     stopPropagation，不会双重触发；
//  3) 专家/技能行的既有语义不动（技能写输入框、专家走 onAction）。
{
  const composerSrc = readFileSync(new URL('./src/ComposerAdd.jsx', import.meta.url), 'utf8')
  // picker 的行渲染在 Catalogue（variant==='picker' 分支）
  const pickerBlock = catalogueSrc.slice(catalogueSrc.indexOf("variant === 'picker'"))
  const rowBlock = pickerBlock.slice(pickerBlock.indexOf('const rowNode'), pickerBlock.indexOf('const listNode'))
  // a) 整行点击/回车：只有 skill 分支与 onAction —— 连接器不再有独立的 connectorAction 分支
  // 三种条目各自走官方行结构（cr-experts/skills/connectors-submenu__item），契约分开断言。
  const iExpert = rowBlock.indexOf("entry.kind === 'expert'")
  const iSkill = rowBlock.indexOf("entry.kind === 'skill'", iExpert)
  const iConn = rowBlock.indexOf("entry.kind === 'connector'", iSkill)
  const expertBlock = rowBlock.slice(iExpert, iSkill)
  const skillBlock = rowBlock.slice(iSkill, iConn)
  const connBlock = rowBlock.slice(iConn)
  assert.ok(skillBlock.includes('onClick={() => handleSkillPick(entry)}'), '技能行点击仍是写输入框')
  assert.ok(expertBlock.includes('onClick={() => onAction?.(entry)}'), '专家行点击走 onAction（召唤）')
  assert.ok(connBlock.includes('onClick={() => onAction?.(entry)}'), '连接器行点击走 onAction（= attach）')
  const connOnClick = connBlock.slice(connBlock.indexOf('onClick={() =>'), connBlock.indexOf('onKeyDown'))
  assert.ok(!connOnClick.includes('connectorAction'), '整行点击不得再触发 connectorAction（那是开关的语义）')
  const rowOnKeyDown = rowBlock.slice(rowBlock.indexOf('onKeyDown'), rowBlock.indexOf('const listNode'))
  assert.ok(rowOnKeyDown.includes("if (e.key === 'Enter') onAction?.(entry)"), '回车 = onAction（attach），与点击一致')
  // b) 行尾显式开关：真 button + role=switch + stopPropagation
  const toggleBlock = rowBlock.slice(rowBlock.indexOf("entry.kind === 'connector' && ("))
  assert.match(toggleBlock, /<button type="button" className=\{`wbh-toggle/, '连接器行尾必须是显式开关按钮（wbh-toggle）')
  assert.ok(toggleBlock.includes('role="switch"') && toggleBlock.includes('aria-checked={connectorEnabled}'),
    '开关要暴露 switch 语义，状态取**本地启用态** connectorEnabled（不是官方绑定态）')
  assert.ok(toggleBlock.includes('e.stopPropagation()'), '开关点击必须 stopPropagation（不能连带触发整行 attach）')
  assert.ok(toggleBlock.includes('void connectorAction(entry)'), '开关点击才调用 connectorAction（启/停用）')
  assert.ok(toggleBlock.includes('aria-label={`${connectorEnabled'), '开关 aria-label 必须按状态区分「启用/停用」')
  // b2) 未授权（未 bound）时行尾是官方那种「连接」文字按钮，而不是灰开关
  assert.ok(toggleBlock.includes('className="wbh-linkAction"'), '未授权的连接器行尾要有「连接」文字按钮（对齐官方）')
  assert.ok(rowBlock.includes('connectorAuthorised'), '行尾控件三态判定要基于「已启用 / 已授权 / 未授权」')
  // b3) 开关状态不得再取官方绑定态（真机缺陷：bound 但本地 enabled=false 却显示 ON）
  assert.ok(!rowBlock.includes('const connected = entry.kind === \'connector\' ? isBound(entry)'),
    '连接器开关状态不得用官方绑定态 isBound()（会把已关闭的 MCP 显示成 ON）')
  // c) attach 的连接器分支：点击与回车都进入「未启用先启用 + mount 到当前会话」，
  //    不再承担「已启用时再点 = 断开」（那是开关的职责）
  const attachConnector = composerSrc.slice(composerSrc.indexOf("if (entry.kind === 'connector') {"), composerSrc.indexOf("} else if (entry.kind === 'expert') {"))
  assert.ok(attachConnector.includes('hub.enableConnector(entry.name)'), 'attach：未启用的连接器要先启用')
  assert.ok(attachConnector.includes('mountForSession(sessionId'), 'attach：连接器必须挂到当前会话（chip 链路）')
  // 挂载必须走 mountForSession：它先标「挂载在途」再 POST /mount，否则安装成功触发的那次
  // 对账（快照早于 mount）会把乐观 chip 当幽灵删掉 —— 真机缺陷：宿主挂着、界面没有。
  assert.ok(composerSrc.includes('markMountPending(sessionId, key)'), 'attach 挂载前必须标「在途」')
  assert.ok(composerSrc.includes('clearMountPending(sessionId, key)'), '挂载落定后必须清「在途」')
  assert.ok(!attachConnector.includes('hub.disableConnector'), 'attach 不再承担断开语义（断开在行尾开关 / AttachedRail 的 X）')
  // d) 样式：wbh-toggle 在 official-picker.css 有官方对齐基础值；app.css 只补按钮可用性
  const pickerCss = readFileSync(new URL('./src/official-picker.css', import.meta.url), 'utf8')
  assert.ok(pickerCss.includes('.wbh-toggle{'), 'wbh-toggle 基础样式仍在 official-picker.css')
  const appCss = readFileSync(new URL('./src/app.css', import.meta.url), 'utf8')
  assert.ok(appCss.includes('.wbh-flyoutRow .wbh-toggle:focus-visible'), 'app.css 要补开关的焦点可见性（它是真按钮了）')
  // e) 产物同步：client.js 必须带上新行为（esbuild 会把中文转义成 \uXXXX，按转义后断言）
  const built = readFileSync(new URL('./client.js', import.meta.url), 'utf8')
  assert.ok(built.includes('"\\u505C\\u7528" : "\\u542F\\u7528"') || built.includes('"\\u505C\\u7528":"\\u542F\\u7528"'),
    '构建产物必须携带新开关行为（启用/停用 aria-label）')
  // f) attach 失败必须撤掉乐观 chip（真机缺陷：rail 显示「已加载」但宿主没挂上）
  //    真机证据（隔离实例）：点击连接器行 → POST /connectors/enable 502（缺凭据）→
  //    hub.mount 根本没发出 → 宿主 mounts.json / GET /mounted 皆空，而 chip 仍在。
  const composerCatch = composerSrc.slice(composerSrc.indexOf('} catch (error) {'), composerSrc.indexOf('} finally { setBusy('))
  assert.ok(composerCatch.includes('if (!mounted.has(key))'), 'attach 失败要按宿主挂载真相决定是否回滚 chip')
  assert.ok(composerCatch.includes('removeSelection(sessionId, entry.kind, entry.name)'), 'attach 失败必须撤掉这次的乐观 chip')
  assert.ok(composerCatch.includes('addSelection(replacedOnAdd[0], sessionId)'), '专家单槽位：失败要把被替换的专家 chip 还原')
  assert.match(composerSrc, /import \{[^}]*\bremoveSelection\b[^}]*\} from '\.\/hub\.js'/, 'removeSelection 必须从 hub.js 导入')
  assert.ok(built.includes('removeSelection(sessionId, entry.kind, entry.name)'), '构建产物必须携带 chip 回滚行为')
  // g) 开关打开 = 真的「已加载」：启用后挂到本会话并出 chip；关闭时撤 chip
  const connAction = catalogueSrc.slice(catalogueSrc.indexOf('const connectorAction'), catalogueSrc.indexOf('const openDetail'))
  assert.ok(connAction.includes('addSelection(entry, sessionId)'), '启用连接器后要把它加成 chip（输入框下方显示其 icon）')
  assert.ok(connAction.includes("hub.mount(sessionId, entry.kind, entry.name)"), '启用连接器后要挂到当前会话（chip 才不是空壳）')
  assert.ok(connAction.includes('removeSelection(sessionId, entry.kind, entry.name)'), '停用连接器后要撤掉本会话的 chip')
  // 卸载必须带显式 sessionId：hub.unmount(undefined,…) 会被宿主 409 静默丢掉（挂载残留）
  assert.ok(!connAction.includes('hub.unmount(undefined'), '停用路径不得再用 unmount(undefined)（静默 409）')
  assert.ok(catalogueSrc.includes('const unmountHere'), '要有一个统一带 sessionId 的卸载助手')
  // h) picker 专家搜索：有搜索词时用官方注册表结果（此前结果被丢弃 → 列表纹丝不动）
  const baseRowsBlock = pickerBlock.slice(pickerBlock.indexOf('const baseRows = kind ==='), pickerBlock.indexOf('const pinnedOfKind'))
  assert.ok(baseRowsBlock.includes("String(query ?? '').trim()"), '专家面板要按「有没有搜索词」分支')
  assert.ok(baseRowsBlock.includes('? visible'), '有搜索词时必须用 hub.list(kind,{query}) 的结果（visible），否则搜索无效')
  // i) picker 连接器面板要有「本机 MCP」一节（含 DSH 自己加载的，只读展示）
  const mcpSection = pickerBlock.slice(pickerBlock.indexOf('const hostMcpSection'), pickerBlock.indexOf('const listNode'))
  assert.ok(pickerBlock.includes('hub.hostMcpList()') || catalogueSrc.includes('hostMcpList()'), '要拉宿主侧 MCP 总清单 /mcp/host')
  assert.ok(mcpSection.includes('wbh-mcpSectionTitle'), '要有「本机 MCP」分组标题')
  assert.ok(mcpSection.includes("'DSH 加载'") && mcpSection.includes('wbh-mcpBadge'), 'DSH 自己加载的 MCP 只读展示（带徽标，不给开关）')
  assert.ok(mcpSection.includes('localMcpAction(server)'), '本插件托管的本地 MCP 才有开关（localMcpAction）')
  assert.ok(built.includes('wbh-mcpSection'), '构建产物必须携带「本机 MCP」一节')
}
console.log('picker connector row: click == Enter (attach) + explicit toggle + failed attach rolls the chip back: OK')

// ---- 已加载 chip 的官方对齐 + 开关动画（官方产物实测值）------------------------
// chip 数值来自官方 chat 端产物静态 CSS（.cr-chip-base/.cr-connector-chip__logo/.cr-chip-label）；
// 开关来自官方 TDesign（.t-switch / size-s），关键点是**用 transform 位移**而不是 animate left。
{
  const rail = readFileSync(new URL('./src/AttachedRail.jsx', import.meta.url), 'utf8')
  const css = readFileSync(new URL('./src/app.css', import.meta.url), 'utf8')
  const toggleCss = readFileSync(new URL('./src/official-picker.css', import.meta.url), 'utf8')
  // a) chip 结构：关闭按钮 + 官方圆形 logo + 13px 标签
  assert.ok(rail.includes('wbh-chipClose') && rail.includes('wbh-chipLogo') && rail.includes('wbh-chipLabel'),
    'chip 结构要是 [关闭][logo][名称]（对齐官方 .cr-chip-*）')
  assert.ok(!rail.includes('wbh-railX') && !rail.includes('wbh-railIcon'),
    '旧的胶囊 chip 类名（wbh-railX / wbh-railIcon）应已被官方规格替换')
  // b) chip 数值 = 官方值
  assert.ok(css.includes('height:32px;padding:0 8px;border:none;border-radius:8px;background:transparent'),
    'chip 容器要用官方 .cr-chip-base 的 32/8/透明底 数值')
  assert.ok(css.includes('background-color .15s ease'), 'chip hover 过渡用官方 .15s ease')
  assert.ok(css.includes('font-size:13px;font-weight:500;line-height:20px'), '标签用官方 13px/500/20px')
  assert.ok(css.includes('.wbh-chipLogo.is-connector{margin-left:-4px'), '连接器 logo 用官方 -4px 收紧')
  assert.ok(css.includes('border-radius:50%'), '连接器 logo 是圆形（官方 .cr-connector-chip__logo）')
  assert.ok(css.includes('rgba(0,0,0,.06)'), 'hover 底色用官方 rgba(0,0,0,.06)')
  // c) 开关：官方曲线 + transform 位移（旧实现 animate left → 卡顿根因）
  assert.ok(toggleCss.includes('cubic-bezier(.38,0,.24,1)'), '开关要用官方 TDesign 曲线 cubic-bezier(.38,0,.24,1)')
  assert.ok(toggleCss.includes('transition:all .2s cubic-bezier(.38,0,.24,1)'), '时长/属性照抄官方 .2s all')
  assert.ok(/\.wbh-toggle\.is-on i\{transform:translateX\(10px\)\}/.test(toggleCss),
    '把手位移必须走 transform（官方 .t-switch__handle 用 translate(-100%)）')
  assert.ok(!/\.wbh-toggle\.is-on i\{[^}]*left:/.test(toggleCss), '把手不得再用 left 做位移')
  const builtRail = readFileSync(new URL('./client.js', import.meta.url), 'utf8')
  assert.ok(builtRail.includes('wbh-chipLabel'), '构建产物必须携带新 chip 结构')
}
console.log('loaded chips: official .cr-chip-* metrics + TDesign switch animation: OK')

// ---- 「召唤更多专家」弹窗 + 图钉不绕过搜索 ------------------------------------
{
  const catalogue = readFileSync(new URL('./src/Catalogue.jsx', import.meta.url), 'utf8')
  const composer = readFileSync(new URL('./src/ComposerAdd.jsx', import.meta.url), 'utf8')
  const modal = readFileSync(new URL('./src/ExpertMarketModal.jsx', import.meta.url), 'utf8')
  const css = readFileSync(new URL('./src/app.css', import.meta.url), 'utf8')
  const built = readFileSync(new URL('./client.js', import.meta.url), 'utf8')

  // a) 图钉项必须参与搜索过滤（真机反馈：图钉过的条目在任何关键词下都留着 → 以为搜索没生效）
  assert.ok(catalogue.includes('matchesQuery(x)') && catalogue.includes('const activeQuery'),
    '图钉项要按当前搜索词过滤，不能绕过搜索')
  assert.match(catalogue, /pinnedEntries\.filter\(x => x\.kind === kind && matchesQuery\(x\)\)/,
    'pinnedOfKind 必须叠加 matchesQuery 过滤')

  // b) picker 底栏「召唤更多专家」走注入的 onMore（弹窗），没有注入时退回跳市场页
  const footer = catalogue.slice(catalogue.indexOf("kind === 'expert' ? ("), catalogue.indexOf("</>\n    )"))
  assert.ok(footer.includes('if (onMore) onMore('), '「召唤更多专家」优先走 onMore（弹窗）')
  assert.ok(footer.includes("openMarket({ kind: 'expert', view: 'market' })"), '未注入 onMore 时保留旧的跳转兜底')
  assert.match(catalogue, /onSettled = null, onMore = null,/, 'Catalogue 要暴露 onMore 注入点')

  // c) ComposerAdd：onMore 打开弹窗；弹窗动作 = attach（作用于当前会话）
  assert.ok(composer.includes('const [marketOpen, setMarketOpen] = useState(false)'), '要有弹窗开关状态')
  assert.ok(composer.includes('onMore={() => { setMenuOpen(false); setPickerOpen(false); setMarketOpen(true) }}'),
    'picker 的 onMore 要关掉 picker 并打开弹窗')
  const modalUsage = composer.slice(composer.indexOf('<ExpertMarketModal'), composer.indexOf('{summoning && ('))
  assert.ok(modalUsage.includes('sessionId={sessionId}'), '弹窗必须拿到当前会话 id（动作落在本对话）')
  assert.ok(modalUsage.includes('onAction={async entry => { const ok = await attach(entry); if (ok) setMarketOpen(false) }}'),
    '弹窗里的动作走 attach（没装先装 → 挂到本会话 → 出 chip），成功才关窗')
  assert.ok(composer.includes('      return true\n    } catch (error) {'), 'attach 成功要返回 true（供弹窗判断）')
  assert.ok(composer.includes('      return false\n    } finally { setBusy('), 'attach 失败要返回 false')

  // d) 弹窗内容 = 市场页同一个 Catalogue（variant=page），不自己新建会话
  assert.ok(modal.includes('variant="page"'), '弹窗内用市场页那种 page 变体（内容与市场页一致）')
  assert.ok(modal.includes('onAction={onAction}') && modal.includes('onDetail={onAction}'),
    '弹窗的卡片动作/详情都交给注入的 onAction（直接作用于当前对话）')
  assert.ok(!modal.includes('summonExpertInNewSession') && !modal.includes('openSessionById'),
    '弹窗不得自己新建会话（那是市场页的语义）')
  assert.ok(modal.includes('wbh-marketModalBody') && css.includes('.wbh-marketModal{'),
    '弹窗要有自己的外壳样式（放大到市场尺寸 + 可滚动主体）')

  // e) 产物同步
  assert.ok(built.includes('wbh-marketModal'), '构建产物必须携带弹窗外壳')
  assert.ok(built.includes('matchesQuery'), '构建产物必须携带图钉过滤')
}
console.log('picker "more experts" modal + pinned rows respect search: OK')
