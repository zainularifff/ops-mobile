import React from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlertTriangle, CheckCircle2, MapPin, RefreshCcw, Server, Ticket, WifiOff } from "lucide-react-native";

import { useMobileOpsSnapshot } from "../../hooks/useLiveOpsData";
import { colors } from "../../theme/colors";
import { formatNumber } from "../../utils/formatters";

const ui = {
  bg: "#EEF3FA",
  card: "#FFFFFF",
  ink: "#0B1220",
  soft: "#53657C",
  muted: "#8795A7",
  line: "#DDE7F3",
  navy: "#07111F",
  blue: "#2357D5",
  green: "#179C65",
  amber: "#D48619",
  red: "#D94444",
  cyan: "#0E8FA6",
};

export default function OperatorScreen() {
  const { snapshot, loading, refreshing, error, reloadSnapshot } = useMobileOpsSnapshot();
  const locations = snapshot.locations;

  function handleRefresh() {
    reloadSnapshot({ silent: true });
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>LIVE OPERATOR</Text>
            <Text style={styles.title}>Operator View</Text>
            <Text style={styles.subtitle}>Endpoint, ticket and device location checks only.</Text>
          </View>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh} activeOpacity={0.85}>
            {loading || refreshing ? <ActivityIndicator size="small" color={colors.white} /> : <RefreshCcw size={18} color={colors.white} strokeWidth={2.8} />}
          </TouchableOpacity>
        </View>

        {error ? (
          <View style={styles.errorCard}>
            <AlertTriangle size={18} color={ui.red} strokeWidth={2.8} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.summaryLabel}>Endpoint Status</Text>
              <Text style={styles.summaryValue}>{formatNumber(snapshot.endpoints.total)}</Text>
            </View>
            <Server size={30} color={ui.blue} strokeWidth={2.8} />
          </View>
          <View style={styles.statusRow}>
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
            <View>
              <Text style={styles.cardTitle}>Device Geolocation</Text>
              <Text style={styles.cardSubtitle}>Latest one record per device · {formatNumber(snapshot.locationTotal)} devices</Text>
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
              <View key={item.id} style={[styles.deviceRow, index === locations.length - 1 && styles.noBorder]}>
                <View style={styles.deviceMapIcon}><MapPin size={16} color={ui.cyan} strokeWidth={2.8} /></View>
                <View style={styles.deviceInfo}>
                  <View style={styles.deviceTopRow}>
                    <Text style={styles.deviceName} numberOfLines={1}>{item.deviceName}</Text>
                    <Text style={styles.deviceTime}>{item.time}</Text>
                  </View>
                  <Text style={styles.deviceAddress} numberOfLines={1}>{item.address}</Text>
                  <Text style={styles.deviceMeta} numberOfLines={1}>{item.username} · {item.model} · {item.latitude}, {item.longitude}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusChip({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon: any }) {
  return <View style={styles.statusChip}><View style={[styles.statusIcon, { backgroundColor: `${color}16` }]}><Icon size={15} color={color} strokeWidth={2.8} /></View><Text style={styles.statusValue}>{formatNumber(value)}</Text><Text style={styles.statusLabel}>{label}</Text></View>;
}

function TicketBox({ label, value, tone }: { label: string; value: number; tone: string }) {
  return <View style={styles.ticketBox}><Ticket size={16} color={tone} strokeWidth={2.8} /><Text style={styles.ticketValue}>{formatNumber(value)}</Text><Text style={styles.ticketLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: ui.navy },
  page: { flex: 1, backgroundColor: ui.bg },
  container: { padding: 16, paddingBottom: 108 },
  header: { marginHorizontal: -16, marginTop: -16, paddingHorizontal: 20, paddingTop: 18, paddingBottom: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, backgroundColor: ui.navy, flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  eyebrow: { color: "#9DC2FF", fontSize: 11, fontWeight: "900", letterSpacing: 1.1 },
  title: { color: "#FFFFFF", fontSize: 25, fontWeight: "900", marginTop: 6, letterSpacing: -0.8 },
  subtitle: { color: "#B5C7DE", fontSize: 11, fontWeight: "700", lineHeight: 16, marginTop: 6, maxWidth: 270 },
  refreshButton: { width: 42, height: 42, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)" },
  errorCard: { marginTop: 14, padding: 13, borderRadius: 18, backgroundColor: "#FFF5F5", borderWidth: 1, borderColor: "#FAD0D0", flexDirection: "row", alignItems: "center", gap: 9 },
  errorText: { flex: 1, color: ui.soft, fontSize: 11, fontWeight: "700" },
  summaryCard: { marginTop: 14, backgroundColor: ui.card, borderRadius: 22, borderWidth: 1, borderColor: ui.line, padding: 15 },
  summaryTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  summaryLabel: { color: ui.soft, fontSize: 11, fontWeight: "800" },
  summaryValue: { color: ui.ink, fontSize: 34, fontWeight: "900", letterSpacing: -1, marginTop: 3 },
  statusRow: { flexDirection: "row", gap: 9 },
  statusChip: { flex: 1, backgroundColor: "#F8FBFF", borderWidth: 1, borderColor: "#E5EEF8", borderRadius: 17, padding: 11 },
  statusIcon: { width: 30, height: 30, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  statusValue: { color: ui.ink, fontSize: 20, fontWeight: "900", marginTop: 8 },
  statusLabel: { color: ui.soft, fontSize: 10, fontWeight: "800", marginTop: 2 },
  ticketRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 14 },
  ticketBox: { width: "47.9%", backgroundColor: ui.card, borderRadius: 18, borderWidth: 1, borderColor: ui.line, padding: 13 },
  ticketValue: { color: ui.ink, fontSize: 25, fontWeight: "900", marginTop: 7 },
  ticketLabel: { color: ui.soft, fontSize: 10.5, fontWeight: "800", marginTop: 2 },
  locationCard: { marginTop: 14, backgroundColor: ui.card, borderRadius: 22, borderWidth: 1, borderColor: ui.line, padding: 15 },
  locationHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 9 },
  cardTitle: { color: ui.ink, fontSize: 15, fontWeight: "900", letterSpacing: -0.25 },
  cardSubtitle: { color: ui.soft, fontSize: 10.5, fontWeight: "700", marginTop: 4 },
  locationBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999, backgroundColor: "#E6F7FB" },
  locationBadgeText: { color: ui.cyan, fontSize: 10, fontWeight: "900" },
  deviceRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#EDF2F8" },
  noBorder: { borderBottomWidth: 0 },
  deviceMapIcon: { width: 38, height: 38, borderRadius: 14, backgroundColor: "#E6F7FB", alignItems: "center", justifyContent: "center", marginRight: 11 },
  deviceInfo: { flex: 1 },
  deviceTopRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  deviceName: { flex: 1, color: ui.ink, fontSize: 12.5, fontWeight: "900" },
  deviceTime: { color: ui.muted, fontSize: 9, fontWeight: "800" },
  deviceAddress: { color: ui.soft, fontSize: 10.5, fontWeight: "700", marginTop: 3 },
  deviceMeta: { color: ui.muted, fontSize: 10, fontWeight: "700", marginTop: 3 },
  emptyText: { color: ui.soft, fontSize: 11, fontWeight: "700", paddingVertical: 8 },
});
