import { Injectable, inject, signal } from '@angular/core';

import { AppointmentDto } from '../Models/appointment.dto';
import { AppointmentFilterRequest } from '../Models/appointment-filter.request';
import { ChangeAppointmentStatusRequest } from '../Models/change-appointment-status.request';
import { RescheduleAppointmentRequest } from '../Models/reschedule-appointment.request';
import { AppointmentStatus } from '../Models/appointment-status.enum';
import { AppointmentDaySummaryDto } from '../Models/appointment-day-summary.dto';
import { NextAppointmentDayDto } from '../Models/next-appointment-day.dto';
import { AppointmentService } from './appointment.service';
import { tap, map, finalize } from 'rxjs';
import { ApiResult } from '../../../core/models/ApiResult';
import { PageRequest } from '../../../core/models/Shared/page-request.model';
import { BaseFacade } from '../../../core/utils/facades/base-facade';
import { SearchManager } from '../../../core/utils/search-manager';

@Injectable({ providedIn: 'root' })
export class AppointmentsFacade extends BaseFacade {
  private service = inject(AppointmentService);

  constructor() {
    super();
  }


  private _appointments = signal<AppointmentDto[]>([]);
  appointments = this._appointments.asReadonly();

  private _filters = signal<AppointmentFilterRequest>({
    searchTerm: '',
    isAppointmentTomorrow: undefined,
    status: undefined,
    patientType: undefined,
    fromDate: undefined,
    toDate: undefined,
    sortColumn: 'AttendDate',
    sortDirection: 'asc',
  });
  filters = this._filters.asReadonly();

  private _pageRequest = signal<PageRequest>({
    page: 1,
    pageSize: 10,
  });
  pageRequest = this._pageRequest.asReadonly();

  private _isLoading = signal<boolean>(false);
  isLoading = this._isLoading.asReadonly();

  totalCount = signal<number>(0);
  formValidationErrors = signal<Record<string, string[]>>({});


  private _selectedAppointment = signal<AppointmentDto | null>(null);
  selectedAppointment = this._selectedAppointment.asReadonly();

  private searchManager = new SearchManager<AppointmentDto[]>(
    (term: string) =>
      this.service
        .getAppointments(
          { ...this._filters(), searchTerm: term },
          this._pageRequest()
        )
        .pipe(
          tap((res) => {
            if (!res.isSuccess) this.handleLoadAppointmentsError(res);
          }),
          map((res) => (res.isSuccess && res.data?.items ? res.data.items : []))
        ),
    null,
    (items) => {
      this._appointments.set(items);
      this._isLoading.set(false);
    }
  );


  search(term: string) {
    this._filters.update((f) => ({ ...f, searchTerm: term }));
    this._pageRequest.update((p) => ({ ...p, page: 1 }));
    this._isLoading.set(true);
    this.searchManager.search(term);
  }

  updateFilters(newFilters: Partial<AppointmentFilterRequest>) {
    this._filters.update((f) => ({ ...f, ...newFilters }));
    this._pageRequest.update((p) => ({ ...p, page: 1 }));
    this.loadAppointments();
  }

  setPage(page: number) {
    this._pageRequest.update((p) => ({ ...p, page }));
    this.loadAppointments();
  }

  setPageSize(size: number) {
    this._pageRequest.update((p) => ({ page: 1, pageSize: size }));
    this.loadAppointments();
  }

  resetFilters() {
    this._filters.set({
      searchTerm: '',
      isAppointmentTomorrow: undefined,
      status: undefined,
      patientType: undefined,
      fromDate: undefined,
      toDate: undefined,
      sortColumn: 'AttendDate',
      sortDirection: 'asc',
    });
    this._pageRequest.set({ page: 1, pageSize: 10 });
    this._appointments.set([]);
    this.totalCount.set(0);
  }


  loadAppointments() {
    this._isLoading.set(true);
    this.service
      .getAppointments(this._filters(), this._pageRequest())
      .pipe(
        tap((res) => {
          if (res.isSuccess && res.data?.items) {
            this._appointments.set(res.data.items);
            this.totalCount.set(res.data.totalCount ?? 0);
          } else {
            this._appointments.set([]);
            this.totalCount.set(0);
            this.handleLoadAppointmentsError(res);
          }
          this._isLoading.set(false);
        })
      )
      .subscribe();
  }


  changeAppointmentStatus(id: number, dto: ChangeAppointmentStatusRequest) {
    return this.handleCreateOrUpdate(this.service.changeAppointmentStatus(id, dto), {
      successMessage: 'Appointment status updated successfully.',
      defaultErrorMessage: 'Failed to update status. Please try again.',
    }).pipe(
      tap((res) => {
        if (res.success) {
          this.formValidationErrors.set({});
          this.updateAppointmentInList(id, { status: AppointmentStatus[dto.status] });
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  rescheduleAppointment(id: number, dto: RescheduleAppointmentRequest) {
    return this.handleCreateOrUpdate(this.service.rescheduleAppointment(id, dto), {
      successMessage: 'Appointment rescheduled successfully.',
      defaultErrorMessage: 'Failed to reschedule. Please try again.',
    }).pipe(
      tap((res) => {
        if (res.success) {
          this.formValidationErrors.set({});
          this.updateAppointmentInList(id, { attendDate: dto.newAttendDate });
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  
  private _lastScheduledDay = signal<AppointmentDaySummaryDto | null>(null);
  lastScheduledDay = this._lastScheduledDay.asReadonly();
  
  private _isLoadingLastDay = signal<boolean>(false);
  isLoadingLastDay = this._isLoadingLastDay.asReadonly();

  private _nextValidDay = signal<NextAppointmentDayDto | null>(null);
  nextValidDay = this._nextValidDay.asReadonly();

  private _isLoadingNextDay = signal<boolean>(false);
  isLoadingNextDay = this._isLoadingNextDay.asReadonly();

  loadLastScheduledDay(): void {
    this._isLoadingLastDay.set(true);
    this.service
      .getLastScheduledDay()
      .pipe(
        tap((res) => {
          if (res.isSuccess && res.data) {
            this._lastScheduledDay.set(res.data);
          } else {
            this._lastScheduledDay.set(null);
          }
        }),
        finalize(() => this._isLoadingLastDay.set(false))
      )
      .subscribe();
  }

  loadNextValidDay(afterDate?: string): void {
    this._isLoadingNextDay.set(true);
    this.service
      .getNextValidDay(afterDate)
      .pipe(
        tap((res) => {
          if (res.isSuccess && res.data) {
            this._nextValidDay.set(res.data);
          } else {
            this._nextValidDay.set(null);
            this.toast.error(res.errorDetail ?? 'Could not find the next valid appointment day.');
          }
        }),
        finalize(() => this._isLoadingNextDay.set(false))
      )
      .subscribe();
  }

  // ---------------------------------------------
  // PRIVATE HELPERS
  // ---------------------------------------------

  private updateAppointmentInList(id: number, changes: Partial<AppointmentDto>) {
    this._appointments.update(list =>
      list.map(appt =>
        appt.id === id
          ? { ...appt, ...changes }
          : appt
      )
    );

    const selected = this._selectedAppointment();
    if (selected?.id === id) {
      this._selectedAppointment.set({ ...selected, ...changes });
    }
  }
  
  private handleLoadAppointmentsError(result: ApiResult<any>) {
    const err = this.extractError(result);
    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }
    this.toast.error('Could not load appointments. Please try again later.');
  }
}
