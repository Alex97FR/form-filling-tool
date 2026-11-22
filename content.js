(() => {
  const { t, setLanguage } = interfaceLocale;
  const refreshLanguage = () => chrome.runtime.sendMessage({ type: 'INTERFACE_LANGUAGE_GET' })
    .then(response => setLanguage(response?.interfaceLanguage), () => {});
  const languageReady = refreshLanguage();
  const MENU_LABEL = '转交表格';
  const marker = 'data-form-transfer-item';
  const requestBackground = async message => {
    const result = await chrome.runtime.sendMessage(message);
    if (!result?.ok) throw new Error('扩展安全边界不可用，请重新加载扩展后重试。');
    return result;
  };
  const removePendingTransfer = pending => requestBackground({ type: 'TRANSFER_PENDING_REMOVE', createdAt: pending.createdAt });

  const notify = (message, error = false) => {
    const node = document.createElement('div');
    node.textContent = t(message);
    Object.assign(node.style, {
      position: 'fixed', zIndex: 2147483647, top: '20px', left: '50%',
      transform: 'translateX(-50%)', padding: '12px 18px', borderRadius: '6px',
      color: '#fff', background: error ? '#c5221f' : '#188038',
      font: '14px Arial', boxShadow: '0 2px 8px #0005'
    });
    document.body.append(node);
    setTimeout(() => node.remove(), 3500);
  };

  const readSelection = async () => {
    // Sheets often puts a richer HTML table on the clipboard than in plain
    // text when complete rows are copied. Prefer that table so blank columns
    // and the B:BL positions are preserved.
    let text = '';
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        if (item.types.includes('text/html')) {
          const html = await (await item.getType('text/html')).text();
          // Template contents stay inert while we extract cell text.
          const template = document.createElement('template');
          template.innerHTML = html;
          const cellText = cell => {
            const copy = cell.cloneNode(true);
            copy.querySelectorAll('script,style').forEach(node => node.remove());
            copy.querySelectorAll('br').forEach(node => node.replaceWith('\n'));
            copy.querySelectorAll('div,p,li').forEach(node => node.append('\n'));
            return (copy.textContent || '').replace(/\r\n/g, '\n').replace(/\t/g, ' ').replace(/\n/g, '\uE000').trim();
          };
          const rows = [...template.content.querySelectorAll('tr')].map(row => [...row.querySelectorAll('th,td')]
            .map(cellText).join('\t'));
          if (rows.length && rows.some(row => row.includes('\t'))) text = rows.join('\n');
        }
        if (!text && item.types.includes('text/plain')) text = await (await item.getType('text/plain')).text();
      }
    } catch {
      text = await navigator.clipboard.readText();
    }
    if (!text.trim()) throw new Error('没有读到选区内容，请先选择 B 列到 BL 列的行。');
    return text;
  };

  const transfer = async () => {
    try {
      const text = await readSelection();
      await requestBackground({ type: 'TRANSFER_SOURCE_SET', text });
      await requestBackground({ type: 'OPEN_DASHBOARD', query: '?flow=transfer' });
      notify('已把选区交给自动化控制台。');
    } catch (error) {
      notify(error.message || '转交失败。', true);
    }
  };

  const pendingTargetMatches = (currentUrl, targetUrl) => {
    try {
      const current = new URL(currentUrl);
      const target = new URL(targetUrl);
      const sheetId = url => url.pathname.match(/^\/spreadsheets\/(?:u\/\d+\/)?d\/([a-zA-Z0-9_-]+)(?:\/|$)/)?.[1];
      return current.origin === 'https://docs.google.com' && target.origin === current.origin
        && Boolean(sheetId(target)) && sheetId(current) === sheetId(target)
        && (!target.search || current.search === target.search) && (!target.hash || current.hash === target.hash);
    } catch { return false; }
  };
  const finishPendingTransfer = async pending => {
    const age = Date.now() - pending.createdAt;
    if (!Number.isFinite(age) || age < 0 || age > 10 * 60 * 1000 || typeof pending.text !== 'string') {
      return;
    }
    if (!pendingTargetMatches(location.href, pending.targetUrl)) return;
    if (pending.targetTab) {
      // Retry the scan briefly: right after page load the sheet tab bar may
      // not be rendered yet. If the tab really is missing, STOP — pasting
      // into whatever sheet happens to be open would corrupt the wrong table.
      let tab = null;
      for (let attempt = 0; attempt < 10 && !tab; attempt++) {
        tab = [...document.querySelectorAll('[role="tab"]')]
          .find(node => node.textContent.trim() === pending.targetTab);
        if (!tab) await new Promise(resolve => setTimeout(resolve, 300));
      }
      if (!tab) {
        notify(`没有找到目标分表“${pending.targetTab}”，已停止自动粘贴，避免贴错表。`, true);
        await removePendingTransfer(pending);
        return;
      }
      tab.click();
    }
    await new Promise(resolve => setTimeout(resolve, 1800));
    await navigator.clipboard.writeText(pending.text);
    const panel = document.createElement('div');
    await refreshLanguage();
    const heading = document.createElement('b');
    heading.textContent = t('转交数据已准备好');
    const instruction = document.createElement('span');
    instruction.textContent = t('请在目标表点击首个空行，然后按 Ctrl+V 粘贴。');
    panel.append(heading, document.createElement('br'), instruction);
    const copy = document.createElement('button');
    copy.textContent = t('重新复制数据');
    const done = document.createElement('button');
    done.textContent = t('完成');
    [copy, done].forEach(button => Object.assign(button.style, {
      margin: '10px 8px 0 0', padding: '6px 10px', cursor: 'pointer'
    }));
    copy.onclick = async event => {
      if (!event.isTrusted) return;
      await navigator.clipboard.writeText(pending.text);
      notify('数据已复制，请点击目标首个空行后按 Ctrl+V。');
    };
    done.onclick = async event => {
      if (!event.isTrusted) return;
      await removePendingTransfer(pending);
      panel.remove();
    };
    panel.append(copy, done);
    Object.assign(panel.style, {
      position: 'fixed', zIndex: 2147483647, top: '16px', left: '50%',
      transform: 'translateX(-50%)', width: '360px', padding: '14px 16px',
      borderRadius: '8px', color: '#202124', background: '#fff',
      font: '14px Arial', lineHeight: '1.55', boxShadow: '0 2px 12px #0005'
    });
    document.body.append(panel);
  };

  languageReady.then(() => requestBackground({ type: 'TRANSFER_PENDING_GET' })).then(({ pending }) => {
    const formTransferPending = pending;
    if (formTransferPending) finishPendingTransfer(formTransferPending).catch(error => {
      notify(error.message || '目标表粘贴失败，请手动选择首个空行后按 Ctrl+V。', true);
    });
  }).catch(error => {
    notify(error.message || '无法安全读取待转交内容。', true);
  });

  const addMenuItem = menu => {
    const existing = menu.querySelector(`[${marker}]`);
    if (existing) {
      if (menu.firstElementChild !== existing) menu.prepend(existing);
    } else {
      const item = document.createElement('div');
      item.setAttribute('role', 'menuitem');
      item.setAttribute(marker, 'true');
      item.textContent = globalThis.interfaceLocale?.t(MENU_LABEL) ?? MENU_LABEL;
      Object.assign(item.style, {
        cursor: 'pointer', padding: '8px 16px', color: '#202124',
        font: '14px Arial', borderBottom: '1px solid #dadce0'
      });
      item.addEventListener('mouseenter', () => item.style.background = '#f1f3f4');
      item.addEventListener('mouseleave', () => item.style.background = '');
      item.addEventListener('click', event => { if (!event.isTrusted) return; event.stopPropagation(); transfer(); });
      menu.prepend(item);
    }
  };

  let lastContextMenuPoint = null;
  let contextMenuPointTimer = 0;

  const isContextMenu = menu => {
    if (!lastContextMenuPoint || menu.offsetParent === null) return false;
    const rect = menu.getBoundingClientRect();
    const tolerance = 24;
    return lastContextMenuPoint.x >= rect.left - tolerance
      && lastContextMenuPoint.x <= rect.right + tolerance
      && lastContextMenuPoint.y >= rect.top - tolerance
      && lastContextMenuPoint.y <= rect.bottom + tolerance;
  };

  const scanMenus = () => {
    if (!lastContextMenuPoint) return;
    const menus = [...document.querySelectorAll('[role="menu"]')].filter(isContextMenu);
    const menu = menus[menus.length - 1];
    if (menu) {
      addMenuItem(menu);
      const item = menu.querySelector(`[${marker}]`);
      const label = t(MENU_LABEL);
      if (item && item.textContent !== label) item.textContent = label;
    }
  };

  // Sheets mutates the whole document constantly; rescanning on every
  // mutation burns CPU. Coalesce to at most one scan per 200 ms (the
  // contextmenu/mousedown handlers below still trigger immediate scans).
  let scanPending = false;
  const scheduleScan = () => {
    if (scanPending) return;
    scanPending = true;
    setTimeout(() => { scanPending = false; scanMenus(); }, 200);
  };
  new MutationObserver(scheduleScan).observe(document.documentElement, { childList: true, subtree: true });
  const scanAfterContextMenu = () => {
    let attempts = 0;
    const poll = () => {
      scanMenus();
      if (++attempts < 8) setTimeout(poll, 25);
    };
    setTimeout(poll, 0);
  };
  const rememberContextMenuPoint = event => {
    if (!event.isTrusted) return;
    lastContextMenuPoint = { x: event.clientX, y: event.clientY };
    clearTimeout(contextMenuPointTimer);
    contextMenuPointTimer = setTimeout(() => { lastContextMenuPoint = null; }, 1500);
    void refreshLanguage().then(scanMenus);
    scanAfterContextMenu();
  };
  document.addEventListener('contextmenu', rememberContextMenuPoint, true);
  document.addEventListener('mousedown', event => {
    if (event.button === 2) rememberContextMenuPoint(event);
  }, true);
})();
