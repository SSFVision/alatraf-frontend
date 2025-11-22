import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '../routing/app.routes.map';

@Injectable({ providedIn: 'root' })
export class NavigationFacade {

  private router = inject(Router);

  // -----------------------
  // PATIENTS
  // -----------------------
  toPatientsList() {
    return this.router.navigate([AppRoutes.reception.patients.root]);
  }

  toAddPatient() {
    return this.router.navigate([AppRoutes.reception.patients.add]);
  }

  toEditPatient(id: number) {
    return this.router.navigate([AppRoutes.reception.patients.edit(id)]);
  }

  toViewPatient(id: number) {
    return this.router.navigate([AppRoutes.reception.patients.view(id)]);
  }

  // -----------------------
  // TICKETS
  // -----------------------
  toCreateTicket(patientId: number) {
    return this.router.navigate([AppRoutes.reception.tickets.create(patientId)]);
  }

  toPrintTicket(ticketId: number) {
    return this.router.navigate([AppRoutes.reception.tickets.print(ticketId)]);
  }
}
