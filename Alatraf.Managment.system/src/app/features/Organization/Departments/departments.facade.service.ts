import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs/operators';

import { BaseFacade } from '../../../core/utils/facades/base-facade';
import { ApiResult } from '../../../core/models/ApiResult';


import { DepartmentsManagementService } from './departments-management.service';
import { CreateDepartmentRequest } from './Models/create-department.request';
import { DepartmentDto } from './Models/department.dto';
import { UpdateDepartmentRequest } from './Models/update-department.request';

type DepartmentMutation =
  | { type: 'create'; item: DepartmentDto }
  | { type: 'update'; id: number; changes: Partial<DepartmentDto> }
  | { type: 'delete'; id: number };

@Injectable({ providedIn: 'root' })
export class DepartmentsFacade extends BaseFacade {
  private service = inject(DepartmentsManagementService);

  constructor() {
    super();
  }

  // ---------------------------------------------
  // STATE
  // ---------------------------------------------
  private _departments = signal<DepartmentDto[]>([]);
  departments = this._departments.asReadonly();

  private _selectedDepartment = signal<DepartmentDto | null>(null);
  selectedDepartment = this._selectedDepartment.asReadonly();

  isEditMode = signal<boolean>(false);

  formValidationErrors = signal<Record<string, string[]>>({});

  // ---------------------------------------------
  // LOAD
  // ---------------------------------------------
  loadDepartments(): void {
    this.service
      .getDepartments()
      .pipe(
        tap((result: ApiResult<DepartmentDto[]>) => {
          if (result.isSuccess && result.data) {
            this._departments.set(result.data);
          } else {
            this._departments.set([]);
            this.handleLoadError(result);
          }
        })
      )
      .subscribe();
  }

  loadDepartmentForEdit(id: number): void {
    this.isEditMode.set(true);
    this._selectedDepartment.set(null);

    this.service
      .getDepartmentById(id)
      .pipe(
        tap((result: ApiResult<DepartmentDto>) => {
          if (result.isSuccess && result.data) {
            this._selectedDepartment.set(result.data);
            this.formValidationErrors.set({});
          } else {
            this.toast.error(
              result.errorDetail ?? 'لم يتم العثور على القسم'
            );
            this.enterCreateMode();
          }
        })
      )
      .subscribe();
  }

  // ---------------------------------------------
  // MODES
  // ---------------------------------------------
  enterCreateMode(): void {
    this.isEditMode.set(false);
    this._selectedDepartment.set(null);
    this.formValidationErrors.set({});
  }

  enterEditMode(department: DepartmentDto): void {
    this.isEditMode.set(true);
    this._selectedDepartment.set(department);
    this.formValidationErrors.set({});
  }


  createDepartment(dto: CreateDepartmentRequest) {
    return this.handleCreateOrUpdate(
      this.service.createDepartment(dto),
      {
        successMessage: 'تم إنشاء القسم بنجاح',
        defaultErrorMessage: 'فشل إنشاء القسم. حاول لاحقاً.',
      }
    ).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.loadDepartments()
          // this.applyMutation({
          //   type: 'create',
          //   item: res.data,
          // });
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  // ---------------------------------------------
  // UPDATE
  // ---------------------------------------------
  updateDepartment(id: number, dto: UpdateDepartmentRequest) {
    return this.handleCreateOrUpdate(
      this.service.updateDepartment(id, dto),
      {
        successMessage: 'تم تعديل القسم بنجاح',
        defaultErrorMessage: 'فشل تعديل القسم. حاول لاحقاً.',
      }
    ).pipe(
      tap((res) => {
        if (res.success) {
          this.loadDepartments()

          // this.applyMutation({
          //   type: 'update',
          //   id,
          //   changes: { name: dto.newName },
          // });
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  // ---------------------------------------------
  // DELETE
  // ---------------------------------------------
  deleteDepartment(department: DepartmentDto): void {
    if (!department?.id) return;

    const config = {
      title: 'حذف القسم',
      message: 'هل أنت متأكد من حذف القسم التالي؟',
      payload: {
        الاسم: department.name,
      },
    };

    this.confirmAndDelete(
      config,
      () => this.service.deleteDepartment(department.id),
      {
        successMessage: 'تم حذف القسم بنجاح',
        defaultErrorMessage: 'فشل حذف القسم. حاول لاحقاً.',
      }
    ).subscribe((success) => {
      if (success) {
          this.loadDepartments()

        // this.applyMutation({
        //   type: 'delete',
        //   id: department.id,
        // });
      }
    });
  }

  // ---------------------------------------------
  // CENTRAL MUTATION HANDLER
  // ---------------------------------------------
  private applyMutation(mutation: DepartmentMutation): void {
    switch (mutation.type) {
      case 'create': {
        this._departments.update((list) => [
          mutation.item,
          ...list,
        ]);

        this.enterEditMode(mutation.item);
        break;
      }

      case 'update': {
        this._departments.update((list) =>
          list.map((d) =>
            d.id === mutation.id
              ? { ...d, ...mutation.changes }
              : d
          )
        );

        const selected = this._selectedDepartment();
        if (selected?.id === mutation.id) {
          this._selectedDepartment.set({
            ...selected,
            ...mutation.changes,
          });
        }
        break;
      }

      case 'delete': {
        this._departments.update((list) =>
          list.filter((d) => d.id !== mutation.id)
        );

        this.enterCreateMode();
        break;
      }
    }
  }

  private handleLoadError(result: ApiResult<any>) {
    const err = this.extractError(result);

    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }

    this.toast.error('تعذر تحميل الأقسام. يرجى المحاولة لاحقاً.');
  }
}
