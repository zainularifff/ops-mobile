import React, { useMemo } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AlertTriangle, ArrowRight, CheckCircle2, FileText, MapPin, RefreshCcw, Server, ShieldCheck, Ticket, WifiOff } from "lucide-react-native";

import { useMobileOpsSnapshot } from "../../hooks/useLiveOpsData";
import { formatNumber } from "../../utils/formatters";

const c = {
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
  purple: "#7857D9",
  cyan: "#0E8FA6",
};

export default function OverviewHomeScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { snapshot, loading, refreshing, error, reloadSnapshot } = useMobileOpsSnapshot();

  const onlineRate = useMemo(() => {
    if (!snapshot.endpoints.total) return 0;
    return Math.round((snapshot.endpoints.online / snapshot.endpoints.total) * 100);
  }, [snapshot.endpoints.online, snapshot.endpoints.total]);

  const attention = snapshot.endpoints.offline + snapshot.endpoints.stale + snapshot.tickets.slaExceeded;

  const openEndpointList = (status: "all" | "online" | "offline" | "stale") => {
    navigation.navigate("ActiveDeviceList", { status });
  };

  const openTab = (name: string) => navigation.getParent()?.navigate(name);
  const refresh = () => reloadSnapshot({ silent: true });

  return (
    <View style={styles.page}>
      <View style={{ height: insets.top, backgroundColor: c.navy }} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) + 104 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        <LinearGradient colors={[c.navy, c.navy2, "#15325F"]} style={styles.hero}>
          <View style={styles.orb} />
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.eyebrow}>IT OPERATOR</Text>
              <Text style={styles.title}>Command Center</Text>
              <Text style={styles.meta}>Live data · {snapshot.generatedAt}</Text>
            </View>
            <TouchableOpacity style={styles.refreshBtn} onPress={refresh} activeOpacity={0.85}>
              {loading || refreshing ? <ActivityIndicator size="small" color="#FFFFFF" /> : <RefreshCcw size={18} color="#FFFFFF" strokeWidth={2.8} />}
            </TouchableOpacity>
          </View>

          <View style={styles.glassCard}>
            <View>
              <Text style={styles.glassLabel}>Needs Attention</Text>
              <Text style={styles.glassValue}>{formatNumber(attention)}</Text>
              <Text style={styles.glassHint}>Offline + stale endpoints + SLA exceed</Text>
            </View>
            <View style={styles.onlinePill}>
              <CheckCircle2 size={15} color="#B7F7DD" strokeWidth={2.8} />
              <Text style={styles.onlinePillText}>{onlineRate}% online</Text>
            </View>
          </View>
        </LinearGradient>

        {error ? (
          <View style={styles.errorCard}>
            <AlertTriangle size={18} color={c.red} strokeWidth={2.8} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.quickRow}>
          <QuickCard title="Operator" subtitle="Device and location" icon={ShieldCheck} color={c.blue} onPress={() => openTab("Operator")} />
          <QuickCard title="Reports" subtitle="Report center" icon={FileText} color={c.purple} onPress={() => openTab("Reports")} />
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Endpoint Fleet</Text>
          <Text style={styles.panelSub}>Tap to open live device records</Text>
          <View style={styles.grid}>
            <MetricCard title="Managed Endpoints" caption="Open all devices" value={snapshot.endpoints.total} color={c.blue} icon={Server} onPress={() => openEndpointList("all")} />
            <MetricCard title="Online Devices" caption="Open online devices" value={snapshot.endpoints.online} color={c.green} icon={CheckCircle2} onPress={() => openEndpointList("online")} />
            <MetricCard title="Offline Devices" caption="Open not reporting" value={snapshot.endpoints.offline} color={c.red} icon={WifiOff} onPress={() => openEndpointList("offline")} />
            <MetricCard title="Stale Devices" caption="Open stale telemetry" value={snapshot.endpoints.stale} color={c.amber} icon={AlertTriangle} onPress={() => openEndpointList("stale")} />
          </View>
        </View>

        <TouchableOpacity style={styles.serviceCard} activeOpacity={0.88} onPress={() => navigation.navigate("TicketSummary")}>
          <View style={styles.serviceHead}>
            <View style={styles.serviceIcon}><Ticket size={20} color="#FFFFFF" strokeWidth={2.8} /></View>
            <View style={styles.flex}><Text style={styles.serviceTitle}>Service Desk</Text><Text style={styles.serviceSub}>Ticket workload and SLA exposure</Text></View>
            <ArrowRight size={18} color={c.muted} strokeWidth={2.8} />
          </View>
          <View style={styles.ticketRow}>
            <TicketMini label="Total" value={snapshot.tickets.total} />
            <TicketMini label="Open" value={snapshot.tickets.open} />
            <TicketMini label="Closed" value={snapshot.tickets.closed} />
            <TicketMini label="SLA Exceed" value={snapshot.tickets.slaExceeded} danger />
          </View>
        </TouchableOpacity>

        <View style={styles.bottomRow}>
          <InfoCard title="Device Geolocation" text="Latest location per device is in Operator view." value={`${formatNumber(snapshot.locationTotal)} devices`} icon={MapPin} color={c.cyan} onPress={() => openTab("Operator")} />
          <InfoCard title="Latest Report" text={snapshot.latestReport?.title || "No report item found."} value="Open Reports" icon={FileText} color={c.purple} onPress={() => openTab("Reports")} />
        </View>
      </ScrollView>
    </View>
  );
}

