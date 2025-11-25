import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';

import { inject } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { SessionStore } from '../auth/session.store';
import { TokenStorageFacade } from '../auth/token-storage/token-storage.facade';
import { RefreshTokenRequest } from '../models/auth/auth.models';
import { NavigationAuthFacade } from '../navigation/navigation-auth.facade';

function isAuthEndpoint(url: string): boolean {
  return (
    url.includes('/identity/token/generate') ||
    url.includes('/identity/token/refresh-token') ||
    url.includes('/identity/current-user/claims')
  );
}

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {

  const tokenStorage = inject(TokenStorageFacade);
  const authService = inject(AuthService);
  const sessionStore = inject(SessionStore);
  const navigation = inject(NavigationAuthFacade);

  if (isAuthEndpoint(req.url)) {
    return next(req);
  }

  // -------------------------------------------------------------
  // 2. Add Authorization header if access token exists
  // -------------------------------------------------------------
  const accessToken = tokenStorage.getAccessToken();

  let authReq = req;
  if (accessToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `${sessionStore.session().tokenType ?? 'Bearer'} ${accessToken}`
      }
    });
  }

  // -------------------------------------------------------------
  // 3. Handle request
  // -------------------------------------------------------------
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      // -----------------------------------------------------------
      // 4. If unauthorized and we have refresh token — try to refresh
      // -----------------------------------------------------------
      if (error.status === 401) {
        const refreshToken = tokenStorage.getRefreshToken();
        const expiredToken = accessToken;

        if (!refreshToken || !expiredToken) {
          sessionStore.clear();
          tokenStorage.clear();
          navigation.goToLogout(); 

          return throwError(() => error);
        }

        const requestBody: RefreshTokenRequest = {
          refreshToken,
          expiredAccessToken: expiredToken
        };

        // Refresh the token
        return authService.refreshToken(requestBody).pipe(
          switchMap((newTokens) => {
            // Save new tokens
            tokenStorage.setTokens(newTokens);
            sessionStore.setTokens(newTokens);

            // Retry the original request with new token
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `${newTokens.tokenType} ${newTokens.accessToken}`
              }
            });

            return next(retryReq);
          }),

          // If refresh fails → logout
          catchError(() => {
            sessionStore.clear();
            tokenStorage.clear();
          navigation.goToLogout(); 
          
            return throwError(() => error);
          })
        );
      }

      // -----------------------------------------------------------
      // 5. Other errors → just forward them
      // -----------------------------------------------------------
      return throwError(() => error);
    })
  );
};
