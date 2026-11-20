const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'dashboard.js'), 'utf8');
const startHandler = source.slice(source.indexOf("$('#start').onclick"), source.indexOf('const updateRetryFailedButton'));
const authorizedTransfer = startHandler.slice(startHandler.indexOf('await withFreshToken'));
assert.doesNotMatch(authorizedTransfer, /\$\('#(?:targetUrl|targetTab|statusText|aDateValue|personnelId)'\)\.value/);
const insertRowsSource = source.match(/const insertRowsRequest = \(sheetId, startIndex, endIndex, inheritFromBefore\) => \(\{[\s\S]*?\n\}\);/)[0];
const insertRowsContext = {};
vm.runInNewContext(insertRowsSource + '\nglobalThis.insertRowsRequest = insertRowsRequest;', insertRowsContext);
assert.equal(insertRowsContext.insertRowsRequest(7, 50, 53, false).requests[0].insertDimension.inheritFromBefore, false);
assert.equal(insertRowsContext.insertRowsRequest(7, 1000, 1003, true).requests[0].insertDimension.inheritFromBefore, true);
assert.equal(insertRowsContext.insertRowsRequest(7, 0, 3, false).requests[0].insertDimension.inheritFromBefore, false);
const spreadsheetIdSource = source.slice(source.indexOf('const parseSpreadsheetId ='), source.indexOf('const quoteSheet ='));
const spreadsheetIdContext = { URL };
vm.runInNewContext(spreadsheetIdSource + '\nglobalThis.parseSpreadsheetId = parseSpreadsheetId;', spreadsheetIdContext);
assert.equal(spreadsheetIdContext.parseSpreadsheetId('https://docs.google.com/spreadsheets/d/sheet_123/edit'), 'sheet_123');
assert.equal(spreadsheetIdContext.parseSpreadsheetId('https://docs.google.com/spreadsheets/u/0/d/sheet_123/edit'), 'sheet_123');
for (const url of ['https://docs.google.com.evil/spreadsheets/d/sheet_123/edit', 'https://evil.example/spreadsheets/d/sheet_123/edit', 'https://user@docs.google.com/spreadsheets/d/sheet_123/edit', 'http://docs.google.com/spreadsheets/d/sheet_123/edit']) {
  assert.throws(() => spreadsheetIdContext.parseSpreadsheetId(url));
}
const extendRulesSource = source.match(/const extendConditionalFormatsForInsertedRows = \([\s\S]*?\n\}\);/)[0];
const formatContext = {};
vm.runInNewContext(extendRulesSource + '\nglobalThis.extend = extendConditionalFormatsForInsertedRows;', formatContext);
const rules = [
  { ranges: [{ sheetId: 7, startRowIndex: 50, endRowIndex: 100, startColumnIndex: 2, endColumnIndex: 5 }], booleanRule: { condition: { type: 'TEXT_EQ' } } },
  { ranges: [{ sheetId: 7, startRowIndex: 0, endRowIndex: 50 }] },
  { ranges: [{ sheetId: 8, startRowIndex: 0, endRowIndex: 100 }] },
  { ranges: [{ sheetId: 7, startRowIndex: 0 }] }
];
const expanded = formatContext.extend(rules, 7, 50, 3);
assert.equal(expanded.length, 1);
assert.equal(expanded[0].updateConditionalFormatRule.rule.ranges[0].endRowIndex, 103);
assert.equal(formatContext.extend([rules[3]], 7, 100, 3, true).length, 0); // Unbounded rules already cover appended rows.
const appendedRule = { ranges: [{ sheetId: 7, startRowIndex: 0, endRowIndex: 100 }] };
assert.equal(formatContext.extend([appendedRule], 7, 100, 3, true)[0].updateConditionalFormatRule.rule.ranges[0].endRowIndex, 103);
const slice = (start, end) => source.slice(source.indexOf(start), source.indexOf(end));
const context = { URL, URLSearchParams, crypto: require('node:crypto').webcrypto };
vm.runInNewContext(spreadsheetIdSource + '\n' + slice('function parseGoogleAuthRedirect', 'async function getGoogleToken')
  + '\n' + slice('async function sheetsRequest', 'const readValues =')
  + '\n' + slice('function parseModelJson', 'async function callLlmWithRetry')
  + '\n' + source.match(/^const deviceConfigKeys = .*$/m)[0]
  + '\n' + slice('const normalizeTransferGroup =', 'async function copyText')
  + '\n' + slice('const syncConfigKeys =', "$('#exportConfig').onclick")
  + '\nglobalThis.security = { parseGoogleAuthRedirect, getWebGoogleToken, sheetsRequest, parseModelJson, callGemini, buildConfigExport, parseConfigImport };', context);
