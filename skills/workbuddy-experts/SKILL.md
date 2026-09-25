---
name: workbuddy-experts
description: WorkBuddy 专家顾问。当对话中判断任务需要专业判断、行业经验或领域方法论时（如审合同、读财报、写论文、投资分析、法律咨询、内容创作策略），或用户说「找个专家」「有没有懂 XX 的专家」「召唤专家」时，从**官方专家注册表**（约 430 位，随官方注册表变动）检索推荐合适的人设。专家=角色切换机制，不是工具：不自动调用，只能推荐，由用户决定召唤；同一会话建议只挂一个专家。召唤时按需下载该专家文件并以 subagent 人设加载。
version: 0.3.0
metadata:
  author: kaitzh
  source: dsh-workbuddy-hub
---

# workbuddy-experts（专家顾问）

WorkBuddy 语义的专家推荐与召唤。核心规则：**专家只能推荐，不能自动调用；召唤=用户决定；一次一个。**

数据源：**官方专家注册表**（`expert_center.json`，腾讯 COS）。它**公开、无需登录**，所以专家是三类内容里唯一未登录也能浏览/召唤的。GitHub 镜像只是默认关闭的灾备，不再是本流程的来源。

## 与 workbuddy-find-tools 的分工

| | 本 skill | workbuddy-find-tools |
|---|---|---|
| 找什么 | 专家人设（判断力、方法论） | 工具能力（数据、API、连接器） |
| 触发信号 | 需要专业判断/行业经验 | 需要外部数据/操作能力 |
| 推荐产物 | 专家卡片 → subagent 召唤 | 工具卡片 → 安装 |
| 需要登录 | 不需要 | 需要（技能/连接器走官方市场 API） |

一句话里同时出现外部数据需求 + 专业判断需求时：先走 find-tools 拿数据，专家推荐放下一轮（WorkBuddy 顺位规则：拿不到数据，再专业的框架也是空转）。

## 使用步骤

### 1. 检索专家目录（官方注册表，无需登录）

**用脚本，不要用裸 curl** —— hub 的 HTTP 路由在 DSH 连接栅栏后面（实测裸 curl 连 `/health` 都是 401），
而脚本直接读官方注册表：不需要登录、不需要浏览器会话、也不把整段 JSON 塞进上下文。

```bash
node <插件目录>/scripts/hub-find.mjs expert <关键词> [--limit 5]
# 例：node ~/.openclaw/workspace/projects/dsh-workbuddy-hub/scripts/hub-find.mjs expert 合同
```

输出是**每行一条**的紧凑结果：
```
expert/contract-legal-expert | 腾讯电子签合同法务专家 | 资深合同法务专家 | 合同起草,合同审查,法规检索
# 命中 11 条，显示 5 条（--limit 最多 20）
```

省多少（同一次「合同」查询）：脚本 **630 字节** vs 原始 JSON **12,655 字节**；而原始接口在不带关键词、
limit=500 时能到 **473KB** —— 脚本内置 `limit ≤ 20` 的硬约束，从结构上排除了这种事故。

- 关键词取用户意图的领域词（法务/财报/论文/股票/小红书/合同…），中英都试。
- `NO_MATCH` = 没命中（换关键词，别换接口）；`ERROR <原因>` = 失败，如实转述。
- 需要原始字段时加 `--json`（仍受 limit 约束）。

### 2. 装前预检（inspect，只读、不落盘）

对准备推荐的专家跑一次预检（不写文件、不执行任何代码；拉取的只有人设 md 文本，头像只记录体积）：

```bash
node <插件目录>/scripts/hub-find.mjs inspect expert <name>
```

输出一张紧凑安全卡（示例）：
```
INSPECT expert/chatlaw-team-lead | 中文法律咨询团
体量: 2 文件 / 约 486.4 KB
可执行脚本: 无
风险标记: 无
外网/命令/凭据: 无
头部: --- name: chatlaw-team-lead description: Chinese legal consultation team lead …
```

- `NOT_FOUND` = 官方注册表没有这个专家（如实说）；`ERROR <原因>` = 失败原因。
- 专家注册表公开、无需登录，所以预检不受登录态影响。

