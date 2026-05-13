import React, { useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Activity,
  Archive,
  BarChart3,
  CalendarClock,
  ChevronDown,
  ChevronRight,
  FileText,
  Filter,
  MapPin,
  MonitorCog,
  RadioTower,
  ShieldCheck,
  Ticket,
  X,
} from "lucide-react-native";

import StatusPill from "../../components/StatusPill";
import { colors } from "../../theme/colors";

import {
  reportIconStyle,
  reportIdStyle,
  styles,
} from "./ReportsScreen.styles";

type ReportCategory =
  | "all"
  | "executive"
  | "endpoint"
  | "ticket"
  | "remote"
  | "software"
  | "asset"
  | "geo";

const filters: { key: ReportCategory; label: string }[] = [
  { key: "all", label: "All Reports" },
  { key: "executive", label: "Executive Reports" },
  { key: "endpoint", label: "Endpoint Reports" },
  { key: "ticket", label: "Ticket Reports" },
  { key: "remote", label: "Remote Activity Reports" },
  { key: "software", label: "Software & Security Reports" },
  { key: "asset", label: "Asset Lifecycle Reports" },
  { key: "geo", label: "Geolocation Reports" },
];

const reports = [
  {
    id: "RPT-001",
    category: "executive",
    title: "Executive Operations Summary",
    description:
      "High-level view of endpoint health, tickets, risk and operational attention.",
    frequency: "Daily / Weekly",
    lastGenerated: "Today, 9:00 AM",
    pages: 6,
    status: "Ready",
    tone: "green",
  },
  {
    id: "RPT-002",
    category: "endpoint",
    title: "Endpoint Health Report",
    description:
      "Managed endpoint coverage, active reporting, offline and stale device summary.",
    frequency: "Daily",
    lastGenerated: "Today, 8:30 AM",
    pages: 8,
    status: "Ready",
    tone: "green",
  },
  {
    id: "RPT-003",
    category: "ticket",
    title: "Support Ticket Workload Report",
    description:
      "Open tickets, SLA risk, pending assignment, progress and resolution summary.",
    frequency: "Daily",
    lastGenerated: "Today, 8:45 AM",
    pages: 7,
    status: "Ready",
    tone: "green",
  },
  {
    id: "RPT-004",
    category: "remote",
    title: "Remote Control Activity Report",
    description:
      "Remote session activity, success, failed attempts, after-hours and audit review.",
    frequency: "Weekly",
    lastGenerated: "Yesterday, 5:30 PM",
    pages: 5,
    status: "Review",
    tone: "amber",
  },
  {
    id: "RPT-005",
    category: "software",
    title: "Software & Security Visibility Report",
    description:
      "Unauthorized software, outdated software, vulnerable items and compliance summary.",
    frequency: "Weekly",
    lastGenerated: "Yesterday, 4:00 PM",
    pages: 9,
    status: "Review",
    tone: "amber",
  },
  {
    id: "RPT-006",
    category: "asset",
    title: "Asset Lifecycle Report",
    description:
      "New assets, standard lifecycle, aging assets and critical aging replacement view.",
    frequency: "Monthly",
    lastGenerated: "This month",
    pages: 8,
    status: "Ready",
    tone: "blue",
  },
  {
    id: "RPT-007",
    category: "geo",
    title: "Geolocation Coverage Report",
    description:
      "Tracked devices, unknown locations, mismatch records and location accuracy review.",
    frequency: "Weekly",
    lastGenerated: "This week",
    pages: 5,
    status: "Ready",
    tone: "blue",
  },
];

