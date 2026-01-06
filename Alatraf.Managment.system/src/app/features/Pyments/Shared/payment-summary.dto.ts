export interface PaymentSummaryDto {
  paymentId: number;

  patientName: string;
  age: number;
  gender: string;
  patientId: number;

  totalAmount: number;
  paidAmount?: number | null;
  discount?: number | null;
  netAmount: number;

  accountKind?: string | null;
  paymentDate?: string | null;

  isCompleted: boolean;
}
