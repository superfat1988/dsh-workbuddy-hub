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
cd ${DSH_CHECKOUT:-/path/to/deepseek-harness}
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
cd ${DSH_CHECKOUT:-/path/to/deepseek-harness}
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
- **寻址**：容器内的 `127.0.0.1` 不是宿主 → 让它抓宿主服务要用 **LAN IP**（`http://192.168.1.10:<port>/`，
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
     const require = createRequire('${DSH_CHECKOUT:-/path/to/deepseek-harness}/packages/experimental/inspector/package.json')
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
| **P10** | 专家面板输入关键词（如「合同」） | 出**官方注册表**结果（含**未安装**专家）；输入无命中串（如 `zzzzqqq`）→ 0 行 + 「没有找到与「zzzzqqq」匹配的专家」 | 面板行 + 空态文案 |
| **P11** | 先给某行点**图钉**，再输入无命中关键词 | 图钉项**也必须被过滤掉**（置顶只影响顺序，不绕过搜索）；清空关键词后图钉项回来 | 行数 + 空态 |
| **P12** | 专家面板底部「召唤更多专家」 | **弹出小窗口**（`.wbh-marketModal`，标题「更多专家」），内容 = 市场页目录（搜索/分类/卡片一致）；picker 自身关闭 | 弹窗 DOM + 截图 |
| **P13** | 在 P12 的弹窗里点某位**未安装**专家的「召唤」 | 直接加载到**打开它的那个对话**：本机安装 + `GET /mounted?sessionId=…` 出现该 `expert/*` + 输入框下方出 chip + 弹窗关闭（**不新建会话**） | mounted 响应 + chip + 弹窗状态 |
| **P14** | 弹窗里输入关键词 / 切 tab | 与市场页一致（搜到未安装专家、空态、可切专家/技能/连接器） | 卡片数 + 空态 |

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
| **MC2** | 注册非 loopback（`http://192.168.1.10:8002/mcp`）与 stdio（`transport:"stdio"`） | 都 400，error 分别说明「只允许本机地址」与「stdio 会在本机执行任意命令，本版本不提供」 | 响应 JSON |
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

## V. DSH 0.1.7 适配（双模型：0.1.6 磁盘副本 / 0.1.7 运行时声明）

> 背景：DSH `0.1.7-rc.2` 删除了 `agentPresets.copy()` / `.remove()`（预设改为**运行时声明**，
> 且 `$DSH_HOME/.agent-presets/` 不再被读取），并把会话日志代际从 V3 推到 V4。
> 本插件必须**在 0.1.6 与 0.1.7 上同时可用**，因此走能力探测的双路径。
> 交叉参考：`DSH/dsh-upgrade-prep/HANDOFF-workbuddy-hub.md`。

