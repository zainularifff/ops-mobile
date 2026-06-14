import { useCallback, useEffect, useState } from "react";

import type { DashboardSummary } from "../types/dashboard";
import {
  fetchMobileOpsSnapshot,
  fetchReportCatalog,
  getCachedMobileOpsSnapshot,
  getCachedReportCatalog,
  type MobileReportItem,
  type MobileWorkItem,
} from "../services/opsMobileService";

export const emptyDashboardSummary: DashboardSummary = {
  totalEndpoints: 0,
  activeDevices: 0,
  offlineDevices: 0,
  openTickets: 0,
  highRiskExceptions: 0,
};

type LoadOptions = { silent?: boolean };

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error || "Failed to load live data.");
}

function mapSnapshotToSummary(snapshot: any): DashboardSummary {
  return {
    totalEndpoints: snapshot?.endpoints?.total || 0,
    activeDevices: snapshot?.endpoints?.online || 0,
    offlineDevices: (snapshot?.endpoints?.offline || 0) + (snapshot?.endpoints?.stale || 0),
    openTickets: snapshot?.tickets?.open || 0,
    highRiskExceptions: snapshot?.tickets?.slaExceeded || 0,
  };
}

function mapSnapshotToWorkItems(snapshot: any): MobileWorkItem[] {
  const rows: MobileWorkItem[] = [];

  if (snapshot?.latestReport) {
    rows.push({
      id: "latest-report",
      type: "asset",
      title: snapshot.latestReport.title || "Latest report",
      source: "Report",
      site: snapshot.latestReport.category || "-",
      priority: "Low",
      status: snapshot.latestReport.type || "-",
      due: "-",
      updated: snapshot.latestReport.lastGenerated || snapshot.generatedAt || "-",
      owner: "-",
      reason: snapshot.latestReport.description || "Latest report item.",
      action: "Review in web report module.",
    });
  }

  if (snapshot?.latestLocation) {
    rows.push({
      id: "latest-location",
      type: "endpoint",
      title: snapshot.latestLocation.deviceName || "Latest device location",
      source: "Geolocation",
      site: snapshot.latestLocation.address || "-",
      priority: "Low",
      status: "Latest",
      due: "-",
      updated: snapshot.latestLocation.time || "-",
      owner: snapshot.latestLocation.username || "-",
      reason: `${snapshot.latestLocation.latitude || "-"}, ${snapshot.latestLocation.longitude || "-"}`,
      action: "Use web geolocation module for full map view.",
    });
  }

  return rows;
}

export function useOperationsSummary() {
  const cachedSnapshot = getCachedMobileOpsSnapshot();
  const [summary, setSummary] = useState<DashboardSummary>(() => cachedSnapshot ? mapSnapshotToSummary(cachedSnapshot) : emptyDashboardSummary);
  const [loading, setLoading] = useState(() => !cachedSnapshot);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadSummary = useCallback(async (options: LoadOptions = {}) => {
    if (options.silent) setRefreshing(true);
    else if (!getCachedMobileOpsSnapshot()) setLoading(true);

    try {
      const snapshot = await fetchMobileOpsSnapshot({ force: options.silent });
      setSummary(mapSnapshotToSummary(snapshot));
      setError("");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadSummary(); }, [loadSummary]);

  return { summary, loading, refreshing, error, reloadSummary: loadSummary };
}

export function useLiveWorklist() {
  const cachedSnapshot = getCachedMobileOpsSnapshot();
  const [items, setItems] = useState<MobileWorkItem[]>(() => cachedSnapshot ? mapSnapshotToWorkItems(cachedSnapshot) : []);
  const [loading, setLoading] = useState(() => !cachedSnapshot);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadWorklist = useCallback(async (options: LoadOptions = {}) => {
    if (options.silent) setRefreshing(true);
    else if (!getCachedMobileOpsSnapshot()) setLoading(true);

    try {
      const snapshot = await fetchMobileOpsSnapshot({ force: options.silent });
      setItems(mapSnapshotToWorkItems(snapshot));
      setError("");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadWorklist(); }, [loadWorklist]);

  return { items, loading, refreshing, error, reloadWorklist: loadWorklist };
}

export function useLiveReports() {
  const [reports, setReports] = useState<MobileReportItem[]>(() => getCachedReportCatalog() || []);
  const [loading, setLoading] = useState(() => !getCachedReportCatalog());
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadReports = useCallback(async (options: LoadOptions = {}) => {
    if (options.silent) setRefreshing(true);
    else if (!getCachedReportCatalog()) setLoading(true);

    try {
      const liveReports = await fetchReportCatalog({ force: options.silent });
      setReports(liveReports);
      setError("");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadReports(); }, [loadReports]);

  return { reports, loading, refreshing, error, reloadReports: loadReports };
}
