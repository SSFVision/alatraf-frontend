import { Injectable } from '@angular/core';
import { TokenResponse } from '../models/token-response.model';
import { TokenStorageStrategy } from './token-storage-strategy';

@Injectable({ providedIn: 'root' })
export class LocalTokenStorage implements TokenStorageStrategy {

  private ACCESS_KEY = 'accessToken';
  private REFRESH_KEY = 'refreshToken';

  setTokens(tokens: TokenResponse): void {
    localStorage.setItem(this.ACCESS_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_KEY, tokens.refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  clear(): void {
    localStorage.removeItem(this.ACCESS_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
  }
}
