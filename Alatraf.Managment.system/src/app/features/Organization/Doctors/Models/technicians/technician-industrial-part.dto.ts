export interface TechnicianIndustrialPartDto {
  diagnosisIndustrialPartId: number;
  industrialPartUnitId: number;
  quantity: number;
  industrialPartName?: string | null;
  repairCardId: number;
  patientName?: string | null;
  patientPhoneNumber?: string | null;
}