function QuickCard({ title, subtitle, icon: Icon, color, onPress }: any) {
  return <TouchableOpacity style={styles.quickCard} onPress={onPress} activeOpacity={0.86}><View style={[styles.quickIcon, { backgroundColor: `${color}18` }]}><Icon size={18} color={color} strokeWidth={2.8} /></View><Text style={styles.quickTitle}>{title}</Text><Text style={styles.quickSub}>{subtitle}</Text></TouchableOpacity>;
}

function MetricCard({ title, caption, value, color, icon: Icon, onPress }: any) {
  return <TouchableOpacity style={styles.metricCard} onPress={onPress} activeOpacity={0.86}><View style={styles.metricTop}><View style={[styles.metricIcon, { backgroundColor: `${color}16` }]}><Icon size={18} color={color} strokeWidth={2.8} /></View><ArrowRight size={15} color={c.muted} strokeWidth={2.8} /></View><Text style={styles.metricValue}>{formatNumber(value)}</Text><Text style={styles.metricTitle}>{title}</Text><Text style={styles.metricCaption}>{caption}</Text></TouchableOpacity>;
}

function TicketMini({ label, value, danger }: any) {
  return <View style={styles.ticketMini}><Text style={[styles.ticketValue, danger && { color: c.red }]}>{formatNumber(value)}</Text><Text style={styles.ticketLabel}>{label}</Text></View>;
}

