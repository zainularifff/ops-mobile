import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  MapPin,
  RefreshCcw,
  Server,
  Ticket,
  WifiOff,
} from "lucide-react-native";

import { useMobileOpsSnapshot } from "../../hooks/useLiveOpsData";
import { colors } from "../../theme/colors";
import { formatNumber } from "../../utils/formatters";

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
  amber: "#D48A1C",
  red: "#D84D4D",
  cyan: "#0E8FA6",
};

export default function OperatorScreen() {
  const insets = useSafeAreaInsets();
  const { snapshot, loading, refreshing, error, reloadSnapshot } = useMobileOpsSnapshot();
  const locations = snapshot.locations;
  const issueCount = snapshot.endpoints.offline + snapshot.endpoints.stale + snapshot.tickets.slaExceeded;

  function handleRefresh() {
    reloadSnapshot({ silent: true });
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView
        style={styles.page}
        contentContainerStyle={[styles.container, { paddingBottom: Math.max(insets.bottom, 20) + 108 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <LinearGradient
          colors={[ui.navy, ui.navy2, "#15325F"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerOrb} />
          <View style={styles.headerTopRow}>
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>LIVE OPERATOR</Text>
              <Text style={styles.title}>Field Control</Text>
              <Text style={styles.subtitle}>Endpoint state, ticket exposure and latest device location.</Text>
            </View>
            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh} activeOpacity={0.85}>
              {loading || refreshing ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <RefreshCcw size={18} color={colors.white} strokeWidth={2.8} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.attentionCard}>
            <View>
              <Text style={styles.attentionLabel}>Attention Queue</Text>
              <Text style={styles.attentionValue}>{formatNumber(issueCount)}</Text>
            </View>
            <View style={styles.attentionBreakdown}>
              <Text style={styles.attentionBreakdownText}>{formatNumber(snapshot.endpoints.offline)} offline</Text>
              <Text style={styles.attentionBreakdownText}>{formatNumber(snapshot.endpoints.stale)} stale</Text>
              <Text style={styles.attentionBreakdownText}>{formatNumber(snapshot.tickets.slaExceeded)} SLA exceed</Text>
            </View>
          </View>
        </LinearGradient>

        {error ? (
          <View style={styles.errorCard}>
            <AlertTriangle size={18} color={ui.red} strokeWidth={2.8} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.statusPanel}>
          <View style={styles.panelHeader}>
            <View>
              <Text style={styles.panelTitle}>Endpoint Fleet</Text>
              <Text style={styles.panelSubtitle}>Operational status summary</Text>
            </View>
            <Server size={26} color={ui.blue} strokeWidth={2.8} />
          </View>

          <View style={styles.statusGrid}>
            <StatusChip label="Total" value={snapshot.endpoints.total} color={ui.blue} icon={Server} />
            <StatusChip label="Online" value={snapshot.endpoints.online} color={ui.green} icon={CheckCircle2} />
            <StatusChip label="Offline" value={snapshot.endpoints.offline} color={ui.red} icon={WifiOff} />
            <StatusChip label="Stale" value={snapshot.endpoints.stale} color={ui.amber} icon={AlertTriangle} />
          </View>
        </View>

        <View style={styles.ticketRow}>
          <TicketBox label="Total Tickets" value={snapshot.tickets.total} tone={ui.blue} />
          <TicketBox label="Open" value={snapshot.tickets.open} tone={ui.amber} />
          <TicketBox label="Closed" value={snapshot.tickets.closed} tone={ui.green} />
          <TicketBox label="SLA Exceed" value={snapshot.tickets.slaExceeded} tone={ui.red} />
        </View>

        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <View style={styles.locationTitleWrap}>
              <Text style={styles.cardTitle}>Device Geolocation</Text>
              <Text style={styles.cardSubtitle}>
                Showing latest one location record per device · {formatNumber(snapshot.locationTotal)} devices
              </Text>
            </View>
            <View style={styles.locationBadge}>
              <MapPin size={16} color={ui.cyan} strokeWidth={2.8} />
              <Text style={styles.locationBadgeText}>Latest</Text>
            </View>
          </View>

          {locations.length === 0 ? (
            <Text style={styles.emptyText}>No geolocation record found.</Text>
          ) : (
            locations.map((item, index) => (
              <TouchableOpacity key={item.id} activeOpacity={0.86} style={[styles.deviceRow, index === locations.length - 1 && styles.noBorder]}>
                <View style={styles.deviceMapIcon}>
                  <MapPin size={16} color={ui.cyan} strokeWidth={2.8} />
                </View>
                <View style={styles.deviceInfo}>
                  <View style={styles.deviceTopRow}>
                    <Text style={styles.deviceName} numberOfLines={1}>{item.deviceName}</Text>
                    <Text style={styles.deviceTime}>{item.time}</Text>
                  </View>
                  <Text style={styles.deviceAddress} numberOfLines={1}>{item.address}</Text>
                  <Text style={styles.deviceMeta} numberOfLines={1}>{item.username} · {item.model} · {item.latitude}, {item.longitude}</Text>
                </View>
                <ArrowRight size={15} color={ui.muted} strokeWidth={2.8} />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusChip({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon: any }) {
  return (
    <View style={styles.statusChip}>
      <View style={[styles.statusIcon, { backgroundColor: `${color}16` }]}>
        <Icon size={15} color={color} strokeWidth={2.8} />
      </View>
      <Text style={styles.statusValue}>{formatNumber(value)}</Text>
      <Text style={styles.statusLabel}>{label}</Text>
    </View>
  );
}

function TicketBox({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <View style={styles.ticketBox}>
      <Ticket size={16} color={tone} strokeWidth={2.8} />
      <Text style={styles.ticketValue}>{formatNumber(value)}</Text>
      <Text style={styles.ticketLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: ui.navy },
  page: { flex: 1, backgroundColor: ui.bg },
  container: { padding: 16 },
  header: {
    marginHorizontal: -16,
    marginTop: -16,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 26,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    overflow: "hidden",
  },
  headerOrb: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 190,
    backgroundColor: "rgba(47,98,216,0.42)",
    top: -92,
    right: -76,
  },
  headerTopRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  headerCopy: { flex: 1, paddingRight: 14 },
  eyebrow: { color: "#9DC2FF", fontSize: 11, fontWeight: "900", letterSpacing: 1.2 },
  title: { color: "#FFFFFF", fontSize: 30, fontWeight: "900", marginTop: 6, letterSpacing: -1.1 },
  subtitle: { color: "#B5C7DE", fontSize: 11, fontWeight: "700", lineHeight: 16, marginTop: 7, maxWidth: 280 },
  refreshButton: { width: 42, height: 42, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)" },
  attentionCard: { marginTop: 24, padding: 16, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.11)", borderWidth: 1, borderColor: "rgba(255,255,255,0.16)", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  attentionLabel: { color: "#D8E7FF", fontSize: 11, fontWeight: "800" },
  attentionValue: { color: "#FFFFFF", fontSize: 44, fontWeight: "900", letterSpacing: -1.5, marginTop: 3 },
  attentionBreakdown: { alignItems: "flex-end", gap: 5, marginTop: 3 },
  attentionBreakdownText: { color: "#B5C7DE", fontSize: 10.5, fontWeight: "900" },
  errorCard: { marginTop: 14, padding: 13, borderRadius: 18, backgroundColor: "#FFF5F5", borderWidth: 1, borderColor: "#FAD0D0", flexDirection: "row", alignItems: "center", gap: 9 },
  errorText: { flex: 1, color: ui.soft, fontSize: 11, fontWeight: "700" },
  statusPanel: { marginTop: -16, backgroundColor: ui.card, borderRadius: 26, borderWidth: 1, borderColor: ui.line, padding: 15, shadowColor: "#4F6078", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 2 },
  panelHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  panelTitle: { color: ui.ink, fontSize: 17, fontWeight: "900", letterSpacing: -0.3 },
  panelSubtitle: { color: ui.soft, fontSize: 11, fontWeight: "700", marginTop: 4 },
  statusGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statusChip: { width: "47.9%", backgroundColor: "#F8FBFF", borderWidth: 1, borderColor: "#E5EEF8", borderRadius: 18, padding: 12 },
  statusIcon: { width: 32, height: 32, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  statusValue: { color: ui.ink, fontSize: 24, fontWeight: "900", marginTop: 8, letterSpacing: -0.7 },
  statusLabel: { color: ui.soft, fontSize: 10.5, fontWeight: "800", marginTop: 2 },
  ticketRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 14 },
  ticketBox: { width: "47.9%", backgroundColor: ui.card, borderRadius: 20, borderWidth: 1, borderColor: ui.line, padding: 13, shadowColor: "#4F6078", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 14, elevation: 1 },
  ticketValue: { color: ui.ink, fontSize: 25, fontWeight: "900", marginTop: 7, letterSpacing: -0.8 },
  ticketLabel: { color: ui.soft, fontSize: 10.5, fontWeight: "800", marginTop: 2 },
  locationCard: { marginTop: 14, backgroundColor: ui.card, borderRadius: 26, borderWidth: 1, borderColor: ui.line, padding: 15, shadowColor: "#4F6078", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 2 },
  locationHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 9 },
  locationTitleWrap: { flex: 1, paddingRight: 10 },
  cardTitle: { color: ui.ink, fontSize: 17, fontWeight: "900", letterSpacing: -0.3 },
  cardSubtitle: { color: ui.soft, fontSize: 10.5, fontWeight: "700", marginTop: 4, lineHeight: 15 },
  locationBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999, backgroundColor: "#E6F7FB" },
  locationBadgeText: { color: ui.cyan, fontSize: 10, fontWeight: "900" },
  deviceRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#EDF2F8" },
  noBorder: { borderBottomWidth: 0 },
  deviceMapIcon: { width: 38, height: 38, borderRadius: 14, backgroundColor: "#E6F7FB", alignItems: "center", justifyContent: "center", marginRight: 11 },
  deviceInfo: { flex: 1, paddingRight: 8 },
  deviceTopRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  deviceName: { flex: 1, color: ui.ink, fontSize: 12.5, fontWeight: "900" },
  deviceTime: { color: ui.muted, fontSize: 9, fontWeight: "800" },
  deviceAddress: { color: ui.soft, fontSize: 10.5, fontWeight: "700", marginTop: 3 },
  deviceMeta: { color: ui.muted, fontSize: 10, fontWeight: "700", marginTop: 3 },
  emptyText: { color: ui.soft, fontSize: 11, fontWeight: "700", paddingVertical: 8 },
});
