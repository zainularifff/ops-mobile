import React, { useState } from "react";
import {
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

import { getAppVersion, getAppBuildNumber } from "../../utils/appInfo";
import { styles } from "./LoginScreen.styles";

type Props = {
  onLoginSuccess: () => void;
};

export default function LoginScreen({ onLoginSuccess }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const appVersion = getAppVersion();
  const buildNumber = getAppBuildNumber();
  const appVersionLabel = buildNumber
    ? `v${appVersion} (${buildNumber})`
    : `v${appVersion}`;

  function handleLogin() {
    const cleanUsername = username.trim();

    if (!username || !password) {
      const message = "Please enter username and password.";
      setLoginError(message);
      Alert.alert("Login Required", message);
      return;
    }

    setLoginError("");
    onLoginSuccess();
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
                <Text style={styles.securityChipText}>Secure Access</Text>
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
              />

              <TouchableOpacity
                onPress={() => setShowPassword((current) => !current)}
                style={styles.eyeButton}
                activeOpacity={0.7}
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
              style={styles.button}
              onPress={handleLogin}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.infoStrip}>
              <ShieldCheck size={14} color="#2563EB" strokeWidth={2.7} />
              <Text style={styles.infoStripText}>
                Protected access for authorized users only
              </Text>
            </View>
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