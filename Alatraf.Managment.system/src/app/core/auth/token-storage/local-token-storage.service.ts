import { Injectable } from '@angular/core';
import { TokenResponse } from '../models/token-response.model';
import { TokenStorageStrategy } from './token-storage-strategy';
import { TOKEN_KEYS } from '../../constants/token-keys.constant';

@Injectable({ providedIn: 'root' })
export class LocalTokenStorage implements TokenStorageStrategy {

  setTokens(tokens: TokenResponse): void {
    localStorage.setItem(TOKEN_KEYS.access, tokens.accessToken);
    localStorage.setItem(TOKEN_KEYS.refresh, tokens.refreshToken);
    localStorage.setItem(TOKEN_KEYS.expiration, tokens.expiresOnUtc);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEYS.access);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(TOKEN_KEYS.refresh);
  }

  clear(): void {
    localStorage.removeItem(TOKEN_KEYS.access);
    localStorage.removeItem(TOKEN_KEYS.refresh);
    localStorage.removeItem(TOKEN_KEYS.expiration);
  }
}
