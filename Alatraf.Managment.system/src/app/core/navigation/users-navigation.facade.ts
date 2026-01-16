import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppRoutes } from '../../core/routing/app.routes.map';

@Injectable({ providedIn: 'root' })
export class UsersNavigationFacade {
  private router = inject(Router);

  // ==============================
  // Users
  // ==============================
  goToUsersMainPage(extras?: NavigationExtras): void {
    this.go(AppRoutes.users.root, { replaceUrl: true, ...extras });
  }

  goToUsersListPage(extras?: NavigationExtras): void {
    this.go(`${AppRoutes.users.root}/${AppRoutes.users.list}`, {
      replaceUrl: true,
      ...extras,
    });
  }

  goToCreateUserPage(extras?: NavigationExtras): void {
    this.go(`${AppRoutes.users.root}/${AppRoutes.users.create}`, {
      replaceUrl: true,
      ...extras,
    });
  }

  goToEditUserPage(userId: string, extras?: NavigationExtras): void {
    this.go(`${AppRoutes.users.root}/${AppRoutes.users.edit(userId)}`, {
      replaceUrl: true,
      ...extras,
    });
  }

  goToChangeCredentialsPage(
    userId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      `${AppRoutes.users.root}/${AppRoutes.users.changeCredentials(userId)}`,
      { replaceUrl: true, ...extras }
    );
  }

  goToResetPasswordPage(
    userId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      `${AppRoutes.users.root}/${AppRoutes.users.resetPassword(userId)}`,
      { replaceUrl: true, ...extras }
    );
  }

  goToViewUserPage(userId: string, extras?: NavigationExtras): void {
    this.go(`${AppRoutes.users.root}/${AppRoutes.users.view(userId)}`, {
      replaceUrl: true,
      ...extras,
    });
  }

  // ==============================
  // User Permissions / Roles
  // ==============================
  goToUserRoleAssignPage(userId: string, extras?: NavigationExtras): void {
    this.go(`${AppRoutes.users.root}/${AppRoutes.users.AssignRole(userId)}`, {
      replaceUrl: true,
      ...extras,
    });
  }

  goToUserPermissionsPage(
    userId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      `${AppRoutes.users.root}/${AppRoutes.users.grandPermissions(userId)}`,
      { replaceUrl: true, ...extras }
    );
  }

  // ==============================
  // Internal Helper
  // ==============================
  private go(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }
}
