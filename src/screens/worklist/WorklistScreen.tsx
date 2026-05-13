import React, { useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Filter,
  MonitorCog,
  RadioTower,
  ShieldCheck,
  Ticket,
  X,
} from "lucide-react-native";

import StatusPill from "../../components/StatusPill";
import { colors } from "../../theme/colors";

import {
  openTextStyle,
  styles,
  typeIconStyle,
  workIdStyle,
} from "./WorklistScreen.styles";

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
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <ScrollView
          style={styles.page}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.header}>
            <Text style={styles.eyebrow}>EMA OPS MOBILE</Text>
            <Text style={styles.title}>Worklist</Text>
            <Text style={styles.subtitle}>
              Action queue for operational items that require review or
              follow-up.
            </Text>
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroTop}>
              <View style={styles.heroIcon}>
                <ClipboardList
                  size={26}
                  color={colors.white}
                  strokeWidth={2.7}
                />
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
                      typeIconStyle(getTypeColor(item.type)),
                    ]}
                  >
                    <WorkIcon type={item.type} color={getTypeColor(item.type)} />
                  </View>

                  <View style={styles.workTextWrap}>
                    <View style={styles.workIdRow}>
                      <Text
                        style={[
                          styles.workId,
                          workIdStyle(getTypeColor(item.type)),
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
                        openTextStyle(getTypeColor(item.type)),
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
      </SafeAreaView>

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