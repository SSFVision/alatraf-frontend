import { Routes } from '@angular/router';
import { AppRoutes } from './core/routing/app.routes.map';
import { AuthLayoutComponent } from './core/Layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './core/Layouts/main-layout/main-layout.component';
import { AuthGuard } from './core/guards/auth.guard';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: AppRoutes.auth.login, // 'auth/login'
    pathMatch: 'full',
  },

  {
    path: AppRoutes.auth.root, // 'auth'
    component: AuthLayoutComponent,

    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/Auth/auth.routes').then((m) => m.AuthRoutes),
      },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: AppRoutes.dashboard.root,
        loadChildren: () =>
          import('./features/Dashboard/dashboard.routes').then(
            (m) => m.DASHBOARD_ROUTES
          ),
      },
      {
        path: AppRoutes.users.root,
        loadChildren: () =>
          import('./features/UsersMangment/users.routes').then(
            (m) => m.USERS_ROUTES
          ),
      },
      {
        path: AppRoutes.reception.root, //
        loadChildren: () =>
          import('./features/Reception/registration.routes').then(
            (m) => m.ReceptionRoutes
          ),
      },
      {
        path: AppRoutes.diagnosis.root,
        loadChildren: () =>
          import('./features/Diagnosis/diagnosis.routes').then(
            (m) => m.DiagnosisRoutes
          ),
      },
      {
        path: AppRoutes.finance.root,
        loadChildren: () =>
          import('./features/Pyments/payments.route').then(
            (m) => m.PaymentsRoutes
          ),
      },
      {
        path: AppRoutes.Appointment.root,
        loadChildren: () =>
          import('./features/Appointments/appointments.route').then(
            (m) => m.AppointmentRoutes
          ),
      },

      {
        path: AppRoutes.therapyCards.root,
        loadChildren: () =>
          import('./features/TherapyCards/therapy-cards.routes').then(
            (m) => m.TherapyCardsRoutes
          ),
      },
      {
        path: AppRoutes.repairCards.root,
        loadChildren: () =>
          import('./features/RepairCards/repairCards.routes').then(
            (m) => m.RepairCardsRoutes
          ),
      },
      {
        path: AppRoutes.medicalPrograms.root,
        loadChildren: () =>
          import('./features/MedicalPrograms/medical-programs.routes').then(
            (m) => m.MedicalProgramsRoutes
          ),
      },
      {
        path: AppRoutes.industrialParts.root,
        loadChildren: () =>
          import('./features/IndustrialParts/industrial-parts.routes').then(
            (m) => m.IndustrialPartsRoutes
          ),
      },
      {
        path: AppRoutes.sections.root,
        loadChildren: () =>
          import('./features/Organization/Sections/sections.routes').then(
            (m) => m.SectionsRoutes
          ),
      },
      {
        path: AppRoutes.services.root,
        loadChildren: () =>
          import('./features/Organization/Services/services.routes').then(
            (m) => m.ServicesRoutes
          ),
      },
      {
        path: AppRoutes.injuries.root,
        loadChildren: () =>
          import('./features/Injuries/injuries.routes').then(
            (m) => m.InjuriesRoutes
          ),
      },
      {
        path: AppRoutes.doctors.root,
        loadChildren: () =>
          import('./features/Organization/Doctors/doctors.routes').then(
            (m) => m.DoctorsRoutes
          ),
      },
      {
        path: AppRoutes.patientCards.root,
        loadChildren: () =>
          import('./features/PatientsCard/patient-cards.routes').then(
            (m) => m.PATIENT_CARDS_ROUTES
          ),
      },
    ],
  },
  {
    path: AppRoutes.system.unauthorized,
    loadComponent: () =>
      import(
        './features/System/Pages/unauthorized/unauthorized.component'
      ).then((m) => m.UnauthorizedComponent),
  },
  {
    path: '**',
    redirectTo: AppRoutes.auth.login,
  },
];
