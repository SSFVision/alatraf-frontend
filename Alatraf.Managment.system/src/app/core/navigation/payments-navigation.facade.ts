import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppRoutes } from '../routing/app.routes.map';

@Injectable({ providedIn: 'root' })
export class PaymentsNavigationFacade {
  private router = inject(Router);

  goToPaymentMainPage(extras?: NavigationExtras): void {
    this.go(AppRoutes.payment.root, extras);
  }

  goToPaiedPage(extras?: NavigationExtras): void {
    this.go(AppRoutes.payment.root, extras);
  }

  private go(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }
}
