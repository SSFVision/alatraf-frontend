import { Routes } from '@angular/router';

export const IndustrialRoutes: Routes = [
  {
    path: 'create/:patientId',

    loadComponent: () =>
      import(
        './pages/industrial-diagnosis-workspace/industrial-diagnosis-workspace.component'
      ).then((m) => m.IndustrialDiagnosisWorkspaceComponent),
  },
];
