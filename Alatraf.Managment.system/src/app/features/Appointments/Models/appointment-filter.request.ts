import { PatientType } from "../../../core/models/Shared/patient.model";
import { AppointmentStatus } from "./appointment-status.enum";

export interface AppointmentFilterRequest {
  searchTerm?: string;
  isAppointmentTomorrow?: boolean;
  status?: AppointmentStatus;
  patientType?: PatientType;
  fromDate?: string;   // ISO date string e.g., "2024-12-25"
  toDate?: string;     // ISO date string e.g., "2024-12-25"
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
}
