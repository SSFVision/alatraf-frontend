import { Injectable, inject, signal } from '@angular/core';
import { map, tap } from 'rxjs/operators';

import { ApiResult } from '../../../core/models/ApiResult';
import { BaseFacade } from '../../../core/utils/facades/base-facade';
import { SearchManager } from '../../../core/utils/search-manager';

import { TicketFilterRequest } from './models/ticket-filter.model';
import { TicketDto } from './models/ticket.model';
import { TicketService } from './ticket.service';
import { PageRequest } from '../../../core/models/Shared/page-request.model';

@Injectable({
  providedIn: 'root',
})
export class TicketFacade extends BaseFacade {
  private ticketService = inject(TicketService);

  // ================================
  // Signals
  // ================================

  private _tickets = signal<TicketDto[]>([]);
  tickets = this._tickets.asReadonly();

  private _filters = signal<TicketFilterRequest>({
    searchTerm: '',
    serviceId: undefined,
    status: undefined,
    createdFrom: undefined,
    createdTo: undefined,
  });
  filters = this._filters.asReadonly();

  private _pageRequest = signal<PageRequest>({
    page: 1,
    pageSize: 5,
  });
  pageRequest = this._pageRequest.asReadonly();

  totalCount = signal<number>(0); // total items for pagination

  createdTicketId = signal<number | null>(null);
  formValidationErrors = signal<Record<string, string[]>>({});

  constructor() {
    super();
  }

  // ================================
  // Search Manager (Debounced Search)
  // ================================
  private searchManager = new SearchManager<TicketDto[]>(
    (term: string) =>
      this.ticketService
        .getTickets(
          { ...this._filters(), searchTerm: term },
          this._pageRequest(),
        )
        .pipe(
          tap((res: ApiResult<any>) => {
            if (!res.isSuccess) this.handleSearchError(res);
          }),
          map((res: ApiResult<any>) =>
            res.isSuccess && res.data?.items ? res.data.items : [],
          ),
        ),
    null, // no caching
    (data) => this._tickets.set(data),
  );

  // ================================
  // Filter Operations
  // ================================
  updateFilters(newFilters: Partial<TicketFilterRequest>) {
    this._filters.update((f) => ({ ...f, ...newFilters }));
  }

  search(term: string): void {
    this._pageRequest.update((p) => ({ ...p, page: 1 })); // reset page on search
    this.updateFilters({ searchTerm: term });
    this.searchManager.search(term);
  }

  // ================================
  // Pagination Operations
  // ================================
  setPage(page: number) {
    this._pageRequest.update((p) => ({ ...p, page }));
    this.loadTickets();
  }

  setPageSize(size: number) {
    this._pageRequest.update((p) => ({
      ...p,
      pageSize: size,
      page: 1, // always reset page
    }));
    this.loadTickets();
  }

  // ================================
  // Load Tickets
  // ================================
  loadTickets(): void {
    this.ticketService
      .getTickets(this._filters(), this._pageRequest())
      .pipe(
        tap((result: ApiResult<any>) => {
          if (result.isSuccess && result.data?.items) {
            this._tickets.set(result.data.items);
            this.totalCount.set(result.data.totalCount ?? 0);
          } else {
            this._tickets.set([]);
            this.totalCount.set(0);
            this.handleLoadTicketsError(result);
          }
        }),
      )
      .subscribe();
  }

  // ================================
  // Create Ticket
  // ================================
  createTicket(dto: any) {
    return this.handleCreateOrUpdate(this.ticketService.createTicket(dto), {
      successMessage: 'تم إنشاء التذكرة بنجاح',
      defaultErrorMessage: 'فشل إنشاء التذكرة. حاول لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.createdTicketId.set(res.data.ticketId);
          this.formValidationErrors.set({});
          this.loadTickets(); // reload list
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      }),
    );
  }

  // ================================
  // Error Handling
  // ================================
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
