export interface DisabledCardDto {
  disabledCardId: number;
  cardNumber: string;
  disabilityType: string;
  issueDate: string;

  patientId: number;
  fullName: string;
  age: number;
  gender: string;
  phoneNumber: string;
  address: string;

  cardImagePath?: string | null;
}
