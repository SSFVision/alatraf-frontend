import { INDUSTRIAL_PARTS_MOCK } from './industrial-parts/industrial-part.mock';
import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';

import { PATIENTS_MOCK_DATA } from './patients/patient.mock';
import { PatientController } from './patients/patient.controller';

import { MOCK_SERVICES } from './services/mock-services.data';
import { ServiceController } from './services/service.controller';

import { MOCK_TICKETS } from './Tickets/mock-tickets.data';
import { TicketController } from './Tickets/ticket.controller';

import { IdentityController } from './identity/identity.controller';
import { IDENTITY_USERS_MOCK } from './identity/identity.mock';

// -------------------------
// INJURY IMPORTS
// -------------------------
import { INJURY_REASONS_MOCK } from './injuries/injury-reasons.mock';
import { INJURY_SIDES_MOCK } from './injuries/injury-sides.mock';
import { INJURY_TYPES_MOCK } from './injuries/injury-types.mock';

import { InjuryReasonController } from './injuries/injury-reason.controller';
import { InjurySideController } from './injuries/injury-side.controller';
import { InjuryTypeController } from './injuries/injury-type.controller';

// -------------------------
// MEDICAL PROGRAM IMPORTS
// -------------------------

// -------------------------
// INDUSTRIAL PART IMPORTS
// -------------------------
import { IndustrialPartController } from './industrial-parts/industrial-part.controller';
import { MedicalProgramController } from './medicalPrograms/medical-program.mock-controller';
import { MEDICAL_PROGRAMS_MOCK_DATA } from './medicalPrograms/medical-program.mock';

export class InMemoryDataService implements InMemoryDbService {

  private readonly PATIENTS = 'patients';
  private readonly SERVICES = 'services';
  private readonly TICKETS = 'tickets';
  private readonly IDENTITY = 'identity';

  // injury collections
  private readonly INJURY_REASONS = 'injuryReasons';
  private readonly INJURY_SIDES = 'injurySides';
  private readonly INJURY_TYPES = 'injuryTypes';

  // NEW
  private readonly MEDICAL_PROGRAMS = 'medicalPrograms';
  private readonly INDUSTRIAL_PARTS = 'industrialParts';

  createDb() {
    return {
      [this.PATIENTS]: PATIENTS_MOCK_DATA,
      [this.SERVICES]: MOCK_SERVICES,
      [this.TICKETS]: MOCK_TICKETS,
      [this.IDENTITY]: IDENTITY_USERS_MOCK,

      // injuries
      [this.INJURY_REASONS]: INJURY_REASONS_MOCK,
      [this.INJURY_SIDES]: INJURY_SIDES_MOCK,
      [this.INJURY_TYPES]: INJURY_TYPES_MOCK,

      // NEW collections
      [this.MEDICAL_PROGRAMS]: MEDICAL_PROGRAMS_MOCK_DATA,
      [this.INDUSTRIAL_PARTS]: INDUSTRIAL_PARTS_MOCK,
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

      // injury GET handlers
      case this.INJURY_REASONS:
        return reqInfo.id
          ? InjuryReasonController.getById(reqInfo)
          : InjuryReasonController.getAll(reqInfo);

      case this.INJURY_SIDES:
        return reqInfo.id
          ? InjurySideController.getById(reqInfo)
          : InjurySideController.getAll(reqInfo);

      case this.INJURY_TYPES:
        return reqInfo.id
          ? InjuryTypeController.getById(reqInfo)
          : InjuryTypeController.getAll(reqInfo);

      // NEW medical programs GET
      case this.MEDICAL_PROGRAMS:
        return reqInfo.id
          ? MedicalProgramController.getById(reqInfo)
          : MedicalProgramController.getAll(reqInfo);

      // NEW industrial parts GET
      case this.INDUSTRIAL_PARTS:
        return reqInfo.id
          ? IndustrialPartController.getById(reqInfo)
          : IndustrialPartController.getAll(reqInfo);

      default:
        return undefined;
    }
  }

  // -------------------------
  // POST
  // -------------------------
  post(reqInfo: RequestInfo) {

    if (reqInfo.req.url.includes('/identity/token/generate')) {
      return IdentityController.login(reqInfo);
    }

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
