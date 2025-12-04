import { TicketDto, TicketStatus } from './ticket.model';
import { PATIENTS_MOCK_DATA } from '../patients/patient.mock';
import { MOCK_SERVICES } from '../services/mock-services.data';

export const MOCK_TICKETS: TicketDto[] = [
  {
    id: 1,
    patient: PATIENTS_MOCK_DATA[0],
    service: MOCK_SERVICES[0],
    status: TicketStatus.New
  },
  {
    id: 2,
    patient: PATIENTS_MOCK_DATA[1],
    service: MOCK_SERVICES[1],
    status: TicketStatus.Completed
  },
   // --- Therapy Department 7 (عظام) ---
  {
    id: 3,
    patient: PATIENTS_MOCK_DATA[2],
    service: MOCK_SERVICES[2], // عظام (departmentId = 7)
    status: TicketStatus.New
  },

  // --- Therapy Department 4 (again) ---
  {
    id: 4,
    patient: PATIENTS_MOCK_DATA[3],
    service: MOCK_SERVICES[0], // علاج طبيعي
    status: TicketStatus.New
  },
];
