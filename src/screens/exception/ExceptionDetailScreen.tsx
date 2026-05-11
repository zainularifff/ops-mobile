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
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  ExternalLink,
  MapPin,
  MonitorCog,
  ShieldAlert,
} from "lucide-react-native";

import StatusPill from "../../components/StatusPill";
import { colors } from "../../theme/colors";

export default function ExceptionDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();

  const params = route.params || {};

  const title = params.title || "Operational Exception";
  const source = params.source || "-";
  const site = params.site || "-";
  const time = params.time || "-";
  const severity = params.severity || "Medium";
  const reason =
    params.reason || "Exception reason is not available in this prototype.";
  const recommendedAction =
    params.recommendedAction ||
    "Review the record in the main EMA web system for full investigation.";

  const isHigh = severity === "High";

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
        onPress={() => navigation.goBack()}
        activeOpacity={0.85}
      >
        <ArrowLeft size={20} color={colors.text} strokeWidth={2.7} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.exceptionHeaderCard}>
        <View style={styles.exceptionTop}>
          <View style={styles.exceptionIcon}>
            <ShieldAlert size={28} color={colors.white} strokeWidth={2.7} />
          </View>

          <View style={styles.badgeGroup}>
            <StatusPill label={severity} tone={isHigh ? "red" : "amber"} />
            <StatusPill label="Open" tone="blue" />
          </View>
        </View>

        <Text style={styles.exceptionLabel}>OPERATIONAL EXCEPTION</Text>
        <Text style={styles.exceptionTitle}>{title}</Text>
        <Text style={styles.exceptionDesc}>
          This mobile detail view explains why the exception appears and what
          operational action is recommended.
        </Text>

        <View style={styles.detectedStrip}>
          <View>
            <Text style={styles.detectedLabel}>Detected</Text>
            <Text style={styles.detectedValue}>{time}</Text>
          </View>

          <View style={styles.detectedDivider} />

          <View>
            <Text style={styles.detectedLabel}>Source</Text>
            <Text style={styles.detectedValue}>{source}</Text>
          </View>
        </View>
      </View>

      <View style={styles.contextPanel}>
        <Text style={styles.panelTitle}>Exception Context</Text>

        <InfoRow icon={MonitorCog} label="Source" value={source} />
        <InfoRow icon={MapPin} label="Site" value={site} />
        <InfoRow icon={Clock3} label="Detected Time" value={time} />
      </View>

      <View style={styles.reasonPanel}>
        <View style={styles.reasonIcon}>
          <AlertTriangle
            size={20}
            color={isHigh ? colors.red : colors.amber}
            strokeWidth={2.7}
          />
        </View>

        <View style={styles.reasonTextWrap}>
          <Text style={styles.reasonTitle}>Reason</Text>
          <Text style={styles.reasonText}>{reason}</Text>
        </View>
      </View>

      <View style={styles.actionPanel}>
        <View style={styles.actionIcon}>
          <CheckCircle2 size={20} color={colors.green} strokeWidth={2.7} />
        </View>

        <View style={styles.actionTextWrap}>
          <Text style={styles.actionTitle}>Recommended Action</Text>
          <Text style={styles.actionText}>{recommendedAction}</Text>
        </View>
      </View>

      {/* <TouchableOpacity style={styles.webButton} activeOpacity={0.85}>
        <ExternalLink size={18} color={colors.white} strokeWidth={2.7} />
        <Text style={styles.webButtonText}>Open in Main System</Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
}

function InfoRow({ icon: Icon, label, value }: any) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Icon size={18} color={colors.red} strokeWidth={2.7} />
      </View>

      <View style={styles.infoTextWrap}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
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

  exceptionHeaderCard: {
    backgroundColor: colors.navy,
    borderRadius: 30,
    padding: 20,
    marginBottom: 16,
  },
  exceptionTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  exceptionIcon: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: colors.red,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeGroup: {
    alignItems: "flex-end",
    gap: 7,
  },
  exceptionLabel: {
    color: "#8FA3BC",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginTop: 20,
  },
  exceptionTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginTop: 6,
    lineHeight: 28,
  },
  exceptionDesc: {
    color: "#AFC0D6",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
    marginTop: 8,
  },
  detectedStrip: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.12)",
    flexDirection: "row",
    alignItems: "center",
  },
  detectedLabel: {
    color: "#8FA3BC",
    fontSize: 10,
    fontWeight: "800",
  },
  detectedValue: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "900",
    marginTop: 4,
  },
  detectedDivider: {
    width: 1,
    height: 34,
    backgroundColor: "rgba(255,255,255,0.14)",
    marginHorizontal: 18,
  },

  contextPanel: {
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
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  infoTextWrap: {
    flex: 1,
  },
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

  reasonPanel: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    marginBottom: 16,
  },
  reasonIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: "#FFF7E8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  reasonTextWrap: {
    flex: 1,
  },
  reasonTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
  },
  reasonText: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
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
  actionTextWrap: {
    flex: 1,
  },
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
    backgroundColor: colors.red,
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
