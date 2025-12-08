import { Injectable, inject, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ApiResult } from '../../../core/models/ApiResult';
import { BaseFacade } from '../../../core/utils/facades/base-facade';
import { SearchManager } from '../../../core/utils/search-manager';

import { TicketFilterRequest } from './models/ticket-filter.model';
import { TicketDto } from './models/ticket.model';
import { TicketService } from './ticket.service';

@Injectable({
  providedIn: 'root',
})
export class TicketFacade extends BaseFacade {
  private ticketService = inject(TicketService);

  // =============================================
  // STATE
  // =============================================
  private _tickets = signal<TicketDto[]>([]);
  tickets = this._tickets.asReadonly();

  private _filters = signal<TicketFilterRequest>({
    searchTerm: '',
    serviceId: undefined,
    status: undefined,
    createdFrom: undefined,
  });
  filters = this._filters.asReadonly();

  createdTicketId = signal<number | null>(null);
  formValidationErrors = signal<Record<string, string[]>>({});

  constructor() {
    super();
  }

  // =============================================
  // SEARCH MANAGER (NO CACHE)
  // =============================================
  private searchManager = new SearchManager<TicketDto[]>(
    (term: string) =>
      this.ticketService
        .getTickets({ ...this._filters(), searchTerm: term })
        .pipe(
          tap((res: ApiResult<any>) => {
            if (!res.isSuccess) this.handleSearchError(res);
          }),
          map((res: ApiResult<any>) =>
            res.isSuccess && res.data?.items ? res.data.items : []
          )
        ),
    null, // NO CACHE
    (data) => this._tickets.set(data)
  );

  // =============================================
  // FILTERS
  // =============================================
  updateFilters(newFilters: Partial<TicketFilterRequest>) {
    this._filters.update((f) => ({ ...f, ...newFilters }));
  }

  // =============================================
  // SEARCH
  // =============================================
  search(term: string): void {
    this.updateFilters({ searchTerm: term });
    this.searchManager.search(term);
  }

  // =============================================
  // LOAD ALL TICKETS
  // =============================================
  loadTickets(): void {
    this.ticketService
      .getTickets(this._filters())
      .pipe(
        tap((result: ApiResult<any>) => {
          if (result.isSuccess && result.data?.items) {
            this._tickets.set(result.data.items);
          } else {
            this._tickets.set([]);
            this.handleLoadTicketsError(result);
          }
        })
      )
      .subscribe();
  }

  // =============================================
  // CREATE TICKET
  // =============================================
  createTicket(dto: any) {
    return this.handleCreateOrUpdate(this.ticketService.createTicket(dto), {
      successMessage: 'تم إنشاء التذكرة بنجاح',
      defaultErrorMessage: 'فشل إنشاء التذكرة. حاول لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.createdTicketId.set(res.data.ticketId);
          this.formValidationErrors.set({});
          this.loadTickets(); // reload after create
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  // =============================================
  // ERROR HANDLERS
  // =============================================
  private handleLoadTicketsError(result: ApiResult<any>) {
    const err = this.extractError(result);
    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }
    this.toast.error('تعذر تحميل قائمة التذاكر. يرجى المحاولة لاحقاً.');
  }

  private handleSearchError(result: ApiResult<any>) {
    const err = this.extractError(result);
    if (err.type === 'validation' || err.type === 'business') {
      this.toast.info(err.message);
      return;
    }
    this.toast.error('حدث خطأ أثناء عملية البحث.');
  }
}
