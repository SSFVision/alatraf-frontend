import { DiagnosisDto } from '../../Diagnosis/Shared/Models/diagnosis.dto';
import { DiagnosisProgramDto } from '../../Diagnosis/Therapy/Models/therapy-card-diagnosis.dto';
import { SessionDto } from './session.dto';

export interface TherapyCardDto {
  therapyCardId: number;
  diagnosis: DiagnosisDto;
  isActive: boolean;
  numberOfSessions?: number | null;
  programStartDate?: string | null; // DateOnly
  programEndDate?: string | null; // DateOnly
  therapyCardType: string;
  cardStatus: string;
  notes?: string | null;
  programs?: DiagnosisProgramDto[] | null;
  sessions?: SessionDto[] | null;
}
