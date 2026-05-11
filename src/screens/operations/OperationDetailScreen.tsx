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
  CheckCircle2,
  Clock3,
  ExternalLink,
  MapPin,
  Tag,
  UserRound,
} from "lucide-react-native";

import StatusPill from "../../components/StatusPill";
import { colors } from "../../theme/colors";
import {
  operationModules,
  OperationModuleKey,
} from "../../data/operations";

export default function OperationDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();

  const moduleKey: OperationModuleKey = route.params?.moduleKey || "endpoint";
  const categoryKey = route.params?.categoryKey || "offline";
  const record = route.params?.record || {};

  const moduleConfig = operationModules[moduleKey] || operationModules.endpoint;
  const category =
    moduleConfig.categories.find((item) => item.key === categoryKey) ||
    moduleConfig.categories[0];

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

      <View style={styles.profileCard}>
        <View style={styles.profileTop}>
          <View
            style={[
              styles.profileIcon,
              { backgroundColor: moduleConfig.color },
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
            <StatusPill label={record.status || "Review"} tone={category.tone} />
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
          <InfoTextRow key={item.label} label={item.label} value={item.value} />
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
{/* 
      <TouchableOpacity
        style={[styles.webButton, { backgroundColor: moduleConfig.color }]}
        activeOpacity={0.85}
      >
        <ExternalLink size={18} color={colors.white} strokeWidth={2.7} />
        <Text style={styles.webButtonText}>Open in Main System</Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
}

function InfoRow({ icon: Icon, label, value, color }: any) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
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
  profileCard: {
    backgroundColor: colors.navy,
    borderRadius: 30,
    padding: 20,
    marginBottom: 16,
  },
  profileTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  profileIcon: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  profileIconText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "900",
  },
  badgeWrap: {
    alignItems: "flex-end",
    gap: 7,
  },
  profileLabel: {
    color: "#8FA3BC",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginTop: 20,
  },
  profileTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginTop: 6,
    lineHeight: 28,
  },
  profileDesc: {
    color: "#AFC0D6",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
    marginTop: 8,
  },
  infoPanel: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 16,
  },
  panelTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
    paddingTop: 14,
    paddingBottom: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: "#EAF1FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  infoTextWrap: { flex: 1 },
  infoLabel: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "800",
  },
  infoValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
    marginTop: 3,
  },
  infoTextRow: {
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  infoTextLabel: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "800",
  },
  infoTextValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
    marginTop: 4,
  },
  actionPanel: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    marginBottom: 16,
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: "#EBF8F1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  actionTextWrap: { flex: 1 },
  actionTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
  },
  actionText: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 4,
  },
  webButton: {
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  webButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "900",
    marginLeft: 8,
  },
});