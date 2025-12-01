// Represents the Diagnosis row in the database
export interface DiagnosisMock {
  diagnosisId: number;
  diagnosisText: string;
  injuryDate: string;

  ticketId: number;     // FK → Ticket
  patientId: number;    // FK → Patient
  diagnosisType: number; // 0 = Sale, 1 = Therapy, 2 = Limbs

  injuryReasons: number[]; // FK list → InjuryReasons table
  injurySides: number[];   // FK list → InjurySides table
  injuryTypes: number[];   // FK list → InjuryTypes table
}
