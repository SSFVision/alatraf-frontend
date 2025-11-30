export interface Patient {
  patientId: number;
  fullname: string;
  birthdate?: string;
  phone?: string;
  nationalNo?: string;
  address?: string;
  gender: boolean;
  patientType: PatientType;
  autoRegistrationNumber?: string;
}

export interface PatientListDto {
  patientId: number;
  fullname: string;
  phone?: string;
  nationalNo?: string;
  autoRegistrationNumber?: string;
}

export enum PatientType {
  Normal = 0,
  Wounded = 1
}

// Optional: DTOs for create/update
export interface CreateUpdatePatientDto {
  fullname: string;
  birthdate?: string;
  phone?: string;
  nationalNo?: string;
  address?: string;
  gender: boolean;
  patientType: PatientType;
  autoRegistrationNumber?: string;
}

// Optional: filters for GET
export interface PatientFilterDto {
  searchTerm?: string;
}
