import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
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

import {
  dynamicTextStyle,
  softBackgroundStyle,
  solidBackgroundStyle,
  styles,
} from "./ReportDetailScreen.styles";

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
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

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
            <View style={[styles.profileIcon, solidBackgroundStyle(color)]}>
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
              <View style={[styles.sectionNumber, softBackgroundStyle(color)]}>
                <Text
                  style={[
                    styles.sectionNumberText,
                    dynamicTextStyle(color),
                  ]}
                >
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
    </SafeAreaView>
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