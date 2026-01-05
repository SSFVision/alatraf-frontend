import { AppointmentStatus } from "./appointment-status.enum";

export interface AppointmentDto {
  id: number;
  ticketId: number;
  patientName: string;
  patientType: string; // Assuming PatientType enum is already defined elsewhere
  attendDate: string; // ISO date string e.g., "2024-12-25"
  createdAt: string;  // ISO date string e.g., "2024-12-25"
  dayOfWeek: string;
  status: AppointmentStatus; // Consider using AppointmentStatus enum for stricter typing
  notes?: string;
  isAppointmentTomorrow: boolean;
}
