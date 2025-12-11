import { InjuryDto } from '../../../../core/models/injuries/injury.dto';

export interface TherapyCardDiagnosisDto {
  ticketId: number;
  patientId: number;
  patientName: string;
  gender: string;
  age: number;

  diagnosisId: number;
  diagnosisText: string;
  injuryDate: string;
  diagnosisType: string;

  injuryReasons: InjuryDto[];
  injurySides: InjuryDto[];
  injuryTypes: InjuryDto[];

  programs?: DiagnosisProgramDto[] | null;

  therapyCardId: number;
  programStartDate?: string | null;
  programEndDate?: string | null;

  therapyCardType: string;
  cardStatus: string;

  notes?: string | null;
}

export interface DiagnosisProgramDto {
  diagnosisProgramId: number;
  medicalProgramId: number;
  programName: string;
  duration: number;
  notes?: string | null;
}
