import { LoginResult } from "../types/auth";
import { apiRequest } from "./apiClient";
import {
  saveSessionToken,
  getSessionToken,
  clearSessionToken,
  clearAuthStorage,
} from "./secureStorage";

type LoginApiResponse = {
  success?: boolean;
  accessToken?: string;
  expiresIn?: string;
  message?: string;
  error?: string;
  user?: {
    console_Idn?: number;
    userID?: string;
    menuIndex?: number;
  };
};

function getErrorMessage(error: any) {
  if (error?.message === "Network request failed") {
    return "Cannot connect to server. Please check API connection or network.";
  }

  return error?.message || "Login failed. Please try again.";
}

export async function loginUser(
  username: string,
  password: string
): Promise<LoginResult> {
  try {
    const cleanUsername = username.trim();

    await clearSessionToken();

    const data: LoginApiResponse = await apiRequest("/api/login", {
      method: "POST",
      requireAuth: false,
      body: {
        username: cleanUsername,
        password,
      },
    });

    if (!data.success) {
      return {
        success: false,
        message: data.message || data.error || "Invalid username or password.",
      };
    }

    if (!data.accessToken) {
      return {
        success: false,
        message: "Login success but access token was not returned.",
      };
    }

    await saveSessionToken(data.accessToken);

    return {
      success: true,
      user: {
        id: String(data.user?.console_Idn ?? ""),
        username: data.user?.userID ?? cleanUsername,
        name: data.user?.userID ?? cleanUsername,
        role: "User",
        console_Idn: data.user?.console_Idn,
        menuIndex: data.user?.menuIndex,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}

export async function isLoggedIn() {
  const token = await getSessionToken();
  return !!token;
}

export async function logoutUser() {
  await clearSessionToken();
}

export async function forceClearAuth() {
  await clearAuthStorage();
}