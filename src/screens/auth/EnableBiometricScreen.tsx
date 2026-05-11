import React, { useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";
import {
  CheckCircle2,
  Fingerprint,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
} from "lucide-react-native";
import AppButton from "../../components/AppButton";
import {
  authenticateWithBiometric,
  isBiometricAvailable,
} from "../../services/biometricService";
import { colors } from "../../theme/colors";

type Props = {
  onComplete: (biometricEnabled: boolean) => void;
};

export default function EnableBiometricScreen({ onComplete }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleEnableBiometric() {
    setLoading(true);

    const available = await isBiometricAvailable();

    if (!available) {
      setLoading(false);

      Alert.alert(
        "Biometric Not Available",
        "Fingerprint or face unlock is not available on this device. You can continue without biometric login."
      );

      onComplete(false);
      return;
    }

    const success = await authenticateWithBiometric(
      "Enable biometric login for OPS Mobile"
    );

    setLoading(false);

    if (!success) {
      Alert.alert(
        "Biometric Not Enabled",
        "Biometric verification was cancelled. You can enable it later."
      );

      onComplete(false);
      return;
    }

    onComplete(true);
  }

  function handleSkip() {
    onComplete(false);
  }

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.container}>
        <View style={styles.brandSection}>
          <View style={styles.logoBox}>
            <Fingerprint size={34} color={colors.white} strokeWidth={2.6} />
          </View>

          <Text style={styles.title}>Enable Biometric Login?</Text>
          <Text style={styles.subtitle}>
            Use fingerprint or face unlock for faster and secure access.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderIcon}>
            <ShieldCheck size={22} color={colors.green} strokeWidth={2.6} />
          </View>

          <Text style={styles.cardTitle}>Secure this device</Text>
          <Text style={styles.cardDescription}>
            Biometric login will be used to unlock OPS Mobile after a successful
            username, password and 2FA verification.
          </Text>

          <View style={styles.securityList}>
            <View style={styles.securityItem}>
              <View style={styles.securityIcon}>
                <LockKeyhole size={16} color={colors.blue} strokeWidth={2.6} />
              </View>
              <View style={styles.securityTextWrap}>
                <Text style={styles.securityTitle}>Secure session</Text>
                <Text style={styles.securityDesc}>
                  Access token stored securely on this device.
                </Text>
              </View>
            </View>

            <View style={styles.securityItem}>
              <View style={styles.securityIcon}>
                <Smartphone size={16} color={colors.cyan} strokeWidth={2.6} />
              </View>
              <View style={styles.securityTextWrap}>
                <Text style={styles.securityTitle}>Device based unlock</Text>
                <Text style={styles.securityDesc}>
                  Biometric is only used for this device.
                </Text>
              </View>
            </View>

            <View style={styles.securityItem}>
              <View style={styles.securityIcon}>
                <CheckCircle2 size={16} color={colors.green} strokeWidth={2.6} />
              </View>
              <View style={styles.securityTextWrap}>
                <Text style={styles.securityTitle}>No password stored</Text>
                <Text style={styles.securityDesc}>
                  Password is never saved locally in the app.
                </Text>
              </View>
            </View>
          </View>

          <AppButton
            title="Enable Biometric"
            onPress={handleEnableBiometric}
            loading={loading}
          />

          <AppButton
            title="Skip for Now"
            variant="secondary"
            onPress={handleSkip}
          />

          <Text style={styles.noteText}>
            You can continue without biometric login during this prototype
            stage.
          </Text>
        </View>

        <Text style={styles.footerText}>
          Biometric login is used after first successful verification.
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
    backgroundColor: "rgba(31, 157, 101, 0.28)",
  },
  glowBottom: {
    position: "absolute",
    bottom: -150,
    left: -120,
    width: 280,
    height: 280,
    borderRadius: 280,
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
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 18,
  },
  securityList: {
    backgroundColor: colors.background,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  securityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  securityIcon: {
    width: 32,
    height: 32,
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
    fontSize: 13,
    fontWeight: "900",
  },
  securityDesc: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 3,
    lineHeight: 16,
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
