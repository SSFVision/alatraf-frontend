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
      // 1
      case AppUserRole.Admin:
        return `${AppRoutes.users.root}`;

      // 2
      case AppUserRole.Receptionist:
        return AppRoutes.reception.root;
      // 3
      case AppUserRole.TherapyDoctor:
        return `${AppRoutes.diagnosis.root}/${AppRoutes.diagnosis.therapy.root}`;
      // 4
      case AppUserRole.IndustrialDoctor:
        return `${AppRoutes.diagnosis.root}/${AppRoutes.diagnosis.industrial.root}`;
      // 5
      case AppUserRole.TechnicalManagementReceptionist:
        return AppRoutes.repairCards.root;
      // 6
      case AppUserRole.TherapyManagementReceptionist:
        return AppRoutes.therapyCards.root;
      //7
      case AppUserRole.AppointmentsEmployee:
        return `${AppRoutes.Appointment.root}/${AppRoutes.Appointment.manage}`;
      // 8
      case AppUserRole.FinanceEmployee:
        return AppRoutes.finance.root;
      // 9 
      //  the folwing  roles Are Related to Stores Employees
      case AppUserRole.ExitsEmployee:
        return AppRoutes.dashboard.root;
      //10
      case AppUserRole.PurchaseEmployee:
        return AppRoutes.dashboard.root;
      //11

      case AppUserRole.OrdersEmployee:
        return AppRoutes.dashboard.root;
      //12
      case AppUserRole.ExchangeOrderEmployee:
        return AppRoutes.dashboard.root;
      // 13
      case AppUserRole.SalesEmployee:
        return AppRoutes.dashboard.root;

 
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
