import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../core/auth/models/permissions.map';
import { PermissionGuard } from '../../core/guards/permission.guard';

export const AppointmentRoutes: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.Appointment.VIEW },
    loadComponent: () =>
      import(
        './Pages/main-apointment-waiting-patient/main-apointment-waiting-patient.component'
      ).then((m) => m.MainApointmentWaitingPatientComponent),
    children: [
      {
        path: 'schedule/:patientId',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.Appointment.ReSchedule },
        loadComponent: () =>
          import(
            './Pages/schedule-new-appointment/schedule-new-appointment.component'
          ).then((m) => m.ScheduleNewAppointmentComponent),
      },
    ],
  },
  
  {
    path: '',
    redirectTo: 'appointments',
    pathMatch: 'full',
  },
  // {
  //   path: 'new/holiday',
  //   canActivate: [PermissionGuard],
  //   data: { permission: PERMISSIONS.Appointment.AddHoliday },
  //   loadComponent: () =>
  //     import('./Pages/add-new-holiday/add-new-holiday.component').then(
  //       (m) => m.AddNewHolidayComponent
  //     ),
  // },

 
];
