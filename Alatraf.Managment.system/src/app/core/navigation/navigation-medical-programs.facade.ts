import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppRoutes } from '../routing/app.routes.map';

@Injectable({ providedIn: 'root' })
export class MedicalProgramsNavigationFacade {
  private router = inject(Router);

  goToMedicalProgramsMainPage(extras?: NavigationExtras): void {
    this.go(AppRoutes.medicalPrograms.root, extras);
  }

  goToMedicalProgramsListPage(extras?: NavigationExtras): void {
    this.go(
      `${AppRoutes.medicalPrograms.root}/${AppRoutes.medicalPrograms.list}`,
      extras
    );
  }

  goToCreateMedicalProgramPage(extras?: NavigationExtras): void {
    this.go(
      `${AppRoutes.medicalPrograms.root}/${AppRoutes.medicalPrograms.create}`,
      extras
    );
  }

  goToEditMedicalProgramPage(
    medicalProgramId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      `${AppRoutes.medicalPrograms.root}/${AppRoutes.medicalPrograms.edit(
        medicalProgramId
      )}`,
      extras
    );
  }

  goToViewMedicalProgramPage(
    medicalProgramId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      `${AppRoutes.medicalPrograms.root}/${AppRoutes.medicalPrograms.view(
        medicalProgramId
      )}`,
      extras
    );
  }

  private go(path: string | any[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }
}
