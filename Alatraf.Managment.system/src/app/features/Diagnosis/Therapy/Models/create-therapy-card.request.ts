

export interface CreateTherapyCardRequest {
  TicketId: number;
  DiagnosisText: string;
  InjuryDate: string;                 // DateTime → ISO string
  InjuryReasons: number[];
  InjurySides: number[];
  InjuryTypes: number[];
  ProgramStartDate: string;           // DateTime → ISO string
  ProgramEndDate: string;             // DateTime → ISO string
  TherapyCardType: TherapyCardType;
  Programs: TherapyCardMedicalProgramRequest[];
  Notes?: string | null;
}

export interface TherapyCardMedicalProgramRequest {
  MedicalProgramId: number;
  Duration: number;
  Notes?: string | null;
}

export enum TherapyCardType {
  General = 0,
  Special = 1,
  NerveKids = 2
}



