export interface TherapistDto {
  doctorSectionRoomId?: number | null;

  doctorId: number;
  doctorName: string;

  sectionId?: number | null;
  sectionName?: string | null;

  roomId?: number | null;
  roomName?: string | null;

  todaySessions: number;
}
