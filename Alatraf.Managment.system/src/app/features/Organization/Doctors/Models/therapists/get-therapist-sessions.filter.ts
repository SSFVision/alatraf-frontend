export interface GetTherapistSessionsFilter {
  date?: string | null; // DateOnly mapped to string for consistent API interaction
  patientName?: string | null;
  therapyCardId?: number | null;
  page: number;
  pageSize: number;
}
