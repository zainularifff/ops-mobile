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
  MapPin,
  MonitorCog,
  RadioTower,
  UserRound,
} from "lucide-react-native";

import StatusPill from "../../components/StatusPill";
import { colors } from "../../theme/colors";
import { formatNumber } from "../../utils/formatters";

const activeDeviceRecords = [
  {
    device: "KL-HQ-LAP-014",
    user: "Finance User",
    site: "Kuala Lumpur HQ",
    status: "Active",
    lastSeen: "5 min ago",
    connectionWindow: "Today",
    health: "Normal",
    risk: "Low",
  },
  {
    device: "JPJ-PUTRAJAYA-WS-021",
    user: "Operation User",
    site: "Putrajaya",
    status: "Active",
    lastSeen: "8 min ago",
    connectionWindow: "Today",
    health: "Normal",
    risk: "Low",
  },
  {
    device: "SHAH-ALAM-LAP-077",
    user: "Support User",
    site: "Shah Alam",
    status: "Active",
    lastSeen: "14 min ago",
    connectionWindow: "Today",
    health: "Normal",
    risk: "Low",
  },
  {
    device: "JB-OPS-PC-119",
    user: "Branch User",
    site: "Johor Bahru",
    status: "Recently Active",
    lastSeen: "2 days ago",
    connectionWindow: "Last 7 Days",
    health: "Monitor",
    risk: "Low",
  },
  {
    device: "KL-HQ-WS-204",
    user: "Admin User",
    site: "Kuala Lumpur HQ",
    status: "Recently Active",
    lastSeen: "4 days ago",
    connectionWindow: "Last 7 Days",
    health: "Monitor",
    risk: "Low",
  },
  {
    device: "PUTRAJAYA-LAP-045",
    user: "Field User",
    site: "Putrajaya",
    status: "Recently Active",
    lastSeen: "6 days ago",
    connectionWindow: "Last 7 Days",
    health: "Monitor",
    risk: "Low",
  },
];

export default function ActiveDeviceListScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();

  const params = route.params || {};

  const title = params.title || "Active Devices";
  const subtitle =
    params.subtitle || "Devices currently reporting or recently active.";
  const filter = params.filter || "today";
  const site = params.site;

  const records = activeDeviceRecords.filter((item) => {
    if (filter === "today") return item.connectionWindow === "Today";
    if (filter === "last7") return item.connectionWindow === "Last 7 Days";
    if (filter === "site") return item.site === site;
    return true;
  });

  function openDevice(record: any) {
    navigation.navigate("DeviceQuickView", {
      device: record.device,
      site: record.site,
      status: record.status,
      lastSeen: record.lastSeen,
      risk: record.risk,
      category: "Active Device Coverage",
      action:
        "Device is currently reporting normally. Continue monitoring through EMA. Full device profile remains in the main web system.",
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
        <Text style={styles.eyebrow}>ACTIVE DEVICE LIST</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroIcon}>
          <CheckCircle2 size={25} color={colors.white} strokeWidth={2.7} />
        </View>

        <Text style={styles.heroTitle}>Reporting Normally</Text>
        <Text style={styles.heroDesc}>
          This list shows selected active devices suitable for mobile monitoring.
          Full inventory remains in the main EMA web system.
        </Text>

        <View style={styles.heroMetricRow}>
          <View style={styles.heroMetric}>
            <Text style={styles.heroMetricValue}>
              {formatNumber(records.length)}
            </Text>
            <Text style={styles.heroMetricLabel}>Preview Devices</Text>
          </View>

          <View style={styles.heroDivider} />

          <View style={styles.heroMetric}>
            <Text style={styles.heroMetricValue}>Normal</Text>
            <Text style={styles.heroMetricLabel}>Health Status</Text>
          </View>
        </View>
      </View>

      <View style={styles.listPanel}>
        {records.map((record, index) => (
          <TouchableOpacity
            key={record.device}
            style={[
              styles.deviceRow,
              index === records.length - 1 && styles.rowLast,
            ]}
            activeOpacity={0.85}
            onPress={() => openDevice(record)}
          >
            <View style={styles.deviceIcon}>
              <MonitorCog size={18} color={colors.green} strokeWidth={2.7} />
            </View>

            <View style={styles.deviceTextWrap}>
              <Text style={styles.deviceName}>{record.device}</Text>

              <View style={styles.metaRow}>
                <MapPin size={12} color={colors.muted} strokeWidth={2.6} />
                <Text style={styles.deviceMeta}>{record.site}</Text>
              </View>

              <View style={styles.metaRow}>
                <Clock3 size={12} color={colors.muted} strokeWidth={2.6} />
                <Text style={styles.lastSeen}>Last seen: {record.lastSeen}</Text>
              </View>

              <View style={styles.metaRow}>
                <UserRound size={12} color={colors.muted} strokeWidth={2.6} />
                <Text style={styles.lastSeen}>{record.user}</Text>
              </View>
            </View>

            <View style={styles.statusWrap}>
              <StatusPill
                label={record.status === "Active" ? "Active" : "Recent"}
                tone={record.status === "Active" ? "green" : "blue"}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.notePanel}>
        <View style={styles.noteIcon}>
          <RadioTower size={18} color={colors.cyan} strokeWidth={2.7} />
        </View>

        <View style={styles.noteTextWrap}>
          <Text style={styles.noteTitle}>Mobile scope</Text>
          <Text style={styles.noteText}>
            This screen only displays selected active records for quick
            monitoring. Full device history, inventory fields and technical logs
            remain in the main EMA web system.
          </Text>
        </View>
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
  header: {
    marginBottom: 16,
  },
  eyebrow: {
    color: colors.green,
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
    backgroundColor: colors.green,
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
  heroMetric: {
    flex: 1,
  },
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
  rowLast: {
    borderBottomWidth: 0,
  },
  deviceIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: "#EBF8F1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  deviceTextWrap: {
    flex: 1,
  },
  deviceName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 5,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  deviceMeta: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 5,
  },
  lastSeen: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 5,
  },
  statusWrap: {
    marginLeft: 8,
  },

  notePanel: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
  },
  noteIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: "#E9F7FB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  noteTextWrap: {
    flex: 1,
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
