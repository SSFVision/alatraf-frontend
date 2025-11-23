import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResult } from '../../../core/models/ApiResult';
import { BaseApiService } from '../../../core/services/base-api.service';
import { CreateTicketDto } from './models/create-ticket.dto';
import { TicketDto } from './models/ticket.model';

@Injectable({
  providedIn: 'root',
})
export class TicketService extends BaseApiService {
  private readonly endpoint = '/tickets';

  constructor(http: HttpClient) {
    super(http);
  }

  getTickets(): Observable<ApiResult<TicketDto[]>> {
    return this.get<TicketDto[]>(this.endpoint);
  }
  getTicketById(id: number): Observable<ApiResult<TicketDto>> {
    return this.get<TicketDto>(`${this.endpoint}/${id}`);
  }

  createTicket(dto: CreateTicketDto): Observable<ApiResult<TicketDto>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.post<TicketDto>(this.endpoint, dto, headers);
  }

  deleteTicket(id: number): Observable<ApiResult<void>> {
    const headers = new HttpHeaders().set('X-Enable-Loader', 'true');
    return this.delete<void>(`${this.endpoint}/${id}`, undefined, headers);
  }
}
