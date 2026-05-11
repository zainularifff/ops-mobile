import React, { useMemo, useState } from "react";
import {
  Modal,
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
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock3,
  Filter,
  MonitorCog,
  RadioTower,
  ShieldCheck,
  Ticket,
  X,
} from "lucide-react-native";

import StatusPill from "../../components/StatusPill";
import { colors } from "../../theme/colors";

type WorkType =
  | "all"
  | "endpoint"
  | "ticket"
  | "remote"
  | "software"
  | "asset";

const filters: { key: WorkType; label: string; description: string }[] = [
  {
    key: "all",
    label: "All Worklist Items",
    description: "Show all action items requiring review",
  },
  {
    key: "endpoint",
    label: "Endpoint Items",
    description: "Endpoint health and reporting follow-up",
  },
  {
    key: "ticket",
    label: "Ticket Items",
    description: "Support workload and SLA-related actions",
  },
  {
    key: "remote",
    label: "Remote Activity Items",
    description: "Remote session failures and audit review",
  },
  {
    key: "software",
    label: "Software Items",
    description: "Unauthorized or security-related software review",
  },
  {
    key: "asset",
    label: "Asset Items",
    description: "Asset aging and lifecycle follow-up",
  },
];

const workItems = [
  {
    id: "WL-001",
    type: "endpoint",
    title: "Endpoint not reporting",
    source: "JPJ-PUTRAJAYA-WS-014",
    site: "Putrajaya",
    priority: "High",
    status: "Open",
    due: "Today",
    updated: "2 days ago",
    owner: "Endpoint Support",
    reason: "Device has not reported within the expected monitoring window.",
    action:
      "Verify endpoint availability, network connection and agent service status.",
  },
  {
    id: "WL-002",
    type: "ticket",
    title: "SLA risk ticket requires follow-up",
    source: "INC-24051",
    site: "Kuala Lumpur HQ",
    priority: "High",
    status: "SLA Risk",
    due: "45 min left",
    updated: "18 min ago",
    owner: "Support Team A",
    reason:
      "Ticket is approaching escalation threshold and requires progress update.",
    action:
      "Review ticket owner, update progress and escalate if resolution is blocked.",
  },
  {
    id: "WL-003",
    type: "software",
    title: "Unauthorized software detected",
    source: "Unapproved Remote Tool",
    site: "Johor Bahru",
    priority: "High",
    status: "Review",
    due: "Today",
    updated: "25 min ago",
    owner: "Security Review",
    reason: "Detected software is not part of approved software list.",
    action:
      "Confirm business justification. Remove or approve according to governance process.",
  },
  {
    id: "WL-004",
    type: "remote",
    title: "Failed remote session attempt",
    source: "SHAH-ALAM-LAP-077",
    site: "Shah Alam",
    priority: "Medium",
    status: "Failed",
    due: "Today",
    updated: "21 min ago",
    owner: "Remote Support",
    reason:
      "Remote session failed due to connection timeout or endpoint availability issue.",
    action:
      "Check target device availability, remote permission and endpoint agent condition.",
  },
  {
    id: "WL-005",
    type: "asset",
    title: "Critical aging asset review",
    source: "SHAH-ALAM-PC-088",
    site: "Shah Alam",
    priority: "Medium",
    status: "Review",
    due: "This week",
    updated: "This month",
    owner: "Asset Management",
    reason:
      "Asset is in critical aging condition and may require replacement planning.",
    action:
      "Validate device age, business criticality and replacement priority.",
  },
];

