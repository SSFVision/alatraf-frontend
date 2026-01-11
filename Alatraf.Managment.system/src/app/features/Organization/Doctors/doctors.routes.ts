import { DoctorAssigmentsPageComponent } from './Pages/doctor-assigments-page/doctor-assigments-page.component';
import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../../core/auth/Roles/permissions.map';
import { PermissionGuard } from '../../../core/guards/permission.guard';
import { WorkspaceWelcomeComponent } from '../../../shared/components/workspace-welcome/workspace-welcome.component';

export const DoctorsRoutes: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.Doctor.READ },
    loadComponent: () =>
      import('./Pages/main-doctor-page/main-doctor-page.component').then(
        (m) => m.MainDoctorPageComponent
      ),

    children: [
      {
        path: '',
        component: WorkspaceWelcomeComponent,
        data: {
          title: 'مرحباً بك في   إدارة الأطباء',
          subtitle: 'اختر طبيب من القائمة أو أضف طبيب جديدة',
        },
      },
      {
        path: 'edit/:doctorId',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.Doctor.UPDATE },
        loadComponent: () =>
          import(
            './Pages/doctor-workspace-page/doctor-workspace-page.component'
          ).then((m) => m.DoctorWorkspacePageComponent),
      },
      {
        path: 'create',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.Doctor.CREATE },
        loadComponent: () =>
          import(
            './Pages/doctor-workspace-page/doctor-workspace-page.component'
          ).then((m) => m.DoctorWorkspacePageComponent),
      },
      {
        path: 'assign/:doctorId',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.Doctor.READ },
        loadComponent: () =>
          import(
            './Pages/doctor-assigments-page/doctor-assigments-page.component'
          ).then((m) => m.DoctorAssigmentsPageComponent),
      },
    ],
  },

  {
    path: '',
    redirectTo: 'doctors',
    pathMatch: 'full',
  },
];
