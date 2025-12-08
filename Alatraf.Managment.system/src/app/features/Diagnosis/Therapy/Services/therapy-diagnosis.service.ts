import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResult } from '../../../../core/models/ApiResult';
import { CreateTherapyCardRequest } from '../Models/create-therapy-card.request';
import { TherapyCardDiagnosisDto } from '../Models/therapy-card-diagnosis.dto';
import { UpdateTherapyCardRequest } from '../Models/update-therapy-card.request';

@Injectable({
  providedIn: 'root',
})
export class TherapyDiagnosisService extends BaseApiService {
  private readonly endpoint = 'http://localhost:2003/api/v1/therapy-cards';

  getTherapyCardById(
    therapyCardId: number
  ): Observable<ApiResult<TherapyCardDiagnosisDto>> {
    return this.get<TherapyCardDiagnosisDto>(
      `${this.endpoint}/${therapyCardId}`
    );
  }

  createTherapyCard(
    dto: CreateTherapyCardRequest
  ): Observable<ApiResult<TherapyCardDiagnosisDto>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');

    return this.post<TherapyCardDiagnosisDto>(this.endpoint, dto, headers);
  }

  updateTherapyCard(
    therapyCardId: number,
    dto: UpdateTherapyCardRequest
  ): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set(
      'X-Success-Toast',
      'تم تعديل بطاقة العلاج بنجاح'
    );

    return this.put<void>(`${this.endpoint}/${therapyCardId}`, dto, headers);
  }
}
