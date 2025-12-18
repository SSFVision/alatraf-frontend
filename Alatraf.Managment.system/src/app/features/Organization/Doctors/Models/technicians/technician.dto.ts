export interface TechnicianDto {
  doctorSectionRoomId?: number | null;

  doctorId: number;
  doctorName: string;

  sectionId?: number | null;
  sectionName?: string | null;

  todayIndustrialParts: number;
}
