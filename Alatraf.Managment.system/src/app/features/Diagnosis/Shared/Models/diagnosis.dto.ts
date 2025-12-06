import { InjuryDto } from "./injury.dto";

export interface DiagnosisDto {
  DiagnosisId: number;
  DiagnosisText: string;
  InjuryDate: string;

  TicketId: number;
  PatientId: number;
  PatientName: string;
  DiagnosisType: number;
  InjuryReasons: InjuryDto[];
  InjurySides: InjuryDto[];
  InjuryTypes: InjuryDto[];

  // Programs?: DiagnosisProgramDto[];
  // IndustrialParts?: DiagnosisIndustrialPartDto[];
  HasTherapyCards: boolean;
  HasRepairCard: boolean;
  HasSale: boolean;
}
