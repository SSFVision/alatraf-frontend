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
  }
];
