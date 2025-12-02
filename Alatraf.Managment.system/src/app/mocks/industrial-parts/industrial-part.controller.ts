import { RequestInfo } from 'angular-in-memory-web-api';
import { MockIndustrialPartDto } from './industrial-part.model';

export class IndustrialPartController {

  // -------------------------
  // GET ALL
  // -------------------------
  static getAll(reqInfo: RequestInfo) {
    try {
      const items = reqInfo.collection as MockIndustrialPartDto[];

      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: items
      }));
    } catch {
      return this.serverError(reqInfo, 'Failed to load industrial parts.');
    }
  }

  // -------------------------
  // GET BY ID
  // -------------------------
  static getById(reqInfo: RequestInfo) {
    try {
      const id = Number(reqInfo.id);
      const collection = reqInfo.collection as MockIndustrialPartDto[];

      const part = collection.find(p => p.industrialPartId === id);

      if (!part) {
        return this.notFound(reqInfo, 'Industrial part not found.');
      }

      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: part
      }));
    } catch {
      return this.serverError(reqInfo, 'Failed to load industrial part.');
    }
  }

  // -------------------------
  // ERROR HANDLERS (same as patient)
  // -------------------------
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
