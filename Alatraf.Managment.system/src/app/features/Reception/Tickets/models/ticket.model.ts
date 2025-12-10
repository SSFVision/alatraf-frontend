import { PatientDto } from "../../../../core/models/Shared/patient.model";
import { ServiceDto } from "../../../../core/models/Shared/service.model";

export interface CreateTicketRequest {
  patientId?: number | null;
  serviceId: number;
}

export interface TicketDto {
  ticketId: number;
  service?: ServiceDto | null;
  patient?: PatientDto | null;
  ticketStatus: TicketStatus;
}

export enum TicketStatus {
  New = 'new',
  Pause = 'pause',
  Continue = 'continue',
  Completed = 'completed',
  Cancelled = 'cancelled'
}


export interface UpdateTicketRequest {
  serviceId: number;
  patientId?: number | null;
  status: TicketStatus;
}