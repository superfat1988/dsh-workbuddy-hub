# dsh-workbuddy-hub 发布前验收清单

> 用途：发布前由**独立验收方**逐项执行，产出「通过/不通过 + 证据」。
> 验收方**只读**：不改代码、不 commit、不重启生产；发现问题只报告（附 `文件:行号` 与复现步骤）。
> 基线：`git log -1` 的 HEAD 即被测提交；工作树必须 clean。

---

## 0. 环境准备（可复现，务必照做）

生产实例（3080）**不要动**。全部验收在隔离实例里做。

### 0.1 基础隔离实例（含两个预置工作区）

> **隔离纪律**：任何指向临时 `storeRoot` 的实例都必须同时设 `skillsMount` 到临时目录，
> 否则装技能会往真实 `~/.dsh/skills` 写软链（已修：`linkSkill/unlinkSkill` 现在接受挂载根，
> 安装/卸载链路会传 `cfg.skillsMount`）。

```bash
rm -rf /tmp/acc && mkdir -p /tmp/acc/storages /tmp/acc/ws-alpha /tmp/acc/ws-beta
ln -s ~/.dsh/profiles /tmp/acc/profiles          # 复用 profile（插件是 link: 本地仓库）
python3 - <<'PY'
import json, datetime, os
now = datetime.datetime.now().isoformat() + 'Z'
ws = {}
for wid, path, title in [('aaaa1111-0000-4000-8000-000000000001','/tmp/acc/ws-alpha','alpha'),
                         ('bbbb2222-0000-4000-8000-000000000002','/tmp/acc/ws-beta','beta')]:
    ws[wid] = {'path': path, 'title': title, 'sessionIds': [], 'createdAt': now, 'updatedAt': now}
json.dump({'unit':{'name':'workspace','version':2},
  'global':{'initialized':True,'workspaceIds':list(ws),'archivedSessionIds':[]},
  'tables':{'workspaces':ws}}, open('/tmp/acc/storages/workspace.json','w'), ensure_ascii=False, indent=2)
PY
cd /home/kaitzh/deepseek-harness
DSH_HOME=/tmp/acc nohup node --max-http-header-size=131072 apps/cli/lib/bin.js \
  web --host 127.0.0.1 --port 3999 --no-open > /tmp/acc.log 2>&1 &
sleep 18
grep -o "127.0.0.1:3999/?token=[A-Za-z0-9_-]*" /tmp/acc.log | head -1 | sed 's|.*token=||' > /tmp/acc.tok
```

> **`--max-http-header-size=131072` 必须带上**：不带的话客户端把 70 个插件拼成一个 bundle URL 会
> 被服务端 **HTTP 431** 拒掉，页面报 `Failed to load plugins`，所有 UI 验收都做不了。
> 这是环境限制，不是插件缺陷。

浏览器打开 `http://127.0.0.1:3999/?token=$(cat /tmp/acc.tok)`，首次会出现
**Internal Testing Notice** 弹窗 —— 必须点掉（脚本里用 `[class*="_dialog_"]` 里最后一个 button），否则遮罩挡住一切点击。

### 0.2 未登录态实例（用于 L 组）

```bash
cp -a ~/workbuddyskills /tmp/acc-nologin
rm -f /tmp/acc-nologin/.meta/state/workbuddy-auth.json      # 只删登录态，保留已装内容
cat > /tmp/acc-nologin-patch.yml <<'EOF'
- id: workbuddy-hub
  config:
    storeRoot: '/tmp/acc-nologin'
    # 必加：否则隔离实例装技能时仍会往用户真实 ~/.dsh/skills 塞软链（曾泄漏过断链）
    skillsMount: '/tmp/acc-nologin/.dsh-skills'
EOF
# 启动命令在上面的基础上加 --patch，端口换 3998。
# ⚠️ --patch 的位置有讲究：必须写成 `web --patch <file> --host … --port …`
# （紧跟 web 之后、--host 之前）。写到命令末尾会报 unknown option（实测）。
cd /home/kaitzh/deepseek-harness
DSH_HOME=/tmp/acc nohup node --max-http-header-size=131072 apps/cli/lib/bin.js \
  web --patch /tmp/acc-nologin-patch.yml --host 127.0.0.1 --port 3998 --no-open \
  > /tmp/acc-nologin.log 2>&1 &
```

