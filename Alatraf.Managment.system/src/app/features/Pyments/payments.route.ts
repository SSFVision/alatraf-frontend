import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../core/auth/models/permissions.map';
import { PermissionGuard } from '../../core/guards/permission.guard';

export const PaymentsRoutes: Routes = [
  {
    path: 'payments',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.PAYMENTS.VIEW },
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './Pages/main-payment-waiting-list/main-payment-waiting-list.component'
          ).then((m) => m.MainPaymentWaitingListComponent)

        // children: TherapyRoutes,
      },
    ],
  },

 
];
