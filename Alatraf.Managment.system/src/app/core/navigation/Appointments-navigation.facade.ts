import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppRoutes } from '../routing/app.routes.map';

@Injectable({ providedIn: 'root' })
export class AppointmentsNavigationFacade {
  private router = inject(Router);

  goToAppointmentMainPage(extras?: NavigationExtras): void {
    this.go(AppRoutes.Appointment.root, extras);
  }

  goToSchedulaPage(
    ticketId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      `${AppRoutes.Appointment.root}/${AppRoutes.Appointment.schedule(
        ticketId
      )}`,
      extras
    );
  }
  goToReSchedulaPage(
    patientId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      `${AppRoutes.Appointment.root}/${AppRoutes.Appointment.reschedule(
        patientId
      )}`,
      extras
    );
  }
  goToAddNewHolidayPage(
    extras?: NavigationExtras
  ): void {
    this.go(
      `${AppRoutes.Appointment.root}/${AppRoutes.Appointment.addHoliday}`,
      extras
    );
  }
  private go(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }
}
