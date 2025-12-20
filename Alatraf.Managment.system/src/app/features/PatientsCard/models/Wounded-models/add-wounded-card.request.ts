// patients-cards/wounded/models/add-wounded-card.request.ts

export interface AddWoundedCardRequest {
  patientId: number;
  cardNumber: string;
  expirationDate: string; // yyyy-MM-dd
  cardImagePath?: string | null;
}
