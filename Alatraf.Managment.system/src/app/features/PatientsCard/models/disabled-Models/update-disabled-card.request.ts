// patients-cards/disabled/models/update-disabled-card.request.ts

export interface UpdateDisabledCardRequest {
  patientId: number;
  cardNumber: string;
  expirationDate: string; // yyyy-MM-dd
  cardImagePath?: string | null;
}
