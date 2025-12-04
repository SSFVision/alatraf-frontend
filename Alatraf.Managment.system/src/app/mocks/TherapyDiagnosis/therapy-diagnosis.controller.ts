import { RequestInfo } from 'angular-in-memory-web-api';
import { HttpRequest } from '@angular/common/http';

import { THERAPY_DIAGNOSIS_MOCK } from './therapy-diagnosis.mock';
import { CreateTherapyCardRequest } from '../../features/Diagnosis/Therapy/Models/create-therapy-card.request';
import { TherapyDiagnosisDto } from '../../features/Diagnosis/Therapy/Models/therapy-diagnosis.dto';
import { PATIENTS_MOCK_DATA } from '../patients/patient.mock';
import { MOCK_TICKETS } from '../Tickets/mock-tickets.data';

let nextTherapyId = 1;

export class TherapyDiagnosisController {

  // ---------------------------------------------------
  // GET ALL
  // ---------------------------------------------------
  static getAll(reqInfo: RequestInfo) {
    try {
      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: THERAPY_DIAGNOSIS_MOCK
      }));
    } catch {
      return this.serverError(reqInfo, 'Failed to load diagnoses.');
    }
  }

  // ---------------------------------------------------
  // GET BY ID
  // ---------------------------------------------------
  static getById(reqInfo: RequestInfo) {
    try {
      const id = Number(reqInfo.id);
      const diagnosis = THERAPY_DIAGNOSIS_MOCK.find(d => d.TherapyCardId === id);

      if (!diagnosis) {
        return this.notFound(reqInfo, 'Diagnosis not found.');
      }

      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: diagnosis,
      }));
    } catch {
      return this.serverError(reqInfo, 'Failed to load diagnosis.');
    }
  }

  // ---------------------------------------------------
  // CREATE (Doctor creates a diagnosis)
  // ---------------------------------------------------
  static create(reqInfo: RequestInfo) {
    try {
      const req = reqInfo.req as HttpRequest<CreateTherapyCardRequest>;
      const body = req.body;

      if (!body) {
        return this.validationError(reqInfo, {
          body: ['Request body is missing.']
        });
      }

      const patient = PATIENTS_MOCK_DATA.find(p => p.patientId === body.PatientId);
      if (!patient) return this.businessError(reqInfo, 'Patient not found.');

      const ticket = MOCK_TICKETS.find(t => t.id === body.TicketId);
      if (!ticket) return this.businessError(reqInfo, 'Ticket not found.');

      // Convert Id → InjuryDto (just mock lookup structure)
      const reasons = body.InjuryReasons.map(id => ({ Id: id, Name: 'سبب ' + id }));
      const sides = body.InjurySides.map(id => ({ Id: id, Name: 'جهة ' + id }));
      const types = body.InjuryTypes.map(id => ({ Id: id, Name: 'نوع ' + id }));

      const newDiagnosis: TherapyDiagnosisDto = {
        TherapyCardId: nextTherapyId++,
        TicketId: body.TicketId,
        PatientId: body.PatientId,

        DiagnosisText: body.DiagnosisText,
        InjuryDate: body.InjuryDate,

        InjuryReasons: reasons,
        InjurySides: sides,
        InjuryTypes: types,

        ProgramStartDate: body.ProgramStartDate,
        ProgramEndDate: body.ProgramEndDate,
        TherapyCardType: body.TherapyCardType,
        Notes: body.Notes,

        Programs: body.Programs.map(p => ({
          MedicalProgramId: p.MedicalProgramId,
          Duration: p.Duration,
          Notes: p.Notes
        }))
      };

      // SAVE
      THERAPY_DIAGNOSIS_MOCK.push(newDiagnosis);

      // WORKFLOW: Mark ticket → completed
      ticket.status = 3; // TicketStatus.Completed

      return reqInfo.utils.createResponse$(() => ({
        status: 201,
        body: newDiagnosis,
      }));
    } catch (err) {
      return this.serverError(reqInfo, 'Failed to create diagnosis.');
    }
  }

  // ---------------------------------------------------
  // ERROR HELPERS
  // ---------------------------------------------------
  private static validationError(reqInfo: RequestInfo, errors: Record<string,string[]>) {
    return reqInfo.utils.createResponse$(() => ({
      status: 400,
      error: {
        type: 'validation-error',
        title: 'Validation failed',
        status: 400,
        detail: 'Validation failed.',
        errors
      }
    }));
  }

  private static businessError(reqInfo: RequestInfo, message: string) {
    return reqInfo.utils.createResponse$(() => ({
      status: 409,
      error: {
        type: 'business-error',
        title: 'Business rule violation',
        status: 409,
        detail: message
      }
    }));
  }

  private static notFound(reqInfo: RequestInfo, message: string) {
    return reqInfo.utils.createResponse$(() => ({
      status: 404,
      error: {
        type: 'not-found',
        title: 'Resource not found',
        status: 404,
        detail: message
      }
    }));
  }

  private static serverError(reqInfo: RequestInfo, message: string) {
    return reqInfo.utils.createResponse$(() => ({
      status: 500,
      error: {
        type: 'server-error',
        title: 'Server Error',
        status: 500,
        detail: message
      }
    }));
  }
}
