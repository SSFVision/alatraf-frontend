import { TherapyDepartment } from "./therapy-department.enum";

export interface TherapyWaitingFilterDto {
  searchTerm?: string;
  department?: TherapyDepartment;
}
