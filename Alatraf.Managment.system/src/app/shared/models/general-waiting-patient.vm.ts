import { PaymentReference } from "../../features/Pyments/Models/payment-reference.enum";

export interface GeneralWaitingPatientVM {
  id: number;            // therapyCardId / paymentId / appointmentId
  patientNumber: number;
  cardNumber: number;
  fullName: string;
  gender: string;
  referenceType?: string;      // PaymentReference
  // extensible لاحقًا
  extraInfo?: string;
}
