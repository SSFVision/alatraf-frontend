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
  TherapyCardType: TherapyCardType;  
  Programs: CreateTherapyCardMedicalProgramRequest[];
  Notes?: string | null;
}

export interface CreateTherapyCardMedicalProgramRequest {
  MedicalProgramId: number;           
  Duration: number;                 
  Notes?: string | null;
}
export enum TherapyCardType {
  General = 0,
  Special = 1,
  NerveKids = 2
}
