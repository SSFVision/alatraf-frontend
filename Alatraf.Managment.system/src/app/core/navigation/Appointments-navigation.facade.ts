import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppRoutes } from '../routing/app.routes.map';

@Injectable({ providedIn: 'root' })
export class AppointmentsNavigationFacade {
  private router = inject(Router);

  goToAppointmentMainPage(extras?: NavigationExtras): void {
    this.go(AppRoutes.Appointment.root, extras);
  }

  goToManageAppointmentPage(extras?: NavigationExtras): void {
    this.go(
      `${AppRoutes.Appointment.root}/${AppRoutes.Appointment.manage}`,
      extras
    );
  }
  goToSchedulaPage(
    ticketId: number | string,
    patientId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      `${AppRoutes.Appointment.root}/${AppRoutes.Appointment.schedule(
        ticketId,
        patientId
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
  goToAddNewHolidayPage(extras?: NavigationExtras): void {
    this.go(
      `${AppRoutes.Appointment.root}/${AppRoutes.Appointment.manage}/${AppRoutes.Appointment.holidays.add}`,
      extras
    );
  }

  goToHolidayListPage(extras?: NavigationExtras): void {
    this.go(
      `${AppRoutes.Appointment.root}/${AppRoutes.Appointment.manage}/${AppRoutes.Appointment.holidays.list}`,
      extras
    );
  }

  goToChangeAppointmentStatus(
    appointmentId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      `${AppRoutes.Appointment.root}/${AppRoutes.Appointment.changeStatus(
        appointmentId
      )}`,
      extras
    );
  }
  private go(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }
}
