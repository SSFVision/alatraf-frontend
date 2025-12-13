import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResult } from '../../../core/models/ApiResult';
import { BaseApiService } from '../../../core/services/base-api.service';
import { CreateSessionRequest } from '../Models/create-session.request';
import { SessionDto } from '../Models/session.dto';
import { TherapyCardDto } from '../Models/therapy-card.dto';
import { PageRequest } from '../../../core/models/Shared/page-request.model';
import { PaginatedList } from '../../../core/models/Shared/paginated-list.model';
import { TherapyCardDiagnosisDto } from '../../Diagnosis/Therapy/Models/therapy-card-diagnosis.dto';
import { GetPaidTherapyCardsFilterRequest } from '../Models/get-paid-therapy-cards-filter.request';

@Injectable({
  providedIn: 'root',
})
export class TherapySessionService extends BaseApiService {
  private readonly endpoint = 'http://localhost:2003/api/v1/therapy-cards';

  createSession(
    therapyCardId: number,
    request: CreateSessionRequest
  ): Observable<ApiResult<SessionDto[]>> {
    return this.post<SessionDto[]>(
      `${this.endpoint}/${therapyCardId}/create-session`,
      request
    );
  }

  getAllSessionsByTherapyCardId(
  therapyCardId: number
): Observable<ApiResult<SessionDto[]>> {
  return this.get<SessionDto[]>(
    `${this.endpoint}/${therapyCardId}/sessions`
  );
}
 getPaidTherapyCards(
    filter?: GetPaidTherapyCardsFilterRequest,
    pageRequest?: PageRequest
  ): Observable<ApiResult<PaginatedList<TherapyCardDiagnosisDto>>> {
    let params = new HttpParams();

    // Pagination
    params = params
      .set('page', pageRequest?.page ?? 1)
      .set('pageSize', pageRequest?.pageSize ?? 20);

    // Filters
    if (filter) {
      if (filter.searchTerm) {
        params = params.set('searchTerm', filter.searchTerm);
      }

      if (filter.sortColumn) {
        params = params.set('sortColumn', filter.sortColumn);
      }

      if (filter.sortDirection) {
        params = params.set('sortDirection', filter.sortDirection);
      }
    }
    console.log(" endpoint caleed here ");

    return this.get<PaginatedList<TherapyCardDiagnosisDto>>(
      `${this.endpoint}/paid`,
      params
    );
  }

}
