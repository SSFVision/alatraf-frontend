import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs/operators';

import { BaseFacade } from '../../../../core/utils/facades/base-facade';
import { ApiResult } from '../../../../core/models/ApiResult';

import { UnitService } from './unit.service';
import { CreateUnitRequest } from '../Models/create-unit.request';
import { UnitDto } from '../Models/unit.dto';
import { UpdateUnitRequest } from '../Models/update-unit.request';

@Injectable({ providedIn: 'root' })
export class UnitsFacade extends BaseFacade {
  private service = inject(UnitService);

  constructor() {
    super();
  }

  private _units = signal<UnitDto[]>([]);
  units = this._units.asReadonly();

  formValidationErrors = signal<Record<string, string[]>>({});

  loadUnits() {
    this.service
      .getUnits()
      .pipe(
        tap((res: ApiResult<UnitDto[]>) => {
          if (res.isSuccess && res.data) {
            this._units.set(res.data);
          } else {
            this._units.set([]);
            this.handleLoadUnitsError(res);
          }
        })
      )
      .subscribe();
  }

  createUnit(dto: CreateUnitRequest) {
    return this.handleCreateOrUpdate(this.service.createUnit(dto), {
      successMessage: 'تم إنشاء الوحدة بنجاح',
      defaultErrorMessage: 'فشل إنشاء الوحدة. يرجى المحاولة لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.formValidationErrors.set({});
          this.loadUnits();
          // this.addUnitToList(res.data);
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  updateUnit(id: number, dto: UpdateUnitRequest) {
    return this.handleCreateOrUpdate(this.service.updateUnit(id, dto), {
      successMessage: 'تم تعديل الوحدة بنجاح',
      defaultErrorMessage: 'فشل تعديل الوحدة. حاول لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success) {
          this.formValidationErrors.set({});
          this.loadUnits();
          // this.updateUnitInList(id, dto);
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  deleteUnit(unit: UnitDto): void {
    if (!unit?.id) return;

    const config = {
      title: 'حذف الوحدة',
      message: 'هل أنت متأكد من حذف الوحدة التالية؟',
      payload: { الاسم: unit.name },
    };

    this.confirmAndDelete(config, () => this.service.deleteUnit(unit.id), {
      successMessage: 'تم حذف الوحدة بنجاح',
      defaultErrorMessage: 'فشل حذف الوحدة. حاول لاحقاً.',
    }).subscribe((success) => {
      if (success) {
        this.loadUnits();

        // this.removeUnitFromList(unit.id);
      }
    });
  }

  private addUnitToList(unit: UnitDto) {
    this._units.update((list) => [unit, ...list]);
  }

  private updateUnitInList(id: number, dto: UpdateUnitRequest) {
    this._units.update((list) =>
      list.map((u) =>
        u.id === id
          ? {
              ...u,
              name: dto.name,
            }
          : u
      )
    );
  }

  private removeUnitFromList(id: number) {
    this._units.update((list) => list.filter((u) => u.id !== id));
  }

  private handleLoadUnitsError(result: ApiResult<any>) {
    const err = this.extractError(result);
    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }
    this.toast.error('تعذر تحميل الوحدات. يرجى المحاولة لاحقاً.');
  }
}
