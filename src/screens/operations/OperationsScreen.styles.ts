import { StyleSheet } from "react-native";
import type { TextStyle, ViewStyle } from "react-native";

import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  page: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    paddingTop: 14,
    paddingHorizontal: 18,
    paddingBottom: 110,
  },

  header: {
    marginBottom: 16,
  },

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

  heroLabel: {
    color: "#8FA3BC",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  heroTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 7,
  },

  heroDesc: {
    color: "#AFC0D6",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
    marginTop: 7,
  },

  heroMetricRow: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.12)",
    flexDirection: "row",
    alignItems: "center",
  },

  heroMetric: {
    flex: 1,
  },

  heroValue: {
    color: colors.white,
    fontSize: 24,
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

  moduleList: {
    gap: 12,
  },

  moduleCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  moduleIcon: {
    width: 48,
    height: 48,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  moduleTextWrap: {
    flex: 1,
  },

  moduleTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
  },

  moduleDesc: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 16,
    marginTop: 3,
  },

  moduleMetricRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  moduleMetric: {
    fontSize: 13,
    fontWeight: "900",
    marginRight: 6,
  },

  moduleLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "800",
  },
});

export const moduleIconStyle = (color: string): ViewStyle => ({
  backgroundColor: `${color}18`,
});

export const moduleMetricStyle = (color: string): TextStyle => ({
  color,
});