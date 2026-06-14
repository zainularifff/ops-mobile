import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import type { MobileOpsSnapshot } from "./opsMobileService";
import type { MobileReportTemplate } from "../config/mobileReports";

export type MobileReportPdfResult = {
  uri: string;
  shared: boolean;
  shareError?: string;
};

function esc(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function number(value: unknown) {
  const parsed = Number(value || 0);
  if (!Number.isFinite(parsed)) return "0";
  return new Intl.NumberFormat().format(parsed);
}

function pct(value: number) {
  return `${Math.max(0, Math.min(Math.round(value || 0), 100))}%`;
}

function onlineRate(snapshot: MobileOpsSnapshot) {
  if (!snapshot.endpoints.total) return 0;
  return (snapshot.endpoints.online / snapshot.endpoints.total) * 100;
}

function geolocationRate(snapshot: MobileOpsSnapshot) {
  if (!snapshot.endpoints.total) return 0;
  return (snapshot.locationTotal / snapshot.endpoints.total) * 100;
}

function riskTone(value: number, highThreshold: number, mediumThreshold: number) {
  if (value >= highThreshold) return "High";
  if (value >= mediumThreshold) return "Medium";
  return "Low";
}

function buildInsights(report: MobileReportTemplate, snapshot: MobileOpsSnapshot) {
  const online = Math.round(onlineRate(snapshot));
  const geo = Math.round(geolocationRate(snapshot));
  const attention = snapshot.endpoints.offline + snapshot.endpoints.stale + snapshot.tickets.slaExceeded;

  if (report.id === "endpointCoverage") {
    return [
      `Endpoint inventory contains ${number(snapshot.endpoints.total)} managed devices with ${number(snapshot.endpoints.online)} currently online.`,
      `${number(snapshot.endpoints.offline)} devices are offline and ${number(snapshot.endpoints.stale)} devices have stale telemetry.`,
      `Geolocation coverage is ${pct(geo)}, based on ${number(snapshot.locationTotal)} devices with detected latest location.`,
    ];
  }

  if (report.id === "serviceDesk") {
    return [
      `Service Desk currently has ${number(snapshot.tickets.open)} open tickets and ${number(snapshot.tickets.closed)} closed tickets.`,
      `${number(snapshot.tickets.slaExceeded)} tickets have exceeded SLA and should be reviewed first.`,
      `SLA achievement is recorded at ${pct(snapshot.tickets.slaAchievement)} for the current mobile snapshot.`,
    ];
  }

  return [
    `Overall attention queue is ${number(attention)}, combining offline devices, stale devices and SLA exceeded tickets.`,
    `Endpoint online coverage is ${pct(online)} across ${number(snapshot.endpoints.total)} managed devices.`,
    `Geolocation visibility covers ${number(snapshot.locationTotal)} devices and report data was generated at ${esc(snapshot.generatedAt)}.`,
  ];
}

function buildActions(report: MobileReportTemplate) {
  if (report.id === "endpointCoverage") {
    return [
      "Validate offline endpoints by branch before escalating to field support.",
      "Review stale devices and confirm whether agent telemetry is delayed or device is inactive.",
      "Prioritise branches with missing geolocation records for device check-in validation.",
    ];
  }

  if (report.id === "serviceDesk") {
    return [
      "Review SLA exceeded tickets first and update owner or escalation status.",
      "Compare open and closed workload daily to confirm support team throughput.",
      "Use ticket trend as a lightweight indicator of operational pressure.",
    ];
  }

  return [
    "Start with offline endpoints because they reduce operational visibility.",
    "Review stale endpoint telemetry to separate inactive devices from reporting issues.",
    "Use geolocation coverage to confirm location visibility by branch.",
  ];
}

export function buildMobileReportHtml(report: MobileReportTemplate, snapshot: MobileOpsSnapshot) {
  const online = Math.round(onlineRate(snapshot));
  const geo = Math.round(geolocationRate(snapshot));
  const attention = snapshot.endpoints.offline + snapshot.endpoints.stale + snapshot.tickets.slaExceeded;
  const insights = buildInsights(report, snapshot);
  const actions = buildActions(report);
  const workload = Math.max(snapshot.tickets.open + snapshot.tickets.closed, snapshot.tickets.total, 1);
  const openPct = Math.round((snapshot.tickets.open / workload) * 100);
  const closedPct = Math.round((snapshot.tickets.closed / workload) * 100);
  const totalEndpoints = Math.max(snapshot.endpoints.total, 1);
  const offlinePct = Math.round((snapshot.endpoints.offline / totalEndpoints) * 100);
  const stalePct = Math.max(0, 100 - online - offlinePct);

  return `
<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  @page { size: A4; margin: 22mm 18mm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; margin: 0; color: #111827; background: #f5f7fb; }
  .page { background: #f5f7fb; }
  .cover { border-radius: 28px; padding: 28px; color: #fff; background: linear-gradient(135deg, ${report.accent}, #07111f); position: relative; overflow: hidden; }
  .cover:before { content: ""; position: absolute; width: 220px; height: 220px; border-radius: 999px; background: rgba(255,255,255,.13); right: -70px; top: -80px; }
  .cover:after { content: ""; position: absolute; width: 150px; height: 150px; border-radius: 999px; background: rgba(255,255,255,.08); left: -45px; bottom: -55px; }
  .code { font-size: 11px; font-weight: 800; letter-spacing: 1.4px; opacity: .82; text-transform: uppercase; }
  h1 { font-size: 30px; line-height: 1.05; margin: 14px 0 8px; letter-spacing: -1px; position: relative; }
  .subtitle { font-size: 13px; line-height: 1.55; opacity: .84; max-width: 470px; position: relative; }
  .meta { margin-top: 28px; display: flex; gap: 10px; position: relative; }
  .pill { background: rgba(255,255,255,.14); border: 1px solid rgba(255,255,255,.18); border-radius: 999px; padding: 8px 12px; font-size: 11px; font-weight: 700; }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 18px; }
  .card { background: #fff; border: 1px solid #e4e9f2; border-radius: 18px; padding: 14px; box-shadow: 0 10px 22px rgba(15, 23, 42, .06); }
  .label { color: #667085; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .6px; }
  .value { color: #111827; font-size: 24px; font-weight: 900; margin-top: 6px; letter-spacing: -.5px; }
  .section { margin-top: 18px; }
  .section h2 { font-size: 17px; margin: 0 0 10px; letter-spacing: -.4px; }
  .two { display: grid; grid-template-columns: 1.15fr .85fr; gap: 14px; }
  .bar-row { margin-top: 10px; }
  .bar-label { display:flex; justify-content:space-between; color:#475467; font-size:11px; font-weight:700; margin-bottom:6px; }
  .track { height: 10px; border-radius: 999px; background: #e8edf5; overflow: hidden; }
  .fill { height: 10px; border-radius: 999px; background: ${report.accent}; }
  .stack { display: flex; height: 12px; border-radius: 999px; overflow: hidden; background: #e8edf5; margin-top: 10px; }
  .online { background: #159A6A; width: ${pct(online)}; }
  .offline { background: #D45264; width: ${pct(offlinePct)}; }
  .stale { background: #C27A13; width: ${pct(stalePct)}; }
  ul { margin: 0; padding-left: 18px; }
  li { margin: 8px 0; color: #344054; font-size: 12px; line-height: 1.45; }
  .action { display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; border-bottom: 1px solid #edf1f6; }
  .action:last-child { border-bottom: 0; }
  .num { min-width: 25px; height: 25px; border-radius: 9px; background: ${report.softAccent}; color: ${report.accent}; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 11px; }
  .action-text { font-size: 12px; line-height: 1.45; color: #344054; font-weight: 700; }
  .footer { margin-top: 22px; color: #667085; font-size: 10px; text-align: center; }
</style>
</head>
<body>
  <main class="page">
    <section class="cover">
      <div class="code">${esc(report.code)} · ${esc(report.category)}</div>
      <h1>${esc(report.pdfTitle)}</h1>
      <div class="subtitle">${esc(report.description)}</div>
      <div class="meta">
        <div class="pill">Generated: ${esc(snapshot.generatedAt)}</div>
        <div class="pill">Focus: ${esc(report.primaryFocus)}</div>
      </div>
    </section>

    <section class="grid">
      <div class="card"><div class="label">Endpoints</div><div class="value">${number(snapshot.endpoints.total)}</div></div>
      <div class="card"><div class="label">Online</div><div class="value">${number(snapshot.endpoints.online)}</div></div>
      <div class="card"><div class="label">Open Tickets</div><div class="value">${number(snapshot.tickets.open)}</div></div>
      <div class="card"><div class="label">Attention</div><div class="value">${number(attention)}</div></div>
    </section>

    <section class="section two">
      <div class="card">
        <h2>Operational Coverage</h2>
        <div class="bar-row"><div class="bar-label"><span>Online Coverage</span><span>${pct(online)}</span></div><div class="track"><div class="fill" style="width:${pct(online)}"></div></div></div>
        <div class="bar-row"><div class="bar-label"><span>Geolocation Coverage</span><span>${pct(geo)}</span></div><div class="track"><div class="fill" style="width:${pct(geo)}"></div></div></div>
        <div class="stack"><div class="online"></div><div class="offline"></div><div class="stale"></div></div>
      </div>
      <div class="card">
        <h2>Risk Signal</h2>
        <div class="label">Attention Level</div>
        <div class="value">${riskTone(attention, 50, 10)}</div>
        <div class="label" style="margin-top:12px;">SLA Achievement</div>
        <div class="value">${pct(snapshot.tickets.slaAchievement)}</div>
      </div>
    </section>

    <section class="section two">
      <div class="card">
        <h2>Key Insights</h2>
        <ul>${insights.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
      </div>
      <div class="card">
        <h2>Ticket Workload</h2>
        <div class="bar-row"><div class="bar-label"><span>Open</span><span>${pct(openPct)}</span></div><div class="track"><div class="fill" style="width:${pct(openPct)}"></div></div></div>
        <div class="bar-row"><div class="bar-label"><span>Closed</span><span>${pct(closedPct)}</span></div><div class="track"><div class="fill" style="width:${pct(closedPct)}"></div></div></div>
      </div>
    </section>

    <section class="section card">
      <h2>Recommended Actions</h2>
      ${actions.map((item, index) => `<div class="action"><div class="num">${index + 1}</div><div class="action-text">${esc(item)}</div></div>`).join("")}
    </section>

    <div class="footer">EMA OPS Mobile · Compact report generated from live mobile snapshot</div>
  </main>
</body>
</html>`;
}

export async function generateAndShareMobileReport(report: MobileReportTemplate, snapshot: MobileOpsSnapshot): Promise<MobileReportPdfResult> {
  const html = buildMobileReportHtml(report, snapshot);
  const result = await Print.printToFileAsync({ html, base64: false });
  let shared = false;
  let shareError = "";

  try {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(result.uri, {
        mimeType: "application/pdf",
        dialogTitle: report.pdfTitle,
        UTI: "com.adobe.pdf",
      });
      shared = true;
    } else {
      shareError = "Sharing is not available on this device. PDF was still generated.";
    }
  } catch (err) {
    shareError = err instanceof Error ? err.message : String(err || "PDF generated, but sharing failed.");
  }

  return { uri: result.uri, shared, shareError: shareError || undefined };
}
