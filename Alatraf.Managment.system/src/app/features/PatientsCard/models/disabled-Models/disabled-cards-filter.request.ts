// patients-cards/disabled/models/disabled-cards-filter.request.ts

export interface DisabledCardsFilterRequest {
  searchTerm?: string | null;
  isExpired?: boolean | null;
  patientId?: number | null;

  expirationFrom?: string | null; // yyyy-MM-dd
  expirationTo?: string | null;   // yyyy-MM-dd

  sortColumn?: string;       // default: 'ExpirationDate'
  sortDirection?: 'asc' | 'desc'; // default: 'desc'
}
