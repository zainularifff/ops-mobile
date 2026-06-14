import type { AuthUser, LoginResult, TwoFactorChallenge } from "../types/auth";
import {
  clearAuthStorage,
  clearSessionToken,
  getSessionToken,
  saveSessionToken,
} from "../utils/secureStorage";
import { apiRequest } from "./apiClient";

function text(value: unknown, fallback = "") {
  const cleanValue = String(value ?? "").trim();
  return cleanValue || fallback;
}

function numberValue(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
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
