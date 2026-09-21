/**
 * dsh-workbuddy-hub — browser half.
 *
 * Interaction is modelled on WorkBuddy's "+" surface (three screenshots):
 *
 *   composer "+"  → first-level menu (专家 / 技能 / 连接器)
 *                 → right-hand pane: search + cards (中文名 + 简介 + icon)
 *   attached items → icon rail BELOW the composer card (stacks horizontally)
 *   sidebar panel → full market browsing (same data, larger layout)
 *
 * Slot choice follows the shipped owners:
 *   conversation.input.left      compact "+" control
 *   conversation.composer.dock    ambient rail BELOW the card (never overlays input)
 *   sidebar.panellist + main      global market page
 *   settings.plugins.tab          status page
 *
 * Host owns every state and credential; the browser only calls
 * /workbuddy-hub/* same-origin routes and never receives secret values.
 */
window.__ModuleLoader__.load({
  id: 'dsh-workbuddy-hub',
  factory: (require) => {
    const module = { exports: {} }
    const exports = module.exports
    const React = require('react')
    const { createElement: h, useCallback, useEffect, useMemo, useRef, useState } = React

    const API = '/workbuddy-hub'
    const EVENT = 'dsh-workbuddy-hub:changed'
    const KINDS = [
      { id: 'expert', plural: 'experts', label: '专家', hint: '召唤专业角色（人设 + 方法论）' },
      { id: 'skill', plural: 'skills', label: '技能', hint: '按需加载的能力包' },
      { id: 'connector', plural: 'connectors', label: '连接器', hint: '连接外部服务与数据' },
    ]
    const kindOf = id => KINDS.find(k => k.id === id) || KINDS[0]
    const notify = () => window.dispatchEvent(new Event(EVENT))
    // Filled during apply(); the host command channel is how a summon actually
    // reaches the live Agent (the browser cannot call spawnTeammate directly).
    let pluginCtx = null
    /** Resolve the commands Remote at CALL time: the remotes module can finish
        loading after this plugin's apply(), so caching it eagerly loses it. */
    const commandsRemote = () => {
      // The generated namespaces are client *services*: `@deepseek-ai/dsh-api-remotes`
      // mounts `commands` as `remote.commands`, which is how the shipped command
      // plugins reach it. Reading it lazily also survives load-order differences.
      try { return pluginCtx?.get?.('remote.commands') ?? null } catch { return null }
    }
    const runCommand = async (sessionId, line) => {
      if (!sessionId) return { ok: false, error: '当前没有会话，无法执行命令' }
      const remote = commandsRemote()
      if (remote === null) return { ok: false, error: '命令通道不可用（remotes 未就绪）' }
      try {
        const result = await remote.execute(sessionId, line, [])
        if (!result?.ok) return { ok: false, error: result?.error?.message || '命令执行失败' }
        return { ok: true, value: result.value?.result }
      } catch (error) {
        return { ok: false, error: String(error?.message || error) }
      }
    }

    /** Line-art glyphs: text glyphs (◇✦⌁) fall back to tofu in some fonts. */
    function KindIcon({ kind, size = 15 }) {
      const paths = {
        expert: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.3 0-6 1.8-6 4v2h12v-2c0-2.2-2.7-4-6-4Z',
        skill: 'M12 3l2.2 5.3L20 9.6l-4 3.9.9 5.5L12 16.4 7.1 19l.9-5.5-4-3.9 5.8-1.3L12 3Z',
        connector: 'M9.5 14.5 6 18a3.5 3.5 0 0 1-5-5l3.5-3.5M14.5 9.5 18 6a3.5 3.5 0 0 1 5 5l-3.5 3.5M8 16l8-8',
      }
      return h('svg', {
        width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
        strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true,
      }, h('path', { d: paths[kind] || paths.connector }))
    }

    const STYLE = `
.wbh-root{font:inherit;color:var(--dsw-alias-label-primary)}
.wbh-plus{display:grid;place-items:center;flex:none;width:28px;height:28px;padding:0;border:none;border-radius:999px;background:var(--dsw-specific-selector);color:var(--dsw-alias-label-primary);cursor:pointer;transition:background-color 100ms ease}
.wbh-plus:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover-solid)}
.wbh-plus[aria-expanded="true"]{background:var(--dsw-alias-interactive-bg-hover-solid)}
.wbh-anchor{position:relative;display:inline-flex}
.wbh-scrim{position:fixed;inset:0;z-index:1240}
.wbh-menu{position:absolute;left:0;bottom:calc(100% + 10px);z-index:1250;display:flex;align-items:flex-start;animation:wbhPopIn .15s ease}
.wbh-menuCol{display:flex;flex-direction:column;width:196px;padding:5px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-layer-1);box-shadow:0 8px 24px rgba(0,0,0,.12)}
.wbh-menuRow{display:flex;align-items:center;gap:9px;padding:8px 9px;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:12.5px;cursor:pointer;text-align:left;transition:background .15s ease}
.wbh-menuRow:hover,.wbh-menuRow.on{background:var(--dsw-alias-bg-layer-2)}
.wbh-menuRow.on{font-weight:600}
.wbh-menuRowIcon{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;flex:0 0 auto;font-size:13px;color:var(--dsw-alias-label-secondary)}
.wbh-menuRowLabel{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.wbh-menuRowChev{color:var(--dsw-alias-label-tertiary);font-size:11px}
.wbh-pane{display:flex;flex-direction:column;align-self:flex-start;width:min(420px,calc(100vw - 240px));max-height:min(440px,calc(100vh - 140px));margin-left:7px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-layer-1);box-shadow:0 8px 24px rgba(0,0,0,.12);overflow:hidden;animation:wbhPaneIn .15s ease}
.wbh-paneHead{display:flex;align-items:center;gap:8px;padding:9px 10px;border-bottom:1px solid var(--dsw-alias-border-l2)}
.wbh-search{box-sizing:border-box;flex:1;min-width:0;padding:6px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;outline:none}
.wbh-search:focus{border-color:var(--dsw-alias-label-info,#5b8cff)}
.wbh-paneList{flex:1;min-height:120px;overflow:auto;padding:6px}
.wbh-item{display:flex;align-items:center;gap:10px;width:100%;padding:8px 9px;border:0;border-radius:6px;background:transparent;color:inherit;font:inherit;cursor:pointer;text-align:left;transition:background .15s ease}
.wbh-item:hover{background:var(--dsw-alias-bg-layer-2)}
.wbh-item:disabled{opacity:.6;cursor:default}
.wbh-avatar{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:26px;height:26px;border-radius:8px;overflow:hidden;background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:600}
.wbh-avatar img{width:100%;height:100%;object-fit:cover;display:block}
.wbh-itemBody{flex:1;min-width:0}
.wbh-itemName{display:flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;color:var(--dsw-alias-label-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.wbh-itemDesc{margin-top:2px;font-size:11px;line-height:1.45;color:var(--dsw-alias-label-tertiary);overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2}
.wbh-tag{flex:0 0 auto;padding:1px 6px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;font-size:9.5px;color:var(--dsw-alias-label-secondary);font-weight:400}
.wbh-action{flex:0 0 auto;padding:3px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:11px;cursor:pointer;transition:background .12s ease}
.wbh-action:hover{background:var(--dsw-alias-bg-layer-3)}
.wbh-action.primary{border-color:var(--dsw-alias-label-info,#5b8cff);color:var(--dsw-alias-label-info,#5b8cff)}
.wbh-action:disabled{opacity:.55;cursor:default}
.wbh-connect{flex:0 0 auto;display:inline-flex;align-items:center;gap:4px;padding:3px 11px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:11px;cursor:pointer;transition:background .12s ease}
.wbh-connect:hover:not(:disabled){background:var(--dsw-alias-bg-layer-3)}
.wbh-connect:disabled{opacity:.55;cursor:default}
.wbh-switch{flex:0 0 auto;position:relative;width:34px;height:18px;padding:0;border:0;border-radius:999px;background:var(--dsw-alias-bg-layer-3);cursor:pointer;transition:background .18s ease}
.wbh-switch.on{background:var(--dsw-alias-label-info,#5b8cff)}
.wbh-switch i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;transition:transform .18s cubic-bezier(.4,0,.2,1)}
.wbh-switch.on i{transform:translateX(16px)}
.wbh-paneFoot{display:flex;align-items:center;gap:8px;padding:8px 10px;border-top:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);font-size:11.5px;cursor:pointer}
.wbh-paneFoot:hover{background:var(--dsw-alias-bg-layer-2)}
.wbh-empty{padding:22px 12px;text-align:center;color:var(--dsw-alias-label-tertiary);font-size:11.5px;line-height:1.6}
.wbh-rail{display:flex;align-items:center;gap:7px;padding:0 2px 2px;animation:wbhRise .18s ease-out}
.wbh-railChip{display:inline-flex;align-items:center;gap:6px;padding:3px 8px 3px 4px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;background:var(--dsw-alias-bg-layer-2);font-size:11px;color:var(--dsw-alias-label-secondary);cursor:default;transition:background .12s ease}
.wbh-railChip:hover{background:var(--dsw-alias-bg-layer-3)}
.wbh-railChip .wbh-avatar{width:18px;height:18px;border-radius:50%;font-size:9.5px}
.wbh-railName{max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-primary)}
.wbh-railX{display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;padding:0;border:0;border-radius:50%;background:transparent;color:var(--dsw-alias-label-tertiary);cursor:pointer;font-size:11px;line-height:1}
.wbh-railX:hover{background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-danger,#d14343)}
.wbh-shell{box-sizing:border-box;width:100%;height:100%;min-height:0;overflow:auto;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary)}
.wbh-page{box-sizing:border-box;max-width:1080px;margin:0 auto;padding:26px 30px 40px}
.wbh-pageHead{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:18px}
.wbh-pageTitle{margin:0;font-size:19px;font-weight:650;letter-spacing:-.01em}
.wbh-pageSub{margin:6px 0 0;font-size:12px;color:var(--dsw-alias-label-secondary)}
.wbh-stat{display:inline-flex;align-items:center;gap:6px;flex:0 0 auto;padding:5px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;background:var(--dsw-alias-bg-layer-2);font-size:11px;color:var(--dsw-alias-label-secondary);white-space:nowrap}
.wbh-dot{width:7px;height:7px;border-radius:50%;background:var(--dsw-alias-label-success,#2b8a3e)}
.wbh-panel{border:1px solid var(--dsw-alias-border-l2);border-radius:14px;background:var(--dsw-alias-bg-layer-1);overflow:hidden}
.wbh-panelHead{display:flex;align-items:center;gap:6px;padding:9px 11px;border-bottom:1px solid var(--dsw-alias-border-l2)}
.wbh-tab{padding:6px 13px;border:0;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;cursor:pointer;transition:background .15s ease,color .15s ease}
.wbh-tab:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2)}
.wbh-tab.on{background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);font-weight:600}
.wbh-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:8px;padding:11px;max-height:min(58vh,560px);overflow:auto}
.wbh-card{display:flex;align-items:flex-start;gap:10px;padding:10px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-2);transition:background .15s ease}
.wbh-card:hover{background:var(--dsw-alias-bg-layer-3)}
.wbh-card .wbh-avatar{width:30px;height:30px;border-radius:9px;font-size:13px}
.wbh-flags{margin-top:4px;font-size:10px;color:var(--dsw-alias-label-warning,#b8860b)}
.wbh-note{padding:8px 12px;border-top:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:1.55}
.wbh-settings{box-sizing:border-box;max-width:840px;padding:22px 26px;display:flex;flex-direction:column;gap:13px}
.wbh-secTitle{margin:0 0 7px;font-size:13px;font-weight:650}
.wbh-row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:9px 11px;border:1px solid var(--dsw-alias-border-l2);border-radius:9px;background:var(--dsw-alias-bg-layer-2);margin-bottom:6px}
/* WorkBuddy's enter motion (cb-plugin-dropdown-in): opacity plus a 4px slide over
   .15s ease. This popover opens upward, so the slide arrives from below. */
@keyframes wbhPopIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
@keyframes wbhPaneIn{from{opacity:0;transform:translateX(-4px)}to{opacity:1;transform:translateX(0)}}
@keyframes wbhModalIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
@keyframes wbhScrimIn{from{opacity:0}to{opacity:1}}
.wbh-modalRoot{position:fixed;inset:0;z-index:1300;display:grid;place-items:center}
.wbh-modalScrim{position:absolute;inset:0;background:rgba(0,0,0,.28);animation:wbhScrimIn .15s ease}
.wbh-modal{position:relative;width:min(520px,calc(100vw - 40px));padding:16px;border:1px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-layer-1);box-shadow:0 8px 24px rgba(0,0,0,.12);animation:wbhModalIn .15s ease}
.wbh-modalHead{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.wbh-modalTitle{margin:0;font-size:14px;font-weight:650;color:var(--dsw-alias-label-primary)}
.wbh-modalSub{margin:2px 0 0;font-size:11px;color:var(--dsw-alias-label-tertiary)}
.wbh-modalDesc{margin:0 0 10px;font-size:12px;line-height:1.6;color:var(--dsw-alias-label-secondary)}
.wbh-modalInput{box-sizing:border-box;width:100%;padding:8px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;resize:vertical;outline:none}
.wbh-modalInput:focus{border-color:var(--dsw-alias-label-info,#5b8cff)}
.wbh-modalFoot{display:flex;justify-content:flex-end;gap:8px;margin-top:12px}
.wbh-btnGhost,.wbh-btnPrimary{padding:5px 14px;border-radius:8px;font:inherit;font-size:12px;cursor:pointer;transition:background .15s ease}
.wbh-btnGhost{border:1px solid var(--dsw-alias-border-l2);background:transparent;color:var(--dsw-alias-label-primary)}
.wbh-btnGhost:hover{background:var(--dsw-alias-bg-layer-2)}
.wbh-btnPrimary{border:1px solid transparent;background:var(--dsw-alias-button-info-fill,#3b7dff);color:#fff}
.wbh-btnPrimary:hover:not(:disabled){filter:brightness(1.05)}
.wbh-btnPrimary:disabled{opacity:.6;cursor:default}
@media(max-width:760px){.wbh-menu{flex-direction:column;left:-40px}.wbh-pane{width:min(420px,calc(100vw - 28px));margin:6px 0 0;max-height:46vh}.wbh-grid{grid-template-columns:1fr}}
/* ================= WorkBuddy parity layer =================
   Geometry, typography, radii, shadows and hover behaviour are taken from
   WorkBuddy's shipped marketplace stylesheet (cb-plugins-marketplace-*,
   cb-plugins-card-*, cb-plugin-detail-dropdown*), mapped onto DSH's alias
   tokens so the widget still follows the active theme. Rules here come last,
   so they override the earlier Draft look of the same selectors. */
.wbh-tabs{display:flex;align-items:center;gap:8px;margin-bottom:16px;padding:0;border-bottom:0;flex-wrap:wrap}
.wbh-tab{display:flex;align-items:center;gap:4px;padding:6px 8px 6px 12px;border-radius:16px;border:1px solid var(--dsw-alias-border-l2);background:transparent;font-size:13px;color:var(--dsw-alias-label-secondary);transition:all .15s ease}
.wbh-tab:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.wbh-tab.on{background:var(--dsw-alias-interactive-bg-hover-solid);border-color:var(--dsw-alias-label-info,#0078d4);color:var(--dsw-alias-label-primary);font-weight:500}
.wbh-menuRow{padding:8px 12px;border-radius:4px;font-size:13px}
.wbh-item{padding:8px 12px;border-radius:4px}
.wbh-itemName{font-size:13px}
.wbh-itemDesc{font-size:12px;line-height:1.5;-webkit-line-clamp:2}
.wbh-card{padding:16px;gap:8px;border-radius:8px;align-items:center;transition:all .15s ease;cursor:pointer;position:relative}
.wbh-card:hover{border-color:var(--dsw-alias-label-info,#0078d4);background:var(--dsw-alias-bg-layer-1)}
.wbh-card .wbh-itemDesc{font-size:13px;color:var(--dsw-alias-label-secondary)}
.wbh-card .wbh-action,.wbh-card .wbh-connect,.wbh-card .wbh-switch{opacity:0;visibility:hidden;transition:opacity .15s ease}
.wbh-card:hover .wbh-action,.wbh-card:hover .wbh-connect,.wbh-card:hover .wbh-switch,
.wbh-card .wbh-switch.on{opacity:1;visibility:visible}
.wbh-cardMenu{position:absolute;top:8px;right:8px;display:flex;align-items:center;justify-content:center;width:20px;height:20px;padding:0;border:0;border-radius:4px;background:transparent;color:var(--dsw-alias-label-primary);opacity:.6;cursor:pointer;transition:all .15s ease}
.wbh-cardMenu:hover{opacity:1;background:var(--dsw-alias-bg-layer-3)}
.wbh-chipFilter{display:flex;align-items:center;gap:6px;padding:4px 8px;border:1px solid var(--dsw-alias-border-l2);border-radius:4px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font-size:12px;max-width:200px}
.wbh-chipFilter span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.wbh-chipFilter button{width:12px;height:12px;padding:0;border:0;background:transparent;color:inherit;opacity:.7;cursor:pointer;line-height:1}
.wbh-chipFilter button:hover{opacity:1}
/* WorkBuddy's marketplace page is bare: pill row, then the search field, then the
   card grid — no surrounding bordered panel. */
.wbh-panel{border:0;background:transparent;border-radius:0;overflow:visible}
.wbh-panelHead{padding:0;border-bottom:0;margin-bottom:12px}
.wbh-tabs{padding:0;border-bottom:0;background:transparent;margin:0 0 16px}
.wbh-grid{padding:0;gap:10px}
.wbh-addBtn{display:flex;align-items:center;justify-content:center;width:32px;height:32px;padding:0;border:1px dashed var(--dsw-alias-border-l3);border-radius:16px;background:transparent;color:var(--dsw-alias-label-primary);opacity:.6;cursor:pointer;transition:all .15s ease}
.wbh-addBtn:hover{opacity:1;border-color:var(--dsw-alias-label-info,#0078d4);background:var(--dsw-alias-bg-layer-2)}
.wbh-menuRowChev{width:14px;height:14px;display:inline-flex;align-items:center;justify-content:center}
/* Confirm / authorisation dialogs follow the panel language: 10px radius and the
   same 0 8px 24px 12% shadow the marketplace dropdown uses. */
.wbh-modal{padding:20px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.12)}
.wbh-modalTitle{font-size:15px;font-weight:600}
.wbh-modalBadge{display:inline-flex;align-items:center;gap:4px;padding:1px 8px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;font-size:11px;color:var(--dsw-alias-label-secondary)}
.wbh-authRow{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-2);margin-bottom:8px}
.wbh-authKey{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;color:var(--dsw-alias-label-secondary)}
.wbh-modalIcon{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:10px;background:var(--dsw-alias-bg-layer-3)}
`

    /* ---------------- data layer ---------------- */

    const api = async (path, options) => {
      const response = await fetch(API + path, options)
      const body = await response.json().catch(() => ({}))
      if (!response.ok) {
        const error = new Error(body.error || `HTTP ${response.status}`)
        // Structured details (e.g. credentialRefs) drive the UI's next step.
        error.body = body
        error.status = response.status
        throw error
      }
      return body
    }
    const post = (path, payload) => api(path, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const useRevision = () => {
      const [revision, setRevision] = useState(0)
      useEffect(() => {
        const onChange = () => setRevision(v => v + 1)
        window.addEventListener(EVENT, onChange)
        return () => window.removeEventListener(EVENT, onChange)
      }, [])
      return revision
    }

    const useAsync = (loader, deps) => {
      const [state, setState] = useState({ loading: true, data: null, error: null })
      useEffect(() => {
        let live = true
        setState({ loading: true, data: null, error: null })
        Promise.resolve().then(loader).then(
          data => { if (live) setState({ loading: false, data, error: null }) },
          error => { if (live) setState({ loading: false, data: null, error: String(error?.message || error) }) },
        )
        return () => { live = false }
      }, deps)
      return state
    }

    const iconUrl = entry => (entry.hasIcon || entry.iconPath)
      ? `${API}/icon?kind=${entry.kind}&name=${encodeURIComponent(entry.name)}`
      : ''
    const zh = entry => entry.displayName || entry.name

    /** 召唤确认弹窗：WorkBuddy 在真正召唤前先让用户确认，并可顺手写下任务。 */
    function SummonDialog({ entry, busy, onCancel, onConfirm }) {
      const [task, setTask] = useState('')
      useEffect(() => {
        const onKey = event => { if (event.key === 'Escape') onCancel() }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
      }, [onCancel])
      return h('div', { className: 'wbh-root wbh-modalRoot', role: 'dialog', 'aria-modal': 'true',
        'aria-label': `召唤 ${zh(entry)}` },
        h('style', null, STYLE),
        h('div', { className: 'wbh-modalScrim', onClick: onCancel }),
        h('div', { className: 'wbh-modal' },
          h('div', { className: 'wbh-modalHead' },
            h(Avatar, { entry, size: 36 }),
            h('div', { style: { minWidth: 0 } },
              h('h3', { className: 'wbh-modalTitle' }, `召唤 ${zh(entry)}`),
              h('p', { className: 'wbh-modalSub' }, '专家运行在独立会话中，主对话只接收结论'),
            ),
          ),
          h('p', { className: 'wbh-modalDesc' }, entry.description || entry.dir),
          h('textarea', {
            className: 'wbh-modalInput', rows: 3, value: task,
            placeholder: '可直接写下要交给这位专家的任务（留空则先确认角色）',
            'aria-label': '任务描述',
            onChange: event => setTask(event.target.value),
          }),
          h('div', { className: 'wbh-modalFoot' },
            h('button', { type: 'button', className: 'wbh-btnGhost', onClick: onCancel }, '取消'),
            h('button', {
              type: 'button', className: 'wbh-btnPrimary', disabled: busy,
              onClick: () => { void onConfirm(task) },
            }, busy ? '召唤中…' : '召唤专家'),
          ),
        ),
      )
    }

    /** 连接器授权：需要凭证时给出明确的授权步骤，必要时外跳授权页（新标签页）。 */
    function AuthDialog({ entry, refs, error, onClose, onRetry, busy, authDomain = '', retryable = true }) {
      const domain = authDomain !== '' ? authDomain : (entry?.cli?.authDomain ?? '')
      const authUrl = domain === '' ? '' : `https://${domain.replace(/^https?:\/\//, '')}`
      return h('div', { className: 'wbh-root wbh-modalRoot', role: 'dialog', 'aria-modal': 'true',
        'aria-label': `连接 ${zh(entry)}` },
        h('style', null, STYLE),
        h('div', { className: 'wbh-modalScrim', onClick: onClose }),
        h('div', { className: 'wbh-modal' },
          h('div', { className: 'wbh-modalHead' },
            h('span', { className: 'wbh-modalIcon' }, h(KindIcon, { kind: 'connector', size: 18 })),
            h('div', { style: { minWidth: 0 } },
              h('h3', { className: 'wbh-modalTitle' }, `连接 ${zh(entry)}`),
              h('p', { className: 'wbh-modalSub' }, '授权完成后回到本对话框重试'),
            ),
          ),
          h('p', { className: 'wbh-modalDesc' }, error || entry?.description || ''),
          refs.length === 0 && retryable === false && h('div', { className: 'wbh-authRow' },
            h(KindIcon, { kind: 'skill', size: 14 }),
            h('span', { className: 'wbh-authKey' }, 'CLI'),
            h('span', { style: { flex: 1 } }),
            h('span', { className: 'wbh-modalBadge' }, '技能已挂载'),
          ),
          refs.length > 0 && h('div', null,
            h('p', { className: 'wbh-modalSub', style: { marginBottom: 6 } }, '该连接器需要以下凭证'),
            refs.map(ref => h('div', { className: 'wbh-authRow', key: ref },
              h(KindIcon, { kind: 'connector', size: 14 }),
              h('span', { className: 'wbh-authKey' }, ref),
              h('span', { style: { flex: 1 } }),
              h('span', { className: 'wbh-modalBadge' }, '待配置'),
            )),
          ),
          h('p', { className: 'wbh-modalDesc' },
            authUrl === ''
              ? '凭证由 DSH 凭证管理持有；配置后点「重试连接」即可。'
              : `该连接器的授权入口在 ${domain}；点击「打开授权页」会新开标签页，授权后回来重试。`),
          h('div', { className: 'wbh-modalFoot' },
            h('button', { type: 'button', className: 'wbh-btnGhost', onClick: onClose }, '关闭'),
            authUrl !== '' && h('button', {
              type: 'button', className: 'wbh-btnGhost',
              onClick: () => { window.open(authUrl, '_blank', 'noopener') },
            }, '打开授权页'),
            retryable && h('button', {
              type: 'button', className: 'wbh-btnPrimary', disabled: busy,
              onClick: () => { void onRetry() },
            }, busy ? '连接中…' : '重试连接'),
          ),
        ),
      )
    }

    /** Connector affordance: labelled 连接 until connected, switch afterwards. */
    function ConnectorAction({ on, busy, onToggle }) {
      if (on) {
        return h('button', {
          type: 'button', className: 'wbh-switch on', role: 'switch', 'aria-checked': 'true',
          disabled: busy, title: '断开连接', onClick: onToggle,
        }, h('i', null))
      }
      return h('button', {
        type: 'button', className: 'wbh-connect', disabled: busy,
        title: '连接该连接器', onClick: onToggle,
      }, busy ? '连接中' : '连接')
    }

    function Avatar({ entry, size }) {
      const [failed, setFailed] = useState(false)
      const url = iconUrl(entry)
      const style = size ? { width: size, height: size } : undefined
      if (!url || failed) {
        return h('span', { className: 'wbh-avatar', style, 'aria-hidden': true }, h(KindIcon, { kind: entry.kind, size: 13 }))
      }
      return h('span', { className: 'wbh-avatar', style },
        h('img', { src: url, alt: '', loading: 'lazy', onError: () => setFailed(true) }))
    }

    /* ---------------- market menu (two-level) ---------------- */

    function MenuItem({ entry, installed, mounted, enabled, busy, onPrimary, onToggle }) {
      const isConnector = entry.kind === 'connector'
      const isExpert = entry.kind === 'expert'
      // A connector switch means "MCP is connected" (WorkBuddy semantics); for
      // experts and skills the chip/attach state is what the row reports.
      const on = isConnector ? enabled : mounted
      return h('button', {
        type: 'button', className: 'wbh-item', disabled: busy,
        onClick: () => { void (isConnector ? onToggle(entry) : onPrimary(entry)) },
        title: entry.description || entry.name,
      },
      h(Avatar, { entry: entry, size: 26 }),
      h('div', { className: 'wbh-itemBody' },
        h('div', { className: 'wbh-itemName' },
          h('span', null, zh(entry)),
          !installed && h('span', { className: 'wbh-tag' }, '未安装'),
          installed && !mounted && !isConnector && h('span', { className: 'wbh-tag' }, '已安装'),
        ),
        entry.description
          ? h('div', { className: 'wbh-itemDesc' }, entry.description)
          : h('div', { className: 'wbh-itemDesc' }, entry.dir),
      ),
      isConnector
        ? h(ConnectorAction, { on, busy, onToggle: () => { void onToggle(entry) } })
        : h('span', { className: `wbh-action${isExpert && !mounted ? ' primary' : ''}` },
            busy ? '…' : mounted ? '已挂载' : isExpert ? '召唤' : installed ? '挂载' : '添加'),
      )
    }

    function MarketMenu({ sessionId, onClose, onOpenPanel }) {
      const [authorising, setAuthorising] = useState(null)
      const [summoning, setSummoning] = useState(null)
      const [kind, setKind] = useState('expert')
      const [query, setQuery] = useState('')
      const [busy, setBusy] = useState('')
      const [notice, setNotice] = useState('')
      const revision = useRevision()
      const installedState = useAsync(async () => (await api('/installed')).installed || {}, [revision])
      const mountedState = useAsync(async () => (
        sessionId ? (await api(`/mounted?sessionId=${encodeURIComponent(sessionId)}`)).keys || [] : []
      ), [sessionId, revision])
      const searchState = useAsync(async () => {
        await api('/catalog')
        const result = await api(`/search?q=${encodeURIComponent(query)}&kind=${kind}s&limit=40`)
        return result.hits || []
      }, [kind, query, revision])
      const inputRef = useRef(null)

      useEffect(() => { inputRef.current?.focus() }, [])
      const installed = installedState.data || {}
      const mounted = new Set(mountedState.data || [])

      const attach = useCallback(async (entry, task = '') => {
        const key = `${entry.kind}/${entry.name}`
        setBusy(key); setNotice('')
        try {
          if (!installed[key]) {
            await post('/install', { kind: entry.kind, name: entry.name })
          }
          if (entry.kind === 'connector') {
            // Connect the real transport first: a connector that cannot reach
            // its endpoint must not look attached.
            const result = await post('/connectors/enable', { name: entry.name })
            if (sessionId) await post('/mount', { sessionId, kind: entry.kind, name: entry.name })
            setNotice(`已连接「${zh(entry)}」（工具命名空间 ${result.serverName}），下一次模型步骤起可用。`)
          } else if (entry.kind === 'expert') {
            if (sessionId) await post('/mount', { sessionId, kind: entry.kind, name: entry.name })
            // 召唤 mutates nothing in this conversation: the expert runs in its
            // own child session and only its conclusion comes back.
            const summoned = await runCommand(sessionId, `/expert ${entry.name}${task.trim() === '' ? '' : ` ${task.trim()}`}`)
            setNotice(summoned.ok
              ? `已召唤「${zh(entry)}」：${summoned.value?.text || '专家会话已创建'}`
              : `已挂载，但召唤失败：${summoned.error}`)
          } else {
            if (sessionId) await post('/mount', { sessionId, kind: entry.kind, name: entry.name })
            setNotice(`已挂载「${zh(entry)}」`)
          }
          notify()
        } catch (error) {
          const refs = error.body?.credentialRefs ?? []
          if (refs.length > 0) setAuthorising({ entry, refs, error: error.message })
          else setNotice(`失败：${error.message}`)
        } finally { setBusy('') }
      }, [installed, sessionId])

      const detach = useCallback(async entry => {
        const key = `${entry.kind}/${entry.name}`
        setBusy(key); setNotice('')
        try {
          if (entry.kind === 'connector') {
            // Switching off must tear the transport down, not just hide the chip.
            await post('/connectors/disable', { name: entry.name })
            setNotice(`已断开「${zh(entry)}」`)
          } else {
            setNotice(`已取消「${zh(entry)}」`)
          }
          if (sessionId) await post('/unmount', { sessionId, kind: entry.kind, name: entry.name })
          notify()
        } catch (error) {
          setNotice(`失败：${error.message}`)
        } finally { setBusy('') }
      }, [sessionId])

      const hits = searchState.data || []
      const footLabel = kind === 'expert' ? '召唤更多专家' : kind === 'skill' ? '从本地添加技能' : '管理连接器'

      return h('div', { className: 'wbh-root' },
        h('style', null, STYLE),
        h('div', { className: 'wbh-scrim', onClick: onClose }),
        h('div', { className: 'wbh-menu' },
          h('div', { className: 'wbh-menuCol' },
            KINDS.map(item => h('button', {
              key: item.id, type: 'button',
              className: `wbh-menuRow${kind === item.id ? ' on' : ''}`,
              onMouseEnter: () => setKind(item.id),
              onClick: () => setKind(item.id),
            },
            h('span', { className: 'wbh-menuRowIcon' }, h(KindIcon, { kind: item.id })),
            h('span', { className: 'wbh-menuRowLabel' }, item.label),
            h('span', { className: 'wbh-menuRowChev' }, '›'),
            )),
          ),
          h('div', { className: 'wbh-pane' },
            h('div', { className: 'wbh-paneHead' },
              h('input', {
                ref: inputRef, className: 'wbh-search', value: query,
                placeholder: `搜索${kindOf(kind).label}`, 'aria-label': `搜索${kindOf(kind).label}`,
                onChange: event => setQuery(event.target.value),
              }),
            ),
            h('div', { className: 'wbh-paneList' },
              searchState.loading && h('div', { className: 'wbh-empty' }, '正在读取市场目录…'),
              searchState.error && h('div', { className: 'wbh-empty' }, `读取失败：${searchState.error}`),
              !searchState.loading && !searchState.error && hits.length === 0 &&
                h('div', { className: 'wbh-empty' }, '没有匹配的条目'),
              hits.map(entry => {
                const key = `${entry.kind}/${entry.name}`
                return h(MenuItem, {
                  key, entry,
                  installed: Boolean(installed[key]),
                  mounted: mounted.has(key),
                  enabled: installed[key]?.enabled === true,
                  busy: busy === key,
                  onPrimary: entry => setSummoning(entry),
                  onToggle: entry => mounted.has(key) ? detach(entry) : attach(entry),
                })
              }),
            ),
            h('div', { className: 'wbh-paneFoot', onClick: () => { onOpenPanel(); onClose() } },
              h('span', { 'aria-hidden': true }, '↗'), h('span', null, footLabel)),
            notice && h('div', { className: 'wbh-note', role: 'status' }, notice),
          ),
        ),
        summoning !== null && sessionId !== undefined && h(SummonDialog, {
          entry: summoning,
          busy: busy === `${summoning.kind}/${summoning.name}`,
          onCancel: () => setSummoning(null),
          onConfirm: async task => { await attach(summoning, task); setSummoning(null) },
        }),
        authorising !== null && h(AuthDialog, {
          entry: authorising.entry, refs: authorising.refs, error: authorising.error,
          authDomain: authorising.authDomain ?? '', retryable: authorising.retryable !== false,
          busy: busy === `${authorising.entry.kind}/${authorising.entry.name}`,
          onClose: () => setAuthorising(null),
          onRetry: async () => { await attach(authorising.entry); setAuthorising(null) },
        }),
      )
    }

    /* ---------------- composer "+" ---------------- */

    function ComposerAdd(props) {
      const [open, setOpen] = useState(false)
      const sessionId = props?.sessionId
      return h('div', { className: 'wbh-root wbh-anchor' },
        h('style', null, STYLE),
        h('button', {
          type: 'button', className: 'wbh-plus', 'aria-label': '专家·技能·连接器',
          'aria-expanded': open || undefined, title: '专家 · 技能 · 连接器',
          onClick: () => setOpen(v => !v),
        }, h('svg', { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
          h('path', {
            fill: 'currentColor',
            d: 'M8.64453 1.5V7.34961H14.5V8.65039H8.64453V14.5H7.34473V8.65039H1.5V7.34961H7.34473V1.5H8.64453Z',
          }))),
        open && h(MarketMenu, {
          sessionId,
          onClose: () => setOpen(false),
          onOpenPanel: () => {
            const select = props?.selectPanel
            if (typeof select === 'function') select('workbuddy-hub')
          },
        }),
      )
    }

    /* ---------------- attached rail below the composer ---------------- */

    function AttachedRail(props) {
      const sessionId = props?.sessionId
      const revision = useRevision()
      const [busy, setBusy] = useState('')
      const state = useAsync(async () => {
        if (!sessionId) return []
        return (await api(`/mounted?sessionId=${encodeURIComponent(sessionId)}`)).entries || []
      }, [sessionId, revision])
      const entries = state.data || []
      if (entries.length === 0) return null

      const detach = async entry => {
        const key = `${entry.kind}/${entry.name}`
        setBusy(key)
        try {
          await post('/unmount', { sessionId, kind: entry.kind, name: entry.name })
          notify()
        } finally { setBusy('') }
      }

      return h('div', { className: 'wbh-root wbh-rail', role: 'region', 'aria-label': '已挂载能力' },
        h('style', null, STYLE),
        entries.map(entry => {
          const key = `${entry.kind}/${entry.name}`
          return h('span', { className: 'wbh-railChip', key, title: `${kindOf(entry.kind).label}：${zh(entry)}` },
            h(Avatar, { entry }),
            h('span', { className: 'wbh-railName' }, zh(entry)),
            h('button', {
              type: 'button', className: 'wbh-railX', disabled: busy === key,
              'aria-label': `移除 ${zh(entry)}`, onClick: () => { void detach(entry) },
            }, busy === key ? '·' : '×'),
          )
        }),
      )
    }

    /* ---------------- global market page ---------------- */

    function MarketPanel({ kind, sessionId, onNotice }) {
      const [authorising, setAuthorising] = useState(null)
      const [summoning, setSummoning] = useState(null)
      const [query, setQuery] = useState('')
      const [busy, setBusy] = useState('')
      const revision = useRevision()
      const installedState = useAsync(async () => (await api('/installed')).installed || {}, [revision])
      const mountedState = useAsync(async () => (
        sessionId ? (await api(`/mounted?sessionId=${encodeURIComponent(sessionId)}`)).keys || [] : []
      ), [sessionId, revision])
      const searchState = useAsync(async () => {
        await api('/catalog')
        const result = await api(`/search?q=${encodeURIComponent(query)}&kind=${kind}s&limit=60`)
        return result.hits || []
      }, [kind, query, revision])
      const installed = installedState.data || {}
      const mounted = new Set(mountedState.data || [])

      const act = async (entry, task = '') => {
        const key = `${entry.kind}/${entry.name}`
        setBusy(key)
        try {
          if (!installed[key]) await post('/install', { kind: entry.kind, name: entry.name })
          if (entry.kind === 'connector' && entry.hasCliJson === true && entry.hasMcpJson !== true) {
            // CLI 型连接器没有 MCP 传输：它的能力是随包挂载的技能，授权走外部页面。
            setAuthorising({
              entry, refs: [], retryable: false,
              authDomain: installed[key]?.cli?.authDomain ?? '',
              error: installed[key]?.cli?.needsAuth === true
                ? '该连接器通过命令行授权，完成后即可在本机使用其技能。'
                : '该连接器的技能已挂载。',
            })
            return
          }
          if (entry.kind === 'connector' && entry.hasCliJson === true && entry.hasMcpJson !== true) {
            setAuthorising({
              entry, refs: [], retryable: false,
              authDomain: installed[key]?.cli?.authDomain ?? '',
              error: installed[key]?.cli?.needsAuth === true
                ? '该连接器通过命令行授权，完成后即可在本机使用其技能。'
                : '该连接器的技能已挂载。',
            })
            return
          }
          if (entry.kind === 'connector') {
            // Connect the transport; the session attachment follows it so the
            // chip and the switch can never disagree with reality.
            if (installed[key]?.enabled === true) {
              await post('/connectors/disable', { name: entry.name })
              if (sessionId) await post('/unmount', { sessionId, kind: entry.kind, name: entry.name })
              onNotice?.(`已断开「${zh(entry)}」`)
            } else {
              const result = await post('/connectors/enable', { name: entry.name })
              if (sessionId) await post('/mount', { sessionId, kind: entry.kind, name: entry.name })
              onNotice?.(`已连接「${zh(entry)}」（工具命名空间 ${result.serverName}），下一次模型步骤起可用。`)
            }
          } else if (entry.kind === 'expert') {
            if (sessionId) await post('/mount', { sessionId, kind: entry.kind, name: entry.name })
            const summoned = await runCommand(sessionId, `/expert ${entry.name}${task.trim() === '' ? '' : ` ${task.trim()}`}`)
            onNotice?.(summoned.ok
              ? `已召唤「${zh(entry)}」：${summoned.value?.text || '专家会话已创建'}`
              : `已挂载，但召唤失败：${summoned.error}`)
          } else if (!sessionId) {
            onNotice?.(`已安装「${zh(entry)}」（进入对话后可挂载）`)
          } else if (mounted.has(key)) {
            await post('/unmount', { sessionId, kind: entry.kind, name: entry.name })
          } else {
            await post('/mount', { sessionId, kind: entry.kind, name: entry.name })
          }
          notify()
        } catch (error) {
          const refs = error.body?.credentialRefs ?? []
          if (refs.length > 0) setAuthorising({ entry, refs, error: error.message })
          else onNotice?.(`失败：${error.message}`)
        } finally { setBusy('') }
      }

      const hits = searchState.data || []
      return h('div', null,
        h('div', { className: 'wbh-panelHead' },
          h('input', {
            className: 'wbh-search', value: query, placeholder: `搜索${kindOf(kind).label}`,
            onChange: event => setQuery(event.target.value),
          }),
        ),
        h('div', { className: 'wbh-grid' },
          searchState.loading && h('div', { className: 'wbh-empty' }, '正在读取市场目录…'),
          searchState.error && h('div', { className: 'wbh-empty' }, `读取失败：${searchState.error}`),
          !searchState.loading && !searchState.error && hits.length === 0 &&
            h('div', { className: 'wbh-empty' }, '没有匹配的条目'),
          hits.map(entry => {
            const key = `${entry.kind}/${entry.name}`
            const isConnector = entry.kind === 'connector'
            const isMounted = mounted.has(key)
            const isEnabled = installed[key]?.enabled === true
            const switchOn = isConnector ? isEnabled : isMounted
            return h('article', { className: 'wbh-card', key },
              h(Avatar, { entry: entry, size: 30 }),
              h('div', { className: 'wbh-itemBody' },
                h('div', { className: 'wbh-itemName' },
                  h('span', null, zh(entry)),
                  h('span', { className: 'wbh-tag' }, kindOf(entry.kind).label),
                  entry.hasMcpJson && h('span', { className: 'wbh-tag' }, 'MCP'),
                  entry.hasCliJson && h('span', { className: 'wbh-tag' }, 'CLI'),
                ),
                h('div', { className: 'wbh-itemDesc' }, entry.description || entry.dir),
                entry.flags?.length ? h('div', { className: 'wbh-flags' }, `⚠ ${entry.flags.length} 条安全扫描标记`) : null,
              ),
              isConnector
                ? h(ConnectorAction, { on: switchOn, busy: busy === key, onToggle: () => { void act(entry) } })
                : h('button', {
                    type: 'button', className: `wbh-action${isMounted ? '' : ' primary'}`,
                    disabled: busy === key,
                    onClick: () => { if (entry.kind === 'expert') setSummoning(entry); else void act(entry) },
                  }, busy === key ? '…' : isMounted ? '已挂载' : entry.kind === 'expert' ? '召唤' : '挂载'),
            )
          }),
        ),
        h('div', { className: 'wbh-note' },
          '安装与外部授权始终由你确认；专家只推荐与召唤，不会自动替换当前对话角色。'),
        summoning !== null && sessionId !== undefined && h(SummonDialog, {
          entry: summoning,
          busy: busy === `${summoning.kind}/${summoning.name}`,
          onCancel: () => setSummoning(null),
          onConfirm: async task => { await act(summoning, task); setSummoning(null) },
        }),
        authorising !== null && h(AuthDialog, {
          entry: authorising.entry, refs: authorising.refs, error: authorising.error,
          authDomain: authorising.authDomain ?? '', retryable: authorising.retryable !== false,
          busy: busy === `${authorising.entry.kind}/${authorising.entry.name}`,
          onClose: () => setAuthorising(null),
          onRetry: async () => { await act(authorising.entry); setAuthorising(null) },
        }),
      )
    }

    function HubPage(props) {
      const [kind, setKind] = useState('expert')
      const [notice, setNotice] = useState('')
      const health = useAsync(() => api('/health'), [])
      const sessionId = props?.sessionId
      return h('main', { className: 'wbh-root wbh-shell' },
        h('style', null, STYLE),
        h('div', { className: 'wbh-page' },
          h('header', { className: 'wbh-pageHead' },
            h('div', null,
              h('h1', { className: 'wbh-pageTitle' }, '专家 · 技能 · 连接器'),
              h('p', { className: 'wbh-pageSub' }, 'WorkBuddy 市场镜像 · 先浏览元数据，需要时才下载'),
            ),
            h('span', { className: 'wbh-stat' },
              h('i', { className: 'wbh-dot' }),
              health.error ? '服务不可用' : '市场已连接'),
          ),
          h('div', { className: 'wbh-panel' },
            h('div', { className: 'wbh-tabs' },
              KINDS.map(item => h('button', {
                key: item.id, type: 'button', className: `wbh-tab${kind === item.id ? ' on' : ''}`,
                onClick: () => setKind(item.id),
              }, item.label)),
            ),
            h(MarketPanel, { kind, sessionId, onNotice: setNotice }),
          ),
          notice && h('p', { style: { marginTop: 10, fontSize: 12, color: 'var(--dsw-alias-label-secondary)' } }, notice),
        ),
      )
    }

    function HubPanelIcon({ size }) {
      return h('svg', {
        width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
        strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true,
      },
      h('path', { d: 'M5 4.5h5.5V10H5zM13.5 4.5H19V10h-5.5zM5 13.5h5.5V19H5zM13.5 13.5H19V19h-5.5z' }),
      )
    }

    function SettingsTab() {
      const revision = useRevision()
      const health = useAsync(() => api('/health'), [])
      const registry = useAsync(async () => api('/installed'), [revision])
      const entries = Object.values((registry.data?.installed) || {})
      return h('section', { className: 'wbh-root wbh-settings' },
        h('style', null, STYLE),
        h('div', null,
          h('h2', { className: 'wbh-secTitle' }, 'WorkBuddy 市场状态'),
          h('div', { className: 'wbh-row' },
            h('span', null, h('i', { className: 'wbh-dot' }), health.error ? `服务异常：${health.error}` : `已连接 · ${health.data?.mirror || ''}`),
            h('span', { style: { fontSize: 11, color: 'var(--dsw-alias-label-tertiary)' } }, health.data?.store || ''),
          ),
        ),
        h('div', null,
          h('h2', { className: 'wbh-secTitle' }, `已安装（${entries.length}）`),
          entries.length === 0 && h('div', { className: 'wbh-empty' }, '在输入框 “＋” 或左侧入口浏览市场。'),
          entries.map(entry => h('div', { className: 'wbh-row', key: `${entry.kind}/${entry.name}` },
            h('span', null, `${kindOf(entry.kind).label} · ${entry.name}`,
              entry.flags?.length ? h('div', { className: 'wbh-flags' }, `⚠ ${entry.flags.length} 条扫描标记`) : null),
            h('span', { style: { fontSize: 11, color: 'var(--dsw-alias-label-tertiary)' } },
              `${entry.files || 0} 文件`
              + (entry.mcp ? ' · MCP' : '')
              + (entry.cli?.runtime ? ` · CLI(${entry.cli.runtime})` : '')
              + (entry.linkedSkills?.length ? ` · 技能 ${entry.linkedSkills.length}` : '')),
          )),
        ),
        h('p', { style: { margin: 0, fontSize: 12, lineHeight: 1.6, color: 'var(--dsw-alias-label-tertiary)' } },
          '需要 OAuth 或 API Key 的连接器会在启用时发起独立授权；本页与浏览器端不会展示任何凭据值。'),
      )
    }

    /* ---------------- registration ---------------- */

    // Only `slots` is a hard dependency: a wrong service name here would stop the
    // whole plugin from applying (the earlier "pending" failure). The remotes
    // MODULE is declared in dsh.client.inject, which guarantees it mounts its
    // namespaces before this bundle runs; the lookup stays lazy besides.
    exports.inject = ['slots']
    exports.apply = ctx => {
      pluginCtx = ctx
      ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: 'workbuddy-hub' }, HubPage))
      ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
        name: 'sidebar.panellist', id: 'workbuddy-hub', order: -90,
        label: () => '专家·技能·连接器',
      }, HubPanelIcon))
      ctx.slots.inject('conversation.input.left', () => ctx.slots.register({
        name: 'conversation.input.left', id: 'workbuddy-hub-add', order: -90,
        label: () => '专家·技能·连接器',
      }, ComposerAdd))
      // Never input.overlay: that surface floats INSIDE the card and would cover
      // the placeholder. The dock renders below the card (InputBar.tsx:484).
      ctx.slots.inject('conversation.composer.dock', () => ctx.slots.register({
        name: 'conversation.composer.dock', id: 'workbuddy-hub-attached', order: -90,
        label: () => '已挂载 WorkBuddy 条目',
      }, AttachedRail))
      ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
        name: 'settings.plugins.tab', id: 'workbuddy-hub', order: 80,
        label: () => 'WorkBuddy 市场',
      }, SettingsTab))
    }

    return module.exports
  },
})
