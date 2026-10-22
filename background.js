const dashboardUrl = () => chrome.runtime.getURL('dashboard.html');

// 已有控制台标签页就复用它（带上新参数导航并置前），没有才新建——
// 反复深度查询不会堆积一堆控制台标签。
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
const spreadsheetId = url => url.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/)?.[1];
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
  const { targetUrl } = await chrome.storage.local.get({ targetUrl: '' });
  const { regionTab = '' } = await chrome.storage.local.get({ regionTab: '' });
  const id = spreadsheetId(targetUrl);
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
  if (senderUrl.origin !== 'https://docs.google.com' || !/^\/spreadsheets\/d\/[a-zA-Z0-9_-]+(?:\/|$)/.test(senderUrl.pathname)) return;

  if (['TRANSFER_SOURCE_SET', 'TRANSFER_PENDING_GET', 'TRANSFER_PENDING_REMOVE'].includes(message?.type)) {
    void (async () => {
      if (!await storageBoundaryReady) throw new Error('Storage access boundary unavailable');
      if (message.type === 'TRANSFER_SOURCE_SET') {
        if (typeof message.text !== 'string' || !message.text.trim() || message.text.length > MAX_TRANSFER_LENGTH) throw new Error('Invalid transfer payload');
        await chrome.storage.local.set({ formTransferSource: { text: message.text, createdAt: Date.now() } });
        sendResponse({ ok: true });
      } else if (message.type === 'TRANSFER_PENDING_GET') {
        const { formTransferPending } = await chrome.storage.local.get('formTransferPending');
        if (!transferPendingIsValid(formTransferPending, senderUrl)) {
          if (formTransferPending) await chrome.storage.local.remove('formTransferPending');
          sendResponse({ ok: true, pending: null });
          return;
        }
        sendResponse({ ok: true, pending: formTransferPending });
      } else {
        await chrome.storage.local.remove('formTransferPending');
        sendResponse({ ok: true });
      }
    })().catch(() => sendResponse({ ok: false }));
    return true;
  }

  if (message?.type !== 'OPEN_DASHBOARD' || typeof message.query !== 'string') return;

  const params = new URLSearchParams(message.query);
  const entries = [...params.entries()];
  const allowed = message.query === '?flow=transfer'
    || (entries.length === 1 && entries[0][0] === 'phone' && /^\d{8,20}$/.test(entries[0][1]))
    || (entries.length === 1 && entries[0][0] === 'record' && entries[0][1].length > 0 && entries[0][1].length <= 256);
  if (!allowed) return;

  void openDashboard(message.query);
  sendResponse({ ok: true });
});
