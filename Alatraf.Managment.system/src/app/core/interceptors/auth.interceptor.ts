import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError, switchMap } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { RefreshTokenRequest } from "../auth/models/refresh-token-request.model";
import { SessionStore } from "../auth/session.store";
import { TokenStorageFacade } from "../auth/token-storage/token-storage.facade";
import { NavigationAuthFacade } from "../navigation/navigation-auth.facade";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageFacade);
  const authService = inject(AuthService);
  const sessionStore = inject(SessionStore);
  const navigation = inject(NavigationAuthFacade);

  // Skip login & refresh endpoints
  if (
    req.url.includes('/identity/token/generate') ||
    req.url.includes('/identity/token/refresh-token')
  ) {
    return next(req);
  }

  const accessToken = tokenStorage.getAccessToken();

  let authReq = req;
  if (accessToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `${sessionStore.session().tokenType ?? 'Bearer'} ${accessToken}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const refreshToken = tokenStorage.getRefreshToken();

        if (!refreshToken || !accessToken) {
          sessionStore.clear();
          tokenStorage.clear();
          navigation.goToLogout();
          return throwError(() => error);
        }

        const body: RefreshTokenRequest = {
          refreshToken,
          expiredAccessToken: accessToken
        };

        return authService.refreshToken(body).pipe(
          switchMap((newTokens) => {
            tokenStorage.setTokens(newTokens);
            sessionStore.setTokens(newTokens);

            const retryReq = authReq.clone({
              setHeaders: {
                Authorization: `${newTokens.tokenType} ${newTokens.accessToken}`
              }
            });

            return next(retryReq);
          }),
          catchError(() => {
            sessionStore.clear();
            tokenStorage.clear();
            navigation.goToLogout();
            return throwError(() => new Error('Refresh token failed'));
          })
        );
      }

      return throwError(() => error);
    })
  );
};
