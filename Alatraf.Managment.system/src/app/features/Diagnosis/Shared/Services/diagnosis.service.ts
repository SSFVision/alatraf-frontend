import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { Observable } from 'rxjs';
import { ApiResult } from '../../../../core/models/ApiResult';
import { InjuryDto } from '../Models/injury.dto';

@Injectable({
  providedIn: 'root',
})
export class DiagnosisService extends BaseApiService {

  getInjuryReasons(): Observable<ApiResult<InjuryDto[]>> {
    return this.get<InjuryDto[]>('/lookup/injury-reasons');
    // TODO: replace endpoint later
  }

  getInjuryTypes(): Observable<ApiResult<InjuryDto[]>> {
    return this.get<InjuryDto[]>('/lookup/injury-types');
    // TODO: replace endpoint later
  }


  getInjurySides(): Observable<ApiResult<InjuryDto[]>> {
    return this.get<InjuryDto[]>('/lookup/injury-sides');
    // TODO: replace endpoint later
  }
}
