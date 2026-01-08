import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResult } from '../../../core/models/ApiResult';
import { PageRequest } from '../../../core/models/Shared/page-request.model';
import { PaginatedList } from '../../../core/models/Shared/paginated-list.model';
import { BaseApiService } from '../../../core/services/base-api.service';
import { CreateHolidayRequest } from '../Models/create-holiday.request';
import { HolidayDto } from '../Models/holiday.dto';
import { HolidayFilterRequest } from '../Models/holiday-filter.request';
import { UpdateHolidayRequest } from '../Models/update-holiday.request';

@Injectable({ providedIn: 'root' })
export class HolidayService extends BaseApiService {
  private readonly endpoint = 'holidays';

  getHolidays(
    filters: HolidayFilterRequest,
    pagination: PageRequest
  ): Observable<ApiResult<PaginatedList<HolidayDto>>> {
    let params = new HttpParams()
      .set('page', pagination.page)
      .set('pageSize', pagination.pageSize);

    Object.entries(filters || {}).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value as any);
      }
    });

    return this.get<PaginatedList<HolidayDto>>(this.endpoint, params);
  }

  getHolidayById(id: number): Observable<ApiResult<HolidayDto>> {
    return this.get<HolidayDto>(`${this.endpoint}/${id}`);
  }

  createHoliday(dto: CreateHolidayRequest): Observable<ApiResult<HolidayDto>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.post<HolidayDto>(this.endpoint, dto, headers);
  }

  updateHoliday(
    id: number,
    dto: UpdateHolidayRequest
  ): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.put<void>(`${this.endpoint}/${id}`, dto, headers);
  }

  deleteHoliday(id: number): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.delete<void>(`${this.endpoint}/${id}`, undefined, headers);
  }
}
