# dsh-workbuddy-hub

WorkBuddy 专家 / 技能 / 连接器市场 → DeepSeek Harness 的移植枢纽插件。

个人研究用途：复用 WorkBuddy 市场的**数据**（目录、中文元数据、图标）与**交互语义**，
不 vendor 其闭源前端代码。

## 一键安装

插件挂在 DSH 的某个 profile 上，一条命令装包：

```bash
dsh plugin --profile web add dsh-workbuddy-hub
```

还没发到 npm 时用 git：

```bash
dsh plugin --profile web add github:<owner>/dsh-workbuddy-hub
```

`dsh plugin` 只把包装进 profile 的 `node_modules`。**是否启用**由 profile 的
`package.json` 里 `dsh.profile.plugins` 决定，确认数组里有 `"dsh-workbuddy-hub"`：

```json
{
  "dependencies": { "dsh-workbuddy-hub": "link:/path/to/dsh-workbuddy-hub" },
  "dsh": {
    "profile": {
      "plugins": ["dsh-workbuddy-hub"]
    }
  }
}
```

然后照常启动：

```bash
dsh --profile web
```

首次启动后：

1. 侧栏出现「专家·技能·连接器」入口
2. 打开市场页，用 WorkBuddy 账号登录一次（凭证只落 `<storeRoot>/.meta/state/`，不出本机）
3. 专家 / 技能 / 连接器即可安装到本地仓 `~/workbuddyskills`

卸载：

```bash
dsh plugin --profile web remove dsh-workbuddy-hub
```

`~/workbuddyskills` 里已装的内容不会被删——那是数据，不是插件。

## 架构

