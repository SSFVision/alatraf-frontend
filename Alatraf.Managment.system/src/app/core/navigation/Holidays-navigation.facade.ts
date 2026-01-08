import { Injectable, inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { AppRoutes } from '../routing/app.routes.map';

@Injectable({ providedIn: 'root' })
export class HolidaysNavigationFacade {
  private router = inject(Router);

  goToAddHoliday(extras?: NavigationExtras): void {
    this.go(
      `${AppRoutes.Appointment.root}/${AppRoutes.Appointment.manage}/${AppRoutes.Appointment.holidays.add}`,
      extras
    );
  }

  goToHolidayList(extras?: NavigationExtras): void {
    this.go(
      `${AppRoutes.Appointment.root}/${AppRoutes.Appointment.manage}/${AppRoutes.Appointment.holidays.list}`,
      extras
    );
  }

  goToManageAppointments(extras?: NavigationExtras): void {
    this.go(
      `${AppRoutes.Appointment.root}/${AppRoutes.Appointment.manage}`,
      extras
    );
  }

  private go(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }
}
