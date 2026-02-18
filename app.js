const deploymentMeta = {
  name: "Thesis Field Deployment - Greenhouse Block A",
  startDate: "2026-01-05 08:00",
  gatewayId: "GW-RPI4-THESIS-001",
  runtime: "14 days, 7 hours"
};

const nodeStatus = [
  { id: "Node 1 – Sensor A", value: "29.1°C / 68% RH", ts: "2026-01-19 14:27:42", status: "verified" },
  { id: "Node 2 – Sensor B", value: "30.0°C / 65% RH", ts: "2026-01-19 14:27:34", status: "flagged" },
  { id: "Node 3 – Sensor C", value: "28.6°C / 70% RH", ts: "2026-01-19 14:26:58", status: "failed" }
];

const packets = [
  ["Node 1", "29.1°C / 68%", "14:27:42", "1041", "Pass", "Pass", "Pass", "Verified"],
  ["Node 2", "30.0°C / 65%", "14:27:34", "2102", "Pass", "Fail", "Pass", "Flagged"],
  ["Node 3", "28.6°C / 70%", "14:26:58", "876", "Pass", "Fail", "Fail", "Rejected"],
  ["Node 1", "29.0°C / 67%", "14:26:40", "1040", "Pass", "Pass", "Pass", "Verified"],
  ["Node 2", "29.9°C / 66%", "14:26:16", "2101", "Pass", "Pass", "Pass", "Verified"]
];

const evidence = [
  { node: "Node 1 – Sensor A", total: 1580, verified: 1533, flagged: 39, rejected: 8, challenge: "420/430 (97.7%)", gaps: "3 gaps (Jan 18 09:12, Jan 18 17:43, Jan 19 07:02)" },
  { node: "Node 2 – Sensor B", total: 1622, verified: 1498, flagged: 103, rejected: 21, challenge: "401/445 (90.1%)", gaps: "7 gaps (latest: Jan 19 11:16)" },
  { node: "Node 3 – Sensor C", total: 1559, verified: 1402, flagged: 96, rejected: 61, challenge: "365/436 (83.7%)", gaps: "9 gaps (latest: Jan 19 13:41)" }
];

const auditEvents = [
  "2026-01-19 11:16:03 — DATA_LOSS_EVENT: Node 2 sequence jump 2090 → 2094",
  "2026-01-19 13:41:55 — CHALLENGE_FAIL: Node 3 failed Layer 2 nonce response",
  "2026-01-19 14:02:11 — PLAUSIBILITY_FLAG: Node 2 humidity delta exceeded threshold"
];

const anchors = [
  [42, "2026-01-19 10:30:00", 350, "91f9d09e...77c3", "5Yf2nQDf4x4Ww7xk1sS4Fj8e3n2tQ9rLpM8uBhD2kQF"],
  [43, "2026-01-19 12:00:00", 400, "3a0c4df2...a1d8", "6M7bczgq8bU8uD1LpcC6svtwN4jrM8aBkp4N2HhE76p"],
  [44, "2026-01-19 13:30:00", 420, "772a9f10...4f2e", "2J9tQbX6xN7s4mDYxo1F6ScV5vUpY3ePqv5Qh1w2wFj"],
];

function setMetaHeader() {
  document.getElementById("meta-name").textContent = deploymentMeta.name;
  document.getElementById("meta-start").textContent = deploymentMeta.startDate;
  document.getElementById("meta-gateway").textContent = deploymentMeta.gatewayId;
  document.getElementById("meta-runtime").textContent = deploymentMeta.runtime;
}

function renderDashboard() {
  const nodeContainer = document.getElementById("node-cards");
  if (!nodeContainer) return;

  const deploymentStatus = document.getElementById("deployment-status");
  deploymentStatus.innerHTML = `<span class="badge active">Deployment Active</span>`;

  nodeStatus.forEach((node) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${node.id}</h3>
      <p><strong>Last reading:</strong> ${node.value}</p>
      <p><strong>Last timestamp:</strong> ${node.ts}</p>
      <p><strong>Verification:</strong> <span class="badge ${node.status}">${node.status === "verified" ? "✅ Verified" : node.status === "flagged" ? "⚠️ Flagged" : "❌ Failed"}</span></p>
    `;
    nodeContainer.appendChild(card);
  });
}

function renderPackets() {
  const packetBody = document.getElementById("packet-body");
  if (!packetBody) return;

  packets.forEach((packet) => {
    const tr = document.createElement("tr");
    const classification = packet[7].toLowerCase();
    tr.className = classification === "verified" ? "verified" : classification === "flagged" ? "flagged" : "rejected";

    packet.forEach((col) => {
      const td = document.createElement("td");
      td.textContent = col;
      tr.appendChild(td);
    });
    packetBody.appendChild(tr);
  });
}

function renderEvidence() {
  const summaryBody = document.getElementById("summary-body");
  if (!summaryBody) return;

  evidence.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.node}</td>
      <td>${row.total}</td>
      <td>${row.verified}</td>
      <td>${row.flagged}</td>
      <td>${row.rejected}</td>
      <td>${row.challenge}</td>
      <td>${row.gaps}</td>
    `;
    summaryBody.appendChild(tr);
  });

  const auditList = document.getElementById("audit-list");
  auditEvents.forEach((event) => {
    const li = document.createElement("li");
    li.textContent = event;
    auditList.appendChild(li);
  });
}

function renderAnchors() {
  const anchorBody = document.getElementById("anchor-body");
  if (!anchorBody) return;

  anchors.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row[0]}</td>
      <td>${row[1]}</td>
      <td>${row[2]}</td>
      <td><span class="copyable">${row[3]}</span></td>
      <td><a href="https://explorer.solana.com/tx/${row[4]}" target="_blank" rel="noreferrer">${row[4]}</a></td>
    `;
    anchorBody.appendChild(tr);
  });
}

function setRefreshTime() {
  const targets = document.querySelectorAll(".refresh-time");
  const now = new Date().toLocaleString();
  targets.forEach((el) => { el.textContent = now; });
}

function wireRefreshButton() {
  const btn = document.getElementById("refresh-btn");
  if (btn) {
    btn.addEventListener("click", () => window.location.reload());
  }
}

setMetaHeader();
setRefreshTime();
wireRefreshButton();
renderDashboard();
renderPackets();
renderEvidence();
renderAnchors();
