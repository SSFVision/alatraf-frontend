import { Patient } from '../../Patients/models/patient.model';
import { ServiceDto } from '../../Services/models/service.model';
import { TicketStatus } from './ticket-status.enum';

export interface TicketDto {
  id: number;
  service: ServiceDto | null;
  patient: Patient | null;
  status: TicketStatus;
}