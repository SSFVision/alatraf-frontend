import { AccountKind } from './account-kind.enum';
import { PatientPaymentDto } from './patient-payment.dto';
import { DisabledPaymentDto } from './disabled-payment.dto';
import { WoundedPaymentDto } from './wounded-payment.dto';
import { DiagnosisDto } from '../../Diagnosis/Shared/Models/diagnosis.dto';
import { PaymentReference } from './payment-reference.enum';

export interface PaymentDto {
  paymentId: number;
  diagnosis: DiagnosisDto;
  ticketId: number;

  paymentReference: PaymentReference;
  accountKind?: AccountKind | null;

  isCompleted: boolean;
  totalAmount: number;
  paidAmount?: number | null;
  discount?: number | null;

  patientPayment?: PatientPaymentDto | null;
  disabledPayment?: DisabledPaymentDto | null;
  woundedPayment?: WoundedPaymentDto | null;
}
