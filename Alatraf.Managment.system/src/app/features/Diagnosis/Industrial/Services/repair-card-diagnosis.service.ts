import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseApiService } from '../../../../core/services/base-api.service';
import { ApiResult } from '../../../../core/models/ApiResult';

import { RepairCardDiagnosisDto } from '../Models/repair-card-diagnosis.dto';
import { CreateRepairCardRequest } from '../Models/create-repair-card.request';
import { UpdateRepairCardRequest } from '../Models/update-repair-card.request';

@Injectable({
  providedIn: 'root',
})
export class RepairCardDiagnosisService extends BaseApiService {
  private readonly endpoint = 'repair-cards';


  getRepairCardById(
    repairCardId: number
  ): Observable<ApiResult<RepairCardDiagnosisDto>> {
    return this.get<RepairCardDiagnosisDto>(`${this.endpoint}/${repairCardId}`);
  }


  createRepairCard(
    dto: CreateRepairCardRequest
  ): Observable<ApiResult<RepairCardDiagnosisDto>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');

    return this.post<RepairCardDiagnosisDto>(this.endpoint, dto, headers);
  }

  updateRepairCard(
    repairCardId: number,
    dto: UpdateRepairCardRequest
  ): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set(
      'X-Success-Toast',
      'تم تعديل بطاقة الإصلاح بنجاح'
    );

    return this.put<void>(`${this.endpoint}/${repairCardId}`, dto, headers);
  }
}
