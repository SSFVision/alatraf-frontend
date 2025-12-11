import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResult } from '../../../../core/models/ApiResult';
import { CreateTherapyCardRequest } from '../Models/create-therapy-card.request';
import { TherapyCardDiagnosisDto } from '../Models/therapy-card-diagnosis.dto';
import { UpdateTherapyCardRequest } from '../Models/update-therapy-card.request';
import { PageRequest } from '../../../../core/models/Shared/page-request.model';
import { PaginatedList } from '../../../../core/models/Shared/paginated-list.model';
import { TherapyCardFilterRequest } from '../Models/therapy-card-filter.request';
import { TherapyCardDto } from '../Models/therapy-card.dto';

@Injectable({
  providedIn: 'root',
})
export class TherapyDiagnosisService extends BaseApiService {
  private readonly endpoint = 'http://localhost:2003/api/v1/therapy-cards';


getAllTherapyCardPagenated(
  filter?: TherapyCardFilterRequest,
  pageRequest?: PageRequest
): Observable<ApiResult<PaginatedList<TherapyCardDto>>> {
  let params = new HttpParams();

  const page = pageRequest?.page ?? 1;
  const pageSize = pageRequest?.pageSize ?? 10;

  params = params
    .set('page', page)
    .set('pageSize', pageSize);

  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value as any);
      }
    });
  }
      const headers = new HttpHeaders().set('X-Enable-Loader', 'true');


  return this.get<PaginatedList<TherapyCardDto>>(this.endpoint, params,headers);
}

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
