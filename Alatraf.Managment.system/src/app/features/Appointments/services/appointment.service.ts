import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


import { AppointmentDaySummaryDto } from '../Models/appointment-day-summary.dto';
import { AppointmentFilterRequest } from '../Models/appointment-filter.request';
import { AppointmentDto } from '../Models/appointment.dto';
import { ChangeAppointmentStatusRequest } from '../Models/change-appointment-status.request';
import { NextAppointmentDayDto } from '../Models/next-appointment-day.dto';
import { RescheduleAppointmentRequest } from '../Models/reschedule-appointment.request';
import { ApiResult } from '../../../core/models/ApiResult';
import { PageRequest } from '../../../core/models/Shared/page-request.model';
import { PaginatedList } from '../../../core/models/Shared/paginated-list.model';
import { BaseApiService } from '../../../core/services/base-api.service';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService extends BaseApiService {
  private readonly endpoint = 'http://localhost:2003/api/v1/appointments';

  getAppointments(
    filters: AppointmentFilterRequest,
    pagination: PageRequest
  ): Observable<ApiResult<PaginatedList<AppointmentDto>>> {
    let params = new HttpParams()
      .set('page', pagination.page)
      .set('pageSize', pagination.pageSize);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value as any);
      }
    });

    return this.get<PaginatedList<AppointmentDto>>(this.endpoint, params);
  }

  getAppointmentById(appointmentId: number): Observable<ApiResult<AppointmentDto>> {
    return this.get<AppointmentDto>(`${this.endpoint}/${appointmentId}`);
  }

  getLastScheduledDay(): Observable<ApiResult<AppointmentDaySummaryDto>> {
    return this.get<AppointmentDaySummaryDto>(`${this.endpoint}/scheduling/last-day`);
  }

  getNextValidDay(afterDate?: string): Observable<ApiResult<NextAppointmentDayDto>> {
    let params = new HttpParams();
    if (afterDate) {
      params = params.set('afterDate', afterDate);
    }
    return this.get<NextAppointmentDayDto>(`${this.endpoint}/scheduling/next-day`, params);
  }

  changeAppointmentStatus(
    appointmentId: number,
    dto: ChangeAppointmentStatusRequest
  ): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.put<void>(`${this.endpoint}/${appointmentId}/status`, dto, headers);
  }

  rescheduleAppointment(
    appointmentId: number,
    dto: RescheduleAppointmentRequest
  ): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.put<void>(`${this.endpoint}/${appointmentId}/reschedule`, dto, headers);
  }
}
