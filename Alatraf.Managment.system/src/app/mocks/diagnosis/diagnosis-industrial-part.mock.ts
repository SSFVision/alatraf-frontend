import { DiagnosisIndustrialPartMock } from "./Models/diagnosis-industrial-part.mock-model";

export const DIAGNOSIS_INDUSTRIAL_PARTS_MOCK: DiagnosisIndustrialPartMock[] = [
  {
    id: 1,
    diagnosisId: 2,         // Industrial diagnosis
    industrialPartUnitId: 1, // FK → Upper Cast / unit 1
    quantity: 1,
    price: 150
  },
  {
    id: 2,
    diagnosisId: 2,
    industrialPartUnitId: 3, // FK → Wrist Support / unit 3
    quantity: 2,
    price: 50
  }
];
