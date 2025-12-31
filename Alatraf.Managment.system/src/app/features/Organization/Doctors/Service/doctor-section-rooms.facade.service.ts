import { Injectable, inject, signal, computed } from '@angular/core';
import { finalize, tap } from 'rxjs';
import { BaseFacade } from '../../../../core/utils/facades/base-facade';
import { DoctorSectionRoomsService } from './doctor-section-rooms.service';
import { PageRequest } from '../../../../core/models/Shared/page-request.model';
import { GetTechnicianIndustrialPartsFilter } from '../Models/technicians/get-technician-industrial-parts.filter';
import { TechnicianHeaderDto } from '../Models/technicians/technician-header.dto';
import { TechnicianIndustrialPartDto } from '../Models/technicians/technician-industrial-part.dto';
import { GetTherapistSessionsFilter } from '../Models/therapists/get-therapist-sessions.filter';
import { TherapistHeaderDto } from '../Models/therapists/therapist-header.dto';
import { TherapistSessionProgramDto } from '../Models/therapists/therapist-session-program.dto';

@Injectable({
  providedIn: 'root',
})
export class DoctorSectionRoomsFacade extends BaseFacade {
  private service = inject(DoctorSectionRoomsService);

  constructor() {
    super();
  }

  private _technicianHeader = signal<TechnicianHeaderDto | null>(null);
  technicianHeader = this._technicianHeader.asReadonly();

  private _industrialParts = signal<TechnicianIndustrialPartDto[]>([]);
  industrialParts = this._industrialParts.asReadonly();

  private _technicianFilters = signal<GetTechnicianIndustrialPartsFilter>({
    page: 1,
    pageSize: 15,
  });
  technicianFilters = this._technicianFilters.asReadonly();

  private _technicianTotalCount = signal<number>(0);
  technicianTotalCount = this._technicianTotalCount.asReadonly();

  private _loadingTechnicianData = signal<boolean>(false);
  loadingTechnicianData = this._loadingTechnicianData.asReadonly();

  // ========================================================
  // Methods for Technicians
  // ========================================================
  loadTechnicianHeader(doctorSectionRoomId: number) {
    this._loadingTechnicianData.set(true);
    this.service
      .getTechnicianHeader(doctorSectionRoomId)
      .pipe(finalize(() => this._loadingTechnicianData.set(false)))
      .subscribe((res) => {
        if (res.isSuccess && res.data) {
          this._technicianHeader.set(res.data);
        } else {
          this.toast.error('Failed to load technician header.');
        }
      });
  }

  loadTechnicianIndustrialParts(doctorSectionRoomId: number) {
    this._loadingTechnicianData.set(true);
    this.service
      .getTechnicianIndustrialParts(
        doctorSectionRoomId,
        this._technicianFilters()
      )
      .pipe(finalize(() => this._loadingTechnicianData.set(false)))
      .subscribe((res) => {
        if (res.isSuccess && res.data) {
          this._industrialParts.set(res.data.items ?? []);
          this._technicianTotalCount.set(res.data.totalCount ?? 0);
        } else {
          this._industrialParts.set([]);
          this._technicianTotalCount.set(0);
          this.toast.error('Failed to load industrial parts.');
        }
      });
  }

  updateTechnicianFilters(
    doctorSectionRoomId: number,
    newFilters: Partial<GetTechnicianIndustrialPartsFilter>
  ) {
    this._technicianFilters.update((f) => ({ ...f, ...newFilters, page: 1 }));
    this.loadTechnicianIndustrialParts(doctorSectionRoomId);
  }

  setTechnicianPage(doctorSectionRoomId: number, page: number) {
    this._technicianFilters.update((f) => ({ ...f, page }));
    this.loadTechnicianIndustrialParts(doctorSectionRoomId);
  }
 
  private _therapistHeader = signal<TherapistHeaderDto | null>(null);
  therapistHeader = this._therapistHeader.asReadonly();

  private _therapistSessions = signal<TherapistSessionProgramDto[]>([]);
  therapistSessions = this._therapistSessions.asReadonly();

  private _therapistFilters = signal<GetTherapistSessionsFilter>({
    page: 1,
    pageSize: 15,
  });
  therapistFilters = this._therapistFilters.asReadonly();

  private _therapistTotalCount = signal<number>(0);
  therapistTotalCount = this._therapistTotalCount.asReadonly();

  private _loadingTherapistData = signal<boolean>(false);
  loadingTherapistData = this._loadingTherapistData.asReadonly();

  
  loadTherapistHeader(doctorSectionRoomId: number) {
    this._loadingTherapistData.set(true);
    this.service
      .getTherapistHeader(doctorSectionRoomId)
      .pipe(finalize(() => this._loadingTherapistData.set(false)))
      .subscribe((res) => {
        if (res.isSuccess && res.data) {
          this._therapistHeader.set(res.data);
        } else {
          this.toast.error('Failed to load therapist header.');
        }
      });
  }

  loadTherapistSessions(doctorSectionRoomId: number) {
    this._loadingTherapistData.set(true);
    this.service
      .getTherapistSessions(doctorSectionRoomId, this._therapistFilters())
      .pipe(finalize(() => this._loadingTherapistData.set(false)))
      .subscribe((res) => {
        if (res.isSuccess && res.data) {
          this._therapistSessions.set(res.data.items ?? []);
          this._therapistTotalCount.set(res.data.totalCount ?? 0);
        } else {
          this._therapistSessions.set([]);
          this._therapistTotalCount.set(0);
          this.toast.error('Failed to load therapist sessions.');
        }
      });
  }

  updateTherapistFilters(
    doctorSectionRoomId: number,
    newFilters: Partial<GetTherapistSessionsFilter>
  ) {
    this._therapistFilters.update((f) => ({ ...f, ...newFilters, page: 1 }));
    this.loadTherapistSessions(doctorSectionRoomId);
  }

  setTherapistPage(doctorSectionRoomId: number, page: number) {
    this._therapistFilters.update((f) => ({ ...f, page }));
    this.loadTherapistSessions(doctorSectionRoomId);
  }

  // ========================================================
  // General Methods
  // ========================================================
  resetTechnicianState(): void {
    // Reset technician state
    this._technicianHeader.set(null);
    this._industrialParts.set([]);
    this._technicianFilters.set({ page: 1, pageSize: 15 });
    this._technicianTotalCount.set(0);
  }
  resetTherapistState(): void {
    this._therapistHeader.set(null);
    this._therapistSessions.set([]);
    this._therapistFilters.set({ page: 1, pageSize: 15 });
    this._therapistTotalCount.set(0);
  }
}