### 0.3 凭证失效（stale）实例（用于 K 组）

在 0.2 的副本里写入**假**凭证与健康档（**绝不能用真实 refresh_token**）：

```bash
python3 - <<'PY'
import json, os, time
st = '/tmp/acc-nologin/.meta/state'; os.makedirs(st, exist_ok=True)
json.dump({'access_token':'FAKE','refresh_token':'FAKE','expires_in':3600,
           'obtainedAt':int(time.time()*1000)-10*3600*1000,'uid':'fake-uid','nickname':'假账号'},
          open(st+'/workbuddy-auth.json','w'), indent=2)
json.dump({'consecutiveFailures':2,'lastError':'previous','lastCheckAt':0,'staleAt':None},
          open(st+'/workbuddy-auth-health.json','w'), indent=2)
PY
# 启动后【保活开着】，开服巡检会再失败一次 → 3 → 判 stale
```

### 0.4 只读宿主 API 探针（很多项不用点浏览器，直接打接口更硬）

```bash
# /tmp/probe.mjs 骨架：cookie jar 先过 /?token=xxx 拿会话 cookie，再打 /workbuddy-hub/*
# 关键只读路由：
#   GET  /workbuddy-hub/wb-auth                                  登录态（configured/stale/lastError/keepalive）
#   GET  /workbuddy-hub/installed                                 已装清单
#   GET  /workbuddy-hub/catalog                                   镜像目录计数（mirrorFallback=false 时 503 + 原因）
#   GET  /workbuddy-hub/market-list?kind=…&q=…&page=1             市场列表（source=official|mirror；默认关镜像兜底）
#   GET  /workbuddy-hub/updates[?refresh=1]                       检查更新（纯官方元数据比对）
#   GET  /workbuddy-hub/expert-injection?sessionId=…               该会话实际注入的专家
#   GET  /workbuddy-hub/expert-assemble?sessionId=…                deployment:persona-prefix 正文
#   GET  /workbuddy-hub/mounted?sessionId=…                        挂载列表
#   POST /workbuddy-hub/mount  {sessionId,kind,name}               挂载
```

### 0.5 浏览器相关验收：分两类，别混用

**A. 抓取 / 截图（读页面、看渲染结果）→ 用已注册的 scrapling MCP**

- 本体在 Docker：容器 `scrapling`（`pyd4vinci/scrapling:latest`），宿主 `127.0.0.1:8002` → 容器 `8000`，
  启动参数实测为 `mcp --http --host 0.0.0.0 --port 8000 --no-auth`（loopback 绑定，无需 token）。
- **DSH 侧已注册**（2026-09-25）：`~/.dsh/profiles/web/cordis.patch.yml` 末尾一行
  `@deepseek-ai/dsh-mcp-client`（`transport: streamable-http` / `serverName: scrapling` /
  `url: http://127.0.0.1:8002/mcp`）→ 工具以 `mcp__scrapling__<tool>` 暴露，共 13 个：
  `fetch / bulk_fetch / stealthy_fetch / bulk_stealthy_fetch / session_fetch / session_make_request /
  open_session / open_request_session / close_session / list_sessions / make_request / bulk_get / screenshot`。
  （DSH 会**热加载**这个 patch，改完不需要重启；实测 web 侧进程立刻与 8002 建立了连接。）
- 脚本里直接调 MCP 的协议要点：先 `initialize` 并从**响应头**取 `mcp-session-id`，后续请求带该头；
  响应是 SSE，取 `data: ` 那一行再 `JSON.parse`。
- **寻址**：容器内的 `127.0.0.1` 不是宿主 → 让它抓宿主服务要用 **LAN IP**（`http://192.168.2.185:<port>/`，
  实测通；`127.0.0.1:<port>` 会 `ERR_CONNECTION_REFUSED`；`host.docker.internal` 未配置）。
  验收隔离实例时，实例要绑 `0.0.0.0`，并在 profile 的 `trustedHosts` 里加上对应 authority。
