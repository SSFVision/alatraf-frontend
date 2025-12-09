import { Injectable, inject, signal } from '@angular/core';
import { tap, map } from 'rxjs/operators';

import { BaseFacade } from '../../../core/utils/facades/base-facade';
import { ApiResult } from '../../../core/models/ApiResult';

import { TicketService } from './ticket.service';
import { TicketDto, TicketStatus } from './models/ticket.model';
import { TicketFilterRequest } from './models/ticket-filter.model';
import { PageRequest } from '../../../core/models/Shared/page-request.model';

import { SearchManager } from '../../../core/utils/search-manager';

@Injectable({ providedIn: 'root' })
export class TicketFacade extends BaseFacade {
  private service = inject(TicketService);

  // ---------------------------------------------
  // SIGNALS
  // ---------------------------------------------
  private _tickets = signal<TicketDto[]>([]);
  tickets = this._tickets.asReadonly();

  private _filters = signal<TicketFilterRequest>({
    searchTerm: '',
    sortBy: 'createdAt',
    sortDirection: 'desc',
    serviceId: undefined,
    departmentId: undefined,
    patientId: undefined,
    status: undefined,
    createdFrom: null,
    createdTo: null,
  });
  filters = this._filters.asReadonly();

  private _pageRequest = signal<PageRequest>({
    page: 1,
    pageSize: 5,
  });
  pageRequest = this._pageRequest.asReadonly();

  totalCount = signal<number>(0);
  createdTicketId = signal<number | null>(null);
  formValidationErrors = signal<Record<string, string[]>>({});


  constructor() {
    super();
  }

  private searchManager = new SearchManager<TicketDto[]>(
    (term: string) =>
      this.service
        .getTickets(
          { ...this._filters(), searchTerm: term },
          this._pageRequest()
        )
        .pipe(
          tap(result => {
            if (!result.isSuccess) this.handleLoadTicketsError(result);
          }),
          map(result =>
            result.isSuccess && result.data?.items
              ? result.data.items
              : []
          )
        ),
    null,
    (items: TicketDto[]) => this._tickets.set(items)
  );


  search(term: string) {
    this._filters.update(f => ({ ...f, searchTerm: term }));
    this._pageRequest.update(p => ({ ...p, page: 1 }));

    this.searchManager.search(term);
  }


  updateFilters(newFilters: Partial<TicketFilterRequest>) {
    this._filters.update(f => ({ ...f, ...newFilters }));
  }

  updateDepartment(deptId: number | null) {
    this._filters.update(f => ({
      ...f,
      departmentId: deptId ?? undefined,
    }));

    this._pageRequest.update(p => ({ ...p, page: 1 }));
    this.loadTickets();
  }

  updateService(serviceId: number | null) {
    this._filters.update(f => ({
      ...f,
      serviceId: serviceId ?? undefined,
    }));

    this._pageRequest.update(p => ({ ...p, page: 1 }));
    this.loadTickets();
  }


  setPage(page: number) {
    this._pageRequest.update(p => ({ ...p, page }));
    this.loadTickets();
  }

  setPageSize(size: number) {
    this._pageRequest.update(p => ({
      ...p,
      pageSize: size,
      page: 1
    }));

    this.loadTickets();
  }


  loadTickets() {
    this.service
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
        })
      )
      .subscribe();
  }

  createTicket(dto: any) {
    return this.handleCreateOrUpdate(this.service.createTicket(dto), {
      successMessage: 'تم إنشاء التذكرة بنجاح',
      defaultErrorMessage: 'فشل إنشاء التذكرة. حاول لاحقاً.',
    }).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.createdTicketId.set(res.data.ticketId);
          this.formValidationErrors.set({});
          this.loadTickets();
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }


  private handleLoadTicketsError(result: ApiResult<any>) {
    const err = this.extractError(result);

    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }

    this.toast.error('تعذر تحميل قائمة التذاكر. يرجى المحاولة لاحقاً.');
  }
}
