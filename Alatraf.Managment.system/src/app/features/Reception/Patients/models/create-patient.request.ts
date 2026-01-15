import { PatientType } from '../../../../core/models/Shared/patient.model';

export interface CreatePatientRequest {
  fullname: string;
  birthdate: string | null; // ISO string (YYYY-MM-DD)
  phone: string;
  nationalNo?: string | null;
  addressId: number;
  gender: boolean;
  patientType: PatientType;
}
