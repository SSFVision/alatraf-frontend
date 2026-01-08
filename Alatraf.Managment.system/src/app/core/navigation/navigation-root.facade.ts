import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { AppRoutes } from '../routing/app.routes.map';
import { NavigationAuthFacade } from './navigation-auth.facade';
import { AppUserRole } from '../auth/Roles/app.user.roles.enum';

@Injectable({ providedIn: 'root' })
export class NavigationRootFacade {
  private router = inject(Router);
  private location = inject(Location);
  private authNav = inject(NavigationAuthFacade);

  private go(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }

  goToLanding(extras?: NavigationExtras): void {
    this.go(AppRoutes.auth.login, extras);
  }
  goUnauthorized(): void {
    this.go(AppRoutes.system.unauthorized, { replaceUrl: true });
  }

  /** Navigate to Not Found page */
  goNotFound(): void {
    this.go(AppRoutes.system.notFound, { replaceUrl: true });
  }

  /** Navigate to current user's home page based on role */
  goHome(role: AppUserRole): void {
    this.authNav.goToRoleHome(role);
  }

  /** Browser back navigation */
  goBack(): void {
    this.location.back();
  }

  goBackOrDefault(defaultRoute: string, extras?: NavigationExtras): void {
    try {
      this.location.back();
    } catch {
      this.go(defaultRoute, extras);
    }
  }
}
