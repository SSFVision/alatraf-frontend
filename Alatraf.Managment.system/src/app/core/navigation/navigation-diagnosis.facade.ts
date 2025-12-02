import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppRoutes } from '../routing/app.routes.map';

@Injectable({ providedIn: 'root' })
export class NavigationDiagnosisFacade {
  private router = inject(Router);

  goToDiagnosisMainPage(extras?: NavigationExtras): void {
    this.go(AppRoutes.diagnosis.root, extras);
  }

  goToTherapyList(extras?: NavigationExtras): void {
    // /diagnosis/therapy
    this.go(
      `${AppRoutes.diagnosis.root}/${AppRoutes.diagnosis.therapy.root}`,
      extras
    );
  }

  goToTherapyCreate(
    patientId: number | string,
    extras?: NavigationExtras
  ): void {
    // /diagnosis/therapy/create/:patientId
    this.go(
      `${AppRoutes.diagnosis.root}/${AppRoutes.diagnosis.therapy.create(
        patientId
      )}`,
      extras
    );
  }

  goToTherapyView(
    diagnosisId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      `${AppRoutes.diagnosis.root}/${AppRoutes.diagnosis.therapy.view(
        diagnosisId
      )}`,
      extras
    );
  }

  goToTherapyEdit(
    diagnosisId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      `${AppRoutes.diagnosis.root}/${AppRoutes.diagnosis.therapy.edit(
        diagnosisId
      )}`,
      extras
    );
  }

  // -------------------------------------------------------
  // INDUSTRIAL DIAGNOSIS
  // -------------------------------------------------------
  goToIndustrialList(extras?: NavigationExtras): void {
    this.go(
      `${AppRoutes.diagnosis.root}/${AppRoutes.diagnosis.industrial.root}`,
      extras
    );
  }

  goToIndustrialCreate(
    patientId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      `${AppRoutes.diagnosis.root}/${AppRoutes.diagnosis.industrial.create(
        patientId
      )}`,
      extras
    );
  }

  goToIndustrialView(
    diagnosisId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      `${AppRoutes.diagnosis.root}/${AppRoutes.diagnosis.industrial.view(
        diagnosisId
      )}`,
      extras
    );
  }

  goToIndustrialEdit(
    diagnosisId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      `${AppRoutes.diagnosis.root}/${AppRoutes.diagnosis.industrial.edit(
        diagnosisId
      )}`,
      extras
    );
  }

  // -------------------------------------------------------
  // INTERNAL HELPER
  // -------------------------------------------------------
  private go(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }
}
