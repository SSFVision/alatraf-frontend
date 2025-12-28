import { AppointmentStatus } from './appointment-status.enum';

export interface ChangeAppointmentStatusRequest {
  status: AppointmentStatus;
}