const { parseGoogleAuthRedirect, getWebGoogleToken, sheetsRequest, parseModelJson, callGemini, buildConfigExport, parseConfigImport } = context.security;

const redirect = 'https://extension-id.chromiumapp.org/';
const state = 'random-request-state';
const response = overrides => redirect + '#' + new URLSearchParams({
  state, access_token: 'local-test-token', token_type: 'Bearer', expires_in: '3600', ...overrides
});
assert.equal(parseGoogleAuthRedirect(response({}), redirect, state).token, 'local-test-token');
for (const url of [
  response({ state: 'other-request' }), response({ state: '' }), response({ expires_in: 'NaN' }),
  response({ expires_in: '-1' }), response({ expires_in: '9999999' }), response({ token_type: 'Basic' }),
  response({ access_token: '' }), response({ access_token: 'line\nbreak' }),
  response({}) + '&state=another', response({}) + '&access_token=another',
  response({}) + '&token_type=Basic', response({}) + '&expires_in=9999999',
  response({}).replace('extension-id.chromiumapp.org', 'attacker.example'),
  response({}).replace('/#', '/extra#'), response({}).replace('/#', '/?access_token=in-query#'),
  response({ error: 'secret-provider-detail' })
]) assert.throws(() => parseGoogleAuthRedirect(url, redirect, state));

const sync = { targetUrl: 'https://docs.google.com/spreadsheets/d/local/edit', targetTab: 'Target', targetHeaderRows: '7', aDateValue: '11:15 a.m.', aDateOptions: '10 a.m.\n11:15 a.m.', unexpected: 'discard' };
const local = { groqApiKey: 'fake-groq-key', groqApiKeys: ['fake-groq-key'], geminiApiKey: 'fake-gemini-key', llmProvider: 'groq', regionTab: 'Regions', unexpected: 'discard' };
const exported = buildConfigExport(sync, local);
assert.equal(Object.hasOwn(exported.local, 'llmProvider'), false);
for (const key of ['groqApiKey', 'groqApiKeys', 'geminiApiKey', 'unexpected']) assert.equal(Object.hasOwn(exported.local, key), false);
assert.equal(Object.hasOwn(exported.sync, 'unexpected'), false);
for (const [group, regionKey] of [['group4', 'regionTabGroup4'], ['group5', 'regionTabGroup5']]) {
  const backup = buildConfigExport({ ...sync, transferGroup: group }, { ...local, [regionKey]: 'Team Regions' });
  assert.equal(parseConfigImport(backup).transferGroup, group);
  assert.equal(parseConfigImport(backup)[regionKey], 'Team Regions');
}
assert.equal(Object.hasOwn(buildConfigExport(sync, local, true).local, 'geminiApiKey'), false);
const imported = parseConfigImport({ ...exported, local: { ...local, reportLabels: { brebis: '<script>plain text</script>', unexpected: 'discard' }, unexpected: 'discard' } });
assert.equal(imported.targetTab, 'Target');
assert.equal(imported.targetHeaderRows, '7');
assert.equal(imported.aDateOptions, sync.aDateOptions);
assert.equal(imported.aDateValue, sync.aDateValue);
const timeOptionsContext = {};
vm.runInNewContext(source.match(/^const parseADateOptions = .*$/m)[0] + '\nglobalThis.parseOptions = parseADateOptions;', timeOptionsContext);
assert.deepEqual(Array.from(timeOptionsContext.parseOptions(' 10 a.m.\r\n\n11:15 a.m.\n10 a.m. ')), ['10 a.m.', '11:15 a.m.']);
assert.equal(imported.geminiApiKey, 'fake-gemini-key');
assert.equal(Object.hasOwn(imported, 'groqApiKey'), false);
assert.equal(Object.hasOwn(imported, 'llmProvider'), false);
assert.equal(Object.hasOwn(parseConfigImport(exported), 'geminiApiKey'), false);
assert.equal(Object.hasOwn(imported, 'reportLabels'), false);
for (const payload of [
  { ...exported, version: 999 }, { ...exported, sync: [] }, { ...exported, local: null },
  { ...exported, sync: { targetUrl: { url: 'not-a-string' } } },
  { ...exported, sync: { targetUrl: 'https://other.example/spreadsheets/d/local/edit' } },
  { ...exported, sync: { targetHeaderRows: '-1' } },
  { ...exported, sync: { targetHeaderRows: '2.5' } },
  { ...exported, sync: { targetHeaderRows: '2147483647' } }
]) assert.throws(() => parseConfigImport(payload));
const prototypePayload = JSON.parse(JSON.stringify(exported).replace('"local":{', '"local":{"__proto__":{"polluted":true},'));
assert.equal(Object.hasOwn(parseConfigImport(prototypePayload), '__proto__'), false);

