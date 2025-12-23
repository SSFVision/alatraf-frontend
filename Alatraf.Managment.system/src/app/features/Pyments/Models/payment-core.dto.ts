// features/payments/models/payment-core.dto.ts

import { PaymentReference } from './payment-reference.enum';
import { AccountKind } from './account-kind.enum';

export interface PaymentCoreDto {
  paymentId: number;
  ticketId: number;
  diagnosisId: number;

  paymentReference: PaymentReference;
  accountKind?: AccountKind | null;

  isCompleted: boolean;
  paymentDate?: string | null; // DateTime → ISO string

  totalAmount: number;
  paidAmount?: number | null;
  discount?: number | null;
  residual: number;

  notes?: string | null;
}
