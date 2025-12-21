import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../core/auth/models/permissions.map';
import { PermissionGuard } from '../../core/guards/permission.guard';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.THERAPY_CARDS.VIEW },
    loadComponent: () =>
      import('./Pages/main-user-page/main-user-page.component').then(
        (m) => m.MainUserPageComponent
      ),
  },
];
