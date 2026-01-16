import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResult } from '../../../core/models/ApiResult';
import { BaseApiService } from '../../../core/services/base-api.service';
import {
  CreateTicketRequest,
  TicketDto,
  UpdateTicketRequest,
} from './models/ticket.model';
import { TicketFilterRequest } from './models/ticket-filter.model';
import { PaginatedList } from '../../../core/models/Shared/paginated-list.model';
import { PageRequest } from '../../../core/models/Shared/page-request.model';
import { AppointmentDto } from '../../Appointments/Models/appointment.dto';
import { ScheduleAppointmentRequest } from './models/schedule-appointment.request';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TicketService extends BaseApiService {
  private readonly endpoint = 'tickets';

  constructor(http: HttpClient) {
    super(http);
  }

  getTickets(
    filter?: TicketFilterRequest,
    pageRequest?: PageRequest
  ): Observable<ApiResult<PaginatedList<TicketDto>>> {
    let params = new HttpParams();

    const page = pageRequest?.page ?? 1;
    const pageSize = pageRequest?.pageSize ?? 10;

    params = params.set('page', page).set('pageSize', pageSize);

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value as any);
        }
      });
    }

    return this.get<PaginatedList<TicketDto>>(this.endpoint, params);
  }

  getTicketById(id: number): Observable<ApiResult<TicketDto>> {
    return this.get<TicketDto>(`${this.endpoint}/${id}`);
  }

  createTicket(dto: CreateTicketRequest): Observable<ApiResult<TicketDto>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.post<TicketDto>(this.endpoint, dto, headers);
  }

  deleteTicket(id: number): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.delete<void>(`${this.endpoint}/${id}`, undefined, headers);
  }
  updateTicket(
    ticketId: number,
    dto: UpdateTicketRequest
  ): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');

    return this.put<void>(`${this.endpoint}/${ticketId}`, dto, headers);
  }

  scheduleAppointment(
    ticketId: number,
    dto: ScheduleAppointmentRequest
  ): Observable<ApiResult<AppointmentDto>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    // The endpoint is built by appending to the specific ticket's resource URL
    return this.post<AppointmentDto>(
      `${this.endpoint}/${ticketId}/appointment`,
      dto,
      headers
    );
  }
 printTicket(ticketId: number): Observable<Blob> {
    return this.postBlob(`/tickets/${ticketId}/print`);
  }
}
