import { MockMedicalProgramDto } from "./medical-program.model";

export const MEDICAL_PROGRAMS_MOCK_DATA: MockMedicalProgramDto[] = [
  {
    MedicalProgramId: 1,
    Name: 'علاج كهربائي – TENS',
    Duration: 20,
    Price: 30
  },
  {
    MedicalProgramId: 2,
    Name: 'علاج حراري – Hot Pack',
    Duration: 15,
    Price: 20
  },
  {
    MedicalProgramId: 3,
    Name: 'تمارين علاجية – Exercise Therapy',
    Duration: 30,
    Price: 35
  },
  {
    MedicalProgramId: 4,
    Name: 'علاج موجات فوق صوتية – Ultrasound',
    Duration: 10,
    Price: 25
  }
];
