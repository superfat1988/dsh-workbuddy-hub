---
name: workbuddy-find-tools
description: 在 WorkBuddy **官方市场**（约 300 个技能 / 100+ 个连接器，随官方市场变动）中检索工具能力。当用户需要某种外部工具能力（查数据、连服务、调 API）而当前 DSH 未安装对应工具/连接器时使用；也用于用户说「找一个能 XX 的工具/连接器/技能」「市场里有没有 XX」时。返回候选卡片（名称/用途/前置条件），安装需用户确认后经 hub 插件执行。**技能与连接器走官方市场 API，需要先登录 WorkBuddy 账号**（未登录时接口会明确要求登录，不会静默换源）。
version: 0.3.0
metadata:
  author: kaitzh
  source: dsh-workbuddy-hub
---

# workbuddy-find-tools（工具检索）

从**官方市场**检索 skills 与 connectors，返回推荐卡片。**绝不自动安装**——安装永远由用户确认，且最终要过 DSH 的原生审批。

数据源纪律：官方源是唯一真源。GitHub 镜像（`mirrorFallback`，默认关闭）只是灾备，**不要**把它当作检索来源；镜像端点（`/catalog`、`/search`）在默认配置下会直接返回 503。

## 何时使用

- 用户任务需要某种工具能力且当前环境没有对应工具
- 用户明确要求「找一个/推荐一个 XX 工具、连接器、技能」
- 模型自身判断缺工具时（对应 WorkBuddy「搜一遍市场，推荐给你」路径）

## 何时不使用

- 用户需要的是**专业判断/行业经验**（那是专家人设）→ 改用 `workbuddy-experts` skill
- 明确只想浏览已安装内容 → 用 hub 的 `GET /workbuddy-hub/installed`

## 使用步骤

### 1. 检索（官方市场，用脚本）

**用脚本，不要用裸 curl**（裸 curl 会被 DSH 连接栅栏挡在 401；脚本直接调官方市场 API，
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

### 2. 装前预检（inspect，只读、不落盘）

对准备推荐的条目跑一次预检（对**每个**候选做；不写任何文件、不执行包内代码）：

```bash
node <插件目录>/scripts/hub-find.mjs inspect skill     <name> [--json]
node <插件目录>/scripts/hub-find.mjs inspect connector <name> [--json]
```

输出一张紧凑安全卡：
```
INSPECT skill/xlsx | Excel 表格处理
体量: 57 文件 / 约 1107.8 KB
可执行脚本: 有(12 个)
风险标记: scripts/recalc.py: spawns-process; scripts/recalc.py: external-url
外网/命令/凭据: 外链 8 个 / 声明命令执行
头部: <SKILL.md 前 120 字>
备注: 官方 skill_id=…，版本 …
```

- `NOT_FOUND` = 官方市场没有这个条目（如实说，别硬凑）；
- `NEED_LOGIN` = 需要登录后才能预检（引导用户扫码登录）；
- `ERROR <原因>` = 失败原因如实转述。

### 3. 向用户讲清楚，再问「要安装吗？」

用自己的话把安全卡讲给用户（不要原样甩 JSON）：
- 这个技能/连接器是**干什么的**、解决用户的什么问题；
- 体量多大、带不带可执行脚本、有哪些风险标记（spawns-process=会在本机起进程；external-url=会连外部服务；凭据相关=需要配 token/授权）；
- 连接器要说明前置条件（authType：mcp_oauth / oauth2_code 需要账号授权；cli 型需要本机装运行时）。

结尾固定问一句：「**要安装吗？**」。用户没同意就停在推荐，**不要**调用安装。

### 4. 安装（用户口头同意后 → 调 workbuddy_install 工具）

用户同意后，调用 DSH 工具（不是 curl）：

```
workbuddy_install { kind: "skill" | "connector", name: "<name>", source?: "official" | "mirror" }
```

工具内部会：先重做一次只读预检 → 弹出 **DSH 原生审批**（把安全卡摘要展示给用户）→ 用户在审批里点了批准才真的安装。也就是说：**你调了工具 ≠ 已经安装**，要看工具返回。

- 若审批结果是「用户拒绝/取消」→ 如实告知未安装，不要重试、不要绕；
- 若返回「当前没有可用的审批通道，出于安全未安装」→ 这是 **fail-closed**：说明当前环境没有审批通道，如实转述并停在原地；
- **不要**尝试自己加参数绕过审批，**不要**用裸 curl 打 `/workbuddy-hub/install`（会被 401 挡住，且绕过了审批与审计）。

安装成功后按类型转述：
- `report.flags` 非空时列出安全扫描标记（如 spawns-process / mentions-credentials），提醒用户查看；
- skill 自动符号链接到 `~/.dsh/skills/workbuddy-<name>`，**下一轮对话生效**；
- connector 安装后**保持停用**（enabled=false）：需要在市场页开关处显式启用，才会真正挂上 MCP 传输；
- 记录里会写下官方溯源（技能 `officialMeta.version`、连接器 `officialMeta.defHash`），供设置页「检查更新」比对。

### 5. 检查更新 / 卸载

检查更新用只读脚本（**不要用裸 curl** 打 `/workbuddy-hub/updates`，401）：

```bash
node <插件目录>/scripts/hub-find.mjs update-check           # 全部已装条目
node <插件目录>/scripts/hub-find.mjs update-check skill     # 只查技能
node <插件目录>/scripts/hub-find.mjs update-check <名称>    # 只查某一条
node <插件目录>/scripts/hub-find.mjs update-check --json    # 机器可读
```

输出每行一条（`kind/name | 状态 | 本地→远端`），末尾一行汇总（`# 共 N 项：有更新 x / 已是最新 y / 无法检查 z`）。

**语义必须诚实转述**：状态只有「有更新 / 已是最新 / 无法检查」三种。
「无法检查」= 信息不足（未登录、官方版本缺失、老安装没有溯源记录、官方接口失败、条目已下架）——
**绝不能**把它说成「已是最新」；未登录时输出里会有一行 `NEED_LOGIN ...`，提示用户去扫码登录后再查。

卸载（移除）**不要用裸 curl** 打 `/workbuddy-hub/uninstall`（401，且绕过审批）。正规流程：

1. 先用自己的话向用户说明将要移除什么（哪个条目、占多少体量、移除后的影响）；
2. 用户口头同意后，调用 DSH 工具：

```
workbuddy_uninstall { kind: "expert" | "skill" | "connector", name: "<name>" }
```

工具内部会：只读盘点 → 弹出 **DSH 原生审批** → 用户批准才真的卸载（连接器会先停用 MCP 传输再删；专家/技能会同时摘掉所有会话里的挂载）。看返回再转述：
- 「用户未批准/审批被取消」→ 如实告知未移除，不要重试；
- 「当前没有可用的审批通道，出于安全未卸载」→ fail-closed，如实转述并停在原地。

## 话术约束（对齐 WorkBuddy 语义）

- 装不装、授不授权始终是用户的决定；每次推荐结尾固定询问：「要安装吗？」
- 安装连接器前必须说明其前置条件（尤其需要账号授权/凭据的）。
- 未检索到匹配时如实说明，不硬凑；可建议放宽关键词。
- 「查不到」与「已是最新」是两件事：接口报错/未登录时**不许**说成「没有更新」或「市场里没有」——`update-check` 会如实给「无法检查」，照它转述。
- **不要自己加 --confirm/绕过审批**；**不要用裸 curl 调安装/卸载路由**（实测 401）；未登录时如实告知去扫码登录，不要硬凑结果。
