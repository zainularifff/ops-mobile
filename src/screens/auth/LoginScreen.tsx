import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Eye,
  EyeOff,
  Fingerprint,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react-native";

import { API_BASE_URL } from "../../config/api";
import { loginUser } from "../../services/authService";
import { getAppVersion, getAppBuildNumber } from "../../utils/appInfo";
import { styles } from "./LoginScreen.styles";

type Props = {
  onLoginSuccess: () => void;
};

const SHOW_API_DEBUG = false;

export default function LoginScreen({ onLoginSuccess }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const appVersion = getAppVersion();
  const buildNumber = getAppBuildNumber();
  const appVersionLabel = buildNumber
    ? `v${appVersion} (${buildNumber})`
    : `v${appVersion}`;

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
        Alert.alert("Login Failed", `${message}\n\nAPI: ${API_BASE_URL}`);
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
          <View style={styles.heroSection}>
            <View style={styles.heroGlowOne} />
            <View style={styles.heroGlowTwo} />

            <View style={styles.logoBox}>
              <ShieldCheck size={34} color="#FFFFFF" strokeWidth={2.7} />
            </View>

            <Text style={styles.appName}>EMA OPS Mobile</Text>

            <Text style={styles.heroTitle}>Secure Operation Access</Text>

            <Text style={styles.heroSubtitle}>
              Monitor endpoint health, operational status and management
              dashboard summaries from mobile.
            </Text>

            <View style={styles.securityRow}>
              <View style={styles.securityChip}>
                <LockKeyhole size={13} color="#A7F3D0" strokeWidth={2.7} />
                <Text style={styles.securityChipText}>Secure Token</Text>
              </View>

              <View style={styles.securityChip}>
                <Fingerprint size={13} color="#BAE6FD" strokeWidth={2.7} />
                <Text style={styles.securityChipText}>Biometric Ready</Text>
              </View>
            </View>
          </View>

          <View style={styles.loginSheet}>
            <View style={styles.sheetHandle} />

            <Text style={styles.cardTitle}>Sign in to continue</Text>

            <Text style={styles.cardDescription}>
              Use your EMA system account credential to access the mobile
              workspace.
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

            <View style={styles.infoStrip}>
              <ShieldCheck size={14} color="#2563EB" strokeWidth={2.7} />
              <Text style={styles.infoStripText}>
                Protected access for authorized users only
              </Text>
            </View>

            {SHOW_API_DEBUG ? (
              <View style={styles.apiDebugBox}>
                <Text style={styles.apiDebugLabel}>Current API Endpoint</Text>
                <Text style={styles.apiDebugValue}>{API_BASE_URL}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              UAT Environment · {appVersionLabel}
            </Text>
            <Text style={styles.footerSubText}>
              Activity may be monitored for security and audit purposes.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}