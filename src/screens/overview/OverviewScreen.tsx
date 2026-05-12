import React, { useMemo, useState } from "react";
import {
  RefreshControl,
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
  const [refreshing, setRefreshing] = useState(false);

  const activeRate = useMemo(() => {
    if (!dashboardSummary.totalEndpoints) return 0;

    return Math.round(
      (dashboardSummary.activeDevices / dashboardSummary.totalEndpoints) * 100
    );
  }, []);

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

  function handleRefresh() {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 650);
  }

  return (
    <View style={styles.page}>
      <View style={[styles.safeTopBlock, { height: insets.top }]} />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: 18,
            paddingBottom: Math.max(insets.bottom, 18) + 118,
          },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
        contentInsetAdjustmentBehavior="never"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerTextWrap}>
            <Text style={styles.eyebrow}>EMA OPS MOBILE</Text>
            <Text style={styles.title}>Operations Overview</Text>

            <View style={styles.headerMetaRow}>
              <Text style={styles.headerMeta}>Malaysia Sites</Text>
              <View style={styles.dot} />
              <Text style={styles.headerMeta}>Mock Data</Text>
              <View style={styles.dot} />
              <Text style={styles.headerMeta}>Just now</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.refreshButton}
            activeOpacity={0.82}
            onPress={handleRefresh}
          >
            <RefreshCcw size={18} color={colors.blue} strokeWidth={2.7} />
          </TouchableOpacity>
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
              Lightweight companion view for quick monitoring, urgent
              exceptions and operational awareness across selected Malaysian
              sites.
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
                onPress={() => goTo("ActiveDeviceCoverage")}
              >
                <Text style={styles.heroMetricValue}>{activeRate}%</Text>
                <Text style={styles.heroMetricLabel}>Active Coverage</Text>
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
                <Text style={styles.heroMetricLabel}>High Risk</Text>
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
    </View>
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
  safeTopBlock: {
    backgroundColor: colors.background,
  },
  scrollArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: 18,
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
    letterSpacing: 1.25,
    marginBottom: 5,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.9,
  },
  headerMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 7,
  },
  headerMeta: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "800",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.muted,
    marginHorizontal: 7,
  },
  refreshButton: {
    width: 46,
    height: 46,
    borderRadius: 17,
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
    marginBottom: 22,
    overflow: "hidden",
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
  },
  heroGlowOne: {
    position: "absolute",
    width: 178,
    height: 178,
    borderRadius: 178,
    backgroundColor: "rgba(47,98,216,0.30)",
    top: -72,
    right: -64,
  },
  heroGlowTwo: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 150,
    backgroundColor: "rgba(21,136,168,0.22)",
    bottom: -74,
    left: -54,
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
    paddingHorizontal: 11,
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
    fontSize: 23,
    fontWeight: "900",
    letterSpacing: -0.7,
  },
  heroMetricLabel: {
    color: "#8FA3BC",
    fontSize: 10,
    fontWeight: "800",
    marginTop: 4,
  },
  heroDivider: {
    width: 1,
    height: 38,
    backgroundColor: "rgba(255,255,255,0.14)",
    marginHorizontal: 11,
  },

  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.45,
  },
  sectionDesc: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
    lineHeight: 16,
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
    minHeight: 136,
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
    marginTop: 14,
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
    paddingRight: 10,
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
    lineHeight: 15,
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
    paddingRight: 8,
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
    lineHeight: 17,
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
    lineHeight: 15,
  },
  severityWrap: {
    marginLeft: 4,
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
    paddingRight: 10,
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