- **不要在本机 `pip install scrapling`**：那是往技能目录塞一份 469MB 的重复本体（本项目犯过一次，已删）。

**B. 交互（点击 / 输入 / 多步流程）**

- 容器里的 scrapling MCP **做不到**：那 13 个工具没有 `click` / `type` / `fill`，容器内也没有 playwright。
- 本机有两条**不需要新装**的路（2026-09-25 实测）：
  1. **DSH 仓库自带的 node Playwright + 系统 chromium（推荐）**——仓库里装着 `playwright@1.61.1`，
     但没有 `~/.cache/ms-playwright` 浏览器缓存，所以必须用 `executablePath` 指系统 chromium：
     ```js
     import { createRequire } from 'node:module'
     const require = createRequire('/home/kaitzh/deepseek-harness/packages/experimental/inspector/package.json')
     const { chromium } = require('playwright')
     const page = await (await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] })).newPage()
     ```
     实测 `hover` / `click` / `type` 全部可用。
  2. `/tmp/wbh-cdp.mjs` + `/tmp/lib.mjs`（CDP 直连本机 Chromium）——退路；注意 DSH 新实例首次的
     Internal Testing Notice 弹窗（`[class*="_mask_"]`）会全屏遮挡，必须先关掉再操作。
- 另外 `127.0.0.1:16002` 上有一个本机 CDP 网关（回 `local CDP requires the loopback endpoint`），未进一步接入。

### 0.6 收尾纪律：验收 agent 起的浏览器必须杀干净

用 CDP/Playwright 起 headless Chromium 时，请在结束时杀掉**整个进程组**（先 `pkill -P <pid>`，再 `kill <pid>`）——
只删 `user-data-dir` 不会结束进程。本会话泄漏过两个（`--remote-debugging-port=16011/16012`）跑了 8 小时才发现。

收尾自查：`ss -ltn | grep -E ':(1601[0-9]|92[0-9][0-9])'` 应为空。
（本机常驻的 `:16000` = XkasmVNC 远程桌面、`:16002` = 用户 `fygo-browser` 的沙箱服务，**都不是我们的，别动**。）

---

## A. 自动化与产物（必须先过，否则后面无意义）

| ID | 步骤 | 预期 | 证据 |
|---|---|---|---|
| **A1** | `set -o pipefail && npm test` | exit 0；**17 个套件**全部 `OK`/`PASSED`（联网版 `npm run test:live` 单独跑，离线会 SKIP）| 尾部输出 |
| **A2** | `npm run build:client` 后 `git status --short` | `client.js` 无变化（证明 src 与产物同步） | 命令输出 |
| **A3** | `node test-package.mjs` | 通过；且其中「真打包→解压→import」一步成功 | 输出里 `import('./index.js') 成功` |
| **A4** | `npm pack --dry-run --json`，检查产物清单 | 含 `index.js expert-persona.js mcp-manager.js wb-market.js wb-experts.js wb-cats.js wb-unzip.js scan.js wb-inspect.js client.js client.css cordis.patch.yml` 与 `skills/*` | 文件清单 |
| **A5** | 跑完 `npm test` 后检查 `~/workbuddyskills/.meta/registry.json` 的 mtime 与 md5 | **与跑之前完全一致**（测试不得写用户真实状态） | 前后对比 |

## I. inspect 预检 + workbuddy_install 审批工具

> 前提：隔离实例（0.1/0.2）+ 插件已加载；登录态实例测 skill/connector 正常流，未登录实例测 NEED_LOGIN/fail-closed。

