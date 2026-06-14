import React, { useMemo } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Archive,
  ChevronRight,
  MapPin,
  MonitorCog,
  RadioTower,
  ShieldCheck,
  Ticket,
} from "lucide-react-native";

import {
  useLiveWorklist,
  useOperationsSummary,
} from "../../hooks/useLiveOpsData";
import { colors } from "../../theme/colors";
import { formatNumber } from "../../utils/formatters";
import {
  moduleIconStyle,
  moduleMetricStyle,
  styles,
} from "./OperationsScreen.styles";

export default function OperationsScreen() {
  const navigation = useNavigation<any>();
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

  const refreshing = summaryRefreshing || worklistRefreshing;
  const loading = summaryLoading || worklistLoading;
  const errorText = summaryError || worklistError;

  const modules = useMemo(() => {
    const activeCoverage = summary.totalEndpoints
      ? Math.round((summary.activeDevices / summary.totalEndpoints) * 100)
      : 0;

    const countByType = (type: string) =>
      workItems.filter((item) => item.type === type).length;

    return [
      {
        key: "endpoint",
        title: "Endpoint Health",
        description: "Active, offline and stale endpoint visibility",
        icon: MonitorCog,
        color: colors.blue,
        metric: formatNumber(summary.totalEndpoints),
        label: "Endpoints",
      },
      {
        key: "ticket",
        title: "Support Tickets",
        description: "Open tickets, SLA risk and workload status",
        icon: Ticket,
        color: colors.purple,
        metric: formatNumber(summary.openTickets),
        label: "Open Tickets",
      },
      {
        key: "remote",
        title: "Remote Control",
        description: "Remote activity, success, failure and audit logs",
        icon: RadioTower,
        color: colors.cyan,
        metric: formatNumber(countByType("remote")),
        label: "Remote Items",
      },
      {
        key: "software",
        title: "Software & Security",
        description: "Unauthorized software and security visibility",
        icon: ShieldCheck,
        color: colors.amber,
        metric: formatNumber(countByType("software")),
        label: "Software Items",
      },
      {
        key: "asset",
        title: "Asset Lifecycle",
        description: "Aging assets and replacement planning",
        icon: Archive,
        color: colors.green,
        metric: formatNumber(countByType("asset")),
        label: "Asset Items",
      },
      {
        key: "geo",
        title: "Geolocation",
        description: "Location coverage and accuracy review",
        icon: MapPin,
        color: colors.red,
        metric: `${activeCoverage}%`,
        label: "Coverage",
      },
    ];
  }, [summary, workItems]);

  function openModule(item: any) {
    navigation.navigate("OperationModule", {
      moduleKey: item.key,
      title: item.title,
      description: item.description,
      metric: item.metric,
      label: item.label,
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
        <View style={styles.header}>
          <Text style={styles.eyebrow}>EMA OPS MOBILE</Text>
          <Text style={styles.title}>Operations</Text>
          <Text style={styles.subtitle}>
            Select an operational module to view deeper details.
          </Text>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>OPERATIONS COMMAND VIEW</Text>
          <Text style={styles.heroTitle}>Operational Modules</Text>
          <Text style={styles.heroDesc}>
            Mobile access for endpoint health, ticket workload, remote activity,
            software visibility, asset lifecycle and geolocation monitoring.
          </Text>

          {loading ? <ActivityIndicator size="small" color={colors.white} /> : null}

          {errorText ? (
            <Text style={[styles.heroDesc, { color: "#FCA5A5" }]}>
              {errorText}
            </Text>
          ) : null}

          <View style={styles.heroMetricRow}>
            <View style={styles.heroMetric}>
              <Text style={styles.heroValue}>{modules.length}</Text>
              <Text style={styles.heroMetricLabel}>Modules</Text>
            </View>

            <View style={styles.heroDivider} />

            <View style={styles.heroMetric}>
              <Text style={styles.heroValue}>Live</Text>
              <Text style={styles.heroMetricLabel}>API View</Text>
            </View>
          </View>
        </View>

        <View style={styles.moduleList}>
          {modules.map((item) => {
            const Icon = item.icon;

            return (
              <TouchableOpacity
                key={item.key}
                activeOpacity={0.85}
                style={styles.moduleCard}
                onPress={() => openModule(item)}
              >
                <View style={[styles.moduleIcon, moduleIconStyle(item.color)]}>
                  <Icon size={22} color={item.color} strokeWidth={2.7} />
                </View>

                <View style={styles.moduleTextWrap}>
                  <Text style={styles.moduleTitle}>{item.title}</Text>
                  <Text style={styles.moduleDesc}>{item.description}</Text>

                  <View style={styles.moduleMetricRow}>
                    <Text
                      style={[
                        styles.moduleMetric,
                        moduleMetricStyle(item.color),
                      ]}
                    >
                      {item.metric}
                    </Text>
                    <Text style={styles.moduleLabel}>{item.label}</Text>
                  </View>
                </View>

                <ChevronRight size={18} color={colors.muted} strokeWidth={2.7} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
