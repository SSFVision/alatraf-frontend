import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../core/auth/Roles/permissions.map';
import { PermissionGuard } from '../../core/guards/permission.guard';
import { WorkspaceWelcomeComponent } from '../../shared/components/workspace-welcome/workspace-welcome.component';

export const AppointmentRoutes: Routes = [
  {
    path: 'waiting-patients',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.Appointment.READ },
    loadComponent: () =>
      import(
        './Pages/main-apointment-waiting-patient/main-apointment-waiting-patient.component'
      ).then((m) => m.MainApointmentWaitingPatientComponent),
    children: [
      {
        path: '',
        component: WorkspaceWelcomeComponent,
        data: {
          title: 'مرحباً بك في   قائمة الإنتظار لجدولة المواعيد',
          subtitle: 'اختر مريض من القائمة',
        },
      },

      {
        path: 'schedule/:ticketId/patient/:patientId',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.Appointment.CREATE },
        loadComponent: () =>
          import(
            './Pages/schedule-new-appointment/schedule-new-appointment.component'
          ).then((m) => m.ScheduleNewAppointmentComponent),
      },
    ],
  },
  {
    path: 'manage',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.Appointment.READ },
    loadComponent: () =>
      import('./Pages/manage-appointments/manage-appointments.component').then(
        (m) => m.ManageAppointmentsComponent
      ),
    children: [
      {
        path: '',
        component: WorkspaceWelcomeComponent,
        data: {
          title: 'قائمة إدارة المواعيد',
          subtitle: 'إدارة المواعيد المجدولة',
        },
      },
      {
        path: 'change-status/:appointmentId',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.Appointment.CHANGE_STATUS },
        loadComponent: () =>
          import(
            './Pages/change-appointment-status/change-appointment-status.component'
          ).then((m) => m.ChangeAppointmentStatusComponent),
      },
      {
        path: 'holiday',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.Holiday.READ },
        loadChildren: () =>
          import('../Holidays/holidays.routes').then((m) => m.HolidaysRoutes),
      },
    ],
  },
];