| ID | 步骤 | 预期 | 证据 |
|---|---|---|---|
| **I1** | 登录态实例：`node scripts/hub-find.mjs inspect expert <已收录专家>`（宿主仓库内执行，无需实例） | 输出六行安全卡（INSPECT/体量/可执行脚本/风险标记/外网命令凭据/头部）；专家通常「可执行脚本: 无、风险标记: 无」 | 命令输出 |
| **I2** | `inspect skill xlsx` 与 `inspect connector <已收录连接器>` | 技能卡列出脚本数与风险标记（spawns-process/external-url 等）；连接器卡列出官方网关外链与「外网/命令/凭据」 | 命令输出 |
| **I3** | `inspect expert ghost-xxx` / `inspect connector no-such` | 一行 `NOT_FOUND 官方市场/注册表没有…`，退出码 3 | 输出 + `$?` |
| **I4** | 未登录实例状态跑 `inspect skill xlsx` | 一行 `NEED_LOGIN inspect skill/xlsx 需要登录…`（退出码 1） | 输出 |
| **I5** | inspect 全程审计：跑完后 `find <storeRoot> -newer <标记文件>`（或对比 md5） | **零新增/修改文件**（inspect 不落盘、不碰 storeRoot） | 文件对比 |
| **I6** | 工具注册：隔离实例的会话里看 agent 工具清单（或日志 `[wbh]`），确认 `workbuddy_install` 在列且参数含 kind/name/source | 注册成功 | 工具清单/日志 |
| **I7** | **无审批通道**（headless 无浏览器应答的隔离实例）让模型调 `workbuddy_install` | 返回 fail-closed 文案「当前没有可用的审批通道，出于安全未安装（fail-closed）」；注册表**无**新记录；控制台有 `approval=unavailable` 审计行 | 工具返回 + registry + 日志 |
| **I8** | 有审批通道的会话（浏览器打开）让模型装一个技能：先 inspect、讲清用途与风险、问用户、调工具 | 弹出 DSH 原生审批卡（含安全卡摘要 reason）；批准后安装成功且返回含 flags/linked；会话日志有 `approval/asked` + `approval/decided: allowed-once` | UI 截图 + 会话事件 |
| **I9** | 同上但在审批里点**拒绝** | 工具返回「用户未批准…未安装」；注册表无记录；审计行 `approval=rejected` | 工具返回 + registry + 日志 |
| **I10** | 用工具装一个连接器（批准后） | 记录 `enabled:false`；未调用 `/connectors/enable` 前无 MCP 传输（loader 无 mcp-client 行）；mcp.json 里凭据只有 `${WORKBUDDY_TOKEN}` 引用 | registry + loader + 文件 |
| **I11** | 一致性：同一 storeRoot 下分别经工具与 `POST /install` 装同名条目，比对两条 registry 记录 | 除时间戳外字段一致（kind/name/dest/source/files/bytes/flags）——证明路由与工具复用同一 `installEntry` | registry 对比 |

## I2. workbuddy_uninstall 审批工具 + update-check 脚本（与 I 组同环境）

| ID | 步骤 | 预期 | 证据 |
|---|---|---|---|
| **I2-1** | 隔离实例会话里让模型调 `workbuddy_uninstall`（无审批通道实例） | 返回 fail-closed 文案「当前没有可用的审批通道，出于安全未卸载（fail-closed）」；注册表/文件/挂载**全部原样**；控制台有 `[wbh] uninstall … approval=unavailable` 审计行 | 工具返回 + registry + 目录对比 + 日志 |
| **I2-2** | 有审批通道的会话移除一个技能：先说明将移除什么 → 用户同意 → 调工具 | 弹出 DSH 原生审批卡（reason 含文件数/体量/安装时间/不可撤销）；批准后注册表无记录、目录被删、`prunedSessions` 如实报数 | UI 截图 + registry + 工具返回 |
| **I2-3** | 审批里点**拒绝** | 工具返回「用户未批准…未卸载」；零副作用（注册表/文件/挂载原样）；审计行 `approval=rejected` | 工具返回 + 日志 |
| **I2-4** | 卸载一个**已启用**的连接器 | MCP 行先被 dispose（loader 无该 mcp-client 行）再删文件；`connectors/<name>/` 不留残骸 | registry + loader 状态 |
| **I2-5** | 一致性：同一 storeRoot 下分别经工具与 `POST /uninstall` 卸载同一种条目 | 「删除后」状态一致（注册表无该 key、挂载被摘、目录消失）——证明路由与工具复用同一 `uninstallEntry` | registry + mounts 对比 |
| **I2-6** | `node <插件目录>/scripts/hub-find.mjs update-check`（宿主仓库内执行即可） | 每行一条 `kind/name \| 状态 \| 本地→远端` + 末尾汇总 `# 共 N 项：…`；历史遗留安装（无 `officialMeta`）输出「无法检查」并注明缺什么，**绝不**显示「已是最新」 | 命令输出 |
| **I2-7** | `update-check --json` | 一行合法 JSON 数组，元素带 `status` 与中文 `label` | 命令输出 |
| **I2-8** | 跑完 update-check / inspect 后对比 storeRoot 的 md5/mtime | **零变化**（两个子命令都只读） | 前后对比 |

