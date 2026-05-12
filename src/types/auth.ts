export type AuthUser = {
  id: string;
  username: string;
  name: string;
  role?: string;
  console_Idn?: number;
  menuIndex?: number;
};

export type LoginResult =
  | {
      success: true;
      user: AuthUser;
    }
  | {
      success: false;
      message: string;
    };