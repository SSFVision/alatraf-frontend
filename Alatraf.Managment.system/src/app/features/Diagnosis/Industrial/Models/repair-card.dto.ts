import { DiagnosisDto } from "../../Shared/Models/diagnosis.dto";
import { DiagnosisIndustrialPartDto } from "./diagnosis-industrial-part.dto";

export interface RepairCardDto {
  RepairCardId: number;
  Diagnosis: DiagnosisDto;
  IsActive: boolean;
  IsLate: boolean;
  CardStatus: RepairCardStatus;
  DiagnosisIndustrialParts?: DiagnosisIndustrialPartDto[];
  DeliveryDate: string;      // ISO string (Date)
  TotalCost: number;
}

export enum RepairCardStatus {
  New = 0,
  AssignedToTechnician = 1,
  InProgress = 2,
  InTraining = 3,
  Completed = 4,
  LegalExit = 5,
  ExitForPractice = 6,
  IllegalExit = 7
}
