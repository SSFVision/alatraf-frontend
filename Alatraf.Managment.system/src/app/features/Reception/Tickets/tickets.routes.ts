import { Routes } from '@angular/router';
import { PermissionGuard } from '../../../core/guards/permission.guard';
import { PERMISSIONS } from '../../../core/auth/Roles/permissions.map';

export const TicketsRoutes: Routes = [
  {
    path: 'create/:patientId',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.TICKETS.ADD },
    loadComponent: () =>
      import('../Tickets/Pages/create-ticket/create-ticket.component').then(
        (m) => m.CreateTicketComponent
      ),
  },
];
