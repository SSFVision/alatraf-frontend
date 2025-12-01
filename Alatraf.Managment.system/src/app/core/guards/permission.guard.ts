import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthFacade } from '../auth/auth.facade';
import { NavigationAuthFacade } from '../navigation/navigation-auth.facade';
import { ToastService } from '../services/toast.service';

export const PermissionGuard: CanActivateFn = (route) => {
  const auth = inject(AuthFacade);
  const navigation = inject(NavigationAuthFacade);
  const toast = inject(ToastService);

  // 1. Required permission from route metadata
  const requiredPermission = route.data?.['permission'] as string;

  if (!requiredPermission) {
    console.warn('PermissionGuard: No permission specified in route data.');
    return true; // default allow when no permission provided
  }

  // 2. Check permission
  const hasPermission = auth.hasPermission(requiredPermission);

  if (hasPermission) {
    return true;
  }

  // 3. User does not have permission → redirect safely
  toast.error('لا تملك صلاحية الوصول إلى هذه الصفحة');

  navigation.goToUnauthorized({ replaceUrl: true });

  return false;
};
