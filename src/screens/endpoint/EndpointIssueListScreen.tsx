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
  Clock3,
  MonitorCog,
  WifiOff,
} from "lucide-react-native";

import StatusPill from "../../components/StatusPill";
import { colors } from "../../theme/colors";

const data = {
  offline: {
    title: "Offline / Not Reporting",
    subtitle: "Devices currently not reporting or disconnected",
    icon: WifiOff,
    color: colors.red,
    records: [
      {
        device: "JPJ-PUTRAJAYA-WS-014",
        site: "Putrajaya",
        status: "Offline",
        lastSeen: "2 days ago",
        risk: "High",
        action: "Check endpoint agent, network access, and device availability.",
      },
      {
        device: "KL-HQ-LAP-221",
        site: "Kuala Lumpur HQ",
        status: "Not Reporting",
        lastSeen: "1 day ago",
        risk: "Medium",
        action: "Verify device connectivity and confirm user/device status.",
      },
      {
        device: "SHAH-ALAM-PC-088",
        site: "Shah Alam",
        status: "Offline",
        lastSeen: "3 days ago",
        risk: "High",
        action: "Escalate to site support if device is still active.",
      },
    ],
  },
  stale: {
    title: "Stale Devices",
    subtitle: "Devices with no update for more than 7 days",
    icon: Clock3,
    color: colors.amber,
    records: [
      {
        device: "JB-LAP-119",
        site: "Johor Bahru",
        status: "Stale > 7 Days",
        lastSeen: "9 days ago",
        risk: "Medium",
        action: "Confirm whether device is active, retired, or disconnected.",
      },
      {
        device: "PUTRAJAYA-LAP-031",
        site: "Putrajaya",
        status: "Stale > 7 Days",
        lastSeen: "11 days ago",
        risk: "High",
        action: "Review agent health and reconnect device to EMA.",
      },
      {
        device: "KL-HQ-WS-302",
        site: "Kuala Lumpur HQ",
        status: "Stale > 30 Days",
        lastSeen: "34 days ago",
        risk: "High",
        action: "Validate asset status and remove if retired.",
      },
    ],
  },
  review: {
    title: "Need Review",
    subtitle: "Endpoint records requiring operational validation",
    icon: MonitorCog,
    color: colors.purple,
    records: [
      {
        device: "SHAH-ALAM-LAP-022",
        site: "Shah Alam",
        status: "Software Review",
        lastSeen: "25 min ago",
        risk: "Medium",
        action: "Validate unauthorized software detection.",
      },
      {
        device: "KL-HQ-PC-411",
        site: "Kuala Lumpur HQ",
        status: "Asset Review",
        lastSeen: "4 hours ago",
        risk: "Medium",
        action: "Confirm device ownership and lifecycle status.",
      },
      {
        device: "JPJ-PUTRAJAYA-WS-014",
        site: "Putrajaya",
        status: "Agent Review",
        lastSeen: "2 days ago",
        risk: "High",
        action: "Verify endpoint agent and connection status.",
      },
    ],
  },
};

export default function EndpointIssueListScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();

  const type = route.params?.type || "offline";
  const config = data[type as keyof typeof data] || data.offline;
  const Icon = config.icon;

  function openDevice(record: any) {
    navigation.navigate("DeviceQuickView", {
      ...record,
      category: config.title,
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
        onPress={() => navigation.goBack()}
        activeOpacity={0.85}
      >
        <ArrowLeft size={20} color={colors.text} strokeWidth={2.7} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.eyebrow}>ENDPOINT ISSUE LIST</Text>
        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.subtitle}>{config.subtitle}</Text>
      </View>

      <View style={styles.heroCard}>
        <View style={[styles.heroIcon, { backgroundColor: config.color }]}>
          <Icon size={25} color={colors.white} strokeWidth={2.7} />
        </View>

        <Text style={styles.heroTitle}>{config.title}</Text>
        <Text style={styles.heroDesc}>
          Mobile list shows selected records only. Full endpoint list remains in
          the main EMA web system.
        </Text>

        <View style={styles.heroMetricRow}>
          <View style={styles.heroMetric}>
            <Text style={styles.heroMetricValue}>{config.records.length}</Text>
            <Text style={styles.heroMetricLabel}>Preview Records</Text>
          </View>

          <View style={styles.heroDivider} />

          <View style={styles.heroMetric}>
            <Text style={styles.heroMetricValue}>Top</Text>
            <Text style={styles.heroMetricLabel}>Priority View</Text>
          </View>
        </View>
      </View>

      <View style={styles.listPanel}>
        {config.records.map((record, index) => (
          <TouchableOpacity
            key={record.device}
            style={[
              styles.deviceRow,
              index === config.records.length - 1 && styles.rowLast,
            ]}
            activeOpacity={0.85}
            onPress={() => openDevice(record)}
          >
            <View style={[styles.deviceIcon, { backgroundColor: `${config.color}18` }]}>
              <Icon size={18} color={config.color} strokeWidth={2.7} />
            </View>

            <View style={styles.deviceTextWrap}>
              <Text style={styles.deviceName}>{record.device}</Text>
              <Text style={styles.deviceMeta}>
                {record.site} · {record.status}
              </Text>
              <Text style={styles.lastSeen}>Last seen: {record.lastSeen}</Text>
            </View>

            <StatusPill
              label={record.risk}
              tone={record.risk === "High" ? "red" : "amber"}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.notePanel}>
        <Text style={styles.noteTitle}>Mobile scope</Text>
        <Text style={styles.noteText}>
          This list is intended for quick review only. Use the main web system
          for full inventory, filtering and evidence checking.
        </Text>
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
  header: { marginBottom: 16 },
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
  heroIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 18,
  },
  heroDesc: {
    color: "#AFC0D6",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
    marginTop: 7,
  },
  heroMetricRow: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.12)",
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  heroMetric: { flex: 1 },
  heroMetricValue: {
    color: colors.white,
    fontSize: 25,
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
  listPanel: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 18,
  },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLast: { borderBottomWidth: 0 },
  deviceIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  deviceTextWrap: { flex: 1 },
  deviceName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
  },
  deviceMeta: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
  },
  lastSeen: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "700",
    marginTop: 3,
  },
  notePanel: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noteTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
  },
  noteText: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 5,
  },
});
