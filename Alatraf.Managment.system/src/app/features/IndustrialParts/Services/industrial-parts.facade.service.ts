import { Injectable, inject, signal } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { ApiResult } from '../../../core/models/ApiResult';
import { IndustrialPartDto } from '../../../core/models/industrial-parts/industrial-partdto';
import { PageRequest } from '../../../core/models/Shared/page-request.model';
import { BaseFacade } from '../../../core/utils/facades/base-facade';
import { SearchManager } from '../../../core/utils/search-manager';
import { CreateIndustrialPartRequest } from '../models/create-industrial-part.request';
import { IndustrialPartFilterRequest } from '../models/industrial-part-filter.request';
import { UpdateIndustrialPartRequest } from '../models/update-industrial-part.request';
import { IndustrialPartsManagementService } from './industrial-parts-management.service';

@Injectable({ providedIn: 'root' })
export class IndustrialPartsFacade extends BaseFacade {
  private service = inject(IndustrialPartsManagementService);

  constructor() {
    super();
  }

  private _industrialParts = signal<IndustrialPartDto[]>([]);
  industrialParts = this._industrialParts.asReadonly();

  private _filters = signal<IndustrialPartFilterRequest>({
    searchTerm: '',
    sortColumn: 'name',
    sortDirection: 'asc',
  });
  filters = this._filters.asReadonly();

  private _pageRequest = signal<PageRequest>({
    page: 1,
    pageSize: 20,
  });
  pageRequest = this._pageRequest.asReadonly();

  totalCount = signal<number>(0);

  formValidationErrors = signal<Record<string, string[]>>({});


  private searchManager = new SearchManager<IndustrialPartDto[]>(
    (term: string) =>
      this.service
        .getIndustrialPartsWithFilters(
          { ...this._filters(), searchTerm: term },
          this._pageRequest()
        )
        .pipe(
          tap((result) => {
            if (!result.isSuccess) this.handleLoadIndustrialPartsError(result);
          }),
          map((result) =>
            result.isSuccess && result.data?.items ? result.data.items : []
          )
        ),
    null,
    (items: IndustrialPartDto[]) => this._industrialParts.set(items)
  );

  // ---------------------------------------------
  // SEARCH
  // ---------------------------------------------
  search(term: string) {
    this._filters.update((f) => ({ ...f, searchTerm: term }));
    this._pageRequest.update((p) => ({ ...p, page: 1 }));
    this.searchManager.search(term);
  }

  // ---------------------------------------------
  // FILTERS
  // ---------------------------------------------
  updateFilters(newFilters: Partial<IndustrialPartFilterRequest>) {
    this._filters.update((f) => ({ ...f, ...newFilters }));
    this._pageRequest.update((p) => ({ ...p, page: 1 }));
  }

  // ---------------------------------------------
  // PAGINATION
  // ---------------------------------------------
  setPage(page: number) {
    this._pageRequest.update((p) => ({ ...p, page }));
    this.loadIndustrialParts();
  }

  setPageSize(size: number) {
    this._pageRequest.update((p) => ({
      pageSize: size,
      page: 1,
    }));
    this.loadIndustrialParts();
  }

  // ---------------------------------------------
  // LOAD
  // ---------------------------------------------
  loadIndustrialParts() {
    this.service
      .getIndustrialPartsWithFilters(this._filters(), this._pageRequest())
      .pipe(
        tap((result: ApiResult<any>) => {
          if (result.isSuccess && result.data?.items) {
            this._industrialParts.set(result.data.items);
            this.totalCount.set(result.data.totalCount ?? 0);
          } else {
            this._industrialParts.set([]);
            this.totalCount.set(0);
            this.handleLoadIndustrialPartsError(result);
          }
        })
      )
      .subscribe();
  }

  resetFilters() {
    this._filters.set({
      searchTerm: '',

      sortColumn: 'name',
      sortDirection: 'asc',
    });

    this._pageRequest.set({
      page: 1,
      pageSize: 20,
    });

    this._industrialParts.set([]);
    this.totalCount.set(0);
  }

  // ---------------------------------------------
  // CREATE / UPDATE
  // ---------------------------------------------
  createIndustrialPart(dto: CreateIndustrialPartRequest) {
    return this.handleCreateOrUpdate(this.service.createIndustrialPart(dto), {
      successMessage: 'تم إنشاء القطعة الصناعية بنجاح',
      defaultErrorMessage: 'فشل إنشاء القطعة الصناعية. يرجى المحاولة لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success) {
          this.formValidationErrors.set({});
          this.loadIndustrialParts();
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  updateIndustrialPart(id: number, dto: UpdateIndustrialPartRequest) {
    return this.handleCreateOrUpdate(
      this.service.updateIndustrialPart(id, dto),
      {
        successMessage: 'تم تعديل القطعة الصناعية بنجاح',
        defaultErrorMessage: 'فشل تعديل القطعة الصناعية. حاول لاحقاً.',
      }
    ).pipe(
      tap((res) => {
        if (res.success) {
          this.formValidationErrors.set({});
          this.loadIndustrialParts();
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  // ---------------------------------------------
  // DELETE
  // ---------------------------------------------
  deleteIndustrialPart(part: IndustrialPartDto): void {
    if (!part.industrialPartId) return;

    const config = {
      title: 'حذف القطعة الصناعية',
      message: 'هل أنت متأكد من حذف القطعة الصناعية التالية؟',
      payload: {
        الاسم: part.name,
        الوصف: part.description ?? '',
      },
    };

    this.confirmAndDelete(
      config,
      () => this.service.deleteIndustrialPart(part.industrialPartId),
      {
        successMessage: 'تم حذف القطعة الصناعية بنجاح',
        defaultErrorMessage: 'فشل حذف القطعة الصناعية. حاول لاحقاً.',
      }
    ).subscribe((success) => {
      if (success) {
        this.loadIndustrialParts();
      }
    });
  }

  // ---------------------------------------------
  // ERROR HANDLING
  // ---------------------------------------------
  private handleLoadIndustrialPartsError(result: ApiResult<any>) {
    const err = this.extractError(result);
    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }
    this.toast.error('تعذر تحميل القطع الصناعية. يرجى المحاولة لاحقاً.');
  }
}
