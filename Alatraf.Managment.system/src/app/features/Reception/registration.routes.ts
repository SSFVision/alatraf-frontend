import { Routes } from '@angular/router';

export const ReceptionRoutes: Routes = [
  {
    path: 'patients',
    loadComponent: () =>
      import('./Patients/Pages/patients.page/patients.page.component').then(
        (m) => m.PatientsPageComponent
      ),
    children: [
      {
        path: 'view/:patientId',
        // loadComponent: () =>
        //   import('./Patients/components/patient-summary-card/patient-summary-card.component').then(
        //     (m) => m.PatientSummaryCardComponent
        //   ),
        loadComponent: () =>
          import('./Tickets/Pages/create-ticket/create-ticket.component').then(
            (m) => m.CreateTicketComponent
          ),
      },
      {
        path: 'add',
        loadComponent: () =>
          import(
            './Patients/Pages/patient-add-edit-page/patient-add-edit-page.component'
          ).then((m) => m.PatientAddEditPageComponent),
      },
      {
        path: 'edit/:patientId',
        loadComponent: () =>
          import(
            './Patients/Pages/patient-add-edit-page/patient-add-edit-page.component'
          ).then((m) => m.PatientAddEditPageComponent),
      },
    ],
  },

  { path: '', redirectTo: 'patients', pathMatch: 'full' },
];
