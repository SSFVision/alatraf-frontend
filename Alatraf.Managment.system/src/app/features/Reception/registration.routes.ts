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
    path: 'patients/select',
    loadComponent: () =>
      import(
        './Patients/Pages/patient-select-page/patient-select-page.component'
      ).then((m) => m.PatientSelectPageComponent),
  },
  {
    path: 'tickets',
    loadChildren: () =>
      import('./Tickets/tickets.routes').then((m) => m.TicketsRoutes),
  },

  { path: '', redirectTo: 'patients', pathMatch: 'full' },
];
