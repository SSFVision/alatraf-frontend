import { RepairCardStatus } from './repair-card-status.enum';

export interface RepairCardFilterRequest {
  searchTerm?: string | null;

  isActive?: boolean | null;

  isLate?: boolean | null;

  status?: RepairCardStatus | null;

  diagnosisId?: number | null;

  patientId?: number | null;

  sortColumn?: string;   // default: 'repaircardid'

  sortDirection?: 'asc' | 'desc'; // default: 'desc'
}
