import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppRoutes } from '../routing/app.routes.map';

@Injectable({ providedIn: 'root' })
export class UnitsNavigationFacade {
  private router = inject(Router);

  goToUnitsMainPage(extras?: NavigationExtras): void {
    this.go(
      `${AppRoutes.industrialParts.root}/${AppRoutes.industrialParts.units.root}`,
      extras
    );
  }

  goToAddNewUnitsPage(extras?: NavigationExtras): void {
    this.go(
      `${AppRoutes.industrialParts.root}/${AppRoutes.industrialParts.units.create}`,
      extras
    );
  }

  goToEditUnitsPage(unitId: number | string, extras?: NavigationExtras): void {
    this.go(
      `${AppRoutes.industrialParts.root}/${AppRoutes.industrialParts.units.edit(
        unitId
      )}`,
      extras
    );
  }

  goToListUnitsPage(extras?: NavigationExtras): void {
    this.go(
      `${AppRoutes.industrialParts.root}/${AppRoutes.industrialParts.units.list}`,
      extras
    );
  }

  // ✅ FIXED: use navigateByUrl for string paths
  private go(path: string | any[], extras?: NavigationExtras): void {
    if (typeof path === 'string') {
      this.router.navigateByUrl(path, extras);
    } else {
      this.router.navigate(path, extras);
    }
  }
}
