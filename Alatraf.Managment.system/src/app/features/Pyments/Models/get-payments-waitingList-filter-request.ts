import { PaymentReference } from "./payment-reference.enum";

export interface GetPaymentsWaitingListFilterRequest {
  searchTerm?: string | null;
  paymentReference?: PaymentReference | null;
  isCompleted?: boolean | null;

  sortColumn?: string;      // default handled in facade/service
  sortDirection?: 'asc' | 'desc';
}
