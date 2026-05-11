import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "ops_access_token";
const BIOMETRIC_KEY = "ops_biometric_enabled";

export async function saveSessionToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getSessionToken() {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearSessionToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function setBiometricEnabled(enabled: boolean) {
  await SecureStore.setItemAsync(BIOMETRIC_KEY, enabled ? "true" : "false");
}

export async function getBiometricEnabled() {
  const value = await SecureStore.getItemAsync(BIOMETRIC_KEY);
  return value === "true";
}

export async function clearBiometricSetting() {
  await SecureStore.deleteItemAsync(BIOMETRIC_KEY);
}

export async function clearAuthStorage() {
  await clearSessionToken();
  await clearBiometricSetting();
}