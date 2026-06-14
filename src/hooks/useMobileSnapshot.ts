import { useCallback, useEffect, useState } from "react";

import {
  fetchMobileOpsSnapshot,
  getCachedMobileOpsSnapshot,
  type MobileOpsSnapshot,
} from "../services/opsMobileService";

const emptySnapshot: MobileOpsSnapshot = {
  generatedAt: "-",
  rangeLabel: "Last 7 Days",
  endpoints: { total: 0, online: 0, offline: 0, stale: 0 },
  tickets: { total: 0, open: 0, closed: 0, slaExceeded: 0, slaAchievement: 0 },
  latestReport: null,
  latestLocation: null,
};

function toMessage(value: unknown) {
  return value instanceof Error ? value.message : String(value || "Unable to load live data.");
}

export function useMobileSnapshot() {
  const [snapshot, setSnapshot] = useState<MobileOpsSnapshot>(() => getCachedMobileOpsSnapshot() || emptySnapshot);
  const [loading, setLoading] = useState(() => !getCachedMobileOpsSnapshot());
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    if (!refresh && !getCachedMobileOpsSnapshot()) setLoading(true);

    try {
      const nextSnapshot = await fetchMobileOpsSnapshot({ force: refresh });
      setSnapshot(nextSnapshot);
      setError("");
    } catch (err) {
      setError(toMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  return { snapshot, loading, refreshing, error, reload: () => load(true) };
}
