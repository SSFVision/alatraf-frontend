export interface ScheduleAppointmentRequest {
  notes?: string; // StringLength(1000) is a backend validation, not a TypeScript type
  // requestedDate?: string; // ISO date string e.g., "2024-12-25"
}
