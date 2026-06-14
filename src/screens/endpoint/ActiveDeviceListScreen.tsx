import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  MapPin,
  MonitorCog,
  RefreshCcw,
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

function resolveFilter(value: unknown): EndpointDeviceStatusFilter {
  const text = String(value || "all").toLowerCase();
  if (text === "online" || text === "today") return "online";
  if (text === "offline") return "offline";
  if (text === "stale") return "stale";
  return "all";
}

export default function ActiveDeviceListScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const filter = resolveFilter(route.params?.status || route.params?.filter);
  const config = titleMap[filter];
  const Icon = config.icon;

  const [records, setRecords] = useState<MobileEndpointDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const onlineCount = useMemo(() => records.filter((item) => item.isOnline).length, [records]);
  const staleCount = useMemo(() => records.filter((item) => item.isStale).length, [records]);

  const loadDevices = useCallback(async (force = false) => {
    if (force) setRefreshing(true);
    else setLoading(true);

    try {
      const liveDevices = await fetchEndpointDevices({ status: filter, limit: 300, force });
      setRecords(liveDevices);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err || "Failed to load endpoint devices."));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useEffect(() => {
    loadDevices(false);
  }, [loadDevices]);

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
          <Text style={styles.heroValue}>{formatNumber(records.length)}</Text>
          <Text style={styles.heroText}>Data source: hardware inventory assets</Text>
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
        <MiniStat label="Offline" value={Math.max(records.length - onlineCount, 0)} color={colors.red} />
        <MiniStat label="Stale" value={staleCount} color={colors.amber} />
      </View>

      <View style={styles.listPanel}>
        {loading && records.length === 0 ? (
          <View style={styles.loadingBlock}>
            <ActivityIndicator size="small" color={config.tone} />
            <Text style={styles.loadingText}>Loading live devices...</Text>
          </View>
        ) : records.length === 0 ? (
          <View style={styles.emptyBlock}>
            <MonitorCog size={22} color={colors.muted} strokeWidth={2.7} />
            <Text style={styles.emptyTitle}>No device records found</Text>
            <Text style={styles.emptyText}>No live endpoint matched this filter.</Text>
          </View>
        ) : (
          records.map((record, index) => (
            <TouchableOpacity
              key={record.id}
              style={[styles.deviceRow, index === records.length - 1 && styles.rowLast]}
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
  listPanel: { backgroundColor: colors.white, borderRadius: 24, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, shadowColor: colors.navy, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.06, shadowRadius: 16, elevation: 2 },
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
});
