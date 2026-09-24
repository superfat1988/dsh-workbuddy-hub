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

console.log('hub-find (compact retrieval CLI) contract tests: OK')
