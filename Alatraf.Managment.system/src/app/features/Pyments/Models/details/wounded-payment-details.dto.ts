
import { PaymentCoreDto } from '../payment-core.dto';

export interface WoundedPaymentDetailsDto {
  payment: PaymentCoreDto;

  reportNumber?: string | null;
  notes?: string | null;
}
