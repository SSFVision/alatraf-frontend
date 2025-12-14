import { Injectable, inject, signal } from '@angular/core';
import { BaseFacade } from '../../../core/utils/facades/base-facade';
import { RepairCardDiagnosisDto } from '../../Diagnosis/Industrial/Models/repair-card-diagnosis.dto';
import { RepairCardDiagnosisService } from '../../Diagnosis/Industrial/Services/repair-card-diagnosis.service';
import { map, tap } from 'rxjs';
import { ApiResult } from '../../../core/models/ApiResult';
import { PageRequest } from '../../../core/models/Shared/page-request.model';
import { GetPaidRepairCardsFilterRequest } from '../Models/paid-repair-cards-filter.request';
import { RepairCardsManagementService } from './repair-cards-management.service';
import { AssignIndustrialPartsRequest } from '../Models/assign-industrial-parts.request';
import { SearchManager } from '../../../core/utils/search-manager';

@Injectable({
  providedIn: 'root',
})
export class RepairCardsFacade extends BaseFacade {
  private repairCardService = inject(RepairCardDiagnosisService);

  private _repairCard = signal<RepairCardDiagnosisDto | null>(null);
  repairCard = this._repairCard.asReadonly();

  loadingRepairCard = signal<boolean>(false);

  constructor() {
    super();
  }
  loadRepairCardById(repairCardId: number) {
    this.loadingRepairCard.set(true);
    this._repairCard.set(null);

    return this.repairCardService.getRepairCardById(repairCardId).pipe(
      tap((result) => {
        if (result.isSuccess && result.data) {
          this._repairCard.set(result.data);
        } else {
          this._repairCard.set(null);
          this.toast.error(
            result.errorDetail ?? 'لم يتم العثور على بطاقة الإصلاح'
          );
        }

        this.loadingRepairCard.set(false);
      })
    );
  }

  private repairCardsService = inject(RepairCardsManagementService);

  // ----------------------- Paid Repair Cards -----------------------
  private _paidRepairCards = signal<RepairCardDiagnosisDto[]>([]);
  paidRepairCards = this._paidRepairCards.asReadonly();

  private _paidFilters = signal<GetPaidRepairCardsFilterRequest>({
    searchTerm: '',
    sortColumn: '',
    sortDirection: 'desc',
  });
  paidFilters = this._paidFilters.asReadonly();

  private _paidPageRequest = signal<PageRequest>({
    page: 1,
    pageSize: 10,
  });
  paidPageRequest = this._paidPageRequest.asReadonly();

  paidTotalCount = signal<number>(0);
  loadingPaidRepairCards = signal<boolean>(false);
  private paidSearchManager = new SearchManager<RepairCardDiagnosisDto[]>(
    (term: string) =>
      this.repairCardsService
        .getPaidRepairCards(
          { ...this._paidFilters(), searchTerm: term },
          this._paidPageRequest()
        )
        .pipe(
          tap((result) => {
            if (!result.isSuccess) {
              this.handleLoadPaidRepairCardsError(result);
            }
          }),
          map((result) =>
            result.isSuccess && result.data?.items ? result.data.items : []
          )
        ),
    null,
    (items) => this._paidRepairCards.set(items)
  );
  loadPaidRepairCards() {
    this.loadingPaidRepairCards.set(true);
    return this.repairCardsService
      .getPaidRepairCards(this._paidFilters(), this._paidPageRequest())
      .pipe(
        tap((result) => {
          if (result.isSuccess && result.data?.items) {
            this._paidRepairCards.set(result.data.items);
            this.paidTotalCount.set(result.data.totalCount ?? 0);
          } else {
            this._paidRepairCards.set([]);
            this.paidTotalCount.set(0);
            this.handleLoadPaidRepairCardsError(result);
          }

          this.loadingPaidRepairCards.set(false);
        })
      );
  }
  searchPaid(term: string): void {
    this._paidFilters.update((f) => ({ ...f, searchTerm: term }));
    this._paidPageRequest.update((p) => ({ ...p, page: 1 }));
    this.paidSearchManager.search(term);
  }
  setPaidPageSize(size: number): void {
    this._paidPageRequest.update(() => ({
      page: 1,
      pageSize: size,
    }));
    this.loadPaidRepairCards();
  }
  updatePaidFilters(filters: Partial<GetPaidRepairCardsFilterRequest>): void {
    this._paidFilters.update((f) => ({ ...f, ...filters }));
  }
  resetPaidFilters(): void {
    this._paidFilters.set({
      searchTerm: '',
      sortColumn: 'PaymentDate',
      sortDirection: 'asc',
    });

    this._paidPageRequest.set({
      page: 1,
      pageSize: 10,
    });

    this._paidRepairCards.set([]);
    this.paidTotalCount.set(0);
  }

  private handleLoadPaidRepairCardsError(result: ApiResult<any>): void {
    const err = this.extractError(result);

    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }

    this.toast.error('تعذر تحميل بطاقات الإصلاح المدفوعة.');
  }

  // assigningIndustrialParts

  assigningIndustrialParts = signal<boolean>(false);
  industrialPartsAssigned = signal<boolean>(false);
  formValidationErrors = signal<Record<string, string[]>>({});
  assignIndustrialParts(
    repairCardId: number,
    request: AssignIndustrialPartsRequest
  ) {
    this.assigningIndustrialParts.set(true);
    this.industrialPartsAssigned.set(false);
    this.formValidationErrors.set({});

    return this.handleCreateOrUpdate(
      this.repairCardsService.assignIndustrialParts(repairCardId, request),
      {
        successMessage: 'تم تعيين القطع الصناعية بنجاح',
        defaultErrorMessage: 'فشل تعيين القطع الصناعية، حاول مرة أخرى',
      }
    ).pipe(
      tap((res) => {
        if (res.success) {
          this.industrialPartsAssigned.set(true);
        }

        if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }

        this.assigningIndustrialParts.set(false);
      })
    );
  }
}
