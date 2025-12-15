import { Injectable, inject, signal } from '@angular/core';
import { tap, map } from 'rxjs/operators';

import { BaseFacade } from '../../../../core/utils/facades/base-facade';
import { ApiResult } from '../../../../core/models/ApiResult';
import { PageRequest } from '../../../../core/models/Shared/page-request.model';
import { SearchManager } from '../../../../core/utils/search-manager';

import { SectionDto } from '../Models/section.dto';
import { SectionFilterRequest } from '../Models/section-filter.request';
import { CreateSectionRequest } from '../Models/create-section.request';
import { UpdateSectionRequest } from '../Models/update-section.request';
import { SectionService } from './section.service';

@Injectable({ providedIn: 'root' })
export class SectionsFacade extends BaseFacade {
  private service = inject(SectionService);

  constructor() {
    super();
  }

  // ---------------------------------------------
  // SIGNALS
  // ---------------------------------------------
  private _sections = signal<SectionDto[]>([]);
  sections = this._sections.asReadonly();

  private _filters = signal<SectionFilterRequest>({
    searchTerm: '',
    departmentId: null,
    sortColumn: 'name',
    sortDirection: 'asc',
  });
  filters = this._filters.asReadonly();

  private _pageRequest = signal<PageRequest>({
    page: 1,
    pageSize: 10,
  });
  pageRequest = this._pageRequest.asReadonly();

  totalCount = signal<number>(0);

  formValidationErrors = signal<Record<string, string[]>>({});

  // ---------------------------------------------
  // SEARCH MANAGER (server-side, paginated)
  // ---------------------------------------------
  private searchManager = new SearchManager<SectionDto[]>(
    (term: string) =>
      this.service
        .getSections(
          { ...this._filters(), searchTerm: term },
          this._pageRequest()
        )
        .pipe(
          tap((result) => {
            if (!result.isSuccess) this.handleLoadSectionsError(result);
          }),
          map((result) =>
            result.isSuccess && result.data?.items
              ? result.data.items
              : []
          )
        ),
    null,
    (items: SectionDto[]) => this._sections.set(items)
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
  updateFilters(newFilters: Partial<SectionFilterRequest>) {
    this._filters.update((f) => ({ ...f, ...newFilters }));
    this._pageRequest.update((p) => ({ ...p, page: 1 }));
  }

  setDepartment(departmentId: number | null) {
    this._filters.update((f) => ({
      ...f,
      departmentId: departmentId ?? null,
    }));
    this._pageRequest.update((p) => ({ ...p, page: 1 }));
  }

  // ---------------------------------------------
  // PAGINATION
  // ---------------------------------------------
  setPage(page: number) {
    this._pageRequest.update((p) => ({ ...p, page }));
    this.loadSections();
  }

  setPageSize(size: number) {
    this._pageRequest.update((p) => ({
      pageSize: size,
      page: 1,
    }));
    this.loadSections();
  }

  // ---------------------------------------------
  // LOAD
  // ---------------------------------------------
  loadSections() {
    this.service
      .getSections(this._filters(), this._pageRequest())
      .pipe(
        tap((result: ApiResult<any>) => {
          if (result.isSuccess && result.data?.items) {
            this._sections.set(result.data.items);
            this.totalCount.set(result.data.totalCount ?? 0);
          } else {
            this._sections.set([]);
            this.totalCount.set(0);
            this.handleLoadSectionsError(result);
          }
        })
      )
      .subscribe();
  }

  resetFilters() {
    this._filters.set({
      searchTerm: '',
      departmentId: null,
      sortColumn: 'name',
      sortDirection: 'asc',
    });

    this._pageRequest.set({
      page: 1,
      pageSize: 10,
    });

    this._sections.set([]);
    this.totalCount.set(0);
  }

  // ---------------------------------------------
  // CREATE / UPDATE
  // ---------------------------------------------
  createSection(dto: CreateSectionRequest) {
    return this.handleCreateOrUpdate(this.service.createSection(dto), {
      successMessage: 'تم إنشاء القسم بنجاح',
      defaultErrorMessage: 'فشل إنشاء القسم. يرجى المحاولة لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success) {
          this.formValidationErrors.set({});
          this.loadSections();
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  updateSection(id: number, dto: UpdateSectionRequest) {
    return this.handleCreateOrUpdate(
      this.service.updateSection(id, dto),
      {
        successMessage: 'تم تعديل القسم بنجاح',
        defaultErrorMessage: 'فشل تعديل القسم. حاول لاحقاً.',
      }
    ).pipe(
      tap((res) => {
        if (res.success) {
          this.formValidationErrors.set({});
          this.loadSections();
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  // ---------------------------------------------
  // DELETE
  // ---------------------------------------------
  deleteSection(section: SectionDto): void {
    if (!section?.id) return;

    const config = {
      title: 'حذف القسم',
      message: 'هل أنت متأكد من حذف القسم التالي؟',
      payload: {
        الاسم: section.name,
      },
    };

    this.confirmAndDelete(
      config,
      () => this.service.deleteSection(section.id),
      {
        successMessage: 'تم حذف القسم بنجاح',
        defaultErrorMessage: 'فشل حذف القسم. حاول لاحقاً.',
      }
    ).subscribe((success) => {
      if (success) {
        this.loadSections();
      }
    });
  }

  // ---------------------------------------------
  // ERROR HANDLING
  // ---------------------------------------------
  private handleLoadSectionsError(result: ApiResult<any>) {
    const err = this.extractError(result);
    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }
    this.toast.error('تعذر تحميل الأقسام. يرجى المحاولة لاحقاً.');
  }
}
