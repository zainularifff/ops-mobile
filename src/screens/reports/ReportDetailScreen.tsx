import React, { useState } from "react";
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
  BarChart3,
  CheckCircle2,
  Download,
  FileText,
} from "lucide-react-native";

import StatusPill from "../../components/StatusPill";
import { colors } from "../../theme/colors";
import { generateAndShareReportPdf } from "../../utils/reportPdf";
import { getReportPdfPayload } from "../../data/reportPdfMock";

const reportSections: any = {
  executive: [
    {
      title: "Overall Operations Health",
      statement:
        "Summarises endpoint health, ticket workload, risk exposure and items requiring attention.",
    },
    {
      title: "Today’s Attention",
      statement:
        "Highlights urgent operational issues such as offline endpoints, SLA risk and high-risk items.",
    },
    {
      title: "Management Summary",
      statement:
        "Provides executive-friendly status without requiring full technical investigation.",
    },
  ],
  endpoint: [
    {
      title: "Endpoint Coverage",
      statement:
        "Shows managed endpoints, active devices, offline devices and stale reporting status.",
    },
    {
      title: "Site Breakdown",
      statement:
        "Identifies selected sites with higher endpoint review or reporting issues.",
    },
    {
      title: "Endpoint Follow-up",
      statement:
        "Lists devices requiring operation review or support follow-up.",
    },
  ],
  ticket: [
    {
      title: "Ticket Workload",
      statement:
        "Summarises open tickets, SLA risk, pending assignment and in-progress support work.",
    },
    {
      title: "SLA Risk",
      statement: "Identifies tickets approaching escalation threshold.",
    },
    {
      title: "Resolution Summary",
      statement:
        "Shows tickets resolved today and items pending closure validation.",
    },
  ],
  remote: [
    {
      title: "Remote Session Activity",
      statement:
        "Summarises remote control activity for monitoring and audit visibility.",
    },
    {
      title: "Failed Attempts",
      statement:
        "Highlights failed remote sessions that may require endpoint or permission review.",
    },
    {
      title: "After-hours Review",
      statement:
        "Shows remote activity outside normal support hours for audit review.",
    },
  ],
  software: [
    {
      title: "Software Compliance",
      statement:
        "Summarises approved, outdated, vulnerable and unauthorized software visibility.",
    },
    {
      title: "Unauthorized Software",
      statement: "Highlights software requiring approval or removal action.",
    },
    {
      title: "Security Exposure",
      statement:
        "Identifies software items that may introduce vulnerability exposure.",
    },
  ],
  asset: [
    {
      title: "Asset Lifecycle",
      statement:
        "Summarises asset age, lifecycle condition and replacement planning visibility.",
    },
    {
      title: "Aging Assets",
      statement: "Highlights devices approaching replacement planning stage.",
    },
    {
      title: "Critical Aging",
      statement:
        "Identifies assets requiring replacement review or risk prioritisation.",
    },
  ],
  geo: [
    {
      title: "Location Coverage",
      statement:
        "Summarises devices with tracked, unknown and mismatched location status.",
    },
    {
      title: "Unknown Location",
      statement: "Highlights endpoints without reliable location data.",
    },
    {
      title: "Location Accuracy",
      statement: "Provides review indicators for location coverage quality.",
    },
  ],
};

