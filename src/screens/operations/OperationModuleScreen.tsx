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
import { colors } from "../../theme/colors";
import { operationModules } from "../../data/operations";

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
  const insets = useSafeAreaInsets();

  const moduleKey = route.params?.moduleKey || "endpoint";
  const config = operationModules[moduleKey] || operationModules.endpoint;
  const ModuleIcon = iconMap[config.iconKey] || MonitorCog;

  function openCategory(category: any) {
    navigation.navigate("OperationList", {
      moduleKey: config.key,
      categoryKey: category.key,
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
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.85}
        onPress={() => navigation.goBack()}
      >
        <ArrowLeft size={20} color={colors.text} strokeWidth={2.7} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.headerCard}>
        <View style={[styles.moduleIcon, { backgroundColor: config.color }]}>
          <ModuleIcon size={28} color={colors.white} strokeWidth={2.7} />
        </View>

        <Text style={[styles.eyebrow, { color: config.color }]}>
          {config.label}
        </Text>
        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.subtitle}>{config.description}</Text>
      </View>

      <View style={styles.purposeCard}>
        <Text style={styles.purposeLabel}>MODULE PURPOSE</Text>
        <Text style={styles.purposeText}>{config.purpose}</Text>

        <View style={styles.metricRow}>
          <View style={styles.metricBlock}>
            <Text style={styles.metricValue}>{config.metric}</Text>
            <Text style={styles.metricLabel}>{config.metricLabel}</Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricBlock}>
            <Text style={styles.metricValue}>{config.categories.length}</Text>
            <Text style={styles.metricLabel}>Categories</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Operational Categories</Text>
      <Text style={styles.sectionDesc}>
        Select a category to view module-specific records.
      </Text>

      <View style={styles.categoryList}>
        {config.categories.map((item) => {
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
                  { backgroundColor: `${config.color}18` },
                ]}
              >
                <Icon size={20} color={config.color} strokeWidth={2.7} />
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
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 18, paddingBottom: 110 },
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
  headerCard: {
    backgroundColor: colors.white,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 16,
  },
  moduleIcon: {
    width: 58,
    height: 58,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
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
    marginTop: 5,
    lineHeight: 18,
  },
  purposeCard: {
    backgroundColor: colors.navy,
    borderRadius: 28,
    padding: 20,
    marginBottom: 18,
  },
  purposeLabel: {
    color: "#8FA3BC",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  purposeText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 20,
    marginTop: 8,
  },
  metricRow: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.12)",
    flexDirection: "row",
    alignItems: "center",
  },
  metricBlock: { flex: 1 },
  metricValue: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "900",
  },
  metricLabel: {
    color: "#8FA3BC",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
  },
  metricDivider: {
    width: 1,
    height: 38,
    backgroundColor: "rgba(255,255,255,0.14)",
    marginHorizontal: 16,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 3,
  },
  sectionDesc: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 12,
  },
  categoryList: { gap: 12 },
  categoryCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  categoryTextWrap: { flex: 1 },
  categoryTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
  },
  categoryDesc: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 15,
    marginTop: 3,
  },
  categoryRight: {
    alignItems: "flex-end",
    marginRight: 8,
    gap: 5,
  },
  categoryValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
});