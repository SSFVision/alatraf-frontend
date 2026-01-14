import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../core/auth/Roles/permissions.map';
import { PermissionGuard } from '../../core/guards/permission.guard';
import { WorkspaceWelcomeComponent } from '../../shared/components/workspace-welcome/workspace-welcome.component';

export const IndustrialPartsRoutes: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.IndustrialPart.READ },
    loadComponent: () =>
      import(
        './Pages/main-industrial-parts-page/main-industrial-parts-page.component'
      ).then((m) => m.MainIndustrialPartsPageComponent),

    children: [
      {
        path: '',
        component: WorkspaceWelcomeComponent,
        data: {
          title: 'مرحباً بك في   قائمة الإنتظار  ',
          subtitle: 'اختر  من القائمة',
        },
      },
      {
        path: 'create',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.IndustrialPart.CREATE },
        loadComponent: () =>
          import(
            './Pages/industrial-part-worke-space-view-page.component/industrial-part-worke-space-view-page.component.component'
          ).then((m) => m.IndustrialPartWorkeSpaceViewPageComponentComponent),
      },

      {
        path: 'edit/:industrialPartId',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.IndustrialPart.UPDATE },
        loadComponent: () =>
          import(
            './Pages/industrial-part-worke-space-view-page.component/industrial-part-worke-space-view-page.component.component'
          ).then((m) => m.IndustrialPartWorkeSpaceViewPageComponentComponent),
      },
      {
        path: 'units',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.IndustrialPart.READ },
        loadChildren: () =>
          import('../Inventory/Units/units.routes').then((m) => m.UnitsRoutes),
      },
    ],
  },
  // {
  //   path: '',
  //   redirectTo: 'industrial-parts',
  //   pathMatch: 'full',
  // },
];
