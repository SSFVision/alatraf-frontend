export interface NextAppointmentDayDto {
  date: string; // ISO date string e.g., "2024-12-25"
  dayOfWeek: string;
  appointmentsCountOnThatDate: number;
}
