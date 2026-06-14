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
  const attention = snapshot.endpoints.offline + snapshot.endpoints.stale + snapshot.tickets.slaExceeded;
  const detectedLocations = Math.min(snapshot.locationTotal, snapshot.endpoints.total || snapshot.locationTotal);
  const notDetectedLocations = Math.max((snapshot.endpoints.total || 0) - detectedLocations, 0);
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
            <Text style={styles.heroSubtitle}>Focus on endpoint health, tickets and location coverage.</Text>

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

        <OperationsPulse
          onlineRate={onlineRate}
          online={snapshot.endpoints.online}
          offline={snapshot.endpoints.offline}
          stale={snapshot.endpoints.stale}
          critical={attention > 0}
        />

        <View style={styles.featureCardsRow}>          
          <SmallFeatureCard
            title="Geolocation"
            subtitle="Detected vs not detected"
            value={`${formatNumber(detectedLocations)} detected`}
            footer={`${formatNumber(notDetectedLocations)} not detected`}
            icon="geo"
            colors={["#B7F4F2", "#FFFFFF"]}
            accent={c.cyan}
            onPress={() => navigation.navigate("GeolocationSummary")}
          />
          <SmallFeatureCard
            title="Reports"
            subtitle={snapshot.latestReport?.title || "Report center"}
            value="Open report"
            footer="Latest report"
            icon="report"
            colors={["#E7DEFF", "#FFFFFF"]}
            accent={c.purple}
            onPress={openReports}
          />
        </View>

        <View style={styles.sectionBlock}>
          <View style={styles.sectionTitleRow}>
            <View>
              <Text style={styles.sectionLabel}>Endpoint Fleet</Text>
              <Text style={styles.sectionCaption}>Live device coverage across managed assets</Text>
            </View>
            <Text style={styles.sectionCount}>{formatNumber(snapshot.endpoints.total)}</Text>
          </View>

          <EndpointActionCard title="Managed Endpoint" subtitle="All inventory devices" value={snapshot.endpoints.total} progress={100} progressLabel="Inventory scope" toneName="blue" icon={Server} onPress={() => openEndpointList("all")} />
          <EndpointActionCard title="Online Devices" subtitle="Currently reporting" value={snapshot.endpoints.online} progress={onlineRate} progressLabel={`${onlineRate}% online coverage`} toneName="green" icon={Wifi} onPress={() => openEndpointList("online")} />
          <EndpointActionCard title="Offline Devices" subtitle="Not reporting / disconnected" value={snapshot.endpoints.offline} progress={offlineRate} progressLabel={`${offlineRate}% require follow-up`} toneName="red" icon={WifiOff} onPress={() => openEndpointList("offline")} />
          <EndpointActionCard title="Stale Devices" subtitle="Telemetry is outdated" value={snapshot.endpoints.stale} progress={staleRate} progressLabel={`${staleRate}% stale telemetry`} toneName="amber" icon={Clock3} onPress={() => openEndpointList("stale")} />
        </View>

        <TouchableOpacity style={styles.serviceCard} activeOpacity={0.88} onPress={() => navigation.navigate("TicketSummary")}>
          <View style={styles.serviceVisual}>
            <View style={styles.serviceVisualCircle} />
            <Ticket size={24} color="#FFFFFF" strokeWidth={2.7} />
          </View>
          <View style={styles.serviceContent}>
            <Text style={styles.cardMiniLabel}>Service Desk</Text>
            <Text style={styles.serviceTitle}>Ticket workload</Text>
            <View style={styles.ticketInlineRow}>
              <TicketPill label="Total" value={snapshot.tickets.total} />
              <TicketPill label="Open" value={snapshot.tickets.open} />
              <TicketPill label="SLA" value={snapshot.tickets.slaExceeded} danger />
            </View>
          </View>
          <View style={styles.actionBubble}><ArrowRight size={16} color={c.ink} strokeWidth={2.8} /></View>
        </TouchableOpacity>
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

