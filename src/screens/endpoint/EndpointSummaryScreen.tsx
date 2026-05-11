import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MapPin,
  MonitorCog,
  Server,
  WifiOff,
} from "lucide-react-native";

import StatusPill from "../../components/StatusPill";
import { colors } from "../../theme/colors";
import { dashboardSummary } from "../../data/mockDashboard";
import { formatNumber } from "../../utils/formatters";

const siteBreakdown = [
  { site: "Kuala Lumpur HQ", total: 1280, issue: 74 },
  { site: "Putrajaya", total: 980, issue: 52 },
  { site: "Shah Alam", total: 740, issue: 41 },
  { site: "Johor Bahru", total: 610, issue: 33 },
];

export default function EndpointSummaryScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  function openIssue(type: "offline" | "stale" | "review") {
    navigation.navigate("EndpointIssueList", { type });
  }

  function openSite(item: { site: string; total: number; issue: number }) {
    navigation.navigate("SiteEndpointSummary", item);
  }

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.85}
      >
        <ArrowLeft size={20} color={colors.text} strokeWidth={2.7} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.eyebrow}>ENDPOINT DRILLDOWN</Text>
        <Text style={styles.title}>Endpoint Summary</Text>
        <Text style={styles.subtitle}>
          Mobile summary for managed endpoint coverage and reporting status.
        </Text>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroIcon}>
          <Server size={25} color={colors.white} strokeWidth={2.7} />
        </View>

        <Text style={styles.heroTitle}>Managed Endpoint Coverage</Text>
        <Text style={styles.heroDesc}>
          This view explains endpoint count, active coverage, offline devices
          and stale reporting.
        </Text>

        <View style={styles.heroMetricRow}>
          <View style={styles.heroMetric}>
            <Text style={styles.heroMetricValue}>
              {formatNumber(dashboardSummary.totalEndpoints)}
            </Text>
            <Text style={styles.heroMetricLabel}>Managed</Text>
          </View>

          <View style={styles.heroDivider} />

          <View style={styles.heroMetric}>
            <Text style={styles.heroMetricValue}>
              {formatNumber(dashboardSummary.activeDevices)}
            </Text>
            <Text style={styles.heroMetricLabel}>Active</Text>
          </View>
        </View>
      </View>

      <View style={styles.kpiGrid}>
        <SmallMetric
          label="Active Devices"
          value={dashboardSummary.activeDevices}
          icon={CheckCircle2}
          color={colors.green}
          onPress={() => navigation.navigate("ActiveDeviceCoverage")}
        />

        <SmallMetric
          label="Offline Devices"
          value={dashboardSummary.offlineDevices}
          icon={WifiOff}
          color={colors.red}
          onPress={() => openIssue("offline")}
        />

        <SmallMetric
          label="Stale > 7 Days"
          value={317}
          icon={Clock3}
          color={colors.amber}
          onPress={() => openIssue("stale")}
        />

        <SmallMetric
          label="Need Review"
          value={42}
          icon={MonitorCog}
          color={colors.purple}
          onPress={() => openIssue("review")}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Top Site Summary</Text>
        <Text style={styles.sectionDesc}>
          Tap site to view selected endpoint breakdown
        </Text>
      </View>

      <View style={styles.listPanel}>
        {siteBreakdown.map((item, index) => (
          <TouchableOpacity
            key={item.site}
            activeOpacity={0.85}
            onPress={() => openSite(item)}
            style={[
              styles.siteRow,
              index === siteBreakdown.length - 1 && styles.lastRow,
            ]}
          >
            <View style={styles.siteIcon}>
              <MapPin size={18} color={colors.blue} strokeWidth={2.7} />
            </View>

            <View style={styles.siteTextWrap}>
              <Text style={styles.siteTitle}>{item.site}</Text>
              <Text style={styles.siteMeta}>
                {formatNumber(item.total)} endpoints · {item.issue} requiring
                review
              </Text>
            </View>

            <StatusPill
              label={item.issue > 60 ? "High" : "Watch"}
              tone={item.issue > 60 ? "red" : "amber"}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.notePanel}>
        <Text style={styles.noteTitle}>Mobile scope</Text>
        <Text style={styles.noteText}>
          Full device inventory, advanced filtering and complete endpoint table
          remain in the main EMA web system.
        </Text>
      </View>
    </ScrollView>
  );
}

function SmallMetric({ label, value, icon: Icon, color, onPress }: any) {
  return (
    <TouchableOpacity
      style={styles.smallCard}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={[styles.smallIcon, { backgroundColor: `${color}18` }]}>
        <Icon size={18} color={color} strokeWidth={2.7} />
      </View>

      <Text style={styles.smallValue}>{formatNumber(value)}</Text>
      <Text style={styles.smallLabel}>{label}</Text>
      <Text style={styles.drillHint}>Tap to view</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: 18,
    paddingBottom: 110,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 16,
  },
  backText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "900",
    marginLeft: 6,
  },
  header: {
    marginBottom: 16,
  },
  eyebrow: {
    color: colors.blue,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  title: {
    color: colors.text,
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: -0.8,
  },
  subtitle: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
    lineHeight: 18,
  },
  heroCard: {
    backgroundColor: colors.navy,
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
  },
  heroIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: colors.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 18,
  },
  heroDesc: {
    color: "#AFC0D6",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
    marginTop: 7,
  },
  heroMetricRow: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.12)",
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  heroMetric: {
    flex: 1,
  },
  heroMetricValue: {
    color: colors.white,
    fontSize: 25,
    fontWeight: "900",
  },
  heroMetricLabel: {
    color: "#8FA3BC",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
  },
  heroDivider: {
    width: 1,
    height: 38,
    backgroundColor: "rgba(255,255,255,0.14)",
    marginHorizontal: 16,
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  smallCard: {
    width: "48%",
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    minHeight: 140,
  },
  smallIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  smallValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 14,
  },
  smallLabel: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 4,
  },
  drillHint: {
    color: colors.blue,
    fontSize: 10,
    fontWeight: "900",
    marginTop: 8,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
  },
  sectionDesc: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
  },
  listPanel: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 18,
  },
  siteRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  siteIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: "#EAF1FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  siteTextWrap: {
    flex: 1,
  },
  siteTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
  },
  siteMeta: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
  },
  notePanel: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noteTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
  },
  noteText: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 5,
  },
});
