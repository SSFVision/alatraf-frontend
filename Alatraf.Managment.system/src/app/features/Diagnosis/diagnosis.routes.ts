import { Routes } from '@angular/router';
import { AppUserRole } from '../../core/auth/models/app.user.roles.enum';
import { PERMISSIONS } from '../../core/auth/models/permissions.map';
import { PermissionGuard } from '../../core/guards/permission.guard';

export const DiagnosisRoutes: Routes = [
  {
    path: 'therapy',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.DIAGNOSIS.THERAPY.VIEW },
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './Therapy/Pages/therapy-waiting-list/therapy-waiting-list.component'
          ).then((m) => m.TherapyWaitingListComponent),
      },
    ],
  },

  {
    path: 'industrial',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.DIAGNOSIS.INDUSTRIAL.VIEW },
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './Industrial/pages/industrial-waiting-list/industrial-waiting-list.component'
          ).then((m) => m.IndustrialWaitingListComponent),
      },
    ],
  },
];
