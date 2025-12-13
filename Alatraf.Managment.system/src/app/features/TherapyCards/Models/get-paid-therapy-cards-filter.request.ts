export interface GetPaidTherapyCardsFilterRequest {
  searchTerm?: string;
  sortColumn?: string;      // default: PaymentDate (backend)
  sortDirection?: 'asc' | 'desc';
}