## L. 未登录态（0.2 实例）

| ID | 步骤 | 预期 | 证据 |
|---|---|---|---|
| **L1** | 只读探针 `GET /wb-auth` | `configured:false` | 响应 JSON |
| **L2** | 市场页 → 切到「连接器」标签 | 显示**就地登录卡**（含二维码）；**不**显示「暂无连接器」；**不**显示镜像连接器列表 | 截图/DOM 文本 + 连接器卡片数 |
| **L3** | 市场页顶栏右侧 | 有账号胶囊，文案「未登录 · 登录」 | DOM 文本 |
| **L4** | 点账号胶囊 | 弹出 modal 登录卡（含二维码 + 倒计时 + 打开链接/复制链接兜底） | DOM：`.wbh-modalRoot` + `.wbh-authQr img` |
| **L5** | 进入任一会话，点输入框「＋」→ 悬停「专家」 | 面板**底部**有一行「未登录 · 登录后可加载官方目录」；点它弹出登录卡 | DOM 文本 + 点击后 modal |
| **L6** | 二维码倒计时走完（或把 `LOCAL_QR_TTL_MS` 调小后重试） | 出现「二维码已过期」+ 一键刷新；点刷新重新出码 | 状态文案 |
| **L7** | 未登录下从市场页**召唤**一位**已装**专家 | 能新建会话 + composer 出现该专家 chip（专家能力不依赖登录） | chip + `[wbh] pending expert applied` 日志 |
| **L8** | 市场页 → 切到「技能」标签 | 与连接器页一致：显示**就地登录卡**（含二维码，原因「技能目录与技能包下载需要 WorkBuddy 账号」）；**不**显示「暂无技能」；**不**显示镜像技能列表 | 截图/DOM 文本 + 卡片数 |
| **L9** | 探针 `GET /market-list?kind=skill`（未登录，`mirrorFallback` 默认关） | `ok:true`、`rows:[]`、`source:"official"`，且 `error` 是可读的「需要登录…」；**不得**返回镜像行 | 响应 JSON |

> 注：官方 auth API **不暴露**「已扫码待确认」与 TTL（连伪造 state 也只返回同一个 `11217`），
> 所以「已扫码」态不存在是**设计如此**，`src/auth-flow.js` 顶部有说明 —— **不要**当成缺陷。

## K. 登录态与保活（0.3 实例）

| ID | 步骤 | 预期 | 证据 |
|---|---|---|---|
| **K1** | 用假凭证 + `consecutiveFailures:2` 启动（保活开启），等首轮巡检 | 健康档变成 `consecutiveFailures:3` 且写入 `staleAt` | `cat workbuddy-auth-health.json` |
| **K2** | 探针 `GET /wb-auth` | 旧字段（`configured/uid/nickname/expiresAt`）**均保留**，且有 `stale:true`、`lastError`、`keepalive{lastCheckAt,consecutiveFailures}` | 响应 JSON |
| **K3** | 市场页顶栏 | 胶囊变成「登录已失效 · 重新登录」 | DOM 文本 |
| **K4** | 连接器页 | 就地登录卡 + 原因文案「登录已失效，请重新扫码」 | DOM 文本 |
| **K5** | `keepalive:false` 启动同一实例 | 定时器**完全不巡检**（健康档 `lastCheckAt` 不变） | 前后对比 |
| **K6** | 调 `POST /wb-auth/logout` 后再 `GET /wb-auth` | `configured:false`，且凭证文件与健康档都被清掉（历史 bug：注销曾 500 且从不生效） | 响应 + 文件存在性 |

