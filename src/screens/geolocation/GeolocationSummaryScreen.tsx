import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  RefreshCcw,
  Search,
  WifiOff,
} from "lucide-react-native";

import {
  fetchGeolocationSummary,
  type GeolocationDeviceFilter,
  type MobileGeolocationDevice,
  type MobileGeolocationSummary,
} from "../../services/opsMobileService";
import { colors } from "../../theme/colors";
import { formatNumber } from "../../utils/formatters";

const PAGE_SIZE = 10;

const emptySummary: MobileGeolocationSummary = {
  generatedAt: "-",
  totalDevices: 0,
  detectedCount: 0,
  notDetectedCount: 0,
  detectedDevices: [],
  notDetectedDevices: [],
};

const ui = {
  bg: "#EAF0F8",
  card: "#FFFFFF",
  ink: "#0B1220",
  soft: "#53657C",
  muted: "#8795A7",
  line: "#DDE7F3",
  navy: "#06101F",
  navy2: "#0B1C36",
  blue: "#2F62D8",
  green: "#1F9D65",
  red: "#D84D4D",
  cyan: "#0E8FA6",
  amber: "#D48A1C",
};

function matchesSearch(item: MobileGeolocationDevice, keyword: string) {
  const value = keyword.trim().toLowerCase();
  if (!value) return true;

  return [
    item.deviceName,
    item.deviceId,
    item.branch,
    item.model,
    item.platform,
    item.ipAddress,
    item.latestLocation?.address,
    item.latestLocation?.username,
  ]
    .join(" ")
    .toLowerCase()
    .includes(value);
}