| 层 | 位置 | 说明 |
|---|---|---|
| 官方真源 | `expert_center.json`（专家注册表，公开） + `copilot.tencent.com/v2/operation-platform/market/*`（技能/连接器，需登录） | **唯一真源**：目录、元数据、包下载、更新判定全部以官方为准 |
| MCP OAuth 2.1 | 连接器端点自述（401 + `WWW-Authenticate: resource_metadata`）→ 授权服务器元数据 → **动态客户端注册**（`/oauth/register`，公开客户端 + PKCE + loopback 回调）→ 授权码换 token | 连接器授权接入（QQ邮箱这类）：token 只进 DSH 凭据库，`mcp.json` 只写 `${WORKBUDDY_OAUTH_<NAME>_TOKEN>}` 引用；401/到期用 refresh_token 续期 |
| 桌面端公开目录 | `static.workbuddy.cn/connectors-config-v2/connectors-config.zip` + `.../connector-agent-plugins/connector-plugins.zip`（WorkBuddy 客户端「自带市场」的同一份匿名静态包，来源与其 `.workbuddy/connectors/marketplace-meta` 记的 `sourceKey` 一致） | **连接器目录的第二来源**（`desktopCatalog`，默认开）：317 条（含中文名/描述/示例/图标/`mcp.json`/`skills`），官方注册表在本账号只给 29 条。**只做目录 + 落地**；通话仍按账号授权走官方网关 |
| 镜像灾备 | `superfat1988/workbuddyskills` 的 `mirror` 分支 | **默认关闭**的灾备开关（`mirrorFallback`）；官方挂了才临时打开 |
| 本地内容仓 | `~/workbuddyskills/` | `.meta/registry.json`、`.meta/mounts.json`、`.meta/icons/`、`skills/ experts/ connectors/` |
| DSH 挂载 | `~/.dsh/skills/<prefix><name>` | 符号链接（DSH 扫描器原生跟随） |
| 随插件 skill | `skills/workbuddy-find-tools`、`skills/workbuddy-experts` | 工具检索 / 专家推荐与召唤 |
| 随插件脚本 | `scripts/hub-find.mjs` | agent 的**紧凑检索入口**（专家/技能/连接器/已装清单 + `inspect` 装前安全预检 + `update-check` 只读检查更新）：本地过滤+排版，一次查询约 0.1–0.9KB，替代会把整段 JSON（12.7KB，最坏 473KB）塞进上下文的裸 curl；也绕开了连接栅栏（裸 curl 连 /health 都 401）|
| agent 工具 | `workbuddy_install` / `workbuddy_uninstall`（Host 经 `ctx.tools.register` 注册） | **带 DSH 原生审批的安装/卸载工具**：安装=装前只读预检 → 审批 → 才真装（连接器落地保持停用）；卸载=只读盘点 → 审批 → 才真卸（连接器先停用 MCP 传输、专家摘全部会话挂载） |

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
| `desktopCatalog` | **`true`** | 桌面端公开静态目录开关（WorkBuddy 客户端自带市场那份包）。打开后连接器目录 = 官方注册表 ∪ 桌面目录（317 条），行级带 `source: official\|desktop`；关掉退回「只有官方目录」 |
| — 图标 | 桌面目录的图标**只在包内**（`icons/<name>.<ext>`）：`GET /workbuddy-hub/icon?kind=connector&source=desktop&name=<n>` 由插件供图并缓存到 `storeRoot/.meta/icons/`（公网 `static.workbuddy.cn/connectors-config-v2/icons/…` 实测 404，早期版本编造过那条 URL，已修） | 断网也能显示；市场行与输入框 chip 都用它 |
| `desktopCatalogTtlMs` | `21600000`（6h） | 桌面目录保鲜期；到期或 etag 变化才重新下载（两个包合计约 50MB，缓存到 `<storeRoot>/.meta/desktop/`） |
| `oauthCallbackPort` | `8788` | MCP OAuth 的 loopback 回调端口（只绑 `127.0.0.1`，被占用时按 +1 顺延；传 `0` 由系统分配，隔离测试用） |
| `oauthScopes` | 空（用授权服务器声明的全部 scope） | MCP OAuth 申请的作用域，空格分隔 |
| `oauthCallbackHost` | `127.0.0.1` | 回调监听地址。授权页与 DSH **同机**时保持默认；从 **PC 浏览器**操作 GUI 时配成 NAS 的 LAN IP（如 `192.168.1.10`），扫码后的重定向就能直接回到插件（PKCE 保证只有本进程能拿 code 换 token）。不改也能用「粘贴回调链接」兜底 |
| `storeRoot` | `~/workbuddyskills` | 本地内容仓 |
| `skillPrefix` | `workbuddy-` | `~/.dsh/skills/` 下的挂载前缀 |
| `keepalive` | `true` | 后台每 30 分钟巡检并主动刷新凭证 |
| `localMcp` | **`false`** | 本地 MCP 服务器管理总开关（默认关闭）。打开后设置区才出现「本地 MCP 服务器」节，允许注册/启停本机 MCP 服务器（仅 loopback，v1 只支持 streamable-http，stdio 一律拒绝） |
| `localMcpRestoreBackoffMs` | `[0, 3000, 7000, 15000, 30000]` | 启动恢复的重试退避（毫秒，逐次尝试前的等待）。DSH 起来时被恢复的目标常常还没就绪（本地 MCP 多半是 Docker 容器、凭据服务也可能未可用），**只试一次会把这种瞬时故障变成永久停用**，因此默认合计约 55s 内重试 5 次；序列用尽仍失败才记 `lastError` 并复位 `enabled`。测试用短序列注入 |

