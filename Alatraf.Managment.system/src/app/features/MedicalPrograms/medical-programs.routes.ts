import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../core/auth/models/permissions.map';
import { PermissionGuard } from '../../core/guards/permission.guard';

export const MedicalProgramsRoutes: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.MedicalPrograms.VIEW },
    loadComponent: () =>
      import(
        './Pages/main-medical-programs-page/main-medical-programs-page.component'
      ).then((m) => m.MainMedicalProgramsPageComponent),

    children: [
      {
        path: 'view/:medicalProgramId',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.MedicalPrograms.CREATE },
        loadComponent: () =>
          import(
            './Pages/medical-programs-work-space/medical-programs-work-space.component'
          ).then((m) => m.MedicalProgramsWorkSpaceComponent),
      },
    ],
  },

  {
    path: '',
    redirectTo: 'medical-programs',
    pathMatch: 'full',
  },
];
