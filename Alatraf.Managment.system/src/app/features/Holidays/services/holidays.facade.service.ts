import { Injectable, inject, signal } from '@angular/core';
import { finalize, tap } from 'rxjs';

import { ApiResult } from '../../../core/models/ApiResult';
import { PageRequest } from '../../../core/models/Shared/page-request.model';
import { BaseFacade } from '../../../core/utils/facades/base-facade';
import { CreateHolidayRequest } from '../Models/create-holiday.request';
import { HolidayDto } from '../Models/holiday.dto';
import { HolidayFilterRequest } from '../Models/holiday-filter.request';
import { UpdateHolidayRequest } from '../Models/update-holiday.request';
import { HolidayService } from './holiday.service';

@Injectable({ providedIn: 'root' })
export class HolidaysFacade extends BaseFacade {
  private service = inject(HolidayService);

  private _holidays = signal<HolidayDto[]>([]);
  holidays = this._holidays.asReadonly();

  private _selectedHoliday = signal<HolidayDto | null>(null);
  selectedHoliday = this._selectedHoliday.asReadonly();

  private _filters = signal<HolidayFilterRequest>({
    isActive: undefined,
    specificDate: undefined,
    endDate: undefined,
    type: undefined,
    sortBy: 'StartDate',
    sortDirection: 'desc',
  });
  filters = this._filters.asReadonly();

  private defaultPageSize = 20;

  private _pageRequest = signal<PageRequest>({
    page: 1,
    pageSize: this.defaultPageSize,
  });
  pageRequest = this._pageRequest.asReadonly();

  private _isLoading = signal<boolean>(false);
  isLoading = this._isLoading.asReadonly();

  totalCount = signal<number>(0);
  formValidationErrors = signal<Record<string, string[]>>({});

  loadHolidays(): void {
    this._isLoading.set(true);
    this.service
      .getHolidays(this._filters(), this._pageRequest())
      .pipe(
        tap((res) => {
          if (res.isSuccess && res.data?.items) {
            this._holidays.set(res.data.items);
            this.totalCount.set(res.data.totalCount ?? 0);
          } else {
            this._holidays.set([]);
            this.totalCount.set(0);
            this.handleLoadHolidaysError(res);
          }
        }),
        finalize(() => this._isLoading.set(false))
      )
      .subscribe();
  }

  getHolidayById(id: number) {
    this.service
      .getHolidayById(id)
      .pipe(
        tap((res) => {
          if (res.isSuccess && res.data) {
            this._selectedHoliday.set(res.data);
          } else {
            this._selectedHoliday.set(null);
            this.toast.error(res.errorDetail ?? 'Holiday not found.');
          }
        })
      )
      .subscribe();
  }

  updateFilters(newFilters: Partial<HolidayFilterRequest>): void {
    this._filters.update((f) => ({ ...f, ...newFilters }));
    this._pageRequest.update((p) => ({ ...p, page: 1 }));
    this.loadHolidays();
  }

  setPage(page: number): void {
    this._pageRequest.update((p) => ({ ...p, page }));
    this.loadHolidays();
  }

  setPageSize(size: number): void {
    this._pageRequest.update((p) => ({ page: 1, pageSize: size }));
    this.loadHolidays();
  }

  resetFilters(): void {
    this._filters.set({
      isActive: undefined,
      specificDate: undefined,
      endDate: undefined,
      type: undefined,
      sortBy: 'StartDate',
      sortDirection: 'desc',
    });
    this._pageRequest.set({ page: 1, pageSize: this.defaultPageSize });
    this._holidays.set([]);
    this.totalCount.set(0);
  }

  createHoliday(dto: CreateHolidayRequest) {
    return this.handleCreateOrUpdate(this.service.createHoliday(dto), {
      successMessage: 'Holiday created successfully.',
      defaultErrorMessage: 'Failed to create holiday. Please try again.',
    }).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.formValidationErrors.set({});
          this.loadHolidays();
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  updateHoliday(id: number, dto: UpdateHolidayRequest) {
    return this.handleCreateOrUpdate(this.service.updateHoliday(id, dto), {
      successMessage: 'Holiday updated successfully.',
      defaultErrorMessage: 'Failed to update holiday. Please try again.',
    }).pipe(
      tap((res) => {
        if (res.success) {
          this.formValidationErrors.set({});
          this.updateHolidayInList(id, dto);
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  deleteHoliday(id: number) {
    return this.handleDelete(this.service.deleteHoliday(id), {
      successMessage: 'Holiday deleted successfully.',
      defaultErrorMessage: 'Failed to delete holiday. Please try again.',
    }).pipe(
      tap((success) => {
        if (success) {
          this.removeHolidayFromList(id);
        }
      })
    );
  }

  // ---------------------------------------------
  // PRIVATE HELPERS
  // ---------------------------------------------

  private updateHolidayInList(id: number, changes: Partial<HolidayDto>) {
    this._holidays.update((list) =>
      list.map((h) => (h.holidayId === id ? { ...h, ...changes } : h))
    );

    const selected = this._selectedHoliday();
    if (selected?.holidayId === id) {
      this._selectedHoliday.set({ ...selected, ...changes });
    }
  }

  private removeHolidayFromList(id: number) {
    this._holidays.update((list) => list.filter((h) => h.holidayId !== id));
    if (this.totalCount() > 0) {
      this.totalCount.update((c) => (c > 0 ? c - 1 : 0));
    }

    const selected = this._selectedHoliday();
    if (selected?.holidayId === id) {
      this._selectedHoliday.set(null);
    }
  }

  private handleLoadHolidaysError(result: ApiResult<any>) {
    const err = this.extractError(result);
    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }
    this.toast.error('Could not load holidays. Please try again later.');
  }
}
