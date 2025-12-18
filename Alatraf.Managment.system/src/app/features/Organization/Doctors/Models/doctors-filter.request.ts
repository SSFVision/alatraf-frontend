export interface DoctorsFilterRequest {
  departmentId?: number | null;
  sectionId?: number | null;
  roomId?: number | null;
  search?: string | null;
  specialization?: string | null;
  hasActiveAssignment?: boolean | null;
  sortBy?: string | null;

  sortDir?: 'asc' | 'desc' | null;
}
