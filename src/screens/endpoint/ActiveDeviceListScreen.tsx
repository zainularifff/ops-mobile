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
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  MonitorCog,
  RefreshCcw,
  Search,
  Server,
  WifiOff,
} from "lucide-react-native";

import StatusPill from "../../components/StatusPill";
import {
  fetchEndpointDevices,
  type EndpointDeviceStatusFilter,
  type MobileEndpointDevice,
} from "../../services/opsMobileService";
import { colors } from "../../theme/colors";
import { formatNumber } from "../../utils/formatters";

const PAGE_SIZE = 10;
const DEVICE_FETCH_LIMIT = 500;

const titleMap: Record<EndpointDeviceStatusFilter, { title: string; subtitle: string; tone: string; icon: any }> = {
  all: {
    title: "Managed Endpoints",
    subtitle: "Live endpoint list from hardware inventory.",
    tone: colors.blue,
    icon: Server,
  },
  online: {
    title: "Online Devices",
    subtitle: "Devices currently reporting as online.",
    tone: colors.green,
    icon: CheckCircle2,
  },
  offline: {
    title: "Offline Devices",
    subtitle: "Devices currently not reporting or disconnected.",
    tone: colors.red,
    icon: WifiOff,
  },
  stale: {
    title: "Stale Devices",
    subtitle: "Devices with old telemetry based on latest connection time.",
    tone: colors.amber,
    icon: Clock3,
  },
};

const filterOptions: { key: EndpointDeviceStatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "online", label: "Online" },
  { key: "offline", label: "Offline" },
  { key: "stale", label: "Stale" },
];

function resolveFilter(value: unknown): EndpointDeviceStatusFilter {
  const text = String(value || "all").toLowerCase();
  if (text === "online" || text === "today") return "online";
  if (text === "offline") return "offline";
  if (text === "stale") return "stale";
  return "all";
}

function matchesStatus(record: MobileEndpointDevice, filter: EndpointDeviceStatusFilter) {
  if (filter === "online") return record.isOnline;
  if (filter === "offline") return !record.isOnline;
  if (filter === "stale") return record.isStale;
  return true;
}

function matchesSearch(record: MobileEndpointDevice, query: string) {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return true;

  return [
    record.deviceName,
    record.deviceId,
    record.branch,
    record.status,
    record.platform,
    record.model,
    record.ipAddress,
    record.source,
  ]
    .join(" ")
    .toLowerCase()
    .includes(keyword);
}

