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
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MapPin,
  RadioTower,
  RefreshCcw,
  WifiOff,
} from "lucide-react-native";

import StatusPill from "../../components/StatusPill";
import { colors } from "../../theme/colors";
import { dashboardSummary } from "../../data/mockDashboard";
import { formatNumber } from "../../utils/formatters";

const connectionWindows = [
  {
    label: "Today",
    value: 1840,
    desc: "Reported within current day",
    tone: "green" as const,
  },
  {
    label: "Last 7 Days",
    value: 2377,
    desc: "Recently active devices",
    tone: "blue" as const,
  },
  {
    label: "> 7 Days",
    value: 317,
    desc: "Stale reporting window",
    tone: "amber" as const,
  },
  {
    label: "Offline",
    value: 358,
    desc: "Not reporting / disconnected",
    tone: "red" as const,
  },
];

const activeSiteCoverage = [
  {
    site: "Kuala Lumpur HQ",
    active: 1126,
    total: 1280,
    coverage: "88%",
  },
  {
    site: "Putrajaya",
    active: 882,
    total: 980,
    coverage: "90%",
  },
  {
    site: "Shah Alam",
    active: 651,
    total: 740,
    coverage: "88%",
  },
  {
    site: "Johor Bahru",
    active: 548,
    total: 610,
    coverage: "90%",
  },
];

export default function ActiveDeviceCoverageScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  function openActiveList(filter: "today" | "last7" | "site", site?: string) {
    if (filter === "today") {
      navigation.navigate("ActiveDeviceList", {
        title: "Active Today",
        subtitle: "Devices reporting within the current day.",
        filter: "today",
      });
      return;
    }

    if (filter === "last7") {
      navigation.navigate("ActiveDeviceList", {
        title: "Recently Active Devices",
        subtitle: "Devices that reported within the last 7 days.",
        filter: "last7",
      });
      return;
    }

    navigation.navigate("ActiveDeviceList", {
      title: `${site} Active Devices`,
      subtitle: "Selected active device preview by site.",
      filter: "site",
      site,
    });
  }

  function handleWindowPress(label: string) {
    if (label === "Today") {
      openActiveList("today");
      return;
    }

    if (label === "Last 7 Days") {
      openActiveList("last7");
      return;
    }

    if (label === "> 7 Days") {
      navigation.navigate("EndpointIssueList", { type: "stale" });
      return;
    }

    navigation.navigate("EndpointIssueList", { type: "offline" });
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
        <Text style={styles.eyebrow}>ACTIVE COVERAGE</Text>
        <Text style={styles.title}>Active Device Coverage</Text>
        <Text style={styles.subtitle}>
          Mobile summary for endpoint reporting health and connection status.
        </Text>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroGlowOne} />
        <View style={styles.heroGlowTwo} />

        <View style={styles.heroContent}>
          <View style={styles.heroTop}>
            <View style={styles.heroIcon}>
              <CheckCircle2
                size={25}
                color={colors.white}
                strokeWidth={2.7}
              />
            </View>

            <View style={styles.heroStatus}>
              <Text style={styles.heroStatusText}>REPORTING HEALTH</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>Active Reporting Status</Text>

          <Text style={styles.heroDesc}>
            This drilldown focuses on devices currently reporting, recently
            active devices, stale endpoints and offline coverage.
          </Text>

          <View style={styles.heroMetricRow}>
            <View style={styles.heroMetric}>
              <Text style={styles.heroMetricValue}>
                {formatNumber(dashboardSummary.activeDevices)}
              </Text>
              <Text style={styles.heroMetricLabel}>Active Devices</Text>
            </View>

            <View style={styles.heroDivider} />

            <View style={styles.heroMetric}>
              <Text style={styles.heroMetricValue}>86%</Text>
              <Text style={styles.heroMetricLabel}>Active Coverage</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Connection Window</Text>
        <Text style={styles.sectionDesc}>
          Breakdown by latest reporting / connection period
        </Text>
      </View>

      <View style={styles.windowPanel}>
        {connectionWindows.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            activeOpacity={0.85}
            onPress={() => handleWindowPress(item.label)}
            style={[
              styles.windowRow,
              index === connectionWindows.length - 1 && styles.rowLast,
            ]}
          >
            <View style={styles.windowIcon}>
              {item.tone === "green" ? (
                <CheckCircle2
                  size={18}
                  color={colors.green}
                  strokeWidth={2.7}
                />
              ) : item.tone === "blue" ? (
                <RefreshCcw
                  size={18}
                  color={colors.blue}
                  strokeWidth={2.7}
                />
              ) : item.tone === "amber" ? (
                <Clock3 size={18} color={colors.amber} strokeWidth={2.7} />
              ) : (
                <WifiOff size={18} color={colors.red} strokeWidth={2.7} />
              )}
            </View>

            <View style={styles.windowTextWrap}>
              <Text style={styles.windowTitle}>{item.label}</Text>
              <Text style={styles.windowDesc}>{item.desc}</Text>
            </View>

            <View style={styles.windowRight}>
              <Text style={styles.windowValue}>{formatNumber(item.value)}</Text>
              <StatusPill
                label={item.tone === "red" ? "Action" : "Monitor"}
                tone={item.tone}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Active Coverage by Site</Text>
        <Text style={styles.sectionDesc}>
          Selected Malaysian site coverage for quick mobile review
        </Text>
      </View>

      <View style={styles.sitePanel}>
        {activeSiteCoverage.map((item, index) => (
          <TouchableOpacity
            key={item.site}
            activeOpacity={0.85}
            onPress={() => openActiveList("site", item.site)}
            style={[
              styles.siteRow,
              index === activeSiteCoverage.length - 1 && styles.rowLast,
            ]}
          >
            <View style={styles.siteIcon}>
              <MapPin size={18} color={colors.blue} strokeWidth={2.7} />
            </View>

            <View style={styles.siteTextWrap}>
              <Text style={styles.siteTitle}>{item.site}</Text>
              <Text style={styles.siteMeta}>
                {formatNumber(item.active)} active of {formatNumber(item.total)}
              </Text>
            </View>

            <View style={styles.coverageBadge}>
              <Text style={styles.coverageText}>{item.coverage}</Text>
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
            This screen focuses on reporting health only. Full device inventory
            and technical details remain in the main EMA web system.
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
    overflow: "hidden",
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
  },
  heroGlowOne: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: "rgba(31,157,101,0.28)",
    top: -70,
    right: -60,
  },
  heroGlowTwo: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 150,
    backgroundColor: "rgba(47,98,216,0.22)",
    bottom: -70,
    left: -50,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
  },
  heroStatus: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  heroStatusText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.4,
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

  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
  },
  sectionDesc: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
  },

  windowPanel: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 18,
  },
  windowRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  windowIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  windowTextWrap: {
    flex: 1,
  },
  windowTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
  },
  windowDesc: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
  },
  windowRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  windowValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },

  sitePanel: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 18,
  },
  siteRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  siteIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: "#EAF1FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  siteTextWrap: {
    flex: 1,
  },
  siteTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
  },
  siteMeta: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
  },
  coverageBadge: {
    backgroundColor: "#EBF8F1",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  coverageText: {
    color: colors.green,
    fontSize: 11,
    fontWeight: "900",
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
