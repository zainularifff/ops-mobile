import { API_BASE_URL } from "../config/api";
import { getSessionToken, clearSessionToken } from "./secureStorage";

type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ApiRequestOptions = {
  method?: ApiMethod;
  body?: any;
  requireAuth?: boolean;
};

async function parseResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiRequest(
  endpoint: string,
  options: ApiRequestOptions = {}
) {
  const requireAuth = options.requireAuth ?? true;
  const token = await getSessionToken();

  if (requireAuth && !token) {
    throw new Error("Unauthorized. Please login again.");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(requireAuth && token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await parseResponse(response);

  if (response.status === 401 || response.status === 403) {
    await clearSessionToken();

    const message =
      typeof data === "object" && data?.message
        ? data.message
        : "Session expired. Please login again.";

    throw new Error(message);
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data?.message
        ? data.message
        : "API request failed.";

    throw new Error(message);
  }

  return data;
}