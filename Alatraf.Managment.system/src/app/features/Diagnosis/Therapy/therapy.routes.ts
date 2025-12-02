import { Routes } from '@angular/router';

export const TherapyRoutes: Routes = [
  {
    
    path: 'create/:patientId',
    
    loadComponent: () =>
      import(
        './Pages/therapy-diagnosis-workspace/therapy-diagnosis-workspace.component'
      ).then((m) => m.TherapyDiagnosisWorkspaceComponent),
  },
];
