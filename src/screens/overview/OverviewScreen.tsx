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
import { colors } from "../../theme/colors";
import { formatNumber } from "../../utils/formatters";

const ui = {
  bg: "#EEF3FA",
  ink: "#0B1220",
  softInk: "#53657C",
  muted: "#8795A7",
  card: "#FFFFFF",
  line: "#DDE7F3",
  navy: "#07111F",
  navy2: "#0B1E3A",
  blue: "#2357D5",
  cyan: "#0E8FA6",
  green: "#179C65",
  amber: "#D48619",
  red: "#D94444",
  purple: "#7455D6",
};

export default function OverviewScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { snapshot, loading, refreshing, error, reloadSnapshot } = useMobileOpsSnapshot();

  const endpointCoverage = useMemo(() => {
    if (!snapshot.endpoints.total) return 0;
    return Math.round((snapshot.endpoints.online / snapshot.endpoints.total) * 100);
  }, [snapshot.endpoints.online, snapshot.endpoints.total]);

  const slaSafe = Math.max(0, Math.min(snapshot.tickets.slaAchievement || 0, 100));
  const locationPreview = snapshot.locations.slice(0, 6);

  function handleRefresh() {
    reloadSnapshot({ silent: true });
  }

  function openTab(tabName: string) {
    navigation.getParent()?.navigate(tabName);
  }

  return (
    <View style={styles.page}>
      <View style={{ height: insets.top, backgroundColor: ui.navy }} />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 18) + 96 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <LinearGradient
          colors={[ui.navy, ui.navy2, "#102A53"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroGlowOne} />
          <View style={styles.heroGlowTwo} />

          <View style={styles.headerRow}>
            <View>
              <Text style={styles.eyebrow}>OPS MOBILE</Text>
              <Text style={styles.heroTitle}>Operations Snapshot</Text>
              <Text style={styles.heroMeta}>Live data · {snapshot.generatedAt}</Text>
            </View>

            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh} activeOpacity={0.85}>
              {loading || refreshing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <RefreshCcw size={18} color="#FFFFFF" strokeWidth={2.8} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.heroDivider} />

          <View style={styles.heroMetricRow}>
            <HeroMetric label="Endpoints" value={formatNumber(snapshot.endpoints.total)} />
            <View style={styles.heroMetricLine} />
            <HeroMetric label="Online" value={`${endpointCoverage}%`} />
            <View style={styles.heroMetricLine} />
            <HeroMetric label="Open Tickets" value={formatNumber(snapshot.tickets.open)} />
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

        <View style={styles.quickRow}>
          <TouchableOpacity style={styles.quickButton} onPress={() => openTab("Operator")} activeOpacity={0.86}>
            <ShieldCheck size={18} color={ui.blue} strokeWidth={2.8} />
            <Text style={styles.quickText}>Operator</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickButton} onPress={() => openTab("Reports")} activeOpacity={0.86}>
            <FileText size={18} color={ui.purple} strokeWidth={2.8} />
            <Text style={styles.quickText}>Reports</Text>
          </TouchableOpacity>
        </View>

        <Section title="Endpoint Fleet" subtitle="Online, offline and stale only">
          <View style={styles.compactGrid}>
            <MetricTile title="Total" value={snapshot.endpoints.total} color={ui.blue} icon={Server} />
            <MetricTile title="Online" value={snapshot.endpoints.online} color={ui.green} icon={CheckCircle2} />
            <MetricTile title="Offline" value={snapshot.endpoints.offline} color={ui.red} icon={WifiOff} />
            <MetricTile title="Stale" value={snapshot.endpoints.stale} color={ui.amber} icon={AlertTriangle} />
          </View>
        </Section>

        <Section title="Service Desk" subtitle="Ticket status and SLA exposure">
          <View style={styles.ticketPanel}>
            <View style={styles.ticketMainBlock}>
              <Text style={styles.ticketLabel}>Total Tickets</Text>
              <Text style={styles.ticketValue}>{formatNumber(snapshot.tickets.total)}</Text>
              <Text style={styles.ticketHint}>Open {formatNumber(snapshot.tickets.open)} · Closed {formatNumber(snapshot.tickets.closed)}</Text>
            </View>

            <View style={styles.slaBlock}>
              <View style={styles.slaIconWrap}>
                <Ticket size={18} color={ui.red} strokeWidth={2.8} />
              </View>
              <Text style={styles.slaValue}>{formatNumber(snapshot.tickets.slaExceeded)}</Text>
              <Text style={styles.slaLabel}>SLA Exceed</Text>
            </View>
          </View>

          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>SLA Achievement</Text>
            <Text style={styles.progressValue}>{slaSafe}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${slaSafe}%` }]} />
          </View>
        </Section>

        <Section
          title="Latest Device Locations"
          subtitle={`One latest location per device · ${formatNumber(snapshot.locationTotal)} devices`}
          action="Operator"
          onAction={() => openTab("Operator")}
        >
          {locationPreview.length === 0 ? (
            <Text style={styles.emptyText}>No geolocation record found.</Text>
          ) : (
            locationPreview.map((item, index) => (
              <LocationRow
                key={item.id}
                name={item.deviceName}
                address={item.address}
                user={item.username}
                time={item.time}
                isLast={index === locationPreview.length - 1}
              />
            ))
          )}
        </Section>

        <Section
          title="Latest Report"
          subtitle="Most recent generated/report catalog item"
          action="Reports"
          onAction={() => openTab("Reports")}
        >
          {snapshot.latestReport ? (
            <View style={styles.reportCard}>
              <View style={styles.reportIcon}>
                <FileText size={20} color="#FFFFFF" strokeWidth={2.8} />
              </View>
              <View style={styles.reportTextWrap}>
                <Text style={styles.reportTitle}>{snapshot.latestReport.title}</Text>
                <Text style={styles.reportDesc} numberOfLines={2}>{snapshot.latestReport.description}</Text>
                <Text style={styles.reportMeta}>{snapshot.latestReport.category} · {snapshot.latestReport.lastGenerated || "-"}</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.emptyText}>No report item found.</Text>
          )}
        </Section>
      </ScrollView>
    </View>
  );
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.heroMetric}>
      <Text style={styles.heroMetricValue}>{value}</Text>
      <Text style={styles.heroMetricLabel}>{label}</Text>
    </View>
  );
}

function Section({
  title,
  subtitle,
  children,
  action,
  onAction,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleWrap}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
        </View>
        {action && onAction ? (
          <TouchableOpacity style={styles.sectionAction} onPress={onAction} activeOpacity={0.85}>
            <Text style={styles.sectionActionText}>{action}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {children}
    </View>
  );
}

function MetricTile({ title, value, color, icon: Icon }: { title: string; value: number; color: string; icon: any }) {
  return (
    <View style={styles.metricTile}>
      <View style={[styles.metricIcon, { backgroundColor: `${color}16` }]}>
        <Icon size={17} color={color} strokeWidth={2.8} />
      </View>
      <Text style={styles.metricValue}>{formatNumber(value)}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
    </View>
  );
}

function LocationRow({
  name,
  address,
  user,
  time,
  isLast,
}: {
  name: string;
  address: string;
  user: string;
  time: string;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.locationRow, isLast && styles.noBorder]}>
      <View style={styles.locationIcon}>
        <MapPin size={16} color={ui.cyan} strokeWidth={2.8} />
      </View>
      <View style={styles.locationTextWrap}>
        <Text style={styles.locationName}>{name}</Text>
        <Text style={styles.locationAddress} numberOfLines={1}>{address}</Text>
        <Text style={styles.locationMeta}>{user} · {time}</Text>
      </View>
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
    paddingBottom: 22,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  heroGlowOne: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 190,
    backgroundColor: "rgba(35,87,213,0.42)",
    top: -88,
    right: -62,
  },
  heroGlowTwo: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 160,
    backgroundColor: "rgba(14,143,166,0.28)",
    bottom: -82,
    left: -72,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  eyebrow: {
    color: "#9DC2FF",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.8,
    marginTop: 6,
  },
  heroMeta: {
    color: "#B5C7DE",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 7,
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
  heroDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.16)",
    marginTop: 24,
    marginBottom: 18,
  },
  heroMetricRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  heroMetric: {
    flex: 1,
  },
  heroMetricValue: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "900",
    letterSpacing: -0.7,
  },
  heroMetricLabel: {
    color: "#8EA4BE",
    fontSize: 10,
    fontWeight: "900",
    marginTop: 4,
  },
  heroMetricLine: {
    width: 1,
    height: 36,
    backgroundColor: "rgba(255,255,255,0.16)",
    marginHorizontal: 12,
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
    color: ui.softInk,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
  },
  quickRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 14,
  },
  quickButton: {
    flex: 1,
    backgroundColor: ui.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: ui.line,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  quickText: {
    color: ui.ink,
    fontSize: 12,
    fontWeight: "900",
  },
  sectionCard: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: ui.card,
    borderRadius: 22,
    padding: 15,
    borderWidth: 1,
    borderColor: ui.line,
    shadowColor: "#5B6B83",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 13,
  },
  sectionTitleWrap: {
    flex: 1,
    paddingRight: 10,
  },
  sectionTitle: {
    color: ui.ink,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: -0.25,
  },
  sectionSubtitle: {
    color: ui.softInk,
    fontSize: 10.5,
    fontWeight: "700",
    marginTop: 4,
  },
  sectionAction: {
    backgroundColor: "#EDF4FF",
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999,
  },
  sectionActionText: {
    color: ui.blue,
    fontSize: 10,
    fontWeight: "900",
  },
  compactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metricTile: {
    width: "47.9%",
    minHeight: 104,
    backgroundColor: "#F8FBFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5EEF8",
    padding: 12,
  },
  metricIcon: {
    width: 34,
    height: 34,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  metricValue: {
    color: ui.ink,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.7,
    marginTop: 10,
  },
  metricTitle: {
    color: ui.softInk,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 3,
  },
  ticketPanel: {
    flexDirection: "row",
    gap: 10,
  },
  ticketMainBlock: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: "#F8FBFF",
    borderWidth: 1,
    borderColor: "#E5EEF8",
    padding: 14,
  },
  ticketLabel: {
    color: ui.softInk,
    fontSize: 11,
    fontWeight: "800",
  },
  ticketValue: {
    color: ui.ink,
    fontSize: 31,
    fontWeight: "900",
    marginTop: 7,
    letterSpacing: -0.9,
  },
  ticketHint: {
    color: ui.softInk,
    fontSize: 10.5,
    fontWeight: "700",
    marginTop: 3,
  },
  slaBlock: {
    width: 105,
    borderRadius: 18,
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FED7AA",
    padding: 13,
    alignItems: "center",
  },
  slaIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  slaValue: {
    color: ui.red,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 8,
  },
  slaLabel: {
    color: ui.softInk,
    fontSize: 10,
    fontWeight: "900",
    marginTop: 2,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    marginBottom: 7,
  },
  progressText: {
    color: ui.softInk,
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
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F8",
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  locationIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: "#E6F7FB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  locationTextWrap: {
    flex: 1,
  },
  locationName: {
    color: ui.ink,
    fontSize: 12.5,
    fontWeight: "900",
  },
  locationAddress: {
    color: ui.softInk,
    fontSize: 10.5,
    fontWeight: "700",
    marginTop: 3,
  },
  locationMeta: {
    color: ui.muted,
    fontSize: 10,
    fontWeight: "700",
    marginTop: 3,
  },
  reportCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FBFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5EEF8",
    padding: 13,
  },
  reportIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: ui.purple,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  reportTextWrap: {
    flex: 1,
  },
  reportTitle: {
    color: ui.ink,
    fontSize: 13,
    fontWeight: "900",
  },
  reportDesc: {
    color: ui.softInk,
    fontSize: 10.5,
    fontWeight: "700",
    marginTop: 4,
    lineHeight: 15,
  },
  reportMeta: {
    color: ui.muted,
    fontSize: 10,
    fontWeight: "800",
    marginTop: 6,
  },
  emptyText: {
    color: ui.softInk,
    fontSize: 11,
    fontWeight: "700",
    paddingVertical: 4,
  },
});
