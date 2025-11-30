import { RequestInfo } from 'angular-in-memory-web-api';
import { HttpRequest } from '@angular/common/http';
import { Patient, CreateUpdatePatientDto } from './patient.dto';

export function generatePatientId(patients: Patient[]): number {
  return patients.length
    ? Math.max(...patients.map((p) => p.patientId)) + 1
    : 1;
}

export class PatientController {
  // ---------------------------------------------------
  // GET ALL
  // ---------------------------------------------------
  static getAll(reqInfo: RequestInfo) {
    try {
      let patients = reqInfo.collection as Patient[];
      const searchTerm = (reqInfo.query.get('searchTerm')?.[0] ?? '')
        .trim()
        .toLowerCase();

      if (searchTerm !== '') {
        patients = patients.filter(
          (p) =>
            p.fullname.toLowerCase().includes(searchTerm) ||
            p.phone?.toLowerCase().includes(searchTerm) ||
            p.nationalNo?.toLowerCase().includes(searchTerm)
        );
      }
       if (patients.length === 0) {
        return this.notFound(reqInfo, 'لايوجد مرضى مطابقين لمعايير البحث.');
      }

      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: patients,
      }));
    } catch (error) {
      return this.serverError(reqInfo, 'Failed to load patients.');
    }
  }

  // ---------------------------------------------------
  // GET BY ID
  // ---------------------------------------------------
  static getById(reqInfo: RequestInfo) {
    try {
      const id = Number(reqInfo.id);
      const collection = reqInfo.collection as Patient[];

      const patient = collection.find((p) => p.patientId === id);

      if (!patient) {
        return this.notFound(reqInfo, 'Patient not found.');
      }

      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: patient,
      }));
    } catch (error) {
      return this.serverError(reqInfo, 'Failed to load patient.');
    }
  }

  // ---------------------------------------------------
  // CREATE
  // ---------------------------------------------------
  static create(reqInfo: RequestInfo) {
    try {
      const req = reqInfo.req as HttpRequest<CreateUpdatePatientDto>;
      const body = req.body;

      if (!body) {
        return this.validationError(reqInfo, {
          body: ['Request body is missing.'],
        });
      }

      // VALIDATION
      const validationErrors: Record<string, string[]> = {};

      if (!body.fullname)
        validationErrors['fullname'] = ['Name is required.'];

      if (!body.nationalNo)
        validationErrors['nationalNo'] = ['National number is required.'];
      else if (!/^[0-9]+$/.test(body.nationalNo))
        validationErrors['nationalNo'] = ['National number must be numeric.'];
     if (!body.phone)
        validationErrors['phone'] = ['phone number is required.'];
      else if (!/^[0-9]+$/.test(body.phone))
        validationErrors['phone'] = ['phone number must be numeric.'];



      if (Object.keys(validationErrors).length > 0)
        return this.validationError(reqInfo, validationErrors);

      // BUSINESS RULE
      const collection = reqInfo.collection as Patient[];
      if (collection.some((p) => p.nationalNo === body.nationalNo)) {     
        
        return this.businessError(
          reqInfo,
          'National number already exists.'
        );
      }

      const newPatient: Patient = {
        patientId: generatePatientId(collection),
        fullname: body.fullname,
        birthdate: body.birthdate,
        phone: body.phone,
        nationalNo: body.nationalNo,
        address: body.address,
        gender: body.gender,
        patientType: body.patientType,
        autoRegistrationNumber: body.autoRegistrationNumber,
      };

      collection.push(newPatient);

      return reqInfo.utils.createResponse$(() => ({
        status: 201,
        body: newPatient,
      }));
    } catch (error) {
      return this.serverError(reqInfo, 'Failed to create patient.');
    }
  }

  // ---------------------------------------------------
  // UPDATE
  // ---------------------------------------------------
  static update(reqInfo: RequestInfo) {
    try {
      const req = reqInfo.req as HttpRequest<CreateUpdatePatientDto>;
      const body = req.body;

      if (!body)
        return this.validationError(reqInfo, {
          body: ['Request body is missing.'],
        });

      const id = Number(reqInfo.id);
      const collection = reqInfo.collection as Patient[];
      const index = collection.findIndex((p) => p.patientId === id);

      if (index === -1) {
        return this.notFound(reqInfo, 'Patient not found.');
      }

      const validationErrors: Record<string, string[]> = {};
     if (!body.fullname)
        validationErrors['fullname'] = ['Name is required.'];

      if (!body.nationalNo)
        validationErrors['nationalNo'] = ['National number is required.'];
      else if (!/^[0-9]+$/.test(body.nationalNo))
        validationErrors['nationalNo'] = ['National number must be numeric.'];
     if (!body.phone)
        validationErrors['phone'] = ['phone number is required.'];
      else if (!/^[0-9]+$/.test(body.phone))
        validationErrors['phone'] = ['phone number must be numeric.'];



      if (Object.keys(validationErrors).length > 0)
        return this.validationError(reqInfo, validationErrors);

      if (
        collection.some(
          (p) => p.nationalNo === body.nationalNo && p.patientId !== id
        )
      ) {
        return this.businessError(
          reqInfo,
          'National number already exists.'
        );
      }

      const updated = { ...collection[index], ...body };
      collection[index] = updated;

      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: updated,
      }));
    } catch (error) {
      return this.serverError(reqInfo, 'Failed to update patient.');
    }
  }

  // ---------------------------------------------------
  // DELETE
  // ---------------------------------------------------
  static delete(reqInfo: RequestInfo) {
    try {
      const id = Number(reqInfo.id);
      const collection = reqInfo.collection as Patient[];
      const index = collection.findIndex((p) => p.patientId === id);

      if (index === -1)
        return this.notFound(reqInfo, 'Patient not found.');

      if (id === 1) {
        return this.businessError(
          reqInfo,
          'Cannot delete patient with active tickets.'
        );
      }

      collection.splice(index, 1);

      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: {},
      }));
    } catch (error) {
      return this.serverError(reqInfo, 'Failed to delete patient.');
    }
  }

  // ---------------------------------------------------
  // PROBLEMDETAIL HELPERS
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
