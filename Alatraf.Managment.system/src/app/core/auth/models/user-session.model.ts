import { UserModel } from "./user.model";

export interface UserSession {
  user: UserModel | null;

  accessToken: string | null;
  refreshToken: string | null;
  expiresOnUtc: string | null;

  tokenType: string | null;  // "Bearer"

  isLoggedIn: boolean;
}
