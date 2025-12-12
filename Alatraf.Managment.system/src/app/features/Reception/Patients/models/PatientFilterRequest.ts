import { PatientType } from "../../../../core/models/Shared/patient.model";

export interface PatientFilterRequest {
  searchTerm?: string | null;
  patientType?: PatientType | null;
  gender?: boolean | null;
  birthDateFrom?: string | null; // use ISO string for dates sent to API
  birthDateTo?: string | null;
  hasNationalNo?: boolean | null;
  sortColumn?: string;        // default = fullname
  sortDirection?: string;     // default = asc
}
