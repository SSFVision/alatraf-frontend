import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';

// import { PATIENTS_MOCK_DATA } from './patients/patient.mock';
// import { PatientController } from './patients/patient.controller';

import { MOCK_SERVICES } from './services/mock-services.data';
import { ServiceController } from './services/service.controller';

import { IdentityController } from './identity/identity.controller';
import { IDENTITY_USERS_MOCK } from './identity/identity.mock';


export class InMemoryDataService implements InMemoryDbService {

  private readonly PATIENTS = 'patients';
  private readonly SERVICES = 'services';
  private readonly IDENTITY = 'identity';
 
  // -----------------------------------------------------
  // DATABASE
  // -----------------------------------------------------
  createDb() {
    return {
      [this.SERVICES]: MOCK_SERVICES,
      [this.IDENTITY]: IDENTITY_USERS_MOCK,

      
    };
  }

  // -----------------------------------------------------
  // GET ROUTER
  // -----------------------------------------------------
  get(reqInfo: RequestInfo) {
    const url = reqInfo.req.url;

    // auth
    if (url.includes('/identity/current-user/claims')) {
      return IdentityController.getCurrentUser(reqInfo);
    }


    // standard routes
    const entity = reqInfo.collectionName;

    switch (entity) {
  
      case this.SERVICES:
        return reqInfo.id ? ServiceController.getById(reqInfo) : ServiceController.getAll(reqInfo);

    }

    return undefined;
  }

  // -----------------------------------------------------
  // POST ROUTER
  // -----------------------------------------------------
  post(reqInfo: RequestInfo) {
    const url = reqInfo.req.url;

    // auth
    if (url.includes('/identity/token/generate')) return IdentityController.login(reqInfo);
    if (url.includes('/identity/token/refresh-token')) return IdentityController.refresh(reqInfo);

    // 🔥 therapy waiting patients — FIXED
  

    const entity = reqInfo.collectionName;

    switch (entity) {
   
      case this.SERVICES:
        return ServiceController.create(reqInfo);
}

    return undefined;
  }

  // -----------------------------------------------------
  // PUT ROUTER
  // -----------------------------------------------------
  put(reqInfo: RequestInfo) {
    const entity = reqInfo.collectionName;

    switch (entity) {
   
      case this.SERVICES:
        return ServiceController.update(reqInfo);
    }

    return undefined;
  }

  // -----------------------------------------------------
  // DELETE ROUTER
  // -----------------------------------------------------
  delete(reqInfo: RequestInfo) {
    const entity = reqInfo.collectionName;

    switch (entity) {
    
      case this.SERVICES:
        return ServiceController.delete(reqInfo);
}

    return undefined;
  }
}
