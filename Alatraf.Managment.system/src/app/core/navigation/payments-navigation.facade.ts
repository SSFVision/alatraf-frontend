import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppRoutes } from '../routing/app.routes.map';

@Injectable({ providedIn: 'root' })
export class PaymentsNavigationFacade {
  private router = inject(Router);

  goToPaymentMainPage(extras?: NavigationExtras): void {
    this.go(AppRoutes.finance.root, extras);
  }

  goToPaiedPage(patientId: number | string, extras?: NavigationExtras): void {
    this.go(
      `${AppRoutes.finance.root}/${AppRoutes.finance.paied(patientId)}`,
      extras
    );
  }

  private go(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }
}
