import { InjuryDto } from '../../../../core/models/injuries/injury.dto';

export interface RepairCardDiagnosisDto {
  repairCardId: number;
  ticketId: number;
  patientId: number;
  patientName: string;
  gender: string;
  age: number;

  diagnosisId: number;
  diagnosisText: string;
  injuryDate: string; // DateTime → string
  diagnosisType: string;
  isActive: boolean;
  cardStatus: string;

  injuryReasons: InjuryDto[];
  injurySides: InjuryDto[];
  injuryTypes: InjuryDto[];

  totalCost: number;

  diagnosisIndustrialParts: DiagnosisIndustrialPartDto[] | null;
}
export interface DiagnosisIndustrialPartDto {
  diagnosisIndustrialPartId: number;
  industrialPartId: number;
  partName: string;
  unitId: number;
  unitName: string;
  quantity: number;
  price: number;
  doctorSectionRoomId?: number | null;
  doctorSectionName?: string | null;
  doctorAssignedDate?: string | null; // DateTime → ISO string
  totalPrice: number;
}
