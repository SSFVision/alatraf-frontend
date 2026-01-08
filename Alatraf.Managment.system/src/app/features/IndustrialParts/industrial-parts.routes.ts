import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../core/auth/Roles/permissions.map';
import { PermissionGuard } from '../../core/guards/permission.guard';

export const IndustrialPartsRoutes: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.IndustrialParts.VIEW },
    loadComponent: () =>
      import(
        './Pages/main-industrial-parts-page/main-industrial-parts-page.component'
      ).then((m) => m.MainIndustrialPartsPageComponent),

    children: [
      {
        path: 'create',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.IndustrialParts.CREATE },
        loadComponent: () =>
          import(
            './Pages/industrial-part-worke-space-view-page.component/industrial-part-worke-space-view-page.component.component'
          ).then((m) => m.IndustrialPartWorkeSpaceViewPageComponentComponent),
      },

      {
        path: 'edit/:industrialPartId',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.IndustrialParts.UPDATE },
        loadComponent: () =>
          import(
            './Pages/industrial-part-worke-space-view-page.component/industrial-part-worke-space-view-page.component.component'
          ).then((m) => m.IndustrialPartWorkeSpaceViewPageComponentComponent),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'industrial-parts',
    pathMatch: 'full',
  },
];
