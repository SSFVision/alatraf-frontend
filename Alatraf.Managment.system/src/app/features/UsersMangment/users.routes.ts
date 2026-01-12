import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../core/auth/Roles/permissions.map';
import { PermissionGuard } from '../../core/guards/permission.guard';
import { WorkspaceWelcomeComponent } from '../../shared/components/workspace-welcome/workspace-welcome.component';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.User.READ },
    loadComponent: () =>
      import('./Pages/main-user-page/main-user-page.component').then(
        (m) => m.MainUserPageComponent
      ),
    children: [
      {
        path: '',
        component: WorkspaceWelcomeComponent,
        data: {
          title: 'مرحباً بك في   إدارة المستخدمين',
          subtitle: 'اختر المستخدم من القائمة أو أضف مستخدم جديد',
        },
      },

      {
        path: 'create',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.User.CREATE },
        loadComponent: () =>
          import('./Pages/add-new-user-page/add-new-user-page.component').then(
            (m) => m.AddNewUserPageComponent
          ),
      },
      {
        path: 'edit/:userId',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.User.UPDATE },
        loadComponent: () =>
          import(
            './Pages/user-workspace-page/user-workspace-page.component'
          ).then((m) => m.UserWorkspacePageComponent),
      },
      {
        path: 'change-credentials/:userId',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.User.UPDATE },
        loadComponent: () =>
          import(
            './Pages/change-credentials/change-credentials.component'
          ).then((m) => m.ChangeCredentialsComponent),
      },
      {
        path: 'reset-password/:userId',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.User.UPDATE },
        loadComponent: () =>
          import('./Pages/reset-password/reset-password.component').then(
            (m) => m.ResetPasswordComponent
          ),
      },
      {
        path: 'assign-role/:userId',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.User.ASSIGN_ROLES },
        loadComponent: () =>
          import('./Pages/user-role-assign/user-role-assign.component').then(
            (m) => m.UserRoleAssignComponent
          ),
      },
    ],
  },
];
