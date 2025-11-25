import { Injectable, inject } from '@angular/core';
import { tap, switchMap } from 'rxjs';

import { AuthService } from './auth.service';
import { TokenStorageFacade } from './token-storage/token-storage.facade';
import { SessionStore } from './session.store';

import { LoginRequest } from './models/login-request.model';
import { RefreshTokenRequest } from './models/refresh-token-request.model';
import { NavigationAuthFacade, AppUserRole } from '../navigation/navigation-auth.facade';

@Injectable({ providedIn: 'root' })
export class AuthFacade {

  // Inject dependencies
  private authService = inject(AuthService);
  private tokenStorage = inject(TokenStorageFacade);
  private sessionStore = inject(SessionStore);
  private navigation = inject(NavigationAuthFacade);

  // -------------------------------------------------------
  // 1. LOGIN FLOW
  // -------------------------------------------------------
  login(request: LoginRequest) {
    return this.authService.login(request).pipe(

      // Step A: store tokens
      tap((tokenResponse) => {
        this.tokenStorage.setTokens(tokenResponse);
        this.sessionStore.setTokens(tokenResponse);
      }),

      // Step B: load the user profile from /identity/current-user/claims
      switchMap(() => this.authService.getCurrentUser()),

      // Step C: attach user to session + navigate by role
      tap((user) => {
        this.sessionStore.setUser(user);

        const primaryRole = user.roles?.[0] as AppUserRole;
        this.navigation.redirectAfterLogin(primaryRole);
      })
    );
  }

  // -------------------------------------------------------
  // 2. Load Current User (on app start)
  // -------------------------------------------------------
  loadCurrentUser() {
    return this.authService.getCurrentUser().pipe(
      tap((user) => {
        this.sessionStore.setUser(user);
      })
    );
  }

  // -------------------------------------------------------
  // 3. MANUAL Refresh Token (rarely used manually)
  // -------------------------------------------------------
  refreshToken() {
    const refreshToken = this.tokenStorage.getRefreshToken();
    const expiredAccessToken = this.tokenStorage.getAccessToken();

    if (!refreshToken || !expiredAccessToken) return;

    const request: RefreshTokenRequest = {
      refreshToken,
      expiredAccessToken,
    };

    return this.authService.refreshToken(request).pipe(
      tap((newTokens) => {
        this.tokenStorage.setTokens(newTokens);
        this.sessionStore.setTokens(newTokens);
      })
    );
  }

  // -------------------------------------------------------
  // 4. LOGOUT FLOW
  // -------------------------------------------------------
  logout() {
    // Clear all state & storage
    this.tokenStorage.clear();
    this.sessionStore.clear();

    // Navigate to login page
    this.navigation.goToLogin({ replaceUrl: true });
  }

  // -------------------------------------------------------
  // 5. STATE HELPERS (used by guards, components, layouts)
  // -------------------------------------------------------
  isLoggedIn() {
    return this.sessionStore.isLoggedIn();
  }

  getUser() {
    return this.sessionStore.user();
  }

  hasRole(role: string) {
    return this.sessionStore.hasRole(role);
  }

  hasPermission(permission: string) {
    return this.sessionStore.hasPermission(permission);
  }
}
