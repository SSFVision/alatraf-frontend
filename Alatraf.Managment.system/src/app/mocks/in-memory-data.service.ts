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
import { MEDICAL_PROGRAMS_MOCK_DATA } from './medicalPrograms/medical-program.mock';
import { MedicalProgramController } from './medicalPrograms/medical-program.mock-controller';

// -------------------------
// THERAPY DIAGNOSIS IMPORTS
// -------------------------
import { THERAPY_DIAGNOSIS_MOCK } from './TherapyDiagnosis/therapy-diagnosis.mock';
import { TherapyDiagnosisController } from './TherapyDiagnosis/therapy-diagnosis.controller';

// -------------------------
// INDUSTRIAL PART IMPORTS
// -------------------------
import { IndustrialPartController } from './industrial-parts/industrial-part.controller';


export class InMemoryDataService implements InMemoryDbService {

  private readonly PATIENTS = 'patients';
  private readonly SERVICES = 'services';
  private readonly TICKETS = 'tickets';
  private readonly IDENTITY = 'identity';
  private readonly MEDICAL_PROGRAMS = 'medicalPrograms';
  private readonly THERAPY_DIAGNOSIS = 'therapyDiagnosis';

  // -----------------------------------------------------
  // DATABASE
  // -----------------------------------------------------
  createDb() {
    return {
      [this.PATIENTS]: PATIENTS_MOCK_DATA,
      [this.SERVICES]: MOCK_SERVICES,
      [this.TICKETS]: MOCK_TICKETS,
      [this.IDENTITY]: IDENTITY_USERS_MOCK,

      // INJURIES LOOKUPS
      injuryReasons: INJURY_REASONS_MOCK,
      injurySides: INJURY_SIDES_MOCK,
      injuryTypes: INJURY_TYPES_MOCK,

      // MEDICAL PROGRAMS
      [this.MEDICAL_PROGRAMS]: MEDICAL_PROGRAMS_MOCK_DATA,

      // THERAPY DIAGNOSIS MOCK STORAGE
      [this.THERAPY_DIAGNOSIS]: THERAPY_DIAGNOSIS_MOCK,

      // Industrial
      industrialParts: INDUSTRIAL_PARTS_MOCK,
    };
  }

  // -----------------------------------------------------
  // GET
  // -----------------------------------------------------
  get(reqInfo: RequestInfo) {
    const url = reqInfo.req.url;

    // AUTH
    if (url.includes('/identity/current-user/claims')) {
      return IdentityController.getCurrentUser(reqInfo);
    }

    // INJURY LOOKUPS
    if (url.includes('/injuries/reasons')) {
      return InjuryReasonController.getAll(reqInfo);
    }
    if (url.includes('/injuries/sides')) {
      return InjurySideController.getAll(reqInfo);
    }
    if (url.includes('/injuries/types')) {
      return InjuryTypeController.getAll(reqInfo);
    }

    // MEDICAL PROGRAMS
    if (url.includes('/doctor/therapy/medical-programs')) {
      return MedicalProgramController.getAll(reqInfo);
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

      case this.THERAPY_DIAGNOSIS:
        return reqInfo.id
          ? TherapyDiagnosisController.getById(reqInfo)
          : TherapyDiagnosisController.getAll(reqInfo);

      case 'industrialParts':
        return IndustrialPartController.getAll(reqInfo);

      default:
        return undefined;
    }
  }

  // -----------------------------------------------------
  // POST
  // -----------------------------------------------------
  post(reqInfo: RequestInfo) {
    const url = reqInfo.req.url;

    // AUTH
    if (url.includes('/identity/token/generate')) {
      return IdentityController.login(reqInfo);
    }

    if (url.includes('/identity/token/refresh-token')) {
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

      case this.THERAPY_DIAGNOSIS:
        return TherapyDiagnosisController.create(reqInfo);

      default:
        return undefined;
    }
  }

  // -----------------------------------------------------
  // PUT
  // -----------------------------------------------------
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

  // -----------------------------------------------------
  // DELETE
  // -----------------------------------------------------
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
