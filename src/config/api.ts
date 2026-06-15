import Constants from "expo-constants";

export const API_TIMEOUT_MS = 20000;

const expoExtra =
  ((Constants.expoConfig?.extra || (Constants as any).manifest?.extra || {}) as Record<string, unknown>);

const envBaseUrl = (globalThis as any)?.process?.env?.EXPO_PUBLIC_API_BASE_URL as
  | string
  | undefined;

function normalizeConfiguredBaseUrl(value?: string) {
  const cleanValue = String(value || "").trim();

  if (!cleanValue) return "";

  const withProtocol = /^https?:\/\//i.test(cleanValue)
    ? cleanValue
    : `http://${cleanValue}`;

  return withProtocol.replace(/\/+$/, "");
}

export const API_BASE_URL = normalizeConfiguredBaseUrl(
  envBaseUrl || (expoExtra.apiBaseUrl as string | undefined)
);

export const API_CONFIG_ERROR = !API_BASE_URL
  ? "API base URL is not configured. Set expo.extra.apiBaseUrl in app.json or EXPO_PUBLIC_API_BASE_URL before building the app."
  : "";
