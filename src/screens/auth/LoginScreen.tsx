import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Fingerprint,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react-native";
import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import { mockLogin } from "../../services/authService";
import { colors } from "../../theme/colors";

type Props = {
  onLoginSuccess: () => void;
};

export default function LoginScreen({ onLoginSuccess }: Props) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);

    const result = await mockLogin(username, password);

    setLoading(false);

    if (!result.success) {
      Alert.alert("Login Failed", result.message || "Invalid login details.");
      return;
    }

    onLoginSuccess();
  }

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.brandSection}>
            <View style={styles.logoBox}>
              <ShieldCheck size={32} color={colors.white} strokeWidth={2.6} />
            </View>

            <Text style={styles.title}>EMA OPS Mobile</Text>
            <Text style={styles.subtitle}>
              Secure access to IT Operations Dashboard
            </Text>
          </View>

          <View style={styles.securityStrip}>
            <View style={styles.securityIconCircle}>
              <LockKeyhole size={14} color={colors.green} strokeWidth={2.8} />
            </View>
            <Text style={styles.securityText}>
              2FA verification required
            </Text>

            <View style={styles.securityDivider} />

            <View style={styles.securityIconCircle}>
              <Fingerprint size={14} color={colors.cyan} strokeWidth={2.8} />
            </View>
            <Text style={styles.securityText}>
              Biometric supported
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign in to continue</Text>
            <Text style={styles.cardDescription}>
              Monitor endpoint health, tickets, remote activity, software
              visibility, asset lifecycle and operational exceptions.
            </Text>

            <AppInput
              label="Username / Email"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Enter username"
            />

            <AppInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Enter password"
            />

            <AppButton
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
            />

            <Text style={styles.demoText}>
              Demo credential: admin / admin123
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>UAT Environment · v1.0.0</Text>
            <Text style={styles.footerSubText}>
              Authorized access only. Activity may be monitored.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.navy,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
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
    backgroundColor: "rgba(47, 98, 216, 0.35)",
  },
  glowBottom: {
    position: "absolute",
    bottom: -150,
    left: -120,
    width: 280,
    height: 280,
    borderRadius: 280,
    backgroundColor: "rgba(21, 136, 168, 0.22)",
  },
  brandSection: {
    alignItems: "center",
    marginBottom: 26,
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
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
  },
  subtitle: {
    color: "#AFC0D6",
    marginTop: 7,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  securityStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 14,
  },
  securityIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    marginRight: 6,
  },
  securityText: {
    color: "#D7E3F2",
    fontSize: 11,
    fontWeight: "800",
  },
  securityDivider: {
    width: 1,
    height: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    marginHorizontal: 10,
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
    marginBottom: 10,
  },
  demoText: {
    color: colors.muted,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 14,
  },
  footer: {
    marginTop: 22,
    alignItems: "center",
  },
  footerText: {
    color: "#AFC0D6",
    fontSize: 11,
    fontWeight: "800",
  },
  footerSubText: {
    color: "#7F93AD",
    fontSize: 10,
    marginTop: 5,
    textAlign: "center",
  },
});
