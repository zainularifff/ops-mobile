import { useCallback, useEffect, useState } from "react";

import type { DashboardSummary } from "../types/dashboard";
import {
  fetchOperationsSummary,
  fetchReportCatalog,
  fetchWorklistItems,
  getCachedOperationsSummary,
  getCachedReportCatalog,
  getCachedWorklistItems,
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
  const [summary, setSummary] = useState<DashboardSummary>(() => {
    return getCachedOperationsSummary() || emptyDashboardSummary;
  });
  const [loading, setLoading] = useState(() => !getCachedOperationsSummary());
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadSummary = useCallback(async (options: LoadOptions = {}) => {
    if (options.silent) {
      setRefreshing(true);
    } else if (!getCachedOperationsSummary()) {
      setLoading(true);
    }

    try {
      const liveSummary = await fetchOperationsSummary({ force: options.silent });
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

export function useLiveWorklist(limit = 25) {
  const [items, setItems] = useState<MobileWorkItem[]>(() => {
    return getCachedWorklistItems(limit) || [];
  });
  const [loading, setLoading] = useState(() => !getCachedWorklistItems(limit));
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadWorklist = useCallback(async (options: LoadOptions = {}) => {
    if (options.silent) {
      setRefreshing(true);
    } else if (!getCachedWorklistItems(limit)) {
      setLoading(true);
    }

    try {
      const liveItems = await fetchWorklistItems({
        force: options.silent,
        limit,
      });
      setItems(liveItems);
      setError("");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [limit]);

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
  const [reports, setReports] = useState<MobileReportItem[]>(() => {
    return getCachedReportCatalog() || [];
  });
  const [loading, setLoading] = useState(() => !getCachedReportCatalog());
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadReports = useCallback(async (options: LoadOptions = {}) => {
    if (options.silent) {
      setRefreshing(true);
    } else if (!getCachedReportCatalog()) {
      setLoading(true);
    }

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
