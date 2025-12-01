import { RequestInfo } from 'angular-in-memory-web-api';
import { MockMedicalProgramDto } from './medical-program.model';

// ---------------------------
// GET ALL & GET BY ID ONLY
// Using same pattern as PatientController
// ---------------------------
export class MedicalProgramController {

  // -----------------------------------
  // GET ALL MEDICAL PROGRAMS
  // -----------------------------------
  static getAll(reqInfo: RequestInfo) {
    try {
      const programs = reqInfo.collection as MockMedicalProgramDto[];

      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: programs
      }));

    } catch (error) {
      return this.serverError(reqInfo, 'Failed to load medical programs.');
    }
  }

  // -----------------------------------
  // GET BY ID
  // -----------------------------------
  static getById(reqInfo: RequestInfo) {
    try {
      const id = Number(reqInfo.id);
      const collection = reqInfo.collection as MockMedicalProgramDto[];

      const program = collection.find(p => p.MedicalProgramId === id);

      if (!program) {
        return this.notFound(reqInfo, 'Medical program not found.');
      }

      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: program
      }));

    } catch (error) {
      return this.serverError(reqInfo, 'Failed to load medical program.');
    }
  }

  // -----------------------------------
  // ERROR HELPERS (same style as PatientController)
  // -----------------------------------

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
