import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from '../../../core/models/ApiResult';
import { PageRequest } from '../../../core/models/Shared/page-request.model';
import { PaginatedList } from '../../../core/models/Shared/paginated-list.model';
import { BaseApiService } from '../../../core/services/base-api.service';
import { AddDisabledCardRequest } from '../models/disabled-Models/add-disabled-card.request';
import { DisabledCardDto } from '../models/disabled-Models/disabled-card.dto';
import { DisabledCardsFilterRequest } from '../models/disabled-Models/disabled-cards-filter.request';
import { UpdateDisabledCardRequest } from '../models/disabled-Models/update-disabled-card.request';



@Injectable({
  providedIn: 'root',
})
export class DisabledCardsService extends BaseApiService {
  private readonly endpoint = 'disabled-cards';

  getDisabledCards(
    filters: DisabledCardsFilterRequest,
    pagination: PageRequest
  ): Observable<ApiResult<PaginatedList<DisabledCardDto>>> {
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

    return this.get<PaginatedList<DisabledCardDto>>(this.endpoint, params);
  }

  getDisabledCardByNumber(
    cardNumber: string
  ): Observable<ApiResult<DisabledCardDto>> {
    return this.get<DisabledCardDto>(
      `${this.endpoint}/by-number/${cardNumber}`
    );
  }

  createDisabledCard(
    dto: AddDisabledCardRequest
  ): Observable<ApiResult<DisabledCardDto>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.post<DisabledCardDto>(this.endpoint, dto, headers);
  }

  updateDisabledCard(
    disabledCardId: number,
    dto: UpdateDisabledCardRequest
  ): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.put<void>(
      `${this.endpoint}/${disabledCardId}`,
      dto,
      headers
    );
  }

  deleteDisabledCard(
    disabledCardId: number
  ): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.delete<void>(
      `${this.endpoint}/${disabledCardId}`,
      undefined,
      headers
    );
  }
}
