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
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Ticket,
  Timer,
} from "lucide-react-native";

import StatusPill from "../../components/StatusPill";
import { colors } from "../../theme/colors";
import { dashboardSummary } from "../../data/mockDashboard";
import { formatNumber } from "../../utils/formatters";

const ticketBreakdown = [
  {
    label: "SLA Risk",
    value: 18,
    desc: "Tickets near escalation threshold",
    tone: "red" as const,
    type: "sla",
  },
  {
    label: "Pending",
    value: 44,
    desc: "Waiting for action or assignment",
    tone: "amber" as const,
    type: "pending",
  },
  {
    label: "In Progress",
    value: 39,
    desc: "Currently handled by support team",
    tone: "blue" as const,
    type: "progress",
  },
  {
    label: "Resolved Today",
    value: 25,
    desc: "Closed or completed within today",
    tone: "green" as const,
    type: "resolved",
  },
];

export default function TicketSummaryScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  function openTicketList(type: string, title: string, subtitle: string) {
    navigation.navigate("TicketWorkloadList", {
      type,
      title,
      subtitle,
    });
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
        <Text style={styles.eyebrow}>TICKET DRILLDOWN</Text>
        <Text style={styles.title}>Ticket Workload</Text>
        <Text style={styles.subtitle}>
          Mobile summary for support queue, SLA risk and operational workload.
        </Text>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroIcon}>
          <Ticket size={25} color={colors.white} strokeWidth={2.7} />
        </View>

        <Text style={styles.heroTitle}>Open Support Workload</Text>
        <Text style={styles.heroDesc}>
          This view highlights ticket pressure suitable for mobile monitoring.
          Full ticket investigation remains in the main EMA web system.
        </Text>

        <View style={styles.heroMetricRow}>
          <View style={styles.heroMetric}>
            <Text style={styles.heroMetricValue}>
              {formatNumber(dashboardSummary.openTickets)}
            </Text>
            <Text style={styles.heroMetricLabel}>Open Tickets</Text>
          </View>

          <View style={styles.heroDivider} />

          <View style={styles.heroMetric}>
            <Text style={styles.heroMetricValue}>18</Text>
            <Text style={styles.heroMetricLabel}>SLA Risk</Text>
          </View>
        </View>
      </View>

      <View style={styles.breakdownPanel}>
        {ticketBreakdown.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            activeOpacity={0.85}
            onPress={() => openTicketList(item.type, item.label, item.desc)}
            style={[
              styles.row,
              index === ticketBreakdown.length - 1 && styles.lastRow,
            ]}
          >
            <View style={styles.rowIcon}>
              {item.type === "sla" ? (
                <AlertTriangle size={18} color={colors.red} strokeWidth={2.7} />
              ) : item.type === "pending" ? (
                <Clock3 size={18} color={colors.amber} strokeWidth={2.7} />
              ) : item.type === "resolved" ? (
                <CheckCircle2
                  size={18}
                  color={colors.green}
                  strokeWidth={2.7}
                />
              ) : (
                <Timer size={18} color={colors.blue} strokeWidth={2.7} />
              )}
            </View>

            <View style={styles.rowTextWrap}>
              <Text style={styles.rowTitle}>{item.label}</Text>
              <Text style={styles.rowDesc}>{item.desc}</Text>
            </View>

            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>{item.value}</Text>
              <StatusPill
                label={item.type === "sla" ? "Action" : "View"}
                tone={item.tone}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.notePanel}>
        <Text style={styles.noteTitle}>Mobile scope</Text>
        <Text style={styles.noteText}>
          This mobile view only shows support workload summary and selected
          ticket previews. Full ticket notes, attachments, history and advanced
          filters remain in the main EMA web system.
        </Text>
      </View>
    </ScrollView>
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
    color: colors.purple,
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
    backgroundColor: colors.purple,
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
  breakdownPanel: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 18,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  rowIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  rowTextWrap: {
    flex: 1,
  },
  rowTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
  },
  rowDesc: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
  },
  rowRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  rowValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
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
