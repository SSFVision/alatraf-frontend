import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { UnitDto } from '../Models/unit.dto';
import { CreateUnitRequest } from '../Models/create-unit.request';
import { UpdateUnitRequest } from '../Models/update-unit.request';
import { ApiResult } from '../../../../core/models/ApiResult';
import { BaseApiService } from '../../../../core/services/base-api.service';

@Injectable({
  providedIn: 'root',
})
export class UnitService extends BaseApiService {
  private readonly endpoint = 'http://localhost:2003/api/v1/units';

  constructor(http: HttpClient) {
    super(http);
  }

  getUnits(): Observable<ApiResult<UnitDto[]>> {
    return this.get<UnitDto[]>(this.endpoint);
  }

  getUnitById(id: number): Observable<ApiResult<UnitDto>> {
    return this.get<UnitDto>(`${this.endpoint}/${id}`);
  }

  createUnit(
    request: CreateUnitRequest
  ): Observable<ApiResult<UnitDto>> {
    return this.post<UnitDto>(this.endpoint, request);
  }

  updateUnit(
    id: number,
    request: UpdateUnitRequest
  ): Observable<ApiResult<void>> {
    return this.put<void>(`${this.endpoint}/${id}`, request);
  }

  deleteUnit(id: number): Observable<ApiResult<void>> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }
}

