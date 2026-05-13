import { StyleSheet } from "react-native";

import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.navy,
  },

  page: {
    flex: 1,
    backgroundColor: colors.navy,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },

  glowTop: {
    position: "absolute",
    top: -120,
    right: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(31, 157, 101, 0.28)",
  },

  glowBottom: {
    position: "absolute",
    bottom: -150,
    left: -120,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(47, 98, 216, 0.22)",
  },

  brandSection: {
    alignItems: "center",
    marginBottom: 28,
  },

  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.34,
    shadowRadius: 24,
    elevation: 8,
  },

  title: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.5,
    textAlign: "center",
  },

  subtitle: {
    color: "#AFC0D6",
    marginTop: 7,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 19,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 26,
    padding: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.24,
    shadowRadius: 32,
    elevation: 10,
  },

  cardHeaderIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: "#EBF8F1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  cardTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: "900",
    letterSpacing: -0.4,
  },

  cardDescription: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 8,
  },

  securityList: {
    backgroundColor: colors.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 12,
    marginTop: 18,
    marginBottom: 16,
  },

  securityItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  securityIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  securityTextWrap: {
    flex: 1,
  },

  securityTitle: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "900",
  },

  securityDesc: {
    color: colors.textSoft,
    fontSize: 10,
    fontWeight: "700",
    marginTop: 2,
    lineHeight: 14,
  },

  noteText: {
    color: colors.textSoft,
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 15,
    textAlign: "center",
    marginTop: 14,
  },

  footerText: {
    color: "#8FA3BC",
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 18,
  },
});