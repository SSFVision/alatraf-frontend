import { Routes } from '@angular/router';
import { PERMISSIONS } from '../../core/auth/Roles/permissions.map';
import { PermissionGuard } from '../../core/guards/permission.guard';
import { WorkspaceWelcomeComponent } from '../../shared/components/workspace-welcome/workspace-welcome.component';

export const REPORTS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.Patient.READ },
    loadComponent: () =>
      import('./pages/main-reports-page/main-reports-page.component').then(
        (m) => m.MainReportsPageComponent
      ),
    children: [
      {
        path: '',
        component: WorkspaceWelcomeComponent,
        data: {
          title: 'مرحباً بك في   إدارة التقارير',
          subtitle: 'اختر التقرير من القائمة    ',
        },
      },
      {
        path: 'therapy-diagnosis-reports',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.TherapyCard.READ },
        loadComponent: () =>
          import(
            './pages/therpay-diagnosis-reports/therpay-diagnosis-reports.component'
          ).then((m) => m.TherpayDiagnosisReportsComponent),
      },
    ],
  },
];
