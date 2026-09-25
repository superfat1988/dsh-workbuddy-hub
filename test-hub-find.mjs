// hub-find.mjs 的契约测试：格式/上限/错误语义都在这里钉死。
//
// 为什么值得单独测：这个脚本是 agent 的**取数入口**，它的输出格式就是模型看到的全部内容。
// 一旦格式漂移（多列、换行、分隔符被内容污染），模型解析会出错；一旦 limit 失效，
// 就会重现「一次查询 473KB 灌进上下文」的事故。所以这里用的是**格式契约 + 上限契约**，
// 而不是「跑得不报错」。
import assert from 'node:assert/strict'
import {
  parseArgs, oneLine, formatRow, filterRows, storePaths,
  shapeExpert, shapeSkill, shapeConnector, run,
  DEFAULT_LIMIT, MAX_LIMIT,
} from './scripts/hub-find.mjs'
import { join } from 'node:path'
import { homedir } from 'node:os'

// ---- 1. 参数解析与**上限硬约束**（防 473KB 事故）-----------------------------
{
  assert.equal(parseArgs(['expert', '合同']).limit, DEFAULT_LIMIT, '默认 limit')
  assert.equal(parseArgs(['expert', '合同']).limit <= MAX_LIMIT, true)
  assert.equal(parseArgs(['expert', '合同', '--limit', '500']).limit, MAX_LIMIT, '超过上限必须被夹到 MAX_LIMIT')
  assert.equal(parseArgs(['expert', '合同', '--limit=9999']).limit, MAX_LIMIT, '--limit=N 形式同样受约束')
  assert.equal(parseArgs(['expert', '合同', '--limit', '0']).limit, 1, '下限 1')
  assert.equal(parseArgs(['expert', '合同', '--limit', '-5']).limit, 1, '负数被夹到 1')
  const a = parseArgs(['expert', '中文 法律', '--json'])
  assert.equal(a.kind, 'expert'); assert.equal(a.query, '中文 法律', '多词关键词要拼回来')
  assert.equal(a.json, true)
  assert.equal(parseArgs(['expert', 'x', '--store', '/tmp/s']).store, '/tmp/s')
  console.log('1. 参数解析与 limit 上限: OK')
}

// ---- 2. 一行一条 & 分隔符不可被污染 ----------------------------------------
{
  assert.equal(oneLine('a\nb\tc   d'), 'a b c d', '换行/制表/多空格收敛为单空格')
  assert.equal(oneLine('x|y'), 'x/y', '竖线要替换，否则会破坏「|」分列契约')
  assert.equal(oneLine('abcdefghij', 5).length, 5, '截断后长度不超过上限')
  assert.ok(oneLine('abcdefghij', 5).endsWith('…'))
  const line = formatRow({ kind: 'expert', name: 'demo', displayName: '演示|专家', note: 'a\nb', tags: ['x', 'y'] })
  assert.equal(line, 'expert/demo | 演示/专家 | a b | x,y')
  assert.equal(line.split('\n').length, 1, '永远是一行')
  console.log('2. 紧凑行格式: OK')
}

// ---- 3. 本地过滤（连接器没有 keyword 参数，只能在本地筛）---------------------
{
  const rows = [{ name: 'youzan-workbuddy', displayName: '有赞' }, { name: 'finenter', displayName: '进门投研' }]
  assert.equal(filterRows(rows, '有赞').length, 1)
  assert.equal(filterRows(rows, 'YOUZAN').length, 1, '大小写不敏感')
  assert.equal(filterRows(rows, '').length, 2, '空关键词不过滤')
  assert.equal(filterRows(rows, '不存在').length, 0)
  console.log('3. 本地过滤: OK')
}

// ---- 4. 整形：字段名兼容 snake_case / camelCase，字段缺失不崩 ---------------
{
  assert.deepEqual(shapeSkill({ skill_id: 'skill_1', name: 'xlsx', display_name_zh: 'Excel 表格处理', version: '1.0.0' }).displayName, 'Excel 表格处理')
  assert.equal(shapeSkill({ name: 'a' }).displayName, 'a', '缺中文名时退回 name')
  assert.equal(shapeConnector({ name: 'c', mcp: {} }).tags.includes('mcp'), true)
  assert.equal(shapeExpert({ name: 'e', tags: ['a', 'b', 'c', 'd'] }).tags.length, 3, 'tags 最多 3 个')
  console.log('4. 整形: OK')
}

