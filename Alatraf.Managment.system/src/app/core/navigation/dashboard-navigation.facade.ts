import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppRoutes } from '../../core/routing/app.routes.map';

@Injectable({ providedIn: 'root' })
export class DashboardNavigationFacade {
  private router = inject(Router);


  goToDashboard(extras?: NavigationExtras): void {
    this.go(AppRoutes.dashboard.root, extras);
  }


  // goToUsers(extras?: NavigationExtras): void {
  //   this.go(AppRoutes.users.root, extras);
  // }

  goToSections(extras?: NavigationExtras): void {
    this.go(AppRoutes.sections.root, extras);
  }

  goToPatients(extras?: NavigationExtras): void {
    this.go(AppRoutes.reception.patients.root, extras);
  }

  // goToReports(extras?: NavigationExtras): void {
  //   this.go(AppRoutes.reports.root, extras);
  // }


  private go(
    path: string | any[],
    extras?: NavigationExtras
  ): void {
    this.router.navigate(
      Array.isArray(path) ? path : [path],
      extras
    );
  }
}
