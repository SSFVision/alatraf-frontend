
export interface UpdateRepairCardRequest {
  ticketId: number;
  diagnosisText: string;
  injuryDate: string; // DateTime → ISO string
  injuryReasons: number[];
  injurySides: number[];
  injuryTypes: number[];
  industrialParts: UpdateRepairCardIndustrialPartRequest[];
  notes?: string | null;
}
export interface UpdateRepairCardIndustrialPartRequest {
  industrialPartId: number;
  unitId: number;
  quantity: number;
}
