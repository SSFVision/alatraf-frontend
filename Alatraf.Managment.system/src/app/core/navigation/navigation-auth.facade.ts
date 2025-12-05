import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppRoutes } from '../routing/app.routes.map';
import { AppUserRole } from '../auth/models/app.user.roles.enum';


@Injectable({ providedIn: 'root' })
export class NavigationAuthFacade {
  private router = inject(Router);

  private go(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }

  goToUnauthorized(extras?: NavigationExtras): void {
    this.go(AppRoutes.system.unauthorized, extras);
  }

  goToLogout(extras?: NavigationExtras): void {
    this.go(AppRoutes.auth.login, { replaceUrl: true, ...extras });
  }

  goToTokenExpired(): void {
    this.go(AppRoutes.auth.login, {
      replaceUrl: true,
      queryParams: { reason: 'expired' },
    });
  }


  goToLogin(extras?: NavigationExtras): void {
    this.go(AppRoutes.auth.login, extras);
  }

  private getHomeRouteForRole(role: AppUserRole): string {
    switch (role) {
      case 'Reception':
        return AppRoutes.reception.root;

      case 'Doctor_Therapy':
        return `${AppRoutes.diagnosis.root}/${AppRoutes.diagnosis.therapy.root}`;
        case 'Doctor_Industrial':
        return `${AppRoutes.diagnosis.root}/${AppRoutes.diagnosis.industrial.root}`;

      case 'Finance':
        return AppRoutes.finance.root;

      // case 'Admin':
      //   return AppRoutes.admin.dashboard;

      // case 'Manager':
      //   return AppRoutes.management.dashboard;

      default:
        return AppRoutes.auth.login;
    }
  }

  /** Used after successful login */
  redirectAfterLogin(role: AppUserRole): void {
    // console.log("try Navigate ",role);
    const home = this.getHomeRouteForRole(role);
    this.go(home, { replaceUrl: true });
  }

  goToRoleHome(role: AppUserRole): void {
    const home = this.getHomeRouteForRole(role);
    this.go(home);
  }
}
