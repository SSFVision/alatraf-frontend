export interface TherapistSessionProgramDto {
  sessionProgramId: number;
  diagnosisProgramId: number;
  programName?: string | null;
  sessionId?: number | null;
  therapyCardId: number;
  patientName: string;
  patientPhoneNumber: string;
}