| ID | 项 | 预期 | 证据 |
|---|---|---|---|
| **V1** | `node test-dsh-071-adaptation.mjs` | 全绿。其中「0.1.7 形状」用**只有 register/resolve、没有 copy/remove** 的假 presets 跑真实 `ensureExpertPreset` —— 新路径只要碰一下旧 API 就 `TypeError`，这是「新路径不依赖已删 API」的可执行证明（强于 grep） | 命令输出 |
| **V2** | `grep -n "presets\.copy\|presets\.remove\|session\.v3" index.js` | 命中只允许出现在**注释**或**显式隔离的 0.1.6 兼容分支**里；0.1.7 路径不得依赖它们（由 V1 证明） | `grep` 输出 + V1 |
| **V3** | 专家预设字段来源（静态） | `id` = `workbuddy-<专家名>`（**不得改**，否则已选中该预设的老会话失效）；`name` ← 专家 `plugin.json.displayName`；`description` ← 注册表官方描述（缺失则人设描述）；`order` ← standard.order + 100；`plugins` ← loader 里 `preset-standard` 行的已解析 `config.plugins`，**只替换 persona 行的 `config.prefix`**，其余行逐字节不动（含 `!!js` 表达式） | V1 断言 + `index.js` 的 `standardPresetDeclaration` / `injectPersonaRows` |
| **V4** | disposer 生命周期（0.1.7） | disposer 由本插件持有（`expertPresetDisposers`），在 `ctx.effect` 的 teardown 里全量释放 —— 否则热重载后再声明同一 id 会抛 `Duplicate agent preset`；卸载专家时释放该条 | V1 的「释放后可重新声明」用例 |
| **V5** | 幂等与竞态（0.1.7） | 先 `resolve(id)` 探活；命中即复用（不再 register）；并发撞 `Duplicate agent preset` 视为既存成功；声明后 `resolve` 报 `broken` 必须**回滚 + 报错**，不留坏预设 | V1 的幂等/竞态/broken 用例 |
| **V6** | 启动补声明 | 0.1.7 下声明只活在进程里 → 启动后为**已安装专家**补声明（否则已选中该预设的老会话会 `agent-preset/not-found`，与遗留预设目录失效同一类故障）；失败只记日志、不影响启动 | 隔离实例日志 `[wbh] expert presets declared at startup: n/m` |
| **V7** | 会话 cwd 读取（代际无关） | 匹配 `^session(?:\.v(\d+))?\.jsonl(\.zstd)?$`；**两代同存时取最高代际**（v4 是 v3 的后继，v3 只是天然备份），同代际优先 `.zstd`；最高代际损坏时**退到下一代**而不是返回空；根目录从 `$DSH_HOME`（空白视为未设置）派生，不再硬编码 `/home/USER/.dsh` | V1 的 `sessionLogsNewestFirst` / `readSessionCwdFromDisk` 用例 |
| **V8** | 0.1.6 侧不回归（运行期） | 在 0.1.6 隔离实例上 `POST /expert-preset-ensure {name:<已装专家>}` → `{ok:true,presetId}`，且 `$DSH_HOME/.agent-presets/workbuddy-<name>/` 被创建（磁盘副本路径仍生效） | 隔离实例 + 目录清单 |
| **V9** | 0.1.7 侧运行期复验 | **升级完成后必做**：在 0.1.7 实例上 `POST /expert-preset-ensure` → `{ok:true}`；`remote.agentPresets.select` 能选中；会话恢复可读 V4；`web_search` 仍选中 tavily | 升级后实测（本项在 0.1.6 上无法验证） |
| **V10** | 客户端 `select` 链路 | 0.1.7 的 `@Remote('select')` 仍在（与 0.1.6 相同），客户端 `remote.agentPresets.select(sessionId, presetId)` 不需要改 | `git grep "Remote('select')" <tag>` 两版对照 |

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

---

# 追加验收：桌面端公开目录接入（2026-10-07）

**背景**：用户观察到「电脑上 WorkBuddy 自带的市场」比插件显示的多得多。实测确认差距在**连接器**
维度：官方注册表（登录态）本账号只有 **29** 条，而桌面客户端吃的是两份**匿名公开静态包**：

- `https://static.workbuddy.cn/connectors-config-v2/connectors-config.zip`（26.2MB，etag `a479f2e4…`）
- `https://static.workbuddy.cn/connector-agent-plugins/connector-plugins.zip`（25.8MB，etag `38bf3d72…`）

来源与桌面端自记的 `marketplace-meta` 元数据（`sourceKey`/`etag`/`sha256`）一致，非逆向私有接口。
专家维度**没有差距**：插件用的 `expert_center.json` 与桌面端同一份（429 位）。

