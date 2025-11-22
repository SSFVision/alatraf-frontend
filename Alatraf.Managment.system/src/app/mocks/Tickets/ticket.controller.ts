import { RequestInfo } from 'angular-in-memory-web-api';
import { HttpRequest } from '@angular/common/http';

import { TicketDto, CreateTicketDto, TicketStatus } from './ticket.model';
import { MOCK_TICKETS } from './mock-tickets.data';
import { PATIENTS_MOCK_DATA } from '../patients/patient.mock';
import { MOCK_SERVICES } from '../services/mock-services.data';

export function generateTicketId(tickets: TicketDto[]): number {
  return tickets.length ? Math.max(...tickets.map(t => t.id)) + 1 : 1;
}

export class TicketController {

  // --------------------------
  // GET ALL TICKETS
  // --------------------------
  static getAll(reqInfo: RequestInfo) {
    try {
      const tickets = reqInfo.collection as TicketDto[];

      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: tickets
      }));

    } catch {
      return TicketController.mockError(reqInfo, 500, 'Failed to load tickets.');
    }
  }

  // --------------------------
  // GET BY ID
  // --------------------------
  static getById(reqInfo: RequestInfo) {
    try {
      const id = parseInt(reqInfo.id as string, 10);
      const tickets = reqInfo.collection as TicketDto[];

      const ticket = tickets.find(t => t.id === id);

      if (!ticket) {
        return TicketController.mockError(reqInfo, 404, 'Ticket not found.');
      }

      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: ticket
      }));

    } catch {
      return TicketController.mockError(reqInfo, 500, 'Failed to load ticket.');
    }
  }

  // --------------------------
  // CREATE TICKET
  // --------------------------
  static create(reqInfo: RequestInfo) {
    try {
      const req = reqInfo.req as HttpRequest<CreateTicketDto>;
      const body = req.body;

      if (!body) {
        return TicketController.mockError(reqInfo, 400, 'Request body is missing.');
      }

      const patients = PATIENTS_MOCK_DATA;
      const services = MOCK_SERVICES;

      const patient = patients.find(p => p.patientId === body.patientId);
      const service = services.find(s => s.serviceId === body.serviceId);

      if (!patient) return TicketController.mockError(reqInfo, 400, 'Patient not found.');
      if (!service) return TicketController.mockError(reqInfo, 400, 'Service not found.');

      const collection = reqInfo.collection as TicketDto[];

      const newTicket: TicketDto = {
        id: generateTicketId(collection),
        patient,
        service,
        status: TicketStatus.New
      };

      collection.push(newTicket);

      return reqInfo.utils.createResponse$(() => ({
        status: 201,
        body: newTicket
      }));

    } catch {
      return TicketController.mockError(reqInfo, 500, 'Failed to create ticket.');
    }
  }

  // --------------------------
  // DELETE (like patients)
  // --------------------------
  static delete(reqInfo: RequestInfo) {
    const id = parseInt(reqInfo.id as string, 10);
    const collection = reqInfo.collection as TicketDto[];
    const index = collection.findIndex(t => t.id === id);

    return reqInfo.utils.createResponse$(() => {
      if (index === -1) {
        return {
          status: 200,
          body: {
            isSuccess: false,
            errorMessage: 'العنصر المطلوب غير موجود.',
            statusCode: 404
          }
        };
      }

      collection.splice(index, 1);

      return {
        status: 200,
        body: { isSuccess: true, data: {} }
      };
    });
  }

  // --------------------------
  // COMMON ERROR BUILDER
  // --------------------------
  private static mockError(reqInfo: RequestInfo, status: number, detail: string) {
    return reqInfo.utils.createResponse$(() => ({
      status,
      error: { title: 'Mock Error', detail }
    }));
  }
}
