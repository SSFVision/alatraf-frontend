import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';

import { PATIENTS_MOCK_DATA } from './patients/patient.mock';
import { PatientController } from './patients/patient.controller';

import { MOCK_SERVICES } from './services/mock-services.data';
import { ServiceController } from './services/service.controller';

export class InMemoryDataService implements InMemoryDbService {

  createDb() {
    return {
      patients: PATIENTS_MOCK_DATA,
      services: MOCK_SERVICES,
    };
  }

  get(reqInfo: RequestInfo) {
    switch (reqInfo.collectionName) {

      case 'patients':
        return reqInfo.id
          ? PatientController.getById(reqInfo)
          : PatientController.getAll(reqInfo);

      case 'services':
        return reqInfo.id
          ? ServiceController.getById(reqInfo)
          : ServiceController.getAll(reqInfo);

      default:
        return undefined;
    }
  }

  post(reqInfo: RequestInfo) {
    switch (reqInfo.collectionName) {

      case 'patients':
        return PatientController.create(reqInfo);

      case 'services':
        return ServiceController.create(reqInfo);

      default:
        return undefined;
    }
  }


  put(reqInfo: RequestInfo) {
    switch (reqInfo.collectionName) {

      case 'patients':
        return PatientController.update(reqInfo);

      case 'services':
        return ServiceController.update(reqInfo);

      default:
        return undefined;
    }
  }

 
  delete(reqInfo: RequestInfo) {
    switch (reqInfo.collectionName) {

      case 'patients':
        return PatientController.delete(reqInfo);

      case 'services':
        return ServiceController.delete(reqInfo);

      default:
        return undefined;
    }
  }
}
