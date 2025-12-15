export interface SectionFilterRequest {
  searchTerm?: string | null;
  departmentId?: number | null;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
}
