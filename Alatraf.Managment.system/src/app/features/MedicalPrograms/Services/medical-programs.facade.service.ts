import { Injectable, inject, signal } from '@angular/core';
import { map, tap } from 'rxjs/operators';

import { ApiResult } from '../../../core/models/ApiResult';
import { MedicalProgramDto } from '../../../core/models/medical-programs/medical-program.dto';
import { BaseFacade } from '../../../core/utils/facades/base-facade';
import { SearchManager } from '../../../core/utils/search-manager';
import { MedicalProgramsManagementService } from './medical-programs-management.service';
import { CreateMedicalProgramRequest } from '../Models/create-medical-program-request.model';
import { UpdateMedicalProgramRequest } from '../Models/update-medical-program-request.model';
import { PageRequest } from '../../../core/models/Shared/page-request.model';
import { MedicalProgramsFilterRequest } from '../Models/medical-programs-filter.request';

@Injectable({ providedIn: 'root' })
export class MedicalProgramsFacade extends BaseFacade {
  private service = inject(MedicalProgramsManagementService);

  constructor() {
    super();
  }
  // ---------------------------------------------
  // LOADING STATE
  // ---------------------------------------------
  private _isLoading = signal<boolean>(false);
  isLoading = this._isLoading.asReadonly();

  // ---------------------------------------------
  // SIGNALS
  // ---------------------------------------------
  private _medicalPrograms = signal<MedicalProgramDto[]>([]);
  medicalPrograms = this._medicalPrograms.asReadonly();

