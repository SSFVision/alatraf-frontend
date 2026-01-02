import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResult } from '../../../../core/models/ApiResult';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { CreateServiceRequest } from '../Models/create-service.request';
import { UpdateServiceRequest } from '../Models/update-service.request';
import { ServiceDto } from '../../../../core/models/Shared/service.model';

@Injectable({ providedIn: 'root' })
export class OrganizationServiceService extends BaseApiService {
  private readonly endpoint = 'http://localhost:2003/api/v1/services';

  constructor(http: HttpClient) {
    super(http);
  }

  getServices(): Observable<ApiResult<ServiceDto[]>> {
    return this.get<ServiceDto[]>(this.endpoint);
  }

  getServiceById(serviceId: number): Observable<ApiResult<ServiceDto>> {
    return this.get<ServiceDto>(`${this.endpoint}/${serviceId}`);
  }

  createService(dto: CreateServiceRequest): Observable<ApiResult<ServiceDto>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.post<ServiceDto>(this.endpoint, dto, headers);
  }

  updateService(
    serviceId: number,
    dto: UpdateServiceRequest
  ): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.put<void>(`${this.endpoint}/${serviceId}`, dto, headers);
  }

  deleteService(serviceId: number): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.delete<void>(
      `${this.endpoint}/${serviceId}`,
      undefined,
      headers
    );
  }
}
