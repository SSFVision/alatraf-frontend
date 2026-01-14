import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../core/auth/Roles/permissions.map';
import { PermissionGuard } from '../../core/guards/permission.guard';

export const REPORTS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.User.READ },
    loadComponent: () =>
      import('./pages/main-reports-page/main-reports-page.component').then(
        (m) => m.MainReportsPageComponent
      ),
  },
];
