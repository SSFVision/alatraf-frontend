import { InjuryDto } from "../../Shared/Models/injury.dto";

export interface TherapyCardDiagnosisDto {
  TicketId: number;
  PatientId: number;
  PatientName: string;
  Gender: string;
  Age: number;

  DiagnosisId: number;
  DiagnosisText: string;
  InjuryDate: string;
  DiagnosisType: string;

  InjuryReasons: InjuryDto[];
  InjurySides: InjuryDto[];
  InjuryTypes: InjuryDto[];

  Programs?: DiagnosisProgramDto[] | null;

  TherapyCardId: number;
  ProgramStartDate?: string | null;
  ProgramEndDate?: string | null;

  TherapyCardType: string;
  CardStatus: string;

  Notes?: string | null;
}

export interface DiagnosisProgramDto {
  DiagnosisProgramId: number;
  MedicalProgramId: number;
  ProgramName: string;
  Duration: number;
  Notes?: string | null;
}
