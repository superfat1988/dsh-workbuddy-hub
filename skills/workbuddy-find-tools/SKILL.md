---
name: workbuddy-find-tools
description: 在 WorkBuddy **官方市场**（约 300 个技能 / 100+ 个连接器，随官方市场变动）中检索工具能力。当用户需要某种外部工具能力（查数据、连服务、调 API）而当前 DSH 未安装对应工具/连接器时使用；也用于用户说「找一个能 XX 的工具/连接器/技能」「市场里有没有 XX」时。返回候选卡片（名称/用途/前置条件），安装需用户确认后经 hub 插件执行。**技能与连接器走官方市场 API，需要先登录 WorkBuddy 账号**（未登录时接口会明确要求登录，不会静默换源）。
version: 0.2.0
metadata:
  author: kaitzh
  source: dsh-workbuddy-hub
---

# workbuddy-find-tools（工具检索）

从**官方市场**检索 skills 与 connectors，返回推荐卡片。**绝不自动安装**——安装永远由用户确认。

数据源纪律：官方源是唯一真源。GitHub 镜像（`mirrorFallback`，默认关闭）只是灾备，**不要**把它当作检索来源；镜像端点（`/catalog`、`/search`）在默认配置下会直接返回 503。

## 何时使用

- 用户任务需要某种工具能力且当前环境没有对应工具
- 用户明确要求「找一个/推荐一个 XX 工具、连接器、技能」
- 模型自身判断缺工具时（对应 WorkBuddy「搜一遍市场，推荐给你」路径）

## 何时不使用

- 用户需要的是**专业判断/行业经验**（那是专家人设）→ 改用 `workbuddy-experts` skill
- 明确只想浏览已安装内容 → 用 hub 的 `GET /workbuddy-hub/installed`

## 使用步骤

### 1. 确认 hub 可用 + 登录状态

```bash
curl -s http://127.0.0.1:3080/workbuddy-hub/health
curl -s http://127.0.0.1:3080/workbuddy-hub/wb-auth
```

- `health` 失败 → 提示用户先安装/启用 `dsh-workbuddy-hub` 插件。
- `wb-auth` 返回 `configured:false`（或 `stale:true`）→ **技能与连接器都需要登录**：告诉用户去插件的设置区扫码登录（或点市场页右上角账号胶囊），登录后再检索。**不要**在未登录时硬凑结果。

### 2. 检索（官方市场）

**用脚本，不要用裸 curl**（同上：裸 curl 会被连接栅栏挡在 401；脚本直接调官方市场 API，
并用内容仓里的凭证，不需要浏览器会话）：

```bash
node <插件目录>/scripts/hub-find.mjs skill     <关键词> [--limit 5]
node <插件目录>/scripts/hub-find.mjs connector <关键词> [--limit 5]
node <插件目录>/scripts/hub-find.mjs installed           # 本机已装清单
```

输出每行一条紧凑记录（约 0.1–0.9KB）：
```
skill/xlsx | Excel 表格处理 | 创建、编辑、分析 Excel 表格：公式、图表、透视表与格式设置。 |
connector/youzan-workbuddy | 有赞 | mcp_oauth,mcp
# 命中 1 条，显示 1 条（--limit 最多 20）
```

结果里可能出现这三种**一行结论**，按它们行动，**不要**说成「市场里没有」：
- `NEED_LOGIN` → 技能/连接器需要 WorkBuddy 账号：提示用户去插件设置区（或市场页右上角）扫码登录后再试；
- `NO_MATCH ...官方连接器共 N 个...` → 确实没有匹配（官方连接器只有有限几个，换关键词）；
- `ERROR <原因>` → 如实转述（限流/网络/上游错误要区分开）。

### 3. 呈现候选（推荐卡片格式，经 toolview 渲染）

对每个命中条目输出一张卡片：

```
[skill|connector] <name>
用途: <displayName / description>
前置: <是否官方 / 是否需要独立授权（连接器的 authType）>
```

连接器额外说明：官方连接器的 MCP 定义（gateway_url / transport / auth_mode）由官方注册表内联给出，安装后本地 `~/workbuddyskills/connectors/<name>/mcp.json` 即按它生成，凭据以 `${WORKBUDDY_TOKEN}` 引用、不落明文。

### 4. 安装（必须用户明确确认后）

```bash
curl -s -X POST http://127.0.0.1:3080/workbuddy-hub/install \
  -H 'content-type: application/json' \
  -d '{"kind":"<skill|connector>","name":"<name>"}'
```

安装走**官方源优先**（无需手动指定 `source`）；官方拿不到且灾备关闭时会如实报错（`mirrorFallback=false`），**不会**静默装镜像内容。

安装结果要点报给用户：

- `report.flags` 非空时列出安全扫描标记（如 spawns-process / mentions-credentials），提醒用户查看；
- skill 自动符号链接到 `~/.dsh/skills/workbuddy-<name>`，**下一轮对话生效**；
- connector 安装后是「已登记但未连接」：需要在市场页开关处启用，才会真正挂上 MCP 传输；
- 记录里会写下官方溯源（技能 `officialMeta.version`、连接器 `officialMeta.defHash`），供设置页「检查更新」比对。

### 5. 检查更新 / 卸载

```bash
# 检查更新（只读；技能比官方 version、连接器比官方 MCP 定义哈希）
curl -s "http://127.0.0.1:3080/workbuddy-hub/updates?refresh=1"

curl -s -X POST http://127.0.0.1:3080/workbuddy-hub/uninstall \
  -H 'content-type: application/json' \
  -d '{"kind":"...","name":"..."}'
```

## 话术约束（对齐 WorkBuddy 语义）

- 装不装、授不授权始终是用户的决定；每次推荐结尾固定询问：「要安装吗？」
- 安装连接器前必须说明其前置条件（尤其需要账号授权/凭据的）。
- 未检索到匹配时如实说明，不硬凑；可建议放宽关键词。
- 「查不到」与「已是最新」是两件事：接口报错/未登录时**不许**说成「没有更新」或「市场里没有」。
