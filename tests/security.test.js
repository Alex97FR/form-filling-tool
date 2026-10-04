const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'dashboard.js'), 'utf8');
const slice = (start, end) => source.slice(source.indexOf(start), source.indexOf(end));
const context = { URL, URLSearchParams, crypto: require('node:crypto').webcrypto };
vm.runInNewContext(slice('function parseGoogleAuthRedirect', 'async function getGoogleToken')
  + '\n' + slice('async function sheetsRequest', 'const readValues =')
  + '\n' + slice('function parseModelJson', 'const callLlm =')
  + '\n' + source.match(/^const deviceConfigKeys = .*$/m)[0]
  + '\n' + source.match(/^const reportLabelKeys = .*$/m)[0]
  + '\n' + slice('const syncConfigKeys =', "$('#exportConfig').onclick")
  + '\nglobalThis.security = { parseGoogleAuthRedirect, getWebGoogleToken, sheetsRequest, parseModelJson, callGroq, callGemini, buildConfigExport, parseConfigImport };', context);
const { parseGoogleAuthRedirect, getWebGoogleToken, sheetsRequest, parseModelJson, callGroq, callGemini, buildConfigExport, parseConfigImport } = context.security;

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

const sync = { targetUrl: 'https://docs.google.com/spreadsheets/d/local/edit', targetTab: 'Target', unexpected: 'discard' };
const local = { groqApiKey: 'fake-groq-key', groqApiKeys: ['fake-groq-key'], geminiApiKey: 'fake-gemini-key', llmProvider: 'groq', regionTab: 'Regions', unexpected: 'discard' };
const exported = buildConfigExport(sync, local);
assert.equal(exported.local.llmProvider, 'groq');
for (const key of ['groqApiKey', 'groqApiKeys', 'geminiApiKey', 'unexpected']) assert.equal(Object.hasOwn(exported.local, key), false);
assert.equal(Object.hasOwn(exported.sync, 'unexpected'), false);
assert.equal(buildConfigExport(sync, local, true).local.groqApiKey, 'fake-groq-key');
const imported = parseConfigImport({ ...exported, local: { ...exported.local, reportLabels: { brebis: '<script>plain text</script>', unexpected: 'discard' }, unexpected: 'discard' } });
assert.equal(imported.targetTab, 'Target');
assert.equal(Object.hasOwn(imported, 'groqApiKey'), false); // Importing a key-free export preserves existing device keys.
assert.equal(Object.hasOwn(imported.reportLabels, 'unexpected'), false);
for (const payload of [
  { ...exported, version: 999 }, { ...exported, sync: [] }, { ...exported, local: null },
  { ...exported, local: { groqApiKeys: 'not-an-array' } },
  { ...exported, local: { groqApiKeys: [42] } },
  { ...exported, local: { llmProvider: 'attacker' } },
  { ...exported, sync: { targetUrl: { url: 'not-a-string' } } },
  { ...exported, local: { reportLabels: { brebis: [] } } }
]) assert.throws(() => parseConfigImport(payload));
const prototypePayload = JSON.parse(JSON.stringify(exported).replace('"local":{', '"local":{"__proto__":{"polluted":true},'));
assert.equal(Object.hasOwn(parseConfigImport(prototypePayload), '__proto__'), false);

const canary = 'SENSITIVE_TEST_VALUE';
for (const raw of [canary, '{"name":"' + canary, '{"name":' + canary + '}']) {
  assert.throws(() => parseModelJson(raw, 'Test'), error => /JSON/.test(error.message) && !error.message.includes(canary));
}
assert.equal(parseModelJson('{"name":"local fixture"}', 'Test').name, 'local fixture');

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
  await assert.rejects(() => callGroq('key', 'system', 'report'), error => error.status === 401 && !error.message.includes(canary));
  await assert.rejects(() => callGemini('key', 'gemini-local', 'system', 'report'), error => !error.message.includes(canary));
  assert.equal(bodyReads, 1); // Only Sheets reads the body to identify the known API-disabled condition.
}

// Exercise the real service worker's sender and command boundary.
let onMessage;
const opened = [];
const backgroundContext = { URL, URLSearchParams, chrome: {
  runtime: { id: 'our-extension', getURL: name => 'chrome-extension://our-extension/' + name, onInstalled: { addListener() {} }, onStartup: { addListener() {} }, onMessage: { addListener(fn) { onMessage = fn; } } },
  action: { onClicked: { addListener() {} } }, alarms: { onAlarm: { addListener() {} } },
  tabs: { query: async () => [], create: async value => opened.push(value.url) }
} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'background.js'), 'utf8'), backgroundContext);
const sender = { id: 'our-extension', url: 'https://docs.google.com/spreadsheets/d/local/edit' };
for (const [message, origin] of [
  [{ type: 'OPEN_DASHBOARD', query: '?flow=transfer' }, { ...sender, id: 'other-extension' }],
  [{ type: 'OPEN_DASHBOARD', query: '?flow=transfer' }, { ...sender, url: 'https://attacker.example/spreadsheets/' }],
  [{ type: 'OPEN_DASHBOARD', query: '?phone=12345678&record=extra' }, sender],
  [{ type: 'OPEN_DASHBOARD', query: '?phone=javascript:alert(1)' }, sender],
  [{ type: 'OPEN_DASHBOARD', query: '?record=' + 'x'.repeat(257) }, sender]
]) onMessage(message, origin, () => assert.fail('Untrusted message accepted'));
assert.equal(opened.length, 0);
onMessage({ type: 'OPEN_DASHBOARD', query: '?phone=12345678' }, sender, () => {});

// Verify the content script's real click handlers and old pending-transfer boundary.
const content = fs.readFileSync(path.join(__dirname, '..', 'content.js'), 'utf8');
const clicked = [];
const contentContext = { URL, marker: 'data-form-transfer-item', MENU_LABEL: 'transfer',
  transfer: () => clicked.push('transfer'), deepQuery: () => clicked.push('deep'), realtimeRecord: () => clicked.push('realtime'),
  document: { createElement: () => ({ style: {}, attributes: {}, listeners: {},
    setAttribute(name, value) { this.attributes[name] = value; },
    addEventListener(name, callback) { this.listeners[name] = callback; },
    after(node) { menu.nodes.push(node); }
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
assert.deepEqual(clicked.sort(), ['deep', 'realtime', 'transfer']);

checkRequests().then(() => {
  assert.deepEqual(opened, ['chrome-extension://our-extension/dashboard.html?phone=12345678']);
  console.log('OAuth, secret export/import, error privacy, message and clipboard boundary checks passed.');
}).catch(error => { console.error(error); process.exitCode = 1; });
