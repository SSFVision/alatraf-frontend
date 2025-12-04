import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { Observable } from 'rxjs';
import { ApiResult } from '../../../../core/models/ApiResult';
import { InjuryDto } from '../Models/injury.dto';

@Injectable({
  providedIn: 'root',
})
export class DiagnosisService extends BaseApiService {

 
  /** Load injury reasons */
  getInjuryReasons(): Observable<ApiResult<InjuryDto[]>> {
    return this.get<InjuryDto[]>('/injuries/reasons');
  }

  /** Load injury types */
  getInjuryTypes(): Observable<ApiResult<InjuryDto[]>> {
    return this.get<InjuryDto[]>('/injuries/types');
  }

  /** Load injury sides */
  getInjurySides(): Observable<ApiResult<InjuryDto[]>> {
    return this.get<InjuryDto[]>('/injuries/sides');
  }
}
