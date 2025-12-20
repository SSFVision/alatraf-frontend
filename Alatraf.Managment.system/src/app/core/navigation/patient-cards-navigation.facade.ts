import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppRoutes } from '../../core/routing/app.routes.map';

@Injectable({ providedIn: 'root' })
export class PatientCardsNavigationFacade {
  private router = inject(Router);

  goToWoundedCardsMainPage(extras?: NavigationExtras): void {
    this.go(AppRoutes.patientCards.wounded.root, extras);
  }

  goToCreateWoundedCardPage(extras?: NavigationExtras): void {
    this.go(AppRoutes.patientCards.wounded.create, extras);
  }

  goToEditWoundedCardPage(
    woundedCardId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(AppRoutes.patientCards.wounded.edit(woundedCardId), extras);
  }

  goToViewWoundedCardPage(
    woundedCardId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(AppRoutes.patientCards.wounded.view(woundedCardId), extras);
  }


  goToDisabledCardsMainPage(extras?: NavigationExtras): void {
    this.go(AppRoutes.patientCards.disabled.root, extras);
  }

  goToCreateDisabledCardPage(extras?: NavigationExtras): void {
    this.go(AppRoutes.patientCards.disabled.create, extras);
  }

  goToEditDisabledCardPage(
    disabledCardId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(AppRoutes.patientCards.disabled.edit(disabledCardId), extras);
  }

  goToViewDisabledCardPage(
    disabledCardId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(AppRoutes.patientCards.disabled.view(disabledCardId), extras);
  }

  // =========================
  // Private
  // =========================

  private go(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }
}
