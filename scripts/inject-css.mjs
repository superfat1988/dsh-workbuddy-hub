import { readFileSync, writeFileSync, existsSync } from 'node:fs'
if (!existsSync('client.css')) { console.error('client.css missing — run esbuild first'); process.exit(1) }
const css = readFileSync('client.css', 'utf8')
let s = readFileSync('client.js', 'utf8')
if (s.includes('__wbCss')) { console.log('css already injected'); process.exit(0) }
const inject = 'var __wbCss = ' + JSON.stringify(css) + ';\n'
  + "try { var __st = document.createElement('style'); __st.textContent = __wbCss; document.head.appendChild(__st); } catch (e) {}\n"
const lines = s.split('\n')
if (!lines[0].startsWith('window.__ModuleLoader__.load')) { console.error('unexpected bundle head'); process.exit(1) }
lines.splice(1, 0, inject)
writeFileSync('client.js', lines.join('\n'))
console.log('css injected into client.js')
