export interface TokenResponse {
  accessToken?: string;
  refreshToken?: string;
  /** ISO string in UTC */
  expiresOnUtc: string;
}
