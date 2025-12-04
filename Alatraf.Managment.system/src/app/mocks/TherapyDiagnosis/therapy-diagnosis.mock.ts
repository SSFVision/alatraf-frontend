import { TherapyDiagnosisDto } from "../../features/Diagnosis/Therapy/Models/therapy-diagnosis.dto";

export const THERAPY_DIAGNOSIS_MOCK: TherapyDiagnosisDto[] = [];

export function generateTherapyCardId(collection: TherapyDiagnosisDto[]) {
  return collection.length
    ? Math.max(...collection.map(c => c.TherapyCardId)) + 1
    : 1;
}
