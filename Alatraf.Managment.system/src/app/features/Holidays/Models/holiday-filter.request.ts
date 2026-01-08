import { HolidayType } from './holiday-type.enum';

export interface HolidayFilterRequest {
  isActive?: boolean;
  specificDate?: string; // ISO date string e.g., "2024-12-25"
  endDate?: string; // ISO date string e.g., "2024-12-31"
  type?: HolidayType;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}