export default function ActiveDeviceListScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const initialFilter = resolveFilter(route.params?.status || route.params?.filter);

  const [records, setRecords] = useState<MobileEndpointDevice[]>([]);
  const [activeFilter, setActiveFilter] = useState<EndpointDeviceStatusFilter>(initialFilter);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const config = titleMap[activeFilter];
  const Icon = config.icon;

  const onlineCount = useMemo(() => records.filter((item) => item.isOnline).length, [records]);
  const staleCount = useMemo(() => records.filter((item) => item.isStale).length, [records]);
  const offlineCount = useMemo(() => records.filter((item) => !item.isOnline).length, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => matchesStatus(record, activeFilter) && matchesSearch(record, searchText));
  }, [activeFilter, records, searchText]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = filteredRecords.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const pageEnd = Math.min(safePage * PAGE_SIZE, filteredRecords.length);

  const visibleRecords = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredRecords.slice(start, start + PAGE_SIZE);
  }, [filteredRecords, safePage]);

  const loadDevices = useCallback(async (force = false) => {
    if (force) setRefreshing(true);
    else setLoading(true);

    try {
      const liveDevices = await fetchEndpointDevices({ status: "all", limit: DEVICE_FETCH_LIMIT, force });
      setRecords(liveDevices);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err || "Failed to load endpoint devices."));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDevices(false);
  }, [loadDevices]);

  useEffect(() => {
    setPage(1);
  }, [activeFilter, searchText]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  function openDevice(record: MobileEndpointDevice) {
    navigation.navigate("DeviceQuickView", {
      device: record.deviceName,
      site: record.branch,
      status: record.isStale ? "Stale" : record.status,
      lastSeen: record.lastSeen,
      risk: record.isOnline && !record.isStale ? "Low" : record.isStale ? "Medium" : "High",
      category: config.title,
      action: `Source: ${record.source} · ${record.platform} · ${record.model} · IP ${record.ipAddress}`,
    });
  }

  function changeFilter(nextFilter: EndpointDeviceStatusFilter) {
    setActiveFilter(nextFilter);
  }

  function goPrevious() {
    setPage((current) => Math.max(1, current - 1));
  }

  function goNext() {
    setPage((current) => Math.min(totalPages, current + 1));
  }

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 18 }]}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadDevices(true)} />}
    >
      <View style={styles.headerRow}>
        <View style={styles.headerTextWrap}>
          <Text style={styles.eyebrow}>ENDPOINT MANAGEMENT</Text>
          <Text style={styles.title}>{config.title}</Text>
          <Text style={styles.subtitle}>{config.subtitle}</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} activeOpacity={0.85} onPress={() => loadDevices(true)}>
          {loading || refreshing ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <RefreshCcw size={18} color={colors.white} strokeWidth={2.8} />
          )}
        </TouchableOpacity>
      </View>

      <View style={[styles.heroCard, { borderColor: `${config.tone}30` }]}> 
        <View style={[styles.heroIcon, { backgroundColor: config.tone }]}> 
          <Icon size={24} color={colors.white} strokeWidth={2.8} />
        </View>
        <View style={styles.heroCopy}>
          <Text style={styles.heroLabel}>Live device records</Text>
          <Text style={styles.heroValue}>{formatNumber(filteredRecords.length)}</Text>
          <Text style={styles.heroText}>Filtered from {formatNumber(records.length)} hardware inventory assets</Text>
        </View>
      </View>

      {error ? (
        <View style={styles.errorCard}>
          <AlertTriangle size={18} color={colors.red} strokeWidth={2.8} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.summaryRow}>
        <MiniStat label="Online" value={onlineCount} color={colors.green} />
        <MiniStat label="Offline" value={offlineCount} color={colors.red} />
        <MiniStat label="Stale" value={staleCount} color={colors.amber} />
      </View>

      <View style={styles.filterPanel}>
        <View style={styles.searchBox}>
          <Search size={16} color={colors.muted} strokeWidth={2.7} />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search device, branch, model, IP..."
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.searchInput}
          />
          {searchText ? (
            <TouchableOpacity onPress={() => setSearchText("")} activeOpacity={0.75}>
              <Text style={styles.clearSearch}>Clear</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.filterChipRow}>
          {filterOptions.map((item) => {
            const selected = item.key === activeFilter;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.filterChip, selected && { backgroundColor: titleMap[item.key].tone, borderColor: titleMap[item.key].tone }]}
                activeOpacity={0.82}
                onPress={() => changeFilter(item.key)}
              >
                <Text style={[styles.filterChipText, selected && styles.filterChipTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.listPanel}>
        <View style={styles.listToolbar}>
          <View>
            <Text style={styles.listTitle}>Device Records</Text>
            <Text style={styles.listMeta}>
              Showing {formatNumber(pageStart)}-{formatNumber(pageEnd)} of {formatNumber(filteredRecords.length)}
            </Text>
          </View>
          <Text style={styles.pageBadge}>Page {safePage}/{totalPages}</Text>
        </View>

        {loading && records.length === 0 ? (
          <View style={styles.loadingBlock}>
            <ActivityIndicator size="small" color={config.tone} />
            <Text style={styles.loadingText}>Loading live devices...</Text>
          </View>
        ) : filteredRecords.length === 0 ? (
          <View style={styles.emptyBlock}>
            <MonitorCog size={22} color={colors.muted} strokeWidth={2.7} />
            <Text style={styles.emptyTitle}>No device records found</Text>
            <Text style={styles.emptyText}>No live endpoint matched this filter.</Text>
          </View>
        ) : (
          visibleRecords.map((record, index) => (
            <TouchableOpacity
              key={record.id}
              style={[styles.deviceRow, index === visibleRecords.length - 1 && styles.rowLast]}
              activeOpacity={0.85}
              onPress={() => openDevice(record)}
            >
              <View style={[styles.deviceIcon, { backgroundColor: record.isOnline ? "#EAFBF4" : "#FFF1F1" }]}> 
                {record.isOnline ? (
                  <CheckCircle2 size={18} color={colors.green} strokeWidth={2.7} />
                ) : (
                  <WifiOff size={18} color={colors.red} strokeWidth={2.7} />
                )}
              </View>

              <View style={styles.deviceTextWrap}>
                <View style={styles.nameRow}>
                  <Text style={styles.deviceName} numberOfLines={1}>{record.deviceName}</Text>
                  <StatusPill
                    label={record.isStale ? "Stale" : record.status}
                    tone={record.isOnline && !record.isStale ? "green" : record.isStale ? "amber" : "red"}
                  />
                </View>

                <View style={styles.metaRow}>
                  <MapPin size={12} color={colors.muted} strokeWidth={2.6} />
                  <Text style={styles.deviceMeta} numberOfLines={1}>{record.branch}</Text>
                </View>

                <View style={styles.metaRow}>
                  <Clock3 size={12} color={colors.muted} strokeWidth={2.6} />
                  <Text style={styles.lastSeen} numberOfLines={1}>Last seen: {record.lastSeen}</Text>
                </View>

                <Text style={styles.deviceTechnical} numberOfLines={1}>
                  {record.platform} · {record.model} · {record.ipAddress}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}

        <View style={styles.paginationBar}>
          <TouchableOpacity
            style={[styles.pageButton, safePage <= 1 && styles.pageButtonDisabled]}
            activeOpacity={0.82}
            disabled={safePage <= 1}
            onPress={goPrevious}
          >
            <ChevronLeft size={16} color={safePage <= 1 ? colors.muted : colors.text} strokeWidth={2.8} />
            <Text style={[styles.pageButtonText, safePage <= 1 && styles.pageButtonTextDisabled]}>Previous</Text>
          </TouchableOpacity>

          <Text style={styles.paginationText}>{PAGE_SIZE} per page</Text>

          <TouchableOpacity
            style={[styles.pageButton, safePage >= totalPages && styles.pageButtonDisabled]}
            activeOpacity={0.82}
            disabled={safePage >= totalPages}
            onPress={goNext}
          >
            <Text style={[styles.pageButtonText, safePage >= totalPages && styles.pageButtonTextDisabled]}>Next</Text>
            <ChevronRight size={16} color={safePage >= totalPages ? colors.muted : colors.text} strokeWidth={2.8} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.miniStat}>
      <Text style={[styles.miniValue, { color }]}>{formatNumber(value)}</Text>
      <Text style={styles.miniLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 18, paddingBottom: 116 },
  headerRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 },
  headerTextWrap: { flex: 1, paddingRight: 14 },
  eyebrow: { color: colors.blue, fontSize: 10, fontWeight: "900", letterSpacing: 1.2, marginBottom: 5 },
  title: { color: colors.text, fontSize: 27, fontWeight: "900", letterSpacing: -0.9 },
  subtitle: { color: colors.textSoft, fontSize: 12, fontWeight: "700", lineHeight: 17, marginTop: 5 },
  refreshButton: { width: 42, height: 42, borderRadius: 16, backgroundColor: colors.navy, alignItems: "center", justifyContent: "center" },
  heroCard: { backgroundColor: colors.white, borderWidth: 1, borderRadius: 24, padding: 16, flexDirection: "row", alignItems: "center", marginBottom: 12, shadowColor: colors.navy, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.06, shadowRadius: 16, elevation: 2 },
  heroIcon: { width: 54, height: 54, borderRadius: 20, alignItems: "center", justifyContent: "center", marginRight: 14 },
  heroCopy: { flex: 1 },
  heroLabel: { color: colors.textSoft, fontSize: 11, fontWeight: "800" },
  heroValue: { color: colors.text, fontSize: 34, fontWeight: "900", letterSpacing: -1, marginTop: 2 },
  heroText: { color: colors.muted, fontSize: 10.5, fontWeight: "700", marginTop: 2 },
  errorCard: { marginBottom: 12, padding: 13, borderRadius: 18, backgroundColor: "#FFF5F5", borderWidth: 1, borderColor: "#FAD0D0", flexDirection: "row", alignItems: "center", gap: 9 },
  errorText: { flex: 1, color: colors.textSoft, fontSize: 11, fontWeight: "700" },
  summaryRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  miniStat: { flex: 1, backgroundColor: colors.white, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 12 },
  miniValue: { fontSize: 22, fontWeight: "900", letterSpacing: -0.7 },
  miniLabel: { color: colors.textSoft, fontSize: 10.5, fontWeight: "800", marginTop: 2 },
  filterPanel: { backgroundColor: colors.white, borderRadius: 22, borderWidth: 1, borderColor: colors.border, padding: 12, marginBottom: 12, shadowColor: colors.navy, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 14, elevation: 1 },
  searchBox: { minHeight: 44, borderRadius: 16, backgroundColor: colors.surfaceSoft, borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, gap: 8 },
  searchInput: { flex: 1, color: colors.text, fontSize: 12.5, fontWeight: "700", paddingVertical: 8 },
  clearSearch: { color: colors.blue, fontSize: 11, fontWeight: "900" },
  filterChipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  filterChip: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.surfaceSoft, borderWidth: 1, borderColor: colors.border },
  filterChipText: { color: colors.textSoft, fontSize: 11, fontWeight: "900" },
  filterChipTextActive: { color: colors.white },
  listPanel: { backgroundColor: colors.white, borderRadius: 24, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, shadowColor: colors.navy, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.06, shadowRadius: 16, elevation: 2 },
  listToolbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: "#EDF2F8" },
  listTitle: { color: colors.text, fontSize: 13, fontWeight: "900" },
  listMeta: { color: colors.textSoft, fontSize: 10.5, fontWeight: "700", marginTop: 2 },
  pageBadge: { color: colors.blue, fontSize: 10.5, fontWeight: "900", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: "#EEF4FF", overflow: "hidden" },
  loadingBlock: { paddingVertical: 26, alignItems: "center", gap: 9 },
  loadingText: { color: colors.textSoft, fontSize: 12, fontWeight: "800" },
  emptyBlock: { paddingVertical: 28, alignItems: "center" },
  emptyTitle: { color: colors.text, fontSize: 14, fontWeight: "900", marginTop: 8 },
  emptyText: { color: colors.textSoft, fontSize: 11, fontWeight: "700", marginTop: 4 },
  deviceRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#EDF2F8" },
  rowLast: { borderBottomWidth: 0 },
  deviceIcon: { width: 42, height: 42, borderRadius: 16, alignItems: "center", justifyContent: "center", marginRight: 12 },
  deviceTextWrap: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  deviceName: { flex: 1, color: colors.text, fontSize: 13, fontWeight: "900" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 5 },
  deviceMeta: { flex: 1, color: colors.textSoft, fontSize: 10.5, fontWeight: "700" },
  lastSeen: { color: colors.muted, fontSize: 10.5, fontWeight: "700" },
  deviceTechnical: { color: colors.muted, fontSize: 10, fontWeight: "700", marginTop: 5 },
  paginationBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, borderTopWidth: 1, borderTopColor: "#EDF2F8" },
  pageButton: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 14, backgroundColor: colors.surfaceSoft, borderWidth: 1, borderColor: colors.border },
  pageButtonDisabled: { opacity: 0.45 },
  pageButtonText: { color: colors.text, fontSize: 11, fontWeight: "900" },
  pageButtonTextDisabled: { color: colors.muted },
  paginationText: { color: colors.textSoft, fontSize: 10.5, fontWeight: "800" },
});
