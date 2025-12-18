import { PersonDto } from "../../../../core/models/Shared/person.model";

export interface DoctorDto {
  doctorId: number;
  personDto?: PersonDto | null;
  specialization?: string | null;
  departmentId: number;
}
