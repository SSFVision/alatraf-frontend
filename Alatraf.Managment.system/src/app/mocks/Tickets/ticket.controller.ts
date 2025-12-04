// import { RequestInfo } from 'angular-in-memory-web-api';
// import { HttpRequest } from '@angular/common/http';

// import { TicketDto, CreateTicketDto, TicketStatus } from './ticket.model';
// import { MOCK_TICKETS } from './mock-tickets.data';
// import { PATIENTS_MOCK_DATA } from '../patients/patient.mock';
// import { MOCK_SERVICES } from '../services/mock-services.data';

// export function generateTicketId(tickets: TicketDto[]): number {
//   return tickets.length ? Math.max(...tickets.map(t => t.id)) + 1 : 1;
// }

// export class TicketController {

//   // --------------------------
//   // GET ALL TICKETS
//   // --------------------------
//   static getAll(reqInfo: RequestInfo) {
//     try {
//       const tickets = reqInfo.collection as TicketDto[];

//       return reqInfo.utils.createResponse$(() => ({
//         status: 200,
//         body: tickets
//       }));

//     } catch {
//       return TicketController.mockError(reqInfo, 500, 'Failed to load tickets.');
//     }
//   }

//   // --------------------------
//   // GET BY ID
//   // --------------------------
//   static getById(reqInfo: RequestInfo) {
//     try {
//       const id = parseInt(reqInfo.id as string, 10);
//       const tickets = reqInfo.collection as TicketDto[];

//       const ticket = tickets.find(t => t.id === id);

//       if (!ticket) {
//         return TicketController.mockError(reqInfo, 404, 'Ticket not found.');
//       }

//       return reqInfo.utils.createResponse$(() => ({
//         status: 200,
//         body: ticket
//       }));

//     } catch {
//       return TicketController.mockError(reqInfo, 500, 'Failed to load ticket.');
//     }
//   }

//   // --------------------------
//   // CREATE TICKET
//   // --------------------------
//   static create(reqInfo: RequestInfo) {
//     try {
//       const req = reqInfo.req as HttpRequest<CreateTicketDto>;
//       const body = req.body;

//       if (!body) {
//         return TicketController.mockError(reqInfo, 400, 'Request body is missing.');
//       }

//       const patients = PATIENTS_MOCK_DATA;
//       const services = MOCK_SERVICES;

//       const patient = patients.find(p => p.patientId === body.patientId);
//       const service = services.find(s => s.serviceId === body.serviceId);

//       if (!patient) return TicketController.mockError(reqInfo, 400, 'Patient not found.');
//       if (!service) return TicketController.mockError(reqInfo, 400, 'Service not found.');

//       const collection = reqInfo.collection as TicketDto[];

//       const newTicket: TicketDto = {
//         id: generateTicketId(collection),
//         patient,
//         service,
//         status: TicketStatus.New
//       };

//       collection.push(newTicket);

//       return reqInfo.utils.createResponse$(() => ({
//         status: 201,
//         body: newTicket
//       }));

//     } catch {
//       return TicketController.mockError(reqInfo, 500, 'Failed to create ticket.');
//     }
//   }

//   // --------------------------
//   // DELETE (like patients)
//   // --------------------------
//   static delete(reqInfo: RequestInfo) {
//     const id = parseInt(reqInfo.id as string, 10);
//     const collection = reqInfo.collection as TicketDto[];
//     const index = collection.findIndex(t => t.id === id);

//     return reqInfo.utils.createResponse$(() => {
//       if (index === -1) {
//         return {
//           status: 200,
//           body: {
//             isSuccess: false,
//             errorMessage: 'العنصر المطلوب غير موجود.',
//             statusCode: 404
//           }
//         };
//       }

//       collection.splice(index, 1);

//       return {
//         status: 200,
//         body: { isSuccess: true, data: {} }
//       };
//     });
//   }

//   // --------------------------
//   // COMMON ERROR BUILDER
//   // --------------------------
//   private static mockError(reqInfo: RequestInfo, status: number, detail: string) {
//     return reqInfo.utils.createResponse$(() => ({
//       status,
//       error: { title: 'Mock Error', detail }
//     }));
//   }
// }


import { RequestInfo } from 'angular-in-memory-web-api';
import { HttpRequest } from '@angular/common/http';

import { TicketDto, CreateTicketDto, TicketStatus, DiagnosisDepartments, DiagnosisType } from './ticket.model';
import { PATIENTS_MOCK_DATA } from '../patients/patient.mock';
import { MOCK_SERVICES } from '../services/mock-services.data';


export function generateTicketId(tickets: TicketDto[]): number {
  return tickets.length ? Math.max(...tickets.map((t) => t.id)) + 1 : 1;
}

