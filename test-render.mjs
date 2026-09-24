// Render-level smoke test: every slot component the browser half registers must
// survive a server render, and every hub.js symbol a source file uses must be
// imported by it. These two checks exist because undefined identifiers inside a
// component (setBusy, setNotice, onMarketRequest) shipped three times and each
// time silently broke a surface — the picker disappearing entirely was the last.
// Third: the settings "installed" list remove flow (inline confirm, secondary
// danger button, failure reason) is pinned by source/CSS assertions, plus a real
// unit test of its pure notice function via esbuild.
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, mkdirSync, rmSync } from 'node:fs'
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
    const used = new RegExp(`(^|[^\\w$.])${name}\\b`).test(body)
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
  const { uninstallNotice, InstalledRow } = await import(pathToFileURL(outFile).href)
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
  rmSync(cacheDir, { recursive: true, force: true })
}

console.log('render smoke + hub import completeness: OK')
