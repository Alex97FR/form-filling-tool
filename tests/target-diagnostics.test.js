const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'dashboard.js'), 'utf8');
const slice = (start, end) => source.slice(source.indexOf(start), source.indexOf(end));
const canary = 'PRIVATE_CELL_OR_SERVER_CONTENT';
const targetUrl = 'https://docs.google.com/spreadsheets/d/local-target/edit';
const metadata = { sheets: [
  { properties: { sheetId: 7, title: "Target's sheet", gridProperties: { rowCount: 1000, columnCount: 65 } } },
  { properties: { sheetId: 8, title: 'Other', gridProperties: { rowCount: 10, columnCount: 3 } } }
] };
const settings = { sheets: [{ properties: { sheetId: 7 }, protectedRanges: [
  { warningOnly: true, requestingUserCanEdit: false },
  { requestingUserCanEdit: false },
  { requestingUserCanEdit: true }
], conditionalFormats: [{ ranges: [] }] }] };

function harness(respond) {
  const requests = [];
  const messages = [];
  const timers = new Map();
  let nextTimer = 0;
  const context = {
    URL, AbortController, performance,
    log: message => messages.push(message),
    setTimeout(callback, delay) {
      if (delay === 1000) { queueMicrotask(callback); return 0; }
      const id = ++nextTimer;
      timers.set(id, callback);
      return id;
    },
    clearTimeout: id => timers.delete(id),
    fetch: async (url, init) => {
      const parsed = new URL(url);
      assert.equal(parsed.origin, 'https://sheets.googleapis.com');
      assert.equal(init.method || 'GET', 'GET');
      assert.equal(init.body, undefined);
      assert.ok(init.signal);
      requests.push({ url: parsed, init });
      const reply = await respond(parsed, init, requests.length);
      return { ok: reply.status === undefined || reply.status === 200, status: reply.status || 200,
        json: async () => reply.data, text: async () => canary };
    }
  };
  vm.runInNewContext(slice('const parseSpreadsheetId =', 'const insertRowsRequest =')
    + '\n' + source.match(/^const sheetColumnName = [\s\S]*?^};/m)[0]
    + '\n' + slice('const formatDuration =', 'const openAppDialog =')
    + '\n' + slice('async function sheetsRequest', 'const readValues =')
    + '\nglobalThis.flows = { diagnoseTargetSheet, readTargetSheet };', context);
  const run = (name = "Target's sheet") => context.flows.diagnoseTargetSheet('PRIVATE_TOKEN', targetUrl, name);
  return { context, requests, messages, timers, run };
}

const success = url => {
  if (url.pathname.includes('/values/')) return { data: { values: [[canary, '', 0, false]] } };
  return { data: url.searchParams.has('ranges') ? settings : metadata };
};

