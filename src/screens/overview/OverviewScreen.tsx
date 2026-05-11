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
  CheckCircle2,
  Clock3,
  FileWarning,
  RefreshCcw,
  Server,
  ShieldCheck,
  Ticket,
  WifiOff,
} from "lucide-react-native";

import StatusPill from "../../components/StatusPill";
import { dashboardSummary } from "../../data/mockDashboard";
import { colors } from "../../theme/colors";
import { formatNumber } from "../../utils/formatters";

const todayAttention = [
  {
    title: "Offline / Not Reporting",
    value: 358,
    note: "Devices require endpoint follow-up",
    icon: WifiOff,
    color: colors.red,
    tone: "red" as const,
    label: "Action",
    target: "EndpointSummary",
  },
  {
    title: "Stale Devices",
    value: 317,
    note: "No update for more than 7 days",
    icon: Clock3,
    color: colors.amber,
    tone: "amber" as const,
    label: "Watch",
    target: "EndpointSummary",
  },
  {
    title: "SLA Risk",
    value: 18,
    note: "Tickets near escalation threshold",
    icon: Ticket,
    color: colors.purple,
    tone: "purple" as const,
    label: "Escalate",
    target: "TicketSummary",
  },
];

const operationalExceptions = [
  {
    title: "Stale device detected",
    source: "JPJ-PUTRAJAYA-WS-014",
    site: "Putrajaya",
    time: "12 min ago",
    severity: "High",
    icon: WifiOff,
    color: colors.red,
    reason:
      "Device has not reported update within the expected monitoring window.",
    recommendedAction:
      "Verify endpoint status, network availability, and agent health. Escalate to site support if device is still active.",
  },
  {
    title: "SLA risk ticket pending",
    source: "INC-24051",
    site: "Kuala Lumpur HQ",
    time: "18 min ago",
    severity: "High",
    icon: Ticket,
    color: colors.red,
    reason:
      "Ticket is approaching SLA escalation threshold and requires follow-up.",
    recommendedAction:
      "Review ticket owner, update ticket progress, and escalate to support lead if resolution is blocked.",
  },
  {
    title: "Unauthorized software pending review",
    source: "SHAH-ALAM-LAP-022",
    site: "Shah Alam",
    time: "25 min ago",
    severity: "Medium",
    icon: FileWarning,
    color: colors.amber,
    reason:
      "Detected software requires validation against approved software policy.",
    recommendedAction:
      "Confirm whether software is approved, business-required, or should be removed from the endpoint.",
  },
];

