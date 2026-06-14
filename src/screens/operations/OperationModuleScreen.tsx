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
  Archive,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  MonitorCog,
  RadioTower,
  ShieldAlert,
  ShieldCheck,
  Ticket,
  WifiOff,
  Activity,
} from "lucide-react-native";

import StatusPill from "../../components/StatusPill";
import {
  useLiveWorklist,
  useOperationsSummary,
} from "../../hooks/useLiveOpsData";
import { colors } from "../../theme/colors";
import { formatNumber } from "../../utils/formatters";
import { operationModules } from "../../config/operationModules";

import {
  categoryIconStyle,
  eyebrowStyle,
  moduleIconStyle,
  styles,
} from "./OperationModuleScreen.styles";

const iconMap: any = {
  monitor: MonitorCog,
  ticket: Ticket,
  remote: RadioTower,
  software: ShieldCheck,
  asset: Archive,
  geo: MapPin,
  check: CheckCircle2,
  clock: Clock3,
  alert: ShieldAlert,
  shield: ShieldCheck,
  wifiOff: WifiOff,
  activity: Activity,
};

export default function OperationModuleScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {
    summary,
    loading: summaryLoading,
    refreshing: summaryRefreshing,
    error: summaryError,
    reloadSummary,
  } = useOperationsSummary();
  const {
    items: workItems,
    loading: worklistLoading,
    refreshing: worklistRefreshing,
    error: worklistError,
    reloadWorklist,
  } = useLiveWorklist();

  const moduleKey = route.params?.moduleKey || "endpoint";
  const config = operationModules[moduleKey] || operationModules.endpoint;
  const ModuleIcon = iconMap[config.iconKey] || MonitorCog;
  const refreshing = summaryRefreshing || worklistRefreshing;
  const loading = summaryLoading || worklistLoading;
  const errorText = summaryError || worklistError;

  const liveConfig = useMemo(() => {
    const notReporting = Math.max(
      summary.offlineDevices || summary.totalEndpoints - summary.activeDevices,
      0
    );
    const activeCoverage = summary.totalEndpoints
      ? Math.round((summary.activeDevices / summary.totalEndpoints) * 100)
      : 0;
    const countByType = (type: string) =>
      workItems.filter((item) => item.type === type).length;

    function categoryValue(categoryKey: string) {
      if (config.key === "endpoint") {
        if (categoryKey === "active") return formatNumber(summary.activeDevices);
        if (categoryKey === "offline") return formatNumber(notReporting);
        if (categoryKey === "review") return formatNumber(summary.highRiskExceptions);
        return "0";
      }

      if (config.key === "ticket") {
        if (categoryKey === "sla") return formatNumber(summary.highRiskExceptions);
        if (categoryKey === "pending") return formatNumber(summary.openTickets);
        return "0";
      }

      if (config.key === "remote") {
        if (categoryKey === "sessions") return formatNumber(countByType("remote"));
        if (categoryKey === "failed") {
          return formatNumber(
            workItems.filter(
              (item) => item.type === "remote" && item.priority !== "Low"
            ).length
          );
        }
        return "0";
      }

      if (config.key === "software") {
        if (categoryKey === "unauthorized" || categoryKey === "vulnerable") {
          return formatNumber(countByType("software"));
        }
        return "0";
      }

      if (config.key === "asset") {
        if (categoryKey === "aging" || categoryKey === "critical") {
          return formatNumber(countByType("asset"));
        }
        return "0";
      }

      if (config.key === "geo") {
        if (categoryKey === "tracked") return formatNumber(summary.activeDevices);
        if (categoryKey === "unknown") return formatNumber(notReporting);
        if (categoryKey === "accuracy") return `${activeCoverage}%`;
        return "0";
      }

      return "0";
    }

    const metric =
      route.params?.metric ||
      (config.key === "endpoint"
        ? formatNumber(summary.totalEndpoints)
        : config.key === "ticket"
          ? formatNumber(summary.openTickets)
          : config.key === "geo"
            ? `${activeCoverage}%`
            : formatNumber(countByType(config.key)));

    return {
      ...config,
      metric,
      categories: config.categories.map((category) => ({
        ...category,
        value: categoryValue(category.key),
      })),
    };
  }, [config, route.params?.metric, summary, workItems]);

  function openCategory(category: any) {
    navigation.navigate("OperationList", {
      moduleKey: liveConfig.key,
      categoryKey: category.key,
    });
  }

  function handleRefresh() {
    reloadSummary({ silent: true });
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

        <View style={styles.headerCard}>
          <View style={[styles.moduleIcon, moduleIconStyle(liveConfig.color)]}>
            <ModuleIcon size={28} color={colors.white} strokeWidth={2.7} />
          </View>

          <Text style={[styles.eyebrow, eyebrowStyle(liveConfig.color)]}>
            {liveConfig.label}
          </Text>

          <Text style={styles.title}>{liveConfig.title}</Text>
          <Text style={styles.subtitle}>{liveConfig.description}</Text>

          {loading ? <ActivityIndicator size="small" color={liveConfig.color} /> : null}
          {errorText ? <Text style={styles.subtitle}>{errorText}</Text> : null}
        </View>

        <View style={styles.purposeCard}>
          <Text style={styles.purposeLabel}>MODULE PURPOSE</Text>
          <Text style={styles.purposeText}>{liveConfig.purpose}</Text>

          <View style={styles.metricRow}>
            <View style={styles.metricBlock}>
              <Text style={styles.metricValue}>{liveConfig.metric}</Text>
              <Text style={styles.metricLabel}>{liveConfig.metricLabel}</Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricBlock}>
              <Text style={styles.metricValue}>{liveConfig.categories.length}</Text>
              <Text style={styles.metricLabel}>Categories</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Operational Categories</Text>
        <Text style={styles.sectionDesc}>
          Select a category to view module-specific records.
        </Text>

        <View style={styles.categoryList}>
          {liveConfig.categories.map((item) => {
            const Icon = iconMap[item.iconKey] || CheckCircle2;

            return (
              <TouchableOpacity
                key={item.key}
                activeOpacity={0.85}
                style={styles.categoryCard}
                onPress={() => openCategory(item)}
              >
                <View
                  style={[
                    styles.categoryIcon,
                    categoryIconStyle(liveConfig.color),
                  ]}
                >
                  <Icon size={20} color={liveConfig.color} strokeWidth={2.7} />
                </View>

                <View style={styles.categoryTextWrap}>
                  <Text style={styles.categoryTitle}>{item.title}</Text>
                  <Text style={styles.categoryDesc}>{item.description}</Text>
                </View>

                <View style={styles.categoryRight}>
                  <Text style={styles.categoryValue}>{item.value}</Text>
                  <StatusPill label="View" tone={item.tone} />
                </View>

                <ChevronRight size={17} color={colors.muted} strokeWidth={2.7} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
