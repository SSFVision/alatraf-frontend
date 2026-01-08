import { Routes } from '@angular/router';

import { HolidayWorkspaceComponent } from './Pages/holiday-workspace/holiday-workspace.component';

export const HolidaysRoutes: Routes = [
  {
    path: '',
    component: HolidayWorkspaceComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'add' },
      {
        path: 'add',
        loadComponent: () =>
          import('./Pages/add-new-holiday/add-new-holiday.component').then(
            (m) => m.AddNewHolidayComponent
          ),
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./Pages/holiday-list/holiday-list.component').then(
            (m) => m.HolidayListComponent
          ),
      },
    ],
  },
];