// ---- 5. storePaths：默认内容仓与覆盖 ---------------------------------------
{
  assert.equal(storePaths('').root, process.env.WBH_STORE || join(homedir(), 'workbuddyskills'))
  const p = storePaths('/tmp/demo-store')
  assert.equal(p.state, '/tmp/demo-store/.meta/state')
  assert.equal(p.registry, '/tmp/demo-store/.meta/registry.json')
  console.log('5. storePaths: OK')
}

// ---- 6. run()：用注入的依赖跑，覆盖成功/无命中/需登录/异常四种语义 ----------
{
  const experts = async ({ query }) => (query === '空' ? { rows: [], total: 0 } : {
    rows: [{ kind: 'expert', name: 'demo', displayName: '演示专家', subtitle: '一句话定位', tags: ['t1'] }], total: 1,
  })
  const ok = await run(['expert', '合同'], { listExperts: experts })
  assert.equal(ok.code, 0)
  assert.equal(ok.lines[0], 'expert/demo | 演示专家 | 一句话定位 | t1')
  assert.match(ok.lines[1], /^# 命中 1 条，显示 1 条/, '要有总量/显示量这一行')

  const none = await run(['expert', '空'], { listExperts: experts })
  assert.deepEqual(none.lines, ['NO_MATCH'], '无命中只输出一行 NO_MATCH')

  const needLogin = await run(['skill', '表格'], { marketList: async () => { throw new Error('official market skill list failed: HTTP 401') } })
  assert.deepEqual(needLogin.lines, ['NEED_LOGIN'], '401 → NEED_LOGIN（模型据此提示去登录）')

  const broken = await run(['skill', '表格'], { marketList: async () => { throw new Error('boom') } })
  assert.match(broken.lines[0], /^ERROR boom$/)

  const usage = await run(['nonsense'])
  assert.equal(usage.code, 2, '用法错误用退出码 2')

  // 连接器无命中时要给出「官方共 N 个」，避免模型以为市场是空的
  const conn = await run(['connector', '地图'], { connectorRegistry: async () => [{ name: 'youzan-workbuddy', displayName: '有赞' }] })
  assert.match(conn.lines[0], /NO_MATCH 官方连接器共 1 个/)

  // --json 只输出一行合法 JSON（便于脚本消费）
  const j = await run(['expert', '合同', '--json'], { listExperts: experts })
  assert.equal(j.lines.length, 1)
  assert.equal(JSON.parse(j.lines[0])[0].name, 'demo')
  console.log('6. run() 语义（成功/NO_MATCH/NEED_LOGIN/ERROR/用法/JSON）: OK')
}

// ---- 7. inspect 子命令：格式契约（注入 fetcher，不联网、不落盘）-----------------
// inspect 的输出就是模型的「装前安全卡」，同样钉死格式：
//  · 六行固定骨架（INSPECT/体量/可执行脚本/风险标记/外网命令凭据/头部）；
//  · 风险标记如何呈现（有则列举、无则「无」）；
//  · NOT_FOUND / NEED_LOGIN / ERROR 一行语义；
//  · --json 输出一行合法 JSON。
{
  const {
    inspectError, formatInspectCard,
  } = await import('./wb-inspect.js')

  // 7-1) 安全卡骨架：六行固定前缀
  const card = {
    kind: 'skill', name: 'demo', displayName: '演示技能',
    files: 3, bytes: 2048, scriptCount: 1,
    riskFlags: ['run.py: spawns-process', 'run.py: external-url (x.example)'],
    external: { urls: ['x.example/a'], commandExecution: true, credentialHeaders: [] },
    head: '# Demo 这是头部摘要。',
  }
  const lines = formatInspectCard(card)
  assert.equal(lines[0], 'INSPECT skill/demo | 演示技能')
  assert.match(lines[1], /^体量: 3 文件 \/ 约 /)
  assert.equal(lines[2], '可执行脚本: 有(1 个)')
  assert.equal(lines[3], '风险标记: run.py: spawns-process; run.py: external-url (x.example)')
  assert.equal(lines[4], '外网/命令/凭据: 外链 1 个 / 声明命令执行')
  assert.match(lines[5], /^头部: /)
  assert.ok(lines.every(l => l.split('\n').length === 1), '安全卡必须一行一条')

  const clean = formatInspectCard({ ...card, riskFlags: [], external: { urls: [], commandExecution: false, credentialHeaders: [] }, scriptCount: 0 })
  assert.equal(clean[2], '可执行脚本: 无')
  assert.equal(clean[3], '风险标记: 无')
  assert.equal(clean[4], '外网/命令/凭据: 无')
  console.log('7. inspect 安全卡骨架（六行 + 无风险呈「无」）: OK')

  // 7-2) run(['inspect', ...])：整只替换预检函数（不碰网络与磁盘）→ 端到端格式契约
  const expertCard = {
    kind: 'expert', name: 'demo-expert', displayName: '演示专家',
    files: 2, bytes: 486 * 1024, scriptCount: 0, riskFlags: [],
    external: { urls: [], commandExecution: false, credentialHeaders: [] },
    head: '---\nname: demo-expert description: …', note: '头像约 475.4 KB（只记录体积，未拉内容）',
  }
  const skillCard = {
    kind: 'skill', name: 'demo-skill', displayName: '演示技能',
    files: 57, bytes: 1107 * 1024, scriptCount: 12,
    riskFlags: ['scripts/recalc.py: spawns-process'],
    external: { urls: ['a.example'], commandExecution: true, credentialHeaders: [] },
    head: '# Demo',
  }
  const connCard = {
    kind: 'connector', name: 'demo-conn', displayName: '演示连接器',
    files: 1, bytes: 289, scriptCount: 0,
    riskFlags: ['mcpServers.demo-conn.url: external-url (gw.example)', 'mcpServers.demo-conn.headers: sensitive-header'],
    external: { urls: ['gw.example'], commandExecution: false, credentialHeaders: ['sensitive-header'] },
    head: 'MCP 定义：transport=http',
  }
  const expertOut = await run(['inspect', 'expert', 'demo-expert', '--json'], {
    inspect: { inspectExpert: async () => expertCard },
  })
  assert.equal(expertOut.code, 0)
  const parsed = JSON.parse(expertOut.lines[0])
  assert.equal(parsed.kind, 'expert'); assert.equal(parsed.name, 'demo-expert'); assert.equal(parsed.files, 2)

  const skillOut = await run(['inspect', 'skill', 'demo-skill'], {
    inspect: { inspectSkill: async () => skillCard },
  })
  assert.equal(skillOut.code, 0)
  assert.equal(skillOut.lines[0], 'INSPECT skill/demo-skill | 演示技能')
  assert.ok(skillOut.lines.some(l => l.includes('spawns-process')), '风险标记必须出现在卡里')
  assert.ok(skillOut.lines.some(l => l.includes('声明命令执行')))

  const connOut = await run(['inspect', 'connector', 'demo-conn'], {
    inspect: { inspectConnector: async () => connCard },
  })
  assert.equal(connOut.code, 0)
  assert.ok(connOut.lines.some(l => l.includes('凭据')), '凭据线索要可见（含「凭据」字样）')
  assert.ok(connOut.lines[0].includes('connector/demo-conn'))
  console.log('8. inspect run() 端到端（打桩三 kind + --json）: OK')

  // 7-3) 失败语义：NOT_FOUND / NEED_LOGIN / ERROR / 用法
  const nf = await run(['inspect', 'expert', 'ghost'], {
    inspect: { inspectExpert: async () => { throw new Error('expert not in official registry: ghost') } },
  })
  assert.equal(nf.code, 3)
  assert.match(nf.lines[0], /^NOT_FOUND 官方市场\/注册表没有「expert\/ghost」/)

  const nl = await run(['inspect', 'skill', 'xlsx'], {
    inspect: { inspectSkill: async () => { throw new Error('official market skill list failed: HTTP 401 code=11217') } },
  })
  assert.equal(nl.code, 1)
  assert.match(nl.lines[0], /^NEED_LOGIN inspect skill\/xlsx 需要登录/)

  const er = await run(['inspect', 'connector', 'boom'], {
    inspect: { inspectConnector: async () => { throw new Error('upstream exploded') } },
  })
  assert.equal(er.code, 1)
  assert.equal(er.lines[0], 'ERROR upstream exploded')

  const usage = await run(['inspect', 'expert'])
  assert.equal(usage.code, 2)
  assert.match(usage.lines[0], /^ERROR 用法：hub-find.mjs inspect/)

  const badKind = await run(['inspect', 'vehicle', 'x'])
  assert.equal(badKind.code, 2)
  console.log('9. inspect 失败语义（NOT_FOUND/NEED_LOGIN/ERROR/用法）: OK')

  // 7-4) 预检失败分类器的边界
  assert.equal(inspectError(new Error('official skill not found: x')).code, 'NOT_FOUND')
  assert.equal(inspectError(new Error('skill package HTTP 404')).code, 'ERROR', '下载 404 ≠ 市场没有，归 ERROR 更如实')
  assert.equal(inspectError(new Error('HTTP 403')).code, 'NEED_LOGIN')
  console.log('10. inspectError 分类边界: OK')
}

console.log('hub-find (compact retrieval CLI) contract tests: OK')
