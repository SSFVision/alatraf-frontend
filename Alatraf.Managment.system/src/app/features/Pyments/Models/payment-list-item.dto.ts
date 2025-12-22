// features/payments/models/payment-list-item.dto.ts

import { PaymentReference } from './payment-reference.enum';
import { AccountKind } from './account-kind.enum';

export interface PaymentListItemDto {
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

  /**
   * Helpful for list UI
   * - Patient payments → VoucherNumber
   * - Disabled payments → DisabledCardId
   */
  voucherNumber?: string | null;
  disabledCardId?: number | null;
}
