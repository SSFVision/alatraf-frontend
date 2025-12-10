
export interface CreateRepairCardRequest {
  ticketId: number;
  diagnosisText: string;
  injuryDate: string; 
  injuryReasons: number[];
  injurySides: number[];
  injuryTypes: number[];
  industrialParts: RepairCardIndustrialPartRequest[];
  notes?: string | null;
}
export interface RepairCardIndustrialPartRequest {
  industrialPartId: number;
  unitId: number;
  quantity: number;
}
