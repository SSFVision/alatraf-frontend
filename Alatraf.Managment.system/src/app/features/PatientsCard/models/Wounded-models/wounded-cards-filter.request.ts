// patients-cards/wounded/models/wounded-cards-filter.request.ts

export interface WoundedCardsFilterRequest {
  searchTerm?: string | null;
  isExpired?: boolean | null;
  patientId?: number | null;

  expirationFrom?: string | null; // yyyy-MM-dd
  expirationTo?: string | null;   // yyyy-MM-dd

  sortColumn?: string;            // default: 'Expiration'
  sortDirection?: 'asc' | 'desc'; // default: 'desc'
}
