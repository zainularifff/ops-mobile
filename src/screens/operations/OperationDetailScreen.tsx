import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MapPin,
  Tag,
  UserRound,
} from "lucide-react-native";

import StatusPill from "../../components/StatusPill";
import { colors } from "../../theme/colors";
import {
  operationModules,
  OperationModuleKey,
} from "../../config/operationModules";

import {
  softBackgroundStyle,
  solidBackgroundStyle,
  styles,
} from "./OperationDetailScreen.styles";

export default function OperationDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const moduleKey: OperationModuleKey = route.params?.moduleKey || "endpoint";
  const categoryKey = route.params?.categoryKey || "offline";
  const record = route.params?.record || {};

  const moduleConfig = operationModules[moduleKey] || operationModules.endpoint;
  const category =
    moduleConfig.categories.find((item) => item.key === categoryKey) ||
    moduleConfig.categories[0];

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

        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View
              style={[
                styles.profileIcon,
                solidBackgroundStyle(moduleConfig.color),
              ]}
            >
              <Text style={styles.profileIconText}>
                {(record.id || "OPS-001").split("-").pop()}
              </Text>
            </View>

            <View style={styles.badgeWrap}>
              <StatusPill
                label={record.priority || "Medium"}
                tone={record.priority === "High" ? "red" : category.tone}
              />
              <StatusPill
                label={record.status || "Review"}
                tone={category.tone}
              />
            </View>
          </View>

          <Text style={styles.profileLabel}>{moduleConfig.title}</Text>
          <Text style={styles.profileTitle}>{record.title}</Text>
          <Text style={styles.profileDesc}>{record.summary}</Text>
        </View>

        <View style={styles.infoPanel}>
          <Text style={styles.panelTitle}>Record Information</Text>

          <InfoRow
            icon={Tag}
            label={record.sourceLabel || "Source"}
            value={record.source || "-"}
            color={moduleConfig.color}
          />

          <InfoRow
            icon={MapPin}
            label="Site"
            value={record.site || "-"}
            color={moduleConfig.color}
          />

          <InfoRow
            icon={UserRound}
            label="Owner"
            value={record.owner || "-"}
            color={moduleConfig.color}
          />

          <InfoRow
            icon={Clock3}
            label="Last Updated"
            value={record.time || "-"}
            color={moduleConfig.color}
          />
        </View>

        <View style={styles.infoPanel}>
          <Text style={styles.panelTitle}>Operational Details</Text>

          {(record.details || []).map((item: any) => (
            <InfoTextRow
              key={item.label}
              label={item.label}
              value={item.value}
            />
          ))}
        </View>

        <View style={styles.actionPanel}>
          <View style={styles.actionIcon}>
            <CheckCircle2 size={20} color={colors.green} strokeWidth={2.7} />
          </View>

          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitle}>Recommended Action</Text>
            <Text style={styles.actionText}>{record.action}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ icon: Icon, label, value, color }: any) {
  return (
    <View style={styles.infoRow}>
      <View style={[styles.infoIcon, softBackgroundStyle(color)]}>
        <Icon size={18} color={color} strokeWidth={2.7} />
      </View>

      <View style={styles.infoTextWrap}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function InfoTextRow({ label, value }: any) {
  return (
    <View style={styles.infoTextRow}>
      <Text style={styles.infoTextLabel}>{label}</Text>
      <Text style={styles.infoTextValue}>{value}</Text>
    </View>
  );
}
