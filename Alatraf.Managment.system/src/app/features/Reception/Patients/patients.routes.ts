import { Routes } from '@angular/router';

export const PatientsRoutes: Routes = [
  {
    path: 'view/:patientId',

    loadComponent: () =>
      import('../Tickets/Pages/create-ticket/create-ticket.component').then(
        (m) => m.CreateTicketComponent
      ),
  },
  {
    path: 'add',
    loadComponent: () =>
      import(
        '../Patients/Pages/patient-add-edit-page/patient-add-edit-page.component'
      ).then((m) => m.PatientAddEditPageComponent),
  },
  {
    path: 'edit/:patientId',
    loadComponent: () =>
      import(
        '../Patients/Pages/patient-add-edit-page/patient-add-edit-page.component'
      ).then((m) => m.PatientAddEditPageComponent),
  },
];