function InfoCard({ title, text, value, icon: Icon, color, onPress }: any) {
  return <TouchableOpacity style={styles.infoCard} onPress={onPress} activeOpacity={0.88}><View style={[styles.infoIcon, { backgroundColor: `${color}18` }]}><Icon size={19} color={color} strokeWidth={2.8} /></View><Text style={styles.infoTitle}>{title}</Text><Text style={styles.infoText} numberOfLines={2}>{text}</Text><Text style={[styles.infoValue, { color }]}>{value}</Text></TouchableOpacity>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: c.bg },
  scroll: { flex: 1 },
  hero: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 28, borderBottomLeftRadius: 34, borderBottomRightRadius: 34, overflow: "hidden" },
  orb: { position: "absolute", width: 220, height: 220, borderRadius: 220, backgroundColor: "rgba(47,98,216,0.42)", top: -112, right: -82 },
  heroTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  eyebrow: { color: "#9DC2FF", fontSize: 11, fontWeight: "900", letterSpacing: 1.3 },
  title: { color: "#FFFFFF", fontSize: 30, fontWeight: "900", letterSpacing: -1.2, marginTop: 6 },
  meta: { color: "#B5C7DE", fontSize: 11, fontWeight: "700", marginTop: 8 },
  refreshBtn: { width: 42, height: 42, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.16)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)" },
  glassCard: { marginTop: 24, padding: 16, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.11)", borderWidth: 1, borderColor: "rgba(255,255,255,0.16)", flexDirection: "row", justifyContent: "space-between" },
  glassLabel: { color: "#D8E7FF", fontSize: 11, fontWeight: "800" },
  glassValue: { color: "#FFFFFF", fontSize: 44, fontWeight: "900", letterSpacing: -1.6, marginTop: 3 },
  glassHint: { color: "#9EB1CA", fontSize: 10.5, fontWeight: "700", marginTop: 2 },
  onlinePill: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 999, backgroundColor: "rgba(31,157,101,0.18)", alignSelf: "flex-start" },
  onlinePillText: { color: "#B7F7DD", fontSize: 11, fontWeight: "900" },
  errorCard: { marginHorizontal: 16, marginTop: 14, padding: 14, borderRadius: 18, backgroundColor: "#FFF5F5", borderWidth: 1, borderColor: "#FAD0D0", flexDirection: "row", alignItems: "center", gap: 9 },
  errorText: { flex: 1, color: c.soft, fontSize: 11, fontWeight: "700" },
  quickRow: { flexDirection: "row", gap: 10, paddingHorizontal: 16, marginTop: -16 },
  quickCard: { flex: 1, backgroundColor: c.card, borderRadius: 20, padding: 13, borderWidth: 1, borderColor: c.line, shadowColor: "#4F6078", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 2 },
  quickIcon: { width: 36, height: 36, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  quickTitle: { color: c.ink, fontSize: 13, fontWeight: "900" },
  quickSub: { color: c.soft, fontSize: 10, fontWeight: "700", marginTop: 3 },
  panel: { marginHorizontal: 16, marginTop: 14, backgroundColor: c.card, borderRadius: 26, padding: 15, borderWidth: 1, borderColor: c.line, shadowColor: "#4F6078", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 2 },
  panelTitle: { color: c.ink, fontSize: 17, fontWeight: "900" },
  panelSub: { color: c.soft, fontSize: 11, fontWeight: "700", marginTop: 4, marginBottom: 13 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  metricCard: { width: "47.9%", minHeight: 138, backgroundColor: "#F8FBFF", borderRadius: 20, borderWidth: 1, borderColor: "#E5EEF8", padding: 13 },
  metricTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  metricIcon: { width: 37, height: 37, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  metricValue: { color: c.ink, fontSize: 29, fontWeight: "900", letterSpacing: -1, marginTop: 12 },
  metricTitle: { color: c.ink, fontSize: 12, fontWeight: "900", marginTop: 2 },
  metricCaption: { color: c.soft, fontSize: 10.3, fontWeight: "700", lineHeight: 14, marginTop: 4 },
  serviceCard: { marginHorizontal: 16, marginTop: 14, backgroundColor: c.card, borderRadius: 26, padding: 15, borderWidth: 1, borderColor: c.line, shadowColor: "#4F6078", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 2 },
  serviceHead: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  serviceIcon: { width: 44, height: 44, borderRadius: 17, backgroundColor: c.navy2, alignItems: "center", justifyContent: "center", marginRight: 12 },
  flex: { flex: 1 },
  serviceTitle: { color: c.ink, fontSize: 16, fontWeight: "900" },
  serviceSub: { color: c.soft, fontSize: 10.5, fontWeight: "700", marginTop: 3 },
  ticketRow: { flexDirection: "row", borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: "#E5EEF8", backgroundColor: "#F8FBFF" },
  ticketMini: { flex: 1, paddingVertical: 13, alignItems: "center", borderRightWidth: 1, borderRightColor: "#E5EEF8" },
  ticketValue: { color: c.ink, fontSize: 21, fontWeight: "900" },
  ticketLabel: { color: c.soft, fontSize: 9.5, fontWeight: "800", marginTop: 3 },
  bottomRow: { flexDirection: "row", gap: 10, paddingHorizontal: 16, marginTop: 14 },
  infoCard: { flex: 1, backgroundColor: c.card, borderRadius: 24, padding: 14, borderWidth: 1, borderColor: c.line, minHeight: 160, shadowColor: "#4F6078", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.07, shadowRadius: 18, elevation: 2 },
  infoIcon: { width: 39, height: 39, borderRadius: 15, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  infoTitle: { color: c.ink, fontSize: 13, fontWeight: "900" },
  infoText: { color: c.soft, fontSize: 10.5, fontWeight: "700", lineHeight: 15, marginTop: 5, minHeight: 32 },
  infoValue: { marginTop: "auto", fontSize: 11, fontWeight: "900" },
});
