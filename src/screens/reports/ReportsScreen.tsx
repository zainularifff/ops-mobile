import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronRight, FileText, RefreshCcw } from "lucide-react-native";

import StatusPill from "../../components/StatusPill";
import { useLiveReports } from "../../hooks/useLiveOpsData";
import { colors } from "../../theme/colors";
import { reportIconStyle, reportIdStyle, styles } from "./ReportsScreen.styles";

export default function ReportsScreen() {
  const navigation = useNavigation<any>();
  const { reports, loading, refreshing, error, reloadReports } = useLiveReports();

  function openReport(report: any) {
    navigation.navigate("ReportDetail", { report });
  }

  function handleRefresh() {
    reloadReports({ silent: true });
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>EMA OPS MOBILE</Text>
          <Text style={styles.title}>Reports</Text>
          <Text style={styles.subtitle}>View report catalogue loaded from the EMA backend.</Text>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.heroIcon}>
              <FileText size={26} color={colors.white} strokeWidth={2.7} />
            </View>
            <StatusPill label="Live Catalog" tone="blue" />
          </View>

          <Text style={styles.heroTitle}>Operational Reports</Text>
          <Text style={styles.heroDesc}>This screen only renders records returned by the backend.</Text>

          <View style={styles.heroMetricRow}>
            <View style={styles.heroMetric}>
              <Text style={styles.heroValue}>{reports.length}</Text>
              <Text style={styles.heroMetricLabel}>Report Types</Text>
            </View>

            <View style={styles.heroDivider} />

            <TouchableOpacity style={styles.heroMetric} activeOpacity={0.85} onPress={handleRefresh}>
              {refreshing || loading ? (
                <ActivityIndicator size="small" color={colors.blue} />
              ) : (
                <RefreshCcw size={20} color={colors.blue} strokeWidth={2.7} />
              )}
              <Text style={styles.heroMetricLabel}>Refresh</Text>
            </TouchableOpacity>
          </View>
        </View>

        {error ? (
          <View style={styles.resultSummary}>
            <Text style={[styles.resultText, { color: colors.red }]}>{error}</Text>
          </View>
        ) : null}

        {loading ? <ActivityIndicator size="small" color={colors.blue} /> : null}

        {!loading && reports.length === 0 ? (
          <View style={styles.resultSummary}>
            <Text style={styles.resultText}>No live report found.</Text>
          </View>
        ) : null}

        <View style={styles.reportList}>
          {reports.map((report) => {
            const reportColor = getReportColor(report.category);

            return (
              <TouchableOpacity
                key={report.id}
                activeOpacity={0.85}
                style={styles.reportCard}
                onPress={() => openReport(report)}
              >
                <View style={styles.reportTop}>
                  <View style={[styles.reportIcon, reportIconStyle(reportColor)]}>
                    <FileText size={20} color={reportColor} strokeWidth={2.7} />
                  </View>

                  <View style={styles.reportTextWrap}>
                    <View style={styles.reportIdRow}>
                      <Text style={[styles.reportId, reportIdStyle(reportColor)]}>{report.id}</Text>
                      {report.status ? (
                        <StatusPill label={report.status} tone={(report.tone || "blue") as any} />
                      ) : null}
                    </View>

                    <Text style={styles.reportTitle}>{report.title}</Text>
                    <Text style={styles.reportDesc}>{report.description}</Text>
                  </View>
                </View>

                <View style={styles.reportMetaBox}>
                  <MetaItem label="Frequency" value={report.frequency || "-"} />
                  <MetaItem label="Pages" value={report.pages ? `${report.pages} pages` : "-"} />
                  <MetaItem label="Generated" value={report.lastGenerated || "-"} />
                </View>

                <View style={styles.reportFooter}>
                  <Text style={styles.generatedText}>Tap to view summary</Text>
                  <ChevronRight size={16} color={colors.muted} strokeWidth={2.7} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getReportColor(category: string) {
  if (category === "ticket") return colors.purple;
  if (category === "remote") return colors.cyan;
  if (category === "software") return colors.amber;
  if (category === "asset") return colors.green;
  if (category === "geo") return colors.red;
  return colors.blue;
}

function MetaItem({ label, value }: any) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}
