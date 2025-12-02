export interface DiagnosisIndustrialPartMock {
  id: number;
  diagnosisId: number;         // FK → Diagnosis
  industrialPartUnitId: number; // FK → Industrial Part Unit
  quantity: number;
  price: number;
}
