import { mockAuth, mockUser } from "../data/mockAuth";
import { LoginResult } from "../types/auth";

export async function mockLogin(
  username: string,
  password: string
): Promise<LoginResult> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const isValid =
    username.trim().toLowerCase() === mockAuth.username &&
    password === mockAuth.password;

  if (!isValid) {
    return {
      success: false,
      message: "Invalid username or password.",
    };
  }

  return {
    success: true,
    user: mockUser,
  };
}

export async function mockVerifyOtp(otp: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return otp === mockAuth.otp;
}