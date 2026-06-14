import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Fingerprint,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react-native";
import AppButton from "../../components/AppButton";
import {
  authenticateWithBiometric,
  isBiometricAvailable,
} from "../../services/biometricService";
import { colors } from "../../theme/colors";

type Props = {
  onUnlockSuccess: () => void;
  onUsePassword: () => void;
};

export default function BiometricUnlockScreen({
  onUnlockSuccess,
  onUsePassword,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleUnlock() {
    setLoading(true);

    const available = await isBiometricAvailable();

    if (!available) {
      setLoading(false);

      Alert.alert(
        "Biometric Not Available",
        "Biometric authentication is not available or not enrolled on this device. Please login using password."
      );

      onUsePassword();
      return;
    }

    const success = await authenticateWithBiometric("Unlock OPS Mobile");

    setLoading(false);

    if (!success) {
      Alert.alert(
        "Unlock Failed",
        "Biometric verification was cancelled or failed."
      );
      return;
    }

    onUnlockSuccess();
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.page}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.container}>
        <View style={styles.brandSection}>
          <View style={styles.logoBox}>
            <Fingerprint size={36} color={colors.white} strokeWidth={2.6} />
          </View>

          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Unlock OPS Mobile using biometric verification.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.profileCircle}>
            <UserRound size={28} color={colors.blue} strokeWidth={2.6} />
          </View>

          <Text style={styles.cardTitle}>Secure unlock required</Text>
          <Text style={styles.cardDescription}>
            Your session is available on this device. Please verify your identity
            before accessing the dashboard.
          </Text>

          <View style={styles.securityPanel}>
            <View style={styles.securityRow}>
              <LockKeyhole size={16} color={colors.blue} strokeWidth={2.6} />
              <Text style={styles.securityText}>Session protected</Text>
            </View>

            <View style={styles.securityRow}>
              <ShieldCheck size={16} color={colors.green} strokeWidth={2.6} />
              <Text style={styles.securityText}>Authorized access only</Text>
            </View>
          </View>

          <AppButton
            title="Unlock with Biometric"
            onPress={handleUnlock}
            loading={loading}
          />

          <AppButton
            title="Use Password Instead"
            variant="secondary"
            onPress={onUsePassword}
          />

          <Text style={styles.noteText}>
            Password fallback will clear the saved session and return to normal
            login.
          </Text>
        </View>

        <Text style={styles.footerText}>
          Activity may be monitored for security and audit purposes.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.navy,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  glowTop: {
    position: "absolute",
    top: -120,
    right: -100,
    width: 280,
    height: 280,
    borderRadius: 280,
    backgroundColor: "rgba(47, 98, 216, 0.34)",
  },
  glowBottom: {
    position: "absolute",
    bottom: -150,
    left: -120,
    width: 280,
    height: 280,
    borderRadius: 280,
    backgroundColor: "rgba(31, 157, 101, 0.20)",
  },
  brandSection: {
    alignItems: "center",
    marginBottom: 28,
  },
  logoBox: {
    width: 76,
    height: 76,
    borderRadius: 26,
    backgroundColor: colors.blue,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.36,
    shadowRadius: 24,
    elevation: 8,
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.6,
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
  profileCircle: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: "#EAF1FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  cardDescription: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 18,
  },
  securityPanel: {
    backgroundColor: colors.background,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  securityText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
    marginLeft: 8,
  },
  noteText: {
    color: colors.muted,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 14,
    lineHeight: 16,
  },
  footerText: {
    color: "#8FA3BC",
    fontSize: 11,
    textAlign: "center",
    marginTop: 22,
  },
});
