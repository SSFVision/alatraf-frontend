import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

import { BaseApiService } from '../../../core/services/base-api.service';
import { CacheService } from '../../../core/services/cache.service';
import { CACHE_KEYS } from '../../../core/constants/cache-keys.constants';

import { InjuryDto } from '../../../core/models/injuries/injury.dto';
import { CreateInjuryRequest } from '../models/create-injury-request.model';
import { UpdateInjuryRequest } from '../models/update-injury-request.model';
import { ApiResult } from '../../../core/models/ApiResult';

@Injectable({ providedIn: 'root' })
export class InjuriesManagementService extends BaseApiService {
  constructor(http: HttpClient, private cache: CacheService) {
    super(http);
  }

  private injuryTypesUrl = 'http://localhost:2003/api/v1/injury-types';
  private injurySidesUrl = 'http://localhost:2003/api/v1/injury-sides';
  private injuryReasonsUrl = 'http://localhost:2003/api/v1/injury-reasons';

  // ------------------ INJURY TYPES ------------------

  getInjuryTypes(): Observable<ApiResult<InjuryDto[]>> {
    const cached = this.cache.get<InjuryDto[]>(CACHE_KEYS.INJURY_TYPES);
    if (cached) {
      return of(ApiResult.success<InjuryDto[]>(cached));
    }

    return this.get<InjuryDto[]>(this.injuryTypesUrl).pipe(
      tap((res) => {
        if (res.isSuccess && res.data) {
          this.cache.set(CACHE_KEYS.INJURY_TYPES, res.data);
        }
      })
    );
  }

  createInjuryType(req: CreateInjuryRequest) {
    return this.post<InjuryDto>(this.injuryTypesUrl, req).pipe(
      tap(() => this.cache.clear(CACHE_KEYS.INJURY_TYPES))
    );
  }

  updateInjuryType(id: number, req: UpdateInjuryRequest) {
    return this.put<void>(`${this.injuryTypesUrl}/${id}`, req).pipe(
      tap(() => this.cache.clear(CACHE_KEYS.INJURY_TYPES))
    );
  }

  deleteInjuryType(id: number) {
    return this.delete<void>(`${this.injuryTypesUrl}/${id}`).pipe(
      tap(() => this.cache.clear(CACHE_KEYS.INJURY_TYPES))
    );
  }

  // ------------------ INJURY SIDES ------------------

  getInjurySides() {
    const cached = this.cache.get<InjuryDto[]>(CACHE_KEYS.INJURY_SIDES);
    if (cached) {
      return of(ApiResult.success<InjuryDto[]>(cached));
    }

    return this.get<InjuryDto[]>(this.injurySidesUrl).pipe(
      tap((res) => {
        if (res.isSuccess && res.data) {
          this.cache.set(CACHE_KEYS.INJURY_SIDES, res.data);
        }
      })
    );
  }

  createInjurySide(req: CreateInjuryRequest) {
    return this.post<InjuryDto>(this.injurySidesUrl, req).pipe(
      tap(() => this.cache.clear(CACHE_KEYS.INJURY_SIDES))
    );
  }

  updateInjurySide(id: number, req: UpdateInjuryRequest) {
    return this.put<void>(`${this.injurySidesUrl}/${id}`, req).pipe(
      tap(() => this.cache.clear(CACHE_KEYS.INJURY_SIDES))
    );
  }

  deleteInjurySide(id: number) {
    return this.delete<void>(`${this.injurySidesUrl}/${id}`).pipe(
      tap(() => this.cache.clear(CACHE_KEYS.INJURY_SIDES))
    );
  }

  // ------------------ INJURY REASONS ------------------

  getInjuryReasons() {
    const cached = this.cache.get<InjuryDto[]>(CACHE_KEYS.INJURY_REASONS);
    if (cached) {
      return of(ApiResult.success<InjuryDto[]>(cached));
    }

    return this.get<InjuryDto[]>(this.injuryReasonsUrl).pipe(
      tap((res) => {
        if (res.isSuccess && res.data) {
          this.cache.set(CACHE_KEYS.INJURY_REASONS, res.data);
        }
      })
    );
  }

  createInjuryReason(req: CreateInjuryRequest) {
    return this.post<InjuryDto>(this.injuryReasonsUrl, req).pipe(
      tap(() => this.cache.clear(CACHE_KEYS.INJURY_REASONS))
    );
  }

  updateInjuryReason(id: number, req: UpdateInjuryRequest) {
    return this.put<void>(`${this.injuryReasonsUrl}/${id}`, req).pipe(
      tap(() => this.cache.clear(CACHE_KEYS.INJURY_REASONS))
    );
  }

  deleteInjuryReason(id: number) {
    return this.delete<void>(`${this.injuryReasonsUrl}/${id}`).pipe(
      tap(() => this.cache.clear(CACHE_KEYS.INJURY_REASONS))
    );
  }
}
