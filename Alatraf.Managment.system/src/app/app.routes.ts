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
        path: AppRoutes.reception.root, // 'reception'
        loadChildren: () =>
          import('./features/Reception/registration.routes').then(
            (m) => m.ReceptionRoutes
          ),
      },

      // You’ll add doctor/admin/finance here later
      // {
      //   path: AppRoutes.doctor.root,
      //   loadChildren: () => import('./features/Doctor/doctor.routes')
      //     .then(m => m.DoctorRoutes),
      // },
    ],
  },

  {
    path: '**',
    redirectTo: AppRoutes.auth.login,
  },
];
