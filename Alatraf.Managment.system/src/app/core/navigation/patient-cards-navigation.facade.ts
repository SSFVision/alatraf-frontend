import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppRoutes } from '../../core/routing/app.routes.map';
import { PatientSelectTarget } from '../../shared/enums/patient-select-target.enum';

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
    cardNumber: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(AppRoutes.patientCards.wounded.edit(cardNumber), extras);
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

  goToCreateDisabledCardPage(patientId: number): void {
    this.go(AppRoutes.patientCards.disabled.create, {
      queryParams: { patientId },
    });
  }

  goToEditDisabledCardPage(
    cardNumber: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(AppRoutes.patientCards.disabled.edit(cardNumber), extras);
  }

  goToViewDisabledCardPage(
    disabledCardId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(AppRoutes.patientCards.disabled.view(disabledCardId), extras);
  }
  goToPatientSelectPage(extras?: NavigationExtras): void {
    this.go(AppRoutes.reception.patients.select, extras);
  }
 goToPatientsSelectForDisabledCard(): void {
  this.go(AppRoutes.reception.patients.select, {
    queryParams: { target: PatientSelectTarget.DisabledCard },
  });
}

  // =========================
  // Private
  // =========================

  private go(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }
}
