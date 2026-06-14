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
  blue: { main: c.blue, soft: "#E9EEFF", gradient: ["#DDE7FF", "#F8FAFF"] },
  green: { main: c.green, soft: "#E4F8EF", gradient: ["#D9F7E9", "#F8FFFB"] },
  red: { main: c.red, soft: "#FFE8EC", gradient: ["#FFE0E6", "#FFF8FA"] },
  amber: { main: c.amber, soft: "#FFF2DD", gradient: ["#FFE7BF", "#FFFBF4"] },
} as const;

export default function OverviewHomeScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { snapshot, loading, refreshing, error, reloadSnapshot } = useMobileOpsSnapshot();

  const onlineRate = useMemo(() => {
    if (!snapshot.endpoints.total) return 0;
    return Math.round((snapshot.endpoints.online / snapshot.endpoints.total) * 100);
  }, [snapshot.endpoints.online, snapshot.endpoints.total]);

  const attention = snapshot.endpoints.offline + snapshot.endpoints.stale + snapshot.tickets.slaExceeded;
  const staleRate = snapshot.endpoints.total ? Math.round((snapshot.endpoints.stale / snapshot.endpoints.total) * 100) : 0;
  const offlineRate = snapshot.endpoints.total ? Math.round((snapshot.endpoints.offline / snapshot.endpoints.total) * 100) : 0;
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
              {loading || refreshing ? (
                <ActivityIndicator size="small" color={c.purple} />
              ) : (
                <RefreshCcw size={18} color={c.ink} strokeWidth={2.6} />
              )}
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

        <View style={styles.sectionBlock}>
          <View style={styles.sectionTitleRow}>
            <View>
              <Text style={styles.sectionLabel}>Endpoint Fleet</Text>
              <Text style={styles.sectionCaption}>Management endpoint cards</Text>
            </View>
            <Text style={styles.sectionCount}>{formatNumber(snapshot.endpoints.total)}</Text>
          </View>

          <EndpointActionCard
            title="Managed Endpoint"
            subtitle="All inventory devices"
            value={snapshot.endpoints.total}
            progress={100}
            progressLabel="Inventory scope"
            toneName="blue"
            icon={Server}
            onPress={() => openEndpointList("all")}
          />
          <EndpointActionCard
            title="Online Devices"
            subtitle="Currently reporting"
            value={snapshot.endpoints.online}
            progress={onlineRate}
            progressLabel={`${onlineRate}% online coverage`}
            toneName="green"
            icon={Wifi}
            onPress={() => openEndpointList("online")}
          />
          <EndpointActionCard
            title="Offline Devices"
            subtitle="Not reporting / disconnected"
            value={snapshot.endpoints.offline}
            progress={offlineRate}
            progressLabel={`${offlineRate}% require follow-up`}
            toneName="red"
            icon={WifiOff}
            onPress={() => openEndpointList("offline")}
          />
          <EndpointActionCard
            title="Stale Devices"
            subtitle="Telemetry is outdated"
            value={snapshot.endpoints.stale}
            progress={staleRate}
            progressLabel={`${staleRate}% stale telemetry`}
            toneName="amber"
            icon={Clock3}
            onPress={() => openEndpointList("stale")}
          />
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

        <View style={styles.bottomCards}>
          <SmallFeatureCard
            title="Geolocation"
            subtitle="Detected vs not detected"
            value={`${formatNumber(snapshot.locationTotal)} devices`}
            icon="geo"
            colors={["#B7F4F2", "#FFFFFF"]}
            accent={c.cyan}
            onPress={() => navigation.navigate("GeolocationSummary")}
          />
          <SmallFeatureCard
            title="Reports"
            subtitle={snapshot.latestReport?.title || "Report center"}
            value="Open report"
            icon="report"
            colors={["#E7DEFF", "#FFFFFF"]}
            accent={c.purple}
            onPress={openReports}
          />
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
    <TouchableOpacity style={styles.endpointCard} activeOpacity={0.88} onPress={onPress}>
      <LinearGradient colors={t.gradient as any} style={styles.deviceArtwork}>
        <View style={[styles.artOrbLarge, { backgroundColor: `${t.main}22` }]} />
        <View style={[styles.artOrbSmall, { backgroundColor: `${t.main}36` }]} />
        <View style={[styles.artIconHalo, { backgroundColor: `${t.main}18` }]} />
        <View style={[styles.artIconPlate, { borderColor: `${t.main}35`, shadowColor: t.main }]}>
          <Icon size={42} color={t.main} strokeWidth={2.35} />
        </View>
        <View style={[styles.artMiniBadge, { backgroundColor: t.main }]}> 
          <ArrowRight size={11} color="#FFFFFF" strokeWidth={3} />
        </View>
      </LinearGradient>

      <View style={styles.endpointContent}>
        <View style={styles.endpointTopRow}>
          <View style={styles.endpointTitleWrap}>
            <Text style={styles.endpointTitle}>{title}</Text>
            <Text style={styles.endpointSub}>{subtitle}</Text>
          </View>
          <Text style={[styles.endpointValue, { color: t.main }]}>{formatNumber(value)}</Text>
        </View>

        <View style={styles.progressMetaRow}>
          <Text style={styles.progressLabel}>{progressLabel}</Text>
          <Text style={styles.progressPercent}>{safeProgress}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${safeProgress}%`, backgroundColor: t.main }]} />
        </View>

        <View style={styles.cardFooterRow}>
          <Text style={[styles.cardActionText, { color: t.main }]}>Open device list</Text>
          <ArrowRight size={15} color={t.main} strokeWidth={2.8} />
        </View>
      </View>
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
  icon,
  colors,
  accent,
  onPress,
}: {
  title: string;
  subtitle: string;
  value: string;
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
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: c.bg },
  scroll: { flex: 1 },
  backgroundStage: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    overflow: "hidden",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  hello: { color: c.soft, fontSize: 12, fontWeight: "800" },
  screenTitle: { color: c.ink, fontSize: 26, fontWeight: "900", letterSpacing: -1, marginTop: 2 },
  circleButton: {
    width: 46,
    height: 46,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.72)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6B5AAE",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 2,
  },
  notificationDot: { position: "absolute", top: 7, right: 7, width: 8, height: 8, borderRadius: 8, backgroundColor: c.purple },
  heroCard: {
    borderRadius: 30,
    minHeight: 210,
    padding: 20,
    overflow: "hidden",
    shadowColor: "#4D36A8",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.2,
    shadowRadius: 26,
    elevation: 5,
  },
  heroBubbleOne: { position: "absolute", width: 180, height: 180, borderRadius: 180, backgroundColor: "rgba(255,255,255,0.18)", right: -54, top: -62 },
  heroBubbleTwo: { position: "absolute", width: 120, height: 120, borderRadius: 120, backgroundColor: "rgba(24,166,182,0.30)", left: -40, bottom: -46 },
  heroTopLine: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  heroKicker: { color: "#DCD5FF", fontSize: 11, fontWeight: "900", letterSpacing: 1.2 },
  heroDate: { color: "#C7C4F8", fontSize: 10.5, fontWeight: "800" },
  heroTitle: { color: "#FFFFFF", fontSize: 28, fontWeight: "900", marginTop: 26, letterSpacing: -1.1 },
  heroSubtitle: { color: "#DEDDFB", fontSize: 12, fontWeight: "700", lineHeight: 18, marginTop: 6, maxWidth: 250 },
  heroMetricRow: { flexDirection: "row", gap: 10, marginTop: 18 },
  heroMetric: { flex: 1, backgroundColor: "rgba(255,255,255,0.13)", borderRadius: 18, padding: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.16)" },
  heroMetricValue: { color: "#FFFFFF", fontSize: 22, fontWeight: "900", letterSpacing: -0.7 },
  heroMetricLabel: { color: "#C9C8F8", fontSize: 9.5, fontWeight: "800", marginTop: 3 },
  errorCard: { marginHorizontal: 16, marginTop: 14, padding: 14, borderRadius: 18, backgroundColor: "#FFF5F5", borderWidth: 1, borderColor: "#FAD0D0", flexDirection: "row", alignItems: "center", gap: 9 },
  errorText: { flex: 1, color: c.soft, fontSize: 11, fontWeight: "700" },
  sectionBlock: { paddingHorizontal: 16, marginTop: 16 },
  sectionTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 },
  sectionLabel: { color: c.ink, fontSize: 20, fontWeight: "900", letterSpacing: -0.5 },
  sectionCaption: { color: c.soft, fontSize: 11, fontWeight: "700", marginTop: 3 },
  sectionCount: { color: c.purple, fontSize: 16, fontWeight: "900" },
  endpointCard: {
    backgroundColor: c.card,
    borderRadius: 26,
    padding: 10,
    marginBottom: 12,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
    shadowColor: "#7460AE",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 2,
  },
  deviceArtwork: { width: 100, minHeight: 118, borderRadius: 22, overflow: "hidden", alignItems: "center", justifyContent: "center", marginRight: 12 },
  artOrbLarge: { position: "absolute", width: 92, height: 92, borderRadius: 92, top: 8, right: -25 },
  artOrbSmall: { position: "absolute", width: 52, height: 52, borderRadius: 52, bottom: 10, left: -10 },
  artIconHalo: { position: "absolute", width: 76, height: 76, borderRadius: 28, transform: [{ rotate: "-10deg" }] },
  artIconPlate: {
    width: 68,
    height: 68,
    borderRadius: 24,
    borderWidth: 1.5,
    backgroundColor: "rgba(255,255,255,0.86)",
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 2,
  },
  artMiniBadge: {
    position: "absolute",
    right: 16,
    bottom: 18,
    width: 24,
    height: 24,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.82)",
  },
  endpointContent: { flex: 1, paddingVertical: 8, paddingRight: 4 },
  endpointTopRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  endpointTitleWrap: { flex: 1, paddingRight: 10 },
  endpointTitle: { color: c.ink, fontSize: 16, fontWeight: "900", letterSpacing: -0.4 },
  endpointSub: { color: c.soft, fontSize: 10.5, fontWeight: "700", marginTop: 3 },
  endpointValue: { fontSize: 28, fontWeight: "900", letterSpacing: -1 },
  progressMetaRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16, marginBottom: 6 },
  progressLabel: { color: c.soft, fontSize: 9.5, fontWeight: "800" },
  progressPercent: { color: c.muted, fontSize: 9.5, fontWeight: "900" },
  progressTrack: { height: 7, borderRadius: 99, backgroundColor: "#EEF1F8", overflow: "hidden" },
  progressFill: { height: 7, borderRadius: 99 },
  cardFooterRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 10 },
  cardActionText: { fontSize: 10.5, fontWeight: "900" },
  serviceCard: {
    marginHorizontal: 16,
    marginTop: 4,
    backgroundColor: c.card,
    borderRadius: 28,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.85)",
    shadowColor: "#7460AE",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 2,
  },
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
  bottomCards: { flexDirection: "row", gap: 12, paddingHorizontal: 16, marginTop: 14 },
  featureCardWrap: { flex: 1, borderRadius: 26, overflow: "hidden", shadowColor: "#7460AE", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.1, shadowRadius: 18, elevation: 2 },
  featureCard: { minHeight: 158, padding: 14, borderRadius: 26, borderWidth: 1, borderColor: "rgba(255,255,255,0.9)" },
  featureTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  featureIcon: { width: 44, height: 44, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  featureTitle: { color: c.ink, fontSize: 15, fontWeight: "900", marginTop: 16, letterSpacing: -0.3 },
  featureSubtitle: { color: c.soft, fontSize: 10.5, fontWeight: "700", lineHeight: 15, marginTop: 5, minHeight: 32 },
  featureValue: { marginTop: "auto", fontSize: 11, fontWeight: "900" },
});
