import { Patient } from "../patients/patient.dto";
import { ServiceDto } from "../services/service.model";

export enum TicketStatus {
  New = 0,
  Pause = 1,
  Continue = 2,
  Completed = 3,
  Cancelled = 4
}

export interface TicketDto {
  id: number;
  service: ServiceDto | null;
  patient: Patient | null;
  status: TicketStatus;
}

export interface CreateTicketDto {
  serviceId: number;
  patientId: number;
}
