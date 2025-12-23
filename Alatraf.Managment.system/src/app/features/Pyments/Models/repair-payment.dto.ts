import { DiagnosisIndustrialPartDto } from "../../Diagnosis/Industrial/Models/repair-card-diagnosis.dto";



export interface RepairPaymentDto {
  paymentId: number;

  patientName: string;
  age: number;
  gender: string;
  patientId: number;

  diagnosisIndustrialParts: DiagnosisIndustrialPartDto[];

  isCompleted: boolean;

  totalAmount: number;
  paidAmount?: number | null;
  discount?: number | null;

  accountKind?: string | null;

  paymentDate?: string | null; // DateTime → ISO string
}
