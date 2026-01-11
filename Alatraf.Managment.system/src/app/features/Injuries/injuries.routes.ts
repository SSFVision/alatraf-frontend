import { Routes } from '@angular/router';
import { WorkspaceWelcomeComponent } from '../../shared/components/workspace-welcome/workspace-welcome.component';

export const InjuriesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./Pages/main-injuries-page/main-injuries-page.component').then(
        (m) => m.MainInjuriesPageComponent
      ),
    children: [
      {
        path: '',
        component: WorkspaceWelcomeComponent,
        data: {
          title: 'مرحباً بك في إدارة الإصابات',
          subtitle: 'اختر نوع/جهة/سبب إصابة من القوائم، أو ابدأ بالإنشاء',
        },
      },

     
      {
        path: 'types/create',
        loadComponent: () =>
          import(
            './Pages/injury-types-add-edit/injury-types-add-edit.component'
          ).then((m) => m.InjuryTypesAddEditComponent),
      },
      {
        path: 'types/edit/:id',
        loadComponent: () =>
          import(
            './Pages/injury-types-add-edit/injury-types-add-edit.component'
          ).then((m) => m.InjuryTypesAddEditComponent),
      },

     
      {
        path: 'sides/create',
        loadComponent: () =>
          import(
            './Pages/injury-sides-add-edit/injury-sides-add-edit.component'
          ).then((m) => m.InjurySidesAddEditComponent),
      },
      {
        path: 'sides/edit/:id',
        loadComponent: () =>
          import(
            './Pages/injury-sides-add-edit/injury-sides-add-edit.component'
          ).then((m) => m.InjurySidesAddEditComponent),
      },

    
      {
        path: 'reasons/create',
        loadComponent: () =>
          import(
            './Pages/injury-reasons-add-edit/injury-reasons-add-edit.component'
          ).then((m) => m.InjuryReasonsAddEditComponent),
      },
      {
        path: 'reasons/edit/:id',
        loadComponent: () =>
          import(
            './Pages/injury-reasons-add-edit/injury-reasons-add-edit.component'
          ).then((m) => m.InjuryReasonsAddEditComponent),
      },
    ],
  },

];
