import React, { useMemo } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AlertTriangle,
  ArrowRight,
  Clock3,
  FileText,
  MapPin,
  RefreshCcw,
  Server,
  Ticket,
  Wifi,
  WifiOff,
} from "lucide-react-native";

import { useMobileOpsSnapshot } from "../../hooks/useLiveOpsData";
import { formatNumber } from "../../utils/formatters";

const c = {
  bg: "#EDE9FF",
  bg2: "#EAF8F7",
  card: "#FFFFFF",
  ink: "#111827",
  soft: "#5B6475",
  muted: "#8993A4",
  line: "#E5E8F2",
  navy: "#080A1F",
  purple: "#6E49E8",
  violet: "#9A6CFF",
  blue: "#315BFF",
  cyan: "#18A6B6",
  green: "#19A86B",
  amber: "#E49A22",
  red: "#E84A5F",
};

type EndpointTone = "blue" | "green" | "red" | "amber";

const tone = {
  blue: { main: c.blue, gradient: ["#EEF3FF", "#FFFFFF"], panel: "#DFE7FF", chip: "#E9EEFF" },
  green: { main: c.green, gradient: ["#E9FBF3", "#FFFFFF"], panel: "#D9F6E8", chip: "#E7F8EF" },
  red: { main: c.red, gradient: ["#FFF0F3", "#FFFFFF"], panel: "#FFE0E7", chip: "#FFE8EC" },
  amber: { main: c.amber, gradient: ["#FFF5E6", "#FFFFFF"], panel: "#FFECC8", chip: "#FFF1DB" },
} as const;

function pct(value: number, total: number) {
  if (!total) return 0;
  return Math.max(0, Math.min(100, Math.round((value / total) * 100)));
}

