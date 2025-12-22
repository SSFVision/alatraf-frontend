
export interface PayPatientPaymentRequest {
  paidAmount: number;
  discount?: number | null;
  voucherNumber: string;
  notes?: string | null;
}
