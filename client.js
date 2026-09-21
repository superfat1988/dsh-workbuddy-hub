/**
 * dsh-workbuddy-hub — browser half.
 *
 * DSH Web implementation of WorkBuddy's first-class
 * “专家·技能·连接器” entry:
 *
 *   sidebar.panellist + main  → left-rail global market page
 *   conversation.input.left   → compact + shortcut
 *   conversation.input.overlay→ installed-item rail / popover surface
 *   settings.plugins.tab      → operational settings page
 *
 * The Host owns all state and credentials. The browser only calls same-origin
 * /workbuddy-hub routes and never receives credential values.
 */
window.__ModuleLoader__.load({
  id: 'dsh-workbuddy-hub',
  factory: (require) => {
    // DSH's browser module loader reads module.exports, not a factory return
    // value alone. This deliberately mirrors dsh-pc-control/client.js.
    const module = { exports: {} }
    const exports = module.exports
    const React = require('react')
    const { createElement: h, useCallback, useEffect, useRef, useState } = React

    const API = '/workbuddy-hub'
    const CHANGED_EVENT = 'dsh-workbuddy-hub:changed'

    const STYLE = `
      .wbh-shell{box-sizing:border-box;width:100%;height:100%;min-height:0;overflow:auto;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary)}
      .wbh-page{box-sizing:border-box;max-width:1120px;margin:0 auto;padding:28px 32px 42px}
      .wbh-pageHead{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:20px}
      .wbh-pageTitle{font-size:20px;line-height:1.3;font-weight:650;letter-spacing:-.01em;margin:0;color:var(--dsw-alias-label-primary)}
      .wbh-pageSub{font-size:12px;line-height:1.55;color:var(--dsw-alias-label-secondary);margin:6px 0 0}
      .wbh-stat{display:inline-flex;align-items:center;gap:5px;flex:0 0 auto;padding:5px 9px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;background:var(--dsw-alias-bg-layer-2);font-size:11px;color:var(--dsw-alias-label-secondary);white-space:nowrap}
      .wbh-dot{width:7px;height:7px;border-radius:50%;background:var(--dsw-alias-label-success,#2b8a3e)}
      .wbh-plus{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;margin-right:4px;border:0;border-radius:7px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:18px;line-height:1}
      .wbh-plus:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
      .wbh-popover{position:absolute;left:0;bottom:calc(100% + 8px);width:min(440px,calc(100vw - 40px));max-height:min(510px,calc(100vh - 120px));background:var(--dsw-alias-bg-layer-1,#1b1f27);border:1px solid var(--dsw-alias-border-l2);border-radius:13px;box-shadow:0 16px 44px rgba(0,0,0,.36);z-index:1250;overflow:hidden}
      .wbh-browser{display:flex;flex-direction:column;min-height:0}
      .wbh-browser.page{border:1px solid var(--dsw-alias-border-l2);border-radius:14px;background:var(--dsw-alias-bg-layer-1);overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.06)}
      .wbh-tabs{display:flex;align-items:center;gap:3px;padding:8px 10px 0;border-bottom:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1)}
      .wbh-tab{padding:7px 12px;border:0;border-radius:8px 8px 0 0;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;cursor:pointer}
      .wbh-tab:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2)}
      .wbh-tab.on{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2);font-weight:600}
      .wbh-close{margin-left:auto;width:28px;height:28px;padding:0;border:0;border-radius:7px;background:transparent;color:var(--dsw-alias-label-secondary);font-size:14px;cursor:pointer}
      .wbh-close:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
      .wbh-searchRow{display:flex;gap:8px;padding:12px 12px 10px;background:var(--dsw-alias-bg-layer-1)}
      .wbh-search{box-sizing:border-box;flex:1;min-width:0;padding:8px 11px;border:1px solid var(--dsw-alias-border-l2);border-radius:9px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;outline:none}
      .wbh-search:focus{border-color:var(--dsw-alias-label-info,#5b8cff);box-shadow:0 0 0 2px rgba(91,140,255,.13)}
      .wbh-reload{padding:0 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:9px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:14px}
      .wbh-reload:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-3)}
      .wbh-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:0 12px 12px;overflow:auto;min-height:145px;max-height:455px}
      .wbh-popover .wbh-list{display:flex;flex-direction:column;max-height:330px}
      .wbh-card{display:flex;align-items:center;gap:10px;min-width:0;padding:10px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-layer-2)}
      .wbh-popover .wbh-card{padding:9px 10px}
      .wbh-cardIcon{display:flex;align-items:center;justify-content:center;flex:0 0 auto;width:30px;height:30px;border-radius:9px;background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-secondary);font-size:13px;font-weight:700}
      .wbh-cardBody{min-width:0;flex:1}
      .wbh-cardName{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12.5px;font-weight:600;color:var(--dsw-alias-label-primary)}
      .wbh-cardMeta{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:3px;font-size:10.5px;color:var(--dsw-alias-label-tertiary)}
      .wbh-kind{display:inline-flex;align-items:center;padding:1px 6px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;color:var(--dsw-alias-label-secondary);font-size:9.5px;line-height:1.45}
      .wbh-btn{padding:4px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:7px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:11px;cursor:pointer;flex:0 0 auto}
      .wbh-btn:hover:not(:disabled){background:var(--dsw-alias-bg-layer-3)}
      .wbh-btn:disabled{opacity:.52;cursor:default}
      .wbh-btn.busy{color:var(--dsw-alias-label-info,#5b8cff);border-color:var(--dsw-alias-label-info,#5b8cff)}
      .wbh-empty{grid-column:1/-1;padding:28px 12px;text-align:center;color:var(--dsw-alias-label-tertiary);font-size:12px}
      .wbh-note{padding:9px 12px;border-top:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:1.5;background:var(--dsw-alias-bg-layer-1)}
      .wbh-flags{margin-top:4px;color:var(--dsw-alias-label-warning,#b8860b);font-size:10px}
      .wbh-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 8px 7px}
      .wbh-chip{display:inline-flex;align-items:center;gap:5px;padding:3px 8px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;background:var(--dsw-alias-bg-layer-2);font-size:10.5px;color:var(--dsw-alias-label-secondary)}
      .wbh-chipKind{padding:0 5px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;color:var(--dsw-alias-label-tertiary);font-size:9px}
      .wbh-settings{box-sizing:border-box;max-width:860px;padding:24px 28px;display:flex;flex-direction:column;gap:14px;color:var(--dsw-alias-label-primary)}
      .wbh-secTitle{margin:0 0 7px;font-size:13px;font-weight:650}
      .wbh-row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:9px 11px;border:1px solid var(--dsw-alias-border-l2);border-radius:9px;background:var(--dsw-alias-bg-layer-2)}
      @media(max-width:700px){.wbh-page{padding:18px 14px 30px}.wbh-list{grid-template-columns:1fr}.wbh-pageHead{display:block}.wbh-stat{margin-top:10px}.wbh-popover{left:-34px;width:min(440px,calc(100vw - 24px))}}
    `

    const api = async (path, opts) => {
      const response = await fetch(API + path, opts)
      const body = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(body.error || `HTTP ${response.status}`)
      return body
    }

    const entryKey = entry => `${entry.kind}/${entry.name}`
    const kindLabel = kind => kind === 'expert' ? '专家' : kind === 'skill' ? '技能' : '连接器'
    const kindGlyph = kind => kind === 'expert' ? '◇' : kind === 'skill' ? '✦' : '⌁'
    const notifyChanged = () => window.dispatchEvent(new Event(CHANGED_EVENT))

    function useRevision() {
      const [revision, setRevision] = useState(0)
      useEffect(() => {
        const onChanged = () => setRevision(value => value + 1)
        window.addEventListener(CHANGED_EVENT, onChanged)
        return () => window.removeEventListener(CHANGED_EVENT, onChanged)
      }, [])
      return revision
    }

    function useAsync(loader, deps) {
      const [state, setState] = useState({ loading: true, data: null, error: null })
      useEffect(() => {
        let live = true
        setState({ loading: true, data: null, error: null })
        Promise.resolve().then(loader).then(
          data => { if (live) setState({ loading: false, data, error: null }) },
          error => { if (live) setState({ loading: false, data: null, error: String(error && error.message || error) }) },
        )
        return () => { live = false }
      }, deps)
      return state
    }

    function useMarketEntries(kind, query, revision) {
      return useAsync(async () => {
        // Server-side catalog fetch is cached; calling it first makes a newly
        // installed hub usable on its very first opening instead of returning 503.
        if (kind !== 'installed') await api('/catalog')
        if (kind === 'installed') {
          const registry = await api('/installed')
          return Object.values(registry.installed || {})
        }
        const result = await api(`/catalog/search?q=${encodeURIComponent(query)}&kind=${encodeURIComponent(kind)}`)
        return result.hits || []
      }, [kind, query, revision])
    }

    function MarketBrowser({ page = false, onClose }) {
      const [kind, setKind] = useState('experts')
      const [query, setQuery] = useState('')
      const [busy, setBusy] = useState('')
      const [notice, setNotice] = useState('')
      const inputRef = useRef(null)
      const revision = useRevision()
      const [manualRevision, setManualRevision] = useState(0)
      const allRevision = revision + manualRevision
      const resultState = useMarketEntries(kind, query, allRevision)

      useEffect(() => {
        if (!page) inputRef.current && inputRef.current.focus()
      }, [page])

      const install = useCallback(async entry => {
        const key = entryKey(entry)
        setBusy(key); setNotice('')
        try {
          const result = await api('/install', {
            method: 'POST', headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ kind: entry.kind, name: entry.name }),
          })
          const flags = result.report && result.report.flags && result.report.flags.length
          setNotice(`已安装「${entry.name}」${entry.kind === 'skill' ? '；下一轮对话即可按需加载。' : '。'}${flags ? ` 安全扫描标记 ${result.report.flags.length} 条。` : ''}`)
          notifyChanged()
          setManualRevision(value => value + 1)
        } catch (error) {
          setNotice(`安装失败：${error.message}`)
        } finally { setBusy('') }
      }, [])

      const uninstall = useCallback(async entry => {
        const key = entryKey(entry)
        setBusy(key); setNotice('')
        try {
          await api('/uninstall', {
            method: 'POST', headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ kind: entry.kind, name: entry.name }),
          })
          setNotice(`已移除「${entry.name}」。`)
          notifyChanged()
          setManualRevision(value => value + 1)
        } catch (error) {
          setNotice(`移除失败：${error.message}`)
        } finally { setBusy('') }
      }, [])

      const entries = resultState.data || []
      const tabs = [['experts', '专家'], ['skills', '技能'], ['connectors', '连接器'], ['installed', '已装']]
      const prompt = kind === 'experts' ? '搜索专家：合同、财报、论文、股票…'
        : kind === 'skills' ? '搜索技能：领券、监控、报告…'
          : kind === 'connectors' ? '搜索连接器：地图、邮件、网盘…' : '已安装条目'

      return h('section', { className: `wbh-browser${page ? ' page' : ''}` },
        h('style', null, STYLE),
        h('div', { className: 'wbh-tabs' },
          tabs.map(([id, label]) => h('button', {
            key: id, className: `wbh-tab${kind === id ? ' on' : ''}`,
            onClick: () => { setKind(id); setQuery(''); setNotice('') },
          }, label)),
          onClose && h('button', { className: 'wbh-close', onClick: onClose, 'aria-label': '关闭市场' }, '×'),
        ),
        kind !== 'installed' && h('div', { className: 'wbh-searchRow' },
          h('input', {
            ref: inputRef, className: 'wbh-search', value: query, placeholder: prompt,
            onChange: event => setQuery(event.target.value),
          }),
          h('button', { className: 'wbh-reload', title: '刷新', onClick: () => setManualRevision(value => value + 1) }, '↻'),
        ),
        h('div', { className: 'wbh-list' },
          resultState.loading && h('div', { className: 'wbh-empty' }, '正在读取市场目录…'),
          resultState.error && h('div', { className: 'wbh-empty' }, `读取失败：${resultState.error}`),
          !resultState.loading && !resultState.error && entries.length === 0 &&
            h('div', { className: 'wbh-empty' }, kind === 'installed' ? '尚未安装任何条目' : '没有匹配的条目'),
          entries.map(entry => {
            const key = entryKey(entry)
            const installed = kind === 'installed'
            const isBusy = busy === key
            return h('article', { className: 'wbh-card', key },
              h('span', { className: 'wbh-cardIcon', 'aria-hidden': true }, kindGlyph(entry.kind)),
              h('div', { className: 'wbh-cardBody' },
                h('div', { className: 'wbh-cardName', title: entry.name }, entry.name),
                h('div', { className: 'wbh-cardMeta' },
                  `${entry.files || 0} 文件 · ${Math.max(0, Number(entry.bytes || 0) / 1024).toFixed(0)} KB`
                  + (entry.hasSkillMd ? ' · Skill' : '')
                  + (entry.hasMcpJson ? ' · MCP' : '')
                  + (entry.hasCliJson ? ' · CLI' : '')),
                installed && entry.flags && entry.flags.length > 0 &&
                  h('div', { className: 'wbh-flags' }, `⚠ ${entry.flags.length} 条安全扫描标记`),
              ),
              h('span', { className: 'wbh-kind' }, kindLabel(entry.kind)),
              h('button', {
                className: `wbh-btn${isBusy ? ' busy' : ''}`, disabled: isBusy,
                onClick: () => installed ? uninstall(entry) : install(entry),
              }, isBusy ? '处理中' : installed ? '移除' : '安装'),
            )
          }),
        ),
        notice && h('div', { className: 'wbh-note', role: 'status' }, notice),
        h('div', { className: 'wbh-note' },
          kind === 'experts'
            ? '专家只推荐与召唤，不会自动替换你的对话角色；确认后才下载并以独立专家上下文执行。'
            : '安装与外部授权始终需要你的确认；已连接的只读 MCP 可按语义自动调用。'),
      )
    }

    function HubPanelIcon({ size, active }) {
      return h('svg', {
        width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round',
        'aria-hidden': true,
      },
      h('path', { d: 'M5 4.5h5.5V10H5zM13.5 4.5H19V10h-5.5zM5 13.5h5.5V19H5zM13.5 13.5H19V19h-5.5z' }),
      h('path', { d: 'm17.7 1 .45 1.35L19.5 2.8l-1.35.45L17.7 4.6l-.45-1.35-1.35-.45 1.35-.45z' }),
      )
    }

    function HubPage() {
      const health = useAsync(() => api('/health'), [])
      return h('main', { className: 'wbh-shell' },
        h('style', null, STYLE),
        h('div', { className: 'wbh-page' },
          h('header', { className: 'wbh-pageHead' },
            h('div', null,
              h('h1', { className: 'wbh-pageTitle' }, '专家 · 技能 · 连接器'),
              h('p', { className: 'wbh-pageSub' }, 'WorkBuddy 市场镜像 · 先浏览元数据，需要时才下载与安装'),
            ),
            h('span', { className: 'wbh-stat' },
              h('i', { className: 'wbh-dot' }),
              health.error ? '服务不可用' : '市场已连接'),
          ),
          h(MarketBrowser, { page: true }),
        ),
      )
    }

    function ComposerShortcut() {
      const [open, setOpen] = useState(false)
      return h('div', { style: { position: 'relative' } },
        h('style', null, STYLE),
        h('button', {
          className: 'wbh-plus', type: 'button', title: '专家 · 技能 · 连接器',
          'aria-label': '打开专家技能连接器市场', 'aria-expanded': open || undefined,
          onClick: () => setOpen(value => !value),
        }, '＋'),
        open && h('div', { className: 'wbh-popover' }, h(MarketBrowser, { onClose: () => setOpen(false) })),
      )
    }

    function InstalledChips() {
      const revision = useRevision()
      const registry = useAsync(async () => (await api('/installed')).installed || {}, [revision])
      const entries = Object.values(registry.data || {})
      if (entries.length === 0) return null
      return h('div', { className: 'wbh-chips' },
        h('style', null, STYLE),
        entries.map(entry => h('span', { className: 'wbh-chip', key: entryKey(entry), title: `${entry.kind}/${entry.name}` },
          h('span', { className: 'wbh-chipKind' }, kindLabel(entry.kind)), entry.name,
        )),
      )
    }

    function SettingsTab() {
      const revision = useRevision()
      const health = useAsync(() => api('/health'), [])
      const registry = useAsync(async () => api('/installed'), [revision])
      const entries = Object.values((registry.data && registry.data.installed) || {})
      return h('section', { className: 'wbh-settings' },
        h('style', null, STYLE),
        h('div', null,
          h('h2', { className: 'wbh-secTitle' }, 'WorkBuddy 市场状态'),
          h('div', { className: 'wbh-row' },
            h('span', null, h('i', { className: 'wbh-dot' }), health.error ? `服务异常：${health.error}` : `已连接 · ${health.data ? health.data.mirror : ''}`),
            h('span', { style: { color: 'var(--dsw-alias-label-tertiary)', fontSize: 11 } }, health.data ? health.data.store : ''),
          ),
        ),
        h('div', null,
          h('h2', { className: 'wbh-secTitle' }, `已安装（${entries.length}）`),
          entries.length === 0 && h('div', { className: 'wbh-empty' }, '在左侧「专家·技能·连接器」中浏览与安装。'),
          entries.map(entry => h('div', { className: 'wbh-row', key: entryKey(entry), style: { marginBottom: 6 } },
            h('span', null, `${kindLabel(entry.kind)} · ${entry.name}`, entry.flags && entry.flags.length > 0 && h('div', { className: 'wbh-flags' }, `⚠ ${entry.flags.length} 条扫描标记`)),
            h('span', { style: { color: 'var(--dsw-alias-label-tertiary)', fontSize: 11 } }, `${entry.files || 0} 文件`),
          )),
        ),
        h('p', { style: { margin: 0, color: 'var(--dsw-alias-label-tertiary)', fontSize: 12, lineHeight: 1.6 } },
          '需要 OAuth、扫码或 API Key 的连接器会在安装后启动独立的外部授权页；本页和浏览器端不会展示任何凭据值。'),
      )
    }

    exports.inject = ['slots']
    exports.apply = ctx => {
      // Primary WorkBuddy-like destination: a persistent global sidebar panel.
      ctx.slots.inject('main', () => ctx.slots.register({
        name: 'main', key: 'workbuddy-hub',
      }, HubPage))
      ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
        name: 'sidebar.panellist', id: 'workbuddy-hub', order: -90,
        label: () => '专家·技能·连接器',
      }, HubPanelIcon))

      // Composer shortcut and attached installed-item rail are supplemental.
      ctx.slots.inject('conversation.input.left', () => ctx.slots.register({
        name: 'conversation.input.left', id: 'workbuddy-hub-add', order: -90,
        label: () => '专家·技能·连接器',
      }, ComposerShortcut))
      ctx.slots.inject('conversation.input.overlay', () => ctx.slots.register({
        name: 'conversation.input.overlay', id: 'workbuddy-hub-installed', order: 90,
        label: () => '已安装 WorkBuddy 条目',
      }, InstalledChips))
      ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
        name: 'settings.plugins.tab', id: 'workbuddy-hub', order: 80,
        label: () => 'WorkBuddy 市场',
      }, SettingsTab))
    }

    return module.exports
  },
})