## P. picker（输入框「＋」，需要 composer 挂载：先新建会话）

| ID | 步骤 | 预期 | 证据 |
|---|---|---|---|
| **P1** | ＋ → 悬停「专家」 | 面板**顶部有搜索框**（placeholder「搜索专家」） | DOM：`.wbh-flyout.is-expert .wbh-flyoutSearch input` |
| **P2** | 在专家面板依次点第 1、第 2 位专家 | 任何时刻**只有 1 个专家 chip**；第 2 次提示「已替换「A」→「B」…」 | chip 数量 + 提示文案 |
| **P3** | 同上第二次点击后，探针查 `GET /mounted?sessionId=…` | 该会话 keys 里**只有一位** `expert/*`（是后选的那位） | 响应 JSON |
| **P4** | 同上，探针查 `GET /expert-injection?sessionId=…` | `injected:true` 且 `expert` = **后选的那位**（chip 不得是假的） | 响应 JSON |
| **P5** | 在 picker 里选一位专家，观察 composer | **不新建会话**（`window.__wbh.composerSession()` 不变） | 前后 sessionId |
| **P6** | 反复选不同专家后再打开面板 | 最近选过的专家排在（非置顶的）最前面；置顶项仍在最前 | 面板行序 |
| **P7** | picker 里再选一个**技能**和一个**连接器**，再选另一位专家 | 技能/连接器叠加为多个 chip；专家仍只有 1 个 | chip 列表 |
| **P8** | 连接器面板里**点击**（不是回车）一行未连接的连接器 | 与回车一致：连接器被 attach 到当前会话 → 输入框下方出现带图标的 chip；停用状态先被启用（`GET /mounted` 可见该 key） | chip DOM/截图 + mounted 响应 |
| **P9** | 连接器行尾的**开关**（行内小 switch） | 点击开关 = 启用/停用（显式控件，不承担 attach）；整行点击/回车只走 attach，不重复弹窗 | 行为对比 + mounted 响应 |

## M. 市场页

| ID | 步骤 | 预期 | 证据 |
|---|---|---|---|
| **M1** | 搜索框输入**能命中**的词（如 `文博凯`） | 结果被正确筛选 | 卡片数 + 卡片名 |
| **M2** | 搜索框输入**不可能命中**的词（如 `zzzz不存在的词zzzz`） | **不能**显示全部；显示空态「没有找到与「…」匹配的专家，试试其他关键词」 | 空态文案 + 卡片数=0 |
| **M3** | 清空搜索 | 恢复完整列表 | 卡片数 |
| **M4** | 点某位专家的「召唤」 | 跳转新会话 + chip 到位；日志含 `pending expert set` / `applied` | 日志 + chip |
| **M5** | 召唤后**切换工作区**（再选另一个工作区的新会话） | 新会话**同样**出现该专家 chip（专家跟会话走，不依赖工作区解析） | 第二个会话的 chip |
| **M6** | 召唤后立刻再召唤**另一位**专家（不开始对话） | 最终只生效最后一位（召唤会立刻新建会话并消费待生效专家，本来就没有可替换的对象，**不要求任何提示**） | 最终 chip |

## E. 专家注入真相（最硬的证据）

| ID | 步骤 | 预期 | 证据 |
|---|---|---|---|
| **E1** | 对已挂专家的会话 `GET /expert-assemble?sessionId=…` | `deploymentPersonaText` 是**该专家**人设（不是 `coding agent`），字符数 > 1000 | 响应摘要 |
| **E2** | 同一会话 `GET /expert-injection?sessionId=…` | `injected:true`，`expert` 与 chip 一致 | 响应 JSON |
| **E3** | `cat ~/workbuddyskills/.meta/mounts.json` | 该会话只有一位 `expert/*`；挂载与 chip 一致 | 文件内容 |
| **E4** | 手动 `POST /mount` 连挂两位不同专家后再查 injection | 注入的是**后挂**那位，且 mounts 里只剩一位（回归 P3/P4 的宿主侧兜底） | 响应 JSON |

