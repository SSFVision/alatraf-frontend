import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../../core/auth/Roles/permissions.map';
import { PermissionGuard } from '../../../core/guards/permission.guard';

export const UnitsRoutes: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.Unit.READ },
    loadComponent: () =>
      import('./Pages/unit-workspace/unit-workspace.component').then(
        (m) => m.UnitWorkspaceComponent
      ),

    children: [
      { path: '', pathMatch: 'full', redirectTo: 'create' },

      {
        path: 'create',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.Unit.CREATE },
        loadComponent: () =>
          import('./Pages/add-edit-units/add-edit-units.component').then(
            (m) => m.AddEditUnitsComponent
          ),
      },
      {
        path: 'edit/:unitId',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.Unit.UPDATE },
        loadComponent: () =>
          import('./Pages/add-edit-units/add-edit-units.component').then(
            (m) => m.AddEditUnitsComponent
          ),
      },
          {
        path: 'list',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.Unit.UPDATE },
        loadComponent: () =>
          import('./Pages/list-units/list-units.component').then(
            (m) => m.ListUnitsComponent
          ),
      },
    ],
  },
];
