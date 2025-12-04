// src/app/mocks/medicalPrograms/medical-program.mock-controller.ts

import { RequestInfo } from 'angular-in-memory-web-api';
import { MedicalProgramDto, MEDICAL_PROGRAMS_MOCK_DATA } from './medical-program.mock';

export class MedicalProgramController {
  // --------------------------
  // GET ALL MEDICAL PROGRAMS
  // --------------------------
  static getAll(reqInfo: RequestInfo) {
    try {
      const collection = MEDICAL_PROGRAMS_MOCK_DATA as MedicalProgramDto[];

      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: collection,
      }));
    } catch (error) {
      return this.serverError(reqInfo, 'Failed to load medical programs.');
    }
  }

  // (Optional) GET BY ID if you ever need it
  static getById(reqInfo: RequestInfo) {
    try {
      const id = Number(reqInfo.id);
      const collection = MEDICAL_PROGRAMS_MOCK_DATA as MedicalProgramDto[];

      const program = collection.find((p) => p.Id === id);

      if (!program) {
        return this.notFound(reqInfo, 'Medical program not found.');
      }

      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: program,
      }));
    } catch (error) {
      return this.serverError(reqInfo, 'Failed to load medical program.');
    }
  }

  // --------------------------
  // ERROR HELPERS (same style as PatientController)
  // --------------------------
  private static notFound(reqInfo: RequestInfo, message: string) {
    return reqInfo.utils.createResponse$(() => ({
      status: 404,
      error: {
        type: 'not-found',
        title: 'Resource not found',
        status: 404,
        detail: message,
      },
    }));
  }

  private static serverError(reqInfo: RequestInfo, message: string) {
    return reqInfo.utils.createResponse$(() => ({
      status: 500,
      error: {
        type: 'server-error',
        title: 'Server Error',
        status: 500,
        detail: message,
      },
    }));
  }
}
