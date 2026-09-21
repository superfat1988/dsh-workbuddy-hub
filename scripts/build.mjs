// Build the browser half: bundle src/index.jsx, wrap it in the DSH ModuleLoader
// factory, then inline the compiled CSS as a runtime <style> tag.
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

execFileSync('node_modules/.bin/esbuild', [
  'src/index.jsx', '--bundle', '--format=cjs', '--jsx=automatic',
  '--loader:.css=css', '--outfile=/tmp/wbh-body.js', '--external:react',
], { stdio: 'inherit' })

const body = readFileSync('/tmp/wbh-body.js', 'utf8')
const banner = "window.__ModuleLoader__.load({ id: 'dsh-workbuddy-hub', factory: function (require) { const module = { exports: {} };"
const footer = 'return module.exports; } });'
let out = `${banner}\n${body}\n${footer}\n`

if (existsSync('/tmp/wbh-body.css')) {
  const css = readFileSync('/tmp/wbh-body.css', 'utf8')
  const inject = `var __wbCss = ${JSON.stringify(css)};\n`
    + "try { var __st = document.createElement('style'); __st.setAttribute('data-workbuddy-hub',''); __st.textContent = __wbCss; document.head.appendChild(__st); } catch (e) {}\n"
  const lines = out.split('\n')
  lines.splice(1, 0, inject)
  out = lines.join('\n')
}
writeFileSync('client.js', out)
console.log('client.js written:', out.length, 'bytes')
