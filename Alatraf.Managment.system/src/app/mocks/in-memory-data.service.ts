import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';

import { PATIENTS_MOCK_DATA } from './patients/patient.mock';
import { PatientController } from './patients/patient.controller';

import { MOCK_SERVICES } from './services/mock-services.data';
import { ServiceController } from './services/service.controller';
import { MOCK_TICKETS } from './Tickets/mock-tickets.data';
import { TicketController } from './Tickets/ticket.controller';


export class InMemoryDataService implements InMemoryDbService {

  // ------------------------------------------
  // ENTITY NAMES (Avoid repeating strings)
  // ------------------------------------------
  private readonly PATIENTS = 'patients';
  private readonly SERVICES = 'services';
  private readonly TICKETS = 'tickets';

  // ------------------------------------------
  // DATABASE
  // ------------------------------------------
  createDb() {
    return {
      [this.PATIENTS]: PATIENTS_MOCK_DATA,
      [this.SERVICES]: MOCK_SERVICES,
      [this.TICKETS]: MOCK_TICKETS
    };
  }

  // ------------------------------------------
  // GET
  // ------------------------------------------
  get(reqInfo: RequestInfo) {
    const entity = reqInfo.collectionName;

    switch (entity) {

      case this.PATIENTS:
        return reqInfo.id
          ? PatientController.getById(reqInfo)
          : PatientController.getAll(reqInfo);

      case this.SERVICES:
        return reqInfo.id
          ? ServiceController.getById(reqInfo)
          : ServiceController.getAll(reqInfo);

      case this.TICKETS:
        return reqInfo.id
          ? TicketController.getById(reqInfo)
          : TicketController.getAll(reqInfo);

      default:
        return undefined;
    }
  }

  // ------------------------------------------
  // POST
  // ------------------------------------------
  post(reqInfo: RequestInfo) {
    const entity = reqInfo.collectionName;

    switch (entity) {

      case this.PATIENTS:
        return PatientController.create(reqInfo);

      case this.SERVICES:
        return ServiceController.create(reqInfo);

      case this.TICKETS:
        return TicketController.create(reqInfo);

      default:
        return undefined;
    }
  }

  // ------------------------------------------
  // PUT
  // ------------------------------------------
  put(reqInfo: RequestInfo) {
    const entity = reqInfo.collectionName;

    switch (entity) {

      case this.PATIENTS:
        return PatientController.update(reqInfo);

      case this.SERVICES:
        return ServiceController.update(reqInfo);

      // Tickets do not have update here
      default:
        return undefined;
    }
  }

  // ------------------------------------------
  // DELETE
  // ------------------------------------------
  delete(reqInfo: RequestInfo) {
    const entity = reqInfo.collectionName;

    switch (entity) {

      case this.PATIENTS:
        return PatientController.delete(reqInfo);

      case this.SERVICES:
        return ServiceController.delete(reqInfo);

      case this.TICKETS:
        return TicketController.delete(reqInfo);

      default:
        return undefined;
    }
  }
}
