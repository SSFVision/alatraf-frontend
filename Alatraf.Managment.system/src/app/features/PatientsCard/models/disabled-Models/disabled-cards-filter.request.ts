export interface DisabledCardsFilterRequest {
  searchTerm?: string | null;
  patientId?: number | null;

  issueDateFrom?: string | null; // DateOnly → yyyy-MM-dd
  issueDateTo?: string | null;   // DateOnly → yyyy-MM-dd

  sortColumn?: string;            // default: 'ExpirationDate'
  sortDirection?: 'asc' | 'desc'; // default: 'desc'
}