export default function ReportDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();

  const [generatingPdf, setGeneratingPdf] = useState(false);

  const report = route.params?.report || {};
  const color = getReportColor(report.category);
  const sections = reportSections[report.category] || reportSections.executive;

  async function handleGeneratePdf() {
    try {
      setGeneratingPdf(true);

      const pdfPayload = getReportPdfPayload(report, sections);

      await generateAndShareReportPdf(pdfPayload);
    } catch (error) {
      console.log("Generate PDF error:", error);
    } finally {
      setGeneratingPdf(false);
    }
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

      <View style={styles.profileCard}>
        <View style={styles.profileTop}>
          <View style={[styles.profileIcon, { backgroundColor: color }]}>
            <FileText size={27} color={colors.white} strokeWidth={2.7} />
          </View>

          <View style={styles.badgeWrap}>
            <StatusPill
              label={report.status || "Ready"}
              tone={report.tone || "blue"}
            />
          </View>
        </View>

        <Text style={styles.profileLabel}>{report.id || "RPT-000"}</Text>

        <Text style={styles.profileTitle}>
          {report.title || "EMA OPS Report"}
        </Text>

        <Text style={styles.profileDesc}>
          {report.description || "Generated operational report summary."}
        </Text>

        <View style={styles.profileMetricRow}>
          <View style={styles.profileMetric}>
            <Text style={styles.profileValue}>{report.pages || 0}</Text>
            <Text style={styles.profileMetricLabel}>Pages</Text>
          </View>

          <View style={styles.profileDivider} />

          <View style={styles.profileMetric}>
            <Text style={styles.profileValue}>Summary</Text>
            <Text style={styles.profileMetricLabel}>Mobile View</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoPanel}>
        <Text style={styles.panelTitle}>Report Information</Text>

        <InfoTextRow label="Frequency" value={report.frequency || "-"} />

        <InfoTextRow
          label="Last Generated"
          value={report.lastGenerated || "-"}
        />

        <InfoTextRow
          label="PDF Output"
          value="Generated PDF includes report-specific metrics, findings and selected detail records based on the selected report type."
        />
      </View>

      <View style={styles.sectionHeader}>
        <BarChart3 size={16} color={color} strokeWidth={2.7} />
        <Text style={styles.sectionTitle}>Report Sections</Text>
      </View>

      <View style={styles.sectionList}>
        {sections.map((item: any, index: number) => (
          <View key={item.title} style={styles.sectionCard}>
            <View
              style={[
                styles.sectionNumber,
                { backgroundColor: `${color}18` },
              ]}
            >
              <Text style={[styles.sectionNumberText, { color }]}>
                {index + 1}
              </Text>
            </View>

            <View style={styles.sectionTextWrap}>
              <Text style={styles.sectionCardTitle}>{item.title}</Text>
              <Text style={styles.sectionStatement}>{item.statement}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.actionPanel}>
        <View style={styles.actionIcon}>
          <CheckCircle2 size={20} color={colors.green} strokeWidth={2.7} />
        </View>

        <View style={styles.actionTextWrap}>
          <Text style={styles.actionTitle}>Recommended Mobile Use</Text>
          <Text style={styles.actionText}>
            Use this page to confirm report availability and review key report
            sections. Generate PDF creates a report-specific summary with mock
            operational detail data.
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.generateButton,
          generatingPdf && styles.generateButtonDisabled,
        ]}
        activeOpacity={0.85}
        onPress={handleGeneratePdf}
        disabled={generatingPdf}
      >
        <Download size={18} color={colors.white} strokeWidth={2.7} />
        <Text style={styles.generateButtonText}>
          {generatingPdf ? "Generating PDF..." : "Generate PDF"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
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

function InfoTextRow({ label, value }: any) {
  return (
    <View style={styles.infoTextRow}>
      <Text style={styles.infoTextLabel}>{label}</Text>
      <Text style={styles.infoTextValue}>{value}</Text>
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
  badgeWrap: {
    alignItems: "flex-end",
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
  profileMetricRow: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.12)",
    flexDirection: "row",
    alignItems: "center",
  },
  profileMetric: {
    flex: 1,
  },
  profileValue: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "900",
  },
  profileMetricLabel: {
    color: "#8FA3BC",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
  },
  profileDivider: {
    width: 1,
    height: 38,
    backgroundColor: "rgba(255,255,255,0.14)",
    marginHorizontal: 16,
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
    lineHeight: 18,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
    marginLeft: 7,
  },
  sectionList: {
    gap: 12,
    marginBottom: 16,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    flexDirection: "row",
  },
  sectionNumber: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  sectionNumberText: {
    fontSize: 13,
    fontWeight: "900",
  },
  sectionTextWrap: {
    flex: 1,
  },
  sectionCardTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
  },
  sectionStatement: {
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
  generateButton: {
    backgroundColor: colors.blue,
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  generateButtonDisabled: {
    opacity: 0.65,
  },
  generateButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "900",
    marginLeft: 8,
  },
});