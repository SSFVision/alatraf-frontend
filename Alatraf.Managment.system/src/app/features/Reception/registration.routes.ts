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
  //  {
  //   path: 'patients',
  //   loadChildren: () =>
  //     import('./Patients/patients.routes').then(m => m.PatientsRoutes),
  // },

  { path: '', redirectTo: 'patients', pathMatch: 'full' },
];