export default function OverviewHomeScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { snapshot, loading, refreshing, error, reloadSnapshot } = useMobileOpsSnapshot();

  const onlineRate = useMemo(() => pct(snapshot.endpoints.online, snapshot.endpoints.total), [snapshot.endpoints.online, snapshot.endpoints.total]);
  const staleRate = pct(snapshot.endpoints.stale, snapshot.endpoints.total);
  const offlineRate = pct(snapshot.endpoints.offline, snapshot.endpoints.total);
  const locationCoverage = pct(snapshot.locationTotal, snapshot.endpoints.total);
  const notLocated = Math.max(snapshot.endpoints.total - snapshot.locationTotal, 0);
  const slaSafe = Math.max(0, Math.min(snapshot.tickets.slaAchievement || 0, 100));
  const openTicketRate = pct(snapshot.tickets.open, snapshot.tickets.total);
  const attention = snapshot.endpoints.offline + snapshot.endpoints.stale + snapshot.tickets.slaExceeded;
  const healthLabel = onlineRate >= 80 ? "Healthy" : onlineRate >= 50 ? "Watch" : "Critical";

  const openEndpointList = (status: "all" | "online" | "offline" | "stale") => navigation.navigate("ActiveDeviceList", { status });
  const openReports = () => navigation.getParent()?.navigate("Reports");
  const refresh = () => reloadSnapshot({ silent: true });

  return (
    <View style={styles.page}>
      <View style={{ height: insets.top, backgroundColor: c.bg }} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) + 104 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        <LinearGradient colors={[c.bg, "#F5F3FF", c.bg2]} style={styles.backgroundStage}>
          <View style={styles.headerBar}>
            <View>
              <Text style={styles.hello}>EMA Operations</Text>
              <Text style={styles.screenTitle}>Today Snapshot</Text>
            </View>
            <TouchableOpacity style={styles.circleButton} onPress={refresh} activeOpacity={0.85}>
              {loading || refreshing ? <ActivityIndicator size="small" color={c.purple} /> : <RefreshCcw size={18} color={c.ink} strokeWidth={2.6} />}
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={["#7C5CFF", "#5E38E6", "#1B1E58"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroBubbleOne} />
            <View style={styles.heroBubbleTwo} />
            <View style={styles.heroTopLine}>
              <Text style={styles.heroKicker}>LIVE DATA</Text>
              <Text style={styles.heroDate}>{snapshot.generatedAt}</Text>
            </View>
            <Text style={styles.heroTitle}>Command overview</Text>
            <Text style={styles.heroSubtitle}>Endpoint health, tickets, location coverage and latest reporting in one place.</Text>

            <View style={styles.heroMetricRow}>
              <HeroMetric label="Attention" value={attention} />
              <HeroMetric label="Endpoints" value={snapshot.endpoints.total} />
              <HeroMetric label="Open Tickets" value={snapshot.tickets.open} />
            </View>
          </LinearGradient>
        </LinearGradient>

        {error ? (
          <View style={styles.errorCard}>
            <AlertTriangle size={18} color={c.red} strokeWidth={2.8} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.pulsePanel}>
          <View style={styles.panelTitleRow}>
            <View>
              <Text style={styles.panelTitle}>Operations Pulse</Text>
              <Text style={styles.panelSubtitle}>Live endpoint distribution</Text>
            </View>
            <View style={[styles.healthBadge, { backgroundColor: onlineRate >= 80 ? "#E7F8EF" : onlineRate >= 50 ? "#FFF1DB" : "#FFE8EC" }]}> 
              <Text style={[styles.healthBadgeText, { color: onlineRate >= 80 ? c.green : onlineRate >= 50 ? c.amber : c.red }]}>{healthLabel}</Text>
            </View>
          </View>

          <View style={styles.pulseContentRow}>
            <View style={styles.bigRateBlock}>
              <Text style={styles.bigRate}>{onlineRate}%</Text>
              <Text style={styles.bigRateLabel}>Online coverage</Text>
            </View>
            <View style={styles.pulseStatsColumn}>
              <SegmentBar online={onlineRate} offline={offlineRate} stale={staleRate} />
              <View style={styles.legendRow}>
                <Legend label="Online" value={snapshot.endpoints.online} color={c.green} />
                <Legend label="Offline" value={snapshot.endpoints.offline} color={c.red} />
                <Legend label="Stale" value={snapshot.endpoints.stale} color={c.amber} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.focusPanel}>
          <View style={styles.panelTitleRow}>
            <View>
              <Text style={styles.panelTitle}>Attention Focus</Text>
              <Text style={styles.panelSubtitle}>Items that need operator action</Text>
            </View>
            <Text style={styles.focusCount}>{formatNumber(attention)}</Text>
          </View>
          <FocusRow icon={WifiOff} title="Offline / not reporting" value={snapshot.endpoints.offline} color={c.red} onPress={() => openEndpointList("offline")} />
          <FocusRow icon={Clock3} title="Stale telemetry" value={snapshot.endpoints.stale} color={c.amber} onPress={() => openEndpointList("stale")} />
          <FocusRow icon={Ticket} title="SLA exceeded tickets" value={snapshot.tickets.slaExceeded} color={c.purple} onPress={() => navigation.navigate("TicketSummary")} last />
        </View>

        <View style={styles.dashboardGrid}>
          <DashboardCard
            title="Geolocation Coverage"
            subtitle={`${formatNumber(snapshot.locationTotal)} detected · ${formatNumber(notLocated)} not detected`}
            value={`${locationCoverage}%`}
            icon={MapPin}
            color={c.cyan}
            onPress={() => navigation.navigate("GeolocationSummary")}
          />
          <DashboardCard
            title="Ticket Workload"
            subtitle={`${formatNumber(snapshot.tickets.open)} open · ${formatNumber(snapshot.tickets.closed)} closed`}
            value={`${openTicketRate}%`}
            icon={Ticket}
            color={c.purple}
            onPress={() => navigation.navigate("TicketSummary")}
          />
        </View>

        <View style={styles.reportPreviewCard}>
          <View style={styles.reportIconBox}>
            <FileText size={21} color="#FFFFFF" strokeWidth={2.8} />
          </View>
          <View style={styles.reportTextWrap}>
            <Text style={styles.reportKicker}>Latest Report</Text>
            <Text style={styles.reportTitle} numberOfLines={1}>{snapshot.latestReport?.title || "Report center"}</Text>
            <Text style={styles.reportDesc} numberOfLines={2}>{snapshot.latestReport?.description || "Open the report center to review available operational reports."}</Text>
          </View>
          <TouchableOpacity style={styles.reportAction} onPress={openReports} activeOpacity={0.86}>
            <ArrowRight size={16} color={c.purple} strokeWidth={2.8} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionBlock}>
          <View style={styles.sectionTitleRow}>
            <View>
              <Text style={styles.sectionLabel}>Endpoint Fleet</Text>
              <Text style={styles.sectionCaption}>Tap a card to open filtered device records</Text>
            </View>
            <Text style={styles.sectionCount}>{formatNumber(snapshot.endpoints.total)}</Text>
          </View>

          <EndpointActionCard title="Managed Endpoint" subtitle="All inventory devices" value={snapshot.endpoints.total} progress={100} progressLabel="Inventory scope" toneName="blue" icon={Server} onPress={() => openEndpointList("all")} />
          <EndpointActionCard title="Online Devices" subtitle="Currently reporting" value={snapshot.endpoints.online} progress={onlineRate} progressLabel={`${onlineRate}% online coverage`} toneName="green" icon={Wifi} onPress={() => openEndpointList("online")} />
          <EndpointActionCard title="Offline Devices" subtitle="Not reporting / disconnected" value={snapshot.endpoints.offline} progress={offlineRate} progressLabel={`${offlineRate}% require follow-up`} toneName="red" icon={WifiOff} onPress={() => openEndpointList("offline")} />
          <EndpointActionCard title="Stale Devices" subtitle="Telemetry is outdated" value={snapshot.endpoints.stale} progress={staleRate} progressLabel={`${staleRate}% stale telemetry`} toneName="amber" icon={Clock3} onPress={() => openEndpointList("stale")} />
        </View>
      </ScrollView>
    </View>
  );
}

