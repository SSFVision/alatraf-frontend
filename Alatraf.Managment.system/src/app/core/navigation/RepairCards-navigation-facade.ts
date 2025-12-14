import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppRoutes } from '../routing/app.routes.map';

@Injectable({ providedIn: 'root' })
export class RepairCardsNavigationFacade {
  private router = inject(Router);

  // ================= MAIN =================
  goToRepairCardsMainPage(extras?: NavigationExtras): void {
    this.go(AppRoutes.repairCards.root, extras);
  }

  // ================= DETAILS =================
  goToRepairCardDetailsPage(
    cardId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      AppRoutes.repairCards.details(cardId),
      extras
    );
  }

  // ================= ASSIGNMENTS =================
  goToRepairCardAssignmentsPage(
    cardId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      AppRoutes.repairCards.assignments.list(cardId),
      extras
    );
  }

  // assign whole repair card to doctor
  goToAssignRepairCardToDoctorPage(
    cardId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      AppRoutes.repairCards.assignments.assignCard(cardId),
      extras
    );
  }

  // assign industrial parts to doctors
  goToAssignIndustrialPartsPage(
    cardId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      AppRoutes.repairCards.assignments.assignParts(cardId),
      extras
    );
  }

  // ================= STATUS =================
  goToUpdateRepairCardStatusPage(
    cardId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      AppRoutes.repairCards.status(cardId),
      extras
    );
  }

  // ================= DELIVERY TIME =================
  goToCreateDeliveryTimePage(
    cardId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      AppRoutes.repairCards.deliveryTime(cardId),
      extras
    );
  }

  // ================= INTERNAL =================
  private go(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }
}
