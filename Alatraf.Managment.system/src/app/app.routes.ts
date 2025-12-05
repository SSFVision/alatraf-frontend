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
