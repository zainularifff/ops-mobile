import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  KeyRound,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
} from "lucide-react-native";
import AppButton from "../../components/AppButton";
import { mockVerifyOtp } from "../../services/authService";
import { colors } from "../../theme/colors";

type Props = {
  onVerifySuccess: () => void;
  onBack: () => void;
};

export default function TwoFactorScreen({ onVerifySuccess, onBack }: Props) {
  const [otp, setOtp] = useState("123456");
  const [loading, setLoading] = useState(false);

  async function handleVerify() {
    setLoading(true);

    const isValid = await mockVerifyOtp(otp);

    setLoading(false);

    if (!isValid) {
      Alert.alert("Invalid Code", "Please enter the correct 6-digit code.");
      return;
    }

    onVerifySuccess();
  }

  function handleResendCode() {
    Alert.alert("Verification Code Sent", "Demo OTP: 123456");
  }

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.container}>
        <View style={styles.brandSection}>
          <View style={styles.logoBox}>
            <LockKeyhole size={32} color={colors.white} strokeWidth={2.6} />
          </View>

          <Text style={styles.title}>Two-Factor Verification</Text>
          <Text style={styles.subtitle}>
            Confirm your access before opening the OPS Mobile dashboard.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderIcon}>
            <ShieldCheck size={22} color={colors.purple} strokeWidth={2.6} />
          </View>

          <Text style={styles.cardTitle}>Verify your identity</Text>
          <Text style={styles.cardDescription}>
            Enter the 6-digit verification code sent to your registered account
            or authenticator app.
          </Text>

          <View style={styles.otpLabelRow}>
            <KeyRound size={15} color={colors.text} strokeWidth={2.6} />
            <Text style={styles.label}>Verification Code</Text>
          </View>

          <TextInput
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="123456"
            placeholderTextColor={colors.muted}
            style={styles.otpInput}
          />

          <AppButton
            title="Verify Code"
            onPress={handleVerify}
            loading={loading}
          />

          <AppButton
            title="Back to Login"
            variant="secondary"
            onPress={onBack}
          />

          <View style={styles.resendRow}>
            <RotateCcw size={13} color={colors.blue} strokeWidth={2.6} />
            <Text style={styles.resendText} onPress={handleResendCode}>
              Resend verification code
            </Text>
          </View>

          <Text style={styles.demoText}>Demo OTP: 123456</Text>
        </View>

        <Text style={styles.footerText}>
          Secure verification required for authorized access.
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
    backgroundColor: "rgba(120, 87, 217, 0.32)",
  },
  glowBottom: {
    position: "absolute",
    bottom: -150,
    left: -120,
    width: 280,
    height: 280,
    borderRadius: 280,
    backgroundColor: "rgba(47, 98, 216, 0.20)",
  },
  brandSection: {
    alignItems: "center",
    marginBottom: 28,
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: colors.purple,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
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
    backgroundColor: "#F1ECFF",
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
  otpLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 6,
  },
  otpInput: {
    height: 58,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 8,
    textAlign: "center",
  },
  resendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  resendText: {
    color: colors.blue,
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 6,
  },
  demoText: {
    color: colors.muted,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 10,
  },
  footerText: {
    color: "#8FA3BC",
    fontSize: 11,
    textAlign: "center",
    marginTop: 22,
  },
});
