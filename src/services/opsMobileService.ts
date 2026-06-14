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

export type MobileEndpointSnapshot = {
  total: number;
  online: number;
  offline: number;
  stale: number;
};

export type MobileTicketSnapshot = {
  total: number;
  open: number;
  closed: number;
  slaExceeded: number;
  slaAchievement: number;
};

export type MobileLatestLocation = {
  deviceId: string;
  deviceName: string;
  username: string;
  model: string;
  address: string;
  latitude: string;
  longitude: string;
  time: string;
};

export type MobileOpsSnapshot = {
  generatedAt: string;
  rangeLabel: string;
  endpoints: MobileEndpointSnapshot;
  tickets: MobileTicketSnapshot;
  latestReport: MobileReportItem | null;
  latestLocation: MobileLatestLocation | null;
};

type FetchOptions = {
  force?: boolean;
};

type WorklistFetchOptions = FetchOptions & {
  limit?: number;
};

type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

const SNAPSHOT_CACHE_KEY = "mobile-ops-snapshot";
const SUMMARY_CACHE_KEY = "operations-summary";
const REPORTS_CACHE_KEY = "report-catalog";
const SUMMARY_CACHE_TTL_MS = 60 * 1000;
const SNAPSHOT_CACHE_TTL_MS = 45 * 1000;
const WORKLIST_CACHE_TTL_MS = 30 * 1000;
const REPORTS_CACHE_TTL_MS = 5 * 60 * 1000;
const DEFAULT_WORKLIST_LIMIT = 25;

const liveDataCache = new Map<string, CacheEntry<unknown>>();
const liveDataInFlight = new Map<string, Promise<unknown>>();

function worklistCacheKey(limit: number) {
  return `worklist-${limit}`;
}

function clampWorklistLimit(value?: number) {
  const parsed = Number(value || DEFAULT_WORKLIST_LIMIT);
  if (!Number.isFinite(parsed)) return DEFAULT_WORKLIST_LIMIT;
  return Math.max(1, Math.min(Math.round(parsed), 100));
}

function getCachedValue<T>(key: string): T | null {
  const cached = liveDataCache.get(key) as CacheEntry<T> | undefined;
  if (!cached) return null;

  if (Date.now() > cached.expiresAt) {
    liveDataCache.delete(key);
    return null;
  }

  return cached.value;
}

function setCachedValue<T>(key: string, value: T, ttlMs: number) {
  liveDataCache.set(key, {
    expiresAt: Date.now() + ttlMs,
    value,
  });
}

async function fetchWithCache<T>(
  key: string,
  ttlMs: number,
  requestFactory: () => Promise<T>,
  options: FetchOptions = {}
): Promise<T> {
  if (!options.force) {
    const cached = getCachedValue<T>(key);
    if (cached !== null) return cached;
  }

  const activeRequest = liveDataInFlight.get(key) as Promise<T> | undefined;
  if (activeRequest) return activeRequest;

  const request = requestFactory()
    .then((value) => {
      setCachedValue(key, value, ttlMs);
      return value;
    })
    .finally(() => {
      if (liveDataInFlight.get(key) === request) {
        liveDataInFlight.delete(key);
      }
    });

  liveDataInFlight.set(key, request);
  return request;
}

export function clearOpsMobileCache(prefix?: string) {
  if (!prefix) {
    liveDataCache.clear();
    liveDataInFlight.clear();
    return;
  }

  for (const key of liveDataCache.keys()) {
    if (key.startsWith(prefix)) liveDataCache.delete(key);
  }

  for (const key of liveDataInFlight.keys()) {
    if (key.startsWith(prefix)) liveDataInFlight.delete(key);
  }
}

export function getCachedMobileOpsSnapshot() {
  return getCachedValue<MobileOpsSnapshot>(SNAPSHOT_CACHE_KEY);
}

export function getCachedOperationsSummary() {
  return getCachedValue<DashboardSummary>(SUMMARY_CACHE_KEY);
}

export function getCachedWorklistItems(limit = DEFAULT_WORKLIST_LIMIT) {
  return getCachedValue<MobileWorkItem[]>(worklistCacheKey(clampWorklistLimit(limit)));
}

