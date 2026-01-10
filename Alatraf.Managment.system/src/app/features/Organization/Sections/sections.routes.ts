import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../../core/auth/Roles/permissions.map';
import { PermissionGuard } from '../../../core/guards/permission.guard';

export const SectionsRoutes: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.Section.READ },
    loadComponent: () =>
      import('./pages/main-section-page/main-section-page.component').then(
        (m) => m.MainSectionPageComponent
      ),

    children: [
      {
        path: 'create',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.Section.CREATE },
        loadComponent: () =>
          import(
            './pages/sections-workspace/sections-workspace.component'
          ).then((m) => m.SectionsWorkspaceComponent),
      },
      {
        path: 'edit/:sectionId',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.Section.UPDATE },
        loadComponent: () =>
          import(
            './pages/sections-workspace/sections-workspace.component'
          ).then((m) => m.SectionsWorkspaceComponent),
      },
    ],
  },

  {
    path: '',
    redirectTo: 'sections',
    pathMatch: 'full',
  },
];
