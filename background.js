const dashboardUrl = () => chrome.runtime.getURL('dashboard.html');

// 复用已有控制台标签页。
const openDashboard = async (query = '') => {
  const target = `${dashboardUrl()}${query}`;
  const tabs = await chrome.tabs.query({ url: `${dashboardUrl()}*` }).catch(() => []);
  if (tabs.length) {
    const tab = tabs[0];
    await chrome.tabs.update(tab.id, query ? { url: target, active: true } : { active: true });
    if (tab.windowId) await chrome.windows.update(tab.windowId, { focused: true }).catch(() => {});
    return;
  }
  await chrome.tabs.create({ url: target });
};

chrome.action.onClicked.addListener(() => openDashboard());

const nextNoon = () => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  if (date.getTime() <= Date.now()) date.setDate(date.getDate() + 1);
  return date.getTime();
};
const scheduleRegionSync = () => chrome.alarms.create('region-config-noon', { when: nextNoon() });
const spreadsheetId = pathname => pathname.match(/^\/spreadsheets\/(?:u\/\d+\/)?d\/([a-zA-Z0-9_-]+)(?:\/|$)/)?.[1];
const storageBoundaryReady = typeof chrome.storage.local.setAccessLevel === 'function'
  ? chrome.storage.local.setAccessLevel({ accessLevel: 'TRUSTED_CONTEXTS' }).then(() => true, () => false)
  : Promise.resolve(false);
const MAX_TRANSFER_LENGTH = 1024 * 1024;
const transferPendingIsValid = (pending, senderUrl) => {
  if (!pending || typeof pending !== 'object' || typeof pending.text !== 'string'
    || pending.text.length > MAX_TRANSFER_LENGTH || !Number.isFinite(pending.createdAt)) return false;
  const age = Date.now() - pending.createdAt;
  if (age < 0 || age > 10 * 60 * 1000) return false;
  if (pending.targetTab !== undefined && (typeof pending.targetTab !== 'string' || pending.targetTab.length > 100)) return false;
  try {
    const targetUrl = new URL(pending.targetUrl);
    return targetUrl.origin === senderUrl.origin && spreadsheetId(targetUrl.pathname) === spreadsheetId(senderUrl.pathname)
      && (!targetUrl.search || targetUrl.search === senderUrl.search)
      && (!targetUrl.hash || targetUrl.hash === senderUrl.hash);
  } catch { return false; }
};

const rowsHash = rows => {
  const text = JSON.stringify(rows || []);
  let hash = 0;
  for (let index = 0; index < text.length; index++) hash = (hash * 31 + text.charCodeAt(index)) | 0;
  return `${text.length}:${hash}`;
};

