import type { AuthUser, LoginResult, TwoFactorChallenge } from "../types/auth";
import {
  clearAuthStorage,
  clearSessionToken,
  getSessionToken,
  saveSessionToken,
} from "./secureStorage";
import { apiRequest } from "./apiClient";

export type TwoFactorStatus = {
  enabled: boolean;
  setupRequired?: boolean;
  message?: string;
};

function text(value: unknown, fallback = "") {
  const cleanValue = String(value ?? "").trim();
  return cleanValue || fallback;
}

function numberValue(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function booleanValue(value: unknown, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;

  const clean = String(value ?? "").trim().toLowerCase();
  if (["true", "1", "yes", "enabled", "enable", "active"].includes(clean)) return true;
  if (["false", "0", "no", "disabled", "disable", "inactive"].includes(clean)) return false;

  return fallback;
}

function mapAuthUser(raw: any = {}, fallbackUsername = ""): AuthUser {
  const username = text(raw.username ?? raw.userID ?? raw.UserID, fallbackUsername);

  return {
    id: text(raw.id ?? raw.emaUserID ?? raw.console_Idn ?? raw.userID ?? username, username),
    username,
    name: text(raw.name ?? raw.FullName ?? raw.fullName ?? username, username),
    email: text(raw.email ?? raw.Email, ""),
    role: text(raw.role ?? raw.roleName ?? raw.RoleName, "User"),
    department: text(raw.department ?? raw.Department, ""),
    console_Idn: raw.console_Idn,
    menuIndex: raw.menuIndex,
  };
}

function getErrorMessage(error: any) {
  if (error?.message === "Network request failed") {
    return "Cannot connect to server. Please check connection or network.";
  }

  return error?.message || "Login failed. Please try again.";
}

function readLoginData(response: any) {
  return response?.data || response || {};
}

function readToken(response: any) {
  const data = readLoginData(response);

  return text(
    data?.token ??
      response?.token ??
      data?.accessToken ??
      response?.accessToken ??
      data?.data?.token,
    ""
  );
}

function readUser(response: any, fallbackUsername = "") {
  const data = readLoginData(response);
  return mapAuthUser(data?.user ?? response?.user ?? data?.data?.user ?? {}, fallbackUsername);
}

function readTwoFactorUserId(user: AuthUser, rawUser: any = {}) {
  return numberValue(rawUser.emaUserID ?? rawUser.id ?? user.id, 0);
}

function readTwoFactorStatus(response: any): TwoFactorStatus {
  const data = response?.data || response?.user || response || {};
  const user = response?.user || response?.data?.user || data?.user || {};
  const enabled = booleanValue(
    data?.enabled ??
      data?.twoFactorEnabled ??
      data?.twoFactorActive ??
      data?.isTwoFactorEnabled ??
      data?.mfaEnabled ??
      user?.twoFactorEnabled ??
      user?.mfaEnabled,
    false
  );

  return {
    enabled,
    setupRequired: booleanValue(data?.setupRequired ?? data?.twoFactorSetupRequired, false),
    message: text(data?.message, ""),
  };
}

async function tryApiRequest<T>(endpoint: string, options: any = {}) {
  try {
    return await apiRequest<T>(endpoint, options);
  } catch (error: any) {
    const status = Number(error?.status || 0);
    if (status === 404 || status === 405) return null;
    throw error;
  }
}

async function buildTwoFactorChallenge(response: any, fallbackUsername: string) {
  const data = readLoginData(response);
  const rawUser = data?.user || response?.user || {};
  const user = mapAuthUser(rawUser, fallbackUsername);
  const userId = readTwoFactorUserId(user, rawUser);
  const setupRequired = Boolean(
    response?.twoFactorSetupRequired ??
      data?.twoFactorSetupRequired ??
      response?.setupRequired ??
      data?.setupRequired
  );

  let setupData: any = null;

  if (setupRequired && userId) {
    try {
      setupData = await apiRequest("/api/auth/2fa/setup", {
        method: "POST",
        requireAuth: false,
        body: { userID: userId },
      });
    } catch (_) {
      setupData = null;
    }
  }

  const setupPayload = setupData?.data || setupData || {};

  return {
    userId,
    setupRequired,
    user,
    secret: text(setupPayload.secret ?? setupPayload.twoFactorSecret, ""),
    qrCode: text(setupPayload.qrCode, ""),
    otpauthUrl: text(setupPayload.otpauthUrl, ""),
  } satisfies TwoFactorChallenge;
}

export async function loginUser(
  username: string,
  password: string
): Promise<LoginResult> {
  try {
    const cleanUsername = username.trim();

    await clearSessionToken();

    const response = await apiRequest("/api/auth/login", {
      method: "POST",
      requireAuth: false,
      body: { username: cleanUsername, password },
    });

    const data = readLoginData(response);
    const requiresTwoFactor = Boolean(response?.twoFactorRequired ?? data?.twoFactorRequired);

    if (requiresTwoFactor) {
      const challenge = await buildTwoFactorChallenge(response, cleanUsername);
      return { success: true, twoFactorRequired: true, challenge };
    }

    const token = readToken(response);

    if (!token) {
      return { success: false, message: "Login token was not returned." };
    }

    await saveSessionToken(token);

    return { success: true, user: readUser(response, cleanUsername) };
  } catch (error: any) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function verifyTwoFactor(
  code: string,
  challenge: TwoFactorChallenge
): Promise<LoginResult> {
  try {
    const response = await apiRequest("/api/auth/2fa/verify", {
      method: "POST",
      requireAuth: false,
      body: {
        userID: challenge.userId,
        code,
        secret: challenge.secret,
        setup: challenge.setupRequired,
      },
    });

    const token = readToken(response);

    if (!token) {
      return { success: false, message: "Login token was not returned." };
    }

    await saveSessionToken(token);

    return {
      success: true,
      user: readUser(response, challenge.user.username || challenge.user.name),
    };
  } catch (error: any) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function getCurrentUser() {
  const response = await apiRequest("/api/auth/me");
  return readUser(response);
}

export async function getTwoFactorStatus(): Promise<TwoFactorStatus> {
  const statusResponse = await tryApiRequest<any>("/api/auth/2fa/status");
  if (statusResponse) return readTwoFactorStatus(statusResponse);

  const meResponse = await tryApiRequest<any>("/api/auth/me");
  if (meResponse) return readTwoFactorStatus(meResponse);

  throw new Error("2FA status endpoint is not available on the backend.");
}

export async function updateTwoFactorStatus(enabled: boolean): Promise<TwoFactorStatus> {
  const endpointList = enabled
    ? [
        { endpoint: "/api/auth/2fa/enable", method: "POST" },
        { endpoint: "/api/auth/2fa/status", method: "PATCH" },
        { endpoint: "/api/auth/2fa/toggle", method: "POST" },
      ]
    : [
        { endpoint: "/api/auth/2fa/disable", method: "POST" },
        { endpoint: "/api/auth/2fa/status", method: "PATCH" },
        { endpoint: "/api/auth/2fa/toggle", method: "POST" },
      ];

  for (const item of endpointList) {
    const response = await tryApiRequest<any>(item.endpoint, {
      method: item.method,
      body: { enabled },
    });

    if (response) {
      const status = readTwoFactorStatus(response);
      return {
        ...status,
        enabled: status.enabled || enabled,
      };
    }
  }

  throw new Error("2FA update endpoint is not available on the backend.");
}

export async function isLoggedIn() {
  const token = await getSessionToken();
  return !!token;
}

export async function logoutUser() {
  try {
    await apiRequest("/api/auth/logout", { method: "POST" });
  } catch (_) {
    // Local sign out should still continue if the server is unreachable.
  }

  await clearSessionToken();
}

export async function forceClearAuth() {
  await clearAuthStorage();
}
