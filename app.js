const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.forEach((l) => l.classList.remove('active'));
    pages.forEach((p) => p.classList.remove('active'));
    link.classList.add('active');
    document.getElementById(`page-${link.dataset.page}`).classList.add('active');
  });
});

let pendingAction = null;
const confirmModal = document.getElementById('confirmModal');
const confirmText = document.getElementById('confirmText');
const receipt = document.getElementById('receipt');

document.querySelectorAll('.operator-action').forEach((btn) => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    const node = btn.dataset.node || 'node-from-form';
    pendingAction = { action, node };
    confirmText.textContent = `Confirm action: ${action} for ${node}?`;
    confirmModal.classList.remove('hidden');
  });
});

document.getElementById('cancelAction').addEventListener('click', () => {
  confirmModal.classList.add('hidden');
  pendingAction = null;
});

document.getElementById('confirmAction').addEventListener('click', () => {
  if (!pendingAction) return;
  confirmModal.classList.add('hidden');
  const timestamp = new Date().toISOString();
  const receiptId = `rct-${Math.floor(Math.random() * 9000 + 1000)}`;
  receipt.innerHTML = `<strong>Action Receipt</strong><br/>timestamp: ${timestamp}<br/>node_id: ${pendingAction.node}<br/>action_type: ${pendingAction.action}<br/>receipt_id: ${receiptId}`;
  receipt.classList.remove('hidden');
  setTimeout(() => receipt.classList.add('hidden'), 5000);
  pendingAction = null;
});
