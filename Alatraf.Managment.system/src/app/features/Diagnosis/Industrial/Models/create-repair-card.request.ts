export interface CreateRepairCardRequest {
  TicketId: number;
  DiagnosisText: string;
  InjuryDate: string;

  InjuryReasons: number[];
  InjurySides: number[];
  InjuryTypes: number[];

  PatientId: number;

  Notes?: string;

  IndustrialParts: CreateRepairCardIndustrialPartRequest[];
}

export interface CreateRepairCardIndustrialPartRequest {
  IndustrialPartId: number;
  UnitId: number;
  Quantity: number;
  Price: number;
}
