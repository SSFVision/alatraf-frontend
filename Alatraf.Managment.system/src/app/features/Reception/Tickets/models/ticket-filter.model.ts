import { TicketStatus } from './ticket.model';

export interface TicketFilterRequest {
  searchTerm?: string | null;
  sortBy?: string;           // default: "createdAt"
  sortDirection?: string;    // "asc" | "desc"
  patientId?: number | null;
  serviceId?: number | null;
  departmentId?: number | null;
  createdFrom?: string | null;  // ISO string
  createdTo?: string | null;    // ISO string
  status?: TicketStatus | null;
}
