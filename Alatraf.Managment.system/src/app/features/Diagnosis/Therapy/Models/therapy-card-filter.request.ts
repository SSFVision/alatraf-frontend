import { TherapyCardType } from "./create-therapy-card.request";

export interface TherapyCardFilterRequest {
  searchTerm?: string | null;

  isActive?: boolean | null;

  therapyCardType?: TherapyCardType | null;

  therapyCardStatus?: TherapyCardStatus | null;

  programStartFrom?: string | null; // DateTime → ISO string
  programStartTo?: string | null;

  programEndFrom?: string | null;
  programEndTo?: string | null;

  diagnosisId?: number | null;
  patientId?: number | null;

  sortColumn: string;     // default: ProgramStartDate
  sortDirection: string;  // asc | desc
}

export enum TherapyCardStatus {
  FirstTime = 0,
  Active = 1,
  Completed = 2,
  Canceled = 3
}

