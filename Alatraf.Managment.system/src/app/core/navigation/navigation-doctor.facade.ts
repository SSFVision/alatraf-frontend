import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppRoutes } from '../routing/app.routes.map';

@Injectable({ providedIn: 'root' })
export class NavigationDoctorFacade {

  private router = inject(Router);

  // -------------------------------------------------------
  // DIAGNOSIS NAVIGATION
  // -------------------------------------------------------

  goToDiagnosisList(extras?: NavigationExtras): void {
    this.go(AppRoutes.doctor.diagnosis.root, extras);
  }

  goToDiagnosisCreate(patientId: number | string, extras?: NavigationExtras): void {
    this.go(AppRoutes.doctor.diagnosis.create(patientId), extras);
  }

  goToDiagnosisView(diagnosisId: number | string, extras?: NavigationExtras): void {
    this.go(AppRoutes.doctor.diagnosis.view(diagnosisId), extras);
  }

  // -------------------------------------------------------
  // COMMON INTERNAL NAVIGATION METHOD
  // -------------------------------------------------------
  private go(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }
}
