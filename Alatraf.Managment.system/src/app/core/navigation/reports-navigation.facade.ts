import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppRoutes } from '../routing/app.routes.map';

@Injectable({ providedIn: 'root' })
export class ReportsNavigationFacade {
  private router = inject(Router);

  goToReportsRoot(extras?: NavigationExtras): void {
    this.go(AppRoutes.reports.root, extras);
  }

  goToPatientsReport(extras?: NavigationExtras): void {
    this.go(`${AppRoutes.reports.root}/${AppRoutes.reports.patients}`, extras);
  }

  goToDiagnosisReport(extras?: NavigationExtras): void {
    this.go(`${AppRoutes.reports.root}/${AppRoutes.reports.diagnosis}`, extras);
  }

  goToSessionsReport(extras?: NavigationExtras): void {
    this.go(`${AppRoutes.reports.root}/${AppRoutes.reports.sessions}`, extras);
  }

  goToReport(type: string, extras?: NavigationExtras): void {
    this.go(
      `${AppRoutes.reports.root}/${AppRoutes.reports.report(type)}`,
      extras
    );
  }

  private go(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }
}
