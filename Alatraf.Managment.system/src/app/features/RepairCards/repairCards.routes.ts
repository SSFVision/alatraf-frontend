import { Routes } from '@angular/router';
import { PermissionGuard } from '../../core/guards/permission.guard';
import { PERMISSIONS } from '../../core/auth/models/permissions.map';

export const RepairCardsRoutes: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard],
    data: { permission: PERMISSIONS.REPAIR_CARDS.VIEW },
    loadComponent: () =>
      import(
        './Pages/main-repair-cards-waiting-list/main-repair-cards-waiting-list.component'
      ).then((m) => m.MainRepairCardsWaitingListComponent),

    children: [
      {
        path: ':repairCardId/assignments/assign-parts',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.REPAIR_CARDS.ASSIGN_INDUSTRIAL_PARTS },
        loadComponent: () =>
          import(
            './Pages/repair-card-assignments-workspace/repair-card-assignments-workspace.component'
          ).then((m) => m.RepairCardAssignmentsWorkspaceComponent),
      },
      {
        path: 'doctors/:doctorId',
        canActivate: [PermissionGuard],
        data: { permission: PERMISSIONS.Doctors.VIEW },
        loadComponent: () =>
          import(
            '../Organization/Doctors/Pages/doctor-workspace-page/doctor-workspace-page.component'
          ).then((m) => m.DoctorWorkspacePageComponent),
      },
      // ================= ASSIGN WHOLE CARD =================
      // {
      //   path: ':repairCardId/assignments/assign-doctor',
      //   canActivate: [PermissionGuard],
      //   data: { permission: PERMISSIONS.REPAIR_CARDS.ASSIGN_DOCTORS },
      //   loadComponent: () =>
      //     import(
      //       './Components/assign-repair-card-to-doctor/assign-repair-card-to-doctor.component'
      //     ).then((m) => m.AssignRepairCardToDoctorComponent),
      // },

      // ================= ASSIGN INDUSTRIAL PARTS =================
      // {
      //   path: ':repairCardId/assignments/industrial-parts',
      //   canActivate: [PermissionGuard],
      //   data: { permission: PERMISSIONS.REPAIR_CARDS.ASSIGN_DOCTORS },
      //   loadComponent: () =>
      //     import(
      //       './Components/assign-industrial-parts/assign-industrial-parts.component'
      //     ).then((m) => m.AssignIndustrialPartsComponent),
      // },

      // ================= UPDATE STATUS =================
      // {
      //   path: ':repairCardId/status',
      //   canActivate: [PermissionGuard],
      //   data: { permission: PERMISSIONS.REPAIR_CARDS.UPDATE_STATUS },
      //   loadComponent: () =>
      //     import(
      //       './Components/update-repair-card-status/update-repair-card-status.component'
      //     ).then((m) => m.UpdateRepairCardStatusComponent),
      // },

      // {
      //   path: ':repairCardId/delivery-time',
      //   canActivate: [PermissionGuard],
      //   data: { permission: PERMISSIONS.REPAIR_CARDS.UPDATE_STATUS },
      //   loadComponent: () =>
      //     import(
      //       './Components/create-repair-card-delivery-time/create-repair-card-delivery-time.component'
      //     ).then((m) => m.CreateRepairCardDeliveryTimeComponent),
      // },
    ],
  },

  {
    path: '',
    redirectTo: 'repair-cards',
    pathMatch: 'full',
  },
];
