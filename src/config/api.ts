import Constants from "expo-constants";

const DEFAULT_API_BASE_URL = "http://192.168.140.105:3001";

function normalizeBaseUrl(value?: string) {
  const cleanValue = String(value || "").trim();

  if (!cleanValue) return DEFAULT_API_BASE_URL;

  const withProtocol = /^https?:\/\//i.test(cleanValue)
    ? cleanValue
    : `http://${cleanValue}`;

  return withProtocol.replace(/\/+$/, "");
}

const expoExtra =
  ((Constants.expoConfig?.extra || (Constants as any).manifest?.extra || {}) as Record<string, unknown>);

const envBaseUrl = (globalThis as any)?.process?.env?.EXPO_PUBLIC_API_BASE_URL as
  | string
  | undefined;

export const API_BASE_URL = normalizeBaseUrl(
  (expoExtra.apiBaseUrl as string | undefined) || envBaseUrl || DEFAULT_API_BASE_URL
);
