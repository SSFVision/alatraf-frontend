import { Injectable, inject, signal } from '@angular/core';
import { tap, finalize } from 'rxjs/operators';

import { BaseFacade } from '../../../../core/utils/facades/base-facade';
import { ApiResult } from '../../../../core/models/ApiResult';

import { DoctorSectionRoomsService } from './doctor-section-rooms.service';
import { TechnicianIndustrialPartsResultDto } from '../Models/technicians/technician-industrial-parts-result.dto';
import { TherapistTodaySessionsResultDto } from '../Models/therapists/therapist-today-sessions-result.dto';


@Injectable({
  providedIn: 'root',
})
export class DoctorSectionRoomsFacade extends BaseFacade {
  private service = inject(DoctorSectionRoomsService);

  constructor() {
    super();
  }

  // =====================================================
  // COMMON
  // =====================================================
  private _isLoading = signal<boolean>(false);
  isLoading = this._isLoading.asReadonly();

  private _doctorSectionRoomId = signal<number | null>(null);
  doctorSectionRoomId = this._doctorSectionRoomId.asReadonly();

  setDoctorSectionRoomId(id: number) {
    this._doctorSectionRoomId.set(id);
  }

  // =====================================================
  // THERAPIST TODAY SESSIONS
  // =====================================================
  private _therapistSessions =
    signal<TherapistTodaySessionsResultDto | null>(null);
  therapistSessions = this._therapistSessions.asReadonly();

  loadTherapistTodaySessions(doctorSectionRoomId?: number) {
    const id = doctorSectionRoomId ?? this._doctorSectionRoomId();

    if (!id || this.isLoading()) return;

    this._isLoading.set(true);

    this.service
      .getTherapistTodaySessions(id)
      .pipe(
        tap((res: ApiResult<TherapistTodaySessionsResultDto>) => {
          if (res.isSuccess && res.data) {
            this._therapistSessions.set(res.data);
          } else {
            this._therapistSessions.set(null);
            this.handleLoadError(res);
          }
        }),
        finalize(() => this._isLoading.set(false))
      )
      .subscribe();
  }

  clearTherapistSessions() {
    this._therapistSessions.set(null);
  }

  // =====================================================
  // TECHNICIAN INDUSTRIAL PARTS
  // =====================================================
  private _technicianIndustrialParts =
    signal<TechnicianIndustrialPartsResultDto | null>(null);
  technicianIndustrialParts =
    this._technicianIndustrialParts.asReadonly();

  loadTechnicianAssignedIndustrialParts(doctorSectionRoomId?: number) {
    const id = doctorSectionRoomId ?? this._doctorSectionRoomId();

    if (!id || this.isLoading()) return;

    this._isLoading.set(true);

    this.service
      .getTechnicianAssignedIndustrialParts(id)
      .pipe(
        tap((res: ApiResult<TechnicianIndustrialPartsResultDto>) => {
          if (res.isSuccess && res.data) {
            this._technicianIndustrialParts.set(res.data);
          } else {
            this._technicianIndustrialParts.set(null);
            this.handleLoadError(res);
          }
        }),
        finalize(() => this._isLoading.set(false))
      )
      .subscribe();
  }

  clearTechnicianIndustrialParts() {
    this._technicianIndustrialParts.set(null);
  }

  // =====================================================
  // RESET
  // =====================================================
  reset() {
    this._doctorSectionRoomId.set(null);
    this._therapistSessions.set(null);
    this._technicianIndustrialParts.set(null);
    this._isLoading.set(false);
  }

  // =====================================================
  // ERROR HANDLING
  // =====================================================
  private handleLoadError(result: ApiResult<any>) {
    const err = this.extractError(result);

    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }

    this.toast.error('تعذر تحميل البيانات. يرجى المحاولة لاحقاً.');
  }
}