### 3. 推荐卡片（3 个以内，宁缺毋滥）

```
[expert] <name>  <categoryId>
人设: <displayName> · <subtitle>（描述取 description）
形态: expertType === "team" ? 专家团 : 单专家
```

- 不要用目录缓存或文件数推断形态，官方行里的 `expertType` 就是答案。
- 结合预检结果，用**自己的话**向用户讲清：这位专家擅长什么、能帮用户解决什么问题、人设体量与风险标记情况（专家通常无风险标记，但要如实说）。
- 结尾固定询问：「召唤 TA 吗？」或「想看看其他候选吗？」用户没同意就停在推荐。

### 4. 召唤（必须用户明确确认后 → 调 workbuddy_install 工具）

用户同意后，调用 DSH 工具（**不是 curl**）：

```
workbuddy_install { kind: "expert", name: "<name>" }
```

工具内部会：先重做一次只读预检 → 弹出 **DSH 原生审批**（安全卡摘要展示给用户）→ 用户在审批里批准后才真的下载安装。**你调了工具 ≠ 已经安装**，要看返回：

- 「用户未批准/审批被取消」→ 如实告知未安装，不要重试；
- 「当前没有可用的审批通道，出于安全未安装」→ fail-closed，如实转述并停在原地；
- **不要**自己加参数绕过审批；**不要**用裸 curl 打 `/workbuddy-hub/install`（实测 401，且绕过审批与审计）。

（安装链路会**优先走官方源**；`source` 无需手动指定。记录里会写下官方溯源 `officialMeta.updatedAt`，供插件设置页的「检查更新」比对。）

召唤成功后：

1. 读 `~/workbuddyskills/experts/<name>/` 下的文件：
   - 单专家：`agents/<agentName>.md`（对应 plugin.json 的 `agentName` 字段）即人设全文；无 agents/ 时用 SKILL.md 或 README.md 的人设部分。
   - 专家团：`teamInfo.leadAgent` 对应的 `agents/<lead>.md` 为主人设；`memberAgents` 列出成员，可按需以子代理逐个召唤。
2. 以 **subagent（后台）** 方式执行任务：把「人设文件全文 + 用户当前任务 + 相关上下文」作为子代理 prompt。人设全文必须完整注入，不得摘要——专家的价值在方法论细节。
3. 向用户转述子代理产出，并注明「由 <专家名> 提供」。
4. 若专家目录含 `skills/`，提示用户其配套技能可另行经 find-tools 安装。

### 5. 切换专家

用户想换人时：直接为下轮任务召唤另一位专家的 subagent 即可，无需任何「解绑」动作（DSH 子代理无状态）。UI 芯片状态由 hub 维护；对用户口径与 WorkBuddy 一致：「已在当前会话挂上 <专家名>」。

> 注意：picker 里点选专家 = **加载到当前会话**（单槽位，换一位会替换上一位并提示）；市场页点「召唤」= 新建会话并带上该专家。两条路径都不要混用。

### 6. 移除

```bash
curl -s -X POST http://127.0.0.1:3080/workbuddy-hub/uninstall \
  -H 'content-type: application/json' -d '{"kind":"expert","name":"<name>"}'
```

移除会同时摘掉所有会话里的挂载（`prunedSessions` 会如实报数），不会留下「chip 还在、注入已空」的幽灵专家。

## 约束

- **绝不**在用户未确认时下载专家文件或召唤 subagent。
- **不要自己加 --confirm/绕过审批**；**不要用裸 curl 调安装路由**（实测 401）；未登录时如实告知去扫码登录（专家检索与预检本身不需要登录）。
- 同一轮只推荐一个主专家（专家团算一个）；用户明确要多方案对比时可给 2-3 个候选卡片。
- 推荐阶段只读**官方注册表**（`/official-experts`），不下载内容文件、不读已废弃的镜像目录缓存。
- 子代理产出的专业意见需附「AI 生成，重大决策请咨询持证专业人士」提示（对齐 WorkBuddy 免责声明）。