  private _filters = signal<MedicalProgramsFilterRequest>({
    searchTerm: '',
    sectionId: null,
    hasSection: null,
    sortColumn: 'Name',
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

  private searchManager = new SearchManager<MedicalProgramDto[]>(
    (term: string) =>
      this.service
        .getMedicalProgramsWithFilters(
          { ...this._filters(), searchTerm: term },
          this._pageRequest()
        )
        .pipe(
          tap((result) => {
            if (!result.isSuccess) this.handleLoadMedicalProgramsError(result);
          }),
          map((result) =>
            result.isSuccess && result.data?.items ? result.data.items : []
          )
        ),
    null,
    (items: MedicalProgramDto[]) => {
      this._medicalPrograms.set(items);
      this._isLoading.set(false);
    }
  );

  search(term: string) {
    this._filters.update((f) => ({ ...f, searchTerm: term }));
    this._pageRequest.update((p) => ({ ...p, page: 1 }));
    this._isLoading.set(true);

    this.searchManager.search(term);
  }
  updateFilters(newFilters: Partial<MedicalProgramsFilterRequest>) {
    this._filters.update((f) => ({ ...f, ...newFilters }));
    this._pageRequest.update((p) => ({ ...p, page: 1 }));
  }

  loadMedicalPrograms() {
    this._isLoading.set(true);

    this.service
      .getMedicalProgramsWithFilters(this._filters(), this._pageRequest())
      .pipe(
        tap((result: ApiResult<any>) => {
          if (result.isSuccess && result.data?.items) {
            this._medicalPrograms.set(result.data.items);
            this.totalCount.set(result.data.totalCount ?? 0);
          } else {
            this._medicalPrograms.set([]);
            this.totalCount.set(0);
            this.handleLoadMedicalProgramsError(result);
          }

          this._isLoading.set(false);
        })
      )
      .subscribe();
  }

  setPage(page: number) {
    this._pageRequest.update((p) => ({ ...p, page }));
    this.loadMedicalPrograms();
  }

  setPageSize(size: number) {
    this._pageRequest.update((p) => ({
      pageSize: size,
      page: 1,
    }));

    this.loadMedicalPrograms();
  }
  resetFilters() {
    this._filters.set({
      searchTerm: '',
      sectionId: null,
      hasSection: null,
      sortColumn: 'Name',
      sortDirection: 'asc',
    });

    this._pageRequest.set({
      page: 1,
      pageSize: 20,
    });

    this._medicalPrograms.set([]);
    this.totalCount.set(0);
  }

  createMedicalProgram(dto: CreateMedicalProgramRequest) {
    return this.handleCreateOrUpdate(this.service.createMedicalProgram(dto), {
      successMessage: 'تم إنشاء البرنامج الطبي بنجاح',
      defaultErrorMessage: 'فشل إنشاء البرنامج الطبي. يرجى المحاولة لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.formValidationErrors.set({});
          this.applyMedicalProgramMutation({
            type: 'create',
            item: res.data,
          });
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  updateMedicalProgram(id: number, dto: UpdateMedicalProgramRequest) {
    return this.handleCreateOrUpdate(
      this.service.updateMedicalProgram(id, dto),
      {
        successMessage: 'تم تعديل البرنامج الطبي بنجاح',
        defaultErrorMessage: 'فشل تعديل البرنامج الطبي. حاول لاحقاً.',
      }
    ).pipe(
      tap((res) => {
        if (res.success) {
          this.formValidationErrors.set({});
          this.applyMedicalProgramMutation({
            type: 'update',
            id,
            changes: dto,
          });
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  // ================================
  // SELECTED MEDICAL PROGRAM + EDIT MODE
  // ================================
  private _selectedMedicalProgram = signal<MedicalProgramDto | null>(null);
  selectedMedicalProgram = this._selectedMedicalProgram.asReadonly();

  isEditMode = signal<boolean>(false);

  enterCreateMode(): void {
    this.isEditMode.set(false);
    this._selectedMedicalProgram.set(null);
    this.formValidationErrors.set({});
    console.log('mode:', this.isEditMode());
  }
  enterEditMode(program: MedicalProgramDto): void {
    this.isEditMode.set(true);
    this._selectedMedicalProgram.set(program);
  }

  loadMedicalProgramForEdit(id: number): void {
    this.isEditMode.set(true);
    this._selectedMedicalProgram.set(null);

    this.service
      .getMedicalProgramById(id)
      .pipe(
        tap((result: ApiResult<MedicalProgramDto>) => {
          if (result.isSuccess && result.data) {
            this._selectedMedicalProgram.set(result.data);
            this.formValidationErrors.set({});
          } else {
            this.toast.error(
              result.errorDetail ?? 'لم يتم العثور على البرنامج الطبي'
            );
            this.isEditMode.set(false);
            this._selectedMedicalProgram.set(null);
          }
        })
      )
      .subscribe();
  }

  // ================================
  // DELETE
  // ================================
  deleteMedicalProgram(program: MedicalProgramDto): void {
    if (!program?.id) return;

    const config = {
      title: 'حذف البرنامج الطبي',
      message: 'هل أنت متأكد من حذف البرنامج الطبي التالي؟',
      payload: {
        الاسم: program.name,
        الوصف: program.description ?? '',
      },
    };

    this.confirmAndDelete(
      config,
      () => this.service.deleteMedicalProgram(program.id),
      {
        successMessage: 'تم حذف البرنامج الطبي بنجاح',
        defaultErrorMessage: 'فشل حذف البرنامج الطبي. حاول لاحقاً.',
      }
    ).subscribe((success) => {
      if (success) {
        this.applyMedicalProgramMutation({
          type: 'delete',
          id: program.id,
        });
        this.enterCreateMode();
      }
    });
  }

  // ================================
  // Error Handlers (minimal)
  // ================================
  private handleLoadMedicalProgramsError(result: ApiResult<any>) {
    const err = this.extractError(result);
    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }
    this.toast.error('تعذر تحميل البرامج الطبية. يرجى المحاولة لاحقاً.');
  }

  private applyMedicalProgramMutation(mutation: MedicalProgramMutation): void {
    switch (mutation.type) {
      case 'create': {
        this._medicalPrograms.update((list) => [mutation.item, ...list]);

        this.totalCount.update((c) => c + 1);

        this.isEditMode.set(true);
        this._selectedMedicalProgram.set(mutation.item);
        break;
      }

      case 'update': {
        this._medicalPrograms.update((list) =>
          list.map((item) =>
            item.id === mutation.id ? { ...item, ...mutation.changes } : item
          )
        );

        const selected = this._selectedMedicalProgram();
        if (selected?.id === mutation.id) {
          this._selectedMedicalProgram.set({
            ...selected,
            ...mutation.changes,
          });
        }
        break;
      }

      case 'delete': {
        this._medicalPrograms.update((list) =>
          list.filter((x) => x.id !== mutation.id)
        );

        this.totalCount.update((c) => Math.max(0, c - 1));

        const selected = this._selectedMedicalProgram();
        if (selected?.id === mutation.id) {
          this.enterCreateMode();
        }
        break;
      }
    }
  }
}

type MedicalProgramMutation =
  | { type: 'create'; item: MedicalProgramDto }
  | { type: 'update'; id: number; changes: Partial<MedicalProgramDto> }
  | { type: 'delete'; id: number };
