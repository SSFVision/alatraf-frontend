import { Routes } from '@angular/router';
import { PermissionGuard } from '../../core/guards/permission.guard';
import { PERMISSIONS } from '../../core/auth/Roles/permissions.map';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    // canActivate: [PermissionGuard],
    // data: { permission: PERMISSIONS.ADMIN.VIEW },
    loadComponent: () =>
      import('./pages/dashboard-main-page/dashboard-main-page.component').then(
        (m) => m.DashboardMainPageComponent
      ),
  },
];