function OperationsPulse({
  onlineRate,
  online,
  offline,
  stale,
  critical,
}: {
  onlineRate: number;
  online: number;
  offline: number;
  stale: number;
  critical: boolean;
}) {
  const distributionTotal = Math.max(online + offline + stale, 1);
  const onlineWidth = Math.max(pct(online, distributionTotal), online > 0 ? 5 : 0);
  const offlineWidth = Math.max(pct(offline, distributionTotal), offline > 0 ? 5 : 0);
  const staleWidth = Math.max(0, 100 - onlineWidth - offlineWidth);

  return (
    <View style={styles.pulseCard}>
      <View style={styles.pulseHeader}>
        <View>
          <Text style={styles.pulseTitle}>Operations Pulse</Text>
          <Text style={styles.pulseSubtitle}>Live endpoint distribution</Text>
        </View>
        {critical ? <Text style={styles.criticalBadge}>Critical</Text> : <Text style={styles.healthyBadge}>Healthy</Text>}
      </View>

      <View style={styles.pulseBody}>
        <View style={styles.coverageDial}>
          <Text style={styles.coverageValue}>{onlineRate}%</Text>
          <Text style={styles.coverageLabel}>Online coverage</Text>
        </View>

        <View style={styles.distributionPanel}>
          <View style={styles.stackTrack}>
            <View style={[styles.stackSegment, { width: `${onlineWidth}%`, backgroundColor: c.green }]} />
            <View style={[styles.stackSegment, { width: `${offlineWidth}%`, backgroundColor: c.red }]} />
            <View style={[styles.stackSegment, { width: `${staleWidth}%`, backgroundColor: c.amber }]} />
          </View>
          <LegendRow color={c.green} label="Online" value={online} />
          <LegendRow color={c.red} label="Offline" value={offline} />
          <LegendRow color={c.amber} label="Stale" value={stale} />
        </View>
      </View>
    </View>
  );
}

