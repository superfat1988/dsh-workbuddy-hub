# dsh-workbuddy-hub

WorkBuddy 专家/技能/连接器市场 → DSH 的移植枢纽插件。

## 架构
- **镜像仓**: `superfat1988/workbuddyskills`（fork infometa/workbuddyskills，
  `mirror-ci` 分支承载每日 Actions 同步 workflow，main 纯净镜像上游）
- **内容仓**: `~/workbuddyskills/`（`.meta/registry.json` 安装记录 + skills/experts/connectors）
- **DSH 挂载**: skill 安装后符号链接 `~/.dsh/skills/workbuddy-<name>`（DSH 扫描器原生跟随）
- **随插件 skill**: `workbuddy-find-tools`（工具检索）、`workbuddy-experts`（专家推荐+召唤）

## HTTP 路由（Host 侧 `/workbuddy-hub`）
- `GET /health` — 状态
- `GET /catalog` — 目录索引（树+CATALOG，6h 缓存）
- `GET /catalog/search?q=&kind=experts|skills|connectors` — 检索
- `GET /installed` — 已装清单
- `POST /install {kind,name}` — 按需下载落地（lite 模式跳过 avatars 原图）
- `POST /uninstall {kind,name}` — 卸载

## 安全
- 下载内容逐文件扫描（piped-shell/eval/动态函数/进程spawn/凭据词/外链），标记进 registry
- 安装需用户显式确认；凭据走 DSH credentials，不落明文
