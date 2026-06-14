import type { DashboardSummary } from "../types/dashboard";
import { apiRequest } from "./apiClient";

export type MobileWorkItem = {
  id: string;
  type: "endpoint" | "ticket" | "remote" | "software" | "asset";
  title: string;
  source: string;
  site: string;
  priority: "Low" | "Medium" | "High";
  status: string;
  due: string;
  updated: string;
  owner: string;
  reason: string;
  action: string;
};

export type MobileReportItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  type?: string;
  source?: string;
  outputs?: string[];
  status?: string;
  tone?: "red" | "amber" | "blue" | "green" | "purple";
  pages?: number;
  frequency?: string;
  lastGenerated?: string;
};

function cleanText(value: unknown, fallback = "-") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function asNumber(value: unknown, fallback = 0) {
  if (typeof value === "number") return Number.isFinite(value) ? value : fallback;

  const parsed = Number(String(value ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function pickKpiValue(kpiCards: any[] = [], title: string) {
  const card = kpiCards.find((item) =>
    String(item?.title || "").toLowerCase().includes(title.toLowerCase())
  );

  return asNumber(card?.value, 0);
}

function mapTaskType(task: any): MobileWorkItem["type"] {
  const value = `${task?.classification || ""} ${task?.taskType || ""} ${task?.commandType || ""} ${task?.description || ""}`.toLowerCase();

  if (value.includes("software") || value.includes("package")) return "software";
  if (value.includes("remote") || value.includes("control")) return "remote";
  if (value.includes("asset") || value.includes("hardware")) return "asset";
  if (value.includes("ticket") || value.includes("incident")) return "ticket";
  return "endpoint";
}

function mapTaskPriority(task: any): MobileWorkItem["priority"] {
  const status = String(task?.state || "").toLowerCase();

  if (status.includes("fail") || status.includes("cancel") || status.includes("stop")) {
    return "High";
  }

  if (status.includes("run") || status.includes("progress") || status.includes("pending")) {
    return "Medium";
  }

  return "Low";
}

export async function fetchOperationsSummary(): Promise<DashboardSummary> {
  const response: any = await apiRequest("/api/dashboard/it-operations");
  const data = response?.data || response || {};
  const kpiCards = Array.isArray(data?.kpiCards) ? data.kpiCards : [];
  const totalEndpoints = asNumber(
    data?.hardware?.totalDevices,
    pickKpiValue(kpiCards, "Total Devices")
  );
  const activeDevices = asNumber(data?.hardware?.onlineDevices, 0);

  return {
    totalEndpoints,
    activeDevices,
    offlineDevices: Math.max(totalEndpoints - activeDevices, 0),
    openTickets: asNumber(
      data?.serviceDesk?.pendingTickets,
      pickKpiValue(kpiCards, "Open Incidents")
    ),
    highRiskExceptions: asNumber(
      data?.risk?.totalCritical,
      pickKpiValue(kpiCards, "Critical Risks")
    ),
  };
}

export async function fetchWorklistItems(): Promise<MobileWorkItem[]> {
  const response: any = await apiRequest("/api/task-list");
  const rows = Array.isArray(response?.data) ? response.data : [];

  return rows.map((task: any, index: number) => {
    const type = mapTaskType(task);
    const priority = mapTaskPriority(task);
    const status = cleanText(task?.state || task?.rawState);
    const title = cleanText(task?.description || task?.title || task?.name);
    const idValue = task?.jobId || task?.id || task?.Job_Idn || task?.Task_ID;

    return {
      id: cleanText(idValue, `row-${index + 1}`),
      type,
      title,
      source: cleanText(task?.commandType || task?.classification),
      site: cleanText(task?.raw?.Object_Full_Name || task?.raw?.Object_Rel_Name || task?.targetName),
      priority,
      status,
      due: cleanText(task?.scheduledTime || task?.startTime),
      updated: cleanText(task?.startTime || task?.endTime),
      owner: cleanText(task?.orderedBy),
      reason: cleanText(task?.effectiveStatusReason),
      action: cleanText(task?.action || task?.recommendedAction),
    };
  });
}

export async function fetchReportCatalog(): Promise<MobileReportItem[]> {
  const response: any = await apiRequest("/api/reports/catalog");
  const rows = Array.isArray(response?.reports)
    ? response.reports
    : Array.isArray(response?.data?.reports)
      ? response.data.reports
      : [];

  return rows.map((item: any, index: number) => ({
    id: cleanText(item?.id || item?.reportId || item?.key, `report-${index + 1}`),
    title: cleanText(item?.title || item?.name),
    description: cleanText(item?.description || item?.summary),
    category: cleanText(item?.category || item?.icon, "executive"),
    type: cleanText(item?.type, ""),
    source: cleanText(item?.source, ""),
    outputs: Array.isArray(item?.outputs) ? item.outputs : [],
    status: cleanText(item?.status, ""),
    tone: item?.tone || "blue",
    pages: asNumber(item?.pages, 0),
    frequency: cleanText(item?.frequency, ""),
    lastGenerated: cleanText(item?.lastGenerated || item?.generatedAt, ""),
  }));
}
