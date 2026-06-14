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

const expo