## S. 边界与异常

| ID | 步骤 | 预期 | 证据 |
|---|---|---|---|
| **S1** | 市场页搜一个不存在的**技能**关键词 | 同样给出未命中空态（不是全量） | 空态文案 |
| **S2** | 未装任何专家的环境调用 `/expert`（命令）或空态 | 给出可理解的提示，不崩 | 输出 |
| **S3** | 断网/官方接口不可用时打开市场页（`mirrorFallback` 默认关） | **给出可读错误**（「读取失败：需要登录…」/「官方…暂不可用」），**不得**白屏，也**不得**静默显示镜像内容；把 `mirrorFallback: true` 打开后才回落到镜像并在 `source` 里如实标注 | 页面文本 + `source` 字段 |
| **S4** | `POST /mount` 传非法 name（含 `/`）与空 sessionId | 400/409 且不写脏数据 | 响应码 + mounts 未变 |
| **S5** | 未登录时把 `storeRoot` 指向临时目录启动 | 插件正常起来，不报错、不写用户真实目录 | 启动日志 + 目录对比 |
| **S6** | `GET /health` | 返回 `mirrorFallback:false`（默认值），可据此判断灾备开关状态 | 响应 JSON |
| **S7** | `mirrorFallback:false` 下 `GET /catalog` 与 `GET /search?q=x&kind=skills` | 均为 503 且 `error` 说明「镜像兜底已关闭」；**不**返回镜像内容 | 响应码 + 响应 JSON |

## U. 检查更新 / 一键更新（设置区「已安装」）

> 判定依据已改为**纯官方元数据**（技能比官方 `version`、专家比官方 `updatedAt`、
> 连接器比官方 MCP 定义哈希）；**不再碰 GitHub、不再算文件 sha**，与 `mirrorFallback` 无关。

| ID | 步骤 | 预期 | 证据 |
|---|---|---|---|
| **U1** | 已登录实例探针 `GET /updates?refresh=1` | `ok:true`，`sources` **只有** `official:{ok,at,reason}`（**不再有 mirror**），`counts{update,current,unknown}`，`entries[]` 含 `key/kind/name/status/remoteVersion/localVersion/remoteAt/localAt/remoteHash/localHash/installedAt/files/bytes/reason` | 响应 JSON |
| **U2** | 连点两次 `GET /updates`（60s 内） | 第二次 `cached:true`，且不再打官方注册表 / 官方技能接口 / 连接器注册表 | 响应 + 网络计数 |
| **U3** | 未登录实例（0.2）`GET /updates?refresh=1` | 专家**仍给出判定**（注册表公开）；技能/连接器**全部 `unknown`** 且 reason 含「需要登录」；技能/连接器的 `counts.current` **必须为 0** | 响应 JSON |
| **U3b** | 让官方技能接口失败（断网或打桩 500）后 `GET /updates?refresh=1` | 相关技能 `status:"unknown"` 且 reason 含「官方技能接口不可用」；`counts.current` **不得**包含这些条目 | 响应 JSON |
| **U3c** | 检查 `sources.official.reason` 与每条 unknown 的 `reason` | 每个 unknown 都写清原因（未登录 / 接口不可用 / 已下架 / 缺安装时溯源）；**不得**出现「查不到却判 current」 | 响应 JSON |
| **U4** | 设置区「已安装」→「检查更新」 | 每行出现徽标（有更新/已是最新/无法检查）；只有「有更新」行有「更新」按钮；顶部出现「全部更新（N）」 | DOM 文本 |
| **U5** | 点「全部更新」 | 先出现行内确认并显示**总下载量**（MB，估算值带「约」）；确认后才开始逐项更新 | DOM + 安装日志 |
| **U6** | 更新一项已装技能后再 `GET /updates?refresh=1` | 该项变 `current`（新记录写入了 `officialMeta.version`，与官方一致）；注册表 `installedAt` 更新、文件被重装（先删后落） | 前后响应 + 目录 mtime |
| **U7** | 更新失败（限流/断网/安装失败） | 界面给出可区分的原因并带 HTTP 状态；**不得**静默，也不得显示「已是最新」 | 通知文案 |
| **U8** | 注册表里造一条**没有** `officialMeta` 的老记录后再 `GET /updates?refresh=1` | 该条 `unknown`，reason 明确「缺少安装时记录的官方版本 / MCP 定义哈希，重装一次即可记录」；**不得**判「已是最新」 | 响应 JSON |

