
import { PaymentCoreDto } from '../payment-core.dto';

export interface DisabledPaymentDetailsDto {
  payment: PaymentCoreDto;

  disabledCardId: number;
  notes?: string | null;
}
