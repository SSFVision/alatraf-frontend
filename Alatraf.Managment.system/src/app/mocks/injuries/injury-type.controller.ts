import { RequestInfo } from 'angular-in-memory-web-api';
import { INJURY_TYPES_MOCK } from './injury-types.mock';
import { InjuryDto } from '../../features/Diagnosis/Shared/Models/injury.dto';

export class InjuryTypeController {
  static getAll(reqInfo: RequestInfo) {
    try {
      const items = reqInfo.collection as InjuryDto[];

      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: items,
      }));
    } catch (error) {
      return this.serverError(reqInfo, 'Failed to load injury types.');
    }
  }

  private static serverError(reqInfo: RequestInfo, detail: string) {
    return reqInfo.utils.createResponse$(() => ({
      status: 500,
      error: {
        type: 'server-error',
        title: 'Server Error',
        status: 500,
        detail,
      },
    }));
  }
}
