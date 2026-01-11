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
    this.go(AppRoutes.users.root, extras);
  }

  goToUsersListPage(extras?: NavigationExtras): void {
    this.go(`${AppRoutes.users.root}/${AppRoutes.users.list}`, extras);
  }

  goToCreateUserPage(extras?: NavigationExtras): void {
    this.go(`${AppRoutes.users.root}/${AppRoutes.users.create}`, extras);
  }

  goToEditUserPage(userId:  string, extras?: NavigationExtras): void {
    this.go(`${AppRoutes.users.root}/${AppRoutes.users.edit(userId)}`, extras);
  }

  goToViewUserPage(userId: string, extras?: NavigationExtras): void {
    this.go(`${AppRoutes.users.root}/${AppRoutes.users.view(userId)}`, extras);
  }

  // ==============================
  // User Permissions
  // ==============================
  goToUserRoleAssignPage(userId: string, extras?: NavigationExtras): void {
    this.go(
      `${AppRoutes.users.root}/${AppRoutes.users.AssignRole(userId)}`,
      extras
    );
  }
  goToUserPermissionsPage(
    userId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      `${AppRoutes.users.root}/${AppRoutes.users.permissions(userId)}`,
      extras
    );
  }
  // ==============================
  // Internal Helper
  // ==============================
  private go(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }
}