export function getCachedReportCatalog() {
  return getCachedValue<MobileReportItem[]>(REPORTS_CACHE_KEY);
}

function cleanText(value: unknown, fallback = "-") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function asNumber(value: unknown, fallback = 0) {
  if (typeof value === "number") return Number.isFinite(value) ? value : fallback;

  const parsed = Number(String(value ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeKeyPart(value: unknown, fallback = "item") {
  return cleanText(value, fallback)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueKey(baseValue: unknown, index: number, fallback = "item") {
  const base = normalizeKeyPart(baseValue, `${fallback}-${index + 1}`);
  return `${base || fallback}-${index + 1}`;
}

function hiddenKeySuffix(index: number) {
  return "\u200B".repeat((index % 20) + 1);
}

function pickKpiValue(kpiCards: any[] = [], title: string) {
  const card = kpiCards.find((item) =>
    String(item?.title || "").toLowerCase().includes(title.toLowerCase())
  );

  return asNumber(card?.value, 0);
}

function formatDateTime(value: unknown) {
  const raw = cleanText(value, "");
  if (!raw) return "-";

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDateSortValue(value: unknown) {
  const raw = cleanText(value, "");
  if (!raw) return 0;

  const date = new Date(raw);
  const time = date.getTime();
  return Number.isNaN(time) ? 0 : time;
}

function pickLatestReport(reports: MobileReportItem[]) {
  if (!reports.length) return null;

  return [...reports].sort((a, b) => {
    return getDateSortValue(b.lastGenerated) - getDateSortValue(a.lastGenerated);
  })[0];
}

function mapLatestLocation(rows: any[]): MobileLatestLocation | null {
  const first = rows[0];
  if (!first) return null;

  return {
    deviceId: cleanText(first?.DeviceID || first?.deviceID),
    deviceName: cleanText(first?.DeviceName || first?.ComputerName || first?.Object_Client_Name),
    username: cleanText(first?.LastLoggedInUser || first?.Username),
    model: cleanText(first?.DeviceModelName || first?.Model),
    address: cleanText(first?.LocationName || first?.Address),
    latitude: cleanText(first?.Latitude || first?.latitude),
    longitude: cleanText(first?.Longitude || first?.longitude),
    time: formatDateTime(first?.Time || first?.DateTime),
  };
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

async function requestOperationsDashboard() {
  const response: any = await apiRequest("/api/dashboard/it-operations");
  return response?.data || response || {};
}

async function requestOperationsSummary(): Promise<DashboardSummary> {
  const data = await requestOperationsDashboard();
  const kpiCards = Array.isArray(data?.kpiCards) ? data.kpiCards : [];
  const totalEndpoints = asNumber(
    data?.hardware?.totalDevices,
    pickKpiValue(kpiCards, "Total Devices")
  );
  const activeDevices = asNumber(data?.hardware?.onlineDevices, 0);

  return {
    totalEndpoints,
    activeDevices,
    offlineDevices: asNumber(
      data?.hardware?.offlineDevices,
      Math.max(totalEndpoints - activeDevices, 0)
    ),
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

export async function fetchOperationsSummary(
  options: FetchOptions = {}
): Promise<DashboardSummary> {
  return fetchWithCache(
    SUMMARY_CACHE_KEY,
    SUMMARY_CACHE_TTL_MS,
    requestOperationsSummary,
    options
  );
}

async function requestWorklistItems(limit: number): Promise<MobileWorkItem[]> {
  const response: any = await apiRequest(`/api/task-list?limit=${limit}`);
  const rows = Array.isArray(response?.data) ? response.data : [];

  return rows.map((task: any, index: number) => {
    const type = mapTaskType(task);
    const priority = mapTaskPriority(task);
    const status = cleanText(task?.state || task?.rawState);
    const title = cleanText(task?.description || task?.title || task?.name);
    const idValue =
      task?.jobId ||
      task?.id ||
      task?.Job_Idn ||
      task?.Task_ID ||
      `${task?.commandType || "task"}-${title}`;
    const source = cleanText(task?.commandType || task?.classification);

    return {
      id: uniqueKey(idValue, index, "task"),
      type,
      title,
      source: `${source}${hiddenKeySuffix(index)}`,
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

export async function fetchWorklistItems(
  options: WorklistFetchOptions = {}
): Promise<MobileWorkItem[]> {
  const limit = clampWorklistLimit(options.limit);

  return fetchWithCache(
    worklistCacheKey(limit),
    WORKLIST_CACHE_TTL_MS,
    () => requestWorklistItems(limit),
    options
  );
}

async function requestReportCatalog(): Promise<MobileReportItem[]> {
  const response: any = await apiRequest("/api/reports/catalog");
  const rows = Array.isArray(response?.reports)
    ? response.reports
    : Array.isArray(response?.data?.reports)
      ? response.data.reports
      : [];

  return rows.map((item: any, index: number) => {
    const title = cleanText(item?.title || item?.name);
    const idValue = item?.id || item?.reportId || item?.key || title;

    return {
      id: uniqueKey(idValue, index, "report"),
      title,
      description: cleanText(item?.description || item?.summary),
      category: cleanText(item?.category || item?.icon, "executive"),
      type: cleanText(item?.type, ""),
      source: cleanText(item?.source, ""),
      outputs: Array.isArray(item?.outputs) ? item.outputs : [],
      status: cleanText(item?.status, ""),
      tone: item?.tone || "blue",
      pages: asNumber(item?.pages, 0),
      frequency: cleanText(item?.frequency, ""),
      lastGenerated: cleanText(item?.lastGenerated || item?.generatedAt || item?.updatedAt, ""),
    };
  });
}

export async function fetchReportCatalog(
  options: FetchOptions = {}
): Promise<MobileReportItem[]> {
  return fetchWithCache(
    REPORTS_CACHE_KEY,
    REPORTS_CACHE_TTL_MS,
    requestReportCatalog,
    options
  );
}

async function requestLatestLocation() {
  const response: any = await apiRequest("/api/geolocation/all-live?limit=1");
  const rows = Array.isArray(response?.data) ? response.data : [];
  return mapLatestLocation(rows);
}

async function requestMobileOpsSnapshot(): Promise<MobileOpsSnapshot> {
  const [dashboardResult, reportsResult, locationResult] = await Promise.allSettled([
    requestOperationsDashboard(),
    requestReportCatalog(),
    requestLatestLocation(),
  ]);

  if (dashboardResult.status === "rejected") {
    throw dashboardResult.reason;
  }

  const data = dashboardResult.value || {};
  const hardware = data?.hardware || {};
  const serviceDesk = data?.serviceDesk || {};
  const trendSummary = data?.trendSummary || {};
  const kpiCards = Array.isArray(data?.kpiCards) ? data.kpiCards : [];

  const totalEndpoints = asNumber(
    hardware?.totalDevices,
    pickKpiValue(kpiCards, "Total Devices")
  );
  const online = asNumber(hardware?.onlineDevices, 0);
  const offline = asNumber(
    hardware?.offlineDevices,
    Math.max(totalEndpoints - online, 0)
  );
  const stale = asNumber(hardware?.staleSync, 0);

  const open = asNumber(
    serviceDesk?.pendingTickets,
    pickKpiValue(kpiCards, "Open Incidents")
  );
  const closed = asNumber(trendSummary?.resolved, 0);
  const slaExceeded = asNumber(serviceDesk?.overdueTickets, 0);

  const reports = reportsResult.status === "fulfilled" ? reportsResult.value : [];
  const latestLocation = locationResult.status === "fulfilled" ? locationResult.value : null;

  return {
    generatedAt: formatDateTime(data?.generatedAt || new Date().toISOString()),
    rangeLabel: cleanText(data?.rangeLabel, "Last 7 Days"),
    endpoints: {
      total: totalEndpoints,
      online,
      offline,
      stale,
    },
    tickets: {
      total: Math.max(open + closed, open, closed),
      open,
      closed,
      slaExceeded,
      slaAchievement: asNumber(serviceDesk?.slaAchievement, 0),
    },
    latestReport: pickLatestReport(reports),
    latestLocation,
  };
}

export async function fetchMobileOpsSnapshot(
  options: FetchOptions = {}
): Promise<MobileOpsSnapshot> {
  return fetchWithCache(
    SNAPSHOT_CACHE_KEY,
    SNAPSHOT_CACHE_TTL_MS,
    requestMobileOpsSnapshot,
    options
  );
}