export default function WorklistScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [activeFilter, setActiveFilter] = useState<WorkType>("all");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const activeFilterLabel =
    filters.find((item) => item.key === activeFilter)?.label ||
    "All Worklist Items";

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return workItems;
    return workItems.filter((item) => item.type === activeFilter);
  }, [activeFilter]);

  const highPriorityCount = workItems.filter(
    (item) => item.priority === "High"
  ).length;

  function openItem(item: any) {
    navigation.navigate("WorklistDetail", { item });
  }

  function selectFilter(key: WorkType) {
    setActiveFilter(key);
    setDropdownVisible(false);
  }

  return (
    <>
      <ScrollView
        style={styles.page}
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>EMA OPS MOBILE</Text>
          <Text style={styles.title}>Worklist</Text>
          <Text style={styles.subtitle}>
            Action queue for operational items that require review or follow-up.
          </Text>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.heroIcon}>
              <ClipboardList size={26} color={colors.white} strokeWidth={2.7} />
            </View>

            <StatusPill label="Action Queue" tone="blue" />
          </View>

          <Text style={styles.heroTitle}>Operational Action Items</Text>
          <Text style={styles.heroDesc}>
            Worklist is focused on items that require action, not full
            monitoring. Use Operations for module exploration.
          </Text>

          <View style={styles.heroMetricRow}>
            <View style={styles.heroMetric}>
              <Text style={styles.heroValue}>{workItems.length}</Text>
              <Text style={styles.heroMetricLabel}>Open Items</Text>
            </View>

            <View style={styles.heroDivider} />

            <View style={styles.heroMetric}>
              <Text style={styles.heroValue}>{highPriorityCount}</Text>
              <Text style={styles.heroMetricLabel}>High Priority</Text>
            </View>
          </View>
        </View>

        <View style={styles.filterHeader}>
          <View style={styles.filterTitleWrap}>
            <Filter size={15} color={colors.blue} strokeWidth={2.7} />
            <Text style={styles.filterTitle}>Worklist Type</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.dropdownButton}
          activeOpacity={0.85}
          onPress={() => setDropdownVisible(true)}
        >
          <View>
            <Text style={styles.dropdownLabel}>Selected type</Text>
            <Text style={styles.dropdownValue}>{activeFilterLabel}</Text>
          </View>

          <View style={styles.dropdownIconWrap}>
            <ChevronDown size={18} color={colors.blue} strokeWidth={2.7} />
          </View>
        </TouchableOpacity>

        <View style={styles.resultSummary}>
          <Text style={styles.resultText}>
            Showing {filteredItems.length} of {workItems.length} action items
          </Text>
        </View>

        <View style={styles.listWrap}>
          {filteredItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              style={styles.workCard}
              onPress={() => openItem(item)}
            >
              <View style={styles.workTop}>
                <View
                  style={[
                    styles.typeIcon,
                    { backgroundColor: `${getTypeColor(item.type)}18` },
                  ]}
                >
                  <WorkIcon type={item.type} color={getTypeColor(item.type)} />
                </View>

                <View style={styles.workTextWrap}>
                  <View style={styles.workIdRow}>
                    <Text
                      style={[
                        styles.workId,
                        { color: getTypeColor(item.type) },
                      ]}
                    >
                      {item.id}
                    </Text>

                    <StatusPill
                      label={item.priority}
                      tone={item.priority === "High" ? "red" : "amber"}
                    />
                  </View>

                  <Text style={styles.workTitle}>{item.title}</Text>
                  <Text style={styles.workSource}>{item.source}</Text>
                </View>
              </View>

              <View style={styles.metaBox}>
                <MetaItem label="Site" value={item.site} />
                <MetaItem label="Owner" value={item.owner} />
                <MetaItem label="Due" value={item.due} />
              </View>

              <View style={styles.workFooter}>
                <Text style={styles.updatedText}>Updated {item.updated}</Text>

                <View style={styles.openWrap}>
                  <Text
                    style={[
                      styles.openText,
                      { color: getTypeColor(item.type) },
                    ]}
                  >
                    Review
                  </Text>

                  <ChevronRight
                    size={16}
                    color={colors.muted}
                    strokeWidth={2.7}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal visible={dropdownVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.dropdownModal}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Select Worklist Type</Text>
                <Text style={styles.modalSubtitle}>
                  Filter action queue by operational area
                </Text>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                activeOpacity={0.85}
                onPress={() => setDropdownVisible(false)}
              >
                <X size={18} color={colors.textSoft} strokeWidth={2.7} />
              </TouchableOpacity>
            </View>

            <View style={styles.optionList}>
              {filters.map((item) => {
                const active = activeFilter === item.key;

                return (
                  <TouchableOpacity
                    key={item.key}
                    activeOpacity={0.85}
                    style={[
                      styles.optionRow,
                      active && styles.optionRowActive,
                    ]}
                    onPress={() => selectFilter(item.key)}
                  >
                    <View style={styles.optionTextWrap}>
                      <Text
                        style={[
                          styles.optionText,
                          active && styles.optionTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>

                      <Text style={styles.optionSubtext}>
                        {item.description}
                      </Text>
                    </View>

                    {active ? (
                      <StatusPill label="Selected" tone="blue" />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

function WorkIcon({ type, color }: any) {
  if (type === "endpoint") {
    return <MonitorCog size={19} color={color} strokeWidth={2.7} />;
  }

  if (type === "ticket") {
    return <Ticket size={19} color={color} strokeWidth={2.7} />;
  }

  if (type === "remote") {
    return <RadioTower size={19} color={color} strokeWidth={2.7} />;
  }

  if (type === "software") {
    return <ShieldCheck size={19} color={color} strokeWidth={2.7} />;
  }

  return <AlertTriangle size={19} color={color} strokeWidth={2.7} />;
}

function getTypeColor(type: string) {
  if (type === "endpoint") return colors.blue;
  if (type === "ticket") return colors.purple;
  if (type === "remote") return colors.cyan;
  if (type === "software") return colors.amber;
  if (type === "asset") return colors.green;
  return colors.blue;
}

function MetaItem({ label, value }: any) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
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
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroIcon: {
    width: 54,
    height: 54,
    borderRadius: 19,
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
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.12)",
    flexDirection: "row",
    alignItems: "center",
  },
  heroMetric: {
    flex: 1,
  },
  heroValue: {
    color: colors.white,
    fontSize: 24,
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

  filterHeader: {
    marginBottom: 9,
  },
  filterTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
    marginLeft: 6,
  },
  dropdownButton: {
    backgroundColor: colors.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "800",
    marginBottom: 3,
  },
  dropdownValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
  },
  dropdownIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: "#EAF1FF",
    alignItems: "center",
    justifyContent: "center",
  },
  resultSummary: {
    marginBottom: 12,
  },
  resultText: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "800",
  },

  listWrap: {
    gap: 12,
  },
  workCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
  },
  workTop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  workTextWrap: {
    flex: 1,
  },
  workIdRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 4,
  },
  workId: {
    fontSize: 10,
    fontWeight: "900",
  },
  workTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 18,
  },
  workSource: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
  },
  metaBox: {
    backgroundColor: colors.background,
    borderRadius: 18,
    padding: 12,
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: "800",
  },
  metaValue: {
    color: colors.text,
    fontSize: 10,
    fontWeight: "900",
    marginTop: 3,
  },
  workFooter: {
    marginTop: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  updatedText: {
    color: colors.textSoft,
    fontSize: 10,
    fontWeight: "700",
  },
  openWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  openText: {
    fontSize: 10,
    fontWeight: "900",
    marginRight: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(7, 17, 32, 0.62)",
    justifyContent: "flex-end",
  },
  dropdownModal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 28,
    maxHeight: "76%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
  },
  modalSubtitle: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  optionList: {
    gap: 10,
  },
  optionRow: {
    backgroundColor: colors.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionRowActive: {
    backgroundColor: "#EAF1FF",
    borderColor: "#BFD7FF",
  },
  optionTextWrap: {
    flex: 1,
    paddingRight: 10,
  },
  optionText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
  },
  optionTextActive: {
    color: colors.blue,
  },
  optionSubtext: {
    color: colors.textSoft,
    fontSize: 10,
    fontWeight: "700",
    marginTop: 3,
    lineHeight: 14,
  },
});