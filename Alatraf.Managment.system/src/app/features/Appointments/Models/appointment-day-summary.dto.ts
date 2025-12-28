export interface AppointmentDaySummaryDto {
  date: string; // ISO date string e.g., "2024-12-25"
  dayOfWeek: string;
  appointmentsCount: number;
}
