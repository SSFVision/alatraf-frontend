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

@Injectable({
  providedIn: 'root',
})
export class TicketService extends BaseApiService {
  private readonly endpoint = 'http://localhost:2003/api/v1/tickets';

  constructor(http: HttpClient) {
    super(http);
  }

 getTickets(filter?: TicketFilterRequest): Observable<ApiResult<PaginatedList<TicketDto>>> {
  let params = new HttpParams();

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
}
