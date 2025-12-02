export interface DiagnosisProgramMock {
  id: number;
  diagnosisId: number;       // FK → Diagnosis
  medicalProgramId: number;  // FK → MedicalPrograms
  duration: number;
  notes?: string;
}
