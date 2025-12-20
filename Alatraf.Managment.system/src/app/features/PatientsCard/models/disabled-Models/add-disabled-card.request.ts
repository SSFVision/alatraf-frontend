// patients-cards/disabled/models/add-disabled-card.request.ts

export interface AddDisabledCardRequest {
  patientId: number;
  cardNumber: string;
  expirationDate: string; // yyyy-MM-dd
  cardImagePath?: string | null;
}
