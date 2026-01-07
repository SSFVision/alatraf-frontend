export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresOnUtc: string; // ISO string
}
