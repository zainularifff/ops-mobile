import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  RefreshControl,
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
import { useLiveWorklist } from "../../hooks/useLiveOpsData";
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

export default function WorklistScreen() {
  const navigation = useNavigation<any>();
  const { items: workItems, loading, refreshing, error, reloadWorklist } =
    useLiveWorklist();

  const [activeFilter, setActiveFilter] = useState<WorkType>("all");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const activeFilterLabel =
    filters.find((item) => item.key === activeFilter)?.label ||
    "All Worklist Items";

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return workItems;
    return workItems.filter((item) => item.type === activeFilter);
  }, [activeFilter, workItems]);

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

  function handleRefresh() {
    reloadWorklist({ silent: true });
  }

  return (
    <>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <ScrollView
          style={styles.page}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          bounces={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
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

              <StatusPill label="Live Queue" tone="blue" />
            </View>

            <Text style={styles.heroTitle}>Operational Action Items</Text>
            <Text style={styles.heroDesc}>
              Worklist is now loaded from the EMA backend task list for live
              operational review.
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

          {error ? (
            <View style={styles.resultSummary}>
              <Text style={[styles.resultText, { color: colors.red }]}>
                {error}
              </Text>
            </View>
          ) : null}

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

          {loading ? (
            <ActivityIndicator size="small" color={colors.blue} />
          ) : null}

          {!loading && filteredItems.length === 0 ? (
            <View style={styles.resultSummary}>
              <Text style={styles.resultText}>No live worklist item found.</Text>
            </View>
          ) : null}

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
