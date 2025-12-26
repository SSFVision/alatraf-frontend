export interface AddDisabledCardRequest {
  patientId: number;
  cardNumber: string;
  disabilityType: string;
  issueDate: string; // DateOnly → yyyy-MM-dd
  cardImagePath?: string | null;
}