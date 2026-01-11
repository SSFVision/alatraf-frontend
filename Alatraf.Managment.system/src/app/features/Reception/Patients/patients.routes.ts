import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../../core/auth/Roles/permissions.map';
import { PermissionGuard } from '../../../core/guards/permission.guard';

export const PatientsRoutes: Routes = [
  {
    path: 'view/:patientId',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.Patient.READ },
    loadComponent: () =>
      import(
        './Pages/show-patient-details/show-patient-details.component'
      ).then((m) => m.ShowPatientDetailsComponent),
  },
  {
    path: 'add',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.Patient.CREATE },
    loadComponent: () =>
      import(
        '../Patients/Pages/patient-add-edit-page/patient-add-edit-page.component'
      ).then((m) => m.PatientAddEditPageComponent),
  },
  {
    path: 'edit/:patientId',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.Patient.UPDATE },
    loadComponent: () =>
      import(
        '../Patients/Pages/patient-add-edit-page/patient-add-edit-page.component'
      ).then((m) => m.PatientAddEditPageComponent),
  },
];
