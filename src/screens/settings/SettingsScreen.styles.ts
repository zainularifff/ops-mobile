import { StyleSheet } from "react-native";
import type { ViewStyle } from "react-native";

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

  profileCard: {
    backgroundColor: colors.navy,
    borderRadius: 26,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: colors.blue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  profileTextWrap: {
    flex: 1,
  },

  profileName: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900",
  },

  profileEmail: {
    color: "#AFC0D6",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
  },

  section: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 16,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
    paddingTop: 14,
    paddingBottom: 2,
  },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  settingIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  settingTextWrap: {
    flex: 1,
    paddingRight: 8,
  },

  settingTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
  },

  settingDesc: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
    lineHeight: 15,
  },

  logoutButton: {
    backgroundColor: colors.red,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 4,
  },

  logoutText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "900",
    marginLeft: 8,
  },

  footerText: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 16,
    textAlign: "center",
    marginTop: 12,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(7, 17, 32, 0.62)",
    justifyContent: "center",
    paddingHorizontal: 28,
  },

  dialogCard: {
    backgroundColor: colors.white,
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },

  dialogCloseButton: {
    position: "absolute",
    right: 16,
    top: 16,
    width: 34,
    height: 34,
    borderRadius: 13,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },

  dialogIcon: {
    width: 58,
    height: 58,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  dialogTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginBottom: 8,
  },

  dialogMessage: {
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 20,
  },

  dialogButtonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 22,
  },

  secondaryButton: {
    flex: 1,
    borderRadius: 17,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },

  secondaryButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
  },

  primaryButton: {
    flex: 1,
    borderRadius: 17,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "900",
  },
});

export const settingIconDynamicStyle = (color: string): ViewStyle => ({
  backgroundColor: `${color}18`,
});

export const dialogIconStyle = (backgroundColor: string): ViewStyle => ({
  backgroundColor,
});

export const primaryButtonStyle = (backgroundColor: string): ViewStyle => ({
  backgroundColor,
});