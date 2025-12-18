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
  // LIST STATE
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
  // SEARCH MANAGER
  // ---------------------------------------------
  private searchManager = new SearchManager<SectionDto[]>(
    (term: string) =>
      this.service
        .getSections(
          { ...this._filters(), searchTerm: term },
          this._pageRequest()
        )
        .pipe(
          tap((res) => {
            if (!res.isSuccess) this.handleLoadSectionsError(res);
          }),
          map((res) =>
            res.isSuccess && res.data?.items ? res.data.items : []
          )
        ),
    null,
    (items) => this._sections.set(items)
  );

  // ---------------------------------------------
  // SEARCH & FILTERS
  // ---------------------------------------------
  search(term: string) {
    this._filters.update((f) => ({ ...f, searchTerm: term }));
    this._pageRequest.update((p) => ({ ...p, page: 1 }));
    this.searchManager.search(term);
  }

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
    this._pageRequest.update((p) => ({ page: 1, pageSize: size }));
    this.loadSections();
  }

  // ---------------------------------------------
  // LOAD LIST
  // ---------------------------------------------
  loadSections() {
    this.service
      .getSections(this._filters(), this._pageRequest())
      .pipe(
        tap((res) => {
          if (res.isSuccess && res.data?.items) {
            this._sections.set(res.data.items);
            this.totalCount.set(res.data.totalCount ?? 0);
          } else {
            this._sections.set([]);
            this.totalCount.set(0);
            this.handleLoadSectionsError(res);
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

    this._pageRequest.set({ page: 1, pageSize: 10 });
    this._sections.set([]);
    this.totalCount.set(0);
  }


  createSection(dto: CreateSectionRequest) {
    return this.handleCreateOrUpdate(this.service.createSection(dto), {
      successMessage: 'تم إنشاء القسم بنجاح',
      defaultErrorMessage: 'فشل إنشاء القسم. يرجى المحاولة لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.formValidationErrors.set({});
          this.addSectionToList(res.data);
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
          this.updateSectionInList(id, dto);
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }


  private _selectedSection = signal<SectionDto | null>(null);
  selectedSection = this._selectedSection.asReadonly();

  isEditMode = signal<boolean>(false);

  enterCreateMode(): void {
    this.isEditMode.set(false);
    this._selectedSection.set(null);
    this.formValidationErrors.set({});
  }

  enterEditMode(section: SectionDto): void {
    this.isEditMode.set(true);
    this._selectedSection.set(section);
    this.formValidationErrors.set({});
  }

  loadSectionForEdit(id: number): void {
    const local = this._sections().find((s) => s.id === id);
    if (local) {
      this.enterEditMode(local);
      return;
    }

    this.service
      .getSectionById(id)
      .pipe(
        tap((res: ApiResult<SectionDto>) => {
          if (res.isSuccess && res.data) {
            this.enterEditMode(res.data);
          } else {
            this.toast.error(res.errorDetail ?? 'لم يتم العثور على القسم');
            this.enterCreateMode();
          }
        })
      )
      .subscribe();
  }


  deleteSection(section: SectionDto): void {
    if (!section?.id) return;

    const config = {
      title: 'حذف القسم',
      message: 'هل أنت متأكد من حذف القسم التالي؟',
      payload: { الاسم: section.name },
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
        this.removeSectionFromList(section.id);
        this.enterCreateMode();
      }
    });
  }


  private addSectionToList(section: SectionDto) {
    this._sections.update((list) => [section, ...list]);
    this.totalCount.update((c) => c + 1);
  }

  private updateSectionInList(id: number, dto: UpdateSectionRequest) {
    this._sections.update((list) =>
      list.map((s) =>
        s.id === id
          ? {
              ...s,
              name: dto.name,
              departmentId: dto.departmentId,
            }
          : s
      )
    );

    const selected = this._selectedSection();
    if (selected?.id === id) {
      this._selectedSection.set({
        ...selected,
        name: dto.name,
        departmentId: dto.departmentId,
      });
    }
  }

  private removeSectionFromList(id: number) {
    this._sections.update((list) => list.filter((s) => s.id !== id));
    this.totalCount.update((c) => Math.max(0, c - 1));
  }

 
  private handleLoadSectionsError(result: ApiResult<any>) {
    const err = this.extractError(result);
    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }
    this.toast.error('تعذر تحميل الأقسام. يرجى المحاولة لاحقاً.');
  }
}
