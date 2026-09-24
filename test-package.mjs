// 打包完整性守卫：发布产物必须能真正被 import。
//
// 为什么需要这个测试：package.json 的 `files` 白名单曾经漏掉 wb-market.js / wb-experts.js /
// wb-cats.js / wb-unzip.js —— index.js 静态 import 它们，wb-cats.js 还被 wb-market.js 动态 import。
// 结果：本地目录安装（dsh plugin add <dir>）一切正常，但任何走 npm/tarball 的安装一 import
// 就 ERR_MODULE_NOT_FOUND。这里用两步守住：
//   ① 从 index.js 递归解析**本地 import 图**，逐个断言出现在 npm pack 的产物清单里（自动覆盖以后新增的模块）；
//   ② 真打一个 tarball、解压到临时目录、真 import 一次 —— 证明产物可加载，而不只是「文件在」。
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, existsSync, rmSync, readdirSync, symlinkSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'

const repo = dirname(fileURLToPath(import.meta.url))
const tmp = mkdtempSync(join(tmpdir(), 'wbhub-pack-'))
process.on('exit', () => { try { rmSync(tmp, { recursive: true, force: true }) } catch { /* 忽略 */ } })

// ---- ① npm pack 的产物清单（ground truth，自动考虑 files 白名单与 glob）---------
console.log('1. npm pack --dry-run --json …')
const dryOut = execFileSync('npm', ['pack', '--dry-run', '--json'], { cwd: repo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
const packed = JSON.parse(dryOut)[0].files.map(f => f.path)
assert.ok(packed.length > 0, 'pack 产物不应为空')
const packedSet = new Set(packed)
console.log(`   产物文件数: ${packed.length}`)

// ---- 从 index.js 递归走本地 import 图（静态 from './x.js' 与动态 import('./x.js')）----
const localRefs = src => {
  const out = new Set()
  for (const m of src.matchAll(/from\s+'(\.\/[\w.-]+\.js)'/g)) out.add(m[1])
  for (const m of src.matchAll(/import\(\s*'(\.\/[\w.-]+\.js)'\s*\)/g)) out.add(m[1])
  return [...out]
}
const reachable = new Set()
const queue = ['index.js']
while (queue.length) {
  const rel = queue.shift()
  if (reachable.has(rel)) continue
  reachable.add(rel)
  const abs = join(repo, rel)
  if (!existsSync(abs)) continue
  for (const ref of localRefs(readFileSync(abs, 'utf8'))) {
    const next = resolve(dirname(rel), ref).slice(repo.length + 1)
    if (!reachable.has(next)) queue.push(next)
  }
}
console.log(`2. index.js 可达的本地模块: ${[...reachable].sort().join(', ')}`)

// ---- 每个可达模块都必须在产物里（这就是当年漏掉的那批）-----------------------
const missing = [...reachable].filter(rel => !packedSet.has(rel))
assert.deepEqual(missing, [], `以下运行时模块没有被 files 白名单收进产物：${missing.join(', ')}`)

// ---- 随插件 skill 也要在产物里（README「随插件 skill」）----------------------
const skillDirs = existsSync(join(repo, 'skills')) ? readdirSync(join(repo, 'skills')) : []
assert.ok(skillDirs.length > 0, '仓库应带 skills/ 目录')
for (const name of skillDirs) {
  assert.ok(packed.some(p => p.startsWith(`skills/${name}`)), `随插件 skill ${name} 不在产物里`)
}
console.log(`3. 随插件 skill: ${skillDirs.join(', ')}`)

// ---- ② 真打包 → 解压 → 真 import（产物可加载）-------------------------------
console.log('4. 真打包并解压后 import 一次…')
const packOut = execFileSync('npm', ['pack', '--pack-destination', tmp], { cwd: repo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim().split('\n').pop()
const tarball = join(tmp, packOut)
assert.ok(existsSync(tarball), `tarball 未生成：${packOut}`)
execFileSync('tar', ['-xzf', tarball, '-C', tmp], { stdio: 'pipe' })
const pkgDir = join(tmp, 'package')
assert.ok(existsSync(join(pkgDir, 'index.js')), '解压后应有 index.js')
// 解压目录里没有 node_modules：把仓库的软链进去，让 peer/普通依赖能解析
if (existsSync(join(repo, 'node_modules'))) {
  try { symlinkSync(join(repo, 'node_modules'), join(pkgDir, 'node_modules')) } catch { /* 已存在则忽略 */ }
}
const mod = await import(join(pkgDir, 'index.js'))
assert.equal(typeof mod.apply, 'function', '产物里的 index.js 必须导出 apply')
// 客户端入口与 bundle 也要在
assert.ok(existsSync(join(pkgDir, 'client.js')), '产物应带 client.js')
assert.ok(existsSync(join(pkgDir, 'client.css')), '产物应带 client.css')
assert.ok(existsSync(join(pkgDir, 'cordis.patch.yml')), '产物应带 cordis.patch.yml')
console.log(`   解压到 ${pkgDir}，import('./index.js') 成功，apply=${typeof mod.apply}`)

console.log('\nALL TESTS PASSED (package: files whitelist complete + tarball loads)')
