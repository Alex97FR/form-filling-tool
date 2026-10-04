# 表格转交扩展

这是一个 Chrome/Edge Manifest V3 扩展：在 Google Sheets 的右键菜单中加入“转交表格”，并通过独立控制台显示流程进度和日志。

## 安装

1. 打开 `chrome://extensions` 或 `edge://extensions`。
2. 打开“开发者模式”，选择“加载已解压的扩展程序”，选中本目录。
3. 点击浏览器右上角的“表格转交”扩展图标，就会打开独立的自动化控制台，在其中填写目标表格网址和分表名称。
4. 在 Google Sheets 中选择要处理的数据行，按 `Ctrl+C`，再右键选择“转交表格”。

组别配置：组别1沿用按列位置转交；组别2使用内置列映射（包括 B→F、L/M 合并到目标 M），复制组别2数据时不需要包含表头行。两个组别共用同一个插件和目标表。

## 当前边界

程序使用 Sheets API 进行无格式写入，只处理选中的数据内容，不复制源表格式。

## 更新地址层级

1. 将最新地址 CSV 的三列同步到目标 Google 表格的“地区配置”分表：A=国家、B=省州或所属区域、C=市区或街区，首行为表头。
2. 在控制台保存对应的“地区配置分表”名称，点击“刷新地区配置”，立即读取更新，不必等待每日检查。
3. 再运行报告地址分析。W/X/Y 使用同一条配置记录的层级；支持双语国家名、斜杠别名、编号街区和罗马数字分区，遵循配置中的上下级关系。

同名地址缺少上级信息时会记录待核实，不自动选第一条或最近地点。已有完整有效的 W/X/Y 路径保留；旧路径不符合新配置时，只有三列下拉项全部可用才一起纠正。CSV 是层级参考文件，扩展运行时读取 Google 表格，不直接读取本地 CSV。

本地回归检查：`node tests/address-matching.test.js`、`node tests/security.test.js`（仅使用 Node.js 标准库，不访问 API）。
提交到 master 或提交 PR 会执行语法、地址和安全检查；版本标签在检查通过后才打包发布。

## 可靠性

- 写入前预览，避免列错位或误操作。
- 支持断点续传，不重复写入已有数据。
- 自动过滤空行，保护目标表已有数据。
- Google 授权凭证过期时自动刷新。
- 支持批量查询、地址匹配和群组链接生成。
- 查询失败会记录日志，不影响其他数据处理。
- API Key 和本地配置只保存在本机，不上传到仓库。
- 支持在目标表 O 列右键“实时记录”：记录表链接和分表名称在“参数配置”中维护，用记录表 A 列匹配 ID，读取 B 列参加时长记录，并显示目标表 C/O/P/Q。

## 安全审核记录（2026-10-05）

### 项目与审核范围

项目使用 JavaScript、HTML、CSS 和 Chrome/Edge Manifest V3 API，没有应用框架、服务器、数据库或第三方运行时库，也没有 package.json、lock 文件或其他语言的依赖清单。应用直接依赖数量为 0。原 CI 使用 3 个外部 Node Action，其中证明 Action 还引用 2 个子 Action；本次已全部替换为 runner 自带的 Git、Node.js、GitHub CLI。

安全修复版本为 0.2.10，以区别于已发布的 0.2.9；本地安装包由修复后的提交生成。

审核覆盖所有源码、manifest、HTML/CSS、测试、README、忽略规则、发布工作流、34 个可达 Git 历史提交，以及本地旧 ZIP、CSV 和 XLSX 的可读内容。PNG 作为静态资源检查引用。外部服务的账户配置、服务端实现和浏览器用户配置不在源码审核范围内。

### 问题汇总

下列代码位置对应本次修复后的源码。依赖等级采用公告/审计工具评级；是否能在本项目中利用另行说明。

| 编号 | 类别 | 严重级别 | 位置 | 状态 |
| --- | --- | --- | --- | --- |
| D01 | 依赖 | Critical / High | 原 `.github/workflows/release.yml` 的 3 个 Node Action 及子 Action | 已修复：移除相关依赖链 |
| C01 | 代码 | High（条件性） | `dashboard.js:224`，Google 网页授权回调 | 已修复；真实账户攻击复现待确认 |
| S01 | 密钥 | High | `dashboard.js:2058`、`dashboard.html:63`，配置导出 | 已修复：默认排除 API Key |
| C02 | 代码 | Medium | `dashboard.js:306`、`:1175`、`:1193`、`:1228`、`:1766`，API/报告日志 | 已修复 |
| C03 | 代码 | Medium | `content.js:177`、`:194`、`:211`、`:255`，网页菜单事件 | 已修复 |
| C04 | 代码 | Medium | `.github/workflows/release.yml:13`、`:43`，CI 权限和发布隔离 | 已修复 |
| C05 | 代码 | Low | `dashboard.js:2063`，配置文件导入 | 已修复 |
| C06 | 代码 | Low | `dashboard.js:473`，旧历史记录链接 | 已修复：约束为 WhatsApp 号码链接 |
| C07 | 代码 | Low | `dashboard.js:2109`，清除配置 | 已修复：补充删除待转交和重试记录 |
| C08 | 代码 | Low | `content.js:91`，旧待转交记录 | 已修复：表格 ID、URL 参数及有效期校验 |
| R01 | 密钥 | Low | `dashboard.html:55`、`:63`，本机存储和主动密钥导出 | 建议关注：本机存储和勾选导出均不是密钥保险库 |
| R02 | 代码 | Low | `dashboard.html:56`，报告发送与历史保留 | 建议关注：已补充用途和保留范围提示 |

