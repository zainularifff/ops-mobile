import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MapPin,
  MonitorCog,
  WifiOff,
} from "lucide-react-native";

import StatusPill from "../../components/StatusPill";
import { colors } from "../../theme/colors";
import { formatNumber } from "../../utils/formatters";

export default function SiteEndpointSummaryScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();

  const site = route.params?.site || "Putrajaya";
  const total = route.params?.total || 980;
  const issue = route.params?.issue || 52;

  const active = total - issue;
  const offline = Math.round(issue * 0.45);
  const stale = Math.round(issue * 0.35);
  const review = issue - offline - stale;

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
        <Text style={styles.eyebrow}>SITE ENDPOINT SUMMARY</Text>
        <Text style={styles.title}>{site}</Text>
        <Text style={styles.subtitle}>
          Selected endpoint breakdown for site-level mobile monitoring.
        </Text>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroIcon}>
          <MapPin size={25} color={colors.white} strokeWidth={2.7} />
        </View>

        <Text style={styles.heroTitle}>{site}</Text>
        <Text style={styles.heroDesc}>
          This view summarises active, offline, stale and review items for the
          selected site.
        </Text>

        <View style={styles.heroMetricRow}>
          <View style={styles.heroMetric}>
            <Text style={styles.heroMetricValue}>{formatNumber(total)}</Text>
            <Text style={styles.heroMetricLabel}>Total Endpoints</Text>
          </View>

          <View style={styles.heroDivider} />

          <View style={styles.heroMetric}>
            <Text style={styles.heroMetricValue}>{formatNumber(issue)}</Text>
            <Text style={styles.heroMetricLabel}>Need Review</Text>
          </View>
        </View>
      </View>

      <View style={styles.metricGrid}>
        <MetricCard
          title="Active"
          value={active}
          icon={CheckCircle2}
          color={colors.green}
        />
        <MetricCard
          title="Offline"
          value={offline}
          icon={WifiOff}
          color={colors.red}
        />
        <MetricCard
          title="Stale"
          value={stale}
          icon={Clock3}
          color={colors.amber}
        />
        <MetricCard
          title="Review"
          value={review}
          icon={MonitorCog}
          color={colors.purple}
        />
      </View>

      <View style={styles.statusPanel}>
        <Text style={styles.statusTitle}>Site Status</Text>
        <Text style={styles.statusDesc}>
          {issue} endpoint records require review at this site. Full site
          inventory and advanced filtering remain in the main EMA web system.
        </Text>

        <View style={styles.statusFooter}>
          <StatusPill label={issue > 60 ? "High" : "Watch"} tone={issue > 60 ? "red" : "amber"} />
        </View>
      </View>
    </ScrollView>
  );
}

function MetricCard({ title, value, icon: Icon, color }: any) {
  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricIcon, { backgroundColor: `${color}18` }]}>
        <Icon size={18} color={color} strokeWidth={2.7} />
      </View>

      <Text style={styles.metricValue}>{formatNumber(value)}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 18, paddingBottom: 110 },
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
  header: { marginBottom: 16 },
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
    marginBottom: 18,
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
  heroMetric: { flex: 1 },
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
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  metricCard: {
    width: "48%",
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  metricIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  metricValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 14,
  },
  metricTitle: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 4,
  },
  statusPanel: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
  },
  statusDesc: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 5,
  },
  statusFooter: {
    marginTop: 14,
  },
});
