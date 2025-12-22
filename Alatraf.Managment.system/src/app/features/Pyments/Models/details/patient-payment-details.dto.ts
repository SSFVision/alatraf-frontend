// features/payments/models/details/patient-payment-details.dto.ts

import { PaymentCoreDto } from '../payment-core.dto';

export interface PatientPaymentDetailsDto {
  payment: PaymentCoreDto;

  voucherNumber: string;
  notes?: string | null;
}
