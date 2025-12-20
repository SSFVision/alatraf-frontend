import { PatientCardType } from "./patient-card-type.enum";

export interface PatientCardListItemVm {
  id: number;
  cardNumber: string;
  expirationDate: string;
  fullName: string;
  isExpired: boolean;
    cardTypeLabel: PatientCardType

}
