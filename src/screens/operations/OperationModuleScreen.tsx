import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
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
import { colors } from "../../theme/colors";
import { operationModules } from "../../data/operations";

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
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
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
          <View style={[styles.moduleIcon, moduleIconStyle(config.color)]}>
            <ModuleIcon size={28} color={colors.white} strokeWidth={2.7} />
          </View>

          <Text style={[styles.eyebrow, eyebrowStyle(config.color)]}>
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
                    categoryIconStyle(config.color),
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
    </SafeAreaView>
  );
}