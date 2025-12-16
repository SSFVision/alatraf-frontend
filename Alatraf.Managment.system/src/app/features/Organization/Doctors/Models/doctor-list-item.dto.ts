export interface DoctorListItemDto {
  doctorId: number;
  fullName: string;
  specialization?: string | null;

  departmentId: number;
  departmentName: string;

  sectionId?: number | null;
  sectionName?: string | null;

  roomId?: number | null;
  roomName?: string | null;

  /** ISO date string from DateOnly */
  assignDate?: string | null;

  isActiveAssignment: boolean;
}
