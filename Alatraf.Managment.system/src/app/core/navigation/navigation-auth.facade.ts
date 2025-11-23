import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppRoutes } from '../routing/app.routes.map';

// Define the available user roles
export type AppUserRole = 'Reception' | 'Doctor' | 'Admin' | 'Manager' | 'Finance';

@Injectable({ providedIn: 'root' })
export class NavigationAuthFacade {
  private router = inject(Router);

  private go(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }


  goToLogin(extras?: NavigationExtras): void {
    this.go(AppRoutes.auth.login, extras);
  }

  goToLogout(extras?: NavigationExtras): void {
    // (You will clear session/tokens in your AuthService)
    this.go(AppRoutes.auth.login, { replaceUrl: true, ...extras });
  }

  goToTokenExpired(): void {
    this.go(AppRoutes.auth.login, {
      replaceUrl: true,
      queryParams: { reason: 'expired' }
    });
  }


  /** Determine home route based on user role */
  private getHomeRouteForRole(role: AppUserRole): string {
    switch (role) {
      case 'Reception':
        return AppRoutes.reception.patients.root;

      case 'Doctor':
        return AppRoutes.doctor.dashboard;

      case 'Admin':
        return AppRoutes.admin.dashboard;

      case 'Manager':
        return AppRoutes.management.dashboard;

      case 'Finance':
        return AppRoutes.finance.transactions;

      default:
        return AppRoutes.auth.login;
    }
  }

  /** Used after successful login */
  redirectAfterLogin(role: AppUserRole): void {
    const home = this.getHomeRouteForRole(role);
    this.go(home, { replaceUrl: true });
  }

  goToRoleHome(role: AppUserRole): void {
    const home = this.getHomeRouteForRole(role);
    this.go(home);
  }
}
