import { Injectable, inject, signal } from '@angular/core';
import { finalize, tap } from 'rxjs/operators';

import { BaseFacade } from '../../../core/utils/facades/base-facade';
import { ApiResult } from '../../../core/models/ApiResult';
import { InjuryDto } from '../../../core/models/injuries/injury.dto';
import { CreateInjuryRequest } from '../models/create-injury-request.model';
import { UpdateInjuryRequest } from '../models/update-injury-request.model';
import { InjuriesManagementService } from './injuries-management.service';
import { InjuriesNavigationFacade } from '../../../core/navigation/injuries-navigation.facade';

@Injectable({ providedIn: 'root' })
export class InjurySidesFacadeService extends BaseFacade {
  private service = inject(InjuriesManagementService);
  private navInjury = inject(InjuriesNavigationFacade);

  constructor() {
    super();
  }

  private _injurySides = signal<InjuryDto[]>([]);
  injurySides = this._injurySides.asReadonly();

  private _isLoading = signal<boolean>(false);
  isLoading = this._isLoading.asReadonly();

  isEditMode = signal<boolean>(false);
  private _selectedInjurySide = signal<InjuryDto | null>(null);
  selectedInjurySide = this._selectedInjurySide.asReadonly();

  formValidationErrors = signal<Record<string, string[]>>({});

  loadInjurySides() {
    this._isLoading.set(true);

    this.service
      .getInjurySides()
      .pipe(
        tap((res: ApiResult<InjuryDto[]>) => {
          if (res.isSuccess && res.data) {
            this._injurySides.set(res.data);
          } else {
            this._injurySides.set([]);
            this.handleLoadError(res);
          }
        }),
        finalize(() => this._isLoading.set(false))
      )
      .subscribe();
  }
  enterCreateMode(): void {
    this.isEditMode.set(false);
    this._selectedInjurySide.set(null);
    this.formValidationErrors.set({});
  }

  enterEditMode(side: InjuryDto): void {
    this.isEditMode.set(true);
    this._selectedInjurySide.set(side);
    this.formValidationErrors.set({});
  }

  loadInjurySideForEdit(id: number): void {
    const local = this._injurySides().find((s) => s.id === id);
    if (local) {
      this.enterEditMode(local);
      return;
    }

    this._isLoading.set(true);
    this.service
      .getInjurySides()
      .pipe(
        tap((res: ApiResult<InjuryDto[]>) => {
          if (res.isSuccess && res.data) {
            this._injurySides.set(res.data);
            const found = res.data.find((s) => s.id === id) || null;
            if (found) {
              this.enterEditMode(found);
            } else {
              this.toast.error('لم يتم العثور على جهة الإصابة');
              this.enterCreateMode();
            }
          } else {
            this._injurySides.set([]);
            this.handleLoadError(res);
            this.enterCreateMode();
          }
        }),
        finalize(() => this._isLoading.set(false))
      )
      .subscribe();
  }
  createInjurySide(req: CreateInjuryRequest) {
    return this.handleCreateOrUpdate(this.service.createInjurySide(req), {
      successMessage: 'تم إنشاء جهة الإصابة بنجاح',
      defaultErrorMessage: 'فشل إنشاء جهة الإصابة. يرجى المحاولة لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.formValidationErrors.set({});
          this.addInjurySideToList(res.data as InjuryDto);
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  updateInjurySide(id: number, req: UpdateInjuryRequest) {
    return this.handleCreateOrUpdate(this.service.updateInjurySide(id, req), {
      successMessage: 'تم تعديل جهة الإصابة بنجاح',
      defaultErrorMessage: 'فشل تعديل جهة الإصابة. يرجى المحاولة لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success) {
          this.formValidationErrors.set({});
          this.updateInjurySideInList(id, req);
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  deleteInjurySide(injurySide: InjuryDto): void {
    if (!injurySide?.id) return;

    const config = {
      title: 'حذف جهة الإصابة',
      message: 'هل أنت متأكد من حذف جهة الإصابة؟',
      payload: { الاسم: injurySide.name },
    };
    this.confirmAndDelete(
      config,
      () => this.service.deleteInjurySide(injurySide.id),
      {
        successMessage: 'تم حذف جهة الإصابة بنجاح',
        defaultErrorMessage: 'فشل حذف جهة الإصابة. يرجى المحاولة لاحقاً.',
      }
    ).subscribe((success) => {
      if (success) {
        this.removeInjurySideFromList(injurySide.id);
        this.enterCreateMode();
        this.navInjury.goToCreateInjurySidePage();
      }
    });
  }

  private handleLoadError(result: ApiResult<any>) {
    const err = this.extractError(result);
    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }

    this.toast.error('تعذر تحميل جهات الإصابة. يرجى المحاولة لاحقاً.');
  }
  private addInjurySideToList(item: InjuryDto) {
    this._injurySides.update((list) => [item, ...list]);
  }

  private updateInjurySideInList(id: number, dto: UpdateInjuryRequest) {
    this._injurySides.update((list) =>
      list.map((s) => (s.id === id ? { ...s, name: dto.name } : s))
    );
  }

  private removeInjurySideFromList(id: number) {
    this._injurySides.update((list) => list.filter((s) => s.id !== id));
  }
}
