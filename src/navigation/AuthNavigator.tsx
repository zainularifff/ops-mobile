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

const Stack = createNativeStackNavigator<AuthStackParamList>();

function LoginRoute() {
  const navigation = useNavigation<any>();

  return (
    <LoginScreen
      onLoginSuccess={() => navigation.navigate("TwoFactor")}
    />
  );
}

function TwoFactorRoute() {
  const navigation = useNavigation<any>();

  return (
    <TwoFactorScreen
      onVerifySuccess={() => navigation.navigate("EnableBiometric")}
      onBack={() => navigation.goBack()}
    />
  );
}

function EnableBiometricRoute() {
  const navigation = useNavigation<any>();

  return (
    <EnableBiometricScreen
      onComplete={() => navigation.navigate("BiometricUnlock")}
    />
  );
}

function BiometricUnlockRoute() {
  const navigation = useNavigation<any>();

  return (
    <BiometricUnlockScreen
      onUnlockSuccess={() => {
        navigation.getParent()?.reset({
          index: 0,
          routes: [{ name: "Main" }],
        });
      }}
      onUsePassword={() => navigation.navigate("Login")}
    />
  );
}

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginRoute} />
      <Stack.Screen name="TwoFactor" component={TwoFactorRoute} />
      <Stack.Screen name="EnableBiometric" component={EnableBiometricRoute} />
      <Stack.Screen name="BiometricUnlock" component={BiometricUnlockRoute} />
    </Stack.Navigator>
  );
}