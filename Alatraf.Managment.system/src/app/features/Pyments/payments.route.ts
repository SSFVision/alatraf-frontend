import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../core/auth/Roles/permissions.map';
import { PermissionGuard } from '../../core/guards/permission.guard';

export const PaymentsRoutes: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.PAYMENTS.VIEW },
    loadComponent: () =>
      import(
        './Pages/main-payment-waiting-list/main-payment-waiting-list.component'
      ).then((m) => m.MainPaymentWaitingListComponent),

    children: [
      {
        path: 'paid/:paymentId/:paymentReference',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.PAYMENTS.ADD },
        loadComponent: () =>
          import('./Pages/paied-page/paied-page.component').then(
            (m) => m.PaiedPageComponent
          ),
      },
    ],
  },

  {
    path: '',
    redirectTo: 'payments',
    pathMatch: 'full',
  },
];
