import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppRoutes } from '../routing/app.routes.map';

@Injectable({ providedIn: 'root' })
export class NavigationReceptionFacade {
  private router = inject(Router);

  // -----------------------
  goToPatientsList(extras?: NavigationExtras): void {
    this.go(AppRoutes.reception.patients.root, { replaceUrl: true });
  }

  goToPatientsAdd(extras?: NavigationExtras): void {
    this.go(AppRoutes.reception.patients.add, extras);
  }

  goToPatientsEdit(id: number | string, extras?: NavigationExtras): void {
    this.go(AppRoutes.reception.patients.edit(id), extras);
  }

  goToPatientsView(id: number | string, extras?: NavigationExtras): void {
    this.go(AppRoutes.reception.patients.view(id), extras);
  }

  goToTicketsCreate(
    patientId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(AppRoutes.reception.tickets.create(patientId), extras);
  }

  goToTicketsPrint(ticketId: number | string, extras?: NavigationExtras): void {
    this.go(AppRoutes.reception.tickets.print(ticketId), extras);
  }

  private go(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }
}
