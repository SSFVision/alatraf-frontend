export interface UpdateTherapyCardRequest {
  TherapyCardId: number;
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

  Notes?: string;

  Programs: UpdateTherapyCardMedicalProgramRequest[];
}

export interface UpdateTherapyCardMedicalProgramRequest {
  MedicalProgramId: number;
  Duration: number;
  Notes?: string;
}
