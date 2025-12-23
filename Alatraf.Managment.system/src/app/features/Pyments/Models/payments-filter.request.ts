import { AccountKind } from './account-kind.enum';
import { PaymentReference } from './payment-reference.enum';

export interface PaymentsFilterRequest {
  searchTerm?: string | null;

  ticketId?: number | null;

  diagnosisId?: number | null;

  paymentReference?: PaymentReference | null;

  accountKind?: AccountKind | null;

  isCompleted?: boolean | null;

  paymentDateFrom?: string | null;
  paymentDateTo?: string | null;

  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
}
