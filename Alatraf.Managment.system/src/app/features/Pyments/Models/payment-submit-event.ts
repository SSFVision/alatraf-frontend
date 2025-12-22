import { AccountKind } from './account-kind.enum';
import { PayDisabledPaymentRequest } from './PaymentTypesRequests/pay-disabled-payment.request';
import { PayPatientPaymentRequest } from './PaymentTypesRequests/pay-patient-payment.request';
import { PayWoundedPaymentRequest } from './PaymentTypesRequests/pay-wounded-payment.request';

export type PaymentSubmitEvent =
  | { accountKind: AccountKind.Free;payload:{} }
  | { accountKind: AccountKind.Patient; payload: PayPatientPaymentRequest }
  | { accountKind: AccountKind.Disabled; payload: PayDisabledPaymentRequest }
  | { accountKind: AccountKind.Wounded; payload: PayWoundedPaymentRequest };
