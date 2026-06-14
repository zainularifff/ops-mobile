import { API_BASE_URL, API_TIMEOUT_MS } from "../config/api";
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

function buildApiUrl(endpoint: string) {
  if (/^https?:\/\//i.test(endpoint)) return endpoint;

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
    return `Connection timed out. Please ensure the backend is running and reachable at ${API_BASE_URL}.`;
  }

  return `Cannot connect to server at ${API_BASE_URL}. Please check backend service, network, firewall, and Android emulator/device access.`;
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

    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}
