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
  ArrowLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Tag,
  UserRound,
} from "lucide-react-native";

import StatusPill from "../../components/StatusPill";
import { colors } from "../../theme/colors";
import {
  getOperationRecords,
  operationModules,
  OperationModuleKey,
} from "../../data/operations";

export default function OperationListScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();

  const moduleKey: OperationModuleKey = route.params?.moduleKey || "endpoint";
  const categoryKey = route.params?.categoryKey || "offline";

  const moduleConfig = operationModules[moduleKey] || operationModules.endpoint;
  const category =
    moduleConfig.categories.find((item) => item.key === categoryKey) ||
    moduleConfig.categories[0];

  const records = getOperationRecords(moduleKey, category.key);

  function openRecord(record: any) {
    navigation.navigate("OperationDetail", {
      moduleKey,
      categoryKey: category.key,
      record,
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

      <View style={styles.header}>
        <Text style={[styles.eyebrow, { color: moduleConfig.color }]}>
          {moduleConfig.title}
        </Text>
        <Text style={styles.title}>{category.title}</Text>
        <Text style={styles.subtitle}>{category.description}</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Selected Records</Text>
        <Text style={styles.summaryDesc}>
          Mobile preview shows selected operational records only. Full data and
          filters remain in the main EMA web system.
        </Text>

        <View style={styles.summaryMetricRow}>
          <View style={styles.summaryMetric}>
            <Text style={styles.summaryValue}>{records.length}</Text>
            <Text style={styles.summaryLabel}>Preview Records</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryMetric}>
            <Text style={styles.summaryValue}>{category.value}</Text>
            <Text style={styles.summaryLabel}>{category.title}</Text>
          </View>
        </View>
      </View>

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
                  { backgroundColor: `${moduleConfig.color}18` },
                ]}
              >
                <Text
                  style={[
                    styles.recordIconText,
                    { color: moduleConfig.color },
                  ]}
                >
                  {record.id.split("-").pop()}
                </Text>
              </View>

              <View style={styles.recordTextWrap}>
                <View style={styles.recordIdRow}>
                  <Text style={[styles.recordId, { color: moduleConfig.color }]}>
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
              <Text style={[styles.tapText, { color: moduleConfig.color }]}>
                Tap for detail
              </Text>
              <ChevronRight size={16} color={colors.muted} strokeWidth={2.7} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
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
  header: { marginBottom: 16 },
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
  summaryCard: {
    backgroundColor: colors.navy,
    borderRadius: 28,
    padding: 20,
    marginBottom: 18,
  },
  summaryTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "900",
  },
  summaryDesc: {
    color: "#AFC0D6",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
    marginTop: 7,
  },
  summaryMetricRow: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.12)",
    flexDirection: "row",
    alignItems: "center",
  },
  summaryMetric: { flex: 1 },
  summaryValue: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "900",
  },
  summaryLabel: {
    color: "#8FA3BC",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    height: 38,
    backgroundColor: "rgba(255,255,255,0.14)",
    marginHorizontal: 16,
  },
  recordList: { gap: 12 },
  recordCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
  },
  recordTop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  recordIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  recordIconText: {
    fontSize: 12,
    fontWeight: "900",
  },
  recordTextWrap: {
    flex: 1,
  },
  recordIdRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    alignItems: "center",
    marginBottom: 4,
  },
  recordId: {
    fontSize: 10,
    fontWeight: "900",
  },
  recordTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 18,
  },
  recordSource: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
  },
  recordMetaBox: {
    backgroundColor: colors.background,
    borderRadius: 18,
    padding: 12,
    marginTop: 14,
    gap: 8,
  },
  metaLine: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 7,
  },
  recordFooter: {
    marginTop: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tapText: {
    fontSize: 10,
    fontWeight: "900",
  },
});