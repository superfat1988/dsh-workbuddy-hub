# dsh-workbuddy-hub

WorkBuddy 专家 / 技能 / 连接器市场 → DeepSeek Harness 的移植枢纽插件。

个人研究用途：复用 WorkBuddy 市场的**数据**（目录、中文元数据、图标）与**交互语义**，
不 vendor 其闭源前端代码。

## 架构

| 层 | 位置 | 说明 |
|---|---|---|
| 官方真源 | `expert_center.json`（专家注册表，公开） + `copilot.tencent.com/v2/operation-platform/market/*`（技能/连接器，需登录） | **唯一真源**：目录、元数据、包下载、更新判定全部以官方为准 |
| 镜像灾备 | `superfat1988/workbuddyskills` 的 `mirror` 分支 | **默认关闭**的灾备开关（`mirrorFallback`）；官方挂了才临时打开 |
| 本地内容仓 | `~/workbuddyskills/` | `.meta/registry.json`、`.meta/mounts.json`、`.meta/icons/`、`skills/ experts/ connectors/` |
| DSH 挂载 | `~/.dsh/skills/<prefix><name>` | 符号链接（DSH 扫描器原生跟随） |
| 随插件 skill | `skills/workbuddy-find-tools`、`skills/workbuddy-experts` | 工具检索 / 专家推荐与召唤 |
| 随插件脚本 | `scripts/hub-find.mjs` | agent 的**紧凑检索入口**（专家/技能/连接器/已装清单）：本地过滤+排版，一次查询约 0.1–0.9KB，替代会把整段 JSON（12.7KB，最坏 473KB）塞进上下文的裸 curl；也绕开了连接栅栏（裸 curl 连 /health 都 401）|

**官方源是唯一真源，GitHub 镜像只是灾备**（`mirrorFallback: false` 是默认值）：
- 列表 / 目录 / 检索（`/market-list`、`/catalog`、`/search`）在官方失败时**不再静默换成镜像内容**，
  而是返回空列表 + 可读原因（未登录就直说「需要登录」）；
- 只有把 `mirrorFallback` 打开（`cordis.patch.yml` 或 profile patch）才会回落到镜像，
  此时响应里的 `source: "mirror"` 会如实标注「这不是官方数据」；
- **`GET /updates` 永远不用镜像**（纯官方元数据比对），与这个开关无关。

镜像的 `main` 分支只放 workflow，永不被改写；同步由 GitHub Actions 每日 05:17（北京）从
`main` 触发，把上游快照推到 `mirror`。`schedule` 只从默认分支读取 workflow，因此 workflow 必须留在 `main`。
`cordis.patch.yml` 里声明的 `upstreamRepo` 目前**没有任何代码读取**，不参与「在线检查 changelog、
失败回退镜像」之类的逻辑 —— 那套机制并不存在，不要据此预期任何上游在线检查行为。

## 配置

| 键 | 默认 | 说明 |
|---|---|---|
| `mirrorRepo` / `mirrorBranch` | `superfat1988/workbuddyskills` / `mirror` | 镜像仓（灾备时才用） |
| `mirrorFallback` | **`false`** | 镜像兜底开关。官方失败时是否用镜像内容兜底；默认关闭（官方是唯一真源），仅在官方出问题时临时打开救急 |
| `storeRoot` | `~/workbuddyskills` | 本地内容仓 |
| `skillPrefix` | `workbuddy-` | `~/.dsh/skills/` 下的挂载前缀 |
| `keepalive` | `true` | 后台每 30 分钟巡检并主动刷新凭证 |
| `localMcp` | **`false`** | 本地 MCP 服务器管理总开关（默认关闭）。打开后设置区才出现「本地 MCP 服务器」节，允许注册/启停本机 MCP 服务器（仅 loopback，v1 只支持 streamable-http，stdio 一律拒绝） |