function HeroMetric({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.heroMetric}>
      <Text style={styles.heroMetricValue}>{formatNumber(value)}</Text>
      <Text style={styles.heroMetricLabel}>{label}</Text>
    </View>
  );
}

function SegmentBar({ online, offline, stale }: { online: number; offline: number; stale: number }) {
  const used = Math.min(100, online + offline + stale);
  const idle = Math.max(0, 100 - used);
  return (
    <View style={styles.segmentTrack}>
      <View style={[styles.segmentFill, { flex: Math.max(online, 1), backgroundColor: c.green }]} />
      <View style={[styles.segmentFill, { flex: Math.max(offline, 1), backgroundColor: c.red }]} />
      <View style={[styles.segmentFill, { flex: Math.max(stale, 1), backgroundColor: c.amber }]} />
      {idle > 0 ? <View style={[styles.segmentFill, { flex: idle, backgroundColor: "#E9EDF5" }]} /> : null}
    </View>
  );
}

function Legend({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
      <Text style={styles.legendValue}>{formatNumber(value)}</Text>
    </View>
  );
}

function FocusRow({ icon: Icon, title, value, color, onPress, last }: { icon: any; title: string; value: number; color: string; onPress: () => void; last?: boolean }) {
  return (
    <TouchableOpacity style={[styles.focusRow, last && styles.noBorder]} activeOpacity={0.86} onPress={onPress}>
      <View style={[styles.focusIcon, { backgroundColor: `${color}16` }]}>
        <Icon size={17} color={color} strokeWidth={2.7} />
      </View>
      <Text style={styles.focusTitle}>{title}</Text>
      <Text style={[styles.focusValue, { color }]}>{formatNumber(value)}</Text>
      <ArrowRight size={14} color={c.muted} strokeWidth={2.8} />
    </TouchableOpacity>
  );
}

