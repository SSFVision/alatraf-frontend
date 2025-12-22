import { Injectable, inject, signal } from '@angular/core';
import { tap, map } from 'rxjs/operators';

import { BaseFacade } from '../../../core/utils/facades/base-facade';
import { ApiResult } from '../../../core/models/ApiResult';
import { PageRequest } from '../../../core/models/Shared/page-request.model';
import { PaginatedList } from '../../../core/models/Shared/paginated-list.model';
import { SearchManager } from '../../../core/utils/search-manager';

import { PaymentsService } from '../Services/payments.service';
import { PaymentListItemDto } from '../Models/payment-list-item.dto';
import { PaymentsFilterRequest } from '../Models/payments-filter.request';
import { PaymentCoreDto } from '../Models/payment-core.dto';

@Injectable({ providedIn: 'root' })
export class PaymentsListFacade extends BaseFacade {
  private service = inject(PaymentsService);

  constructor() {
    super();
  }

  /* ---------------------------------------------
   * STATE
   * --------------------------------------------- */

  private _payments = signal<PaymentListItemDto[]>([]);
  payments = this._payments.asReadonly();

  private _filters = signal<PaymentsFilterRequest>({
    searchTerm: '',
    ticketId: null,
    diagnosisId: null,
    paymentReference: null,
    accountKind: null,
    isCompleted: null,
    paymentDateFrom: null,
    paymentDateTo: null,
    sortColumn: 'PaymentDate',
    sortDirection: 'desc',
  });
  filters = this._filters.asReadonly();

  private _pageRequest = signal<PageRequest>({
    page: 1,
    pageSize: 10,
  });
  pageRequest = this._pageRequest.asReadonly();

  totalCount = signal<number>(0);

  private _isLoading = signal<boolean>(false);
  isLoading = this._isLoading.asReadonly();

  private _isLoadingNextPage = signal<boolean>(false);
  isLoadingNextPage = this._isLoadingNextPage.asReadonly();

  /* ---------------------------------------------
   * SEARCH MANAGER
   * --------------------------------------------- */

  private searchManager = new SearchManager<PaymentListItemDto[]>(
    (term: string) =>
      this.service
        .getPayments(
          { ...this._filters(), searchTerm: term },
          this._pageRequest()
        )
        .pipe(
          tap((res) => {
            if (!res.isSuccess) {
              this.handleLoadPaymentsError(res);
            }
          }),
          map((res: ApiResult<PaginatedList<PaymentListItemDto>>) =>
            res.isSuccess && res.data?.items ? res.data.items : []
          )
        ),
    null,
    (items) => {
      this._payments.set(items);
      this._isLoading.set(false);
    }
  );

  /* ---------------------------------------------
   * LOAD
   * --------------------------------------------- */

  loadPayments(): void {
    this._isLoading.set(true);

    this.service
      .getPayments(this._filters(), this._pageRequest())
      .pipe(
        tap((res: ApiResult<PaginatedList<PaymentListItemDto>>) => {
          if (res.isSuccess && res.data?.items) {
            this._payments.set(res.data.items);
            this.totalCount.set(res.data.totalCount ?? 0);
          } else {
            this._payments.set([]);
            this.totalCount.set(0);
            this.handleLoadPaymentsError(res);
          }

          this._isLoading.set(false);
        })
      )
      .subscribe();
  }

  /* ---------------------------------------------
   * SEARCH
   * --------------------------------------------- */

  search(term: string): void {
    this._filters.update((f) => ({ ...f, searchTerm: term }));
    this._pageRequest.update((p) => ({ ...p, page: 1 }));
    this._isLoading.set(true);

    this.searchManager.search(term);
  }

  /* ---------------------------------------------
   * FILTERS
   * --------------------------------------------- */

  updateFilters(newFilters: Partial<PaymentsFilterRequest>): void {
    this._filters.update((f) => ({ ...f, ...newFilters }));
    this._pageRequest.update((p) => ({ ...p, page: 1 }));

    if (this._filters().searchTerm) {
      this.searchManager.search(this._filters().searchTerm!);
    } else {
      this.loadPayments();
    }
  }

  resetFilters(): void {
    this._filters.set({
      searchTerm: '',
      ticketId: null,
      diagnosisId: null,
      paymentReference: null,
      accountKind: null,
      isCompleted: null,
      paymentDateFrom: null,
      paymentDateTo: null,
      sortColumn: 'PaymentDate',
      sortDirection: 'desc',
    });

    this._pageRequest.set({ page: 1, pageSize: 10 });
    this._payments.set([]);
    this.totalCount.set(0);
  }

  /* ---------------------------------------------
   * PAGINATION
   * --------------------------------------------- */

  setPage(page: number): void {
    this._pageRequest.update((p) => ({ ...p, page }));
    this.loadPayments();
  }

  setPageSize(pageSize: number): void {
    this._pageRequest.update(() => ({
      page: 1,
      pageSize,
    }));
    this.loadPayments();
  }

  loadNextPage(): void {
    if (this._isLoadingNextPage()) return;

    const currentItems = this._payments();
    const total = this.totalCount();
    const { page, pageSize } = this._pageRequest();

    if (currentItems.length >= total) return;

    const lastPage = Math.ceil(total / pageSize);
    if (page >= lastPage) return;

    const nextPage = page + 1;
    this._isLoadingNextPage.set(true);

    this.service
      .getPayments(this._filters(), { ...this._pageRequest(), page: nextPage })
      .pipe(
        tap((res) => {
          if (!res.isSuccess) {
            this.handleLoadPaymentsError(res);
            return;
          }

          const newItems = res.data?.items ?? [];
          if (newItems.length === 0) return;

          this._payments.update((current) => {
            const existingIds = new Set(current.map((x) => x.paymentId));
            const uniqueNew = newItems.filter(
              (item) => !existingIds.has(item.paymentId)
            );
            return [...current, ...uniqueNew];
          });

          this._pageRequest.update((p) => ({
            ...p,
            page: nextPage,
          }));
        }),
        tap({
          finalize: () => this._isLoadingNextPage.set(false),
        })
      )
      .subscribe();
  }

  resetAndLoad(): void {
    this._pageRequest.set({
      page: 1,
      pageSize: this._pageRequest().pageSize,
    });

    this._payments.set([]);
    this.totalCount.set(0);

    this.loadPayments();
  }


  private _selectedPayment = signal<PaymentCoreDto | null>(null);
selectedPayment = this._selectedPayment.asReadonly();
loadPaymentById(paymentId: number): void {
  this.service
    .getPaymentById(paymentId)
    .pipe(
      tap((res: ApiResult<PaymentCoreDto>) => {
        if (res.isSuccess && res.data) {
          this._selectedPayment.set(res.data);
        } else {
          this.toast.error(res.errorDetail ?? 'لم يتم العثور على الدفعة');
        }
      })
    )
    .subscribe();
}

  /* ---------------------------------------------
   * ERROR HANDLING
   * --------------------------------------------- */

  private handleLoadPaymentsError(result: ApiResult<any>): void {
    const err = this.extractError(result);

    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }

    this.toast.error('تعذر تحميل الدفعات. يرجى المحاولة لاحقاً.');
  }
}