### 依赖审查与证据

此前仅检查 Action 本身的安全公告，不能据此判断其打包依赖安全。本次从官方仓库的**实际固定提交**下载 package.json/package-lock.json，运行 `npm audit --omit=dev --ignore-scripts --json`，没有安装或执行这些依赖，并与 GitHub Advisory Database 和官方维护声明交叉核对。

| 原 CI 依赖 | 固定提交 | 官方锁文件审计结果（Critical / High / Moderate） |
| --- | --- | --- |
| actions/checkout v4.2.2 | `11bd71901bbe5b1630ceea73d27597364c9af683` | 0 / 2 / 7 |
| actions/attest-build-provenance v2.4.0 | `e8998f949152b193b063cb0ec769d69d929409be` | composite，继续审查下面两个子 Action |
| actions/attest-build-provenance/predicate v1.1.5 | `1176ef556905f349f669722abf30bce1a6e16e01` | 1 / 7 / 7 |
| actions/attest v2.4.0 | `ce27ba3b4a9a139d9a20a4a07d69fabb52f1e5bc` | 2 / 7 / 7 |
| softprops/action-gh-release v2.6.2 | `3bb12739c298aeb8a4eeaf626c5b8d85266b0e65` | 0 / 2 / 0 |

这些数字为每个官方依赖图的受影响包数量，包含重叠依赖，不能相加作为本项目独立漏洞总数。

原 Action 的全部直接生产 npm 依赖实际版本如下（已随 Action 移除）：

| Action | 官方锁文件中的直接依赖 |
| --- | --- |
| checkout v4.2.2 | @actions/core 1.10.1；@actions/exec 1.1.1；@actions/github 6.0.0；@actions/io 1.1.3；@actions/tool-cache 2.0.1；uuid 9.0.1 |
| predicate v1.1.5 | @actions/attest 1.6.0；@actions/core 1.11.1 |
| attest v2.4.0 | @actions/attest 1.6.0；@actions/core 1.11.1；@actions/github 6.0.1；@actions/glob 0.5.0；@sigstore/oci 0.5.0；csv-parse 5.6.0 |
| action-gh-release v2.6.2 | @actions/core 3.0.0；@actions/github 9.0.0；@octokit/plugin-retry 8.1.0；@octokit/plugin-throttling 11.0.3；glob 13.0.6；mime-types 3.0.2 |

关键直接/间接依赖与利用条件：