| ID | 项 | 预期 | 证据 |
|---|---|---|---|
| **D1** | 目录规模 | `GET /desktop-catalog` → 317 条，可挂载 254（网关 186 / 直连 68），不可自动接入 63（stdio 11 / CLI 52） | `node scripts/accept-desktop-live.mjs` 步骤 1 输出 |
| **D2** | 合并口径 | 官方 ∪ 桌面，**同名官方优先不重复**；行级 `source`；响应带 `officialTotal`/`desktopTotal` | 验收步骤 2（打桩官方 1 条 → 合计 318）；`test-desktop-catalog.mjs` merge 用例 |
| **D3** | ~~真实可用性~~ **已订正（见 D15）** | 原文写的「`qq-mail` 匿名直连可用、12 个工具」是**假阳性**：当时的探测只发 `tools/list`，而 `api.mail.qq.com/mcp` 对未初始化请求会宽松回 200+12 个工具名；真实 `initialize` 回 401。现改为完整握手探测，`qq-mail` 如实判为不可用 | 2026-10-07 复测：`initialize` → 401 `Bearer token is missing`；接入账号 bearer → 401 `Invalid or expired access token` |
| **D4** | 端点自适配（已按 D15 加固） | 回落逻辑保留，但「可用」判定改为**完整 MCP 握手成功**才算；握手失败的端点只作为静态落盘值并如实标注 `probe.ok=false` + 原因 | 验收步骤 4/5（qq-mail 如实 502 + 探测原因） |
| **D5** | 网关型凭据纪律 | 网关型落盘 `Authorization: Bearer ${WORKBUDDY_TOKEN}`（不落明文）；未授权（17009）如实记进 `probe` 与注册表，调用报上游失败（502）而非假装成功 | 验收步骤 6/7 + 注册表断言 |
| **D6** | 不把账号 token 当第三方 Key | 用户自备凭据型（`tushare` 的 `${TUSHARE_TOKEN}`）直连上游、不注入 bearer；缺凭据时 `/connectors/tools` → 400 + `credentialRefs` | 验收步骤 8 |
| **D7** | fail-closed | stdio（`weisheng-scrm`）/ CLI（`awesun`）拒绝自动接入，理由随 400 返回；UI 侧同样拦下 | 验收步骤 9 |
| **D8** | 离线回归 | `npm test` 全绿（新增 `test-desktop-catalog.mjs` 14 项 + hub-find 双来源契约 + install-tool source 枚举） | 命令输出 |
| **D9** | 隔离纪律 | 验收全程 `storeRoot`/`skillsMount` 指向 mkdtemp；官方接口打桩；结束时生产 `registry.json`/`auth` 哈希未变 | 验收步骤 12 |
| **D11** | 装前安全卡覆盖目录包文件 | 桌面目录连接的预检把包内**实际会落盘的文件**（skills/scripts/token-schema）算进体量/脚本数/风险标记（与技能预检同一套 `scanFlags` 口径）；官方 NOT_FOUND 时 `hub-find.mjs inspect connector <name>` 自动回落目录记录 | `formatInspectCard` 实测输出（如 `picset-commerce-images`：16 文件 / 2 个可执行脚本 / 4 条凭据与外链标记）+ `test-hub-find.mjs` 7-4 用例 |
| **D12** | 双来源去重（生产 GUI 实测发现） | 官方注册表用账号侧 id（`tdocs-app`）、桌面目录用市场 id（`tencent-docs`），只按 name 去重会让「腾讯文档」「乐享知识库」「微云」「启信慧眼」「励销CRM」等在同一页各出现两次。改为两级去重（name + 「展示名+描述」大小写不敏感），官方行优先；实测隐藏 22 条（17 条同名 + 5 条异名同实体），合并总数 29+317−22 = **324** | 生产 GUI：修复前看到重复；`mergeConnectorRows` 对生产数据的实测输出 `{total:324, official:29, desktop:295, hiddenDesktopDuplicates:22}` + `test-desktop-catalog.mjs` 新增用例 |
| **D15** | 端点探测假阳性（生产实测发现，已修） | 只发 `tools/list` 的探测会被宽松端点骗过：`api.mail.qq.com/mcp` 未初始化时回 200+12 个工具名，真实 `initialize` 回 401 → 界面/记录会显示「12 个工具可用」，实际挂载必失败。**修**：`probeEndpoint` 与 `/connectors/tools` 统一改走 `handshakeTools()`（initialize → notifications/initialized → tools/list，带 `mcp-session-id` 续用），失败即如实报错 | 撤回演示：`scripts/accept-desktop-live.mjs` 步骤 4/5（qq-mail 探测 ok=false、`/connectors/tools` 502）+ 步骤 6（本地 stub MCP 服务端走通真实握手：2 个工具）+ `test-desktop-catalog.mjs` 的握手三态用例（宽松端点/完整握手/SSE） |
| **D16** | 桌面目录连接器无法「连接」（生产 GUI 实测发现，已修） | 卡片对「未绑定」连接器一律先走官方账号绑定 → 桌面目录条目不在官方注册表，报 `connector not found: qq-mail`，永远到不了安装/启用。**修**：桌面来源改走「装 → 启用 →（仅当失败原因是需要授权时）发起 OAuth」；直连型且无需账号的连接器也不再被登录门拦住 | 生产 GUI：修复前 `连接「QQ邮箱」失败：connector not found: qq-mail`；修复后进入安装+启用并如实报握手失败原因 |
| **D17** | 连接动作必须按「鉴权家族」分派（用户提问驱动的设计订正） | 用户预期「点连接 → 弹登录/授权窗 → 授权后再连接」**对网关型是正确语义**，但我 D16 的改法把桌面条目一律改成「先装再启用」，等于把该弹的授权窗绕过了。订正为三家族分派：① mcp.json 声明了 `${VAR}`（用户凭据型，68 条）→ **先要凭据**（无 OAuth 可弹）；② 无声明凭据（网关/账号侧鉴权，186 条）→ **先发起官方 OAuth**（弹授权页/登录窗），完成后回到「连接」建连；③ 官方账号侧不认这条（17008，如 qq-mail）→ 才回落本地装+启用，失败如实报（含握手原因 + 「官方账号侧不认这条连接器」） | `src/Catalogue.jsx` 家族分派 + `test-render.mjs` 三条断言（凭据家族/OAuth 家族/不认这条要说明）+ 生产实测：通达信点连接弹出真实 `auth.tdx.com.cn` 授权页 |
| **D18** | MCP OAuth 2.1 接入（本轮新增功能） | 连接器授权按端点自述分派：401 + `resource_metadata` → 发现授权服务器 → **动态注册**（loopback 回调 + PKCE + 公开客户端）→ 授权页（扫码/登录）→ loopback 回调 → 换 token → **进 DSH 凭据库** → `mcp.json` 只写 `${WORKBUDDY_OAUTH_<NAME>_TOKEN>}`；401/到期用 refresh_token 续期（`/connectors/enable` 到期前自动续一次） | ① `test-mcp-oauth.mjs` 13 项（PKCE/发现/DCR/授权 URL/换 token/刷新/客户端登记/回调 state·超时·路径）② `scripts/accept-desktop-live.mjs` 场景 13（假 MCP + 假 AS 真回环）：授权前 502 → 回调 → token 入凭据库 → **授权后 1 个工具** → 刷新后 token 轮换 ③ 生产实测依据：QQ邮箱 401 自述 `resource_metadata`、AS 元数据、DCR 接受 loopback（见 D19） ④ **跨机兜底**：`POST /connectors/mcp-oauth/complete` 支持把浏览器地址栏的回调链接整段粘回来完成换 token（loopback 只绑 DSH 本机；授权页开在别的机器时靠这条），验收场景 ⑧⑨ 覆盖（含 state 校验与「无进行中流程」拒绝） |
| **D19** | QQ邮箱的授权机制查证（生产/PC 双侧） | PC 端 `.workbuddy/connectors/<uid>/.credentials.v3.json` 的 `mcpClientInfo["qq-mail\|<hash>"]` 给出 `client_id=002e8cd14071aad2` + deep-link 回调；实测 `api.mail.qq.com/mcp` 401 → protected-resource（AS=`wx.mail.qq.com`）→ AS 元数据含 `registration_endpoint`；**DCR 用 loopback 回调实测 HTTP 200 拿到 client_id** | 命令输出 + PC 侧文件（值已掩码） |
| **D20** | 桌面连接器图标（生产实测发现，已修） | 早期实现把图标 URL 编成 `https://static.workbuddy.cn/connectors-config-v2/icons/<name>.<ext>` —— **实测 404**（图标只在包内）。修为：目录记录只留包内路径 `iconFile`，行映射给出插件自己的 `/icon?kind=connector&source=desktop&name=<n>`，宿主在 `/market-list`、`/installed` 响应里按请求 Host 补成同源绝对 URL（`<img>` 需要绝对地址；DSH 栅栏靠浏览器 cookie，同源图片能过） | 验收场景 3b（桌面行 icon 指向插件路由 + `/icon` 返回 `image/*` 且字节 > 100）；`test-desktop-catalog.mjs` 断言 `iconFile`/行映射 |
| **D21** | MCP OAuth 适用面全量核对（用户要求） | 对 252 条可挂载连接器逐个 probe（只发 initialize）：**150 条上游自述 MCP OAuth**（401 + `resource_metadata`）、67 条用户凭据、34 条网关型、1 条探测失败。结论：**多数连接器应走 MCP OAuth**，且「网关也 401、上游又自述 OAuth」的（tdx/腾讯文档/GitHub…）应优先走上游 —— 不依赖 WorkBuddy 账号 | `/tmp/scan-auth.json` 逐条明细（150/67/34/1） |
| **D22** | 端点选择与 token 归属（D21 驱动的修复） | ① 安装时若 OAuth 自述来自**上游**，落盘端点选上游（否则 token 会被发到不认它的网关）；② `/connectors/mcp-oauth/start` 在 mcp.json 那条不自述 OAuth 时**再探目录里的上游**（网关 17008 的 QQ邮箱 正是这种）；③ 授权完成后 `finalizeMcpOauth` **同时改写 mcp.json 的 url 与 Authorization 引用**，`probe` 记录里带 `oauthHint` | 验收场景 ⑩（假网关 17008 → 上游发现 OAuth → 落盘 url 改为上游 → 枚举到工具）；场景 8 的 tdx 断言相应改为「落上游」 |
| **D10** | 网关型连接的授权入口（生产 GUI 实测） | 在市场页点「连接」一条**未绑定**的桌面目录连接器（通达信 tdx-connector）→ 插件按既有语义调 `/connectors/auth-start`，界面如实提示「请在打开的页面完成「通达信」授权；若没有自动打开，点下面链接」，链接指向真实授权页 `https://auth.tdx.com.cn/tdx-oauth/page_workbuddy_oauth.html?...`。即：**目录内连接器的官方 OAuth 入口在生产的 GUI 里真的能发起** | 生产 GUI 19:06 实测（提示文案 + 授权链接）+ 早前 `/console/as/connector/oauth/<name>/start` 直连返回真实 `authorize_url` |
| **D10b** | 待用户完成（未验证） | 用户在该页完成通达信账号授权 → 该连接器变为「已绑定」→ 再点「连接」应走 安装 + 启用 + 网关放行。**需要用户自己的第三方账号登录**，我不代做 | 待用户完成后复测 |
| **D13** | 生产 GUI 端到端核对（重启后） | 来源行 = 「官方注册表 29 条 · 桌面端公开目录新增 295 条（…另有 22 条与官方是同一连接器，已去重）」；「腾讯文档」只出现一次（官方 `tdocs-app`）；CLI 行（腾讯会议/企业微信/飞书）显示「不可自动接入」且按钮禁用；搜索「通达信」精确命中 | 生产 GUI 19:02–19:06 实测 |
| **D14** | 宿主响应直读（独立于浏览器） | 用隔离 storeRoot（软链生产 desktop 目录 + 复制凭据）跑 `GET /market-list?kind=connector&pageSize=500` → `{total:324, official:29, desktop:295, desktopDuplicates:22}`，`腾讯文档` 行数 = 1 且 `source=official` | 命令输出 |

**已知边界（如实记录）**：
- 目录内 152 条标 `visible_in: internal/iOA`，公共账号可能不可用 —— 插件如实标注来源与不可用原因，不伪装成功；
- CLI 型 52 条（`npm install -g …`）与 stdio 11 条一律不自动接入（与既有审计结论一致）；
- 目录包约 50MB，缓存在 `<storeRoot>/.meta/desktop/`，按 etag 增量刷新（默认 6h）。
