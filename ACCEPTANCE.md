# dsh-workbuddy-hub 发布前验收清单

> 用途：发布前由**独立验收方**逐项执行，产出「通过/不通过 + 证据」。
> 验收方**只读**：不改代码、不 commit、不重启生产；发现问题只报告（附 `文件:行号` 与复现步骤）。
> 基线：`git log -1` 的 HEAD 即被测提交；工作树必须 clean。

---

## 0. 环境准备（可复现，务必照做）

生产实例（3080）**不要动**。全部验收在隔离实例里做。

### 0.1 基础隔离实例（含两个预置工作区）

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
cd /home/kaitzh/deepseek-harness
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
EOF
# 启动命令在上面的基础上加 --patch，端口换 3998。
# ⚠️ --patch 的位置有讲究：必须写成 `web --patch <file> --host … --port …`
# （紧跟 web 之后、--host 之前）。写到命令末尾会报 unknown option（实测）。
cd /home/kaitzh/deepseek-harness
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
#   GET  /workbuddy-hub/catalog                                   镜像目录计数
#   GET  /workbuddy-hub/market-list?kind=…&q=…&page=1             市场列表（source=official|mirror）
#   GET  /workbuddy-hub/expert-injection?sessionId=…               该会话实际注入的专家
#   GET  /workbuddy-hub/expert-assemble?sessionId=…                deployment:persona-prefix 正文
#   GET  /workbuddy-hub/mounted?sessionId=…                        挂载列表
#   POST /workbuddy-hub/mount  {sessionId,kind,name}               挂载
```

CDP 辅助（已存在）：`/tmp/wbh-cdp.mjs`（`listTabs/connect/newTab/closeTab`）、`/tmp/lib.mjs`（`clickAt/hoverAt`）。

---

## A. 自动化与产物（必须先过，否则后面无意义）

| ID | 步骤 | 预期 | 证据 |
|---|---|---|---|
| **A1** | `set -o pipefail && npm test` | exit 0；15 个套件全部 `OK`/`ALL TESTS PASSED` | 尾部输出 |
| **A2** | `npm run build:client` 后 `git status --short` | `client.js` 无变化（证明 src 与产物同步） | 命令输出 |
| **A3** | `node test-package.mjs` | 通过；且其中「真打包→解压→import」一步成功 | 输出里 `import('./index.js') 成功` |
| **A4** | `npm pack --dry-run --json`，检查产物清单 | 含 `index.js expert-persona.js mcp-manager.js wb-market.js wb-experts.js wb-cats.js wb-unzip.js client.js client.css cordis.patch.yml` 与 `skills/*` | 文件清单 |
| **A5** | 跑完 `npm test` 后检查 `~/workbuddyskills/.meta/registry.json` 的 mtime 与 md5 | **与跑之前完全一致**（测试不得写用户真实状态） | 前后对比 |

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
| **S3** | 断网/官方接口不可用时打开市场页 | 走镜像兜底或给出可读错误；**不得**白屏 | 页面文本 + `source` 字段 |
| **S4** | `POST /mount` 传非法 name（含 `/`）与空 sessionId | 400/409 且不写脏数据 | 响应码 + mounts 未变 |
| **S5** | 未登录时把 `storeRoot` 指向临时目录启动 | 插件正常起来，不报错、不写用户真实目录 | 启动日志 + 目录对比 |

## R. 发布就绪与一致性

| ID | 步骤 | 预期 | 证据 |
|---|---|---|---|
| **R1** | 读 `README.md`，逐条对照**实际行为**（召唤语义、工作区、登录与保活、随插件 skill、~/.dsh 挂载） | 无与实现不符的描述 | 引用具体行号 |
| **R2** | `package.json` 的 `main/exports/files/peerDependencies/engines` | 自洽；`exports` 指向的文件都在产物里 | 文件 + 产物清单 |
| **R3** | 空跑一次「照 README 安装」的关键步骤（用临时目录） | 步骤可执行、无缺文件 | 命令输出 |
| **R4** | 检查是否有明文凭据落盘且权限 > 0600 | `workbuddy-auth.json`（及 health）为 **0600** | `ls -l` |
| **R5** | 代码里不应留会刷屏的调试日志塞满生产控制台 | `[wbh]` 日志可接受（多为 info），无报错级噪音 | 控制台抽样 |

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