| 包与实际版本 | 公告与修复版本 | 本项目触发情况 |
| --- | --- | --- |
| @sigstore/oci 0.5.0 | [凭据匹配混淆，Critical](https://github.com/advisories/GHSA-pf56-329r-95rw)，0.7.1 修复 | 需 Docker 凭据、可控 registry 和 `push-to-registry: true`；原流程只证明 ZIP，未启用 OCI 上传，不满足该触发条件 |
| tar 7.4.3 | [解压资源耗尽，Critical](https://github.com/advisories/GHSA-23hp-3jrh-7fpw)，该公告 7.5.19 修复；另有多个路径穿越/解析公告 | 本项目没有 Node tar 解压步骤；仅锁文件存在，未确认旧 Action 实际进入不可信 tar 解压路径；已移除依赖链 |
| undici 5.28.4 / 5.28.5 / 5.29.0 / 6.24.1 | 多个 HTTP/WebSocket 公告；[未请求 WebSocket 子协议导致 DoS](https://github.com/advisories/GHSA-rfgv-xxqx-mfg5) 在 6.28.1 / 7.29.1 / 8.10.2 修复 | Action 使用 HTTP；本项目没有 WebSocket 连接。每个其他 HTTP 公告的具体可达性待确认；已移除依赖链 |
| @fastify/busboy 2.1.0 / 2.1.1 | [multipart 解析 DoS，High](https://github.com/advisories/GHSA-x8mw-p69m-v3mx)，3.2.1 修复 | 没有处理外部 multipart 上传的服务器，也没有调用 Node formData 解析；已移除依赖链 |
| brace-expansion 1.1.11 / 2.0.1 / 5.0.5 | [嵌套展开 DoS，High](https://github.com/advisories/GHSA-qhr7-859c-m2p7)，对应分支 1.1.20 / 2.1.6 / 5.0.11 修复 | 原工作流使用固定 ZIP 文件名，不接受用户 glob 模式；已移除依赖链 |
| minimatch 3.1.2 / 9.0.5 | [重复通配符 DoS](https://github.com/advisories/GHSA-3ppc-4f35-3m26)，对应分支 3.1.3 / 9.0.6 修复；[嵌套 extglob DoS](https://github.com/advisories/GHSA-23c5-xmqv-rm74)，对应分支 3.1.4 / 9.0.7 修复 | 原模式来自固定工作流；未发现接受不可信模式的路径；已移除依赖链 |
| glob 10.4.5 | [CLI 命令注入，High](https://github.com/advisories/GHSA-5j98-mcp5-4vw2)，10.5.0 / 11.1.0 修复 | 未执行 `glob -c/--cmd`，库 API 不受此公告影响；已移除依赖链 |
| http-cache-semantics 4.1.1；ip-address 9.0.5；socks 2.8.3 | 锁文件审计分别报告 High / High / Moderate，包含缓存泄漏和地址边界问题 | 当前流程没有用户共享缓存或 IP 访问控制逻辑；代理/内部调用的可达性待确认；已移除依赖链 |
| @sigstore/core 2.0.0；@sigstore/sign 3.0.0；csv-parse 5.6.0 | 锁文件审计报告 Moderate，包含证明类型绑定及 CSV 对象处理问题 | 已移除旧证明依赖链；应用本身不使用这些 npm 包 |
| @actions/http-client 2.2.3；@octokit/endpoint 9.0.5；@octokit/plugin-paginate-rest 9.2.0 / 9.2.1；@octokit/request 8.4.0；@octokit/request-error 5.1.0；uuid 3.4.0 / 8.3.2 / 9.0.1 | 锁文件审计报告 Moderate，包含间接依赖与 ReDoS/缓冲区边界告警 | 已移除全部相关 Action；没有浏览器运行时引用 |

表中修复版本仅针对所链接公告，不能代表该版本消除了所有其他公告。审计也检查了当时可用的 checkout v7.0.1、attest v4.2.2 和 action-gh-release v3.0.3 的官方锁文件，仍分别有 1、3、2 个 High 级受影响包，因此单纯升级到最新 Action 不能达到依赖检查无告警的目标。

[softprops 官方维护说明](https://github.com/softprops/action-gh-release/blob/master/RELEASE.md)明确 v2.6.2 是停止支持的 v2 最终版本，已移除。未发现应用运行时仿冒包，也没有证据把仍在维护的其他官方项目标为废弃。

### 每项修复的原因与利用条件

- **C01：授权绑定。** 原网页授权没有随机 state，接受回调中的令牌时也没有逐项校验。若攻击者能引导授权窗口进入伪造/错配回调，可能置换账号或令牌；浏览器真实攻击链待确认。现在每次生成随机 state，校验回调 origin、路径、查询串、state、Bearer 类型及有效期，拒绝重复/无效参数，不再把短期令牌缓存至少 300 秒。
- **S01：导出密钥。** 旧备份默认含长期 API Key，用户分享备份即可泄露。现在默认省略 3 个密钥字段；自己的设备迁移可主动勾选明文导出，完成后复选框复位。无密钥备份导入时保留目标设备已有密钥。
- **C02：敏感日志。** 服务端错误、模型 JSON 解析异常和成功识别日志可能包含密钥、姓名、电话、地址或报告正文，截屏/复制日志会扩大暴露。现在 API 错误只显示状态和固定说明，模型格式错误不附原文，识别日志只保留行号、数量及匹配状态；正常结果仍在对应业务视图展示。
- **C03：网页调用扩展能力。** Google Sheets 页面脚本原可合成菜单点击事件，尝试调用扩展剪贴板读写和控制台导航。相关入口现在要求 `event.isTrusted`，消息接收端原有的扩展 ID、Google Sheets 来源和参数白名单继续生效。该检查不替代 Google 页面本身的可信性判断。
- **C04：发布权限。** 原测试与发布同 job，持有写入/OIDC/证明权限且 checkout 持久化凭据。现在测试 job 的 token 权限为空，匿名拉取公共仓库并核对事件 SHA；独立发布 job 在测试通过且事件为版本标签 push 时才获得 contents:write，令牌只传给发布步骤。shell 中只使用带引号的环境变量；标签格式和 manifest 版本必须匹配。
- **C05：导入验证。** 恶意或损坏的 JSON 文件原可写入错误类型配置，破坏后续加载。现在文件限制 256 KB，校验格式/版本、对象结构、字段类型/长度、组别/服务商值、Key 列表及标题白名单，验证通过后才写存储，不回显 JSON 解析片段。未发现任意代码执行或原型污染利用路径。
- **C06：历史链接。** 旧缓存直接作为 href 输出，若历史记录被污染可能产生任意链接。现在渲染时重新提取号码，固定 `https://wa.me/`；外链补齐 `noopener noreferrer`。未确认外部网页能直接改写扩展历史存储，此项为边界加固。
- **C07：清除残留。** 原“清除所有配置”漏删旧待转交文本和模型重试队列。现在一并删除，避免用户清除后仍残留数据状态。
- **C08：目标匹配。** 旧 `startsWith` 可能把相同前缀的不同 Spreadsheet ID 视为目标。现在按 Google origin 和完整 ID 匹配，保留指定 query/hash 的约束，拒绝无效/未来/超过 10 分钟的记录和非字符串正文。
- **R02：处理说明。** UI 补充报告正文发送给当前 Groq/Gemini 的用途，以及本机历史最多保留最近 365 个有记录日期的说明；CSS 为密钥导出选择项补充布局。

### 密钥与其他代码检查

源码、配置、文档、可达历史和本地可读 ZIP/XLSX 未命中常见真实 API Key、Token、云 AccessKey、私钥、含密码连接串或 Webhook 模式。manifest 的 RSA `key` 是扩展身份公钥，Google OAuth client_id 是公开标识，均不属于私钥。没有被跟踪的 .env、私钥或凭据文件；忽略规则已覆盖 .env、密钥文件、配置导出、ZIP 和本地数据样例。

没有发现需要轮换的真实泄露密钥。本项目通过扩展配置输入密钥，不读取服务端环境变量，因此没有添加不能在浏览器运行时生效的 .env.example。**如果曾把含 Key 的旧备份、日志或未包含在本仓库中的文件分享/提交到公开位置，必须去对应平台作废并重新生成 Key；仅删除文件不能撤销已经泄露的凭据。**

其他检查结论：未发现 SQL/NoSQL、命令执行、eval、新 Function、动态远程脚本、上传/解压入口或 TLS 校验关闭。网络请求端点固定为 Google Sheets、Groq、Gemini；表格 ID、分表范围和模型名进入 URL 时受约束/编码。动态 HTML 的业务字段转义，日志和对话框使用文本节点；剪贴板 HTML 只在分离文档中读表格文本，不附加到活动页面。所有外部选区/模型结果用 Sheets RAW 写入，唯一 USER_ENTERED 写入是程序生成的当天日期。消息边界校验来源及命令参数，无 externally_connectable。host_permissions 没有 `<all_urls>`，权限均对应现有功能。没有服务器 CORS、CSRF、反序列化、桌面 IPC/WebView 或移动端攻击面；工作流没有 pull_request_target 和第三方 Action。

### 开发者决定与验证范围

原可选方案是升级/维护 Node Action，或者使用 GitHub 原生不可变发布。开发者已同意后一方案；GitHub API 已回读确认仓库的 immutable releases 设置为 true。新流程使用 GitHub 自动生成的发布证明关联标签、提交和资产，并执行 `gh release verify` 与 `gh release verify-asset`。这是 GitHub 发布证明，原独立 SLSA build-provenance Action 已移除。未来已发布的资产和标签锁定，更正需要新版本；已存在的旧发布不会自动获得这些保护。[GitHub 机制说明](https://docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases)、[ZIP 校验命令](https://cli.github.com/manual/gh_release_verify-asset)。

修复后的 JavaScript 语法检查、地址匹配/写入一致性/缓存刷新回归、安全回归、工作流 Bash 语法检查和 git diff 空白检查均已通过。安全回归执行真实函数及事件处理代码，覆盖授权 state/回调/到期、备份字段、错误脱敏、来源/参数拒绝、合成点击拒绝、目标表 URL 边界；不使用真实凭据。

审核范围内已确认的问题均已修复，未留下已确认的 Critical/High 代码漏洞或项目管理的 Node Action 依赖链。真实 Chrome/Edge 授权、Google Sheets/Groq/Gemini 在线读写及新版本发布证明的端到端验证**待确认**，需在登录环境或下一次正式版本标签发布时执行。runner 自带 Git/Node/gh 由 GitHub 镜像维护，实际版本会打印到 CI 日志；本次不将其视作仓库自带 npm 依赖。

后续请保持浏览器与 runner 镜像更新，备份中主动包含密钥时只传给自己的设备，对外提供日志前复核内容。模型输出仍需业务核实：地址限制到配置路径并拒绝歧义，不能证明报告本身真实；减少送往模型的个人信息或改变本机保留周期需要另行确定业务要求。