function DashboardCard({ title, subtitle, value, icon: Icon, color, onPress }: { title: string; subtitle: string; value: string; icon: any; color: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.dashboardCard} activeOpacity={0.88} onPress={onPress}>
      <View style={[styles.dashboardIcon, { backgroundColor: `${color}16` }]}>
        <Icon size={18} color={color} strokeWidth={2.7} />
      </View>
      <Text style={[styles.dashboardValue, { color }]}>{value}</Text>
      <Text style={styles.dashboardTitle}>{title}</Text>
      <Text style={styles.dashboardSubtitle} numberOfLines={2}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

function EndpointActionCard({
  title,
  subtitle,
  value,
  progress,
  progressLabel,
  toneName,
  icon: Icon,
  onPress,
}: {
  title: string;
  subtitle: string;
  value: number;
  progress: number;
  progressLabel: string;
  toneName: EndpointTone;
  icon: any;
  onPress: () => void;
}) {
  const t = tone[toneName];
  const safeProgress = Math.max(0, Math.min(progress, 100));

  return (
    <TouchableOpacity style={styles.endpointCardOuter} activeOpacity={0.9} onPress={onPress}>
      <LinearGradient colors={t.gradient as any} style={styles.endpointCard}>
        <View style={[styles.iconColumn, { backgroundColor: t.panel }]}> 
          <View style={[styles.iconGlow, { backgroundColor: `${t.main}16` }]} />
          <View style={[styles.iconBadge, { backgroundColor: "rgba(255,255,255,0.76)", borderColor: `${t.main}25` }]}> 
            <Icon size={23} color={t.main} strokeWidth={2.6} />
          </View>
        </View>

        <View style={styles.endpointContent}>
          <View style={styles.endpointTopRow}>
            <View style={styles.endpointTitleWrap}>
              <Text style={styles.endpointTitle}>{title}</Text>
              <Text style={styles.endpointSub}>{subtitle}</Text>
            </View>
            <View style={[styles.valueBubble, { backgroundColor: t.chip }]}> 
              <Text style={[styles.endpointValue, { color: t.main }]}>{formatNumber(value)}</Text>
            </View>
          </View>

          <View style={styles.statusChipRow}>
            <View style={[styles.statusChip, { backgroundColor: t.chip }]}> 
              <Text style={[styles.statusChipText, { color: t.main }]} numberOfLines={1}>{progressLabel}</Text>
            </View>
            <View style={styles.statusChipNeutral}>
              <Text style={styles.statusChipNeutralText}>{safeProgress}%</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${safeProgress}%`, backgroundColor: t.main }]} />
          </View>

          <View style={styles.cardFooterRow}>
            <View style={[styles.actionPill, { backgroundColor: t.main }]}> 
              <Text style={styles.actionPillText}>Open list</Text>
              <ArrowRight size={13} color="#FFFFFF" strokeWidth={2.8} />
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: c.bg },
  scroll: { flex: 1 },
  backgroundStage: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 24, borderBottomLeftRadius: 34, borderBottomRightRadius: 34, overflow: "hidden" },
  headerBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  hello: { color: c.soft, fontSize: 12, fontWeight: "800" },
  screenTitle: { color: c.ink, fontSize: 26, fontWeight: "900", letterSpacing: -1, marginTop: 2 },
  circleButton: { width: 46, height: 46, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.72)", alignItems: "center", justifyContent: "center", shadowColor: "#6B5AAE", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 14, elevation: 2 },
  notificationDot: { position: "absolute", top: 7, right: 7, width: 8, height: 8, borderRadius: 8, backgroundColor: c.purple },
  heroCard: { borderRadius: 30, minHeight: 210, padding: 20, overflow: "hidden", shadowColor: "#4D36A8", shadowOffset: { width: 0, height: 18 }, shadowOpacity: 0.2, shadowRadius: 26, elevation: 5 },
  heroBubbleOne: { position: "absolute", width: 180, height: 180, borderRadius: 180, backgroundColor: "rgba(255,255,255,0.18)", right: -54, top: -62 },
  heroBubbleTwo: { position: "absolute", width: 120, height: 120, borderRadius: 120, backgroundColor: "rgba(24,166,182,0.30)", left: -40, bottom: -46 },
  heroTopLine: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  heroKicker: { color: "#DCD5FF", fontSize: 11, fontWeight: "900", letterSpacing: 1.2 },
  heroDate: { color: "#C7C4F8", fontSize: 10.5, fontWeight: "800" },
  heroTitle: { color: "#FFFFFF", fontSize: 28, fontWeight: "900", marginTop: 26, letterSpacing: -1.1 },
  heroSubtitle: { color: "#DEDDFB", fontSize: 12, fontWeight: "700", lineHeight: 18, marginTop: 6, maxWidth: 280 },
  heroMetricRow: { flexDirection: "row", gap: 10, marginTop: 18 },
  heroMetric: { flex: 1, backgroundColor: "rgba(255,255,255,0.13)", borderRadius: 18, padding: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.16)" },
  heroMetricValue: { color: "#FFFFFF", fontSize: 22, fontWeight: "900", letterSpacing: -0.7 },
  heroMetricLabel: { color: "#C9C8F8", fontSize: 9.5, fontWeight: "800", marginTop: 3 },
  errorCard: { marginHorizontal: 16, marginTop: 14, padding: 14, borderRadius: 18, backgroundColor: "#FFF5F5", borderWidth: 1, borderColor: "#FAD0D0", flexDirection: "row", alignItems: "center", gap: 9 },
  errorText: { flex: 1, color: c.soft, fontSize: 11, fontWeight: "700" },
  pulsePanel: { marginHorizontal: 16, marginTop: 16, backgroundColor: c.card, borderRadius: 28, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.85)", shadowColor: "#7460AE", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.1, shadowRadius: 18, elevation: 2 },
  panelTitleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  panelTitle: { color: c.ink, fontSize: 17, fontWeight: "900", letterSpacing: -0.35 },
  panelSubtitle: { color: c.soft, fontSize: 10.5, fontWeight: "700", marginTop: 3 },
  healthBadge: { paddingHorizontal: 11, paddingVertical: 7, borderRadius: 999 },
  healthBadgeText: { fontSize: 10, fontWeight: "900" },
  pulseContentRow: { flexDirection: "row", gap: 14, alignItems: "center" },
  bigRateBlock: { width: 104, minHeight: 104, borderRadius: 24, backgroundColor: "#F6F7FF", alignItems: "center", justifyContent: "center" },
  bigRate: { color: c.purple, fontSize: 32, fontWeight: "900", letterSpacing: -1 },
  bigRateLabel: { color: c.soft, fontSize: 10, fontWeight: "800", marginTop: 4, textAlign: "center" },
  pulseStatsColumn: { flex: 1 },
  segmentTrack: { height: 16, borderRadius: 999, backgroundColor: "#E9EDF5", overflow: "hidden", flexDirection: "row" },
  segmentFill: { height: 16 },
  legendRow: { marginTop: 12, gap: 8 },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendDot: { width: 8, height: 8, borderRadius: 8, marginRight: 7 },
  legendLabel: { flex: 1, color: c.soft, fontSize: 10.5, fontWeight: "800" },
  legendValue: { color: c.ink, fontSize: 11, fontWeight: "900" },
  focusPanel: { marginHorizontal: 16, marginTop: 14, backgroundColor: c.card, borderRadius: 28, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.85)", shadowColor: "#7460AE", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.09, shadowRadius: 18, elevation: 2 },
  focusCount: { color: c.red, fontSize: 23, fontWeight: "900", letterSpacing: -0.7 },
  focusRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#EEF1F7" },
  noBorder: { borderBottomWidth: 0 },
  focusIcon: { width: 36, height: 36, borderRadius: 15, alignItems: "center", justifyContent: "center", marginRight: 11 },
  focusTitle: { flex: 1, color: c.ink, fontSize: 12.5, fontWeight: "900" },
  focusValue: { fontSize: 16, fontWeight: "900", marginRight: 9 },
  dashboardGrid: { flexDirection: "row", gap: 12, paddingHorizontal: 16, marginTop: 14 },
  dashboardCard: { flex: 1, backgroundColor: c.card, borderRadius: 26, padding: 14, minHeight: 156, borderWidth: 1, borderColor: "rgba(255,255,255,0.9)", shadowColor: "#7460AE", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.09, shadowRadius: 18, elevation: 2 },
  dashboardIcon: { width: 42, height: 42, borderRadius: 17, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  dashboardValue: { fontSize: 25, fontWeight: "900", letterSpacing: -0.8 },
  dashboardTitle: { color: c.ink, fontSize: 13, fontWeight: "900", marginTop: 5 },
  dashboardSubtitle: { color: c.soft, fontSize: 10.2, fontWeight: "700", lineHeight: 14, marginTop: 4 },
  reportPreviewCard: { marginHorizontal: 16, marginTop: 14, backgroundColor: c.card, borderRadius: 28, padding: 14, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.85)", shadowColor: "#7460AE", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.09, shadowRadius: 18, elevation: 2 },
  reportIconBox: { width: 52, height: 52, borderRadius: 20, backgroundColor: c.purple, alignItems: "center", justifyContent: "center", marginRight: 12 },
  reportTextWrap: { flex: 1 },
  reportKicker: { color: c.purple, fontSize: 9.5, fontWeight: "900", letterSpacing: 0.7 },
  reportTitle: { color: c.ink, fontSize: 14, fontWeight: "900", marginTop: 3 },
  reportDesc: { color: c.soft, fontSize: 10.2, fontWeight: "700", lineHeight: 14, marginTop: 4 },
  reportAction: { width: 36, height: 36, borderRadius: 15, backgroundColor: "#F1EDFF", alignItems: "center", justifyContent: "center", marginLeft: 8 },
  sectionBlock: { paddingHorizontal: 16, marginTop: 16 },
  sectionTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 },
  sectionLabel: { color: c.ink, fontSize: 20, fontWeight: "900", letterSpacing: -0.5 },
  sectionCaption: { color: c.soft, fontSize: 11, fontWeight: "700", marginTop: 3 },
  sectionCount: { color: c.purple, fontSize: 16, fontWeight: "900" },
  endpointCardOuter: { marginBottom: 12, borderRadius: 26, shadowColor: "#7460AE", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 2 },
  endpointCard: { borderRadius: 26, padding: 10, minHeight: 120, flexDirection: "row", borderWidth: 1, borderColor: "rgba(255,255,255,0.85)" },
  iconColumn: { width: 74, borderRadius: 22, alignItems: "center", justifyContent: "center", marginRight: 12, overflow: "hidden" },
  iconGlow: { position: "absolute", width: 58, height: 58, borderRadius: 58 },
  iconBadge: { width: 44, height: 44, borderRadius: 17, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  endpointContent: { flex: 1, paddingVertical: 7, paddingRight: 2 },
  endpointTopRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  endpointTitleWrap: { flex: 1, paddingRight: 9 },
  endpointTitle: { color: c.ink, fontSize: 15.5, fontWeight: "900", letterSpacing: -0.35 },
  endpointSub: { color: c.soft, fontSize: 10.3, fontWeight: "700", marginTop: 3 },
  valueBubble: { minWidth: 43, height: 38, borderRadius: 16, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  endpointValue: { fontSize: 25, fontWeight: "900", letterSpacing: -0.8 },
  statusChipRow: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 13, marginBottom: 7 },
  statusChip: { flex: 1, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 6 },
  statusChipText: { fontSize: 9.5, fontWeight: "900" },
  statusChipNeutral: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 6, backgroundColor: "#F2F4FA" },
  statusChipNeutralText: { color: c.muted, fontSize: 9.5, fontWeight: "900" },
  progressTrack: { height: 7, borderRadius: 99, backgroundColor: "#EEF1F8", overflow: "hidden" },
  progressFill: { height: 7, borderRadius: 99 },
  cardFooterRow: { flexDirection: "row", alignItems: "center", marginTop: 11 },
  actionPill: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999 },
  actionPillText: { color: "#FFFFFF", fontSize: 10, fontWeight: "900" },
});
