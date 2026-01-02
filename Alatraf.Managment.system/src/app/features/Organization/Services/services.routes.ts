import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../../core/auth/models/permissions.map';
import { PermissionGuard } from '../../../core/guards/permission.guard';
import { WorkspaceWelcomeComponent } from '../../../shared/components/workspace-welcome/workspace-welcome.component';

export const ServicesRoutes: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.Services.VIEW },
    loadComponent: () =>
      import('./pages/main-services-page/main-services-page.component').then(
        (m) => m.MainServicesPageComponent
      ),

    children: [
      {
        path: '',
        component: WorkspaceWelcomeComponent,
        data: {
          title: 'مرحباً بك في   إدارة الخدمات',
          subtitle: 'اختر خدمة من القائمة أو أضف خدمة جديدة',
        },
      },
      {
        path: 'create',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.Services.CREATE },
        loadComponent: () =>
          import(
            './pages/services-workspace/services-workspace.component'
          ).then((m) => m.ServicesWorkspaceComponent),
      },
      {
        path: 'edit/:serviceId',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.Services.EDIT },
        loadComponent: () =>
          import(
            './pages/services-workspace/services-workspace.component'
          ).then((m) => m.ServicesWorkspaceComponent),
      },
    ],
  },

  {
    path: '',
    redirectTo: 'services',
    pathMatch: 'full',
  },
];
