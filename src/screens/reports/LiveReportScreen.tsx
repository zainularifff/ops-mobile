import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Download, FileText, Share2 } from "lucide-react-native";

import { getMobileReportById } from "../../config/mobileReports";
import { useMobileOpsSnapshot } from "../../hooks/useLiveOpsData";
import { generateAndShareMobileReport } from "../../services/mobileReportPdf";
import { colors } from "../../theme/colors";
import { formatNumber } from "../../utils/formatters";

export default function LiveReportScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const report = getMobileReportById(route.params?.reportId || route.params?.report?.id);
  const { snapshot, loading, error } = useMobileOpsSnapshot();
  const [generating, setGenerating] = useState(false);
  const [pdfPath, setPdfPath] = useState("");
  const [pdfError, setPdfError] = useState("");

  const onlineRate = useMemo(() => {
    if (!snapshot.endpoints.total) return 0;
    return Math.round((snapshot.endpoints.online / snapshot.endpoints.total) * 100);
  }, [snapshot.endpoints.online, snapshot.endpoints.total]);

  const geolocationRate = useMemo(() => {
    if (!snapshot.endpoints.total) return 0;
    return Math.round((snapshot.locationTotal / snapshot.endpoints.total) * 100);
  }, [snapshot.endpoints.total, snapshot.locationTotal]);

  const attention = snapshot.endpoints.offline + snapshot.endpoints.stale + snapshot.tickets.slaExceeded;

  async function handleGeneratePdf() {
    setPdfError("");
    setGenerating(true);
    try {
      const uri = await generateAndShareMobileReport(report, snapshot);
      setPdfPath(uri);
    } catch (err) {
      setPdfError(err instanceof Error ? err.message : String(err || "Failed to generate PDF."));
    } finally {
      setGenerating(false);
    }
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.backButton} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <ArrowLeft size={19} color={colors.text} strokeWidth={2.7} />
          <Text style={styles.backText}>Reports</Text>
        </TouchableOpacity>

        <View style={[styles.coverCard, { backgroundColor: report.accent }]}> 
          <View style={styles.coverTopRow}>
            <View style={styles.coverIcon}><FileText size={25} color={report.accent} strokeWidth={2.8} /></View>
            <Text style={styles.reportCode}>{report.code}</Text>
          </View>
          <Text style={styles.coverTitle}>{report.title}</Text>
          <Text style={styles.coverDesc}>{report.description}</Text>
          <View style={styles.coverPillRow}>
            <Text style={styles.coverPill}>{report.category}</Text>
            <Text style={styles.coverPill}>PDF Ready</Text>
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.kpiGrid}>
          <KpiCard label="Endpoints" value={snapshot.endpoints.total} />
          <KpiCard label="Online" value={snapshot.endpoints.online} />
          <KpiCard label="Open Tickets" value={snapshot.tickets.open} />
          <KpiCard label="Attention" value={attention} danger />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Compact Summary</Text>
          <Insight text={`Online coverage is ${onlineRate}% across ${formatNumber(snapshot.endpoints.total)} managed endpoints.`} />
          <Insight text={`Geolocation coverage is ${geolocationRate}% from ${formatNumber(snapshot.locationTotal)} detected devices.`} />
          <Insight text={`${formatNumber(snapshot.tickets.slaExceeded)} ticket(s) have exceeded SLA and require review.`} />
        </View>

        <View style={styles.breakdownCard}>
          <Text style={styles.sectionTitle}>Snapshot Breakdown</Text>
          <BreakdownRow label="Offline devices" value={snapshot.endpoints.offline} tone={colors.red} />
          <BreakdownRow label="Stale devices" value={snapshot.endpoints.stale} tone={colors.amber} />
          <BreakdownRow label="Closed tickets" value={snapshot.tickets.closed} tone={colors.green} />
          <BreakdownRow label="SLA achievement" value={`${Math.max(0, Math.min(snapshot.tickets.slaAchievement || 0, 100))}%`} tone={colors.blue} />
        </View>

        <TouchableOpacity
          style={[styles.pdfButton, { backgroundColor: report.accent }]}
          activeOpacity={0.88}
          disabled={generating || loading}
          onPress={handleGeneratePdf}
        >
          {generating ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Download size={18} color={colors.white} strokeWidth={2.8} />
          )}
          <Text style={styles.pdfButtonText}>{generating ? "Generating PDF..." : "Generate & Share PDF"}</Text>
          <Share2 size={17} color={colors.white} strokeWidth={2.8} />
        </TouchableOpacity>

        {pdfPath ? <Text style={styles.pdfPath}>PDF generated successfully.</Text> : null}
        {pdfError ? <Text style={styles.pdfError}>{pdfError}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function KpiCard({ label, value, danger }: { label: string; value: number; danger?: boolean }) {
  return (
    <View style={styles.kpiCard}>
      <Text style={[styles.kpiValue, danger && { color: colors.red }]}>{formatNumber(value)}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </View>
  );
}

function Insight({ text }: { text: string }) {
  return (
    <View style={styles.insightRow}>
      <View style={styles.insightDot} />
      <Text style={styles.insightText}>{text}</Text>
    </View>
  );
}

function BreakdownRow({ label, value, tone }: { label: string; value: number | string; tone: string }) {
  return (
    <View style={styles.breakdownRow}>
      <Text style={styles.breakdownLabel}>{label}</Text>
      <Text style={[styles.breakdownValue, { color: tone }]}>{typeof value === "number" ? formatNumber(value) : value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  page: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 110 },
  backButton: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 13, paddingVertical: 9, marginBottom: 14 },
  backText: { color: colors.text, fontSize: 12, fontWeight: "900" },
  coverCard: { borderRadius: 30, padding: 20, marginBottom: 14, overflow: "hidden" },
  coverTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  coverIcon: { width: 52, height: 52, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.92)", alignItems: "center", justifyContent: "center" },
  reportCode: { color: colors.white, fontSize: 11, fontWeight: "900", letterSpacing: 1.2 },
  coverTitle: { color: colors.white, fontSize: 26, fontWeight: "900", letterSpacing: -1, lineHeight: 31, marginTop: 20 },
  coverDesc: { color: "rgba(255,255,255,0.82)", fontSize: 12, fontWeight: "700", lineHeight: 18, marginTop: 8 },
  coverPillRow: { flexDirection: "row", gap: 8, marginTop: 18 },
  coverPill: { color: colors.white, fontSize: 10.5, fontWeight: "900", backgroundColor: "rgba(255,255,255,0.15)", borderWidth: 1, borderColor: "rgba(255,255,255,0.16)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 7, overflow: "hidden" },
  errorText: { color: colors.red, fontSize: 11, fontWeight: "800", marginBottom: 12 },
  kpiGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 14 },
  kpiCard: { width: "47.9%", backgroundColor: colors.white, borderRadius: 20, borderWidth: 1, borderColor: colors.border, padding: 14 },
  kpiValue: { color: colors.text, fontSize: 26, fontWeight: "900", letterSpacing: -0.8 },
  kpiLabel: { color: colors.textSoft, fontSize: 10.5, fontWeight: "800", marginTop: 3 },
  summaryCard: { backgroundColor: colors.white, borderRadius: 24, borderWidth: 1, borderColor: colors.border, padding: 15, marginBottom: 14 },
  breakdownCard: { backgroundColor: colors.white, borderRadius: 24, borderWidth: 1, borderColor: colors.border, padding: 15, marginBottom: 14 },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: "900", letterSpacing: -0.3, marginBottom: 11 },
  insightRow: { flexDirection: "row", alignItems: "flex-start", gap: 9, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#EDF2F8" },
  insightDot: { width: 8, height: 8, borderRadius: 8, backgroundColor: colors.blue, marginTop: 5 },
  insightText: { flex: 1, color: colors.textSoft, fontSize: 11.5, fontWeight: "700", lineHeight: 17 },
  breakdownRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#EDF2F8" },
  breakdownLabel: { color: colors.textSoft, fontSize: 12, fontWeight: "800" },
  breakdownValue: { fontSize: 13, fontWeight: "900" },
  pdfButton: { minHeight: 52, borderRadius: 18, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, marginTop: 2 },
  pdfButtonText: { color: colors.white, fontSize: 13, fontWeight: "900" },
  pdfPath: { color: colors.green, fontSize: 11, fontWeight: "800", marginTop: 10, textAlign: "center" },
  pdfError: { color: colors.red, fontSize: 11, fontWeight: "800", marginTop: 10, textAlign: "center" },
});
