import { Routes } from '@angular/router';

export const PatientsRoutes: Routes = [
  {
    path: 'view/:patientId',

    loadComponent: () =>
      import('./Pages/show-patient-details/show-patient-details.component').then(
        (m) => m.ShowPatientDetailsComponent
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
