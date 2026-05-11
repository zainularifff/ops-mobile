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
  Archive,
  ChevronRight,
  MapPin,
  MonitorCog,
  RadioTower,
  ShieldCheck,
  Ticket,
} from "lucide-react-native";

import { colors } from "../../theme/colors";

const modules = [
  {
    key: "endpoint",
    title: "Endpoint Health",
    description: "Active, offline and stale endpoint visibility",
    icon: MonitorCog,
    color: colors.blue,
    metric: "4,892",
    label: "Endpoints",
  },
  {
    key: "ticket",
    title: "Support Tickets",
    description: "Open tickets, SLA risk and workload status",
    icon: Ticket,
    color: colors.purple,
    metric: "126",
    label: "Open Tickets",
  },
  {
    key: "remote",
    title: "Remote Control",
    description: "Remote activity, success, failure and audit logs",
    icon: RadioTower,
    color: colors.cyan,
    metric: "982",
    label: "Sessions",
  },
  {
    key: "software",
    title: "Software & Security",
    description: "Unauthorized software and security visibility",
    icon: ShieldCheck,
    color: colors.amber,
    metric: "423",
    label: "Software",
  },
  {
    key: "asset",
    title: "Asset Lifecycle",
    description: "Aging assets and replacement planning",
    icon: Archive,
    color: colors.green,
    metric: "1,151",
    label: "Aging",
  },
  {
    key: "geo",
    title: "Geolocation",
    description: "Location coverage and accuracy review",
    icon: MapPin,
    color: colors.red,
    metric: "87%",
    label: "Coverage",
  },
];

export default function OperationsScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  function openModule(item: any) {
    navigation.navigate("OperationModule", {
      moduleKey: item.key,
      title: item.title,
      description: item.description,
      metric: item.metric,
      label: item.label,
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

        <View style={styles.heroMetricRow}>
          <View style={styles.heroMetric}>
            <Text style={styles.heroValue}>6</Text>
            <Text style={styles.heroMetricLabel}>Modules</Text>
          </View>

          <View style={styles.heroDivider} />

          <View style={styles.heroMetric}>
            <Text style={styles.heroValue}>Live</Text>
            <Text style={styles.heroMetricLabel}>Mock View</Text>
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
              <View
                style={[
                  styles.moduleIcon,
                  { backgroundColor: `${item.color}18` },
                ]}
              >
                <Icon size={22} color={item.color} strokeWidth={2.7} />
              </View>

              <View style={styles.moduleTextWrap}>
                <Text style={styles.moduleTitle}>{item.title}</Text>
                <Text style={styles.moduleDesc}>{item.description}</Text>

                <View style={styles.moduleMetricRow}>
                  <Text style={[styles.moduleMetric, { color: item.color }]}>
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
    marginBottom: 18,
  },
  heroLabel: {
    color: "#8FA3BC",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 7,
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
  moduleList: {
    gap: 12,
  },
  moduleCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  moduleIcon: {
    width: 48,
    height: 48,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  moduleTextWrap: {
    flex: 1,
  },
  moduleTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
  },
  moduleDesc: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 16,
    marginTop: 3,
  },
  moduleMetricRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  moduleMetric: {
    fontSize: 13,
    fontWeight: "900",
    marginRight: 6,
  },
  moduleLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "800",
  },
});