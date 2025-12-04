export interface WaitingPatientDto{
  TicketId: number;
  PatientId: number;
  Fullname: string;
  Gender: boolean;
  Birthdate?: string;
  AutoRegistrationNumber?: string;
}