function LegendRow({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <View style={styles.legendRow}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
      <Text style={styles.legendValue}>{formatNumber(value)}</Text>
    </View>
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

function TicketPill({ label, value, danger }: { label: string; value: number; danger?: boolean }) {
  return (
    <View style={styles.ticketPill}>
      <Text style={[styles.ticketPillValue, danger && { color: c.red }]}>{formatNumber(value)}</Text>
      <Text style={styles.ticketPillLabel}>{label}</Text>
    </View>
  );
}

function SmallFeatureCard({
  title,
  subtitle,
  value,
  footer,
  icon,
  colors,
  accent,
  onPress,
}: {
  title: string;
  subtitle: string;
  value: string;
  footer: string;
  icon: "geo" | "report";
  colors: string[];
  accent: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.featureCardWrap} activeOpacity={0.88} onPress={onPress}>
      <LinearGradient colors={colors as any} style={styles.featureCard}>
        <View style={styles.featureTopRow}>
          <View style={[styles.featureIcon, { backgroundColor: `${accent}18` }]}> 
            {icon === "geo" ? <MapPin size={20} color={accent} strokeWidth={2.7} /> : <FileText size={20} color={accent} strokeWidth={2.7} />}
          </View>
          <ArrowRight size={15} color={accent} strokeWidth={2.8} />
        </View>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureSubtitle} numberOfLines={2}>{subtitle}</Text>
        <Text style={[styles.featureValue, { color: accent }]}>{value}</Text>
        <Text style={styles.featureFooter}>{footer}</Text>
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

  pulseCard: { marginHorizontal: 16, marginTop: 16, backgroundColor: c.card, borderRadius: 26, padding: 15, borderWidth: 1, borderColor: "rgba(255,255,255,0.88)", shadowColor: "#7460AE", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.1, shadowRadius: 18, elevation: 2 },
  pulseHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 13 },
  pulseTitle: { color: c.ink, fontSize: 17, fontWeight: "900", letterSpacing: -0.4 },
  pulseSubtitle: { color: c.soft, fontSize: 10.5, fontWeight: "700", marginTop: 3 },
  criticalBadge: { color: c.red, backgroundColor: "#FFE6EC", paddingHorizontal: 11, paddingVertical: 7, borderRadius: 999, fontSize: 10, fontWeight: "900" },
  healthyBadge: { color: c.green, backgroundColor: "#E7F8EF", paddingHorizontal: 11, paddingVertical: 7, borderRadius: 999, fontSize: 10, fontWeight: "900" },
  pulseBody: { flexDirection: "row", gap: 12, alignItems: "center" },
  coverageDial: { width: 96, minHeight: 104, borderRadius: 24, backgroundColor: "#F6F4FF", alignItems: "center", justifyContent: "center", padding: 12 },
  coverageValue: { color: c.purple, fontSize: 30, fontWeight: "900", letterSpacing: -1 },
  coverageLabel: { color: c.soft, fontSize: 9.5, fontWeight: "800", marginTop: 4, textAlign: "center" },
  distributionPanel: { flex: 1 },
  stackTrack: { height: 18, borderRadius: 99, overflow: "hidden", backgroundColor: "#EEF1F8", flexDirection: "row", marginBottom: 11 },
  stackSegment: { height: 18 },
  legendRow: { flexDirection: "row", alignItems: "center", marginTop: 7 },
  legendDot: { width: 9, height: 9, borderRadius: 9, marginRight: 8 },
  legendLabel: { flex: 1, color: c.soft, fontSize: 11, fontWeight: "800" },
  legendValue: { color: c.ink, fontSize: 11, fontWeight: "900" },

  featureCardsRow: { flexDirection: "row", gap: 12, paddingHorizontal: 16, marginTop: 14 },
  featureCardWrap: { flex: 1, borderRadius: 26, overflow: "hidden", shadowColor: "#7460AE", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.1, shadowRadius: 18, elevation: 2 },
  featureCard: { minHeight: 158, padding: 14, borderRadius: 26, borderWidth: 1, borderColor: "rgba(255,255,255,0.9)" },
  featureTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  featureIcon: { width: 44, height: 44, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  featureTitle: { color: c.ink, fontSize: 15, fontWeight: "900", marginTop: 16, letterSpacing: -0.3 },
  featureSubtitle: { color: c.soft, fontSize: 10.5, fontWeight: "700", lineHeight: 15, marginTop: 5, minHeight: 32 },
  featureValue: { marginTop: "auto", fontSize: 11, fontWeight: "900" },
  featureFooter: { color: c.soft, fontSize: 9.5, fontWeight: "800", marginTop: 4 },

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
  cardFooterRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  actionPill: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 999, paddingHorizontal: 11, paddingVertical: 7 },
  actionPillText: { color: "#FFFFFF", fontSize: 10.5, fontWeight: "900" },

  serviceCard: { marginHorizontal: 16, marginTop: 4, backgroundColor: c.card, borderRadius: 28, padding: 12, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.85)", shadowColor: "#7460AE", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.1, shadowRadius: 18, elevation: 2 },
  serviceVisual: { width: 82, height: 104, borderRadius: 24, backgroundColor: c.navy, alignItems: "center", justifyContent: "center", marginRight: 13, overflow: "hidden" },
  serviceVisualCircle: { position: "absolute", width: 76, height: 76, borderRadius: 76, backgroundColor: "rgba(110,73,232,0.48)", top: -18, right: -16 },
  serviceContent: { flex: 1 },
  cardMiniLabel: { color: c.purple, fontSize: 10, fontWeight: "900", letterSpacing: 0.7 },
  serviceTitle: { color: c.ink, fontSize: 17, fontWeight: "900", letterSpacing: -0.4, marginTop: 4 },
  ticketInlineRow: { flexDirection: "row", gap: 7, marginTop: 12 },
  ticketPill: { backgroundColor: "#F6F7FB", borderRadius: 14, paddingHorizontal: 9, paddingVertical: 8, minWidth: 54, alignItems: "center" },
  ticketPillValue: { color: c.ink, fontSize: 16, fontWeight: "900" },
  ticketPillLabel: { color: c.soft, fontSize: 8.5, fontWeight: "800", marginTop: 2 },
  actionBubble: { width: 34, height: 34, borderRadius: 14, backgroundColor: "#F3F4FA", alignItems: "center", justifyContent: "center" },
});
