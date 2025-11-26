export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresOnUtc: string;   // ISO string
  tokenType: string;      // "Bearer"
  userId: number;         // your added improvement
}
