import Constants from "expo-constants";
import { Platform } from "react-native";

const API_PORT = "3001";
const FALLBACK_LAN_HOST = "192.168.0.172";

function normalizeBaseUrl(value?: string) {
  const cleanValue = String(value || "").trim();

  if (!cleanValue) return buildDefaultApiBaseUrl();

  const withProtocol = /^https?:\/\//i.test(cleanValue)
    ? cleanValue
    : `http://${cleanValue}`;

  return withProtocol.replace(/\/+$/, "");
}

function cleanHost(value?: unknown) {
  const cleanValue = String(value || "").trim();
  if (!cleanValue) return "";

  const withoutProtocol = cleanValue.replace(/^https?:\/\//i, "");
  const host = withoutProtocol.split(":")[0].replace(/\/+$/, "");

  if (!host || host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0") {
    return "";
  }

  return host;
}

function getExpoDevHost() {
  const expoConfig = Constants.expoConfig as any;
  const manifest = (Constants as any).manifest || {};
  const manifest2 = (Constants as any).manifest2 || {};

  const hostCandidates = [
    expoConfig?.hostUri,
    expoConfig?.debuggerHost,
    manifest?.hostUri,
    manifest?.debuggerHost,
    manifest2?.extra?.expoGo?.debuggerHost,
  ];

  for (const candidate of hostCandidates) {
    const host = cleanHost(candidate);
    if (host) return host;
  }

  return "";
}

function buildDefaultApiBaseUrl() {
  const expoDevHost = getExpoDevHost();

  if (expoDevHost) {
    return `http://${expoDevHost}:${API_PORT}`;
  }

  if (Platform.OS === "android") {
    return `http://10.0.2.2:${API_PORT}`;
  }

  return `http://${FALLBACK_LAN_HOST}:${API_PORT}`;
}

const expoExtra =
  ((Constants.expoConfig?.extra || (Constants as any).manifest?.extra || {}) as Record<string, unknown>);

const envBaseUrl = (globalThis as any)?.process?.env?.EXPO_PUBLIC_API_BASE_URL as
  | string
  | undefined;

export const API_BASE_URL = normalizeBaseUrl(
  envBaseUrl || (expoExtra.apiBaseUrl as string | undefined) || buildDefaultApiBaseUrl()
);

export const API_TIMEOUT_MS = 20000;