const canary = 'SENSITIVE_TEST_VALUE';
for (const raw of [canary, '{"name":"' + canary, '{"name":' + canary + '}']) {
  assert.throws(() => parseModelJson(raw, 'Test'), error => /JSON/.test(error.message) && !error.message.includes(canary));
}
assert.equal(parseModelJson('{"name":"local fixture"}', 'Test').name, 'local fixture');

async function checkRetryTarget() {
  const elements = {
    '#retryFailedRows': { disabled: false },
    '#targetUrl': { value: 'https://docs.google.com/spreadsheets/d/other/edit' },
    '#targetTab': { value: 'Target' },
    '#targetHeaderRows': { value: '2', validity: { valid: true } }
  };
  const queue = { rows: [5], spreadsheetId: 'original', targetTab: 'Target' };
  const logs = [];
  const notices = [];
  let authRequests = 0;
  const retryContext = {
    URL, $: selector => elements[selector], targetDataStartRow: () => 3,
    extensionStorage: { local: { get: async () => ({ llmRetryQueue: queue }) } },
    log: message => logs.push(message),
    openAppNotice: async message => notices.push(message),
    getGoogleToken: async () => { authRequests++; }
  };
  vm.runInNewContext(spreadsheetIdSource + '\n' + source.slice(source.indexOf("$('#retryFailedRows').onclick")), retryContext);
  await elements['#retryFailedRows'].onclick();
  assert.equal(authRequests, 0);
  assert.match(logs[0], /切换回上次转交/);
  assert.equal(elements['#retryFailedRows'].disabled, false);
  delete queue.spreadsheetId;
  delete queue.targetTab;
  await elements['#retryFailedRows'].onclick();
  assert.equal(authRequests, 0);
  assert.match(notices[0], /人工核对并处理这些行：5/);
  assert.deepEqual(queue, { rows: [5] });
}

async function checkRequests() {
  context.GOOGLE_CLIENT_ID = 'public-client-id';
  context.GOOGLE_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
  let cached;
  context.extensionStorage = { session: { set: async value => { cached = value; } } };
  context.extensionApi = { identity: {
    getRedirectURL: () => redirect,
    launchWebAuthFlow: async ({ url }) => {
      const auth = new URL(url);
      const requestedState = auth.searchParams.get('state');
      assert.ok(requestedState && requestedState.length >= 32);
      return response({ state: requestedState, expires_in: '60' });
    }
  } };
  const started = Date.now();
  await getWebGoogleToken();
  assert.ok(cached.webTokenExpiresAt <= Date.now()); // Never extend a short-lived token by the old 300-second minimum.
  assert.ok(cached.webTokenExpiresAt >= started);
  let bodyReads = 0;
  context.fetch = async () => ({ ok: false, status: 401, text: async () => { bodyReads++; return canary; } });
  await assert.rejects(() => sheetsRequest('token', 'https://sheets.googleapis.com/local'), error => error.status === 401 && !error.message.includes(canary));
  await assert.rejects(() => callGemini('key', 'gemini-local', 'system', 'report'), error => !error.message.includes(canary));
  assert.equal(bodyReads, 1); // Only Sheets reads the body to identify the known API-disabled condition.
}

