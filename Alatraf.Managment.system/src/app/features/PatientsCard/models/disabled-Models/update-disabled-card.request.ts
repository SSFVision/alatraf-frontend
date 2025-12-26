
export interface UpdateDisabledCardRequest {
  patientId: number;
  cardNumber: string;
  disabilityType: string;
  issueDate: string; 
  cardImagePath?: string | null;
}
