import { DiagnosisProgramDto } from "../../Shared/Models/diagnosis-program.dto";
import { DiagnosisDto } from "../../Shared/Models/diagnosis.dto";

export interface TherapyCardDto {
  TherapyCardId: number;
  Diagnosis: DiagnosisDto;
  IsActive: boolean;
  NumberOfSessions?: number | null;
  ProgramStartDate?: string | null;
  ProgramEndDate?: string | null;
  TherapyCardType: number;
  CardStatus: number;
  Notes?: string | null;

  Programs?: DiagnosisProgramDto[];
  // Sessions?: SessionDto[];
}
