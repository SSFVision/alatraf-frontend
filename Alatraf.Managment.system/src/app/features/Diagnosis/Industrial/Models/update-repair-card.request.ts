export interface UpdateRepairCardRequest {
  RepairCardId: number;
  TicketId: number;

  DiagnosisText: string;
  InjuryDate: string;

  InjuryReasons: number[];
  InjurySides: number[];
  InjuryTypes: number[];

  PatientId: number;

  Notes?: string;

  IndustrialParts: UpdateRepairCardIndustrialPartRequest[];
}

export interface UpdateRepairCardIndustrialPartRequest {
  IndustrialPartId: number;
  UnitId: number;
  Quantity: number;
  Price: number;
}
