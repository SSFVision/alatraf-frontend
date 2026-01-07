import { UserDetailsDto } from './user-details.dto.';

export interface UserSession {
  user: UserDetailsDto | null;

  accessToken: string | null;
  refreshToken: string | null;
  expiresOnUtc: string | null;

  tokenType: string | null; // "Bearer"

  isLoggedIn: boolean;
}
