import { RequestInfo } from 'angular-in-memory-web-api';
import { HttpRequest } from '@angular/common/http';
import { ServiceDto, CreateUpdateServiceDto } from './service.model';

export function generateServiceId(services: ServiceDto[]): number {
  return services.length
    ? Math.max(...services.map((s) => s.serviceId)) + 1
    : 1;
}

export class ServiceController {

 
static getAll(reqInfo: RequestInfo) {
  try {
    const services = reqInfo.collection as ServiceDto[];

    return reqInfo.utils.createResponse$(() => ({
      status: 200,
      statusText: 'OK',
      body: services,
    }));

  } catch (error) {
    return ServiceController.mockError(reqInfo, 500, 'Failed to load services.');
  }
}


  // --------------------------
  // GET BY ID
  // --------------------------
  static getById(reqInfo: RequestInfo) {
    try {
      const id = parseInt(reqInfo.id as string, 10);
      const collection = reqInfo.collection as ServiceDto[];

      const service = collection.find((s) => s.serviceId === id);

      if (!service) {
        return ServiceController.mockError(reqInfo, 404, 'Service not found.');
      }

      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        statusText: 'OK',
        body: service,
      }));

    } catch (error) {
      return ServiceController.mockError(reqInfo, 500, 'Failed to load service.');
    }
  }

  // --------------------------
  // CREATE
  // --------------------------
  static create(reqInfo: RequestInfo) {
    try {
      const req = reqInfo.req as HttpRequest<CreateUpdateServiceDto>;
      const body = req.body;

      if (!body) {
        return ServiceController.mockError(reqInfo, 400, 'Request body is missing.');
      }

      const collection = reqInfo.collection as ServiceDto[];

      const newService: ServiceDto = {
        serviceId: generateServiceId(collection),
        name: body.name,
        departmentId: body.departmentId,
        department: body.department,
        price: body.price,
      };

      collection.push(newService);

      return reqInfo.utils.createResponse$(() => ({
        status: 201,
        statusText: 'Created',
        body: newService,
      }));

    } catch (error) {
      return ServiceController.mockError(reqInfo, 500, 'Failed to create service.');
    }
  }

  // --------------------------
  // UPDATE
  // --------------------------
  static update(reqInfo: RequestInfo) {
    try {
      const req = reqInfo.req as HttpRequest<CreateUpdateServiceDto>;
      const body = req.body;

      if (!body) {
        return ServiceController.mockError(reqInfo, 400, 'Request body is missing.');
      }

      const id = parseInt(reqInfo.id as string, 10);
      const collection = reqInfo.collection as ServiceDto[];
      const index = collection.findIndex((s) => s.serviceId === id);

      if (index === -1) {
        return ServiceController.mockError(reqInfo, 404, 'Service not found.');
      }

      const updated = { ...collection[index], ...body } as ServiceDto;
      collection[index] = updated;

      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        statusText: 'OK',
        body: updated,
      }));

    } catch (error) {
      return ServiceController.mockError(reqInfo, 500, 'Failed to update service.');
    }
  }

  // --------------------------
  // DELETE (same pattern as patients)
  // --------------------------
  static delete(reqInfo: RequestInfo) {
    const id = parseInt(reqInfo.id as string, 10);
    const collection = reqInfo.collection as ServiceDto[];
    const index = collection.findIndex(s => s.serviceId === id);

    return reqInfo.utils.createResponse$(() => {

      // Item not found → Always return success but with error object
      if (index === -1) {
        return {
          status: 200,
          body: {
            isSuccess: false,
            errorMessage: "العنصر المطلوب غير موجود.",
            statusCode: 404
          }
        };
      }

      // OK delete
      collection.splice(index, 1);

      return {
        status: 200,
        body: {
          isSuccess: true,
          data: {}
        }
      };
    });
  }

  // --------------------------
  // COMMON ERROR BUILDER
  // --------------------------
  private static mockError(reqInfo: RequestInfo, status: number, detail: string) {
    return reqInfo.utils.createResponse$(() => ({
      status,
      statusText: 'Error',
      error: {
        title: status === 404 ? 'Not Found' : 'Mock Error',
        detail,
      },
    }));
  }
}