## HTTP 路由（Host 侧 `/workbuddy-hub`，全部先过 `ctx.connection.requestRejection`）

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/health` | 运行状态 / store / mirror 分支 / `mirrorFallback` 当前值 |
| GET | `/catalog[?refresh=1]` | 镜像目录索引（6h 缓存）。**`mirrorFallback=false` 时返回 503 + 原因**，不再拉镜像 |
| GET | `/search?q=&kind=experts\|skills\|connectors&limit=` | 镜像检索。同上，默认关闭时返回 503 + 原因 |
| GET | `/installed` | 已装清单（连接器附带实时 `enabled`/`status`/`credentialRefs`） |
| GET | `/market-list?kind=connector` | 连接器目录：**官方注册表 ∪ 桌面端公开目录**（官方同名优先），行级 `source`；响应另带 `officialTotal` / `desktopTotal` / `desktop{entries,etag,fetchedAt,stale}` |
| POST | `/connectors/mcp-oauth/start {name}` | **MCP OAuth 授权**：探测端点是否自述需要 OAuth → 发现授权服务器 → 动态注册 → 返回授权 URL（用户扫码/登录）。非 MCP OAuth 端点如实返回 `code: "not-mcp-oauth"`（此时走官方连接器 OAuth） |
| GET | `/connectors/mcp-oauth/status?name=` | 流程状态：`idle` / `pending` / `done` / `error`（界面据此自动收尾） |
| POST | `/connectors/mcp-oauth/refresh {name}` | 用 refresh_token 续期并写回凭据库（`/connectors/enable` 到期前也会自动续一次） |
| POST | `/connectors/mcp-oauth/cancel {name}` | 放弃进行中的授权（关掉 loopback 回调监听） |
| GET | `/desktop-catalog` | 桌面端公开目录状态（条目数 / 可挂载数 / 网关·直连分布 / etag / 抓取时间 / stale / 错误与 flags） |
| POST | `/desktop-catalog/refresh {force?}` | 刷新桌面目录（etag 未变则不重复下载；`force:true` 无条件重下） |
| GET | `/updates[?refresh=1]` | **检查更新**（只读）：纯官方元数据比对 —— 技能比官方 `version`、专家比官方 `updatedAt`、连接器比官方 MCP 定义哈希；取不到官方数据一律 `unknown` + 原因，**绝不**判「已是最新」。结果缓存 60s，`refresh=1` 强制重算；**永远不用镜像** |
| POST | `/install {kind,name,source?}` | 按需安装（`source`: `official` 默认 / `desktop` 桌面公开目录 / 省略时官方优先、官方查无此条才回落桌面目录；技能/专家/连接器都记 `officialMeta` 溯源）。与 `workbuddy_install` 工具共用同一实现 `installEntry`；本路由是 Web UI 的安装通道（**不经过审批**——审批在工具链路里） |
| POST | `/uninstall {kind,name}` | 卸载（与 `workbuddy_uninstall` 工具共用同一实现 `uninstallEntry`）：连接器先停用 MCP 传输 → 拆技能链接 → 删文件 → 更新注册表 → 摘掉各会话挂载 → 专家顺带释放 agent preset。本路由是 Web 设置页「移除」的通道（用户亲手点的，不需要审批） |
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
| 连接器（桌面目录来源） | 当前桌面目录包的 `sha256` / 该连接器 `version` vs 安装时记的 `officialMeta.bundle.sha256` / `officialMeta.version` | 与官方无关（官方本来就没列它）：包哈希或版本变了 → `update`；一致 → `current`；缺记录或目录不可用 → `unknown` + 原因 |

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

## agent 工具：workbuddy_install（装前预检 + DSH 原生审批）

模型安装任何市场条目的**正规通道**（`index.js` 里 `ctx.tools.register` 注册，普通对象、
不 import `@deepseek-ai/dsh-tools`——本插件目录解析不到该包）：

```
workbuddy_install { kind: "expert"|"skill"|"connector", name, source?: "official"|"mirror" }
```

`execute` 的固定顺序：

1. **只读预检**（与 `hub-find.mjs inspect` 同一实现 `wb-inspect.js`，不落盘、不执行包内代码）；
2. **DSH 原生审批** `ctx.approval.request({ agent, toolName, callId, reason, signal })`，reason 携带安全卡摘要；
3. 审批四分支：`allowed-once` → 真装；`rejected`/`cancelled` → 不装并如实转述；**`unavailable` → fail-closed**（「当前没有可用的审批通道，出于安全未安装」），绝不静默放过；`ctx.approval` 服务缺位或 `exec.agent` 缺位时同样 fail-closed；
4. 安装复用与 `POST /install` 完全相同的 `installEntry`（同一份官方优先/镜像灾备/溯源/软链逻辑，不分叉）；
5. 收尾语义：技能软链下一轮生效；专家记官方溯源可召唤；**连接器落地保持 `enabled=false`**（带凭据的 MCP 传输要显式启用才建立）；每次调用写一行 `[wbh] install …` 审计（kind/name/审批结果/来源/风险标记）。

只有 turn 内的工具 handler 能发起审批（approval 服务要求 open turn + agent）——
所以 HTTP 路由与脚本都做不到这件事；Web 设置页的 `/install` 是用户亲手点的另一条通道，不需要审批。

## agent 工具：workbuddy_uninstall（先说明 → DSH 原生审批 → 才真卸）

模型移除任何已装条目的**正规通道**（与 `workbuddy_install` 同一套写法）：

```
workbuddy_uninstall { kind: "expert"|"skill"|"connector", name }
```

`execute` 的固定顺序：

1. **只读盘点**：从注册表读出该条目的文件数/体量/安装时间/来源/当前启用状态（不写盘、不拆传输、不动挂载）；未安装时如实说「无需卸载」，不弹审批；
2. **DSH 原生审批**，reason 写清「将移除什么 + 多大体量 + 什么影响（连接器先停用 MCP 传输；专家摘全部会话挂载）+ 不可撤销」；
3. 审批四分支与 `workbuddy_install` 完全一致：只有 `allowed-once` 才真卸；`rejected`/`cancelled` 不卸并如实转述；**`unavailable` → fail-closed**；`ctx.approval` / `exec.agent` 缺位同样 fail-closed；
4. 卸载复用与 `POST /uninstall` 完全相同的 `uninstallEntry`（连接器先停用 MCP 传输，防止 mcp-client 行悬空 → 拆技能链接 → 删文件 → 更新注册表 → `pruneMounts` 摘挂载 → 专家释放 agent preset）；
5. 每次调用写一行 `[wbh] uninstall …` 审计（kind/name/审批结果/时间）。

## 连接器授权：两套机制（点「连接」时按端点自述分派）

| 家族 | 怎么识别 | 交互 | 实现 |
|---|---|---|---|
| 用户凭据（`${VAR}`） | `mcp.json` 里声明了占位符（如 `TUSHARE_TOKEN`） | 提示要配哪些 ref（值进 DSH 凭据库） | 无需新增 |
| **MCP OAuth 2.1** | 端点 401 且 `WWW-Authenticate: Bearer resource_metadata="…"` | **弹授权页：扫码/登录 → 回调后自动连接** | `wb-mcp-oauth.js`：发现 → 动态注册 → PKCE → loopback 回调 → 换 token → 凭据库 |
| — 适用面（2026-10-07 全量实测） | 252 条可挂载连接器：**150 条上游自述 MCP OAuth**、67 条用户凭据、34 条网关型、1 条探测失败 | 上游自述 OAuth 的（含 tdx/腾讯文档/GitHub）**优先走上游 MCP OAuth**：token 绑到会认它的上游端点，不依赖 WorkBuddy 账号 | `scripts/` 扫描 + 验收场景 ⑩ |
| WorkBuddy 连接器 OAuth | 上面都不是，且官方 `/v2/as/connector/oauth/<name>/start` 认这条（tdx/github 实测） | 弹官方授权页 → 完成后点「连接」 | 既有 `connectorAuthStart` |
| 都不适用 | — | 如实报错（含完整握手探测的原因） | — |

MCP OAuth 细节：回调**只绑 `127.0.0.1`**、单次有效、校验 `state`、TTL 10 分钟；`state` 不匹配的杂散回调只回「不匹配」页、**不终止**流程；动态注册结果（`client_id`）缓存在 `<storeRoot>/.meta/oauth/clients.json`（公开客户端无 secret），**token 从不落盘**。

## 装前预检：hub-find.mjs inspect（只读、不落盘）

```bash
node scripts/hub-find.mjs inspect <expert|skill|connector> <name> [--json]
```

- **expert**：官方注册表原始条目 → 拉人设 md（文本）过 `scanFlags`；头像只记体积不拉内容；
- **skill**：`skillDetails` 拿 `download_url` → zip 下载进**内存** → unzip → 列条目、文本文件过 `scanFlags`（二进制只记体积）；
- **connector**：`connectorRegistry` 该行 → `scanMcpDefinitionFlags` 结构化扫 mcp 定义（外部 URL / 声明命令执行 / 凭据头 / 凭据查询参数）；**桌面端公开目录**来源的连接器改为读目录记录，并把包内**实际会落盘的文件**（`skills/`、`scripts/`、`token-schema.json`）按技能预检同一套 `scanFlags` 口径一起算进体量与风险标记（官方查无此条时自动回落该路径）。

输出紧凑安全卡（一行一条）：`INSPECT <kind>/<name> | <中文名>` / `体量` / `可执行脚本: 有(N 个)|无` /
`风险标记: 无|<列表>` / `外网/命令/凭据` / `头部: <SKILL.md 或人设前 120 字>`。
失败语义一行给清：`NOT_FOUND`（官方没有此条目，退出码 3）、`NEED_LOGIN`（需登录，退出码 1）、`ERROR <原因>`（退出码 1）。
inspect 绝不写任何文件、不碰 storeRoot。

## 检查更新：hub-find.mjs update-check（只读、诚实语义）

```bash
node scripts/hub-find.mjs update-check            # 全部已装条目
node scripts/hub-find.mjs update-check skill      # 按 kind 过滤（expert|skill|connector）
node scripts/hub-find.mjs update-check <名称>     # 按名称过滤（子串匹配 key/name/displayName）
node scripts/hub-find.mjs update-check --json     # 机器可读（一行 JSON 数组，带中文 label）
```

- 与 `GET /updates` 同一判定来源：纯函数 `src/updates.js`（compareOfficial / compareSkillVersion /
  compareConnectorDef / summarizeUpdates）+ 内容仓 `registry.json` + 官方注册表/技能接口/连接器注册表；
- 输出每行一条：`kind/name | 已是最新|有更新|无法检查 | 本地→远端`（技能为 version 对、专家为 updatedAt 对、
  连接器为 defHash 前缀），unknown 行附原因（缺 officialMeta / 缺官方 version / 未登录 / 接口失败 / 已下架）；
  末尾一行汇总 `# 共 N 项：有更新 x / 已是最新 y / 无法检查 z`；未登录时另有一行 `NEED_LOGIN ...`；
