// patients-cards/wounded/models/wounded-card.dto.ts

export interface WoundedCardDto {
  woundedCardId: number;
  cardNumber: string;
  issueDate: string; // ✅ ADDED

  expirationDate: string; // DateOnly → ISO string (yyyy-MM-dd)
  patientId: number;
  fullName: string;
  age: number; // ✅ ADDED
  gender: string; // ✅ ADDED
  phoneNumber: string; // ✅ ADDED
  cardImagePath?: string | null;
  isExpired: boolean;
}
