import { InjuryDto } from "../../Shared/Models/injury.dto";

export interface TherapyDiagnosisDto {
  TherapyCardId: number;
  TicketId: number;
  PatientId: number;

  DiagnosisText: string;
  InjuryDate: string;

  InjuryReasons: InjuryDto[];   // ⬅ now full objects instead of numbers
  InjurySides: InjuryDto[];     // ⬅ same
  InjuryTypes: InjuryDto[];     // ⬅ same

  ProgramStartDate: string;
  ProgramEndDate: string;
  TherapyCardType: number;

  Programs: TherapyDiagnosisProgramDto[];

  Notes?: string | null;
}

export interface TherapyDiagnosisProgramDto {
  MedicalProgramId: number;
  Duration: number;
  Notes?: string | null;

  // Optional: the full object if backend returns it
  MedicalProgram?: {
    id: number;
    name: string;
    description?: string;
  };
}
