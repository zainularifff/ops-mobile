import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileWarning,
  RefreshCcw,
  Server,
  ShieldCheck,
  Ticket,
  WifiOff,
} from "lucide-react-native";

import StatusPill from "../../components/StatusPill";
import { dashboardSummary } from "../../data/mockDashboard";
import { formatNumber } from "../../utils/formatters";
import { styles } from "./OverviewScreen.styles";

type GradientColors = [string, string];

const palette = {
  blue: "#2563EB",
  cyan: "#0891B2",
  purple: "#7C3AED",
  red: "#DC2626",
  amber: "#D97706",
  green: "#059669",
  navy: "#07111F",
};

const operationalExceptions = [
  {
    title: "Stale device detected",
    source: "JPJ-PUTRAJAYA-WS-014",
    site: "Putrajaya",
    time: "12 min ago",
    severity: "High",
    icon: WifiOff,
    color: palette.red,
    reason:
      "Device has not reported update within the expected monitoring window.",
    recommendedAction:
      "Verify endpoint status, network availability, and agent health. Escalate to site support if device is still active.",
  },
  {
    title: "SLA risk ticket pending",
    source: "INC-24051",
    site: "Kuala Lumpur HQ",
    time: "18 min ago",
    severity: "High",
    icon: Ticket,
    color: palette.purple,
    reason:
      "Ticket is approaching SLA escalation threshold and requires follow-up.",
    recommendedAction:
      "Review ticket owner, update ticket progress, and escalate to support lead if resolution is blocked.",
  },
  {
    title: "Unauthorized software pending review",
    source: "SHAH-ALAM-LAP-022",
    site: "Shah Alam",
    time: "25 min ago",
    severity: "Medium",
    icon: FileWarning,
    color: palette.amber,
    reason:
      "Detected software requires validation against approved software policy.",
    recommendedAction:
      "Confirm whether software is approved, business-required, or should be removed from the endpoint.",
  },
];

type StatusCardConfig = {
  id: string;
  title: string;
  description: string;
  value: number;
  percent: number;
  progressLabel: string;
  icon: any;
  gradient: GradientColors;
  target: string;
};

type PriorityConfig = {
  title: string;
  value: number;
  description: string;
  icon: any;
  color: string;
  tone: "red" | "amber" | "purple" | "blue" | "green";
  label: string;
  target: string;
};

