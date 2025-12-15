export interface IndustrialPartFilterRequest {
  sectionId?: number | null;

  hasSection?: boolean | null;

  searchTerm?: string | null;

  sortColumn: string;

  sortDirection: 'asc' | 'desc';
}
