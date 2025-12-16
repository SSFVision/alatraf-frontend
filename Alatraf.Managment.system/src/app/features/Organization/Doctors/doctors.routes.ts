import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../../core/auth/models/permissions.map';
import { PermissionGuard } from '../../../core/guards/permission.guard';

export const DoctorsRoutes: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.Doctors.VIEW },
    loadComponent: () =>
      import(
        './Pages/doctor-workspace-page/doctor-workspace-page.component'
      ).then((m) => m.DoctorWorkspacePageComponent),

    children: [
      // {
      //   path: 'edit/:doctorId',
      //   canActivate: [PermissionGuard],
      //   data: { permission: PERMISSIONS.Doctors.UPDATE },
      //   loadComponent: () =>
      //     import(
      //       './Pages/doctors-work-space/doctors-work-space.component'
      //     ).then((m) => m.DoctorsWorkSpaceComponent),
      // },
      // {
      //   path: 'create',
      //   canActivate: [PermissionGuard],
      //   data: { permission: PERMISSIONS.Doctors.CREATE },
      //   loadComponent: () =>
      //     import(
      //       './Pages/doctors-work-space/doctors-work-space.component'
      //     ).then((m) => m.DoctorsWorkSpaceComponent),
      // },
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
