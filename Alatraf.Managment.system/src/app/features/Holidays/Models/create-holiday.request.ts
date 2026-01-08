import { HolidayType } from './holiday-type.enum';

export interface CreateHolidayRequest {
  startDate: string; // ISO date string e.g., "2024-12-25"
  endDate?: string | null;
  name: string;
  isRecurring: boolean;
  type: HolidayType;
  isActive?: boolean; // Defaults to true on the backend
}
