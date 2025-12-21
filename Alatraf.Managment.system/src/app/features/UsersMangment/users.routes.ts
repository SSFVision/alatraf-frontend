import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../core/auth/models/permissions.map';
import { PermissionGuard } from '../../core/guards/permission.guard';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.Users.VIEW },
    loadComponent: () =>
      import('./Pages/main-user-page/main-user-page.component').then(
        (m) => m.MainUserPageComponent
      ),
       children: [
      {
        path: 'create',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.Users.CREATE },
        loadComponent: () =>
          import(
            './Pages/user-workspace-page/user-workspace-page.component'
          ).then((m) => m.UserWorkspacePageComponent),
      },
      {
        path: 'edit/:userId',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.Users.EDIT },
        loadComponent: () =>
         import(
            './Pages/user-workspace-page/user-workspace-page.component'
          ).then((m) => m.UserWorkspacePageComponent),
      },
    ],
  },
];
