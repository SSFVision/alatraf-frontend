import { Injectable } from '@angular/core';
import { TokenResponse } from '../models/token-response.model';
import { TokenStorageStrategy } from './token-storage-strategy';
import { MemoryTokenStorage } from './memory-token-storage.service';
import { LocalTokenStorage } from './local-token-storage.service';
import { HybridTokenStorage } from './hybrid-token-storage.service';

@Injectable({ providedIn: 'root' })
export class TokenStorageFacade {

  private strategy: TokenStorageStrategy;

  constructor(
    private memory: MemoryTokenStorage,
    private local: LocalTokenStorage,
    private hybrid: HybridTokenStorage
  ) {
    //  Choose ONE strategy for development or production:

    // this.strategy = this.memory;     // High security / testing
    this.strategy = this.local;      // Simple / development
    // this.strategy = this.hybrid;        // ⭐ Recommended for production
  }

  // Wrapper methods
  setTokens(tokens: TokenResponse): void {
    this.strategy.setTokens(tokens);
  }

  getAccessToken(): string | null {
    return this.strategy.getAccessToken();
  }

  getRefreshToken(): string | null {
    return this.strategy.getRefreshToken();
  }

  clear(): void {
    this.strategy.clear();
  }
}
