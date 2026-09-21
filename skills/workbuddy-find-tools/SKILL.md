---
name: workbuddy-find-tools
description: 在 WorkBuddy 技能/连接器镜像市场（295+ skills / 103+ connectors）中检索工具能力。当用户需要某种外部工具能力（查数据、连服务、调 API）而当前 DSH 未安装对应工具/连接器时使用；也用于用户说「找一个能 XX 的工具/连接器/技能」「市场里有没有 XX」时。返回候选卡片（名称/用途/前置条件），安装需用户确认后经 hub 插件执行。
version: 0.1.0
metadata:
  author: kaitzh
  source: dsh-workbuddy-hub
---

# workbuddy-find-tools（工具检索）

从本地镜像市场目录中检索 skills 与 connectors，返回推荐卡片。**绝不自动安装**——安装永远由用户确认。

## 何时使用

- 用户任务需要某种工具能力且当前环境没有对应工具
- 用户明确要求「找一个/推荐一个 XX 工具、连接器、技能」
- 模型自身判断缺工具时（对应 WorkBuddy「搜一遍市场，推荐给你」路径）

## 何时不使用

- 用户需要的是**专业判断/行业经验**（那是专家人设）→ 改用 `workbuddy-experts` skill
- 明确只想浏览已安装内容 → 用 hub 的 `GET /workbuddy-hub/installed`

## 使用步骤

### 1. 确认 hub 服务可用

```bash
curl -s http://127.0.0.1:3080/workbuddy-hub/health
```

失败时提示用户先安装/启用 `dsh-workbuddy-hub` 插件。

### 2. 检索

```bash
# kind 留空=全部；kind=skills 或 kind=connectors 可限定
curl -s "http://127.0.0.1:3080/workbuddy-hub/catalog/search?q=<关键词>&kind=skills"
curl -s "http://127.0.0.1:3080/workbuddy-hub/catalog/search?q=<关键词>&kind=connectors"
```

关键词建议：中文意图词优先（如「领券」「地图」「火车」「邮件」），无结果再换英文（coupon/map/train/mail）。

### 3. 呈现候选（推荐卡片格式，经 toolview 渲染）

对每个命中条目输出一张卡片：

```
[skill|connector] <name>
用途: <从 CATALOG.md 对应条目提取的中文描述>
前置: <API Key / 登录授权 / 无>
体量: <files> 文件（约 <KB> KB）
```

条目用途与前置条件从目录缓存 `~/workbuddyskills/.meta/catalog-cache.json` 的 `catalog` 数组按 `dir` 匹配；未命中时以目录名和文件构成概括。

### 4. 安装（必须用户明确确认后）

```bash
curl -s -X POST http://127.0.0.1:3080/workbuddy-hub/install \
  -H 'content-type: application/json' \
  -d '{"kind":"<skill|connector>","name":"<name>"}'
```

安装结果要点报给用户：
- `report.flags` 非空时列出安全扫描标记（如 spawns-process / mentions-credentials），提醒用户查看；
- skill 自动符号链接到 `~/.dsh/skills/workbuddy-<name>`，**下一轮对话生效**；
- connector 提示其 mcp.json 位置（`~/workbuddyskills/connectors/<name>/mcp.json`），MCP 型可据此注册。

### 5. 卸载

```bash
curl -s -X POST http://127.0.0.1:3080/workbuddy-hub/uninstall \
  -H 'content-type: application/json' \
  -d '{"kind":"...","name":"..."}'
```

## 话术约束（对齐 WorkBuddy 语义）

- 装不装、授不授权始终是用户的决定；每次推荐结尾固定询问：「要安装吗？」
- 安装连接器前必须说明其前置条件（尤其需要账号授权/凭据的）。
- 未检索到匹配时如实说明，不硬凑；可建议放宽关键词。
