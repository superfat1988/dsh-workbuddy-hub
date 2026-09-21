/**
 * dsh-workbuddy-hub — WorkBuddy expert persona reader.
 *
 * A downloaded expert is a `.codebuddy-plugin/plugin.json` plus one Markdown
 * file per agent. Nothing in DSH understands that layout, so it is parsed
 * here, conservatively, from a path that is proven to stay inside the store:
 *
 *  - the expert directory is resolved and must remain under the experts root;
 *  - only `plugin.json` and explicitly named `agents/<id>.md` files are read;
 *  - identifiers must match a tight grammar; symlinks, oversized files and
 *    non-UTF-8 bytes are refused;
 *  - downloaded JavaScript/scripts are NEVER executed or imported.
 *
 * The full Markdown goes into the child's first user message (fidelity), while
 * the child's system-level persona is a short sanitized role line: mcp/subagent
 * personas use strict `{{…}}` template interpolation, which arbitrary expert
 * prose would break.
 */
import { existsSync, readFileSync, realpathSync, statSync } from 'node:fs'
import { isAbsolute, join, relative, resolve } from 'node:path'

const ID_PATTERN = /^[A-Za-z0-9._-]{1,64}$/
const MAX_PERSONA_BYTES = 256 * 1024
const MAX_PLUGIN_BYTES = 256 * 1024

/** Resolve a path and prove it stays inside `root` (no traversal, no escape). */
export function confinedPath(root, ...parts) {
  const base = resolve(root)
  const target = resolve(join(base, ...parts))
  const rel = relative(base, target)
  if (rel === '' || rel.startsWith('..') || isAbsolute(rel)) {
    throw new Error(`path escapes expert root: ${parts.join('/')}`)
  }
  return target
}

function readTextFile(path, limit) {
  const info = statSync(path)
  if (!info.isFile()) throw new Error(`not a regular file: ${path}`)
  if (info.size > limit) throw new Error(`file too large (${info.size} bytes): ${path}`)
  const text = readFileSync(path, 'utf8')
  if (text.includes('\u0000')) throw new Error(`binary content: ${path}`)
  return text
}

/** Choose the agent that carries the persona: agentName, else team lead. */
export function selectAgentId(plugin) {
  const team = plugin?.teamInfo
  const lead = typeof team?.leadAgent === 'string' ? team.leadAgent : ''
  const single = typeof plugin?.agentName === 'string' ? plugin.agentName : ''
  const picked = single || lead
  if (picked === '') return { ok: false, error: 'plugin.json declares neither agentName nor teamInfo.leadAgent' }
  if (!ID_PATTERN.test(picked)) return { ok: false, error: `unsafe agent id "${picked}"` }
  const members = Array.isArray(team?.memberAgents)
    ? team.memberAgents.filter(m => typeof m === 'string' && ID_PATTERN.test(m) && m !== picked)
    : []
  return { ok: true, agentId: picked, mode: lead === picked && members.length > 0 ? 'team' : 'single', members }
}

/**
 * Read one installed expert's persona.
 * @param expertsRoot - `<storeRoot>/experts`
 * @param expertName - catalog name (already validated by the caller)
 */
export function readExpertPersona(expertsRoot, expertName) {
  if (!ID_PATTERN.test(String(expertName))) return { ok: false, error: `unsafe expert name "${expertName}"` }
  let dir
  try {
    dir = confinedPath(expertsRoot, expertName)
  } catch (error) {
    return { ok: false, error: String(error.message || error) }
  }
  if (!existsSync(dir)) return { ok: false, error: `expert not installed: ${expertName}` }

  // Refuse a symlinked expert directory: it could point outside the store.
  try {
    const real = realpathSync(dir)
    const realRoot = realpathSync(resolve(expertsRoot))
    const rel = relative(realRoot, real)
    if (rel.startsWith('..') || isAbsolute(rel)) return { ok: false, error: 'expert directory escapes the store' }
  } catch (error) {
    return { ok: false, error: String(error.message || error) }
  }

  const manifest = join(dir, '.codebuddy-plugin', 'plugin.json')
  let plugin = {}
  if (existsSync(manifest)) {
    try {
      plugin = JSON.parse(readTextFile(manifest, MAX_PLUGIN_BYTES))
    } catch (error) {
      return { ok: false, error: `plugin.json unreadable: ${error.message}` }
    }
  }

  const selection = selectAgentId(plugin)
  if (!selection.ok) return { ok: false, error: selection.error }

  let persona = ''
  let personaFile = ''
  for (const candidate of [`agents/${selection.agentId}.md`, `agents/${selection.agentId}`]) {
    let path
    try {
      path = confinedPath(dir, candidate)
    } catch {
      continue
    }
    if (!existsSync(path)) continue
    try {
      persona = readTextFile(path, MAX_PERSONA_BYTES)
      personaFile = candidate
    } catch (error) {
      return { ok: false, error: String(error.message || error) }
    }
    break
  }
  if (persona === '') return { ok: false, error: `missing persona file agents/${selection.agentId}.md` }

  const display = plugin?.displayName
  const title = (typeof display === 'string' && display) || (typeof display?.zh === 'string' && display.zh) || expertName
  const desc = plugin?.displayDescription
  const description = (typeof desc === 'string' && desc) || (typeof desc?.zh === 'string' && desc.zh) || ''

  return {
    ok: true,
    name: expertName,
    title,
    description,
    mode: selection.mode,
    agentId: selection.agentId,
    members: selection.members,
    personaFile,
    persona,
    bytes: Buffer.byteLength(persona),
  }
}

/** Short child persona line; `{{`/`}}` are removed so template parsing cannot fail. */
export function buildPersonaLine(entry) {
  const text = `${entry.title}${entry.description ? `：${entry.description}` : ''}`
    .replace(/\{\{|\}\}/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  const clipped = text.length > 300 ? `${text.slice(0, 297)}…` : text
  return `你现在以「${clipped}」这一专家角色的方法与标准工作。以下人设文件是你的工作依据，必须完整遵循。`
}

/** Child's first user message: identity reminder, full persona, task, report-back. */
export function buildSummonPrompt(entry, task) {
  const header = `[专家召唤] 角色：${entry.title}${entry.mode === 'team' ? `（专家团，主理人 ${entry.agentId}）` : ''}`
  const body = entry.persona.trim()
  const ask = task && task.trim() !== ''
    ? task.trim()
    : '（用户尚未给出具体任务。请先用一两句话确认你已就位，并说明你擅长处理什么、需要用户补充哪些信息。）'
  return `${header}\n\n以下是该专家的人设与方法论全文，请完整遵循：\n\n${body}\n\n---\n\n当前任务：\n${ask}\n\n完成后请给出简明结论（结论优先，附关键依据）。`
}
