export interface GeneralWaitingPatientVM {
  id: number;            // therapyCardId / paymentId / appointmentId
  patientNumber: number;
  cardNumber: number;

  fullName: string;
  gender: string;

  // extensible لاحقًا
  extraInfo?: string;
}
