# 官方 web 端 UI 取值来源（对齐用）

本插件的 picker / chip 样式不是"看着像"，而是从官方产物里抄出来的。这份文件记录**怎么拿到**
以及**抄了哪些规则**，方便以后官方改版后重新对齐。

## 怎么拿（不需要登录）

官方营销站 `https://www.workbuddy.cn/` 是公开的；真正的 app 是 `https://www.workbuddy.cn/app/…`
（`/app/experts`、`/app/connectors`、`/app/skills`）。app 的产物在 `static.workbuddy.cn`，
**未登录也能加载 shell 与全部静态 CSS**（数据要登录，样式不要）。

```bash
# 1) 用本机浏览器打开 app（browser-act 本机 chrome 即可，不需要云 key）
#    在页面里读 link[rel=stylesheet] / network requests --type stylesheet 拿到 chunk 列表
# 2) 直接下 CSS（公开 CDN）
curl -s -O https://static.workbuddy.cn/web/agents/<build>/assets/genie-chat-ui-<hash>.css
curl -s -O https://static.workbuddy.cn/web/agents/<build>/assets/main-<hash>.css
# 3) 在 CSS 里搜类名（下面这张表就是搜出来的）
```

上次核对时的 build：`b870386c8a167b0d4f3b564291ee5f53aa6a170e`（会变，按 `link` 里的实际 URL 取）。

## 抄了哪些（对照表）

### 1) 已加载条目的 chip —— `genie-chat-ui-*.css`

| 官方选择器 | 官方值 | 本插件 |
|---|---|---|
| `.cr-chip-base` | `inline-flex; gap:4px; height:32px; padding:0 8px; border:none; border-radius:8px; background:transparent; transition:background-color .15s ease` | `.wbh-railChip` |
| `.cr-chip-base--static:hover` | `background: rgba(0,0,0,.06)` | `.wbh-railChip:hover` |
| `.cr-chip-icon` | `16×16; color: rgba(0,0,0,.5)`（hover 换 `.cr-chip-icon--hover` = ✕） | `.wbh-chipClose`（前置 ✕） |
| `.cr-chip-label` | `font-size:13px; font-weight:500; line-height:20px; color: rgba(0,0,0,.5)`；hover → `.9` | `.wbh-chipLabel` |
| `.cr-connector-chip__logo` | `16×16; border-radius:50%; overflow:hidden; background:#f5f5f5; margin-left:-4px` | `.wbh-chipLogo(.is-connector)` |

结构 = **[关闭][logo][名称]**（与官方截图一致）。

### 2) 开关 —— 官方用的是 TDesign `t-switch`（`vendor-ui-*.css`）

| 官方选择器 | 官方值 | 本插件 |
|---|---|---|
| `.t-switch` | `height: var(--td-comp-size-xxxs)=16px; min-width:16/.618≈26px; border-radius:999px; background:#ddd; transition: all .2s cubic-bezier(.38,0,.24,1)` | `.wbh-toggle` |
| `.t-switch:hover` | `background:#c6c6c6` | 同 |
| `.t-switch.t-is-checked` | `background: var(--td-brand-color)`（本站主题为绿） | `#00b96b` |
| `.t-size-s .t-switch__handle` | `top:2px; left:2px; 12×12; border-radius:999px; transition: all .2s cubic-bezier(.38,0,.24,1)` | `.wbh-toggle i` |
| `.t-size-s.t-is-checked .t-switch__handle` | `left:calc(100% - 2px); transform: translate(-100%)` → **位移走 transform** | `transform: translateX(10px)`（`left` 固定 2px） |

### 3) 两个踩过的坑（务必记住）

1. **DSH 把插件 CSS 包在 `@layer` 里**，而皮肤样式（`html[data-dsh-skin] button{transition:…}`）
   **未分层** —— 未分层规则无条件压过分层规则（与特异性无关）。所以开关 track 的 `transition`
   必须写 `!important`，否则会被皮肤降级成 `.13s` 的通用按钮过渡（看起来就是"动画不流畅"）。
2. **CSS 注释不能嵌套**：在注释里再写 `/* … */` 会把后面的规则一起吞掉（曾导致
   `.wbh-toggle{...}` 整条规则失效，开关塌成 6px 高、圆角 0）。

## 相关契约测试

- `test-selection-hydration.mjs`：宿主挂载 → chip 的对账（刷新/切会话不再丢 chip）。
- `test-render.mjs`：chip 官方数值、开关官方曲线 + transform 位移、产物同步。
