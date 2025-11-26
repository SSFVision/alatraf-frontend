import { Injectable } from '@angular/core';
import { TokenResponse } from '../models/token-response.model';
import { TokenStorageStrategy } from './token-storage-strategy';

@Injectable({ providedIn: 'root' })
export class MemoryTokenStorage implements TokenStorageStrategy {

  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  setTokens(tokens: TokenResponse): void {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  clear(): void {
    this.accessToken = null;
    this.refreshToken = null;
  }
}
