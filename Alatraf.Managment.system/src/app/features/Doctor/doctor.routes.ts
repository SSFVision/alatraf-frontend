import { Routes } from '@angular/router';

export const DoctorRoutes: Routes = [
  {
    path: 'diagnosis',
    loadComponent: () =>
      import('./Diagnosis/Pages/main-page-layout/main-page-layout.component')
        .then(m => m.MainPageLayoutComponent),
    children: [
      // {
      //   path: '',
      //   loadComponent: () =>
      //     import('./Diagnosis/Pages/diagnosis-list/diagnosis-list.component')
      //       .then(m => m.DiagnosisListComponent)
      // },
      // {
      //   path: 'create/:patientId',
      //   loadComponent: () =>
      //     import('./Diagnosis/Pages/diagnosis-create/diagnosis-create.component')
      //       .then(m => m.DiagnosisCreateComponent)
      // },
      // {
      //   path: 'view/:diagnosisId',
      //   loadComponent: () =>
      //     import('./Diagnosis/Pages/diagnosis-view/diagnosis-view.component')
      //       .then(m => m.DiagnosisViewComponent)
      // }
    ]
  },

  {
    path: '',
    redirectTo: 'diagnosis',
    pathMatch: 'full'
  }
];
