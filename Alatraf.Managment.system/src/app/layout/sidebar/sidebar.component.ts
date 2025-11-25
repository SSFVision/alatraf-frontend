import { Component, inject, signal } from '@angular/core';
import { MENU_CONFIG, MenuCategory } from '../../core/navigation/sidebar.items';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationAuthFacade } from '../../core/navigation/navigation-auth.facade';
import { AuthFacade } from '../../core/auth/auth.facade';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  auth = inject(AuthFacade);

  menu = signal<MenuCategory[]>([]);
   constructor() {
    this.buildMenu();
  }

  private buildMenu() {
    this.menu.set(
      MENU_CONFIG
        .map((category) => {
          const filteredItems = category.items.filter(item =>
            this.canShowItem(item.requiredPermissions)
          );

          return {
            ...category,
            items: filteredItems,
          };
        })
        .filter((category) => category.items.length > 0)
    );
  }

  private canShowItem(requiredPermissions: string[]): boolean {
    // If no permissions required → always show
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // Check every required permission
    return requiredPermissions.every((perm) =>
      this.auth.hasPermission(perm)
    );
  }

  OnLogOut() {
    this.auth.logout();
  }
}
