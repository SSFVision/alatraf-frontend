import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../../core/auth/models/permissions.map';
import { PermissionGuard } from '../../../core/guards/permission.guard';

export const DoctorsRoutes: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.Doctors.VIEW },
    loadComponent: () =>
      import('./Pages/main-doctor-page/main-doctor-page.component').then(
        (m) => m.MainDoctorPageComponent
      ),

    children: [
      {
        path: 'edit/:doctorId',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.Doctors.UPDATE },
        loadComponent: () =>
          import(
            './Pages/doctor-workspace-page/doctor-workspace-page.component'
          ).then((m) => m.DoctorWorkspacePageComponent),
      },
      {
        path: 'create',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.Doctors.CREATE },
        loadComponent: () =>
          import(
            './Pages/doctor-workspace-page/doctor-workspace-page.component'
          ).then((m) => m.DoctorWorkspacePageComponent),
      },
      // {
      //   path: 'view/:doctorId',
      //   canActivate: [PermissionGuard],
      //   data: { permission: PERMISSIONS.Doctors.VIEW },
      //   loadComponent: () =>
      //     import(
      //       './Pages/doctor-workspace-page/doctor-workspace-page.component'
      //     ).then((m) => m.DoctorWorkspacePageComponent),
      // },
    ],
  },

  {
    path: '',
    redirectTo: 'doctors',
    pathMatch: 'full',
  },
];
