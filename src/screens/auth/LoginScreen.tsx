import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react-native";

import { API_BASE_URL } from "../../config/api";
import { loginUser } from "../../services/authService";

type Props = {
  onLoginSuccess: () => void;
};

const SHOW_API_DEBUG = true;

export default function LoginScreen({ onLoginSuccess }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    const cleanUsername = username.trim();

    if (!cleanUsername || !password) {
      const message = "Please enter username and password.";
      setLoginError(message);
      Alert.alert("Login Required", message);
      return;
    }

    try {
      setLoading(true);
      setLoginError("");

      const result = await loginUser(cleanUsername, password);

      if (!result.success) {
        const message = result.message || "Invalid username or password.";
        setLoginError(message);

        Alert.alert(
          "Login Failed",
          `${message}\n\nAPI: ${API_BASE_URL}`
        );

        return;
      }

      onLoginSuccess();
    } catch (error: any) {
      const message =
        error?.message || "Login failed. Please check your connection.";

      const debugMessage = `${message}\n\nAPI: ${API_BASE_URL}`;

      setLoginError(debugMessage);
      Alert.alert("Login Failed", debugMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandSection}>
            <View style={styles.logoBox}>
              <ShieldCheck size={34} color="#FFFFFF" strokeWidth={2.6} />
            </View>

            <Text style={styles.title}>EMA OPS Mobile</Text>
            <Text style={styles.subtitle}>
              Secure access to EMA Unified System
            </Text>
          </View>

          <View style={styles.securityStrip}>
            <LockKeyhole size={15} color="#22C55E" strokeWidth={2.8} />
            <Text style={styles.securityText}>
              Protected with secure token authentication
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign in to continue</Text>

            <Text style={styles.cardDescription}>
              Access endpoint health, asset visibility, operational status and
              management dashboard from mobile.
            </Text>

            <Text style={styles.label}>Username</Text>
            <TextInput
              value={username}
              onChangeText={(value) => {
                setUsername(value);
                if (loginError) setLoginError("");
              }}
              placeholder="Enter username"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              returnKeyType="next"
              editable={!loading}
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordInputWrap}>
              <TextInput
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  if (loginError) setLoginError("");
                }}
                placeholder="Enter password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                editable={!loading}
              />

              <TouchableOpacity
                onPress={() => setShowPassword((current) => !current)}
                style={styles.eyeButton}
                activeOpacity={0.7}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#64748B" strokeWidth={2.4} />
                ) : (
                  <Eye size={20} color="#64748B" strokeWidth={2.4} />
                )}
              </TouchableOpacity>
            </View>

            {loginError ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{loginError}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.helperText}>
              Use your EMA system account credential.
            </Text>

            {SHOW_API_DEBUG ? (
              <View style={styles.apiDebugBox}>
                <Text style={styles.apiDebugLabel}>Current API Endpoint</Text>
                <Text style={styles.apiDebugValue}>{API_BASE_URL}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>UAT Environment · v1.0.1</Text>
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
    backgroundColor: "#061225",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 34,
  },
  glowTop: {
    position: "absolute",
    top: -130,
    right: -110,
    width: 290,
    height: 290,
    borderRadius: 290,
    backgroundColor: "rgba(37, 99, 235, 0.36)",
  },
  glowBottom: {
    position: "absolute",
    bottom: -160,
    left: -130,
    width: 300,
    height: 300,
    borderRadius: 300,
    backgroundColor: "rgba(14, 165, 233, 0.2)",
  },
  brandSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoBox: {
    width: 74,
    height: 74,
    borderRadius: 24,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.6,
  },
  subtitle: {
    color: "#B6C7DD",
    marginTop: 7,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  securityStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 14,
  },
  securityText: {
    color: "#D7E3F2",
    fontSize: 11,
    fontWeight: "800",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 22,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.24,
    shadowRadius: 32,
    elevation: 10,
  },
  cardTitle: {
    color: "#0F172A",
    fontSize: 21,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  cardDescription: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 18,
  },
  label: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 8,
    marginTop: 6,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 13,
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  passwordInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 8,
    paddingVertical: 13,
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "600",
  },
  eyeButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 2,
    marginBottom: 12,
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
  helperText: {
    color: "#64748B",
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 14,
  },
  apiDebugBox: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
  },
  apiDebugLabel: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  apiDebugValue: {
    color: "#0F172A",
    fontSize: 11,
    fontWeight: "800",
  },
  footer: {
    marginTop: 22,
    alignItems: "center",
  },
  footerText: {
    color: "#B6C7DD",
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