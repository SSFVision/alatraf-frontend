import { PERMISSIONS } from '../../core/auth/Roles/permissions.map';
import { AppRoutes } from '../../core/routing/app.routes.map';

export interface ReportCriteria {
  key: string;

  label: string;

  permission?: string;
}

export const REPORTS_CRITERIA: readonly ReportCriteria[] = [
  // {
  //   key: AppRoutes.reports.patients,
  //   label: 'تقرير المرضى',
  //   permission: PERMISSIONS.Patient.READ,
  // },
  {
    key: AppRoutes.reports.diagnosis,
    label: 'تقرير التشخيصات',
    permission: PERMISSIONS.MedicalProgram.READ,
  },
  // {
  //   key: AppRoutes.reports.sessions,
  //   label: 'تقرير الجلسات',
  //   permission: PERMISSIONS.TherapyCard.READ_SESSION,
  // },
] as const;

/**
 * Strongly typed report keys
 * 'patients' | 'diagnosis' | 'sessions'
 */
export type ReportType = (typeof REPORTS_CRITERIA)[number]['key'];
