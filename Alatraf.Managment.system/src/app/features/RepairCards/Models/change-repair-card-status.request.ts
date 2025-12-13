import { RepairCardStatus } from "./repair-card-status.enum";

export interface ChangeRepairCardStatusRequest {
  cardStatus: RepairCardStatus;
}