export class TicketController {
  // ---------------------------------------------------
  // GET ALL
  // ---------------------------------------------------
  static getAll(reqInfo: RequestInfo) {
    try {
      const tickets = reqInfo.collection as TicketDto[];

      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: tickets,
      }));
    } catch (error) {
      return this.serverError(reqInfo, 'Failed to load tickets.');
    }
  }

  // ---------------------------------------------------
  // GET BY ID
  // ---------------------------------------------------
  static getById(reqInfo: RequestInfo) {
    try {
      const id = Number(reqInfo.id);
      const collection = reqInfo.collection as TicketDto[];

      const ticket = collection.find((t) => t.id === id);

      if (!ticket) return this.notFound(reqInfo, 'Ticket not found.');

      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: ticket,
      }));
    } catch (error) {
      return this.serverError(reqInfo, 'Failed to load ticket.');
    }
  }

  // ---------------------------------------------------
  // CREATE
  // ---------------------------------------------------
  static create(reqInfo: RequestInfo) {
    try {
      const req = reqInfo.req as HttpRequest<CreateTicketDto>;
      const body = req.body;

      if (!body)
        return this.validationError(reqInfo, {
          body: ['Request body is missing.'],
        });

      const validationErrors: Record<string, string[]> = {};

      if (!body.patientId)
        validationErrors['patientId'] = ['PatientId is required.'];

      if (!body.serviceId)
        validationErrors['serviceId'] = ['ServiceId is required.'];

      if (Object.keys(validationErrors).length > 0)
        return this.validationError(reqInfo, validationErrors);

      const patient = PATIENTS_MOCK_DATA.find(
        (p) => p.patientId === body.patientId
      );
      if (!patient) return this.businessError(reqInfo, 'Patient not found.');

      const service = MOCK_SERVICES.find((s) => s.serviceId === body.serviceId);
      if (!service) return this.businessError(reqInfo, 'Service not found.');

      const collection = reqInfo.collection as TicketDto[];

      const newTicket: TicketDto = {
        id: generateTicketId(collection),
        patient,
        service,
        status: TicketStatus.New,
      };

      collection.push(newTicket);

      return reqInfo.utils.createResponse$(() => ({
        status: 201,
        body: newTicket,
      }));
    } catch (error) {
      return this.serverError(reqInfo, 'Failed to create ticket.');
    }
  }

  // ---------------------------------------------------
  // DELETE
  // ---------------------------------------------------
  static delete(reqInfo: RequestInfo) {
    try {
      const id = Number(reqInfo.id);

      const collection = reqInfo.collection as TicketDto[];
      const index = collection.findIndex((t) => t.id === id);

      if (index === -1) return this.notFound(reqInfo, 'Ticket not found.');

      collection.splice(index, 1);

      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: {},
      }));
    } catch (error) {
      return this.serverError(reqInfo, 'Failed to delete ticket.');
    }
  }

  // ---------------------------------------------------
  // WAITING PATIENTS
  // ---------------------------------------------------
// ---------------------------------------------------
// WAITING PATIENTS (SEARCH ONLY, RETURNS diagnosisType)
// ---------------------------------------------------
// ---------------------------------------------------
// WAITING PATIENTS (SEARCH ONLY - RETURNS WaitingPatientDto[] ONLY)
// ---------------------------------------------------
// ---------------------------------------------------
// WAITING PATIENTS (SEARCH ONLY - RETURNS WaitingPatientDto[] ONLY)
// ---------------------------------------------------
static getWaitingPatients(reqInfo: RequestInfo) {
  try {
    const req = reqInfo.req as HttpRequest<any>;
    const body = req.body as { diagnosisType: DiagnosisType; searchTerm?: string };

    // -----------------------------
    // VALIDATION
    // -----------------------------
    if (!body || !body.diagnosisType) {
      return this.validationError(reqInfo, {
        diagnosisType: ['diagnosisType is required.'],
      });
    }

    const search = (body.searchTerm ?? '').trim().toLowerCase();

    const tickets = reqInfo.collection as TicketDto[];

    // -----------------------------
    // LOAD ONLY NEW TICKETS
    // -----------------------------
    let waiting = tickets.filter(t => t.status === TicketStatus.New);

    // -----------------------------
    // SEARCH FILTER
    // -----------------------------
    if (search !== '') {
      waiting = waiting.filter(t => {
        const p = t.patient;
        if (!p) return false;

        return (
          p.fullname.toLowerCase().includes(search) ||
          (p.phone?.toLowerCase().includes(search) ?? false) ||
          (p.nationalNo?.toLowerCase().includes(search) ?? false)
        );
      });
    }

    // -----------------------------
    // RETURN ERROR IF EMPTY
    // -----------------------------
    if (waiting.length === 0) {
      return this.notFound(reqInfo, 'لا يوجد مرضى انتظار حسب نتائج البحث.');
    }

    // -----------------------------
    // MAP TO WaitingPatientDto[]
    // -----------------------------
    const result = waiting.map(t => ({
      TicketId: t.id,
      PatientId: t.patient!.patientId,
      Fullname: t.patient!.fullname,
      Gender: t.patient!.gender,
      Birthdate: t.patient!.birthdate,
      AutoRegistrationNumber: t.patient!.autoRegistrationNumber,
    }));

    return reqInfo.utils.createResponse$(() => ({
      status: 200,
      body: result, // ALWAYS WaitingPatientDto[]
    }));
  } catch (error) {
    return this.serverError(reqInfo, ' Failed to load waiting patients.');
  }
}



  // ---------------------------------------------------
  // ERROR HELPERS
  // ---------------------------------------------------
  private static validationError(
    reqInfo: RequestInfo,
    errors: Record<string, string[]>
  ) {
    return reqInfo.utils.createResponse$(() => ({
      status: 400,
      error: {
        type: 'https://tools.ietf.org/html/rfc7231#section-6.5.1',
        title: 'One or more validation errors occurred.',
        status: 400,
        detail: 'Validation failed.',
        errors,
      },
    }));
  }

  private static businessError(reqInfo: RequestInfo, message: string) {
    return reqInfo.utils.createResponse$(() => ({
      status: 409,
      error: {
        type: 'business-error',
        title: 'Business rule violation',
        status: 409,
        detail: message,
      },
    }));
  }

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
