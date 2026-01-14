import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppRoutes } from '../../core/routing/app.routes.map';

@Injectable({ providedIn: 'root' })
export class IndustrialPartsNavigationFacade {
  private router = inject(Router);

  goToIndustrialPartsMainPage(extras?: NavigationExtras): void {
    this.go(AppRoutes.industrialParts.root, extras);
  }

 
  goToIndustrialPartsListPage(extras?: NavigationExtras): void {
    this.go(
      `${AppRoutes.industrialParts.root}/${AppRoutes.industrialParts.list}`,
      extras
    );
  }

  goToCreateIndustrialPartPage(extras?: NavigationExtras): void {
    this.go(
      `${AppRoutes.industrialParts.root}/${AppRoutes.industrialParts.create}`,
      extras
    );
  }

  goToEditIndustrialPartPage(
    industrialPartId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      `${AppRoutes.industrialParts.root}/${AppRoutes.industrialParts.edit(
        industrialPartId
      )}`,
      extras
    );
  }

  goToViewIndustrialPartPage(
    industrialPartId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      `${AppRoutes.industrialParts.root}/${AppRoutes.industrialParts.view(
        industrialPartId
      )}`,
      extras
    );
  }

  private go(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }
}
