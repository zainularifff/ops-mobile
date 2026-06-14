import { useCallback, useEffect, useState } from "react";

import type { DashboardSummary } from "../types/dashboard";
import {
  fetchOperationsSummary,
  fetchReportCatalog,
  fetchWorklistItems,
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

type LoadOptions = {
  silent?: boolean;
};

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error || "Failed to load live data.");
}

export function useOperationsSummary() {
  const [summary, setSummary] = useState<DashboardSummary>(emptyDashboardSummary);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadSummary = useCallback(async (options: LoadOptions = {}) => {
    if (options.silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const liveSummary = await fetchOperationsSummary();
      setSummary(liveSummary);
      setError("");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  return {
    summary,
    loading,
    refreshing,
    error,
    reloadSummary: loadSummary,
  };
}

export function useLiveWorklist() {
  const [items, setItems] = useState<MobileWorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadWorklist = useCallback(async (options: LoadOptions = {}) => {
    if (options.silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const liveItems = await fetchWorklistItems();
      setItems(liveItems);
      setError("");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadWorklist();
  }, [loadWorklist]);

  return {
    items,
    loading,
    refreshing,
    error,
    reloadWorklist: loadWorklist,
  };
}

export function useLiveReports() {
  const [reports, setReports] = useState<MobileReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadReports = useCallback(async (options: LoadOptions = {}) => {
    if (options.silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const liveReports = await fetchReportCatalog();
      setReports(liveReports);
      setError("");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  return {
    reports,
    loading,
    refreshing,
    error,
    reloadReports: loadReports,
  };
}