## MC. 本地 MCP 服务器（隔离实例；`storeRoot` 指真实仓副本 + `localMcp:true`）

> token 一律用假值（64 位十六进制即可）；**任何日志/响应/条目文件里出现 token 明文即 FAIL**。
> 顺带要求 `skillsMount` 指向临时目录（隔离纪律），`keepalive:false`。

| ID | 步骤 | 预期 | 证据 |
|---|---|---|---|
| **MC1** | `POST /mcp/local {name:"scrapling", url:"http://127.0.0.1:8002/mcp", token:<假值>}` → `GET /mcp/local` | 注册 200；列表可见、`enabled:true`（自动启用）、`tokenRef:"SCRAPLING_MCP_TOKEN"`、`toolCount` 为数字或 null | 响应 JSON |
| **MC2** | 注册非 loopback（`http://192.168.1.5:8002/mcp`）与 stdio（`transport:"stdio"`） | 都 400，error 分别说明「只允许本机地址」与「stdio 会在本机执行任意命令，本版本不提供」 | 响应 JSON |
| **MC3** | 另起一个 `localMcp:false` 实例（或去掉该配置）重试写路由 | 全部 403 + 「localMcp: true」指引；`GET /mcp/local` 返回 `guarded:true` 且 `servers:[]` | 响应 JSON |
| **MC4** | `grep -r <假token明文> <storeRoot>`；同时检查 `GET /mcp/local` 响应体 | 零命中；条目文件与响应里只有 `SCRAPLING_MCP_TOKEN` 引用名 | grep 输出 |
| **MC5** | 控制台抽查 `[wbh] localMcp` 日志 | register/enable/disable/remove 各一条，含来源 IP 与时间戳，无 token 明文 | 控制台输出 |

## R. 发布就绪与一致性

| ID | 步骤 | 预期 | 证据 |
|---|---|---|---|
| **R1** | 读 `README.md`，逐条对照**实际行为**（召唤语义、工作区、登录与保活、随插件 skill、~/.dsh 挂载） | 无与实现不符的描述 | 引用具体行号 |
| **R2** | `package.json` 的 `main/exports/files/peerDependencies/engines` | 自洽；`exports` 指向的文件都在产物里 | 文件 + 产物清单 |
| **R3** | 空跑一次「照 README 安装」的关键步骤（用临时目录） | 步骤可执行、无缺文件 | 命令输出 |
| **R4** | 检查是否有明文凭据落盘且权限 > 0600 | `workbuddy-auth.json`（及 health）为 **0600** | `ls -l` |
| **R5** | 代码里不应留会刷屏的调试日志塞满生产控制台 | `[wbh]` 日志可接受（多为 info），无报错级噪音 | 控制台抽样 |

---

## 判定与交付格式

验收方须输出：

1. **总判定**：可发布 / 修完阻塞项再发布 / 不建议发布。
2. **逐项表**：`ID | 判定(PASS/FAIL/BLOCKED) | 证据(命令与关键输出) | 备注`。
   - `BLOCKED` 只能用于**环境不可用**（并说明卡在哪一步），不能用来代替 PASS/FAIL。
3. **缺陷清单**（仅列**已核实**的）：每条含 `文件:行号`、复现步骤、影响、建议。
   - 只报**确认的**问题；推测放「待确认」。
4. **与既有结论的冲突**：若发现与项目既有说明（README/代码注释/历史提交信息）矛盾，明确指出。
5. **未覆盖项**：如实列出没做的项与原因。

**纪律**：只读；不使用真实 refresh_token 做实验；不修改生产 3080；不为了「让结果好看」而放宽预期。
