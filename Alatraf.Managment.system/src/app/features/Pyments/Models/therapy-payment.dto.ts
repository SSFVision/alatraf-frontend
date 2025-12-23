import { DiagnosisProgramDto } from "../../Diagnosis/Therapy/Models/therapy-card-diagnosis.dto";


export interface TherapyPaymentDto {
  paymentId: number;

  patientName: string;
  age: number;
  gender: string;
  patientId: number;

  diagnosisPrograms: DiagnosisProgramDto[];

  isCompleted: boolean;

  totalAmount: number;
  paidAmount?: number | null;
  discount?: number | null;

  accountKind?: string | null;

  paymentDate?: string | null; // DateTime → ISO string
}