## HTTP 路由（Host 侧 `/workbuddy-hub`，全部先过 `ctx.connection.requestRejection`）

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/health` | 运行状态 / store / mirror 分支 / `mirrorFallback` 当前值 |
| GET | `/catalog[?refresh=1]` | 镜像目录索引（6h 缓存）。**`mirrorFallback=false` 时返回 503 + 原因**，不再拉镜像 |
| GET | `/search?q=&kind=experts\|skills\|connectors&limit=` | 镜像检索。同上，默认关闭时返回 503 + 原因 |
| GET | `/installed` | 已装清单（连接器附带实时 `enabled`/`status`/`credentialRefs`） |
| GET | `/updates[?refresh=1]` | **检查更新**（只读）：纯官方元数据比对 —— 技能比官方 `version`、专家比官方 `updatedAt`、连接器比官方 MCP 定义哈希；取不到官方数据一律 `unknown` + 原因，**绝不**判「已是最新」。结果缓存 60s，`refresh=1` 强制重算；**永远不用镜像** |
| POST | `/install {kind,name}` | 按需安装（官方优先；技能/专家/连接器都记 `officialMeta` 溯源） |
| POST | `/uninstall {kind,name}` | 先拆传输层与技能链接，再删文件，并摘掉各会话里的挂载 |
| GET | `/mounted?sessionId=` | 本会话已挂载条目（只读，缺 sessionId 时按最近会话兜底并标 `sessionSource`） |
| POST | `/mount` \| `/unmount {sessionId,kind,name}` | 会话级挂载（安装 ≠ 挂载）；**写操作必须显式传 `sessionId`，缺失返回 409**，绝不兜底猜会话 |
| POST | `/connectors/enable` \| `/connectors/disable {name}` | 动态挂载/拆卸 MCP 传输 |
| GET | `/mcp/local` | 本地 MCP 服务器列表（`localMcp:false` 时 `guarded:true` + 原因、不返回条目数据） |
| POST | `/mcp/local {name,url,token?,tokenRef?,note?}` | 注册/更新本地 MCP 服务器；token 只写入凭据库，明文不落盘、不回显 |
| POST | `/mcp/local/enable` \| `/mcp/local/disable` \| `/mcp/local/remove {name}` | 启用（事务性，失败保持停用）/ 停用（立即 dispose）/ 移除（先停用再删条目） |
| GET | `/icon?kind=&name=` | 图标代理（按需从镜像取，磁盘缓存） |

## 检查更新 / 一键更新

设置区「已安装」列表顶部有「检查更新」；逐项徽标为 **有更新 / 已是最新 / 无法检查**，
只有「有更新」的行出现「更新」按钮，且顶部出现「全部更新（N）」（确认框里显示总下载量）。

判定规则（`GET /updates`，只读；实现见 `src/updates.js`）—— **只认官方元数据，不碰 GitHub、不算文件 sha**：

| 条目 | 依据 | 说明 |
|---|---|---|
| 技能 | 官方 skill 记录的 `version` vs 安装时记的 `officialMeta.version` | `version` 不同 → `update`；相同 → `current`；记录缺 `officialMeta.version` → `unknown`（重装一次即可记录）；官方按 `skill_id` 查不到 → `unknown`（已下架） |
| 专家 | 官方注册表原始条目的 `updatedAt` vs `officialMeta.updatedAt`（老记录退回 `installedAt`） | 必须用 `wb-experts.registry()` 的**原始条目**（`normalise()` 会把 `updatedAt` 丢掉）；远端更新 → `update`，相等/更旧 → `current`，缺任一时间戳或日期非法 → `unknown` |
| 连接器 | 官方该行 `mcp` 定义的规范化 JSON sha256 vs `officialMeta.defHash` | 规范化只取 `gateway_url / transport / auth_mode / ide_server_name / upstream_url / sandbox_url` 六个字段（键序固定、缺失 == 空串）；哈希不同 → `update`；缺 `defHash` → `unknown` |

- **安装时记录官方溯源**：`record.officialMeta = { version, updatedAt }`（技能）、
  `{ updatedAt }`（专家）、`{ defHash }`（连接器）；老记录没有 `officialMeta` 时**不伪造**，
  `/updates` 给 `unknown` 并提示「重装一次即可记录」。
- **未登录整体行为**：技能（`skill/get-by-ids`）与连接器（`registry2c/list`）都需要账号，
  未登录时相关条目**全部 `unknown`**，原因写明「需要登录」；专家注册表公开，未登录仍可正常比对。
- **更新 = 重新安装**：安装链路本来就先 `rm -rf` 再落盘（幂等），客户端直接复用
  `hub.install(kind, name, source==='official' ? 'official' : undefined)`。
- **查不到就说查不到**：官方接口失败 / 未登录 / 记录缺溯源时，相关条目显示「无法检查」并给出原因，
  界面**不会**把它渲染成「已是最新」。
- 响应里 `sources` 只有 `official: { ok, at, reason }`（不再有 `mirror`）；检查结果缓存 60 秒
  （`?refresh=1` 强制重算），缓存只在内存里，路由不写注册表、不动文件。

## 斜杠命令

- `/expert [专家名] [任务]` — 召唤已安装专家：读取人设，启动独立子会话；主对话不注入人设
- `/connector <连接器名> [on|off]` — 会话内启用/停用连接器

## 三类条目的语义

| 类型 | 安装后 | 交互 |
|---|---|---|
| 专家 expert | `.codebuddy-plugin/plugin.json` + `agents/<id>.md` | **召唤** → 独立子会话（`startContinuable` + `persona`） |
| 技能 skill | 符号链接进 `~/.dsh/skills` | **添加/挂载**，DSH 按 description 触发 |
| 连接器 connector | MCP 型带 `mcp.json`；CLI 型带 `cli.json` + `skills/` | **开关** = 真实连接状态；CLI 型的捆绑技能会被挂载 |

## 本地 MCP 服务器（localMcp）

把**用户自己在本机跑的 MCP 服务器**（如 Docker 里的 scrapling：`http://127.0.0.1:8002/mcp`）
纳入插件管理，不必手改 profile 配置。条目存在 `storeRoot/mcp-servers/<name>.json`
（与官方连接器 `connectors/` 分开，不污染连接器列表与 `/updates` 判定），
经 `buildMcpConfig` 复用官方连接器同一套 `@deepseek-ai/dsh-mcp-client` 准入与挂载链路。

