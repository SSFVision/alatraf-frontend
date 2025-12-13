export interface PaymentWaitingListDto {
  paymentId: number;
  cardId: number;
  patientName: string;
  gender?: string | null;
  age: number;
  phone?: string | null;
  paymentReference: string;
}
