// patients-cards/disabled/models/disabled-card.dto.ts

export interface DisabledCardDto {
  disabledCardId: number;
  cardNumber: string;
  expirationDate: string; // DateOnly → ISO string (yyyy-MM-dd)
  patientId: number;
  fullName: string;
  cardImagePath?: string | null;
  isExpired: boolean;
}
