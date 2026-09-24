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

```bash
# 技能
curl -s "http://127.0.0.1:3080/workbuddy-hub/market-list?kind=skill&page=1&pageSize=60&q=<关键词>"
# 连接器
curl -s "http://127.0.0.1:3080/workbuddy-hub/market-list?kind=connector&pageSize=60&q=<关键词>"
```

返回 `{ ok, source:"official", total, rows:[...] }`。若 `rows` 为空且带 `error`，**如实把原因转述**（例如「需要登录才能查看官方技能目录」），不要说成「市场里没有」。

关键词建议：中文意图词优先（如「领券」「地图」「火车」「邮件」），无结果再换英文（coupon/map/train/mail）。

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
