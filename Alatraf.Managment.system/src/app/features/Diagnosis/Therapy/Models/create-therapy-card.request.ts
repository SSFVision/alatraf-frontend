export interface CreateTherapyCardRequest {
  TicketId: number;
  DiagnosisText: string;
  InjuryDate: string;
  InjuryReasons: number[];
  InjurySides: number[];
  InjuryTypes: number[];
  PatientId: number;
  ProgramStartDate: string;
  ProgramEndDate: string;
  TherapyCardType: number;
  Programs: CreateTherapyCardMedicalProgramRequest[];
  Notes?: string | null;
}

export interface CreateTherapyCardMedicalProgramRequest {
  MedicalProgramId: number;
  Duration: number;
  Notes?: string | null;
}
