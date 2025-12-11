import { DiagnosisDto } from "../../Shared/Models/diagnosis.dto";
import { DiagnosisProgramDto } from "./therapy-card-diagnosis.dto";

export interface TherapyCardDto {
  therapyCardId: number;
  diagnosis: DiagnosisDto;
  isActive: boolean;
  numberOfSessions: number | null;
  programStartDate: string | null;  // ISO string from backend
  programEndDate: string | null;
  therapyCardType: string;
  cardStatus: string;
  notes: string | null;

  programs: DiagnosisProgramDto[] | null;
  sessions: SessionDto[] | null;
}

export interface SessionDto {
  sessionId: number;
  isTaken: boolean;
  number: number;
  sessionDate: string; // DateTime → string in TS

  sessionPrograms: SessionProgramDto[];
}

export interface SessionProgramDto {
  sessionProgramId: number;
  diagnosisProgramId: number;
  programName: string;

  doctorSectionRoomId: number;
  doctorSectionRoomName: string | null;
  doctorName: string | null;
}
