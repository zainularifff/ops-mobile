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
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MapPin,
  Ticket,
  Timer,
  UserRound,
} from "lucide-react-native";

import StatusPill from "../../components/StatusPill";
import { colors } from "../../theme/colors";
import { formatNumber } from "../../utils/formatters";

const ticketRecords = [
  {
    id: "INC-24051",
    title: "Unable to access EMA agent dashboard",
    site: "Kuala Lumpur HQ",
    owner: "Support Team A",
    requester: "Operations User",
    status: "SLA Risk",
    priority: "High",
    type: "sla",
    due: "45 min left",
    updated: "18 min ago",
    summary:
      "Ticket is approaching SLA escalation threshold and requires immediate follow-up.",
    action:
      "Review ticket owner, update ticket progress, and escalate to support lead if resolution is blocked.",
  },
  {
    id: "INC-24076",
    title: "Endpoint agent not reporting after restart",
    site: "Putrajaya",
    owner: "Endpoint Support",
    requester: "Site Admin",
    status: "SLA Risk",
    priority: "High",
    type: "sla",
    due: "1 hour left",
    updated: "25 min ago",
    summary:
      "Endpoint support issue is close to escalation and requires status update.",
    action:
      "Verify endpoint agent service, confirm connectivity, and update ticket status.",
  },
  {
    id: "INC-24102",
    title: "User reported slow device performance",
    site: "Shah Alam",
    owner: "Support Team B",
    requester: "Branch User",
    status: "Pending",
    priority: "Medium",
    type: "pending",
    due: "Pending assignment",
    updated: "34 min ago",
    summary: "Ticket is pending support assignment or first response.",
    action:
      "Assign support owner and confirm whether issue is endpoint, network, or application related.",
  },
  {
    id: "INC-24118",
    title: "Software installation request pending approval",
    site: "Kuala Lumpur HQ",
    owner: "Service Desk",
    requester: "Finance User",
    status: "Pending",
    priority: "Medium",
    type: "pending",
    due: "Awaiting approval",
    updated: "42 min ago",
    summary:
      "Software request requires approval before installation can proceed.",
    action:
      "Check request approval status and validate software category against policy.",
  },
  {
    id: "INC-24130",
    title: "Remote support session in progress",
    site: "Johor Bahru",
    owner: "Remote Support",
    requester: "Branch User",
    status: "In Progress",
    priority: "Medium",
    type: "progress",
    due: "In progress",
    updated: "10 min ago",
    summary: "Support team is actively working on the issue.",
    action:
      "Monitor ticket progress and ensure resolution note is updated after support session.",
  },
  {
    id: "INC-24144",
    title: "Printer mapping issue resolved",
    site: "Putrajaya",
    owner: "Support Team A",
    requester: "Admin User",
    status: "Resolved",
    priority: "Low",
    type: "resolved",
    due: "Resolved today",
    updated: "1 hour ago",
    summary: "Ticket was resolved today and is available for closure review.",
    action:
      "Validate user confirmation and close ticket if no further issue is reported.",
  },
];

const screenConfig: any = {
  sla: {
    eyebrow: "SLA ESCALATION QUEUE",
    title: "SLA Risk Tickets",
    subtitle: "Tickets near escalation threshold requiring immediate follow-up.",
    heroTitle: "Escalation Focus",
    heroDesc:
      "This view highlights tickets that may breach SLA if no action is taken soon.",
    color: colors.red,
    icon: AlertTriangle,
    tone: "red" as const,
    primaryLabel: "SLA Risk",
    secondaryLabel: "Action Level",
    secondaryValue: "High",
    sectionTitle: "Tickets Near Breach",
    sectionDesc: "Prioritise these tickets before escalation.",
    chipLabel: "Escalate",
  },
  pending: {
    eyebrow: "PENDING TICKET QUEUE",
    title: "Pending Tickets",
    subtitle: "Tickets waiting for assignment, approval, or first response.",
    heroTitle: "Pending Workload",
    heroDesc:
      "This view helps identify support items that are waiting for the next action.",
    color: colors.amber,
    icon: Clock3,
    tone: "amber" as const,
    primaryLabel: "Pending",
    secondaryLabel: "Queue Status",
    secondaryValue: "Waiting",
    sectionTitle: "Pending Action Items",
    sectionDesc: "Review tickets waiting for owner or approval.",
    chipLabel: "Pending",
  },
  progress: {
    eyebrow: "IN PROGRESS QUEUE",
    title: "In Progress Tickets",
    subtitle: "Tickets currently handled by support or operation team.",
    heroTitle: "Active Support Work",
    heroDesc:
      "This view shows tickets already being handled and requiring progress monitoring.",
    color: colors.blue,
    icon: Timer,
    tone: "blue" as const,
    primaryLabel: "In Progress",
    secondaryLabel: "Work Status",
    secondaryValue: "Active",
    sectionTitle: "Tickets Being Handled",
    sectionDesc: "Monitor active support workload and owner progress.",
    chipLabel: "Progress",
  },
  resolved: {
    eyebrow: "RESOLVED TODAY",
    title: "Resolved Tickets",
    subtitle: "Tickets completed today and ready for closure review.",
    heroTitle: "Resolution Summary",
    heroDesc:
      "This view shows tickets resolved today for quick validation and closure awareness.",
    color: colors.green,
    icon: CheckCircle2,
    tone: "green" as const,
    primaryLabel: "Resolved",
    secondaryLabel: "Closure Status",
    secondaryValue: "Done",
    sectionTitle: "Resolved Today",
    sectionDesc: "Review recently completed support items.",
    chipLabel: "Resolved",
  },
};

