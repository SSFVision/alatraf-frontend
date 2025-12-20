// patients-cards/wounded/models/wounded-card.dto.ts

export interface WoundedCardDto {
  woundedCardId: number;
  cardNumber: string;
  expirationDate: string; // DateOnly → ISO string (yyyy-MM-dd)
  patientId: number;
  fullName: string;
  cardImagePath?: string | null;
  isExpired: boolean;
}
