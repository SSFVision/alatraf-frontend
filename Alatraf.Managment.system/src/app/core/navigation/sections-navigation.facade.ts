import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppRoutes } from '../../core/routing/app.routes.map';

@Injectable({ providedIn: 'root' })
export class SectionsNavigationFacade {
  private router = inject(Router);

  goToSectionsMainPage(extras?: NavigationExtras): void {
    this.go(AppRoutes.sections.root, extras);
  }

  goToSectionsListPage(extras?: NavigationExtras): void {
    this.go(
      `${AppRoutes.sections.root}/${AppRoutes.sections.list}`,
      extras
    );
  }

  goToCreateSectionPage(extras?: NavigationExtras): void {
    this.go(
      `${AppRoutes.sections.root}/${AppRoutes.sections.create}`,
      extras
    );
  }

  goToEditSectionPage(
    sectionId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      `${AppRoutes.sections.root}/${AppRoutes.sections.edit(sectionId)}`,
      extras
    );
  }

  goToViewSectionPage(
    sectionId: number | string,
    extras?: NavigationExtras
  ): void {
    this.go(
      `${AppRoutes.sections.root}/${AppRoutes.sections.view(sectionId)}`,
      extras
    );
  }

  private go(
    path: string | any[],
    extras?: NavigationExtras
  ): void {
    this.router.navigate(
      Array.isArray(path) ? path : [path],
      extras
    );
  }
}
