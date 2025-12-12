export interface SessionProgramDto {
  sessionProgramId: number;
  diagnosisProgramId: number;
  programName: string;
  doctorSectionRoomId: number;
  doctorSectionRoomName?: string | null;
  doctorName?: string | null;
}
