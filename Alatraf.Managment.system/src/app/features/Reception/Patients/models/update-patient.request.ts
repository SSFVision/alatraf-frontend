import { PatientType } from "../../../../core/models/Shared/patient.model";

export interface UpdatePatientRequest {
  fullname: string;
  birthdate: string | null;          // ISO date string (YYYY-MM-DD)
  phone: string;
  nationalNo?: string | null;
  addressId: number;
  gender: boolean;
  patientType: PatientType;
}
