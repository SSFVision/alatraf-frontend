import { Injectable, computed, signal } from '@angular/core';
import { UserModel } from './models/user.model';
import { TokenResponse } from './models/token-response.model';
import { UserSession } from './models/user-session.model';

@Injectable({ providedIn: 'root' })
export class SessionStore {

  // -------------------------------------------------------
  // 1. Signals (state)
  // -------------------------------------------------------

  private userSignal = signal<UserModel | null>(null);

  private accessTokenSignal = signal<string | null>(null);
  private refreshTokenSignal = signal<string | null>(null);
  private expiresOnUtcSignal = signal<string | null>(null);
  private tokenTypeSignal = signal<string | null>('Bearer');

  // -------------------------------------------------------
  // 2. Derived signals (computed)
  // -------------------------------------------------------

  /** True if the user is logged in */
  readonly isLoggedIn = computed(() => {
    return this.accessTokenSignal() !== null && this.userSignal() !== null;
  });

  /** Current user model */
  readonly user = computed(() => this.userSignal());

  /** User roles */
  readonly roles = computed(() => this.userSignal()?.roles ?? []);

  /** User permissions */
  readonly permissions = computed(() => this.userSignal()?.permissions ?? []);

  /** Reference: full session snapshot */
  readonly session = computed<UserSession>(() => ({
    user: this.userSignal(),
    accessToken: this.accessTokenSignal(),
    refreshToken: this.refreshTokenSignal(),
    expiresOnUtc: this.expiresOnUtcSignal(),
    tokenType: this.tokenTypeSignal(),
    isLoggedIn: this.isLoggedIn()
  }));

  // -------------------------------------------------------
  // 3. Setters — used by AuthFacade when login succeeds
  // -------------------------------------------------------

  setUser(user: UserModel): void {

    this.userSignal.set(user);
    console.log("Userr Info From SessionStore ",this.userSignal());
  }

  setTokens(tokens: TokenResponse): void {
    this.accessTokenSignal.set(tokens.accessToken);
    this.refreshTokenSignal.set(tokens.refreshToken);
    this.expiresOnUtcSignal.set(tokens.expiresOnUtc);
    this.tokenTypeSignal.set(tokens.tokenType ?? 'Bearer');
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
