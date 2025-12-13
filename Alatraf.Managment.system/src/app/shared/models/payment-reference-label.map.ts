import { PaymentReference } from "../../features/Pyments/Models/payment-reference.enum";

export const PAYMENT_REFERENCE_LABEL: Record<PaymentReference, string> = {
  [PaymentReference.TherapyCardNew]: 'علاج طبيعي جديد',
  [PaymentReference.TherapyCardRenew]: 'تجديد كرت علاج',
  [PaymentReference.TherapyCardDamagedReplacement]: 'بدل فاقد',
  [PaymentReference.Repair]: 'اصلاحات فنية',
  [PaymentReference.Sales]: 'مبيعات',
};
