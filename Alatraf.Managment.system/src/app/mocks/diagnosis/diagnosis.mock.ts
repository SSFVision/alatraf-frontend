import { DiagnosisMock } from './Models/diagnosis.mock-model';

export const DIAGNOSIS_MOCK: DiagnosisMock[] = [
  // ------------------------------
  // THERAPY DIAGNOSIS
  // ------------------------------
  {
    diagnosisId: 1,
    diagnosisText: "تمزق عضلي في الساق اليسرى",
    injuryDate: "2024-01-15",

    ticketId: 1,   // Exists in MOCK_TICKETS
    patientId: 1,  // Exists in PATIENTS_MOCK_DATA
    diagnosisType: 1, // Therapy

    injuryReasons: [1, 3], // Example: "سقوط", "حادث سيارة"
    injurySides: [1],      // Left
    injuryTypes: [2]       // Moderate Injury
  },

  // ------------------------------
  // LIMBS (Industrial) DIAGNOSIS
  // ------------------------------
  {
    diagnosisId: 2,
    diagnosisText: "كسر في المعصم - يحتاج لتجهيز جبيرة",
    injuryDate: "2024-02-10",

    ticketId: 2,
    patientId: 2,
    diagnosisType: 2, // Limbs (Industrial Diagnosis)

    injuryReasons: [2], // "حادث عمل"
    injurySides: [2],   // Right
    injuryTypes: [3]    // "Fracture"
  }
];
