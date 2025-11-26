import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthFacade } from '../auth/auth.facade';
import { NavigationAuthFacade } from '../navigation/navigation-auth.facade';


export const AuthGuard: CanActivateFn = (route, state) => {

  const auth = inject(AuthFacade);
  const navigation = inject(NavigationAuthFacade);

  const isLoggedIn = auth.isLoggedIn();

  // -----------------------------------------------------------
  // 1. User is already logged in → allow access
  // -----------------------------------------------------------
  if (isLoggedIn) {
    return true;
  }

  // -----------------------------------------------------------
  // 2. User NOT logged in → redirect to login
  // -----------------------------------------------------------
  navigation.goToLogin({
    replaceUrl: true,
    queryParams: { returnUrl: state.url }
  });

  return false;
};
