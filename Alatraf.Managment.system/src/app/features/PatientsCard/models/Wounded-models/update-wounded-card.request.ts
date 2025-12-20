// patients-cards/wounded/models/update-wounded-card.request.ts

export interface UpdateWoundedCardRequest {
  patientId: number;
  cardNumber: string;
  expirationDate: string; // yyyy-MM-dd
  cardImagePath?: string | null;
}
