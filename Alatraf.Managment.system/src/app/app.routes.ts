import { Routes } from '@angular/router';
import { AppRoutes } from './core/routing/app.routes.map';
import { AuthLayoutComponent } from './core/Layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './core/Layouts/main-layout/main-layout.component';

// export const APP_ROUTES: Routes = [
//   {
//     path: 'registration',
//     loadChildren: () =>
//       import('./features/Reception/registration.routes').then(
//         (m) => m.ReceptionRoutes
//       ),
//   },
//   {
//     path: '',
//     redirectTo: 'registration',
//     pathMatch: 'full',
//   },
// ];


// export const APP_ROUTES: Routes = [
//   {
//     path: AppRoutes.auth.root, // 'auth'
//     component: AuthLayoutComponent,
//     children: [
//       {
//         path: '',
//         loadChildren: () =>
//           import('./features/Auth/auth.routes').then((m) => m.AuthRoutes),
//       },
//     ],
//   },

  // {
  //   path: AppRoutes.reception.root,
  //   component: MainLayoutComponent,

  //   loadChildren: () =>
  //     import('./features/Reception/registration.routes').then(
  //       (m) => m.ReceptionRoutes
  //     ),
  // },

//   // =========================================================
//   // SYSTEM PAGES (UNAUTHORIZED + 404)
//   // =========================================================
//   // {
//   //   path: AppRoutes.system.unauthorized,
//   //   loadComponent: () =>
//   //     import('./core/pages/unauthorized.page').then(m => m.UnauthorizedPage),
//   // },

//   // {
//   //   path: AppRoutes.system.notFound,
//   //   loadComponent: () =>
//   //     import('./core/pages/not-found.page').then(m => m.NotFoundPage),
//   // },

//   {
//     path: '',
//     redirectTo: AppRoutes.auth.login, // 'auth/login'
//     pathMatch: 'full',
//   },

//   // Any wrong URL → 404
//   // {
//   //   path: '**',
//   //   redirectTo: AppRoutes.system.notFound,
//   // },
// ];

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
    redirectTo: AppRoutes.system.notFound,
  },
];
