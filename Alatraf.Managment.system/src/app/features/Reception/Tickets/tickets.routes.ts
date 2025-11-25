import { Routes } from '@angular/router';

export const TicketsRoutes: Routes = [
  {
    path: 'create/:patientId',

    loadComponent: () =>
      import('../Tickets/Pages/create-ticket/create-ticket.component').then(
        (m) => m.CreateTicketComponent
      ),
  },
];