// Exercise the real service worker's sender and command boundary.
let onMessage;
const opened = [];
const backgroundContext = { URL, chrome: {
  runtime: { id: 'our-extension', getURL: name => 'chrome-extension://our-extension/' + name, onInstalled: { addListener() {} }, onStartup: { addListener() {} }, onMessage: { addListener(fn) { onMessage = fn; } } },
  action: { onClicked: { addListener() {} } }, alarms: { onAlarm: { addListener() {} } },
  tabs: { query: async () => [], create: async value => opened.push(value.url) },
  storage: { local: {
    values: {}, setAccessLevel: async options => { backgroundContext.storageLevel = options.accessLevel; },
    set: async value => Object.assign(backgroundContext.chrome.storage.local.values, value),
    get: async key => ({ [key]: backgroundContext.chrome.storage.local.values[key] }),
    remove: async key => { delete backgroundContext.chrome.storage.local.values[key]; }
  } }
} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'background.js'), 'utf8'), backgroundContext);
const sender = { id: 'our-extension', frameId: 0, url: 'https://docs.google.com/spreadsheets/d/local/edit' };
for (const [message, origin] of [
  [{ type: 'OPEN_DASHBOARD', query: '?flow=transfer' }, { ...sender, id: 'other-extension' }],
  [{ type: 'OPEN_DASHBOARD', query: '?flow=transfer' }, { ...sender, frameId: 1 }],
  [{ type: 'OPEN_DASHBOARD', query: '?flow=transfer' }, { ...sender, url: 'https://attacker.example/spreadsheets/' }],
  [{ type: 'OPEN_DASHBOARD', query: '?phone=12345678' }, sender],
  [{ type: 'OPEN_DASHBOARD', query: '?flow=transfer&phone=12345678' }, sender],
  [{ type: 'OPEN_DASHBOARD', query: '?record=12345678' }, sender]
]) onMessage(message, origin, () => assert.fail('Untrusted message accepted'));
assert.equal(opened.length, 0);
onMessage({ type: 'OPEN_DASHBOARD', query: '?flow=transfer' }, sender, response => assert.equal(response.ok, true));

async function checkStorageBridge() {
  await Promise.resolve();
  assert.equal(backgroundContext.storageLevel, 'TRUSTED_CONTEXTS');
  const reply = message => new Promise(resolve => {
    assert.equal(onMessage(message, sender, resolve), true);
  });
  assert.equal((await reply({ type: 'TRANSFER_SOURCE_SET', text: 'private row' })).ok, true);
  assert.equal(backgroundContext.chrome.storage.local.values.formTransferSource.text, 'private row');
  assert.equal((await reply({ type: 'TRANSFER_SOURCE_SET', text: 'x'.repeat(1024 * 1024 + 1) })).ok, false);
  const validPending = { text: 'private row', createdAt: Date.now(), targetUrl: sender.url, targetTab: 'Target' };
  backgroundContext.chrome.storage.local.values.formTransferPending = validPending;
  const received = await reply({ type: 'TRANSFER_PENDING_GET' });
  assert.equal(received.ok, true);
  assert.equal(received.pending.text, validPending.text);
  backgroundContext.chrome.storage.local.values.formTransferPending = { ...validPending, targetUrl: 'https://docs.google.com/spreadsheets/d/attacker/edit' };
  const rejected = await reply({ type: 'TRANSFER_PENDING_GET' });
  assert.equal(rejected.ok, true);
  assert.equal(rejected.pending, null);
  assert.equal((await reply({ type: 'TRANSFER_PENDING_REMOVE', createdAt: validPending.createdAt })).ok, true);
  assert.equal(Object.hasOwn(backgroundContext.chrome.storage.local.values, 'formTransferPending'), true);
  backgroundContext.chrome.storage.local.values.formTransferPending = validPending;
  assert.equal((await reply({ type: 'TRANSFER_PENDING_REMOVE', createdAt: validPending.createdAt - 1 })).ok, true);
  assert.equal(Object.hasOwn(backgroundContext.chrome.storage.local.values, 'formTransferPending'), true);
  assert.equal((await reply({ type: 'TRANSFER_PENDING_REMOVE', createdAt: validPending.createdAt })).ok, true);
  assert.equal(Object.hasOwn(backgroundContext.chrome.storage.local.values, 'formTransferPending'), false);
  assert.equal(onMessage({ type: 'TRANSFER_PENDING_GET' }, { ...sender, url: 'https://docs.google.com/spreadsheets.evil/d/local' }, () => assert.fail('Untrusted storage bridge sender accepted')), undefined);
}

