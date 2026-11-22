const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const nodes = {
  '#regionCacheStatus': { id: 'regionCacheStatus', textContent: '已读取缓存：800 行，2026/11/20 17:42:56；每天 12:00 检查', getAttribute: () => null }
};
const log = {};
const diagnosis = {};
const picker = { replaceChildren() {}, addEventListener() {} };
let storageChanged;
const root = { querySelectorAll: selector => selector === '[data-localized-output]' ? [log, diagnosis] : [] };
const context = {
  chrome: { storage: { local: { get: async () => ({ interfaceLanguage: 'en' }) }, onChanged: { addListener: callback => { storageChanged = callback; } } } },
  document: { documentElement: root, createTreeWalker: () => ({ nextNode: () => false }),
    querySelector: () => picker, querySelectorAll: selector => Object.values(nodes).filter(node => selector.includes('#' + node.id)) },
  NodeFilter: { SHOW_TEXT: 4 },
  MutationObserver: class { observe() {} },
  Option: class {}
};
vm.runInNewContext(fs.readFileSync(require.resolve('../i18n.js'), 'utf8'), context);
const { t, render, setup } = context.interfaceLocale;
const readyMessage = '控制台已就绪，等待操作。';
const diagnosticMessage = '数据范围 A:BM：成功，用时 1 分 2.5 秒。';
render(log, () => t(readyMessage));
render(diagnosis, () => t(diagnosticMessage));

void (async () => {
  await setup();
  assert.equal(log.textContent, 'Console ready.');
  assert.equal(diagnosis.textContent, 'data range A:BM: succeeded in 1 min 2.5 s.');
  assert.equal(nodes['#regionCacheStatus'].textContent, 'Cache loaded: 800 rows, 2026/11/20 17:42:56. Checked daily at 12:00.');
  for (const language of ['fr', 'pt', 'sw']) {
    storageChanged({ interfaceLanguage: { newValue: language } }, 'local');
    assert.equal(root.lang, language);
    for (const node of [nodes['#regionCacheStatus'], log, diagnosis]) {
      assert.doesNotMatch(node.textContent, /\p{Script=Han}/u);
    }
    assert.equal(t('目标位置已保存：地区配置').endsWith('地区配置'), true);
  }
  storageChanged({ interfaceLanguage: { newValue: 'zh' } }, 'local');
  assert.equal(log.textContent, readyMessage);
  assert.equal(diagnosis.textContent, diagnosticMessage);
  assert.match(nodes['#regionCacheStatus'].textContent, /^已读取缓存：800 行/);
})().catch(error => { console.error(error); process.exitCode = 1; });

const manifest = JSON.parse(fs.readFileSync(require.resolve('../manifest.json'), 'utf8'));
for (const locale of ['zh_CN', 'en', 'pt_BR', 'pt_PT', 'sw', 'fr']) {
  const browserMessages = JSON.parse(fs.readFileSync(require.resolve(`../_locales/${locale}/messages.json`), 'utf8'));
  for (const entry of [manifest.name, manifest.description, manifest.action.default_title]) {
    const key = /^__MSG_(.+)__$/.exec(entry)?.[1];
    assert.ok(browserMessages[key]?.message, `Missing manifest message ${entry} for ${locale}`);
  }
}

const localizedExamples = [
  'Google 授权失败：Google 授权请求校验失败，请重新授权。。',
  '续传发现 2 个冲突单元格（C2, D2）。请先核对目标区域 Sheet1!C2:D2。继续会覆盖冲突内容，是否继续？',
  '确认覆盖并继续',
  '配置导入失败：配置字段格式不正确。',
  '第 5 行字段处理完成：年龄已识别，职业未识别，地址待核实，类别已识别。',
  '重跑完成：成功 4 行，回写 10 个字段；仍失败 1 行（第 6 行）。',
  '没有找到目标分表“Sheet1”，已停止自动粘贴，避免贴错表。',
  '地址识别 8 行：国家 8/8 · 省 7/8（其中地理推断 1·近邻推断 1）· 市/区 6/8；国家未命中: 2；市/区未命中: 3, 4'
];
for (const language of ['en', 'pt', 'sw', 'fr']) {
  context.interfaceLocale.setLanguage(language);
  for (const message of localizedExamples) {
    assert.doesNotMatch(t(message), /\p{Script=Han}/u, `${language}: ${message}`);
  }
  assert.match(t('已将 E2:E4 设置为“已完成”。'), /已完成/, 'Preserve spreadsheet cell values');
  for (const page of ['dashboard', 'options']) {
    const html = fs.readFileSync(require.resolve(`../${page}.html`), 'utf8');
    for (const match of html.matchAll(/>([^<>]+)<|(?:title|aria-label|placeholder)="([^"]+)"/g)) {
      const text = (match[1] ?? match[2]).trim();
      if (/\p{Script=Han}/u.test(text) && text !== '中文') {
        assert.notEqual(t(text), text, `${language}: ${page}: ${text}`);
      }
    }
  }
}
