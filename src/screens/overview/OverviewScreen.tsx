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
  CheckCircle2,
  FileText,
  MapPin,
  RefreshCcw,
  Server,
  ShieldCheck,
  Ticket,
  WifiOff,
} from "lucide-react-native";

import { useMobileOpsSnapshot } from "../../hooks/useLiveOpsData";
import { formatNumber } from "../../utils/formatters";

const ui = {
  bg: "#EAF0F8",
  ink: "#0B1220",
  soft: "#53657C",
  muted: "#8795A7",
  line: "#DDE7F3",
  card: "#FFFFFF",
  navy: "#06101F",
  navy2: "#0B1C36",
  blue: "#2F62D8",
  cyan: "#0E8FA6",
  green: "#1F9D65",
  amber: "#D48A1C",
  red: "#D84D4D",
  purple: "#7857D9",
};

type MetricTone = "blue" | "green" | "red" | "amber";

const toneMap: Record<MetricTone, string> = {
  blue: ui.blue,
  green: ui.green,
  red: ui.red,
  amber: ui.amber,
};

export default function OverviewScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { snapshot, loading, refreshing, error, reloadSnapshot } = useMobileOpsSnapshot();

  const onlineRate = useMemo(() => {
    if (!snapshot.endpoints.total) return 0;
    return Math.round((snapshot.endpoints.online / snapshot.endpoints.total) * 100);
  }, [snapshot.endpoints.online, snapshot.endpoints.total]);

  const attentionCount = Math.max(snapshot.endpoints.offline + snapshot.endpoints.stale + snapshot.tickets.slaExceeded, 0);
  const slaSafe = Math.max(0, Math.min(snapshot.tickets.slaAchievement || 0, 100));

  function handleRefresh() {
    reloadSnapshot({ silent: true });
  }

  function openTab(tabName: string) {
    navigation.getParent()?.navigate(tabName);
  }

  function openEndpoint(status?: string) {
    if (status === "online") {
      navigation.navigate("ActiveDeviceCoverage");
      return;
    }

    if (status === "offline" || status === "stale") {
      navigation.navigate("EndpointIssueList", { type: status });
      return;
    }

    navigation.navigate("EndpointSummary");
  }

  function openTickets() {
    navigation.navigate("TicketSummary");
  }

  return (
    <View style={styles.page}>
      <View style={{ height: insets.top, backgroundColor: ui.navy }} />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) + 104 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <LinearGradient
          colors={[ui.navy, ui.navy2, "#15325F"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroOrbOne} />
          <View style={styles.heroOrbTwo} />

          <View style={styles.headerRow}>
            <View style={styles.headerTextWrap}>
              <Text style={styles.eyebrow}>IT OPERATOR</Text>
              <Text style={styles.heroTitle}>Command Center</Text>
              <Text style={styles.heroMeta}>Live data · {snapshot.generatedAt}</Text>
            </View>

            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh} activeOpacity={0.86}>
              {loading || refreshing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <RefreshCcw size={18} color="#FFFFFF" strokeWidth={2.8} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.heroGlassCard}>
            <View>
              <Text style={styles.glassLabel}>Needs Attention</Text>
              <Text style={styles.glassValue}>{formatNumber(attentionCount)}</Text>
              <Text style={styles.glassHint}>Offline + stale endpoints + SLA exceed</Text>
            </View>

            <View style={styles.healthPill}>
              <CheckCircle2 size={15} color="#B7F7DD" strokeWidth={2.8} />
              <Text style={styles.healthText}>{onlineRate}% online</Text>
            </View>
          </View>
        </LinearGradient>

        {error ? (
          <View style={styles.alertCard}>
            <AlertTriangle size={18} color={ui.red} strokeWidth={2.8} />
            <View style={styles.alertTextWrap}>
              <Text style={styles.alertTitle}>Live data unavailable</Text>
              <Text style={styles.alertText}>{error}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.primaryActionRow}>
          <ActionButton
            label="Open Operator"
            hint="Devices and geolocation"
            icon={ShieldCheck}
            color={ui.blue}
            onPress={() => openTab("Operator")}
          />
          <ActionButton
            label="Open Reports"
            hint="Latest reports"
            icon={FileText}
            color={ui.purple}
            onPress={() => openTab("Reports")}
          />
        </View>

        <View style={styles.panel}>
          <View style={styles.sectionHeaderClean}>
            <View>
              <Text style={styles.sectionTitle}>Endpoint Fleet</Text>
              <Text style={styles.sectionSubtitle}>Tap a card to open the related view</Text>
            </View>
          </View>

          <View style={styles.metricGrid}>
            <FleetCard
              title="Managed Endpoints"
              value={snapshot.endpoints.total}
              caption="View endpoint summary"
              tone="blue"
              icon={Server}
              onPress={() => openEndpoint()}
            />
            <FleetCard
              title="Online Devices"
              value={snapshot.endpoints.online}
              caption="View active coverage"
              tone="green"
              icon={CheckCircle2}
              onPress={() => openEndpoint("online")}
            />
            <FleetCard
              title="Offline Devices"
              value={snapshot.endpoints.offline}
              caption="Investigate not reporting"
              tone="red"
              icon={WifiOff}
              onPress={() => openEndpoint("offline")}
            />
            <FleetCard
              title="Stale Devices"
              value={snapshot.endpoints.stale}
              caption="Review stale telemetry"
              tone="amber"
              icon={AlertTriangle}
              onPress={() => openEndpoint("stale")}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.serviceCard} activeOpacity={0.88} onPress={openTickets}>
          <View style={styles.serviceHeader}>
            <View style={styles.serviceIconWrap}>
              <Ticket size={20} color="#FFFFFF" strokeWidth={2.8} />
            </View>
            <View style={styles.serviceTitleWrap}>
              <Text style={styles.serviceTitle}>Service Desk</Text>
              <Text style={styles.serviceSubtitle}>Ticket workload and SLA exposure</Text>
            </View>
            <ArrowRight size={19} color={ui.muted} strokeWidth={2.8} />
          </View>

          <View style={styles.serviceMetricRow}>
            <MiniMetric label="Total" value={snapshot.tickets.total} />
            <MiniMetric label="Open" value={snapshot.tickets.open} />
            <MiniMetric label="Closed" value={snapshot.tickets.closed} />
            <MiniMetric label="SLA Exceed" value={snapshot.tickets.slaExceeded} danger />
          </View>

          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>SLA Achievement</Text>
            <Text style={styles.progressValue}>{slaSafe}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${slaSafe}%` }]} />
          </View>
        </TouchableOpacity>

        <View style={styles.sideBySideRow}>
          <TouchableOpacity style={styles.infoCard} activeOpacity={0.88} onPress={() => openTab("Operator")}>
            <LinearGradient
              colors={["#E7FBFF", "#FFFFFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.infoGradient}
            >
              <View style={[styles.infoIcon, { backgroundColor: "#D7F6FF" }]}>
                <MapPin size={19} color={ui.cyan} strokeWidth={2.8} />
              </View>
              <Text style={styles.infoTitle}>Device Geolocation</Text>
              <Text style={styles.infoDesc}>Latest location per device is in Operator view.</Text>
              <View style={styles.infoFooter}>
                <Text style={styles.infoValue}>{formatNumber(snapshot.locationTotal)}</Text>
                <Text style={styles.infoFooterText}>devices</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoCard} activeOpacity={0.88} onPress={() => openTab("Reports")}>
            <LinearGradient
              colors={["#F1EDFF", "#FFFFFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.infoGradient}
            >
              <View style={[styles.infoIcon, { backgroundColor: "#E9E1FF" }]}>
                <FileText size={19} color={ui.purple} strokeWidth={2.8} />
              </View>
              <Text style={styles.infoTitle}>Latest Report</Text>
              <Text style={styles.infoDesc} numberOfLines={2}>
                {snapshot.latestReport?.title || "No report item found."}
              </Text>
              <View style={styles.infoFooter}>
                <Text style={styles.infoFooterText}>Open Reports</Text>
                <ArrowRight size={15} color={ui.purple} strokeWidth={2.8} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function ActionButton({ label, hint, icon: Icon, color, onPress }: { label: string; hint: string; icon: any; color: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress} activeOpacity={0.86}>
      <View style={[styles.actionIcon, { backgroundColor: `${color}18` }]}>
        <Icon size={18} color={color} strokeWidth={2.8} />
      </View>
      <View style={styles.actionTextWrap}>
        <Text style={styles.actionLabel}>{label}</Text>
        <Text style={styles.actionHint}>{hint}</Text>
      </View>
    </TouchableOpacity>
  );
}

function FleetCard({
  title,
  value,
  caption,
  tone,
  icon: Icon,
  onPress,
}: {
  title: string;
  value: number;
  caption: string;
  tone: MetricTone;
  icon: any;
  onPress: () => void;
}) {
  const color = toneMap[tone];

  return (
    <TouchableOpacity style={styles.fleetCard} onPress={onPress} activeOpacity={0.86}>
      <View style={styles.fleetCardTop}>
        <View style={[styles.fleetIcon, { backgroundColor: `${color}16` }]}>
          <Icon size={18} color={color} strokeWidth={2.8} />
        </View>
        <ArrowRight size={16} color={ui.muted} strokeWidth={2.8} />
      </View>
      <Text style={styles.fleetValue}>{formatNumber(value)}</Text>
      <Text style={styles.fleetTitle}>{title}</Text>
      <Text style={styles.fleetCaption}>{caption}</Text>
    </TouchableOpacity>
  );
}

function MiniMetric({ label, value, danger }: { label: string; value: number; danger?: boolean }) {
  return (
    <View style={styles.miniMetric}>
      <Text style={[styles.miniValue, danger && { color: ui.red }]}>{formatNumber(value)}</Text>
      <Text style={styles.miniLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: ui.bg,
  },
  scrollArea: {
    flex: 1,
  },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    overflow: "hidden",
  },
  heroOrbOne: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: "rgba(47,98,216,0.42)",
    top: -112,
    right: -82,
  },
  heroOrbTwo: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 170,
    backgroundColor: "rgba(14,143,166,0.24)",
    bottom: -86,
    left: -70,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTextWrap: {
    flex: 1,
    paddingRight: 14,
  },
  eyebrow: {
    color: "#9DC2FF",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.3,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -1.2,
    marginTop: 6,
  },
  heroMeta: {
    color: "#B5C7DE",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 8,
  },
  refreshButton: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  heroGlassCard: {
    marginTop: 24,
    padding: 16,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.11)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  glassLabel: {
    color: "#D8E7FF",
    fontSize: 11,
    fontWeight: "800",
  },
  glassValue: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: -1.6,
    marginTop: 3,
  },
  glassHint: {
    color: "#9EB1CA",
    fontSize: 10.5,
    fontWeight: "700",
    marginTop: 2,
  },
  healthPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(31,157,101,0.18)",
    borderWidth: 1,
    borderColor: "rgba(183,247,221,0.18)",
  },
  healthText: {
    color: "#B7F7DD",
    fontSize: 11,
    fontWeight: "900",
  },
  alertCard: {
    marginHorizontal: 16,
    marginTop: 14,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#FFF5F5",
    borderWidth: 1,
    borderColor: "#FAD0D0",
    flexDirection: "row",
    alignItems: "center",
  },
  alertTextWrap: {
    flex: 1,
    marginLeft: 10,
  },
  alertTitle: {
    color: ui.ink,
    fontSize: 13,
    fontWeight: "900",
  },
  alertText: {
    color: ui.soft,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
  },
  primaryActionRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    marginTop: -16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: ui.card,
    borderRadius: 20,
    padding: 13,
    borderWidth: 1,
    borderColor: ui.line,
    shadowColor: "#4F6078",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  actionTextWrap: {
    gap: 3,
  },
  actionLabel: {
    color: ui.ink,
    fontSize: 13,
    fontWeight: "900",
  },
  actionHint: {
    color: ui.soft,
    fontSize: 10,
    fontWeight: "700",
  },
  panel: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: ui.card,
    borderRadius: 26,
    padding: 15,
    borderWidth: 1,
    borderColor: ui.line,
    shadowColor: "#4F6078",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 2,
  },
  sectionHeaderClean: {
    marginBottom: 13,
  },
  sectionTitle: {
    color: ui.ink,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: -0.35,
  },
  sectionSubtitle: {
    color: ui.soft,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  fleetCard: {
    width: "47.9%",
    minHeight: 138,
    backgroundColor: "#F8FBFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5EEF8",
    padding: 13,
  },
  fleetCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fleetIcon: {
    width: 37,
    height: 37,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  fleetValue: {
    color: ui.ink,
    fontSize: 29,
    fontWeight: "900",
    letterSpacing: -1,
    marginTop: 12,
  },
  fleetTitle: {
    color: ui.ink,
    fontSize: 12,
    fontWeight: "900",
    marginTop: 2,
  },
  fleetCaption: {
    color: ui.soft,
    fontSize: 10.3,
    fontWeight: "700",
    lineHeight: 14,
    marginTop: 4,
  },
  serviceCard: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: ui.card,
    borderRadius: 26,
    padding: 15,
    borderWidth: 1,
    borderColor: ui.line,
    shadowColor: "#4F6078",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 2,
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  serviceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 17,
    backgroundColor: ui.navy2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  serviceTitleWrap: {
    flex: 1,
  },
  serviceTitle: {
    color: ui.ink,
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  serviceSubtitle: {
    color: ui.soft,
    fontSize: 10.5,
    fontWeight: "700",
    marginTop: 3,
  },
  serviceMetricRow: {
    flexDirection: "row",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5EEF8",
    backgroundColor: "#F8FBFF",
  },
  miniMetric: {
    flex: 1,
    paddingVertical: 13,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#E5EEF8",
  },
  miniValue: {
    color: ui.ink,
    fontSize: 21,
    fontWeight: "900",
    letterSpacing: -0.6,
  },
  miniLabel: {
    color: ui.soft,
    fontSize: 9.5,
    fontWeight: "800",
    marginTop: 3,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    marginBottom: 7,
  },
  progressText: {
    color: ui.soft,
    fontSize: 10.5,
    fontWeight: "800",
  },
  progressValue: {
    color: ui.ink,
    fontSize: 10.5,
    fontWeight: "900",
  },
  progressTrack: {
    height: 7,
    borderRadius: 999,
    backgroundColor: "#E9EEF7",
    overflow: "hidden",
  },
  progressFill: {
    height: 7,
    borderRadius: 999,
    backgroundColor: ui.green,
  },
  sideBySideRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 14,
  },
  infoCard: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: ui.line,
    shadowColor: "#4F6078",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 2,
    backgroundColor: ui.card,
  },
  infoGradient: {
    minHeight: 166,
    padding: 14,
  },
  infoIcon: {
    width: 39,
    height: 39,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },
  infoTitle: {
    color: ui.ink,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 5,
  },
  infoDesc: {
    color: ui.soft,
    fontSize: 10.5,
    fontWeight: "700",
    lineHeight: 15,
    minHeight: 32,
  },
  infoFooter: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  infoValue: {
    color: ui.ink,
    fontSize: 23,
    fontWeight: "900",
    letterSpacing: -0.7,
  },
  infoFooterText: {
    color: ui.soft,
    fontSize: 10.5,
    fontWeight: "900",
  },
});
