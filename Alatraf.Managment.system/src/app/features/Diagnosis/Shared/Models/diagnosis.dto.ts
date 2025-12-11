import { InjuryDto } from "../../../../core/models/injuries/injury.dto";
import { PatientDto } from "../../../../core/models/Shared/patient.model";
import { DiagnosisIndustrialPartDto } from "../../Industrial/Models/repair-card-diagnosis.dto";
import { DiagnosisProgramDto } from "../../Therapy/Models/therapy-card-diagnosis.dto";

export interface DiagnosisDto {
  diagnosisId: number;
  diagnosisText: string;
  injuryDate: string; // DateTime → string

  ticketId: number;
  patientId: number;
  patientName: string;
  patient: PatientDto | null;

  diagnosisType: string;

  injuryReasons: InjuryDto[];
  injurySides: InjuryDto[];
  injuryTypes: InjuryDto[];

  programs: DiagnosisProgramDto[] | null;
  industrialParts: DiagnosisIndustrialPartDto[] | null;
  saleItems: SaleItemDto[] | null;

  hasTherapyCards: boolean;
  hasRepairCard: boolean;
  hasSale: boolean;
}
// sale-item.dto.ts

export interface SaleItemDto {
  saleItemId: number;
  itemId: number;
  itemName: string;

  unitId: number;
  unitName: string;

  quantity: number; // decimal → number
  price: number;
  total: number; // backend computed value
}
