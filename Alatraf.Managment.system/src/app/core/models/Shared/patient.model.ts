import { PersonDto } from "./person.model";

export interface PatientDto {
  patientId: number;
  personId: number;
  personDto?: PersonDto | null;
  patientType: PatientType;
}

export enum PatientType {
  Normal = 0,
  Wounded = 1,
  Disabled = 2
}
