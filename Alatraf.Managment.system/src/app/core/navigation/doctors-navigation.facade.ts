import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppRoutes } from '../../core/routing/app.routes.map';

@Injectable({ providedIn: 'root' })
export class DoctorsNavigationFacade {
  private router = inject(Router);

  goToDoctorsMainPage(extras?: NavigationExtras): void {
    this.go(AppRoutes.doctors.root, extras);
  }

  // goToDoctorsListPage(extras?: NavigationExtras): void {
  //   this.go(`${AppRoutes.therapyCards.root}.${AppRoutes.therapyCards.doctors.list}`, extras);
  // }

  goToCreateDoctorPage(extras?: NavigationExtras): void {
    this.go(`${AppRoutes.doctors.root}/${AppRoutes.doctors.create}`, extras);
  }

  goToEditDoctorPage(
    doctorId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      `${AppRoutes.doctors.root}/${AppRoutes.doctors.edit(doctorId)}`,
      extras
    );
  }

  goToViewDoctorPage(
    doctorId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      `${AppRoutes.doctors.root}/${AppRoutes.doctors.view(doctorId)}`,
      extras
    );
  }

  private go(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }
}