- **诚实语义**：信息不足一律「无法检查」，绝不判「已是最新」（与设置页同一口径，见 test-hub-find.mjs 第 11–16 组）；
- 只读：不写注册表、不触发任何启用或重装；失败一行给清（`NEED_LOGIN` / `ERROR <原因>` / `NO_MATCH`）。

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
npm test        # 17 个套件（另 test:live 单独跑联网版）：mcp 校验 / 专家人设 / CLI 连接器 / 召唤 / 凭证轮换 /
                #   浏览器槽位 / client bundle / render smoke（含 picker 点击=回车契约）/ session 契约 / pending expert /
                #   recent experts / auth store / keepalive / install 离线链 / 更新判定 /
                #   本地 MCP 管理 / package 完整性 / hub-find 检索+inspect+update-check 契约 /
                #   安装工具审批四分支 / 卸载工具审批四分支
npm run pack:check
```

安装到 web profile（profile 已 link 本项目）：

```bash
dsh plugin --profile web add /home/USER/.openclaw/workspace/projects/dsh-workbuddy-hub
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
| 连接器目录（第二来源，317 条） | 桌面端公开静态包 `static.workbuddy.cn/connectors-config-v2/connectors-config.zip`（+ `connector-agent-plugins/connector-plugins.zip`） | 与 WorkBuddy 桌面客户端「自带市场」同一份匿名源；`desktopCatalog` 默认开。**通话不靠它**：网关型连接器仍走 `copilot.tencent.com/console/agent-gateway/<name>/…` + 账号 bearer，未授权时官方回 `17009`（可用 `/connectors/auth-start` 发起授权）、未注册回 `17008`；带 `${VAR}` 的上游由用户自备凭据直连 |
| 官方登录（技能页数据、连接器目录、用量） | OAuth 设备授权：`POST /wb-auth/start` 给出官方 authUrl → 浏览器登录 → `POST /wb-auth/poll` 轮换取 `{access_token, refresh_token, expires_in, uid}`，存 `~/workbuddyskills/.meta/state/` | 协议与上游 workbuddy2api 的两个实现一致（[linguo2625469/workbuddy2api-panel](https://github.com/linguo2625469/workbuddy2api-panel) · [ardeyouxipianyi/workbuddy2api-hub](https://github.com/ardeyouxipianyi/workbuddy2api-hub)；`copilot.tencent.com/v2/...`，Bearer + X-User-Id + CLI UA）；凭证不出本机 |

插件不依赖 DeepSeek 浏览器 cookie；官方会话由设备授权获得、可刷新、可 `/wb-auth/logout` 注销。

## 登录与账号保活

- **扫码登录**：设置区/市场页点「扫码登录」→ `POST /wb-auth/start` 返回官方 authUrl（OAuth 设备授权）→ 浏览器扫码确认 → 客户端 `POST /wb-auth/poll` 轮询取回 `{access_token, refresh_token, expires_in, uid}`；`POST /wb-auth/logout` 注销并清掉凭证与健康档。
- **主动刷新**：后台每 **30 分钟**巡检一次，`access_token` 剩余寿命**不足 2 小时**就调用 refresh_token 刷新（阈值 7200s，规则来自上游 workbuddy2api 的 `wb_scheduler.py`）。配置 `keepalive: false` 可整体关闭巡检。
- **失效判定**：刷新失败 / 官方错误码 12153（session dead）**连续 3 次**才判「登录已失效」（前两次只记 `lastError`，防误判；中途成功一次即清零计数）。判失效后界面显示「登录已失效，请重新扫码」，并停止使用该凭证。
- **凭证落盘**：`~/workbuddyskills/.meta/state/workbuddy-auth.json` 与健康档 `workbuddy-auth-health.json` 均以 **0600** 写入（另有 `chmod` 兜底）；凭据值不回传浏览器、不进日志。

## 闲置能力提醒（idle capability）

对齐 WorkBuddy 5.9.2 的 `idle-capability` 卡片：长期没用的 skill / MCP 集中提示，可一键关闭。

**数据源**：`~/.dsh/sessions/**/session.v*.jsonl.zstd`。用 `zstd -dc` 解压，只挑 `"type":"tool/call"` 的行；`name==='skill'` 取 `arguments.name`，`mcp__<server>__<tool>` 取第一段当 server。8 路并发，结果缓存 5 分钟。不另建使用账本 —— 会话记录就是真源。

**判定** `computeCandidates()`（`wb-idle.js`）：

| 条件 | 结果 |
| --- | --- |
| `state.lastShownDate === today` | `blockedBy='shown-today'` |
| `globalDismissed && version >= 3` | `blockedBy='global-dismissed'` |
| `activeDays < ceil(threshold/2)` | `blockedBy='too-new'` |
| `idleDays >= threshold`（默认 14） | 进候选 |

`idleDays` 取「今天 − 最后使用日」与「今天 − 安装日」的较小值 —— 装了两天的东西不该被判成闲置两周。

**RPC**（前缀 `/workbuddy-hub`，均过 `requestRejection`）：`GET /idle`、`POST /idle/shown`、`POST /idle/dismiss`、`POST /idle/dismiss-global`、`POST /idle/close`。状态存 `<meta>/idle-state.json`。

**关闭动作**：skill → `unlinkSkill()`（只摘软链，不删文件）；mcp → 置 `enabled=false` 并落盘。逐条独立结算，返回 `{succeeded[], failed[]}`。

**与官方三处不同**（都是有意的）：

1. 官方采了 `activeDays` 却不用，3 天活跃的账号照样弹；这里拿它当「新用户护栏」。
2. 官方把 14 天写死在前端 JSX 与后端两处；这里只认 `data.threshold`。
3. 官方的关闭失败只 `console.warn`；这里把失败项留在列表里可重试。

**前端**：`src/IdleSlot.jsx` 挂 `conversation.composer.dock`（order 60），进页面 3 秒后拉取，有候选才渲染。样式全部来自官方 `idle-capability-*.css`，重写为 `.wbh-port .idle-capability-pill` 后代选择器 —— 所以卡片外层必须有一个 `.wbh-port` 容器，卡片自己再带 `.idle-capability-pill`，两者不能合并到同一元素上。

## 已知限制

- 生产（`dsh-web.service`）需用户重启才会加载本插件的新代码
- 12306 类 MCP 在 NAS 出网策略下查询可能被反爬阻断（协议握手正常）
- 需凭证的连接器必须先配好凭证才能启用（这是设计行为）
- 与本插件无关的既有告警：`list slot "conversation.chat.turnTail" requires options.id`（来自其他插件）
