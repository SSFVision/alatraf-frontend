import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppRoutes } from '../routing/app.routes.map';

@Injectable({ providedIn: 'root' })
export class TherapyCardsNavigationFacade {
  private router = inject(Router);

  // ================= MAIN =================
  goToTherapyCardsMainPage(extras?: NavigationExtras): void {
    this.go(AppRoutes.therapyCards.root, extras);
  }

  // ================= DETAILS =================
  goToTherapyCardDetailsPage(
    cardId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(AppRoutes.therapyCards.details(cardId), extras);
  }

  // ================= SESSIONS =================
  goToTherapyCardSessionsPage(
    cardId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(AppRoutes.therapyCards.sessions.list(cardId), extras);
  }

  goToCreateTherapySessionPage(
    cardId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(AppRoutes.therapyCards.sessions.create(cardId), extras);
  }

  goToEditTherapySessionPage(
    cardId: number | string,
    sessionId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(AppRoutes.therapyCards.sessions.edit(cardId, sessionId), extras);
  }

  goToTherapyDoctorsListPage(
    doctorId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(`${AppRoutes.therapyCards.doctors.view(doctorId)}`, extras);
  }

  // ================= INTERNAL =================
  private go(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }
}
