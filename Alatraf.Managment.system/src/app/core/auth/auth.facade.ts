import { UserDetailsDto } from './models/user-details.dto.';
import { Injectable, inject } from '@angular/core';
import { tap, switchMap, catchError, EMPTY, of } from 'rxjs';

import { AuthService } from './auth.service';
import { TokenStorageFacade } from './token-storage/token-storage.facade';
import { SessionStore } from './session.store';
import { CacheService } from '../services/cache.service';
import { ALL_CACHE_KEYS } from '../constants/cache-keys.constants';

import { LoginRequest } from './models/login-request.model';
import { RefreshTokenRequest } from './models/refresh-token-request.model';
import { NavigationAuthFacade } from '../navigation/navigation-auth.facade';
import { AppUserRole } from './Roles/app.user.roles.enum';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  // Inject dependencies
  private authService = inject(AuthService);
  private tokenStorage = inject(TokenStorageFacade);
  private sessionStore = inject(SessionStore);
  private navigation = inject(NavigationAuthFacade);
  private cache = inject(CacheService);

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

      switchMap(() => this.authService.getCurrentUser()),

      tap((user) => {
        console.log('info After Sucess Login ', user);
        this.sessionStore.setUser(user);
        const primaryRole = user.roles?.[0].toString();
        this.navigation.redirectAfterLogin(primaryRole as AppUserRole);
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

    // Clear application caches (but keep token storage logic separate)
    try {
      this.cache.clearKeys(ALL_CACHE_KEYS);
    } catch (err) {
      console.error('Failed to clear cache keys on logout', err);
    }

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

  // hasPermission(permission: string) {
  //   return this.sessionStore.hasPermission(permission);
  // }
  hasPermission(permission: string) {
    const user = this.sessionStore.user();
    if (!user) return false;

    // 🔥 SUPER ROLES: Admin + Manager have full access
    if (
      user.roles?.includes(AppUserRole.Admin) 
    ) {
      return true;
    }

    return this.sessionStore.hasPermission(permission);
  }


  autoLogin() {
  const refreshToken = this.tokenStorage.getRefreshToken();

  if (!refreshToken) {
  return of(null);
  }

  const request: RefreshTokenRequest = {
    refreshToken,
    expiredAccessToken: this.tokenStorage.getAccessToken() ?? '',
  };

  return this.authService.refreshToken(request).pipe(
    tap((tokens) => {
      this.tokenStorage.setTokens(tokens);
      this.sessionStore.setTokens(tokens);
    }),
    switchMap(() => this.authService.getCurrentUser()),
    tap((user) => {
      this.sessionStore.setUser(user);
    }),
    catchError(() => {
      this.logout();
      return EMPTY;
    })
  );
}

}
