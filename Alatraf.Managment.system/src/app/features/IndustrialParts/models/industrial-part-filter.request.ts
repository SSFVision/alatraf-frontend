export interface IndustrialPartFilterRequest {
  searchTerm?: string | null;

  sortColumn: string;

  sortDirection: 'asc' | 'desc';
}
