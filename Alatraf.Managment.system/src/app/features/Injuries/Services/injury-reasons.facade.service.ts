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
export class InjuryReasonsFacadeService extends BaseFacade {
  private service = inject(InjuriesManagementService);
  private navInjury = inject(InjuriesNavigationFacade);

  constructor() {
    super();
  }

  private _injuryReasons = signal<InjuryDto[]>([]);
  injuryReasons = this._injuryReasons.asReadonly();

  private _isLoading = signal<boolean>(false);
  isLoading = this._isLoading.asReadonly();

  isEditMode = signal<boolean>(false);
  private _selectedInjuryReason = signal<InjuryDto | null>(null);
  selectedInjuryReason = this._selectedInjuryReason.asReadonly();

  formValidationErrors = signal<Record<string, string[]>>({});

  loadInjuryReasons(): void {
    this._isLoading.set(true);

    this.service
      .getInjuryReasons()
      .pipe(
        tap((res: ApiResult<InjuryDto[]>) => {
          if (res.isSuccess && res.data) {
            this._injuryReasons.set(res.data);
          } else {
            this._injuryReasons.set([]);
            this.handleLoadError(res);
          }
        }),
        finalize(() => this._isLoading.set(false))
      )
      .subscribe();
  }
  enterCreateMode(): void {
    this.isEditMode.set(false);
    this._selectedInjuryReason.set(null);
    this.formValidationErrors.set({});
  }

  enterEditMode(item: InjuryDto): void {
    this.isEditMode.set(true);
    this._selectedInjuryReason.set(item);
    this.formValidationErrors.set({});
  }

  loadInjuryReasonForEdit(id: number): void {
    const local = this._injuryReasons().find((r) => r.id === id);
    if (local) {
      this.enterEditMode(local);
      return;
    }

    this._isLoading.set(true);
    this.service
      .getInjuryReasons()
      .pipe(
        tap((res: ApiResult<InjuryDto[]>) => {
          if (res.isSuccess && res.data) {
            this._injuryReasons.set(res.data);
            const found = res.data.find((r) => r.id === id) || null;
            if (found) {
              this.enterEditMode(found);
            } else {
              this.toast.error('لم يتم العثور على سبب الإصابة');
              this.enterCreateMode();
            }
          } else {
            this._injuryReasons.set([]);
            this.handleLoadError(res);
            this.enterCreateMode();
          }
        }),
        finalize(() => this._isLoading.set(false))
      )
      .subscribe();
  }
  createInjuryReason(req: CreateInjuryRequest) {
    return this.handleCreateOrUpdate(this.service.createInjuryReason(req), {
      successMessage: 'تم إنشاء سبب الإصابة بنجاح',
      defaultErrorMessage: 'فشل إنشاء سبب الإصابة. يرجى المحاولة لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.formValidationErrors.set({});
          this.addInjuryReasonToList(res.data);
          this.enterEditMode(res.data);
          this.navInjury.goToEditInjuryReasonPage(res.data.id);
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  updateInjuryReason(id: number, req: UpdateInjuryRequest) {
    return this.handleCreateOrUpdate(this.service.updateInjuryReason(id, req), {
      successMessage: 'تم تعديل سبب الإصابة بنجاح',
      defaultErrorMessage: 'فشل تعديل سبب الإصابة. يرجى المحاولة لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success) {
          this.formValidationErrors.set({});
          this.updateInjuryReasonInList(id, req);
          if (this._selectedInjuryReason()?.id === id) {
            this._selectedInjuryReason.set({
              ...(this._selectedInjuryReason() as InjuryDto),
              name: req.name,
            });
          }
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  deleteInjuryReason(injuryReason: InjuryDto): void {
    if (!injuryReason?.id) return;

    const config = {
      title: 'حذف سبب الإصابة',
      message: 'هل أنت متأكد من حذف سبب الإصابة؟',
      payload: { الاسم: injuryReason.name },
    };

    this.confirmAndDelete(
      config,
      () => this.service.deleteInjuryReason(injuryReason.id),
      {
        successMessage: 'تم حذف سبب الإصابة بنجاح',
        defaultErrorMessage: 'فشل حذف سبب الإصابة. يرجى المحاولة لاحقاً.',
      }
    ).subscribe((success) => {
      if (success) {
        this.removeInjuryReasonFromList(injuryReason.id);
        this.enterCreateMode();
        this.navInjury.goToCreateInjuryReasonPage();
      }
    });
  }

  private addInjuryReasonToList(item: InjuryDto) {
    this._injuryReasons.update((list) => [item, ...list]);
  }

  private updateInjuryReasonInList(id: number, dto: UpdateInjuryRequest) {
    this._injuryReasons.update((list) =>
      list.map((r) => (r.id === id ? { ...r, name: dto.name } : r))
    );
  }

  private removeInjuryReasonFromList(id: number) {
    this._injuryReasons.update((list) => list.filter((r) => r.id !== id));
  }
  private handleLoadError(result: ApiResult<any>) {
    const err = this.extractError(result);
    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }

    this.toast.error('تعذر تحميل أسباب الإصابة. يرجى المحاولة لاحقاً.');
  }
}
