import { Injectable, computed, signal } from '@angular/core';
import { UserDetailsDto } from './models/user-details.dto.';
import { TokenResponse } from './models/token-response.model';
import { UserSession } from './models/user-session.model';

@Injectable({ providedIn: 'root' })
export class SessionStore {

  private userSignal = signal<UserDetailsDto | null>(null);

  private accessTokenSignal = signal<string | null>(null);
  private refreshTokenSignal = signal<string | null>(null);
  private expiresOnUtcSignal = signal<string | null>(null);
  private tokenTypeSignal = signal<string | null>('Bearer');


  readonly isLoggedIn = computed(() => {
    return this.accessTokenSignal() !== null && this.userSignal() !== null;
  });

  readonly user = computed(() => this.userSignal());

  readonly roles = computed(() => this.userSignal()?.roles ?? []);

  readonly permissions = computed(() => this.userSignal()?.permissions ?? []);

  readonly session = computed<UserSession>(() => ({
    user: this.userSignal(),
    accessToken: this.accessTokenSignal(),
    refreshToken: this.refreshTokenSignal(),
    expiresOnUtc: this.expiresOnUtcSignal(),
    tokenType: this.tokenTypeSignal(),
    isLoggedIn: this.isLoggedIn(),
  }));

  // -------------------------------------------------------
  // 3. Setters — used by AuthFacade when login succeeds
  // -------------------------------------------------------

  setUser(user: UserDetailsDto): void {
    this.userSignal.set(user);
    // console.log("Userr Info From SessionStore ",this.userSignal());
  }

  setTokens(tokens: TokenResponse): void {
    this.accessTokenSignal.set(tokens.accessToken);
    this.refreshTokenSignal.set(tokens.refreshToken);
    this.expiresOnUtcSignal.set(tokens.expiresOnUtc);
    this.tokenTypeSignal.set('Bearer');
  }

  // -------------------------------------------------------
  // 4. Clear session (logout)
  // -------------------------------------------------------

  clear(): void {
    this.userSignal.set(null);
    this.accessTokenSignal.set(null);
    this.refreshTokenSignal.set(null);
    this.expiresOnUtcSignal.set(null);
    this.tokenTypeSignal.set('Bearer');
  }

  // -------------------------------------------------------
  // 5. Helpers for guards & UI
  // -------------------------------------------------------

  hasRole(role: string): boolean {
    return this.roles().includes(role);
  }

  hasPermission(permission: string): boolean {
    return this.permissions().includes(permission);
  }

  /** Returns current access token */
  getAccessToken(): string | null {
    return this.accessTokenSignal();
  }

  /** Returns current refresh token */
  getRefreshToken(): string | null {
    return this.refreshTokenSignal();
  }

  /** Returns expiration date */
  getExpiresOn(): string | null {
    return this.expiresOnUtcSignal();
  }
}
