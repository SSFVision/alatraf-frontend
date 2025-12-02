import { DiagnosisProgramMock } from "./Models/diagnosis-program.mock-model";

export const DIAGNOSIS_PROGRAMS_MOCK: DiagnosisProgramMock[] = [
  {
    id: 1,
    diagnosisId: 1,       // Therapy diagnosis
    medicalProgramId: 1,  // Strengthening Program
    duration: 10,
    notes: "برنامج 10 جلسات علاج طبيعي"
  },
  {
    id: 2,
    diagnosisId: 1,
    medicalProgramId: 3,  // Back Improvement
    duration: 5,
    notes: "برنامج تقوية إضافي"
  }
];
