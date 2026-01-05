import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

import { ApiResult } from '../../../core/models/ApiResult';
import { BaseApiService } from '../../../core/services/base-api.service';
import { CreateIndustrialPartRequest } from '../models/create-industrial-part.request';
import { UpdateIndustrialPartRequest } from '../models/update-industrial-part.request';

import { CacheService } from '../../../core/services/cache.service';
import { CACHE_KEYS } from '../../../core/constants/cache-keys.constants';
import { IndustrialPartDto } from '../../../core/models/industrial-parts/industrial-partdto';
import { PageRequest } from '../../../core/models/Shared/page-request.model';
import { PaginatedList } from '../../../core/models/Shared/paginated-list.model';
import { IndustrialPartFilterRequest } from '../models/industrial-part-filter.request';

@Injectable({ providedIn: 'root' })
export class IndustrialPartsManagementService extends BaseApiService {
  constructor(http: HttpClient, private cache: CacheService) {
    super(http);
  }
  private industrialPartsUrl = 'http://localhost:2003/api/v1/industrial-parts';

  getIndustrialPartsWithFilters(
    filters: IndustrialPartFilterRequest,
    pagination: PageRequest
  ): Observable<ApiResult<PaginatedList<IndustrialPartDto>>> {
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

    return this.get<PaginatedList<IndustrialPartDto>>(
      `${this.industrialPartsUrl}/with-filters`,
      params
    );
  }

  getIndustrialParts(): Observable<ApiResult<IndustrialPartDto[]>> {
    // const cached = this.cache.get<IndustrialPartDto[]>(
    //   CACHE_KEYS.INDUSTRIAL_PARTS
    // );

    // if (cached) {
    //   return of(ApiResult.success(cached));
    // }

    return this.get<IndustrialPartDto[]>(this.industrialPartsUrl)
    
    // .pipe(
    //   tap((res) => {
    //     if (res.isSuccess && res.data) {
    //       this.cache.set(CACHE_KEYS.INDUSTRIAL_PARTS, res.data);
    //     }
    //   })
    // );
  }
 getIndustrialPartById(
    id: number
  ): Observable<ApiResult<IndustrialPartDto>> {
    return this.get<IndustrialPartDto>(
      `${this.industrialPartsUrl}/${id}`
    );
  }
  createIndustrialPart(
    request: CreateIndustrialPartRequest
  ): Observable<ApiResult<IndustrialPartDto>> {
    return this.post<IndustrialPartDto>(this.industrialPartsUrl, request)
    
    // .pipe(
    //   tap(() => this.cache.clear(CACHE_KEYS.INDUSTRIAL_PARTS))
    // );
  }

  updateIndustrialPart(
    id: number,
    request: UpdateIndustrialPartRequest
  ): Observable<ApiResult<void>> {
    return this.put<void>(`${this.industrialPartsUrl}/${id}`, request)
    
    // .pipe(
    //   tap(() => this.cache.clear(CACHE_KEYS.INDUSTRIAL_PARTS))
    // );
  }

  deleteIndustrialPart(id: number): Observable<ApiResult<void>> {
    return this.delete<void>(`${this.industrialPartsUrl}/${id}`)
    // .pipe(
    //   tap(() => this.cache.clear(CACHE_KEYS.INDUSTRIAL_PARTS))
    // );
  }
}
