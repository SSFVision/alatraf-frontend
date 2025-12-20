// patients-cards/disabled/models/disabled-card.dto.ts

export interface DisabledCardDto {
  disabledCardId: number;
  cardNumber: string;
  expirationDate: string; // DateOnly → ISO string (yyyy-MM-dd)
    issueDate: string;      // ✅ ADDED

  patientId: number;
  fullName: string;
  age: number;            // ✅ ADDED
  gender: string;         // ✅ ADDED
  phoneNumber: string;    // ✅ ADDED
  cardImagePath?: string | null;
  isExpired: boolean;
}
