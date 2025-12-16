export interface RoomsFilterRequest {
  searchTerm?: string | null;

  sectionId?: number | null;
  departmentId?: number | null;

  /**
   * Backend default: 'name'
   */
  sortColumn?: string | null;

  /**
   * Allowed values: 'asc' | 'desc'
   * Backend default: 'asc'
   */
  sortDirection?: 'asc' | 'desc' | null;
}
