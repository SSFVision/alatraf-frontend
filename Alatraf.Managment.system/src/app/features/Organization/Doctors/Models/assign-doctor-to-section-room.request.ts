export interface AssignDoctorToSectionRoomRequest {
  sectionId: number;
  roomId?: number |null;
  isActive: boolean;
  notes?: string | null;
}
