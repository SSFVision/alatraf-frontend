import { TherapyCardType, TherapyCardMedicalProgramRequest } from "./create-therapy-card.request";

export interface UpdateTherapyCardRequest {
  TicketId: number;
  DiagnosisText: string;
  InjuryDate: string;                   // DateTime → ISO string
  InjuryReasons: number[];
  InjurySides: number[];
  InjuryTypes: number[];

  ProgramStartDate: string;             // DateTime → ISO string
  ProgramEndDate?: string;    
  numberOfSessions: number;
  TherapyCardType: TherapyCardType;

  Programs: TherapyCardMedicalProgramRequest[];

  Notes?: string | null;
}
