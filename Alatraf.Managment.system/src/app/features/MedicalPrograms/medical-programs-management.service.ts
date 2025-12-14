import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

import { ApiResult } from '../../core/models/ApiResult';
import { MedicalProgramDto } from '../../core/models/medical-programs/medical-program.dto';
import { BaseApiService } from '../../core/services/base-api.service';

import { CreateMedicalProgramRequest } from './Models/create-medical-program-request.model';
import { UpdateMedicalProgramRequest } from './Models/update-medical-program-request.model';
import { CacheService } from '../../core/services/cache.service';
import { CACHE_KEYS } from '../../core/constants/cache-keys.constants';

@Injectable({ providedIn: 'root' })
export class MedicalProgramsManagementService extends BaseApiService {
  constructor(http: HttpClient, private cache: CacheService) {
    super(http);
  }

  private medicalProgramsUrl = 'http://localhost:2003/api/v1/medical-programs';

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
