import { Routes } from '@angular/router';

export const IndustrialRoutes: Routes = [
  {
    path: 'Patient/:patientId/create',

    loadComponent: () =>
      import(
        './pages/industrial-diagnosis-workspace/industrial-diagnosis-workspace.component'
      ).then((m) => m.IndustrialDiagnosisWorkspaceComponent),
  },
];
