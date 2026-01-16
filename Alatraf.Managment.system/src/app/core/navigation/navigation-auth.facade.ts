import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppRoutes } from '../routing/app.routes.map';
import { AppUserRole } from '../auth/Roles/app.user.roles.enum';

@Injectable({ providedIn: 'root' })
export class NavigationAuthFacade {
  private router = inject(Router);

  private go(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(path) ? path : [path], {
      replaceUrl: true,
      ...extras,
    });
  }

  goToUnauthorized(extras?: NavigationExtras): void {
    this.go(AppRoutes.system.unauthorized, extras);
  }

  goToLogout(extras?: NavigationExtras): void {
    this.go(AppRoutes.auth.login, extras);
  }

  goToTokenExpired(): void {
    this.go(AppRoutes.auth.login, {
      queryParams: { reason: 'expired' },
    });
  }

  goToLogin(extras?: NavigationExtras): void {
    this.go(AppRoutes.auth.login, extras);
  }

  private getHomeRouteForRole(role: AppUserRole): string {
    switch (role) {
      case AppUserRole.Receptionist:
        return AppRoutes.reception.root;

      case AppUserRole.TherapyDoctor:
        return `${AppRoutes.diagnosis.root}/${AppRoutes.diagnosis.therapy.root}`;
      case AppUserRole.IndustrialDoctor:
        return `${AppRoutes.diagnosis.root}/${AppRoutes.diagnosis.industrial.root}`;
      case AppUserRole.TherapyManagementReceptionist:
        return AppRoutes.therapyCards.root;
      case AppUserRole.FinanceEmployee:
        return AppRoutes.finance.root;
      case AppUserRole.SalesEmployee:
        return AppRoutes.finance.root;
      case AppUserRole.AppointmentsEmployee:
        return `${AppRoutes.Appointment.root}/${AppRoutes.Appointment.manage}`;
      case AppUserRole.Admin:
        return `${AppRoutes.users.root}`;

      // return `${AppRoutes.Appointment.root}/${AppRoutes.Appointment.manage}`;
      // case 'Manager':
      //   return AppRoutes.management.dashboard;

      default: {
        return AppRoutes.dashboard.root;
      }
    }
  }

  /** Used after successful login */
  redirectAfterLogin(role: AppUserRole): void {
    console.log('try Navigate ', role);
    const home = this.getHomeRouteForRole(role);
    this.go(home);
  }

  goToRoleHome(role: AppUserRole): void {
    const home = this.getHomeRouteForRole(role);

    this.go(home);
  }
  goToDefultRole(): void {
    this.go(AppRoutes.dashboard.root);
  }
}