async function syncRegionConfigAtNoon() {
  const { targetUrl, regionTab, transferGroup } = await chrome.storage.local.get({ targetUrl: '', regionTab: '', transferGroup: 'group1' });
  if (['group3', 'group4', 'group5'].includes(transferGroup)) return;
  let parsedUrl;
  try { parsedUrl = new URL(targetUrl); } catch { return; }
  if (parsedUrl.origin !== 'https://docs.google.com' || parsedUrl.username || parsedUrl.password) return;
  const id = spreadsheetId(parsedUrl.pathname);
  if (!id || !regionTab) return;
  let token = '';
  try {
    token = await chrome.identity.getAuthToken({ interactive: false });
    token = typeof token === 'string' ? token : token?.token || '';
  } catch {
    // Non-interactive auth fails when nobody is signed in; wait for the next check.
    return;
  }
  if (!token) return;
  const sheet = `'${regionTab.replaceAll("'", "''")}'`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${encodeURIComponent(`${sheet}!A:C`)}?majorDimension=ROWS&valueRenderOption=UNFORMATTED_VALUE`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) return;
  const rows = (await response.json()).values || [];
  const { regionConfigCache } = await chrome.storage.local.get({ regionConfigCache: null });
  const cacheScope = `${id}|${regionTab}`;
  const scopedCache = regionConfigCache?.scope === cacheScope ? regionConfigCache : null;
  // Compare content, not row count, so edited/deleted config rows propagate.
  // An empty read never wipes a working cache.
  if (scopedCache?.rows?.length && !rows.length) {
    await chrome.storage.local.set({ regionConfigLastCheckedAt: Date.now(), regionConfigLastCheckRows: 0 });
    return;
  }
  if (!scopedCache || rowsHash(rows) !== scopedCache.contentHash) {
    await chrome.storage.local.set({ regionConfigCache: { scope: cacheScope, rows, rowCount: rows.length, syncedAt: Date.now(), contentHash: rowsHash(rows) } });
  }
  await chrome.storage.local.set({ regionConfigLastCheckedAt: Date.now(), regionConfigLastCheckRows: rows.length });
}

chrome.runtime.onInstalled.addListener(scheduleRegionSync);
chrome.runtime.onStartup.addListener(scheduleRegionSync);
chrome.alarms.onAlarm.addListener(async alarm => {
  if (alarm.name !== 'region-config-noon') return;
  try { await syncRegionConfigAtNoon(); }
  catch { /* A failed noon check simply waits for the next one. */ }
  finally { scheduleRegionSync(); }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (sender.id !== chrome.runtime.id) return;
  let senderUrl;
  try { senderUrl = new URL(sender.url); } catch { return; }
  if (sender.frameId !== 0 || senderUrl.origin !== 'https://docs.google.com' || !spreadsheetId(senderUrl.pathname)) return;

  if (message?.type === 'INTERFACE_LANGUAGE_GET') {
    chrome.storage.local.get({ interfaceLanguage: 'zh' })
      .then(({ interfaceLanguage }) => sendResponse({ interfaceLanguage }), () => sendResponse({ interfaceLanguage: 'zh' }));
    return true;
  }

  if (['TRANSFER_SOURCE_SET', 'TRANSFER_PENDING_GET', 'TRANSFER_PENDING_REMOVE'].includes(message?.type)) {
    void (async () => {
      if (!await storageBoundaryReady) throw new Error('Storage access boundary unavailable');
      if (message.type === 'TRANSFER_SOURCE_SET') {
        if (typeof message.text !== 'string' || !message.text.trim() || message.text.length > MAX_TRANSFER_LENGTH) throw new Error('Invalid transfer payload');
        await chrome.storage.local.set({ formTransferSource: { text: message.text, createdAt: Date.now() } });
        sendResponse({ ok: true });
      } else {
        const { formTransferPending } = await chrome.storage.local.get('formTransferPending');
        const pending = transferPendingIsValid(formTransferPending, senderUrl) ? formTransferPending : null;
        if (message.type === 'TRANSFER_PENDING_GET') {
          sendResponse({ ok: true, pending });
        } else {
          if (pending && message.createdAt === pending.createdAt) await chrome.storage.local.remove('formTransferPending');
          sendResponse({ ok: true });
        }
      }
    })().catch(() => sendResponse({ ok: false }));
    return true;
  }

  if (message?.type !== 'OPEN_DASHBOARD' || message.query !== '?flow=transfer') return;

  void openDashboard(message.query);
  sendResponse({ ok: true });
});

const browserLocales = { zh: 'zh_CN', en: 'en', pt: 'pt_BR', sw: 'sw', fr: 'fr' };
let toolbarUpdate = 0;
async function updateToolbarLanguage() {
  const update = ++toolbarUpdate;
  const { interfaceLanguage } = await chrome.storage.local.get('interfaceLanguage');
  let title = chrome.i18n.getMessage('openConsole');
  if (Object.hasOwn(browserLocales, interfaceLanguage)) {
    const locale = browserLocales[interfaceLanguage];
    const response = await fetch(chrome.runtime.getURL(`_locales/${locale}/messages.json`));
    title = (await response.json()).openConsole.message;
  }
  if (update === toolbarUpdate) await chrome.action.setTitle({ title });
}
if (chrome.action.setTitle) {
  const refreshToolbar = () => { void updateToolbarLanguage().catch(console.error); };
  chrome.runtime.onInstalled.addListener(refreshToolbar);
  chrome.runtime.onStartup.addListener(refreshToolbar);
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.interfaceLanguage) refreshToolbar();
  });
}
