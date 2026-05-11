import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AlertTriangle,
  ArrowLeft,
  Clock3,
  FileWarning,
  ShieldAlert,
  Ticket,
  WifiOff,
} from "lucide-react-native";

import StatusPill from "../../components/StatusPill";
import { colors } from "../../theme/colors";
import { dashboardSummary } from "../../data/mockDashboard";

const riskDrivers = [
  {
    title: "Stale devices",
    value: 42,
    desc: "No update for more than 7 days",
    icon: WifiOff,
    color: colors.red,
  },
  {
    title: "SLA risk tickets",
    value: 18,
    desc: "Tickets near escalation threshold",
    icon: Ticket,
    color: colors.purple,
  },
  {
    title: "Unauthorized software",
    value: 19,
    desc: "Pending review by operation/security team",
    icon: FileWarning,
    color: colors.amber,
  },
  {
    title: "Aging assets",
    value: 31,
    desc: "Potential replacement planning required",
    icon: Clock3,
    color: colors.blue,
  },
];

export default function RiskSummaryScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 24 }]}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <ArrowLeft size={20} color={colors.text} strokeWidth={2.7} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.eyebrow}>RISK DRILLDOWN</Text>
        <Text style={styles.title}>High Risk Overview</Text>
        <Text style={styles.subtitle}>
          Mobile summary of risk drivers that require quick attention.
        </Text>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroIcon}>
          <ShieldAlert size={25} color={colors.white} strokeWidth={2.7} />
        </View>

        <Text style={styles.heroTitle}>High Risk Items</Text>
        <Text style={styles.heroDesc}>
          Risk count is based on selected operational exception categories in this prototype.
        </Text>

        <View style={styles.heroMetricRow}>
          <View style={styles.heroMetric}>
            <Text style={styles.heroMetricValue}>{dashboardSummary.highRiskExceptions}</Text>
            <Text style={styles.heroMetricLabel}>High Risk</Text>
          </View>

          <View style={styles.heroDivider} />

          <View style={styles.heroMetric}>
            <Text style={styles.heroMetricValue}>4</Text>
            <Text style={styles.heroMetricLabel}>Risk Drivers</Text>
          </View>
        </View>
      </View>

      <View style={styles.driverPanel}>
        {riskDrivers.map((item, index) => {
          const Icon = item.icon;
          return (
            <View key={item.title} style={[styles.driverRow, index === riskDrivers.length - 1 && styles.lastRow]}>
              <View style={[styles.driverIcon, { backgroundColor: `${item.color}18` }]}>
                <Icon size={18} color={item.color} strokeWidth={2.7} />
              </View>

              <View style={styles.driverTextWrap}>
                <Text style={styles.driverTitle}>{item.title}</Text>
                <Text style={styles.driverDesc}>{item.desc}</Text>
              </View>

              <View style={styles.driverRight}>
                <Text style={styles.driverValue}>{item.value}</Text>
                <StatusPill label="Review" tone={item.color === colors.red ? "red" : "amber"} />
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.notePanel}>
        <Text style={styles.noteTitle}>Mobile scope</Text>
        <Text style={styles.noteText}>
          Full risk calculation, evidence trail and advanced investigation remain in the main EMA web system.
        </Text>
      </View>
    </ScrollView>
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
  backText: { color: colors.text, fontSize: 12, fontWeight: "900", marginLeft: 6 },
  header: { marginBottom: 16 },
  eyebrow: { color: colors.red, fontSize: 10, fontWeight: "900", letterSpacing: 1.2, marginBottom: 4 },
  title: { color: colors.text, fontSize: 25, fontWeight: "900", letterSpacing: -0.8 },
  subtitle: { color: colors.textSoft, fontSize: 12, fontWeight: "700", marginTop: 4, lineHeight: 18 },
  heroCard: { backgroundColor: colors.navy, borderRadius: 28, padding: 20, marginBottom: 16 },
  heroIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: colors.red,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: { color: colors.white, fontSize: 22, fontWeight: "900", marginTop: 18 },
  heroDesc: { color: "#AFC0D6", fontSize: 12, fontWeight: "600", lineHeight: 18, marginTop: 7 },
  heroMetricRow: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.12)",
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  heroMetric: { flex: 1 },
  heroMetricValue: { color: colors.white, fontSize: 25, fontWeight: "900" },
  heroMetricLabel: { color: "#8FA3BC", fontSize: 11, fontWeight: "700", marginTop: 4 },
  heroDivider: { width: 1, height: 38, backgroundColor: "rgba(255,255,255,0.14)", marginHorizontal: 16 },
  driverPanel: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 18,
  },
  driverRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  lastRow: { borderBottomWidth: 0 },
  driverIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  driverTextWrap: { flex: 1 },
  driverTitle: { color: colors.text, fontSize: 13, fontWeight: "900" },
  driverDesc: { color: colors.textSoft, fontSize: 11, fontWeight: "700", marginTop: 3 },
  driverRight: { alignItems: "flex-end", gap: 6 },
  driverValue: { color: colors.text, fontSize: 18, fontWeight: "900" },
  notePanel: { backgroundColor: colors.white, borderRadius: 24, padding: 16, borderWidth: 1, borderColor: colors.border },
  noteTitle: { color: colors.text, fontSize: 14, fontWeight: "900" },
  noteText: { color: colors.textSoft, fontSize: 12, fontWeight: "700", lineHeight: 18, marginTop: 5 },
});