export default function GeolocationSummaryScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [summary, setSummary] = useState<MobileGeolocationSummary>(emptySummary);
  const [activeFilter, setActiveFilter] = useState<GeolocationDeviceFilter>("detected");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const activeRows = activeFilter === "detected" ? summary.detectedDevices : summary.notDetectedDevices;
  const filteredRows = useMemo(
    () => activeRows.filter((item) => matchesSearch(item, searchText)),
    [activeRows, searchText]
  );
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = filteredRows.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const pageEnd = Math.min(safePage * PAGE_SIZE, filteredRows.length);
  const visibleRows = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, safePage]);

  const loadSummary = useCallback(async (force = false) => {
    if (force) setRefreshing(true);
    else setLoading(true);

    try {
      const liveSummary = await fetchGeolocationSummary({ endpointLimit: 1000, locationLimit: 3000, force });
      setSummary(liveSummary);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err || "Failed to load geolocation data."));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSummary(false);
  }, [loadSummary]);

  useEffect(() => {
    setPage(1);
  }, [activeFilter, searchText]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  function openDevice(item: MobileGeolocationDevice) {
    if (!item.hasLocation) return;
    navigation.navigate("GeolocationHistory", { device: item });
  }

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) + 104 }}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadSummary(true)} />}
    >
      <View style={{ height: insets.top, backgroundColor: ui.navy }} />
      <LinearGradient colors={[ui.navy, ui.navy2, "#123B55"]} style={styles.hero}>
        <View style={styles.heroOrb} />
        <View style={styles.heroTop}>
          <View style={styles.heroCopy}>
            <Text style={styles.eyebrow}>GEOLOCATION COVERAGE</Text>
            <Text style={styles.title}>Device Location</Text>
            <Text style={styles.meta}>Live data · {summary.generatedAt}</Text>
          </View>
          <TouchableOpacity style={styles.refreshButton} onPress={() => loadSummary(true)} activeOpacity={0.85}>
            {loading || refreshing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <RefreshCcw size={18} color="#FFFFFF" strokeWidth={2.8} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.coverageCard}>
          <View>
            <Text style={styles.coverageLabel}>Total Endpoint Inventory</Text>
            <Text style={styles.coverageValue}>{formatNumber(summary.totalDevices)}</Text>
            <Text style={styles.coverageHint}>Compared against latest geolocation records</Text>
          </View>
          <MapPin size={32} color="#BDF4FF" strokeWidth={2.8} />
        </View>
      </LinearGradient>

      {error ? (
        <View style={styles.errorCard}>
          <AlertTriangle size={18} color={ui.red} strokeWidth={2.8} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.summaryRow}>
        <TouchableOpacity
          style={[styles.summaryCard, activeFilter === "detected" && { borderColor: ui.green }]}
          activeOpacity={0.86}
          onPress={() => setActiveFilter("detected")}
        >
          <View style={[styles.summaryIcon, { backgroundColor: "#EAFBF4" }]}>
            <CheckCircle2 size={18} color={ui.green} strokeWidth={2.8} />
          </View>
          <Text style={styles.summaryValue}>{formatNumber(summary.detectedCount)}</Text>
          <Text style={styles.summaryTitle}>Detected</Text>
          <Text style={styles.summaryHint}>Has geolocation data</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.summaryCard, activeFilter === "notDetected" && { borderColor: ui.red }]}
          activeOpacity={0.86}
          onPress={() => setActiveFilter("notDetected")}
        >
          <View style={[styles.summaryIcon, { backgroundColor: "#FFF1F1" }]}>
            <WifiOff size={18} color={ui.red} strokeWidth={2.8} />
          </View>
          <Text style={styles.summaryValue}>{formatNumber(summary.notDetectedCount)}</Text>
          <Text style={styles.summaryTitle}>Not Detected</Text>
          <Text style={styles.summaryHint}>No location record</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterPanel}>
        <View style={styles.searchBox}>
          <Search size={16} color={ui.muted} strokeWidth={2.7} />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search device, branch, user, address..."
            placeholderTextColor={ui.muted}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.searchInput}
          />
          {searchText ? (
            <TouchableOpacity onPress={() => setSearchText("")} activeOpacity={0.75}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.chipRow}>
          <FilterChip label="Detected" active={activeFilter === "detected"} tone={ui.green} onPress={() => setActiveFilter("detected")} />
          <FilterChip label="Not Detected" active={activeFilter === "notDetected"} tone={ui.red} onPress={() => setActiveFilter("notDetected")} />
        </View>
      </View>

      <View style={styles.tablePanel}>
        <View style={styles.tableHeader}>
          <View>
            <Text style={styles.tableTitle}>{activeFilter === "detected" ? "Detected Device Table" : "Not Detected Device Table"}</Text>
            <Text style={styles.tableMeta}>Showing {formatNumber(pageStart)}-{formatNumber(pageEnd)} of {formatNumber(filteredRows.length)}</Text>
          </View>
          <Text style={styles.pageBadge}>Page {safePage}/{totalPages}</Text>
        </View>

        {loading && summary.totalDevices === 0 ? (
          <View style={styles.loadingBlock}>
            <ActivityIndicator size="small" color={ui.cyan} />
            <Text style={styles.loadingText}>Loading geolocation coverage...</Text>
          </View>
        ) : filteredRows.length === 0 ? (
          <View style={styles.emptyBlock}>
            <MapPin size={24} color={ui.muted} strokeWidth={2.7} />
            <Text style={styles.emptyTitle}>No device found</Text>
            <Text style={styles.emptyText}>No device matched this filter.</Text>
          </View>
        ) : (
          visibleRows.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={item.hasLocation ? 0.86 : 1}
              onPress={() => openDevice(item)}
              style={[styles.deviceRow, index === visibleRows.length - 1 && styles.lastRow]}
            >
              <View style={[styles.deviceIcon, { backgroundColor: item.hasLocation ? "#E6F7FB" : "#FFF1F1" }]}>
                {item.hasLocation ? (
                  <MapPin size={17} color={ui.cyan} strokeWidth={2.8} />
                ) : (
                  <WifiOff size={17} color={ui.red} strokeWidth={2.8} />
                )}
              </View>
              <View style={styles.deviceTextWrap}>
                <View style={styles.deviceTopRow}>
                  <Text style={styles.deviceName} numberOfLines={1}>{item.deviceName}</Text>
                  <Text style={[styles.statusText, { color: item.hasLocation ? ui.green : ui.red }]}>
                    {item.hasLocation ? "Detected" : "No Data"}
                  </Text>
                </View>
                <Text style={styles.deviceMeta} numberOfLines={1}>{item.branch}</Text>
                {item.hasLocation ? (
                  <>
                    <Text style={styles.locationAddress} numberOfLines={1}>{item.latestLocation?.address || "-"}</Text>
                    <Text style={styles.deviceMeta} numberOfLines={1}>Latest: {item.latestLocation?.time || "-"} · {item.locationCount} records</Text>
                  </>
                ) : (
                  <Text style={styles.deviceMeta} numberOfLines={1}>{item.platform} · {item.model} · {item.ipAddress}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}

        <View style={styles.paginationBar}>
          <TouchableOpacity
            style={[styles.pageButton, safePage <= 1 && styles.pageButtonDisabled]}
            disabled={safePage <= 1}
            activeOpacity={0.82}
            onPress={() => setPage((current) => Math.max(1, current - 1))}
          >
            <ChevronLeft size={16} color={safePage <= 1 ? ui.muted : ui.ink} strokeWidth={2.8} />
            <Text style={[styles.pageButtonText, safePage <= 1 && styles.pageButtonTextDisabled]}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pageButton, safePage >= totalPages && styles.pageButtonDisabled]}
            disabled={safePage >= totalPages}
            activeOpacity={0.82}
            onPress={() => setPage((current) => Math.min(totalPages, current + 1))}
          >
            <Text style={[styles.pageButtonText, safePage >= totalPages && styles.pageButtonTextDisabled]}>Next</Text>
            <ChevronRight size={16} color={safePage >= totalPages ? ui.muted : ui.ink} strokeWidth={2.8} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

function FilterChip({ label, active, tone, onPress }: { label: string; active: boolean; tone: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.filterChip, active && { backgroundColor: tone, borderColor: tone }]}
      activeOpacity={0.82}
      onPress={onPress}
    >
      <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: ui.bg },
  hero: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 28, borderBottomLeftRadius: 34, borderBottomRightRadius: 34, overflow: "hidden" },
  heroOrb: { position: "absolute", width: 220, height: 220, borderRadius: 220, backgroundColor: "rgba(14,143,166,0.35)", top: -110, right: -80 },
  heroTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  heroCopy: { flex: 1, paddingRight: 14 },
  eyebrow: { color: "#9DC2FF", fontSize: 11, fontWeight: "900", letterSpacing: 1.25 },
  title: { color: "#FFFFFF", fontSize: 30, fontWeight: "900", letterSpacing: -1.2, marginTop: 6 },
  meta: { color: "#B5C7DE", fontSize: 11, fontWeight: "700", marginTop: 8 },
  refreshButton: { width: 42, height: 42, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.16)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)" },
  coverageCard: { marginTop: 24, padding: 16, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.11)", borderWidth: 1, borderColor: "rgba(255,255,255,0.16)", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  coverageLabel: { color: "#D8E7FF", fontSize: 11, fontWeight: "800" },
  coverageValue: { color: "#FFFFFF", fontSize: 44, fontWeight: "900", letterSpacing: -1.6, marginTop: 3 },
  coverageHint: { color: "#9EB1CA", fontSize: 10.5, fontWeight: "700", marginTop: 2 },
  errorCard: { marginHorizontal: 16, marginTop: 14, padding: 14, borderRadius: 18, backgroundColor: "#FFF5F5", borderWidth: 1, borderColor: "#FAD0D0", flexDirection: "row", alignItems: "center", gap: 9 },
  errorText: { flex: 1, color: ui.soft, fontSize: 11, fontWeight: "700" },
  summaryRow: { flexDirection: "row", gap: 10, paddingHorizontal: 16, marginTop: -16 },
  summaryCard: { flex: 1, backgroundColor: ui.card, borderRadius: 22, padding: 14, borderWidth: 1, borderColor: ui.line, shadowColor: "#4F6078", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 2 },
  summaryIcon: { width: 36, height: 36, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 11 },
  summaryValue: { color: ui.ink, fontSize: 30, fontWeight: "900", letterSpacing: -1 },
  summaryTitle: { color: ui.ink, fontSize: 12, fontWeight: "900", marginTop: 2 },
  summaryHint: { color: ui.soft, fontSize: 10.2, fontWeight: "700", marginTop: 4 },
  filterPanel: { marginHorizontal: 16, marginTop: 14, backgroundColor: ui.card, borderRadius: 22, padding: 13, borderWidth: 1, borderColor: ui.line },
  searchBox: { height: 44, borderRadius: 15, backgroundColor: "#F8FBFF", borderWidth: 1, borderColor: "#E5EEF8", flexDirection: "row", alignItems: "center", paddingHorizontal: 12 },
  searchInput: { flex: 1, color: ui.ink, fontSize: 12, fontWeight: "700", paddingHorizontal: 8 },
  clearText: { color: ui.blue, fontSize: 11, fontWeight: "900" },
  chipRow: { flexDirection: "row", gap: 8, marginTop: 11 },
  filterChip: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 999, borderWidth: 1, borderColor: ui.line, backgroundColor: "#F8FBFF" },
  filterChipText: { color: ui.soft, fontSize: 11, fontWeight: "900" },
  filterChipTextActive: { color: "#FFFFFF" },
  tablePanel: { marginHorizontal: 16, marginTop: 14, backgroundColor: ui.card, borderRadius: 24, padding: 15, borderWidth: 1, borderColor: ui.line, shadowColor: "#4F6078", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 2 },
  tableHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
  tableTitle: { color: ui.ink, fontSize: 16, fontWeight: "900" },
  tableMeta: { color: ui.soft, fontSize: 10.5, fontWeight: "700", marginTop: 4 },
  pageBadge: { color: ui.blue, fontSize: 10, fontWeight: "900", backgroundColor: "#EDF4FF", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 7 },
  loadingBlock: { alignItems: "center", paddingVertical: 24, gap: 8 },
  loadingText: { color: ui.soft, fontSize: 11, fontWeight: "800" },
  emptyBlock: { alignItems: "center", paddingVertical: 24 },
  emptyTitle: { color: ui.ink, fontSize: 13, fontWeight: "900", marginTop: 8 },
  emptyText: { color: ui.soft, fontSize: 11, fontWeight: "700", marginTop: 4 },
  deviceRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#EDF2F8" },
  lastRow: { borderBottomWidth: 0 },
  deviceIcon: { width: 39, height: 39, borderRadius: 14, alignItems: "center", justifyContent: "center", marginRight: 11 },
  deviceTextWrap: { flex: 1 },
  deviceTopRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  deviceName: { flex: 1, color: ui.ink, fontSize: 12.5, fontWeight: "900" },
  statusText: { fontSize: 10, fontWeight: "900" },
  deviceMeta: { color: ui.soft, fontSize: 10.5, fontWeight: "700", marginTop: 3 },
  locationAddress: { color: ui.ink, fontSize: 10.5, fontWeight: "800", marginTop: 4 },
  paginationBar: { flexDirection: "row", justifyContent: "space-between", gap: 10, paddingTop: 14, borderTopWidth: 1, borderTopColor: "#EDF2F8", marginTop: 4 },
  pageButton: { flex: 1, height: 42, borderRadius: 14, backgroundColor: "#F8FBFF", borderWidth: 1, borderColor: "#E5EEF8", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5 },
  pageButtonDisabled: { opacity: 0.5 },
  pageButtonText: { color: ui.ink, fontSize: 11, fontWeight: "900" },
  pageButtonTextDisabled: { color: ui.muted },
});
