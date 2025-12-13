import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppRoutes } from '../routing/app.routes.map';
import { PaymentReference } from '../../features/Pyments/Models/payment-reference.enum';

@Injectable({ providedIn: 'root' })
export class PaymentsNavigationFacade {
  private router = inject(Router);

  goToPaymentMainPage(extras?: NavigationExtras): void {
    this.go(AppRoutes.finance.root, extras);
  }

 goToPaiedPage(
  paymentId: number | string,
  paymentReference: string,
  extras?: NavigationExtras
): void {
  this.go(
    `${AppRoutes.finance.root}/${AppRoutes.finance.paied(
      paymentId,
      paymentReference
    )}`,
    extras
  );
}

// goToPaiedPage(
//   paymentId: number,
//   paymentReference: PaymentReference,
//   extras?: NavigationExtras
// ): void {
//   this.go(
//     `${AppRoutes.finance.root}/${AppRoutes.finance.paied(
//       paymentId,
//       paymentReference
//     )}`,
//     extras
//   );
// }


  private go(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }
}
