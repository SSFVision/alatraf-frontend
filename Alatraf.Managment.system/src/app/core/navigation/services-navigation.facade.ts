import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppRoutes } from '../routing/app.routes.map';

@Injectable({ providedIn: 'root' })
export class ServicesNavigationFacade {
  private router = inject(Router);

  goToServicesMainPage(extras?: NavigationExtras): void {
    this.go(AppRoutes.services.root, extras);
  }

  goToServicesListPage(extras?: NavigationExtras): void {
    this.go(`${AppRoutes.services.root}/${AppRoutes.services.list}`, extras);
  }

  goToCreateServicePage(extras?: NavigationExtras): void {
    this.go(`${AppRoutes.services.root}/${AppRoutes.services.create}`, extras);
  }

  goToEditServicePage(
    serviceId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      `${AppRoutes.services.root}/${AppRoutes.services.edit(serviceId)}`,
      extras
    );
  }

  goToViewServicePage(
    serviceId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      `${AppRoutes.services.root}/${AppRoutes.services.view(serviceId)}`,
      extras
    );
  }

  private go(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }
}
