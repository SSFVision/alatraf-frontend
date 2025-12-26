import { Routes } from '@angular/router';

export const PATIENT_CARDS_ROUTES: Routes = [
  // {
  //   path: 'wounded',
  //   loadComponent: () =>
  //     import('./pages/wounded-cards-page/wounded-cards-page.component').then(
  //       (c) => c.WoundedCardsPageComponent
  //     ),
  //   children: [
  //     {
  //       path: 'edit/:woundedCardId',
  //       loadComponent: () =>
  //         import(
  //           './workspace/wounded/wounded-card-workspace/wounded-card-workspace.component'
  //         ).then((c) => c.WoundedCardWorkspaceComponent),
  //     },
  //   ],
  // },
  {
    path: 'disabled',
    loadComponent: () =>
      import('./pages/disabled-cards-page/disabled-cards-page.component').then(
        (c) => c.DisabledCardsPageComponent
      ),
    children: [
      {
        path: 'create',
        loadComponent: () =>
          import(
            './workspace/disabled/disabled-card-workspace/disabled-card-workspace.component'
          ).then((c) => c.DisabledCardWorkspaceComponent),
      },
      {
        path: 'edit/:disabledCardId',
        loadComponent: () =>
          import(
            './workspace/disabled/disabled-card-workspace/disabled-card-workspace.component'
          ).then((c) => c.DisabledCardWorkspaceComponent),
      },
    ],
  },
];