async function main() {
  const good = harness(success);
  await good.run();
  assert.equal(good.requests.length, 5);
  assert.deepEqual(good.requests.filter(item => item.url.pathname.includes('/values/')).map(item => decodeURIComponent(item.url.pathname.split('/values/')[1])), [
    "'Target''s sheet'!A1:A20", "'Target''s sheet'!A1:BM20", "'Target''s sheet'!A:BM"
  ]);
  const report = good.messages.join('\n');
  assert.match(report, /65030 个已分配网格单元格/);
  assert.match(report, /保护范围 3 个.*范围 1 个.*规则 1 条/);
  assert.match(report, /1 行、3 个非空单元格/);
  assert.match(report, /三项数据读取均成功/);
  for (const secret of [canary, 'PRIVATE_TOKEN', 'local-target', 'https://']) assert.ok(!report.includes(secret));
  assert.equal(good.timers.size, 0);

  const wideFailure = harness(url => url.pathname.includes('/values/') && decodeURIComponent(url.pathname).endsWith('!A:BM')
    ? { status: 503 } : success(url));
  await wideFailure.run();
  assert.equal(wideFailure.requests.length, 5); // Failed reads are not silently retried.
  assert.match(wideFailure.messages.join('\n'), /少量行读取成功，整列范围读取失败/);
  assert.match(wideFailure.messages.join('\n'), /HTTP 503/);
  assert.ok(!wideFailure.messages.join('\n').includes(canary));

  const smallFailure = harness(url => url.pathname.includes('/values/') ? { status: 503 } : success(url));
  await smallFailure.run();
  assert.equal(smallFailure.requests.length, 3); // Stop before requesting larger ranges.
  assert.match(smallFailure.messages.join('\n'), /小范围读取已失败/);

  const protectedFailure = harness(url => url.searchParams.has('ranges') ? { status: 403 } : success(url));
  await protectedFailure.run();
  assert.equal(protectedFailure.requests.length, 5);
  assert.match(protectedFailure.messages.join('\n'), /保护及条件格式检查未完成/);

  for (const status of [403, 404, 429]) {
    const denied = harness(() => ({ status }));
    await denied.run();
    assert.equal(denied.requests.length, 1);
    assert.match(denied.messages.join('\n'), new RegExp(`HTTP ${status}`));
    assert.ok(!denied.messages.join('\n').includes(canary));
  }
  const expired = harness(() => ({ status: 401 }));
  await assert.rejects(expired.run, error => error.status === 401);
  assert.equal(expired.requests.length, 1);

  const missing = harness(success);
  await missing.run('Missing');
  assert.equal(missing.requests.length, 1);
  assert.match(missing.messages.join('\n'), /找不到配置的目标分表/);

  const narrow = harness(url => url.searchParams.has('ranges') ? { data: settings }
    : url.pathname.includes('/values/') ? { data: {} }
      : { data: { sheets: [{ properties: { sheetId: 7, title: "Target's sheet", gridProperties: { rowCount: 4, columnCount: 5 } } }] } });
  await narrow.run();
  assert.deepEqual(narrow.requests.filter(item => item.url.pathname.includes('/values/')).map(item => decodeURIComponent(item.url.pathname).split('!')[1]), ['A1:A4', 'A1:E4', 'A:E']);
  assert.match(narrow.messages.join('\n'), /少于 65 列/);

  const stalled = harness((_url, init) => new Promise((_resolve, reject) => {
    init.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
  }));
  const waiting = stalled.run();
  assert.equal(stalled.timers.size, 1);
  [...stalled.timers.values()][0]();
  await waiting;
  assert.equal(stalled.requests.length, 1);
  assert.equal(stalled.requests[0].init.signal.aborted, true);
  assert.match(stalled.messages.join('\n'), /超过 30 秒/);
  assert.match(stalled.messages.join('\n'), /诊断结束/);
  assert.equal(stalled.timers.size, 0);

  // Keep the deadline active while the response body is being consumed.
  const bodyStalled = harness(success);
  let bodyReading = false;
  bodyStalled.context.fetch = async (_url, init) => ({ ok: true, status: 200, json: () => new Promise((_resolve, reject) => {
    bodyReading = true;
    init.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
  }) });
  const readingBody = bodyStalled.context.flows.readTargetSheet('PRIVATE_TOKEN', 'https://sheets.googleapis.com/local', 'Body');
  for (let attempt = 0; attempt < 10 && !bodyReading; attempt++) await Promise.resolve();
  assert.equal(bodyReading, true);
  [...bodyStalled.timers.values()][0]();
  await assert.rejects(() => readingBody, error => error.code === 'READ_TIMEOUT');
  assert.equal(bodyStalled.timers.size, 0);

  const offline = harness(() => { throw new TypeError(canary); });
  await offline.run();
  assert.match(offline.messages.join('\n'), /网络连接异常/);
  assert.ok(!offline.messages.join('\n').includes(canary));

  // Exercise the UI entry and button restoration without a real Google account.
  const elements = Object.fromEntries(['start', 'diagnoseTarget', 'targetUrl', 'targetTab', 'targetDiagnosisReport', 'copyTargetDiagnosis']
    .map(id => [`#${id}`, { disabled: false, textContent: '', value: '' }]));
  elements['#targetUrl'].value = targetUrl;
  elements['#targetTab'].value = "Target's sheet";
  let calls = 0;
  const ui = { $: id => elements[id], isGoogleSheetsUrl: () => true, log() {},
    withFreshToken: async run => run('PRIVATE_TOKEN'),
    diagnoseTargetSheet: async (_token, url, tab, report) => {
      calls++;
      assert.equal(url, targetUrl);
      assert.equal(tab, "Target's sheet");
      assert.equal(elements['#start'].disabled, true);
      report('Diagnostic report');
    }, copyText: async value => { ui.copied = value; } };
  vm.runInNewContext(slice("$('#diagnoseTarget').onclick", "$('#clearLog').onclick"), ui);
  await elements['#diagnoseTarget'].onclick();
  assert.equal(calls, 1);
  assert.equal(elements['#start'].disabled, false);
  assert.equal(elements['#diagnoseTarget'].disabled, false);
  assert.equal(elements['#copyTargetDiagnosis'].disabled, false);
  await elements['#copyTargetDiagnosis'].onclick();
  assert.match(ui.copied, /Diagnostic report/);
  elements['#start'].disabled = true;
  await elements['#diagnoseTarget'].onclick();
  assert.equal(calls, 1);
  elements['#start'].disabled = false;
  ui.withFreshToken = async () => { throw new Error(canary); };
  await elements['#diagnoseTarget'].onclick();
  assert.equal(elements['#start'].disabled, false);
  assert.match(elements['#targetDiagnosisReport'].textContent, /诊断未完成/);
  assert.ok(!elements['#targetDiagnosisReport'].textContent.includes(canary));
  console.log('Target diagnostics tests passed (read-only, range comparison, HTTP errors, deadlines, redaction, UI).');
}
const watchdog = setTimeout(() => { console.error('Target diagnostics tests did not complete.'); process.exitCode = 1; }, 5000);
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => clearTimeout(watchdog));
