export interface TherapistSessionProgramDto {
  sessionProgramId: number;
  diagnosisProgramId: number;
  programName: string | null;
  sessionId: number | null;
  sessionNumber: number;
  sessionDate: string; // DateOnly mapped to string for consistent API interaction
  therapyCardId: number;
  patientName: string;
  patientPhoneNumber: string;
}
