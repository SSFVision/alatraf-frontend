import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResult } from '../../../../core/models/ApiResult';
import { PageRequest } from '../../../../core/models/Shared/page-request.model';
import { PaginatedList } from '../../../../core/models/Shared/paginated-list.model';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { CreateSectionRequest } from '../Models/create-section.request';
import { SectionFilterRequest } from '../Models/section-filter.request';
import { SectionDto } from '../Models/section.dto';
import { UpdateSectionRequest } from '../Models/update-section.request';

@Injectable({
  providedIn: 'root',
})
export class SectionService extends BaseApiService {
  private readonly endpoint = 'http://localhost:2003/api/v1/sections';

  getSections(
    filters: SectionFilterRequest,
    pagination: PageRequest
  ): Observable<ApiResult<PaginatedList<SectionDto>>> {
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

    return this.get<PaginatedList<SectionDto>>(this.endpoint, params);
  }

  getSectionById(sectionId: number): Observable<ApiResult<SectionDto>> {
    return this.get<SectionDto>(`${this.endpoint}/${sectionId}`);
  }

  createSection(dto: CreateSectionRequest): Observable<ApiResult<SectionDto>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.post<SectionDto>(this.endpoint, dto, headers);
  }

  updateSection(
    sectionId: number,
    dto: UpdateSectionRequest
  ): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.put<void>(`${this.endpoint}/${sectionId}`, dto, headers);
  }

  deleteSection(sectionId: number): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.delete<void>(
      `${this.endpoint}/${sectionId}`,
      undefined,
      headers
    );
  }
}
