export interface MedicalProgramsFilterRequest {
  searchTerm?: string | null;

  sectionId?: number | null;

  hasSection?: boolean | null;

  sortColumn: string;

  sortDirection: 'asc' | 'desc';
}
