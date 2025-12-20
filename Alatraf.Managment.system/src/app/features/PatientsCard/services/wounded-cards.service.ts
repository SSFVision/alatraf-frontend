import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from '../../../core/models/ApiResult';
import { PageRequest } from '../../../core/models/Shared/page-request.model';
import { PaginatedList } from '../../../core/models/Shared/paginated-list.model';
import { BaseApiService } from '../../../core/services/base-api.service';
import { AddWoundedCardRequest } from '../models/Wounded-models/add-wounded-card.request';
import { UpdateWoundedCardRequest } from '../models/Wounded-models/update-wounded-card.request';
import { WoundedCardDto } from '../models/Wounded-models/wounded-card.dto';
import { WoundedCardsFilterRequest } from '../models/Wounded-models/wounded-cards-filter.request';

@Injectable({
  providedIn: 'root',
})
export class WoundedCardsService extends BaseApiService {
  private readonly endpoint = 'http://localhost:2003/api/v1/wounded-cards';

  getWoundedCards(
    filters: WoundedCardsFilterRequest,
    pagination: PageRequest
  ): Observable<ApiResult<PaginatedList<WoundedCardDto>>> {
    let params = new HttpParams()
      .set('page', pagination.page)
      .set('pageSize', pagination.pageSize);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(key, value as any);
        }
      });
    }

    return this.get<PaginatedList<WoundedCardDto>>(this.endpoint, params);
  }

  getWoundedCardByNumber(
    cardNumber: string
  ): Observable<ApiResult<WoundedCardDto>> {
    return this.get<WoundedCardDto>(`${this.endpoint}/by-number/${cardNumber}`);
  }

  createWoundedCard(
    dto: AddWoundedCardRequest
  ): Observable<ApiResult<WoundedCardDto>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.post<WoundedCardDto>(this.endpoint, dto, headers);
  }

  updateWoundedCard(
    woundedCardId: number,
    dto: UpdateWoundedCardRequest
  ): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.put<void>(`${this.endpoint}/${woundedCardId}`, dto, headers);
  }

  deleteWoundedCard(woundedCardId: number): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.delete<void>(
      `${this.endpoint}/${woundedCardId}`,
      undefined,
      headers
    );
  }
}
