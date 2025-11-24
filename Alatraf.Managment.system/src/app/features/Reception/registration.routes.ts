import { Routes } from '@angular/router';
import { PatientsRoutes } from './Patients/patients.routes';

export const ReceptionRoutes: Routes = [
  {
    path: 'patients',
    loadComponent: () =>
      import('./Patients/Pages/patients.page/patients.page.component').then(
        (m) => m.PatientsPageComponent
      ),
    children: PatientsRoutes,
  },
  {
    path: 'tickets',
    loadChildren: () =>
      import('./Tickets/tickets.routes').then((m) => m.TicketsRoutes),
  },

  { path: '', redirectTo: 'patients', pathMatch: 'full' },
];