**四道栅栏**（目标是「不让权限静默升级 + 全程可见 + 一键可撤」，不是防御已被完全控制的
agent —— 路由与其它插件路由共用同一道 DSH 连接栅栏，而 agent 本身就能 curl 这些路由）：

1. **默认关闭**：`localMcp:false` 时写路由一律 403，列表只回 `guarded:true` + 原因；
2. **仅 loopback**：URL 只接受 `127.0.0.1` / `localhost` / `::1`（任意端口），非本机一律 400 拒绝；
3. **v1 拒绝 stdio**：stdio 会在本机执行任意命令，本版本不提供（`transport: "stdio"` 注册直接 400）；
4. **可见 + 可撤**：注册/启用/停用/移除都打 `[wbh] localMcp …` console 日志（含来源 IP）并记时间戳；
   停用/移除立即 dispose mcp-client 行，工具当场从注册表消失。

- **凭据**：token 提交后经 `credentials.set(ref, value)` 只存 DSH 凭据库
  （`~/.dsh/.credentials.yaml`，0600，热加载）；条目文件与响应里只出现引用名
  （默认 `<NAME 大写>_MCP_TOKEN`，如 scrapling → `SCRAPLING_MCP_TOKEN`），**绝不出现明文**。
  凭据未配置时启用会按「未鉴权」明示降级（条目 `authMode: unauthorized`），服务器 401 也是可见失败。
