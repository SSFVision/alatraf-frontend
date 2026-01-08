import { HolidayType } from './holiday-type.enum';

export interface HolidayDto {
  holidayId: number;
  startDate: string; // ISO date string e.g., "2024-12-25"
  endDate?: string | null;
  name?: string | null;
  isRecurring: boolean;
  isActive: boolean;
  type: HolidayType;
}
