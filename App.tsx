import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import LoginScreen from "./src/screens/auth/LoginScreen";
import TwoFactorScreen from "./src/screens/auth/TwoFactorScreen";
import EnableBiometricScreen from "./src/screens/auth/EnableBiometricScreen";
import BiometricUnlockScreen from "./src/screens/auth/BiometricUnlockScreen";
import MainTabs from "./src/navigation/MainTabs";

import {
  clearAuthStorage,
  getBiometricEnabled,
  getSessionToken,
  setBiometricEnabled,
} from "./src/services/secureStorage";

import { colors } from "./src/theme/colors";

type AppStep =
  | "loading"
  | "login"
  | "twoFactor"
  | "enableBiometric"
  | "biometricUnlock"
  | "dashboard";

export default function App() {
  const [step, setStep] = useState<AppStep>("loading");

  useEffect(() => {
    let isMounted = true;

    const fallbackTimer = setTimeout(() => {
      if (isMounted) {
        setStep((currentStep) =>
          currentStep === "loading" ? "login" : currentStep
        );
      }
    }, 1500);

    async function initialiseApp() {
      try {
        const token = await getSessionToken();
        const biometricEnabled = await getBiometricEnabled();

        if (!isMounted) return;

        clearTimeout(fallbackTimer);

        if (token && biometricEnabled) {
          setStep("biometricUnlock");
          return;
        }

        if (token) {
          setStep("dashboard");
          return;
        }

        setStep("login");
      } catch (error) {
        if (!isMounted) return;

        clearTimeout(fallbackTimer);
        setStep("login");
      }
    }

    initialiseApp();

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
    };
  }, []);

  async function completeLogin(biometricEnabled: boolean) {
    try {
      /**
       * Token sebenar sudah disimpan dalam loginUser()
       * selepas POST /api/login berjaya.
       *
       * Jadi dekat sini kita hanya simpan biometric setting.
       */
      await setBiometricEnabled(biometricEnabled);
      setStep("dashboard");
    } catch (error) {
      setStep("dashboard");
    }
  }

  async function handleUsePasswordInstead() {
    try {
      await clearAuthStorage();
    } catch (error) {
      // Ignore storage error
    }

    setStep("login");
  }

  async function handleLogout() {
    try {
      await clearAuthStorage();
    } catch (error) {
      // Ignore storage error
    }

    setStep("login");
  }

  function renderScreen() {
    if (step === "loading") {
      return (
        <SafeAreaView style={styles.loadingPage}>
          <ActivityIndicator size="large" color={colors.blue} />
          <Text style={styles.loadingText}>Loading OPS Mobile...</Text>
        </SafeAreaView>
      );
    }

    if (step === "login") {
      return (
        <LoginScreen
          onLoginSuccess={() => {
            /**
             * Backend belum ada OTP endpoint.
             * Jadi selepas login berjaya, terus pergi enable biometric.
             *
             * Kalau nanti backend dah ada OTP,
             * tukar line ni kepada: setStep("twoFactor")
             */
            setStep("enableBiometric");
          }}
        />
      );
    }

    if (step === "twoFactor") {
      return (
        <TwoFactorScreen
          onVerifySuccess={() => setStep("enableBiometric")}
          onBack={() => setStep("login")}
        />
      );
    }

    if (step === "enableBiometric") {
      return <EnableBiometricScreen onComplete={completeLogin} />;
    }

    if (step === "biometricUnlock") {
      return (
        <BiometricUnlockScreen
          onUnlockSuccess={() => setStep("dashboard")}
          onUsePassword={handleUsePasswordInstead}
        />
      );
    }

    return (
      <NavigationContainer>
        <MainTabs onLogout={handleLogout} />
      </NavigationContainer>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={step === "dashboard" ? "dark-content" : "light-content"}
        backgroundColor={step === "dashboard" ? colors.background : colors.navy}
      />

      {renderScreen()}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingPage: {
    flex: 1,
    backgroundColor: colors.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: colors.white,
    marginTop: 12,
    fontSize: 14,
    fontWeight: "700",
  },
});