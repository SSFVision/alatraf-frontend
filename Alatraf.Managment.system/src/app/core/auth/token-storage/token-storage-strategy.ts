import { TokenResponse } from '../models/token-response.model';

export interface TokenStorageStrategy {
  setTokens(tokens: TokenResponse): void;
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  clear(): void;
}
