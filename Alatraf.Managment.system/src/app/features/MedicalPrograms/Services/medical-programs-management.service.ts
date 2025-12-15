import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { CACHE_KEYS } from '../../../core/constants/cache-keys.constants';
import { ApiResult } from '../../../core/models/ApiResult';
import { MedicalProgramDto } from '../../../core/models/medical-programs/medical-program.dto';
import { PageRequest } from '../../../core/models/Shared/page-request.model';
import { PaginatedList } from '../../../core/models/Shared/paginated-list.model';
import { BaseApiService } from '../../../core/services/base-api.service';
import { CacheService } from '../../../core/services/cache.service';
import { CreateMedicalProgramRequest } from '../Models/create-medical-program-request.model';
import { MedicalProgramsFilterRequest } from '../Models/medical-programs-filter.request';
import { UpdateMedicalProgramRequest } from '../Models/update-medical-program-request.model';


@Injectable({ providedIn: 'root' })
export class MedicalProgramsManagementService extends BaseApiService {
  constructor(http: HttpClient, private cache: CacheService) {
    super(http);
  }

  private medicalProgramsUrl = 'http://localhost:2003/api/v1/medical-programs';

  getMedicalProgramsWithFilters(
    filters: MedicalProgramsFilterRequest,
    pagination: PageRequest
  ): Observable<ApiResult<PaginatedList<MedicalProgramDto>>> {
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

    return this.get<PaginatedList<MedicalProgramDto>>(
      `${this.medicalProgramsUrl}/with-filters`,
      params
    );
  }

  getMedicalPrograms(): Observable<ApiResult<MedicalProgramDto[]>> {
    const cached = this.cache.get<MedicalProgramDto[]>(
      CACHE_KEYS.MEDICAL_PROGRAMS
    );

    if (cached) {
      return of(ApiResult.success(cached));
    }

    return this.get<MedicalProgramDto[]>(this.medicalProgramsUrl).pipe(
      tap((res) => {
        if (res.isSuccess && res.data) {
          this.cache.set(CACHE_KEYS.MEDICAL_PROGRAMS, res.data);
        }
      })
    );
  }
  getMedicalProgramById(id: number): Observable<ApiResult<MedicalProgramDto>> {
    return this.get<MedicalProgramDto>(`${this.medicalProgramsUrl}/${id}`);
  }

  createMedicalProgram(request: CreateMedicalProgramRequest) {
    return this.post<MedicalProgramDto>(this.medicalProgramsUrl, request).pipe(
      tap(() => this.cache.clear(CACHE_KEYS.MEDICAL_PROGRAMS))
    );
  }

  updateMedicalProgram(id: number, request: UpdateMedicalProgramRequest) {
    return this.put<void>(`${this.medicalProgramsUrl}/${id}`, request).pipe(
      tap(() => this.cache.clear(CACHE_KEYS.MEDICAL_PROGRAMS))
    );
  }

  deleteMedicalProgram(id: number) {
    return this.delete<void>(`${this.medicalProgramsUrl}/${id}`).pipe(
      tap(() => this.cache.clear(CACHE_KEYS.MEDICAL_PROGRAMS))
    );
  }
}
