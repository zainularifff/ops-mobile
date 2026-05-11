export type UserRole =
  | "IT_MANAGER"
  | "IT_SUPPORT"
  | "SECURITY_REVIEWER"
  | "ASSET_TEAM";

export type AuthUser = {
  id: string;
  name: string;
  username: string;
  role: UserRole;
};

export type LoginResult = {
  success: boolean;
  user?: AuthUser;
  message?: string;
};