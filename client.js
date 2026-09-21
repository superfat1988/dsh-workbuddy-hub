/**
 * dsh-workbuddy-hub — browser half.
 *
 * WorkBuddy 式交互：
 *  - conversation.input.left : ➕ 按钮打开市场搜索弹窗
 *  - conversation.input.overlay : 弹窗面板 + 已装条目芯片行
 *  - settings.plugins.tab : 设置页（镜像状态 / 已装清单 / 凭证说明）
 *
 * 数据全部走同源 fetch('/workbuddy-hub/...')；无任何凭据读取或展示。
 */
window.__ModuleLoader__.load({
  id: 'dsh-workbuddy-hub',
  factory: (require) => {
    const React = require('react')
    const { createElement: h, useEffect, useRef, useState, useCallback } = React

    const API = '/workbuddy-hub'

    const STYLE = `
      .wbh-plus{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;margin-right:4px;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:16px;line-height:1}
      .wbh-plus:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
      .wbh-panel{position:absolute;bottom:calc(100% + 8px);left:0;width:420px;max-width:calc(100vw - 48px);max-height:440px;display:flex;flex-direction:column;background:var(--dsw-alias-bg-layer-1,#1b1f27);border:1px solid var(--dsw-alias-border-l2);border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.35);z-index:1250;overflow:hidden}
      .wbh-tabs{display:flex;gap:2px;padding:8px 10px 0;border-bottom:1px solid var(--dsw-alias-border-l2)}
      .wbh-tab{padding:6px 12px;border:0;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;cursor:pointer;border-radius:8px 8px 0 0}
      .wbh-tab.on{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2);font-weight:600}
      .wbh-search{margin:10px;padding:7px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;outline:none}
      .wbh-search:focus{border-color:var(--dsw-alias-label-info,#5b8cff)}
      .wbh-list{flex:1;overflow:auto;padding:0 10px 10px;display:flex;flex-direction:column;gap:6px}
      .wbh-card{display:flex;align-items:center;gap:10px;padding:9px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-layer-2)}
      .wbh-cardBody{flex:1;min-width:0}
      .wbh-cardName{font-size:12.5px;font-weight:600;color:var(--dsw-alias-label-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .wbh-cardMeta{font-size:11px;color:var(--dsw-alias-label-tertiary);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .wbh-kind{font-size:10px;padding:1px 7px;border-radius:999px;border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);flex:0 0 auto}
      .wbh-btn{padding:4px 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:7px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:11.5px;cursor:pointer;flex:0 0 auto}
      .wbh-btn:hover{background:var(--dsw-alias-bg-layer-3)}
      .wbh-btn:disabled{opacity:.5;cursor:default}
      .wbh-btn.busy{color:var(--dsw-alias-label-info,#5b8cff);border-color:var(--dsw-alias-label-info,#5b8cff)}
      .wbh-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 10px 8px}
      .wbh-chip{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;background:var(--dsw-alias-bg-layer-2);font-size:11px;color:var(--dsw-alias-label-secondary)}
      .wbh-chip .k{font-size:9.5px;padding:0 6px;border-radius:999px;border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-tertiary)}
      .wbh-chip button{border:0;background:transparent;color:var(--dsw-alias-label-tertiary);cursor:pointer;font-size:11px;padding:0 2px}
      .wbh-chip button:hover{color:var(--dsw-alias-label-danger,#d14343)}
      .wbh-empty{padding:18px 0;text-align:center;font-size:12px;color:var(--dsw-alias-label-tertiary)}
      .wbh-note{padding:8px 12px;font-size:11px;color:var(--dsw-alias-label-tertiary);border-top:1px solid var(--dsw-alias-border-l2)}
      .wbh-flags{margin-top:4px;font-size:10.5px;color:var(--dsw-alias-label-warning,#b8860b)}
      .wbh-settings{display:flex;flex-direction:column;gap:12px;font-size:13px;color:var(--dsw-alias-label-primary)}
      .wbh-secTitle{font-size:13px;font-weight:600;margin:0 0 6px}
      .wbh-row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:9px;background:var(--dsw-alias-bg-layer-2)}
      .wbh-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;vertical-align:middle}
      .wbh-dot.on{background:var(--dsw-alias-label-success,#2b8a3e)}
      .wbh-dot.off{background:var(--dsw-alias-label-tertiary,#6b7280)}
    `

    /* ---------------- data helpers ---------------- */

    const api = async (path, opts) => {
      const res = await fetch(API + path, opts)
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`)
      return body
    }

    const useAsync = (fn, deps) => {
      const [state, setState] = useState({ loading: true, data: null, error: null })
      useEffect(() => {
        let live = true
        setState(s => ({ ...s, loading: true, error: null }))
        fn().then(data => live && setState({ loading: false, data, error: null }))
          .catch(e => live && setState({ loading: false, data: null, error: String(e.message || e) }))
        return () => { live = false }
      }, deps)
      return state
    }

    /* ---------------- market panel ---------------- */

    const KIND_TABS = [
      ['experts', '专家'],
      ['skills', '技能'],
      ['connectors', '连接器'],
      ['installed', '已装'],
    ]

    function MarketPanel({ onClose, onChanged }) {
      const [kind, setKind] = useState('experts')
      const [q, setQ] = useState('')
      const [busyKey, setBusyKey] = useState(null)
      const [msg, setMsg] = useState(null)
      const inputRef = useRef(null)

      useEffect(() => { inputRef.current && inputRef.current.focus() }, [])

      const search = useAsync(async () => {
        if (kind === 'installed') {
          const reg = await api('/installed')
          return Object.values(reg.installed || {})
        }
        const r = await api(`/catalog/search?q=${encodeURIComponent(q)}&kind=${kind}`)
        return r.hits || []
      }, [kind, q])

      const install = useCallback(async (entry) => {
        const kindSingular = entry.kind // expert | skill | connector
        setBusyKey(entry.dir)
        setMsg(null)
        try {
          const r = await api('/install', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ kind: kindSingular, name: entry.name }),
          })
          const flags = r.report && r.report.flags && r.report.flags.length
            ? ` · ⚠ 扫描标记 ${r.report.flags.length} 条（spawns-process/凭据词等，见 registry）`
            : ''
          setMsg(`✓ 已安装 ${entry.name}${entry.kind === 'skill' ? '（skill 已挂载，下轮生效）' : ''}${flags}`)
          onChanged && onChanged()
        } catch (e) {
          setMsg(`✗ ${entry.name}: ${e.message}`)
        } finally {
          setBusyKey(null)
        }
      }, [onChanged])

      const uninstall = useCallback(async (entry) => {
        setBusyKey(entry.dir)
        setMsg(null)
        try {
          await api('/uninstall', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ kind: entry.kind, name: entry.name }),
          })
          setMsg(`已移除 ${entry.name}`)
          onChanged && onChanged()
        } catch (e) {
          setMsg(`✗ ${e.message}`)
        } finally {
          setBusyKey(null)
        }
      }, [onChanged])

      const hits = search.data || []

      return h('div', { className: 'wbh-panel', role: 'dialog', 'aria-label': 'WorkBuddy 市场搜索' },
        h('style', null, STYLE),
        h('div', { className: 'wbh-tabs' },
          KIND_TABS.map(([k, label]) =>
            h('button', {
              key: k, className: 'wbh-tab' + (kind === k ? ' on' : ''),
              onClick: () => setKind(k),
            }, label)),
          h('div', { style: { flex: 1 } }),
          h('button', { className: 'wbh-tab', onClick: onClose, title: '关闭' }, '✕'),
        ),
        kind !== 'installed' && h('input', {
          ref: inputRef, className: 'wbh-search', placeholder:
            kind === 'experts' ? '搜索专家：财报 / 合同 / 论文 / 股票…'
            : kind === 'skills' ? '搜索技能：领券 / 监控 / 报告…'
            : '搜索连接器：地图 / 邮件 / 网盘…',
          value: q, onChange: e => setQ(e.target.value),
        }),
        h('div', { className: 'wbh-list' },
          search.loading && h('div', { className: 'wbh-empty' }, '加载中…'),
          search.error && h('div', { className: 'wbh-empty' }, `✗ ${search.error}`),
          !search.loading && !search.error && hits.length === 0 &&
            h('div', { className: 'wbh-empty' }, kind === 'installed' ? '暂无已安装条目' : '没有匹配结果'),
          hits.map(entry => {
            const key = `${entry.kind}/${entry.name}`
            const isInstalled = kind === 'installed'
            return h('div', { className: 'wbh-card', key },
              h('span', { className: 'wbh-kind' }, entry.kind === 'expert' ? '专家' : entry.kind === 'skill' ? '技能' : '连接器'),
              h('div', { className: 'wbh-cardBody' },
                h('div', { className: 'wbh-cardName', title: entry.name }, entry.name),
                h('div', { className: 'wbh-cardMeta' },
                  `${entry.files} 文件 · ${(entry.bytes / 1024).toFixed(0)} KB` +
                  (entry.hasSkillMd ? ' · SKILL' : '') +
                  (entry.hasMcpJson ? ' · MCP' : '') +
                  (entry.hasCliJson ? ' · CLI' : '')),
                isInstalled && entry.flags && entry.flags.length > 0 &&
                  h('div', { className: 'wbh-flags' }, `⚠ ${entry.flags.length} 条扫描标记`),
              ),
              isInstalled
                ? h('button', {
                    className: 'wbh-btn' + (busyKey === entry.dir ? ' busy' : ''),
                    disabled: busyKey === entry.dir,
                    onClick: () => uninstall(entry),
                  }, busyKey === entry.dir ? '…' : '移除')
                : h('button', {
                    className: 'wbh-btn' + (busyKey === entry.dir ? ' busy' : ''),
                    disabled: busyKey === entry.dir,
                    onClick: () => install(entry),
                  }, busyKey === entry.dir ? '安装中' : '安装'),
            )
          }),
        ),
        msg && h('div', { className: 'wbh-note' }, msg),
        kind !== 'installed' && h('div', { className: 'wbh-note' },
          '安装需你确认；带凭据的连接器安装后需按引导完成一次授权。专家召唤由 workbuddy-experts 技能完成。'),
      )
    }

    /* ---------------- composer integration ---------------- */

    function ComposerAdd({ ctx, slots }) {
      const [open, setOpen] = useState(false)
      const installed = useAsync(async () => (await api('/installed')).installed || {}, [])

      const refresh = useCallback(() => {
        // refetch installed for chips
        api('/installed').then(r => installed.setState ? null : null).catch(() => {})
        // simplest: force rerender via key increment handled in parent
      }, [])

      return h('div', { style: { position: 'relative' } },
        h('style', null, STYLE),
        h('button', {
          className: 'wbh-plus', title: '专家 · 技能 · 连接器', 'aria-label': '专家·技能·连接器',
          onClick: () => setOpen(o => !o),
        }, '＋'),
        open && h(MarketPanel, {
          onClose: () => setOpen(false),
          onChanged: () => { /* chips refresh via reload below */ location.hash = location.hash; },
        }),
      )
    }

    function InstalledChips() {
      const st = useAsync(async () => (await api('/installed')).installed || {}, [])
      const entries = Object.values(st.data || {})
      if (entries.length === 0) return null
      return h('div', { className: 'wbh-chips' },
        h('style', null, STYLE),
        entries.map(e =>
          h('span', { className: 'wbh-chip', key: `${e.kind}/${e.name}`, title: `${e.kind}/${e.name} · ${e.installedAt || ''}` },
            h('span', { className: 'k' }, e.kind === 'expert' ? '专家' : e.kind === 'skill' ? '技能' : '连接器'),
            e.name,
          )),
      )
    }

    /* ---------------- settings tab ---------------- */

    function SettingsTab() {
      const health = useAsync(() => api('/health'), [])
      const reg = useAsync(() => api('/installed'), [])
      const count = Object.keys((reg.data && reg.data.installed) || {}).length
      return h('div', { className: 'wbh-settings' },
        h('style', null, STYLE),
        h('div', null,
          h('p', { className: 'wbh-secTitle' }, '镜像状态'),
          h('div', { className: 'wbh-row' },
            h('span', null,
              h('span', { className: 'wbh-dot ' + (health.error ? 'off' : 'on') }),
              health.error ? `服务异常：${health.error}` : `已连接 · ${health.data ? health.data.mirror : ''}`),
            h('span', { style: { color: 'var(--dsw-alias-label-tertiary)', fontSize: 12 } },
              health.data ? `内容仓 ${health.data.store}` : ''),
          ),
        ),
        h('div', null,
          h('p', { className: 'wbh-secTitle' }, `已安装条目（${count}）`),
          count === 0 && h('div', { className: 'wbh-empty' }, '暂无；在对话输入框点 ＋ 浏览市场'),
          Object.values((reg.data && reg.data.installed) || {}).map(e =>
            h('div', { className: 'wbh-row', key: `${e.kind}/${e.name}`, style: { marginBottom: 6 } },
              h('span', null, `${e.kind === 'expert' ? '专家' : e.kind === 'skill' ? '技能' : '连接器'} · ${e.name}`,
                e.flags && e.flags.length > 0
                  ? h('div', { className: 'wbh-flags' }, `⚠ ${e.flags.length} 条安全扫描标记`)
                  : null),
              h('span', { style: { color: 'var(--dsw-alias-label-tertiary)', fontSize: 11 } },
                `${e.files} 文件`),
            )),
        ),
        h('div', { style: { color: 'var(--dsw-alias-label-tertiary)', fontSize: 12 } },
          '连接器凭据：安装后按引导完成一次外部登录授权；凭据由 DSH 凭证管理与内容仓 .credentials 沙箱持有，本页面永不展示凭据内容。'),
      )
    }

    /* ---------------- plugin apply ---------------- */

    return {
      inject: ['slots'],
      apply(ctx) {
        const { slots } = ctx

        // ➕ 按钮 + 弹窗（composer 左侧）
        slots.inject('conversation.input.left', () => slots.register(
          { name: 'conversation.input.left' },
          (props) => h(ComposerAdd, { ...props }),
        ))

        // 已装芯片行（composer 内浮动条）
        slots.inject('conversation.input.overlay', () => slots.register(
          { name: 'conversation.input.overlay' },
          () => h(InstalledChips, null),
        ))

        // 设置页（Plugins 设置区的一个 tab，对齐 dsh-tavily-search 契约）
        slots.inject('settings.plugins.tab', () => slots.register(
          { name: 'settings.plugins.tab', id: 'workbuddy-hub', order: 80, label: () => 'WorkBuddy 市场' },
          () => h(SettingsTab, null),
        ))
      },
    }
  },
})
