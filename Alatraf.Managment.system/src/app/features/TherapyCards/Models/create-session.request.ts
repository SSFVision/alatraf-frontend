
export interface CreateSessionRequest {
  sessionPrograms: SessionProgramRequest[];
}
export interface SessionProgramRequest {
  diagnosisProgramId: number;
  doctorId: number;
  sectionId: number;
  roomId: number;
}
