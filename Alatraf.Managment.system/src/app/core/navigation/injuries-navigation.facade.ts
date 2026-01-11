import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppRoutes } from '../routing/app.routes.map';

@Injectable({ providedIn: 'root' })
export class InjuriesNavigationFacade {
  private router = inject(Router);

  goToInjuriesMainPage(extras?: NavigationExtras): void {
    this.go(AppRoutes.injuries.root, extras);
  }

  // Injury Types
  goToInjuryTypesListPage(extras?: NavigationExtras): void {
    this.go(AppRoutes.injuries.types.list, extras);
  }

  goToCreateInjuryTypePage(extras?: NavigationExtras): void {
    this.go(AppRoutes.injuries.types.create, extras);
  }

  goToEditInjuryTypePage(id: number | string, extras?: NavigationExtras): void {
    this.go(AppRoutes.injuries.types.edit(id), extras);
  }

  // Injury Sides
  goToInjurySidesListPage(extras?: NavigationExtras): void {
    this.go(AppRoutes.injuries.sides.list, extras);
  }

  goToCreateInjurySidePage(extras?: NavigationExtras): void {
    this.go(AppRoutes.injuries.sides.create, extras);
  }

  goToEditInjurySidePage(id: number | string, extras?: NavigationExtras): void {
    this.go(AppRoutes.injuries.sides.edit(id), extras);
  }

  // Injury Reasons
  goToInjuryReasonsListPage(extras?: NavigationExtras): void {
    this.go(AppRoutes.injuries.reasons.list, extras);
  }

  goToCreateInjuryReasonPage(extras?: NavigationExtras): void {
    this.go(AppRoutes.injuries.reasons.create, extras);
  }

  goToEditInjuryReasonPage(
    id: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(AppRoutes.injuries.reasons.edit(id), extras);
  }

  private go(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }
}
