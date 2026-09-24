# dsh-workbuddy-hub

WorkBuddy 专家 / 技能 / 连接器市场 → DeepSeek Harness 的移植枢纽插件。

个人研究用途：复用 WorkBuddy 市场的**数据**（目录、中文元数据、图标）与**交互语义**，
不 vendor 其闭源前端代码。

## 架构

| 层 | 位置 | 说明 |
|---|---|---|
| 镜像控制面 | `superfat1988/workbuddyskills` 的 `main` | 只放 workflow，永不被改写 |
| 内容快照 | 同仓 `mirror` 分支 | 上游全量内容，插件从这里按需下载 |
| 本地内容仓 | `~/workbuddyskills/` | `.meta/registry.json`、`.meta/mounts.json`、`.meta/icons/`、`skills/ experts/ connectors/` |
| DSH 挂载 | `~/.dsh/skills/<prefix><name>` | 符号链接（DSH 扫描器原生跟随） |
| 随插件 skill | `skills/workbuddy-find-tools`、`skills/workbuddy-experts` | 工具检索 / 专家推荐与召唤 |

同步：GitHub Actions 每日 05:17（北京）从 `main` 触发，把上游 `main` 快照推到 `mirror`。
`schedule` 只从默认分支读取 workflow，因此 workflow 必须留在 `main`。

**镜像来源只有 `mirrorRepo`**（默认 `superfat1988/workbuddyskills`）：内容、图标、包下载全部从它取。
`cordis.patch.yml` 里声明的 `upstreamRepo` 目前**没有任何代码读取**，不参与「在线检查 changelog、
失败回退镜像」之类的逻辑 —— 那套机制并不存在，不要据此预期任何上游在线检查行为。

## HTTP 路由（Host 侧 `/workbuddy-hub`，全部先过 `ctx.connection.requestRejection`）

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/health` | 运行状态 / store / mirror 分支 |
| GET | `/catalog[?refresh=1]` | 拉取并缓存目录索引（树 + CATALOG.md，6h） |
| GET | `/search?q=&kind=experts\|skills\|connectors&limit=` | 检索，返回中文名/简介/能力标记 |
| GET | `/installed` | 已装清单（连接器附带实时 `enabled`/`status`/`credentialRefs`） |
| POST | `/install {kind,name}` | 按需下载落地（二进制安全） |
| POST | `/uninstall {kind,name}` | 先拆传输层与技能链接，再删文件，并摘掉各会话里的挂载 |
| GET | `/mounted?sessionId=` | 本会话已挂载条目（只读，缺 sessionId 时按最近会话兜底并标 `sessionSource`） |
| POST | `/mount` \| `/unmount {sessionId,kind,name}` | 会话级挂载（安装 ≠ 挂载）；**写操作必须显式传 `sessionId`，缺失返回 409**，绝不兜底猜会话 |
| POST | `/connectors/enable` \| `/connectors/disable {name}` | 动态挂载/拆卸 MCP 传输 |
| GET | `/icon?kind=&name=` | 图标代理（按需从镜像取，磁盘缓存） |

## 斜杠命令

- `/expert [专家名] [任务]` — 召唤已安装专家：读取人设，启动独立子会话；主对话不注入人设
- `/connector <连接器名> [on|off]` — 会话内启用/停用连接器

## 三类条目的语义

| 类型 | 安装后 | 交互 |
|---|---|---|
| 专家 expert | `.codebuddy-plugin/plugin.json` + `agents/<id>.md` | **召唤** → 独立子会话（`startContinuable` + `persona`） |
| 技能 skill | 符号链接进 `~/.dsh/skills` | **添加/挂载**，DSH 按 description 触发 |
| 连接器 connector | MCP 型带 `mcp.json`；CLI 型带 `cli.json` + `skills/` | **开关** = 真实连接状态；CLI 型的捆绑技能会被挂载 |

## 安全模型

- 下载内容逐文件扫描（piped-shell / eval / 动态函数 / 进程 spawn / 凭据词 / 外链），标记写入 registry
- `mcp.json` 视为**不可信数据**：仅放行 `stdio` / `streamable-http`，拒绝未知键、非法 URL/header、非字符串 args/env、多义服务器
- `${VAR}` 只作凭证引用；值经 `credentials.resolve(ref)?.value` 临时解析，**不落盘、不回传**
- 启用是事务性的（`failOnStartupError: true`）；失败保持"已安装未启用"并记录 `lastError`
- `cli.json` 只保留净化后的需求（runtime / minVersion / authDomain），**不持久化平台命令模板**
- 专家人设解析限定在 store 内的真实路径：防穿越、防符号链接逃逸、标识符白名单、256KB 上限、拒绝 NUL，**从不执行下载的脚本**

## 开发

```bash
npm test        # 15 个套件：mcp 校验 / 专家人设 / CLI 连接器 / 召唤 / 凭证轮换 /
                #   浏览器槽位 / client bundle / render smoke / session 契约 / pending expert /
                #   recent experts / auth store / keepalive / install 离线链 / package 完整性
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
| 技能 / 连接器目录 | GitHub 镜像 `superfat1988/workbuddyskills` | 亦是包下载源 |
| 官方登录（技能页数据、用量） | OAuth 设备授权：`POST /wb-auth/start` 给出官方 authUrl → 浏览器登录 → `POST /wb-auth/poll` 轮换取 `{access_token, refresh_token, expires_in, uid}`，存 `~/workbuddyskills/.meta/state/` | 协议与上游 workbuddy2api 的两个实现一致（[linguo2625469/workbuddy2api-panel](https://github.com/linguo2625469/workbuddy2api-panel) · [ardeyouxipianyi/workbuddy2api-hub](https://github.com/ardeyouxipianyi/workbuddy2api-hub)；`copilot.tencent.com/v2/...`，Bearer + X-User-Id + CLI UA）；凭证不出本机 |

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
