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

    /* Real WorkBuddy icon geometry, extracted from their shipped marketplace
       bundle (viewBox + presentation attributes + body). Rendered inline so
       the widget uses the same shapes as the official client. */
    const WB_ICONS = {
      plus: ['0 0 16 16', 'fill="none" xmlns="http://www.w3.org/2000/svg"', '<path fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 1.5 1.49597)" d="M7.165 7.165L7.165 13L5.835 13L5.835 7.165L0 7.165L0 5.835L5.835 5.835L5.835 0L7.165 0L7.165 5.835L13 5.835L13 7.165L7.165 7.165Z"></path>'],
      person: ['0 0 12 12', 'fill="none" xmlns="http://www.w3.org/2000/svg"', '<path d="M6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1Z" stroke="currentColor" stroke-width="1"></path><path d="M6 3V9" stroke="currentColor" stroke-width="1" stroke-linecap="round"></path><path d="M3 6H9" stroke="currentColor" stroke-width="1" stroke-linecap="round"></path>'],
      sparkle: ['0 0 16 16', 'fill="none" xmlns="http://www.w3.org/2000/svg"', '<path fill="currentColor" d="M6.1838 2.2198C6.6022 1.3093 7.8641 1.2266 8.1057 2.0938L8.84 4.7335C8.992 5.2783 9.3896 5.6893 9.929 5.8595L12.5432 6.6827C13.4014 6.9536 13.2757 8.2113 12.3517 8.5987L9.9973 9.5861L9.8362 9.6583C9.0366 10.0399 8.3731 10.7089 8.0031 11.5138L6.9377 13.8341L6.8488 13.9943C6.3971 14.7003 5.39 14.7669 5.0735 14.1115L5.0158 13.9601L4.2815 11.3205C4.1485 10.8435 3.8277 10.4679 3.3879 10.2677L3.1916 10.1935L0.5783 9.3712C-0.2801 9.1005 -0.155 7.8418 0.7687 7.4542L3.1242 6.4679C3.9412 6.1253 4.632 5.4846 5.0403 4.6983L5.1183 4.5392L6.1838 2.2198ZM6.2004 4.88C5.652 6.0736 4.6394 7.0538 3.4279 7.5616L1.5295 8.3565L3.719 9.046C4.5745 9.3157 5.2059 9.9689 5.4465 10.8331L6.0608 13.0431L6.9201 11.174C7.4685 9.9802 8.4821 9.0001 9.6935 8.4923L11.591 7.6964L9.4025 7.0069C8.547 6.7373 7.9156 6.085 7.675 5.2208L7.0598 3.0099L6.2004 4.88ZM12.7072 0.214C12.8295 -0.052 13.198 -0.0764 13.2687 0.1768L13.6194 1.4395C13.6415 1.5192 13.7005 1.5797 13.7795 1.6046L15.0285 1.9981C15.2795 2.0772 15.243 2.4445 14.9728 2.5577L13.6281 3.1212C13.5431 3.1568 13.4722 3.226 13.4338 3.3097L12.8254 4.6349C12.703 4.9009 12.3344 4.9245 12.2639 4.671L11.9124 3.4093C11.8901 3.3296 11.8319 3.2691 11.7531 3.2442L10.5031 2.8507C10.2522 2.7715 10.2888 2.4045 10.5588 2.2911L11.9035 1.7267C11.9884 1.6911 12.0593 1.6228 12.0978 1.5392L12.7072 0.214Z"></path>'],
      link: ['0 0 16 16', 'xmlns="http://www.w3.org/2000/svg"', '<path fill="currentColor" transform="matrix(1 0 0 1 0.435199 0.715962)" d="M7.5656 4.2827C8.2868 4.6991 8.7999 5.2128 9.1214 5.8068C9.4424 6.4 9.5528 7.0359 9.5284 7.6644C9.5192 7.8997 9.4911 8.1358 9.4474 8.3709L8.3226 7.7215C8.325 7.6869 8.3279 7.6525 8.3293 7.6183C8.3469 7.1636 8.2661 6.7484 8.0655 6.3778C7.8653 6.0082 7.5257 5.6444 6.966 5.3213C6.4063 4.9981 5.9214 4.8859 5.5013 4.8973C5.08 4.9089 4.68 5.0465 4.2951 5.2892C3.5056 5.787 2.8232 6.6961 2.254 7.6819C1.6848 8.6678 1.2387 9.7133 1.2024 10.6459C1.1847 11.1006 1.2655 11.5158 1.4661 11.8864C1.6663 12.256 2.0059 12.6198 2.5656 12.9429C3.1254 13.2661 3.6102 13.3783 4.0304 13.3669C4.4516 13.3553 4.8516 13.2177 5.2365 12.975C5.7924 12.6245 6.2937 12.0689 6.7412 11.4273L7.784 12.0294C7.2672 12.7855 6.6365 13.511 5.876 13.9904C5.3439 14.3258 4.738 14.5482 4.0638 14.5668C3.3886 14.5853 2.6872 14.3978 1.966 13.9815C1.2448 13.5651 0.7317 13.0514 0.4102 12.4574C0.0892 11.8642 -0.0211 11.2283 0.0033 10.5998C0.0512 9.3663 0.6211 8.1118 1.2154 7.0823C1.8098 6.0528 2.6114 4.932 3.6556 4.2738C4.1877 3.9384 4.7936 3.716 5.4678 3.6974C6.143 3.6789 6.8445 3.8663 7.5656 4.2827ZM13.1637 0.5865C13.8848 1.0029 14.3979 1.5167 14.7195 2.1106C15.0405 2.7038 15.1508 3.3397 15.1264 3.9683C15.0785 5.2017 14.5086 6.4563 13.9142 7.4858C13.3199 8.5153 12.5183 9.636 11.4741 10.2943C10.942 10.6296 10.3361 10.8521 9.6618 10.8706C8.9867 10.8892 8.2852 10.7017 7.5641 10.2853C6.8429 9.869 6.3298 9.3552 6.0083 8.7613C5.6873 8.1681 5.5769 7.5322 5.6013 6.9037C5.6105 6.6684 5.6386 6.4323 5.6823 6.1971L6.8071 6.8465C6.8046 6.8811 6.8018 6.9155 6.8004 6.9498C6.7828 7.4045 6.8636 7.8197 7.0642 8.1903C7.2643 8.5599 7.6039 8.9236 8.1637 9.2468C8.7234 9.5699 9.2083 9.6822 9.6284 9.6707C10.0497 9.6591 10.4496 9.5215 10.8346 9.2789C11.6241 8.7811 12.3065 7.872 12.8757 6.8862C13.4449 5.9003 13.8909 4.8548 13.9273 3.9221C13.945 3.4674 13.8642 3.0523 13.6636 2.6816C13.4634 2.3121 13.1238 1.9483 12.5641 1.6251C12.0043 1.3019 11.5195 1.1897 11.0993 1.2012C10.6781 1.2128 10.2781 1.3504 9.8932 1.593C9.3373 1.9435 8.836 2.4991 8.3884 3.1407L7.3456 2.5387C7.8624 1.7825 8.4932 1.057 9.2537 0.5776C9.7858 0.2422 10.3917 0.0198 11.0659 0.0013C11.7411 -0.0173 12.4425 0.1702 13.1637 0.5865Z"></path>'],
      search: ['0 0 16 16', 'fill="none" xmlns="http://www.w3.org/2000/svg"', '<path d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>'],
      more: ['0 0 16 16', 'xmlns="http://www.w3.org/2000/svg"', '<path fill="currentColor" transform="matrix(1 0 0 1 2 7)" d="M0 1C0 0.4477 0.4477 0 1 0C1.5523 0 2 0.4477 2 1C2 1.5523 1.5523 2 1 2C0.4477 2 0 1.5523 0 1ZM5 1C5 0.4477 5.4477 0 6 0C6.5523 0 7 0.4477 7 1C7 1.5523 6.5523 2 6 2C5.4477 2 5 1.5523 5 1ZM10 1C10 0.4477 10.4477 0 11 0C11.5523 0 12 0.4477 12 1C12 1.5523 11.5523 2 11 2C10.4477 2 10 1.5523 10 1Z"></path>'],
      trash: ['0 0 16 16', 'fill="none" xmlns="http://www.w3.org/2000/svg"', '<path d="M2.5 4H13.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"></path><path d="M6 4V2.5C6 2.22386 6.22386 2 6.5 2H9.5C9.77614 2 10 2.22386 10 2.5V4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3.5 4V13C3.5 13.5523 3.94772 14 4.5 14H11.5C12.0523 14 12.5 13.5523 12.5 13V4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6.5 7V11M9.5 7V11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"></path>'],
      refresh: ['0 0 24 24', 'xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"', '<polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>'],
      check: ['0 0 16 16', 'fill="none" xmlns="http://www.w3.org/2000/svg"', '<path d="M3 8L6.5 11.5L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>'],
      close: ['0 0 16 16', 'xmlns="http://www.w3.org/2000/svg" fill="none"', '<path fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 2.56512 2.56512)" d="M6.3046 5.4349L10.8698 10L10 10.8698L5.4349 6.3046L0.8698 10.8698L0 10L4.5651 5.4349L0 0.8698L0.8698 0L5.4349 4.5651L10 0L10.8698 0.8698L6.3046 5.4349Z"></path>'],
      external: ['0 0 24 24', 'xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"', '<path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"></path><path d="m21 3-9 9"></path><path d="M15 3h6v6"></path>'],
      download: ['0 0 16 16', 'xmlns="http://www.w3.org/2000/svg" fill="none"', '<path d="M8 11.3333V2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 7.33301L8 11.333L12 7.33301" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12.6666 14H3.33325" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>'],
      gear: ['0 0 24 24', 'xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"', '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>'],
      grid: ['0 0 12 13', 'xmlns="http://www.w3.org/2000/svg" fill="none"', '<g clip-path="url(#clip0_30165_28096)"><path d="M6.00011 1.25003L6.00011 11.7501" stroke="currentColor" stroke-width="0.975" stroke-linecap="round" stroke-linejoin="round"></path><rect x="7.875" y="5" width="3.375" height="3" stroke="currentColor" stroke-width="0.975" stroke-linecap="round" stroke-linejoin="round"></rect><rect x="0.75" y="5" width="3.375" height="3" stroke="currentColor" stroke-width="0.975" stroke-linecap="round" stroke-linejoin="round"></rect></g><defs ><clipPath id="clip0_30165_28096"><rect width="12" height="12" fill="currentColor" transform="translate(0 0.5)"></rect></clipPath></defs>'],
      bell: ['0 0 12 12', 'xmlns="http://www.w3.org/2000/svg" fill="none"', '<path d="M7.5 1H4.5C4.22386 1 4 1.22386 4 1.5V2.5C4 2.77614 4.22386 3 4.5 3H7.5C7.77614 3 8 2.77614 8 2.5V1.5C8 1.22386 7.77614 1 7.5 1Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 2H9C9.26522 2 9.51957 2.10536 9.70711 2.29289C9.89464 2.48043 10 2.73478 10 3V10C10 10.2652 9.89464 10.5196 9.70711 10.7071C9.51957 10.8946 9.26522 11 9 11H3C2.73478 11 2.48043 10.8946 2.29289 10.7071C2.10536 10.5196 2 10.2652 2 10V3C2 2.73478 2.10536 2.48043 2.29289 2.29289C2.48043 2.10536 2.73478 2 3 2H4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6 5.5H8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6 8H8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 5.5H4.005" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 8H4.005" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>'],
      chevronRight: ['0 0 14 14', 'fill="none" xmlns="http://www.w3.org/2000/svg"', '<path d="M5 3.5 9 7l-4 3.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>'],
      chevronLeft: ['0 0 16 16', 'fill="none" xmlns="http://www.w3.org/2000/svg"', '<path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>'],
      chevronDown: ['0 0 14 14', 'xmlns="http://www.w3.org/2000/svg" fill="none" transition="transform 0.2s ease"', '<path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>'],
    }

    /** One WorkBuddy icon at an arbitrary size, coloured by currentColor. */
    function WbIcon({ name, size = 16, className }) {
      const spec = WB_ICONS[name]
      if (spec === undefined) return null
      return h('svg', {
        viewBox: spec[0], width: size, height: size, className,
        'aria-hidden': true, focusable: false,
        dangerouslySetInnerHTML: { __html: spec[2] },
      })
    }

    /** Line-art glyphs: text glyphs (◇✦⌁) fall back to tofu in some fonts. */
    const KIND_ICON = { expert: 'person', skill: 'sparkle', connector: 'link' }

    /** Kind glyphs, using the icons WorkBuddy itself renders for each kind. */
    function KindIcon({ kind, size = 15 }) {
      return h(WbIcon, { name: KIND_ICON[kind] ?? 'link', size })
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
.wbh-searchIcon{display:inline-flex;align-items:center;color:var(--dsw-alias-label-tertiary);flex:none}
.wbh-btnGhost,.wbh-btnPrimary{display:inline-flex;align-items:center;gap:5px}
.wbh-menuRowChev svg,.wbh-cardMenu svg{display:block}

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
            }, h(WbIcon, { name: 'external', size: 13 }), h('span', null, '打开授权页')),
            retryable && h('button', {
              type: 'button', className: 'wbh-btnPrimary', disabled: busy,
              onClick: () => { void onRetry() },
            }, h(WbIcon, { name: 'refresh', size: 13 }), h('span', null, busy ? '连接中…' : '重试连接')),
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
            h('span', { className: 'wbh-menuRowChev' }, h(WbIcon, { name: 'chevronRight', size: 14 })),
            )),
          ),
          h('div', { className: 'wbh-pane' },
            h('div', { className: 'wbh-paneHead' },
              h('span', { className: 'wbh-searchIcon' }, h(WbIcon, { name: 'search', size: 14 })),
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
        }, h(WbIcon, { name: 'plus', size: 14 })),
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
          h('span', { className: 'wbh-searchIcon' }, h(WbIcon, { name: 'search', size: 14 })),
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
