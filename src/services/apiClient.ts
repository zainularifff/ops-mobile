import { API_BASE_URL, API_CONFIG_ERROR, API_TIMEOUT_MS } from "../config/api";
import { clearSessionToken, getSessionToken } from "./secureStorage";

type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ApiRequestOptions = {
  method?: ApiMethod;
  body?: unknown;
  headers?: Record<string, string>;
  requireAuth?: boolean;
};

export class ApiError extends Error {
  status: number;
  payload: any;

  constructor(message: string, status: number, payload?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function ensureApiConfigured(endpoint: string) {
  if (!API_CONFIG_ERROR) return;

  throw new ApiError(API_CONFIG_ERROR, 0, {
    code: "API_CONFIG_MISSING",
    endpoint,
    baseUrl: API_BASE_URL || null,
  });
}

function buildApiUrl(endpoint: string) {
  if (/^https?:\/\//i.test(endpoint)) return endpoint;

  ensureApiConfigured(endpoint);

  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${normalizedEndpoint}`;
}

async function readJsonSafely(response: Response) {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (_) {
    return { message: text };
  }
}

function buildNetworkErrorMessage(error: any) {
  if (error?.name === "AbortError") {
    return `Connection timed out. Backend is not reachable at configured URL: ${API_BASE_URL}.`;
  }

  return `Cannot connect to configured backend URL: ${API_BASE_URL}. Check backend service, network, firewall, and device access.`;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const method = options.method || "GET";
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  if (options.requireAuth !== false) {
    const token = await getSessionToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const url = buildApiUrl(endpoint);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  let response: Response;

  try {
    response = await fetch(url, {
      method,
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });
  } catch (error: any) {
    throw new ApiError(buildNetworkErrorMessage(error), 0, {
      code: error?.name === "AbortError" ? "API_TIMEOUT" : "API_CONNECTION_FAILED",
      endpoint,
      baseUrl: API_BASE_URL,
      originalError: error?.message || String(error),
    });
  } finally {
    clearTimeout(timeout);
  }

  const payload = await readJsonSafely(response);

  if (!response.ok || payload?.success === false) {
    if (response.status === 401 || response.status === 403) {
      await clearSessionToken();
    }

    const message =
      payload?.message ||
      payload?.error ||
      `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, {
      code: payload?.code || `HTTP_${response.status}`,
      endpoint,
      baseUrl: API_BASE_URL,
      payload,
    });
  }

  return payload as T;
}
