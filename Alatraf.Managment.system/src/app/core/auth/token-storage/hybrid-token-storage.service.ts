import { Injectable } from '@angular/core';
import { TokenResponse } from '../models/token-response.model';
import { TokenStorageStrategy } from './token-storage-strategy';
import { TOKEN_KEYS } from '../../constants/token-keys.constant';

@Injectable({ providedIn: 'root' })
export class HybridTokenStorage implements TokenStorageStrategy {
  private accessToken: string | null = null;
  private REFRESH_KEY = 'refreshToken';

  setTokens(tokens: TokenResponse): void {
    // Store access token in memory
    this.accessToken = tokens.accessToken;

    localStorage.setItem(TOKEN_KEYS.refresh, tokens.refreshToken);
    localStorage.setItem(TOKEN_KEYS.expiration, tokens.expiresOnUtc);
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  clear(): void {
    this.accessToken = null;
    localStorage.removeItem(this.REFRESH_KEY);
  }
}
