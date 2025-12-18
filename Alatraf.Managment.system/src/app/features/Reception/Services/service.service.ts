import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResult } from '../../../core/models/ApiResult';
import { BaseApiService } from '../../../core/services/base-api.service';
import { ServiceDto, CreateUpdateServiceDto } from './models/service.model';



@Injectable({
  providedIn: 'root',
})
export class ServiceService extends BaseApiService {
  
  private readonly endpoint = 'http://localhost:2003/api/v1/services';

  constructor(http: HttpClient) {
    super(http);
  }

  getServices(): Observable<ApiResult<ServiceDto[]>> {
    return this.get<ServiceDto[]>(this.endpoint);
  }
  getServiceById(id: number): Observable<ApiResult<ServiceDto>> {
    return this.get<ServiceDto>(`${this.endpoint}/${id}`);
  }

  createService(dto: CreateUpdateServiceDto): Observable<ApiResult<ServiceDto>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');

    return this.post<ServiceDto>(this.endpoint, dto, headers);
  }
  updateService(
    id: number,
    dto: CreateUpdateServiceDto
  ): Observable<ApiResult<ServiceDto>> {
    
    const headers = new HttpHeaders().set('X-Success-Toast', 'تم تحديث الخدمة بنجاح');

    return this.put<ServiceDto>(`${this.endpoint}/${id}`, dto);
  }

  deleteService(id: number): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.delete<void>(`${this.endpoint}/${id}`, undefined, headers);
  }
}
