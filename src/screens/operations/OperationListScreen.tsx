import React, { useMemo } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Tag,
  UserRound,
} from "lucide-react-native";

import StatusPill from "../../components/StatusPill";
import { useLiveWorklist } from "../../hooks/useLiveOpsData";
import { colors } from "../../theme/colors";
import {
  operationModules,
  OperationModuleKey,
} from "../../config/operationModules";

import {
  dynamicBackgroundStyle,
  dynamicTextStyle,
  styles,
} from "./OperationListScreen.styles";

function sourceLabel(type: string) {
  if (type === "ticket") return "Ticket";
  if (type === "remote") return "Target Device";
  if (type === "software") return "Software";
  if (type === "asset") return "Asset";
  return "Device";
}

function categoryMatches(record: any, categoryKey: string) {
  const text = `${record.title} ${record.status} ${record.reason} ${record.source}`.toLowerCase();

  if (["active", "sessions", "compliant", "new", "tracked"].includes(categoryKey)) {
    return record.priority === "Low" || text.includes("active") || text.includes("success") || text.includes("completed");
  }

  if (["offline", "failed", "vulnerable", "critical", "mismatch", "sla"].includes(categoryKey)) {
    return record.priority === "High" || text.includes("fail") || text.includes("offline") || text.includes("risk");
  }

  if (["stale", "pending", "outdated", "aging", "unknown", "afterhours"].includes(categoryKey)) {
    return record.priority !== "Low" || text.includes("pending") || text.includes("stale") || text.includes("aging");
  }

  if (["review", "unauthorized", "accuracy"].includes(categoryKey)) {
    return record.status.toLowerCase().includes("review") || record.priority !== "Low";
  }

  return true;
}

export default function OperationListScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { items: workItems, loading, refreshing, error, reloadWorklist } =
    useLiveWorklist();

  const moduleKey: OperationModuleKey = route.params?.moduleKey || "endpoint";
  const categoryKey = route.params?.categoryKey || "offline";

  const moduleConfig = operationModules[moduleKey] || operationModules.endpoint;
  const category =
    moduleConfig.categories.find((item) => item.key === categoryKey) ||
    moduleConfig.categories[0];

  const records = useMemo(() => {
    return workItems
      .filter((item) => item.type === moduleKey)
      .filter((item) => categoryMatches(item, category.key))
      .map((item) => ({
        id: item.id,
        title: item.title,
        source: item.source,
        sourceLabel: sourceLabel(item.type),
        site: item.site,
        owner: item.owner,
        time: item.updated,
        priority: item.priority,
        status: item.status,
        summary: item.reason,
        action: item.action,
        details: [
          { label: "Status", value: item.status },
          { label: "Due", value: item.due },
          { label: "Source", value: item.source },
        ],
      }));
  }, [category.key, moduleKey, workItems]);

  function openRecord(record: any) {
    navigation.navigate("OperationDetail", {
      moduleKey,
      categoryKey: category.key,
      record,
    });
  }

  function handleRefresh() {
    reloadWorklist({ silent: true });
  }

  return (
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
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color={colors.text} strokeWidth={2.7} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.eyebrow, dynamicTextStyle(moduleConfig.color)]}>
            {moduleConfig.title}
          </Text>

          <Text style={styles.title}>{category.title}</Text>
          <Text style={styles.subtitle}>{category.description}</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Selected Records</Text>
          <Text style={styles.summaryDesc}>
            Mobile preview uses live worklist records related to this operational
            module.
          </Text>

          {loading ? <ActivityIndicator size="small" color={moduleConfig.color} /> : null}
          {error ? <Text style={styles.summaryDesc}>{error}</Text> : null}

          <View style={styles.summaryMetricRow}>
            <View style={styles.summaryMetric}>
              <Text style={styles.summaryValue}>{records.length}</Text>
              <Text style={styles.summaryLabel}>Live Records</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryMetric}>
              <Text style={styles.summaryValue}>{records.length}</Text>
              <Text style={styles.summaryLabel}>{category.title}</Text>
            </View>
          </View>
        </View>

        {!loading && records.length === 0 ? (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>No live record found</Text>
            <Text style={styles.summaryDesc}>
              No worklist item matched this module and category from the current
              backend response.
            </Text>
          </View>
        ) : null}

        <View style={styles.recordList}>
          {records.map((record) => (
            <TouchableOpacity
              key={record.id}
              activeOpacity={0.85}
              style={styles.recordCard}
              onPress={() => openRecord(record)}
            >
              <View style={styles.recordTop}>
                <View
                  style={[
                    styles.recordIcon,
                    dynamicBackgroundStyle(moduleConfig.color),
                  ]}
                >
                  <Text
                    style={[
                      styles.recordIconText,
                      dynamicTextStyle(moduleConfig.color),
                    ]}
                  >
                    {record.id.split("-").pop()}
                  </Text>
                </View>

                <View style={styles.recordTextWrap}>
                  <View style={styles.recordIdRow}>
                    <Text
                      style={[
                        styles.recordId,
                        dynamicTextStyle(moduleConfig.color),
                      ]}
                    >
                      {record.id}
                    </Text>

                    <StatusPill
                      label={record.priority}
                      tone={record.priority === "High" ? "red" : category.tone}
                    />
                  </View>

                  <Text style={styles.recordTitle}>{record.title}</Text>
                  <Text style={styles.recordSource}>
                    {record.sourceLabel}: {record.source}
                  </Text>
                </View>
              </View>

              <View style={styles.recordMetaBox}>
                <MetaLine icon={MapPin} label={record.site} />
                <MetaLine icon={UserRound} label={record.owner} />
                <MetaLine icon={Clock3} label={record.time} />
                <MetaLine icon={Tag} label={record.status} />
              </View>

              <View style={styles.recordFooter}>
                <Text
                  style={[
                    styles.tapText,
                    dynamicTextStyle(moduleConfig.color),
                  ]}
                >
                  Tap for detail
                </Text>

                <ChevronRight size={16} color={colors.muted} strokeWidth={2.7} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MetaLine({ icon: Icon, label }: any) {
  return (
    <View style={styles.metaLine}>
      <Icon size={13} color={colors.muted} strokeWidth={2.6} />
      <Text style={styles.metaText}>{label}</Text>
    </View>
  );
}
