import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
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
import { colors } from "../../theme/colors";
import {
  getOperationRecords,
  operationModules,
  OperationModuleKey,
} from "../../data/operations";

import {
  dynamicBackgroundStyle,
  dynamicTextStyle,
  styles,
} from "./OperationListScreen.styles";

export default function OperationListScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

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
            Mobile preview shows selected operational records only. Full data
            and filters remain in the main EMA web system.
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