export default function OverviewScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  function goTo(target: string) {
    navigation.navigate(target);
  }

  function openException(item: (typeof operationalExceptions)[number]) {
    navigation.navigate("ExceptionDetail", {
      title: item.title,
      source: item.source,
      site: item.site,
      time: item.time,
      severity: item.severity,
      reason: item.reason,
      recommendedAction: item.recommendedAction,
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
      <View style={styles.header}>
        <View style={styles.headerTextWrap}>
          <Text style={styles.eyebrow}>EMA OPS MOBILE</Text>
          <Text style={styles.title}>Operations Overview</Text>
          <Text style={styles.subtitle}>
            Malaysia Sites · Mock Data · Last updated just now
          </Text>
        </View>

        <View style={styles.refreshButton}>
          <RefreshCcw size={18} color={colors.blue} strokeWidth={2.7} />
        </View>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroGlowOne} />
        <View style={styles.heroGlowTwo} />

        <View style={styles.heroContent}>
          <View style={styles.heroTop}>
            <View style={styles.heroIcon}>
              <ShieldCheck size={25} color={colors.white} strokeWidth={2.7} />
            </View>

            <View style={styles.heroStatus}>
              <Text style={styles.heroStatusText}>MONITORING VIEW</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>Operational Health Status</Text>

          <Text style={styles.heroDesc}>
            Lightweight mobile companion view for quick monitoring, urgent
            exceptions and operational awareness across selected Malaysian sites.
          </Text>

          <View style={styles.heroMetricRow}>
            <TouchableOpacity
              style={styles.heroMetric}
              activeOpacity={0.85}
              onPress={() => goTo("EndpointSummary")}
            >
              <Text style={styles.heroMetricValue}>
                {formatNumber(dashboardSummary.totalEndpoints)}
              </Text>
              <Text style={styles.heroMetricLabel}>Managed Endpoints</Text>
            </TouchableOpacity>

            <View style={styles.heroDivider} />

            <TouchableOpacity
              style={styles.heroMetric}
              activeOpacity={0.85}
              onPress={() => goTo("RiskSummary")}
            >
              <Text style={styles.heroMetricValue}>
                {formatNumber(dashboardSummary.highRiskExceptions)}
              </Text>
              <Text style={styles.heroMetricLabel}>High Risk Items</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Command Summary</Text>
        <Text style={styles.sectionDesc}>
          High-level operational position for mobile view
        </Text>
      </View>

      <View style={styles.summaryGrid}>
        <SummaryCard
          title="Managed"
          value={dashboardSummary.totalEndpoints}
          note="Total endpoints"
          icon={Server}
          color={colors.blue}
          onPress={() => goTo("EndpointSummary")}
        />

        <SummaryCard
          title="Active"
          value={dashboardSummary.activeDevices}
          note="Reporting normally"
          icon={CheckCircle2}
          color={colors.green}
          onPress={() => goTo("ActiveDeviceCoverage")}
        />

        <SummaryCard
          title="Tickets"
          value={dashboardSummary.openTickets}
          note="Open workload"
          icon={Ticket}
          color={colors.purple}
          onPress={() => goTo("TicketSummary")}
        />

        <SummaryCard
          title="High Risk"
          value={dashboardSummary.highRiskExceptions}
          note="Need attention"
          icon={AlertTriangle}
          color={colors.red}
          onPress={() => goTo("RiskSummary")}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today’s Attention</Text>
        <Text style={styles.sectionDesc}>
          Selected issue drivers suitable for mobile monitoring
        </Text>
      </View>

      <View style={styles.attentionList}>
        {todayAttention.map((item, index) => (
          <AttentionRow
            key={item.title}
            title={item.title}
            value={item.value}
            note={item.note}
            icon={item.icon}
            color={item.color}
            tone={item.tone}
            label={item.label}
            isLast={index === todayAttention.length - 1}
            onPress={() => goTo(item.target)}
          />
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Operational Exceptions</Text>
        <Text style={styles.sectionDesc}>
          Latest records generated from operational rules
        </Text>
      </View>

      <View style={styles.exceptionPanel}>
        {operationalExceptions.map((item, index) => (
          <ExceptionRow
            key={item.title}
            title={item.title}
            source={item.source}
            site={item.site}
            time={item.time}
            severity={item.severity}
            icon={item.icon}
            color={item.color}
            isLast={index === operationalExceptions.length - 1}
            onPress={() => openException(item)}
          />
        ))}
      </View>

      <View style={styles.statusPanel}>
        <View style={styles.statusRow}>
          <View style={styles.statusIcon}>
            <Clock3 size={18} color={colors.cyan} strokeWidth={2.7} />
          </View>

          <View style={styles.statusTextWrap}>
            <Text style={styles.statusTitle}>Mobile Companion View</Text>
            <Text style={styles.statusDesc}>
              Full charts, tables, filters and detailed analysis remain in the
              main EMA web system.
            </Text>
          </View>

          <StatusPill label="UAT" tone="blue" />
        </View>
      </View>
    </ScrollView>
  );
}

type SummaryCardProps = {
  title: string;
  value: number;
  note: string;
  icon: any;
  color: string;
  onPress: () => void;
};

function SummaryCard({
  title,
  value,
  note,
  icon: Icon,
  color,
  onPress,
}: SummaryCardProps) {
  return (
    <TouchableOpacity
      style={styles.summaryCard}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={[styles.summaryIcon, { backgroundColor: `${color}18` }]}>
        <Icon size={19} color={color} strokeWidth={2.7} />
      </View>

      <Text style={styles.summaryValue}>{formatNumber(value)}</Text>
      <Text style={styles.summaryTitle}>{title}</Text>
      <Text style={styles.summaryNote}>{note}</Text>
      <Text style={styles.drillHint}>Tap to view</Text>
    </TouchableOpacity>
  );
}

type AttentionRowProps = {
  title: string;
  value: number;
  note: string;
  icon: any;
  color: string;
  tone: "red" | "amber" | "purple" | "blue" | "green";
  label: string;
  isLast?: boolean;
  onPress: () => void;
};

function AttentionRow({
  title,
  value,
  note,
  icon: Icon,
  color,
  tone,
  label,
  isLast = false,
  onPress,
}: AttentionRowProps) {
  return (
    <TouchableOpacity
      style={[styles.attentionRow, isLast && styles.rowLast]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={[styles.attentionIcon, { backgroundColor: `${color}18` }]}>
        <Icon size={19} color={color} strokeWidth={2.7} />
      </View>

      <View style={styles.attentionTextWrap}>
        <Text style={styles.attentionTitle}>{title}</Text>
        <Text style={styles.attentionNote}>{note}</Text>
      </View>

      <View style={styles.attentionRight}>
        <Text style={styles.attentionValue}>{formatNumber(value)}</Text>
        <StatusPill label={label} tone={tone} />
      </View>
    </TouchableOpacity>
  );
}

type ExceptionRowProps = {
  title: string;
  source: string;
  site: string;
  time: string;
  severity: string;
  icon: any;
  color: string;
  isLast?: boolean;
  onPress: () => void;
};

function ExceptionRow({
  title,
  source,
  site,
  time,
  severity,
  icon: Icon,
  color,
  isLast = false,
  onPress,
}: ExceptionRowProps) {
  const tone = severity === "High" ? "red" : "amber";

  return (
    <TouchableOpacity
      style={[styles.exceptionRow, isLast && styles.rowLast]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={[styles.exceptionIcon, { backgroundColor: `${color}18` }]}>
        <Icon size={18} color={color} strokeWidth={2.7} />
      </View>

      <View style={styles.exceptionTextWrap}>
        <View style={styles.exceptionTop}>
          <Text style={styles.exceptionTitle}>{title}</Text>
          <Text style={styles.exceptionTime}>{time}</Text>
        </View>

        <Text style={styles.exceptionMeta}>
          {source} · {site}
        </Text>
      </View>

      <View style={styles.severityWrap}>
        <StatusPill label={severity} tone={tone} />
      </View>
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
  header: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTextWrap: {
    flex: 1,
    paddingRight: 12,
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
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  heroCard: {
    backgroundColor: colors.navy,
    borderRadius: 28,
    padding: 20,
    marginBottom: 20,
    overflow: "hidden",
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
  },
  heroGlowOne: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: "rgba(47,98,216,0.30)",
    top: -70,
    right: -60,
  },
  heroGlowTwo: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 150,
    backgroundColor: "rgba(21,136,168,0.22)",
    bottom: -70,
    left: -50,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: colors.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  heroStatus: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  heroStatusText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
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
    letterSpacing: -0.7,
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

  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  sectionDesc: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
  },

  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  summaryCard: {
    width: "48%",
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    minHeight: 142,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryValue: {
    color: colors.text,
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: -0.7,
    marginTop: 15,
  },
  summaryTitle: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "900",
    marginTop: 4,
  },
  summaryNote: {
    color: colors.textSoft,
    fontSize: 10,
    fontWeight: "700",
    marginTop: 3,
  },
  drillHint: {
    color: colors.blue,
    fontSize: 10,
    fontWeight: "900",
    marginTop: 8,
  },

  attentionList: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 20,
  },
  attentionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  attentionIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  attentionTextWrap: {
    flex: 1,
  },
  attentionTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
  },
  attentionNote: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
  },
  attentionRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  attentionValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },

  exceptionPanel: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 18,
  },
  exceptionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  exceptionIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  exceptionTextWrap: {
    flex: 1,
  },
  exceptionTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  exceptionTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
  },
  exceptionTime: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "800",
  },
  exceptionMeta: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
  },
  severityWrap: {
    marginLeft: 8,
  },

  statusPanel: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: "#E9F7FB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  statusTextWrap: {
    flex: 1,
  },
  statusTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
  },
  statusDesc: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
    lineHeight: 16,
  },
});
