const menuItems = document.querySelectorAll('.menu-item');
const pages = document.querySelectorAll('.page');

menuItems.forEach((item) => {
  item.addEventListener('click', () => {
    menuItems.forEach((x) => x.classList.remove('active'));
    pages.forEach((x) => x.classList.remove('active'));
    item.classList.add('active');
    const page = document.getElementById(`page-${item.dataset.page}`);
    if (page) page.classList.add('active');
  });
});

const confirmModal = document.getElementById('confirmModal');
const confirmText = document.getElementById('confirmText');
const receipt = document.getElementById('receipt');
let pending = null;

function getNodeId(btn) {
  if (btn.dataset.node) return btn.dataset.node;
  if (btn.dataset.nodeSource) {
    const input = document.getElementById(btn.dataset.nodeSource);
    return input?.value?.trim() || 'node-from-form';
  }
  return 'node-from-form';
}

document.querySelectorAll('.op-action').forEach((btn) => {
  btn.addEventListener('click', () => {
    pending = {
      node: getNodeId(btn),
      action: btn.dataset.action,
      timestamp: new Date().toISOString()
    };
    confirmText.textContent = `Confirm action: ${pending.action} for ${pending.node}?`;
    confirmModal.classList.remove('hidden');
  });
});

document.getElementById('cancelAction').addEventListener('click', () => {
  pending = null;
  confirmModal.classList.add('hidden');
});

document.getElementById('confirmAction').addEventListener('click', () => {
  if (!pending) return;
  const receiptId = `rct-${Math.floor(Math.random() * 9000 + 1000)}`;
  receipt.innerHTML = `<strong>Action Receipt</strong><br>timestamp: ${pending.timestamp}<br>node_id: ${pending.node}<br>action_type: ${pending.action}<br>receipt_id: ${receiptId}`;
  confirmModal.classList.add('hidden');
  receipt.classList.remove('hidden');
  setTimeout(() => receipt.classList.add('hidden'), 5000);
  pending = null;
});

document.querySelectorAll('.copy').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const original = btn.textContent;
    const value = btn.dataset.copy || 'hash-placeholder';
    try {
      await navigator.clipboard.writeText(value);
      btn.textContent = 'Copied';
    } catch {
      btn.textContent = 'Copy failed';
    }
    setTimeout(() => {
      btn.textContent = original;
    }, 1000);
  });
});
