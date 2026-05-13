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
    backgroundColor: "rgba(47, 98, 216, 0.26)",
  },

  glowBottom: {
    position: "absolute",
    bottom: -150,
    left: -120,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(31, 157, 101, 0.18)",
  },

  backButton: {
    position: "absolute",
    top: 18,
    left: 24,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 5,
  },

  backText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "900",
    marginLeft: 6,
  },

  brandSection: {
    alignItems: "center",
    marginBottom: 28,
  },

  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.blue,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
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
  },

  cardHeaderIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: "#EAF1FF",
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

  codeBox: {
    backgroundColor: colors.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 14,
  },

  codeText: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 3,
  },

  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: 1,
    height: 1,
  },

  errorText: {
    color: colors.red,
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 12,
  },

  noteText: {
    color: colors.textSoft,
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 15,
    textAlign: "center",
    marginTop: 14,
  },
});