- **命名空间**：`mcp__<name>__<tool>`；列表里的 `toolCount` 从 DSH 活工具注册表实时计算，拿不到显示「—」。
- **恢复**：插件启动时按条目自动恢复所有 `enabled` 的本地服务器；连不上只记 `lastError`
  （条目复位为停用），绝不让插件启动失败。

## 安全模型

- 下载内容逐文件扫描（piped-shell / eval / 动态函数 / 进程 spawn / 凭据词 / 外链），标记写入 registry
- `mcp.json` 视为**不可信数据**：仅放行 `stdio` / `streamable-http`，拒绝未知键、非法 URL/header、非字符串 args/env、多义服务器；
  `.json` 也纳入 `scanFlags`（mcp 定义类文件额外做值级扫描：`declares-command-execution` /
  `external-url` / `sensitive-header` / `sensitive-query-param`）
- `${VAR}` 只作凭证引用；值经 `credentials.resolve(ref)?.value` 临时解析，**不落盘、不回传**
- 启用是事务性的（`failOnStartupError: true`）；失败保持"已安装未启用"并记录 `lastError`
- `cli.json` 只保留净化后的需求（runtime / minVersion / authDomain），**不持久化平台命令模板**
- 专家人设解析限定在 store 内的真实路径：防穿越、防符号链接逃逸、标识符白名单、256KB 上限、拒绝 NUL，**从不执行下载的脚本**

## 开发

```bash
npm test        # 15 个套件（另 test:live 单独跑联网版）：mcp 校验 / 专家人设 / CLI 连接器 / 召唤 / 凭证轮换 /
                #   浏览器槽位 / client bundle / render smoke / session 契约 / pending expert /
                #   recent experts / auth store / keepalive / install 离线链 / 更新判定 /
                #   本地 MCP 管理 / package 完整性
npm run pack:check
```

安装到 web profile（profile 已 link 本项目）：

```bash
dsh plugin --profile web add /home/kaitzh/.openclaw/workspace/projects/dsh-workbuddy-hub
systemctl --user restart dsh-web.service    # 由用户执行
```

## 隔离验收方法（复现用）

用 patch overlay 让临时实例拥有自己的会话与内容仓，即可在不碰生产数据的前提下做真实端到端验收：

```yaml
# /tmp/wbh-accept/patch.yml
- id: session-persistence-jsonl
  config: { root: /tmp/wbh-accept/sessions }
- id: storage-json
  config: { root: /tmp/wbh-accept/storages }
- id: workbuddy-hub
  config:
    mirrorRepo: 'superfat1988/workbuddyskills'
    mirrorBranch: 'mirror'
    # 默认 false：官方是唯一真源，镜像只是灾备；要复现「官方失败→镜像兜底」才打开
    mirrorFallback: false
    storeRoot: '/tmp/wbh-accept/store'
    skillPrefix: 'wbh-accept-'
```

```bash
# 启动器参数必须放在 profile 名之前，否则会被 app 当作未知参数拒绝
node apps/cli/lib/bin.js --profile web --patch /tmp/wbh-accept/patch.yml \
  --host 127.0.0.1 --port 3085 --no-open
```

UI 自动化要点（CDP）：必须用**逐字符真实按键**（`Input.dispatchKeyEvent`）输入，
再点击 `button[aria-label="Send message"]`；`Input.insertText` 会让 DOM 文本与 React 状态脱节，
`document.execCommand` 单独使用永远不触发提交。

## 验收记录（2026-09-21，隔离实例实测）

HTTP 层：

| 检查 | 结果 |
|---|---|
| health | ok，分支 `mirror` |
| 中文检索 | 「同程」命中 1；专家中文名 `A股研究团队` |
| 技能安装+链接 | `wbh-accept-meituan-coupon-workbuddy/SKILL.md` 可达 |
| CLI 连接器（同程） | `mcp=False cli=node >=18 links=1`，技能经链接可达 |
| MCP 启用（本地 stdio） | `serverName=workbuddy_accept_cc5f347a ok=True` → `enabled=True` |
| MCP 停用 | `enabled=False status=disabled` |
| 凭证门禁（腾讯地图） | 拒绝：`failed refs=['TENCENT_MAP_KEY']` |
| 会话挂载 | `['expert/adort-design-expert']` |

