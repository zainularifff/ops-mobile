import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

import { styles } from "./EnableBiometricScreen.styles";

type Props = {
  onComplete: (biometricEnabled: boolean) => void;
};

export default function EnableBiometricScreen({ onComplete }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleEnableBiometric() {
    try {
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
    } catch (error) {
      setLoading(false);

      Alert.alert(
        "Biometric Error",
        "Unable to enable biometric login. You can continue without biometric login."
      );

      onComplete(false);
    }
  }

  function handleSkip() {
    onComplete(false);
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.page}>
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
              Biometric login will be used to unlock OPS Mobile after a
              successful username, password and 2FA verification.
            </Text>

            <View style={styles.securityList}>
              <View style={styles.securityItem}>
                <View style={styles.securityIcon}>
                  <LockKeyhole
                    size={16}
                    color={colors.blue}
                    strokeWidth={2.6}
                  />
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
                  <Smartphone
                    size={16}
                    color={colors.cyan}
                    strokeWidth={2.6}
                  />
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
                  <CheckCircle2
                    size={16}
                    color={colors.green}
                    strokeWidth={2.6}
                  />
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
      </View>
    </SafeAreaView>
  );
}