import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../core/auth/Roles/permissions.map';
import { PermissionGuard } from '../../core/guards/permission.guard';
import { WorkspaceWelcomeComponent } from '../../shared/components/workspace-welcome/workspace-welcome.component';

export const TherapyCardsRoutes: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.TherapyCard.READ },
    loadComponent: () =>
      import(
        './Pages/main-therapy-patients-wating-list/main-therapy-patients-wating-list.component'
      ).then((m) => m.MainTherapyPatientsWatingListComponent),

    children: [
    
{
        path: '',
        component: WorkspaceWelcomeComponent,
        data: {
          title: 'مرحباً بك في إدارة التشخيص والعلاج',
          subtitle: ' اختر بطاقة علاج من قائمة الانتظار المدفوعة للبدء في الجلسات',
        },
      },

      {
        path: ':therapyCardId/sessions/create',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.TherapyCard.CREATE },
        loadComponent: () =>
          import('./Pages/sessions-mangment/sessions-mangment.component').then(
            (m) => m.SessionsManagementComponent
          ),
      },
      {
        path: 'doctors/:doctorSectionRoomId/assigments',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.TherapyCard.READ_SESSION },
        loadComponent: () =>
          import(
            './Pages/therapist-doctor-assigments/therapist-doctor-assigments.component'
          ).then((m) => m.TherapistDoctorAssigmentsComponent),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'therapy-cards',
    pathMatch: 'full',
  },
  // {
  //   path: ':cardId',
  //   canActivate: [PermissionGuard],
  //   data: { permission: PERMISSIONS.TherapyCards.VIEW },
  //   loadComponent: () =>
  //     import(
  //       './Pages/therapy-card-details/therapy-card-details.component'
  //     ).then((m) => m.TherapyCardDetailsComponent),
  // },

  // {
  //   path: ':cardId/sessions',
  //   canActivate: [PermissionGuard],
  //   data: { permission: PERMISSIONS.TherapySessions.VIEW },
  //   loadComponent: () =>
  //     import(
  //       './Pages/therapy-sessions/therapy-sessions-list.component'
  //     ).then((m) => m.TherapySessionsListComponent),
  // },

  // {
  //   path: ':cardId/sessions/create',
  //   canActivate: [PermissionGuard],
  //   data: { permission: PERMISSIONS.TherapySessions.CREATE },
  //   loadComponent: () =>
  //     import(
  //       './Pages/therapy-sessions/create-therapy-session.component'
  //     ).then((m) => m.CreateTherapySessionComponent),
  // },

  // {
  //   path: ':cardId/sessions/edit/:sessionId',
  //   canActivate: [PermissionGuard],
  //   data: { permission: PERMISSIONS.TherapySessions.EDIT },
  //   loadComponent: () =>
  //     import(
  //       './Pages/therapy-sessions/edit-therapy-session.component'
  //     ).then((m) => m.EditTherapySessionComponent),
  // },

  // {
  //   path: ':cardId/doctors',
  //   canActivate: [PermissionGuard],
  //   data: { permission: PERMISSIONS.TherapyCards.AssignDoctors },
  //   loadComponent: () =>
  //     import(
  //       './Pages/assign-doctors/assign-doctors.component'
  //     ).then((m) => m.AssignDoctorsComponent),
  // },
];