export default function ReportsScreen() {
  const navigation = useNavigation<any>();

  const [activeFilter, setActiveFilter] = useState<ReportCategory>("all");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const activeFilterLabel =
    filters.find((item) => item.key === activeFilter)?.label || "All Reports";

  const filteredReports = useMemo(() => {
    if (activeFilter === "all") return reports;
    return reports.filter((item) => item.category === activeFilter);
  }, [activeFilter]);

  function openReport(report: any) {
    navigation.navigate("ReportDetail", { report });
  }

  function selectFilter(key: ReportCategory) {
    setActiveFilter(key);
    setDropdownVisible(false);
  }

  return (
    <>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <ScrollView
          style={styles.page}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.header}>
            <Text style={styles.eyebrow}>EMA OPS MOBILE</Text>
            <Text style={styles.title}>Reports</Text>
            <Text style={styles.subtitle}>
              View generated report summaries and report catalogue.
            </Text>
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroTop}>
              <View style={styles.heroIcon}>
                <FileText size={26} color={colors.white} strokeWidth={2.7} />
              </View>

              <StatusPill label="Summary View" tone="blue" />
            </View>

            <Text style={styles.heroTitle}>Operational Reports</Text>
            <Text style={styles.heroDesc}>
              Mobile report access is designed for quick summary review. Full
              report generation and detailed export remain in the main EMA web
              system.
            </Text>

            <View style={styles.heroMetricRow}>
              <View style={styles.heroMetric}>
                <Text style={styles.heroValue}>{reports.length}</Text>
                <Text style={styles.heroMetricLabel}>Report Types</Text>
              </View>

              <View style={styles.heroDivider} />

              <View style={styles.heroMetric}>
                <Text style={styles.heroValue}>2</Text>
                <Text style={styles.heroMetricLabel}>Need Review</Text>
              </View>
            </View>
          </View>

          <View style={styles.filterHeader}>
            <View style={styles.filterTitleWrap}>
              <Filter size={15} color={colors.blue} strokeWidth={2.7} />
              <Text style={styles.filterTitle}>Report Category</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.dropdownButton}
            activeOpacity={0.85}
            onPress={() => setDropdownVisible(true)}
          >
            <View>
              <Text style={styles.dropdownLabel}>Selected category</Text>
              <Text style={styles.dropdownValue}>{activeFilterLabel}</Text>
            </View>

            <View style={styles.dropdownIconWrap}>
              <ChevronDown size={18} color={colors.blue} strokeWidth={2.7} />
            </View>
          </TouchableOpacity>

          <View style={styles.resultSummary}>
            <Text style={styles.resultText}>
              Showing {filteredReports.length} of {reports.length} reports
            </Text>
          </View>

          <View style={styles.reportList}>
            {filteredReports.map((report) => {
              const reportColor = getReportColor(report.category);

              return (
                <TouchableOpacity
                  key={report.id}
                  activeOpacity={0.85}
                  style={styles.reportCard}
                  onPress={() => openReport(report)}
                >
                  <View style={styles.reportTop}>
                    <View
                      style={[styles.reportIcon, reportIconStyle(reportColor)]}
                    >
                      <ReportIcon
                        category={report.category}
                        color={reportColor}
                      />
                    </View>

                    <View style={styles.reportTextWrap}>
                      <View style={styles.reportIdRow}>
                        <Text
                          style={[
                            styles.reportId,
                            reportIdStyle(reportColor),
                          ]}
                        >
                          {report.id}
                        </Text>

                        <StatusPill
                          label={report.status}
                          tone={report.tone as any}
                        />
                      </View>

                      <Text style={styles.reportTitle}>{report.title}</Text>
                      <Text style={styles.reportDesc}>
                        {report.description}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.reportMetaBox}>
                    <MetaItem label="Frequency" value={report.frequency} />
                    <MetaItem label="Pages" value={`${report.pages} pages`} />
                    <MetaItem label="Generated" value={report.lastGenerated} />
                  </View>

                  <View style={styles.reportFooter}>
                    <View style={styles.generatedWrap}>
                      <CalendarClock
                        size={13}
                        color={colors.muted}
                        strokeWidth={2.6}
                      />
                      <Text style={styles.generatedText}>
                        Tap to view summary
                      </Text>
                    </View>

                    <ChevronRight
                      size={16}
                      color={colors.muted}
                      strokeWidth={2.7}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal visible={dropdownVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.dropdownModal}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Select Category</Text>
                <Text style={styles.modalSubtitle}>
                  Filter report catalogue by report type
                </Text>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                activeOpacity={0.85}
                onPress={() => setDropdownVisible(false)}
              >
                <X size={18} color={colors.textSoft} strokeWidth={2.7} />
              </TouchableOpacity>
            </View>

            <View style={styles.optionList}>
              {filters.map((item) => {
                const active = activeFilter === item.key;

                return (
                  <TouchableOpacity
                    key={item.key}
                    activeOpacity={0.85}
                    style={[
                      styles.optionRow,
                      active && styles.optionRowActive,
                    ]}
                    onPress={() => selectFilter(item.key)}
                  >
                    <View style={styles.optionTextWrap}>
                      <Text
                        style={[
                          styles.optionText,
                          active && styles.optionTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>

                      <Text style={styles.optionSubtext}>
                        {getFilterDescription(item.key)}
                      </Text>
                    </View>

                    {active ? (
                      <StatusPill label="Selected" tone="blue" />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

function ReportIcon({ category, color }: any) {
  if (category === "executive") {
    return <BarChart3 size={20} color={color} strokeWidth={2.7} />;
  }

  if (category === "endpoint") {
    return <MonitorCog size={20} color={color} strokeWidth={2.7} />;
  }

  if (category === "ticket") {
    return <Ticket size={20} color={color} strokeWidth={2.7} />;
  }

  if (category === "remote") {
    return <RadioTower size={20} color={color} strokeWidth={2.7} />;
  }

  if (category === "software") {
    return <ShieldCheck size={20} color={color} strokeWidth={2.7} />;
  }

  if (category === "asset") {
    return <Archive size={20} color={color} strokeWidth={2.7} />;
  }

  if (category === "geo") {
    return <MapPin size={20} color={color} strokeWidth={2.7} />;
  }

  return <Activity size={20} color={color} strokeWidth={2.7} />;
}

function getReportColor(category: string) {
  if (category === "executive") return colors.blue;
  if (category === "endpoint") return colors.blue;
  if (category === "ticket") return colors.purple;
  if (category === "remote") return colors.cyan;
  if (category === "software") return colors.amber;
  if (category === "asset") return colors.green;
  if (category === "geo") return colors.red;

  return colors.blue;
}

function getFilterDescription(category: ReportCategory) {
  if (category === "all") return "Show all available mobile report summaries";
  if (category === "executive") return "High-level management summary reports";
  if (category === "endpoint") return "Endpoint health and reporting status";
  if (category === "ticket") return "Support workload and SLA risk reports";
  if (category === "remote") return "Remote control activity and audit reports";
  if (category === "software") return "Software compliance and security reports";
  if (category === "asset") return "Asset lifecycle and aging reports";
  if (category === "geo") return "Location coverage and accuracy reports";

  return "Report category";
}

function MetaItem({ label, value }: any) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}