UI 层：左栏入口存在 → 市场页标题 `专家 · 技能 · 连接器`、三 tab、60 张卡片、
首卡 `A股研究团队`、简介与头像齐全。

专家召唤端到端（隔离实例真实 composer 提交）：
```
已召唤「Ardot 设计专家」，独立专家会话：9f5f4a9b-361e-4255-8a02-886e1b920d56
```
子会话日志（解压后 22 事件）含 `turn/start`、`system/message`、`assistant/message`，
并可见完整人设（`请完整遵循` + `adort-design-expert`）；子会话推理自述
“the persona says I must check environment first”，证明人设确实生效。


## 数据层：官方来源优先

| 数据 | 来源 | 说明 |
|---|---|---|
| 专家目录（约 430，随官方注册表变动；中英名/职称/简介/Tag/快捷提示词） | 官方 COS 注册表 `expert_center.json`（MIT，无需登录） | `hub.marketList('expert')` |
| 专家头像 PNG / 人设 Markdown | 同一 COS 源直链 | 召唤用的人设与官方同源 |
| 技能 / 连接器目录 | 官方市场 API / 官方连接器注册表（需登录） | 官方失败时不再静默回镜像；镜像只在 `mirrorFallback: true` 时兜底 |
| 官方登录（技能页数据、连接器目录、用量） | OAuth 设备授权：`POST /wb-auth/start` 给出官方 authUrl → 浏览器登录 → `POST /wb-auth/poll` 轮换取 `{access_token, refresh_token, expires_in, uid}`，存 `~/workbuddyskills/.meta/state/` | 协议与上游 workbuddy2api 的两个实现一致（[linguo2625469/workbuddy2api-panel](https://github.com/linguo2625469/workbuddy2api-panel) · [ardeyouxipianyi/workbuddy2api-hub](https://github.com/ardeyouxipianyi/workbuddy2api-hub)；`copilot.tencent.com/v2/...`，Bearer + X-User-Id + CLI UA）；凭证不出本机 |

插件不依赖 DeepSeek 浏览器 cookie；官方会话由设备授权获得、可刷新、可 `/wb-auth/logout` 注销。

## 登录与账号保活

- **扫码登录**：设置区/市场页点「扫码登录」→ `POST /wb-auth/start` 返回官方 authUrl（OAuth 设备授权）→ 浏览器扫码确认 → 客户端 `POST /wb-auth/poll` 轮询取回 `{access_token, refresh_token, expires_in, uid}`；`POST /wb-auth/logout` 注销并清掉凭证与健康档。
- **主动刷新**：后台每 **30 分钟**巡检一次，`access_token` 剩余寿命**不足 2 小时**就调用 refresh_token 刷新（阈值 7200s，规则来自上游 workbuddy2api 的 `wb_scheduler.py`）。配置 `keepalive: false` 可整体关闭巡检。
- **失效判定**：刷新失败 / 官方错误码 12153（session dead）**连续 3 次**才判「登录已失效」（前两次只记 `lastError`，防误判；中途成功一次即清零计数）。判失效后界面显示「登录已失效，请重新扫码」，并停止使用该凭证。
- **凭证落盘**：`~/workbuddyskills/.meta/state/workbuddy-auth.json` 与健康档 `workbuddy-auth-health.json` 均以 **0600** 写入（另有 `chmod` 兜底）；凭据值不回传浏览器、不进日志。

## 已知限制

- 生产（`dsh-web.service`）需用户重启才会加载本插件的新代码
- 12306 类 MCP 在 NAS 出网策略下查询可能被反爬阻断（协议握手正常）
- 需凭证的连接器必须先配好凭证才能启用（这是设计行为）
- 与本插件无关的既有告警：`list slot "conversation.chat.turnTail" requires options.id`（来自其他插件）
