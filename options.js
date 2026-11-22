const { t, setup } = interfaceLocale;
void setup();
const url = document.querySelector('#targetUrl');
const tab = document.querySelector('#targetTab');
const headerRows = document.querySelector('#targetHeaderRows');
const status = document.querySelector('#status');

chrome.storage.local.get({ targetUrl: '', targetTab: '', targetHeaderRows: '2' }).then(async values => {
  if (!values.targetUrl && !values.targetTab) {
    const legacy = await chrome.storage.sync.get({ targetUrl: '', targetTab: '' });
    values = { ...values, ...legacy };
  }
  url.value = values.targetUrl;
  tab.value = values.targetTab;
  headerRows.value = values.targetHeaderRows || '2';
});

document.querySelector('#save').addEventListener('click', async () => {
  let validSheetUrl = false;
  try {
    const parsed = new URL(url.value.trim());
    validSheetUrl = parsed.origin === 'https://docs.google.com' && !parsed.username && !parsed.password
      && /^\/spreadsheets\/(?:u\/\d+\/)?d\/[a-zA-Z0-9_-]+(?:\/|$)/.test(parsed.pathname);
  } catch {}
  if (!validSheetUrl) {
    status.textContent = t('请输入有效的 Google 表格网址');
    status.style.color = '#c5221f';
    return;
  }
  if (!headerRows.validity.valid) {
    status.textContent = t('请填写有效的目标表头行数（非负整数），或留空使用默认值 2。');
    status.style.color = '#c5221f';
    headerRows.focus();
    return;
  }
  const targetHeaderRows = headerRows.value === '' ? '2' : String(headerRows.valueAsNumber);
  await chrome.storage.local.set({ targetUrl: url.value.trim(), targetTab: tab.value.trim(), targetHeaderRows });
  status.textContent = t('已保存');
  status.style.color = '#188038';
});
