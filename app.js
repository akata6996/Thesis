const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.forEach((l) => l.classList.remove('active'));
    pages.forEach((p) => p.classList.remove('active'));
    link.classList.add('active');
    const target = document.getElementById(`page-${link.dataset.page}`);
    if (target) target.classList.add('active');
  });
});

const confirmModal = document.getElementById('confirmModal');
const confirmText = document.getElementById('confirmText');
const receipt = document.getElementById('receipt');
let pendingAction = null;

function resolveNodeId(button) {
  if (button.dataset.node) return button.dataset.node;
  if (button.dataset.nodeSource) {
    const source = document.getElementById(button.dataset.nodeSource);
    return source?.value?.trim() || 'node-from-form';
  }
  return 'node-from-form';
}

document.querySelectorAll('.operator-action').forEach((button) => {
  button.addEventListener('click', () => {
    const node = resolveNodeId(button);
    pendingAction = {
      action: button.dataset.action,
      node,
      timestamp: new Date().toISOString()
    };
    confirmText.textContent = `Confirm action: ${pendingAction.action} for ${pendingAction.node}?`;
    confirmModal.classList.remove('hidden');
  });
});

document.getElementById('cancelAction').addEventListener('click', () => {
  confirmModal.classList.add('hidden');
  pendingAction = null;
});

document.getElementById('confirmAction').addEventListener('click', () => {
  if (!pendingAction) return;

  const receiptId = `rct-${Math.floor(Math.random() * 9000 + 1000)}`;
  receipt.innerHTML = [
    '<strong>Action Receipt</strong>',
    `timestamp: ${pendingAction.timestamp}`,
    `node_id: ${pendingAction.node}`,
    `action_type: ${pendingAction.action}`,
    `receipt_id: ${receiptId}`
  ].join('<br/>');

  confirmModal.classList.add('hidden');
  receipt.classList.remove('hidden');
  setTimeout(() => receipt.classList.add('hidden'), 5500);
  pendingAction = null;
});

document.querySelectorAll('.link-btn').forEach((button) => {
  button.addEventListener('click', async () => {
    const value = button.textContent.replace('Copy ', '').trim();
    const original = button.textContent;
    try {
      await navigator.clipboard.writeText(value);
      button.textContent = 'Copied';
      setTimeout(() => {
        button.textContent = original;
      }, 1000);
    } catch {
      button.textContent = 'Copy failed';
      setTimeout(() => {
        button.textContent = original;
      }, 1200);
    }
  });
});
