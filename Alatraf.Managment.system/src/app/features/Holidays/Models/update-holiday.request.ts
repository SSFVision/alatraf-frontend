import { HolidayType } from './holiday-type.enum';

export interface UpdateHolidayRequest {
  name: string;
  startDate: string; // ISO date string e.g., "2024-12-25"
  endDate?: string | null;
  isRecurring: boolean;
  type: HolidayType;
  isActive: boolean;
}
