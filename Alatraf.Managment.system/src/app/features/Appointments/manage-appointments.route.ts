import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../core/auth/models/permissions.map';
import { PermissionGuard } from '../../core/guards/permission.guard';
import { WorkspaceWelcomeComponent } from '../../shared/components/workspace-welcome/workspace-welcome.component';

export const ManageAppointmentRoutes: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.Appointment.VIEW },
    loadComponent: () =>
      import('./Pages/manage-appointments/manage-appointments.component').then(
        (m) => m.ManageAppointmentsComponent
      ),
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
        path: 'changeStauts/:appointmentId',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.Appointment.VIEW },
        loadComponent: () =>
          import(
            './Pages/change-appointment-status/change-appointment-status.component'
          ).then((m) => m.ChangeAppointmentStatusComponent),
      },
      
      {
        path: 'new/holiday',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.Appointment.AddHoliday },
        loadComponent: () =>
          import('./Pages/add-new-holiday/add-new-holiday.component').then(
            (m) => m.AddNewHolidayComponent
          ),
      },
    ],
  },
];