// Verify the content script's real click handlers and old pending-transfer boundary.
const content = fs.readFileSync(path.join(__dirname, '..', 'content.js'), 'utf8');
const clipboardReader = content.slice(content.indexOf('const readSelection ='), content.indexOf('const transfer ='));
assert.match(clipboardReader, /createElement\('template'\)/);
assert.match(clipboardReader, /template\.content\.querySelectorAll\('tr'\)/);
assert.doesNotMatch(clipboardReader, /DOMParser|append\(template|append\(copy/);
const clipboardCellText = content.slice(content.indexOf('const cellText ='), content.indexOf('const rows ='));
assert.match(clipboardCellText, /cloneNode\(true\)/);
assert.doesNotMatch(clipboardCellText, /innerHTML/);
const clicked = [];
const contentContext = { URL, marker: 'data-form-transfer-item', MENU_LABEL: 'transfer',
  transfer: () => clicked.push('transfer'),
  document: { createElement: () => ({ style: {}, attributes: {}, listeners: {},
    setAttribute(name, value) { this.attributes[name] = value; },
    addEventListener(name, callback) { this.listeners[name] = callback; }
  }) }
};
const menu = { nodes: [], querySelector(selector) { return this.nodes.find(node => Object.hasOwn(node.attributes, selector.slice(1, -1))); }, prepend(node) { this.nodes.unshift(node); } };
vm.runInNewContext(content.slice(content.indexOf('  const pendingTargetMatches'), content.indexOf('  const finishPendingTransfer'))
  + '\n' + content.slice(content.indexOf('  const addMenuItem'), content.indexOf('  let lastContextMenuPoint'))
  + '\nglobalThis.contentChecks = { pendingTargetMatches, addMenuItem };', contentContext);
const { pendingTargetMatches, addMenuItem } = contentContext.contentChecks;
const target = 'https://docs.google.com/spreadsheets/d/local';
assert.equal(pendingTargetMatches(target + '/edit#gid=123', target), true);
assert.equal(pendingTargetMatches(target + '/edit#gid=123', target + '/edit#gid=12'), false);
assert.equal(pendingTargetMatches(target + '/edit?gid=123', target + '/edit?gid=123'), true);
for (const url of [target + '-other/edit', 'https://attacker.example/spreadsheets/d/local/edit', target.replace('/d/', '/d/other/')]) {
  assert.equal(pendingTargetMatches(url, target), false);
}
assert.equal(pendingTargetMatches(target, 'not a URL'), false);
addMenuItem(menu);
for (const item of menu.nodes) item.listeners.click({ isTrusted: false, stopPropagation() {} });
assert.deepEqual(clicked, []);
for (const item of menu.nodes) item.listeners.click({ isTrusted: true, stopPropagation() {} });
assert.deepEqual(clicked, ['transfer']);

Promise.all([checkRequests(), checkStorageBridge(), checkRetryTarget()]).then(() => {
  assert.deepEqual(opened, ['chrome-extension://our-extension/dashboard.html?flow=transfer']);
  console.log('OAuth, secret export/import, error privacy, message and clipboard boundary checks passed.');
}).catch(error => { console.error(error); process.exitCode = 1; });
