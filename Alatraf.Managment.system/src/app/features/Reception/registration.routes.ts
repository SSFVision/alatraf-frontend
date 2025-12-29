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
    path: 'patients-add',
    loadComponent: () =>
      import('./Patients/Pages/patient-add-edit-page/patient-add-edit-page.component')
        .then(m => m.PatientAddEditPageComponent),
  },
  {
    path: 'patients-edit/:patientId',
    loadComponent: () =>
      import('./Patients/Pages/patient-add-edit-page/patient-add-edit-page.component')
        .then(m => m.PatientAddEditPageComponent),
  },
  {
    path: 'tickets',
    loadChildren: () =>
      import('./Tickets/tickets.routes').then((m) => m.TicketsRoutes),
  },

  { path: '', redirectTo: 'patients', pathMatch: 'full' },
];
