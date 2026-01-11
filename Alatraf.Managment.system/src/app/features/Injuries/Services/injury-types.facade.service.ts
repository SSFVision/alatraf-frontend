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
export class InjuryTypesFacadeService extends BaseFacade {
  private service = inject(InjuriesManagementService);
  private navInjury = inject(InjuriesNavigationFacade);
  constructor() {
    super();
  }

  private _injuryTypes = signal<InjuryDto[]>([]);
  injuryTypes = this._injuryTypes.asReadonly();

  private _isLoading = signal<boolean>(false);
  isLoading = this._isLoading.asReadonly();

  isEditMode = signal<boolean>(false);
  private _selectedInjuryType = signal<InjuryDto | null>(null);
  selectedInjuryType = this._selectedInjuryType.asReadonly();

  formValidationErrors = signal<Record<string, string[]>>({});

  loadInjuryTypes(): void {
    this._isLoading.set(true);

    this.service
      .getInjuryTypes()
      .pipe(
        tap((res: ApiResult<InjuryDto[]>) => {
          if (res.isSuccess && res.data) {
            this._injuryTypes.set(res.data);
          } else {
            this._injuryTypes.set([]);
            this.handleLoadError(res);
          }
        }),
        finalize(() => this._isLoading.set(false))
      )
      .subscribe();
  }
  enterCreateMode(): void {
    this.isEditMode.set(false);
    this._selectedInjuryType.set(null);
    this.formValidationErrors.set({});
  }

  enterEditMode(item: InjuryDto): void {
    this.isEditMode.set(true);
    this._selectedInjuryType.set(item);
    this.formValidationErrors.set({});
  }

  loadInjuryTypeForEdit(id: number): void {
    const local = this._injuryTypes().find((t) => t.id === id);
    if (local) {
      this.enterEditMode(local);
      return;
    }

    this._isLoading.set(true);
    this.service
      .getInjuryTypes()
      .pipe(
        tap((res: ApiResult<InjuryDto[]>) => {
          if (res.isSuccess && res.data) {
            this._injuryTypes.set(res.data);
            const found = res.data.find((t) => t.id === id) || null;
            if (found) {
              this.enterEditMode(found);
            } else {
              this.toast.error('لم يتم العثور على نوع الإصابة');
              this.enterCreateMode();
            }
          } else {
            this._injuryTypes.set([]);
            this.handleLoadError(res);
            this.enterCreateMode();
          }
        }),
        finalize(() => this._isLoading.set(false))
      )
      .subscribe();
  }

  createInjuryType(req: CreateInjuryRequest) {
    return this.handleCreateOrUpdate(this.service.createInjuryType(req), {
      successMessage: 'تم إنشاء نوع الإصابة بنجاح',
      defaultErrorMessage: 'فشل إنشاء نوع الإصابة. يرجى المحاولة لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.formValidationErrors.set({});
          this.addInjuryTypeToList(res.data as InjuryDto);
          this.enterEditMode(res.data as InjuryDto);
          this.navInjury.goToEditInjuryTypePage(res.data.id);
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  updateInjuryType(id: number, req: UpdateInjuryRequest) {
    return this.handleCreateOrUpdate(this.service.updateInjuryType(id, req), {
      successMessage: 'تم تعديل نوع الإصابة بنجاح',
      defaultErrorMessage: 'فشل تعديل نوع الإصابة. يرجى المحاولة لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success) {
          this.formValidationErrors.set({});
          this.updateInjuryTypeInList(id, req);
          if (this._selectedInjuryType()?.id === id) {
            this._selectedInjuryType.set({
              ...(this._selectedInjuryType() as InjuryDto),
              name: req.name,
            });
          }
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  deleteInjuryType(injuryType: InjuryDto): void {
    if (!injuryType?.id) return;

    const config = {
      title: 'حذف نوع الإصابة',
      message: 'هل أنت متأكد من حذف نوع الإصابة؟',
      payload: { الاسم: injuryType.name },
    };

    this.confirmAndDelete(
      config,
      () => this.service.deleteInjuryType(injuryType.id),
      {
        successMessage: 'تم حذف نوع الإصابة بنجاح',
        defaultErrorMessage: 'فشل حذف نوع الإصابة. يرجى المحاولة لاحقاً.',
      }
    ).subscribe((success) => {
      if (success) {
        this.removeInjuryTypeFromList(injuryType.id);
        this.enterCreateMode();
        this.navInjury.goToCreateInjuryTypePage();
      }
    });
  }

  private addInjuryTypeToList(item: InjuryDto) {
    this._injuryTypes.update((list) => [item, ...list]);
  }

  private updateInjuryTypeInList(id: number, dto: UpdateInjuryRequest) {
    this._injuryTypes.update((list) =>
      list.map((t) => (t.id === id ? { ...t, name: dto.name } : t))
    );
  }

  private removeInjuryTypeFromList(id: number) {
    this._injuryTypes.update((list) => list.filter((t) => t.id !== id));
  }
  private handleLoadError(result: ApiResult<any>) {
    const err = this.extractError(result);
    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }

    this.toast.error('تعذر تحميل أنواع الإصابات. يرجى المحاولة لاحقاً.');
  }
}
