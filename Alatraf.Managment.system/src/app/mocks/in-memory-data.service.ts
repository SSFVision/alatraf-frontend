import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';

import { PATIENTS_MOCK_DATA } from './patients/patient.mock';
import { PatientController } from './patients/patient.controller';

import { MOCK_SERVICES } from './services/mock-services.data';
import { ServiceController } from './services/service.controller';

import { MOCK_TICKETS } from './Tickets/mock-tickets.data';
import { TicketController } from './Tickets/ticket.controller';

import { IdentityController } from './identity/identity.controller';
import { IDENTITY_USERS_MOCK } from './identity/identity.mock';

export class InMemoryDataService implements InMemoryDbService {

  private readonly PATIENTS = 'patients';
  private readonly SERVICES = 'services';
  private readonly TICKETS = 'tickets';
  private readonly IDENTITY = 'identity'; // identity mock users

  createDb() {
    return {
      [this.PATIENTS]: PATIENTS_MOCK_DATA,
      [this.SERVICES]: MOCK_SERVICES,
      [this.TICKETS]: MOCK_TICKETS,
      [this.IDENTITY]: IDENTITY_USERS_MOCK, // optional visible list
    };
  }

  // -------------------------
  // GET
  // -------------------------
  get(reqInfo: RequestInfo) {

    // IDENTITY CLAIMS
    if (reqInfo.req.url.includes('/identity/current-user/claims')) {
      return IdentityController.getCurrentUser(reqInfo);
    }

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

  // -------------------------
  // POST
  // -------------------------
  post(reqInfo: RequestInfo) {

    // IDENTITY LOGIN
    if (reqInfo.req.url.includes('/identity/token/generate')) {
      return IdentityController.login(reqInfo);
    }

    // IDENTITY REFRESH
    if (reqInfo.req.url.includes('/identity/token/refresh-token')) {
      return IdentityController.refresh(reqInfo);
    }

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

  // -------------------------
  // PUT
  // -------------------------
  put(reqInfo: RequestInfo) {
    const entity = reqInfo.collectionName;

    switch (entity) {
      case this.PATIENTS:
        return PatientController.update(reqInfo);

      case this.SERVICES:
        return ServiceController.update(reqInfo);

      default:
        return undefined;
    }
  }

  // -------------------------
  // DELETE
  // -------------------------
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
