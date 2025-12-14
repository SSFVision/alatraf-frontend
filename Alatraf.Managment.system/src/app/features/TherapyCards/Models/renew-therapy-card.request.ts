import { TherapyCardMedicalProgramRequest } from "../../Diagnosis/Therapy/Models/create-therapy-card.request";

export interface RenewTherapyCardRequest {
  ticketId: number;
  programStartDate: string; // DateOnly (yyyy-MM-dd)
  programEndDate: string; // DateOnly (yyyy-MM-dd)
  therapyCardType: number; // enum value
  programs: TherapyCardMedicalProgramRequest[];
  notes?: string | null;
}
