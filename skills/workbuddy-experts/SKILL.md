---
name: workbuddy-experts
description: WorkBuddy 专家顾问。当对话中判断任务需要专业判断、行业经验或领域方法论时（如审合同、读财报、写论文、投资分析、法律咨询、内容创作策略），或用户说「找个专家」「有没有懂 XX 的专家」「召唤专家」时，从专家镜像库（411 个专家：技术工程 754、教育学习 1103、内容创作 1197、金融投资 389 等分类）检索推荐合适的人设。专家=角色切换机制，不是工具：不自动调用，只能推荐，由用户决定召唤；同一会话建议只挂一个专家。召唤时按需下载该专家文件并以 subagent 人设加载。
version: 0.1.0
metadata:
  author: kaitzh
  source: dsh-workbuddy-hub
---

# workbuddy-experts（专家顾问）

WorkBuddy 语义的专家推荐与召唤。核心规则：**专家只能推荐，不能自动调用；召唤=用户决定；一次一个。**

## 与 workbuddy-find-tools 的分工

| | 本 skill | workbuddy-find-tools |
|---|---|---|
| 找什么 | 专家人设（判断力、方法论） | 工具能力（数据、API、连接器） |
| 触发信号 | 需要专业判断/行业经验 | 需要外部数据/操作能力 |
| 推荐产物 | 专家卡片 → subagent 召唤 | 工具卡片 → 安装 |

一句话里同时出现外部数据需求 + 专业判断需求时：先走 find-tools 拿数据，专家推荐放下一轮（WorkBuddy 顺位规则：拿不到数据，再专业的框架也是空转）。

## 使用步骤

### 1. 检索专家目录

```bash
curl -s "http://127.0.0.1:3080/workbuddy-hub/catalog/search?q=<关键词>&kind=experts"
```

关键词取用户意图的领域词（法务/财报/论文/股票/小红书/合同…），中英都试。

### 2. 推荐卡片（3 个以内，宁缺毋滥）

```
[expert] <name>  <分类>
人设: <description / 从 plugin.json 提取的 displayName.zh>
形态: 单专家 | 专家团(lead + N 成员)
体量: <files> 文件
```

形态判断：条目 `hasPluginJson=true` 且目录含 `agents/` 多个 md → 专家团；否则单专家。

结尾固定询问：「召唤 TA 吗？」或「想看看其他候选吗？」

### 3. 召唤（必须用户明确确认）

```bash
curl -s -X POST http://127.0.0.1:3080/workbuddy-hub/install \
  -H 'content-type: application/json' -d '{"kind":"expert","name":"<name>"}'
```

召唤后：

1. 读 `~/workbuddyskills/experts/<name>/` 下的文件：
   - 单专家：`agents/<agentName>.md`（对应 plugin.json 的 `agentName` 字段）即人设全文；无 agents/ 时用 SKILL.md 或 README.md 的人设部分。
   - 专家团：`teamInfo.leadAgent` 对应的 `agents/<lead>.md` 为主人设；`memberAgents` 列出成员，可按需以子代理逐个召唤。
2. 以 **subagent（后台）** 方式执行任务：把「人设文件全文 + 用户当前任务 + 相关上下文」作为子代理 prompt。人设全文必须完整注入，不得摘要——专家的价值在方法论细节。
3. 向用户转述子代理产出，并注明「由 <专家名> 提供」。
4. 若专家目录含 `skills/`（如 tmap-lbs-plugin），提示用户其配套技能可另行经 find-tools 安装。

### 4. 切换专家

用户想换人时：直接为下轮任务召唤另一位专家的 subagent 即可，无需任何「解绑」动作（DSH 子代理无状态）。UI 芯片状态由 hub 维护；对用户口径与 WorkBuddy 一致：「已在当前会话挂上 <专家名>」。

### 5. 移除

```bash
curl -s -X POST http://127.0.0.1:3080/workbuddy-hub/uninstall \
  -H 'content-type: application/json' -d '{"kind":"expert","name":"<name>"}'
```

## 约束

- **绝不**在用户未确认时下载专家文件或召唤 subagent。
- 同一轮只推荐一个主专家（专家团算一个）；用户明确要多方案对比时可给 2-3 个候选卡片。
- 专家元数据（名称/描述/分类）在推荐阶段**只读目录缓存**，不下载内容文件。
- 子代理产出的专业意见需附「AI 生成，重大决策请咨询持证专业人士」提示（对齐 WorkBuddy 免责声明）。
