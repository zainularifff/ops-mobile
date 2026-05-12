import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import LoginScreen from "../screens/auth/LoginScreen";
import TwoFactorScreen from "../screens/auth/TwoFactorScreen";
import EnableBiometricScreen from "../screens/auth/EnableBiometricScreen";
import BiometricUnlockScreen from "../screens/auth/BiometricUnlockScreen";

export type AuthStackParamList = {
  Login: undefined;
  TwoFactor: undefined;
  EnableBiometric: undefined;
  BiometricUnlock: undefined;
};

type AuthNavigatorProps = {
  onAuthComplete: () => void;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

function LoginRoute() {
  const navigation = useNavigation<any>();

  return (
    <LoginScreen
      onLoginSuccess={() => {
        /**
         * Backend belum ada OTP endpoint.
         * Jadi skip TwoFactor dulu.
         */
        navigation.replace("EnableBiometric");
      }}
    />
  );
}

function TwoFactorRoute() {
  const navigation = useNavigation<any>();

  return (
    <TwoFactorScreen
      onVerifySuccess={() => {
        navigation.replace("EnableBiometric");
      }}
      onBack={() => {
        navigation.goBack();
      }}
    />
  );
}

function EnableBiometricRoute({
  onAuthComplete,
}: {
  onAuthComplete: () => void;
}) {
  return (
    <EnableBiometricScreen
      onComplete={() => {
        onAuthComplete();
      }}
    />
  );
}

function BiometricUnlockRoute({
  onAuthComplete,
}: {
  onAuthComplete: () => void;
}) {
  const navigation = useNavigation<any>();

  return (
    <BiometricUnlockScreen
      onUnlockSuccess={() => {
        onAuthComplete();
      }}
      onUsePassword={() => {
        navigation.replace("Login");
      }}
    />
  );
}

export default function AuthNavigator({ onAuthComplete }: AuthNavigatorProps) {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginRoute} />

      <Stack.Screen name="TwoFactor" component={TwoFactorRoute} />

      <Stack.Screen name="EnableBiometric">
        {() => <EnableBiometricRoute onAuthComplete={onAuthComplete} />}
      </Stack.Screen>

      <Stack.Screen name="BiometricUnlock">
        {() => <BiometricUnlockRoute onAuthComplete={onAuthComplete} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}