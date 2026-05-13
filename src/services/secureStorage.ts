import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "ops_access_token";
const BIOMETRIC_KEY = "ops_biometric_enabled";

function webSetItem(key: string, value: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, value);
  }
}

function webGetItem(key: string) {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem(key);
  }

  return null;
}

function webDeleteItem(key: string) {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(key);
  }
}

export async function saveSessionToken(token: string) {
  if (Platform.OS === "web") {
    webSetItem(TOKEN_KEY, token);
    return;
  }

  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getSessionToken() {
  if (Platform.OS === "web") {
    return webGetItem(TOKEN_KEY);
  }

  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearSessionToken() {
  if (Platform.OS === "web") {
    webDeleteItem(TOKEN_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function setBiometricEnabled(enabled: boolean) {
  if (Platform.OS === "web") {
    webSetItem(BIOMETRIC_KEY, enabled ? "true" : "false");
    return;
  }

  await SecureStore.setItemAsync(BIOMETRIC_KEY, enabled ? "true" : "false");
}

export async function getBiometricEnabled() {
  let value: string | null = null;

  if (Platform.OS === "web") {
    value = webGetItem(BIOMETRIC_KEY);
  } else {
    value = await SecureStore.getItemAsync(BIOMETRIC_KEY);
  }

  return value === "true";
}

export async function clearBiometricSetting() {
  if (Platform.OS === "web") {
    webDeleteItem(BIOMETRIC_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(BIOMETRIC_KEY);
}

export async function clearAuthStorage() {
  await clearSessionToken();
  await clearBiometricSetting();
}