export default function OverviewScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const activeCoverage = useMemo(() => {
    if (!dashboardSummary.totalEndpoints) return 0;

    return Math.round(
      (dashboardSummary.activeDevices / dashboardSummary.totalEndpoints) * 100
    );
  }, []);

  const notReporting = useMemo(() => {
    return Math.max(
      dashboardSummary.totalEndpoints - dashboardSummary.activeDevices,
      0
    );
  }, []);

  const notReportingRate = useMemo(() => {
    if (!dashboardSummary.totalEndpoints) return 0;

    return Math.round((notReporting / dashboardSummary.totalEndpoints) * 100);
  }, [notReporting]);

  const highRiskRate = useMemo(() => {
    if (!dashboardSummary.openTickets) return 0;

    return Math.round(
      (dashboardSummary.highRiskExceptions / dashboardSummary.openTickets) * 100
    );
  }, []);

  const statusCards: StatusCardConfig[] = [
    {
      id: "managed",
      title: "Managed Assets",
      description: "Total monitored endpoints",
      value: dashboardSummary.totalEndpoints,
      percent: 100,
      progressLabel: "Monitoring scope",
      icon: Server,
      gradient: ["#1E3A8A", "#2563EB"],
      target: "EndpointSummary",
    },
    {
      id: "active",
      title: "Active Reporting",
      description: "Reporting within 7 days",
      value: dashboardSummary.activeDevices,
      percent: activeCoverage,
      progressLabel: "Active coverage",
      icon: CheckCircle2,
      gradient: ["#065F46", "#10B981"],
      target: "ActiveDeviceCoverage",
    },
    {
      id: "offline",
      title: "Not Reporting",
      description: "Requires endpoint review",
      value: notReporting,
      percent: notReportingRate,
      progressLabel: "Offline exposure",
      icon: WifiOff,
      gradient: ["#991B1B", "#EF4444"],
      target: "EndpointSummary",
    },
    {
      id: "risk",
      title: "High Risk",
      description: "Need operational attention",
      value: dashboardSummary.highRiskExceptions,
      percent: highRiskRate,
      progressLabel: "Risk exposure",
      icon: AlertTriangle,
      gradient: ["#581C87", "#8B5CF6"],
      target: "RiskSummary",
    },
  ];

  const priorityRows: PriorityConfig[] = [
    {
      title: "Offline / Not Reporting",
      value: notReporting,
      description: "Devices require endpoint follow-up",
      icon: WifiOff,
      color: palette.red,
      tone: "red",
      label: "Action",
      target: "EndpointSummary",
    },
    {
      title: "Open Tickets",
      value: dashboardSummary.openTickets,
      description: "Support workload requiring attention",
      icon: Ticket,
      color: palette.purple,
      tone: "purple",
      label: "Review",
      target: "TicketSummary",
    },
    {
      title: "High Risk Exceptions",
      value: dashboardSummary.highRiskExceptions,
      description: "Operational items requiring escalation",
      icon: AlertTriangle,
      color: palette.amber,
      tone: "amber",
      label: "Watch",
      target: "RiskSummary",
    },
  ];

  function goTo(target: string) {
    navigation.navigate(target);
  }

  function openException(item: (typeof operationalExceptions)[number]) {
    navigation.navigate("ExceptionDetail", {
      title: item.title,
      source: item.source,
      site: item.site,
      time: item.time,
      severity: item.severity,
      reason: item.reason,
      recommendedAction: item.recommendedAction,
    });
  }

  function handleRefresh() {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 650);
  }

  return (
    <View style={styles.page}>
      <View style={[styles.safeTopBlock, { height: insets.top }]} />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: 12,
            paddingBottom: Math.max(insets.bottom, 18) + 118,
          },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
        contentInsetAdjustmentBehavior="never"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.pageTitle}>Operations Overview</Text>
            <Text style={styles.pageMeta}>
              Malaysia Sites  •  Mock Data  •  Just now
            </Text>
          </View>

          <TouchableOpacity
            style={styles.refreshButton}
            activeOpacity={0.85}
            onPress={handleRefresh}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color={palette.blue} />
            ) : (
              <RefreshCcw size={18} color={palette.blue} strokeWidth={2.7} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroGlowTop} />
          <View style={styles.heroGlowBottom} />

          <View style={styles.heroTopRow}>
            <View style={styles.heroIcon}>
              <ShieldCheck size={27} color="#FFFFFF" strokeWidth={2.8} />
            </View>

            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>MONITORING VIEW</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>Operational Health Status</Text>

          <Text style={styles.heroDesc}>
            Lightweight companion view for quick monitoring, urgent exceptions
            and operational awareness across selected Malaysian sites.
          </Text>

          <View style={styles.heroDivider} />

          <View style={styles.heroStats}>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatValue}>
                {formatNumber(dashboardSummary.totalEndpoints)}
              </Text>
              <Text style={styles.heroStatLabel}>Managed Endpoints</Text>
            </View>

            <View style={styles.heroStatDivider} />

            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatValue}>{activeCoverage}%</Text>
              <Text style={styles.heroStatLabel}>Active Coverage</Text>
            </View>

            <View style={styles.heroStatDivider} />

            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatValue}>
                {formatNumber(dashboardSummary.highRiskExceptions)}
              </Text>
              <Text style={styles.heroStatLabel}>High Risk</Text>
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Operational Status</Text>
            <Text style={styles.panelFilter}>Live View</Text>
          </View>

          <View style={styles.statusGrid}>
            {statusCards.map((item) => (
              <StatusMiniCard
                key={item.id}
                title={item.title}
                description={item.description}
                value={item.value}
                percent={item.percent}
                progressLabel={item.progressLabel}
                icon={item.icon}
                gradient={item.gradient}
                onPress={() => goTo(item.target)}
              />
            ))}
          </View>
        </View>

        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Priority Overview</Text>
            <Text style={styles.panelFilter}>Today</Text>
          </View>

          <View style={styles.priorityList}>
            {priorityRows.map((item, index) => (
              <PriorityRow
                key={item.title}
                title={item.title}
                value={item.value}
                description={item.description}
                icon={item.icon}
                color={item.color}
                tone={item.tone}
                label={item.label}
                isLast={index === priorityRows.length - 1}
                onPress={() => goTo(item.target)}
              />
            ))}
          </View>
        </View>

        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Operational Exceptions</Text>
            <Text style={styles.panelFilter}>Latest</Text>
          </View>

          <View style={styles.exceptionList}>
            {operationalExceptions.map((item, index) => (
              <ExceptionRow
                key={item.title}
                title={item.title}
                source={item.source}
                site={item.site}
                time={item.time}
                severity={item.severity}
                icon={item.icon}
                color={item.color}
                isLast={index === operationalExceptions.length - 1}
                onPress={() => openException(item)}
              />
            ))}
          </View>
        </View>

        <View style={styles.companionCard}>
          <View style={styles.companionIcon}>
            <Clock3 size={18} color={palette.cyan} strokeWidth={2.7} />
          </View>

          <View style={styles.companionTextWrap}>
            <Text style={styles.companionTitle}>Mobile Companion View</Text>
            <Text style={styles.companionDesc}>
              Full charts, tables, filters and detailed analysis remain in the
              main EMA web system.
            </Text>
          </View>

          <StatusPill label="UAT" tone="blue" />
        </View>
      </ScrollView>
    </View>
  );
}

