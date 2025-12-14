import { Injectable, inject, signal } from '@angular/core';
import { tap, map } from 'rxjs/operators';

import { BaseFacade } from '../../../core/utils/facades/base-facade';
import { ApiResult } from '../../../core/models/ApiResult';
import { PageRequest } from '../../../core/models/Shared/page-request.model';

import { PaymentsService } from '../Services/payments.service';
import { PaymentWaitingListDto } from '../Models/payment-waitingList-dto';
import { GetPaymentsWaitingListFilterRequest } from '../Models/get-payments-waitingList-filter-request';
import { PaymentReference } from '../Models/payment-reference.enum';

import { SearchManager } from '../../../core/utils/search-manager';
import { PaginatedList } from '../../../core/models/Shared/paginated-list.model';

@Injectable({ providedIn: 'root' })
export class PaymentsFacade extends BaseFacade {
  private service = inject(PaymentsService);

  /* ---------------------------------------------
   * SIGNALS
   * --------------------------------------------- */

  private _waitingList = signal<PaymentWaitingListDto[]>([]);
  waitingList = this._waitingList.asReadonly();

  private _filters = signal<GetPaymentsWaitingListFilterRequest>({
    searchTerm: '',
    paymentReference: null,
    isCompleted: null,
    sortColumn: 'createdAt',
    sortDirection: 'desc',
  });
  filters = this._filters.asReadonly();

  private _pageRequest = signal<PageRequest>({
    page: 1,
    pageSize: 10,
  });
  pageRequest = this._pageRequest.asReadonly();

  totalCount = signal<number>(0);
  loadingWaitingList = signal<boolean>(false);

  constructor() {
    super();
  }

  /* ---------------------------------------------
   * SEARCH MANAGER (SAME IDEA AS TICKETS)
   * --------------------------------------------- */

  private searchManager = new SearchManager<PaymentWaitingListDto[]>(
    (term: string) =>
      this.service
        .getPaymentsWaitingList(
          { ...this._filters(), searchTerm: term },
          this._pageRequest()
        )
        .pipe(
          tap((result) => {
            if (!result.isSuccess) {
              this.handleLoadWaitingListError(result);
            }
          }),
          map((result: ApiResult<PaginatedList<PaymentWaitingListDto>>) =>
            result.isSuccess && result.data?.items
              ? result.data.items
              : []
          )
        ),
    null,
    (items: PaymentWaitingListDto[]) => this._waitingList.set(items)
  );

  /* ---------------------------------------------
   * SEARCH
   * --------------------------------------------- */

  search(term: string) {
    this._filters.update((f) => ({ ...f, searchTerm: term }));
    this._pageRequest.update((p) => ({ ...p, page: 1 }));

    this.searchManager.search(term);
  }

  /* ---------------------------------------------
   * PAGINATION
   * --------------------------------------------- */

  setPage(page: number) {
    this._pageRequest.update((p) => ({ ...p, page }));
    this.loadPaymentsWaitingList();
  }

  setPageSize(pageSize: number) {
    this._pageRequest.update(() => ({
      page: 1,
      pageSize,
    }));
    this.loadPaymentsWaitingList();
  }

  /* ---------------------------------------------
   * FILTERS
   * --------------------------------------------- */

  updateFilters(newFilters: Partial<GetPaymentsWaitingListFilterRequest>) {
    this._filters.update((f) => ({ ...f, ...newFilters }));
    this._pageRequest.update((p) => ({ ...p, page: 1 }));

    // IMPORTANT: use searchManager when searchTerm exists
    if (this._filters().searchTerm) {
      this.searchManager.search(this._filters().searchTerm!);
    } else {
      this.loadPaymentsWaitingList();
    }
  }

  updatePaymentReference(reference: PaymentReference | null) {
    this.updateFilters({ paymentReference: reference });
  }

  updateCompletionStatus(isCompleted: boolean | null) {
    this.updateFilters({ isCompleted });
  }

  resetFilters() {
    this._filters.set({
      searchTerm: '',
      paymentReference: null,
      isCompleted: null,
      sortColumn: 'createdAt',
      sortDirection: 'desc',
    });

    this._pageRequest.set({
      page: 1,
      pageSize: 10,
    });

    this._waitingList.set([]);
    this.totalCount.set(0);
  }

  /* ---------------------------------------------
   * LOAD DATA (NO SEARCH)
   * --------------------------------------------- */

  loadPaymentsWaitingList() {
    this.loadingWaitingList.set(true);

    this.service
      .getPaymentsWaitingList(this._filters(), this._pageRequest())
      .pipe(
        tap((result: ApiResult<PaginatedList<PaymentWaitingListDto>>) => {
          if (result.isSuccess && result.data?.items) {
            this._waitingList.set(result.data.items);
            this.totalCount.set(result.data.totalCount ?? 0);
          } else {
            this._waitingList.set([]);
            this.totalCount.set(0);
            this.handleLoadWaitingListError(result);
          }

          this.loadingWaitingList.set(false);
        })
      )
      .subscribe();
  }

  /* ---------------------------------------------
   * ERROR HANDLING
   * --------------------------------------------- */

  private handleLoadWaitingListError(result: ApiResult<any>) {
    const err = this.extractError(result);

    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }

    this.toast.error('تعذر تحميل قائمة انتظار الدفعات. يرجى المحاولة لاحقاً.');
  }
}