export default function TicketWorkloadListScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();

  const params = route.params || {};
  const type = params.type || "sla";
  const config = screenConfig[type] || screenConfig.sla;
  const Icon = config.icon;

  const records = ticketRecords.filter((item) => item.type === type);

  function openTicket(record: any) {
    navigation.navigate("TicketQuickView", record);
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
        <Text style={[styles.eyebrow, { color: config.color }]}>
          {config.eyebrow}
        </Text>
        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.subtitle}>{config.subtitle}</Text>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={[styles.heroIcon, { backgroundColor: config.color }]}>
            <Icon size={26} color={colors.white} strokeWidth={2.7} />
          </View>

          <StatusPill label={config.chipLabel} tone={config.tone} />
        </View>

        <Text style={styles.heroTitle}>{config.heroTitle}</Text>
        <Text style={styles.heroDesc}>{config.heroDesc}</Text>

        <View style={styles.heroMetricRow}>
          <View style={styles.heroMetric}>
            <Text style={styles.heroMetricValue}>
              {formatNumber(records.length)}
            </Text>
            <Text style={styles.heroMetricLabel}>{config.primaryLabel}</Text>
          </View>

          <View style={styles.heroDivider} />

          <View style={styles.heroMetric}>
            <Text style={styles.heroMetricValue}>{config.secondaryValue}</Text>
            <Text style={styles.heroMetricLabel}>{config.secondaryLabel}</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{config.sectionTitle}</Text>
        <Text style={styles.sectionDesc}>{config.sectionDesc}</Text>
      </View>

      <View style={styles.ticketList}>
        {records.map((record, index) => (
          <TouchableOpacity
            key={record.id}
            activeOpacity={0.85}
            onPress={() => openTicket(record)}
            style={[
              styles.ticketCard,
              index === records.length - 1 && styles.ticketCardLast,
            ]}
          >
            <View style={styles.ticketCardTop}>
              <View style={styles.ticketIdentity}>
                <View
                  style={[
                    styles.ticketIcon,
                    { backgroundColor: `${config.color}18` },
                  ]}
                >
                  <Ticket size={18} color={config.color} strokeWidth={2.7} />
                </View>

                <View style={styles.ticketTitleWrap}>
                  <Text style={styles.ticketId}>{record.id}</Text>
                  <Text style={styles.ticketTitle}>{record.title}</Text>
                </View>
              </View>

              <StatusPill
                label={record.priority}
                tone={record.priority === "High" ? "red" : config.tone}
              />
            </View>

            <View style={styles.ticketInfoGrid}>
              <InfoMini
                icon={Clock3}
                label={type === "resolved" ? "Resolved" : "Due"}
                value={record.due}
              />
              <InfoMini icon={UserRound} label="Owner" value={record.owner} />
              <InfoMini icon={MapPin} label="Site" value={record.site} />
            </View>

            <View style={styles.ticketFooter}>
              <Text style={styles.updatedText}>Updated {record.updated}</Text>
              <Text style={[styles.openText, { color: config.color }]}>
                Tap for detail
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.notePanel}>
        <Text style={styles.noteTitle}>Mobile scope</Text>
        <Text style={styles.noteText}>
          This screen displays selected ticket previews only. Ticket comments,
          attachments, SLA audit trail and advanced filters remain in the main
          EMA web system.
        </Text>
      </View>
    </ScrollView>
  );
}

function InfoMini({ icon: Icon, label, value }: any) {
  return (
    <View style={styles.infoMini}>
      <Icon size={13} color={colors.muted} strokeWidth={2.6} />
      <View style={styles.infoMiniText}>
        <Text style={styles.infoMiniLabel}>{label}</Text>
        <Text style={styles.infoMiniValue}>{value}</Text>
      </View>
    </View>
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
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroIcon: {
    width: 54,
    height: 54,
    borderRadius: 19,
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

  ticketList: {
    marginBottom: 18,
  },
  ticketCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  ticketCardLast: {
    marginBottom: 0,
  },
  ticketCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  ticketIdentity: {
    flex: 1,
    flexDirection: "row",
  },
  ticketIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  ticketTitleWrap: {
    flex: 1,
  },
  ticketId: {
    color: colors.blue,
    fontSize: 10,
    fontWeight: "900",
    marginBottom: 3,
  },
  ticketTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 17,
  },
  ticketInfoGrid: {
    marginTop: 14,
    backgroundColor: colors.background,
    borderRadius: 18,
    padding: 12,
    gap: 10,
  },
  infoMini: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoMiniText: {
    marginLeft: 7,
    flex: 1,
  },
  infoMiniLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "800",
  },
  infoMiniValue: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "900",
    marginTop: 2,
  },
  ticketFooter: {
    marginTop: 13,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  updatedText: {
    color: colors.textSoft,
    fontSize: 10,
    fontWeight: "700",
  },
  openText: {
    fontSize: 10,
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