type StatusMiniCardProps = {
  title: string;
  description: string;
  value: number;
  percent: number;
  progressLabel: string;
  icon: any;
  gradient: GradientColors;
  onPress: () => void;
};

function StatusMiniCard({
  title,
  description,
  value,
  percent,
  progressLabel,
  icon: Icon,
  gradient,
  onPress,
}: StatusMiniCardProps) {
  const safePercent = Math.max(0, Math.min(percent, 100));

  return (
    <TouchableOpacity
      style={styles.statusMiniCardShell}
      activeOpacity={0.88}
      onPress={onPress}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statusMiniCard}
      >
        <View style={styles.cardGlowOne} />
        <View style={styles.cardGlowTwo} />

        <View style={styles.statusMiniTop}>
          <View style={styles.statusValueWrap}>
            <Text style={styles.statusMiniValue}>{formatNumber(value)}</Text>
            <Text style={styles.statusMiniTitle}>{title}</Text>
          </View>

          <View style={styles.statusIcon}>
            <Icon size={15} color="#FFFFFF" strokeWidth={2.8} />
          </View>
        </View>

        <Text style={styles.statusMiniDesc}>{description}</Text>

        <View style={styles.progressInfoRow}>
          <Text style={styles.progressLabel}>{progressLabel}</Text>
          <Text style={styles.progressValue}>{safePercent}%</Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${safePercent}%`,
              },
            ]}
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

type PriorityRowProps = {
  title: string;
  value: number;
  description: string;
  icon: any;
  color: string;
  tone: "red" | "amber" | "purple" | "blue" | "green";
  label: string;
  isLast?: boolean;
  onPress: () => void;
};

function PriorityRow({
  title,
  value,
  description,
  icon: Icon,
  color,
  tone,
  label,
  isLast = false,
  onPress,
}: PriorityRowProps) {
  return (
    <TouchableOpacity
      style={[styles.priorityRow, isLast && styles.rowLast]}
      activeOpacity={0.86}
      onPress={onPress}
    >
      <View style={[styles.priorityAccent, { backgroundColor: color }]} />

      <View style={[styles.priorityIcon, { backgroundColor: `${color}12` }]}>
        <Icon size={17} color={color} strokeWidth={2.7} />
      </View>

      <View style={styles.priorityTextWrap}>
        <Text style={styles.priorityTitle}>{title}</Text>
        <Text style={styles.priorityDesc}>{description}</Text>
      </View>

      <View style={styles.priorityRight}>
        <Text style={styles.priorityValue}>{formatNumber(value)}</Text>
        <StatusPill label={label} tone={tone} />
      </View>
    </TouchableOpacity>
  );
}

type ExceptionRowProps = {
  title: string;
  source: string;
  site: string;
  time: string;
  severity: string;
  icon: any;
  color: string;
  isLast?: boolean;
  onPress: () => void;
};

function ExceptionRow({
  title,
  source,
  site,
  time,
  severity,
  icon: Icon,
  color,
  isLast = false,
  onPress,
}: ExceptionRowProps) {
  const tone = severity === "High" ? "red" : "amber";

  return (
    <TouchableOpacity
      style={[styles.exceptionRow, isLast && styles.rowLast]}
      activeOpacity={0.86}
      onPress={onPress}
    >
      <View style={[styles.exceptionIcon, { backgroundColor: `${color}12` }]}>
        <Icon size={17} color={color} strokeWidth={2.7} />
      </View>

      <View style={styles.exceptionTextWrap}>
        <View style={styles.exceptionTopRow}>
          <Text style={styles.exceptionTitle}>{title}</Text>
          <Text style={styles.exceptionTime}>{time}</Text>
        </View>

        <Text style={styles.exceptionMeta}>
          {source} · {site}
        </Text>
      </View>

      <StatusPill label={severity} tone={tone} />
    </TouchableOpacity>
  );
}