import { Routes } from '@angular/router';

export const AuthRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./Pages/login/login.component').then(m => m.LoginComponent),
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  }
];
