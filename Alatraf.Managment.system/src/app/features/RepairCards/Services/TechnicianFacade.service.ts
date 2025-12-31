import { Injectable, inject, signal } from '@angular/core';
import { finalize, map, tap, of } from 'rxjs'; // IMPORT `of`
import { BaseFacade } from '../../../core/utils/facades/base-facade';
import { SearchManager } from '../../../core/utils/search-manager';
import { GetTechnicianIndustrialPartsFilter } from '../../Organization/Doctors/Models/technicians/get-technician-industrial-parts.filter';
import { TechnicianHeaderDto } from '../../Organization/Doctors/Models/technicians/technician-header.dto';
import { TechnicianIndustrialPartDto } from '../../Organization/Doctors/Models/technicians/technician-industrial-part.dto';
import { DoctorSectionRoomsService } from '../../Organization/Doctors/Service/doctor-section-rooms.service';

@Injectable({
  providedIn: 'root',
})
export class TechnicianFacade extends BaseFacade {
  private service = inject(DoctorSectionRoomsService);
  private _doctorSectionRoomId: number | null = null;

  constructor() {
    super();
  }

  private searchManager = new SearchManager<TechnicianIndustrialPartDto[]>(
    (term: string) => {
      // THIS IS THE FIX:
      // If there's no ID, return an OBSERVABLE that emits an empty array.
      if (!this._doctorSectionRoomId) {
        return of([]);
      }
      const currentFilters = { ...this._technicianFilters(), patientName: term };
      return this.service
        .getTechnicianIndustrialParts(this._doctorSectionRoomId, currentFilters)
        .pipe(
          tap((res) => {
            if (!res.isSuccess) {
              this.toast.error('Search failed to retrieve industrial parts.');
            }
          }),
          map((res) => (res.isSuccess && res.data?.items ? res.data.items : []))
        );
    },
    null,
    (items) => {
      this._loadingTechnicianData.set(false);
      this._industrialParts.set(items);
    }
  );
  
  // ... (rest of the facade is unchanged)
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

  search(term: string): void {
    this._technicianFilters.update((f) => ({ ...f, patientName: term, page: 1 }));
    this._loadingTechnicianData.set(true);
    this.searchManager.search(term);
  }

  loadTechnicianHeader(doctorSectionRoomId: number) {
    this._doctorSectionRoomId = doctorSectionRoomId;
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
    this._doctorSectionRoomId = doctorSectionRoomId;
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

  resetTechnicianState(): void {
    this._technicianHeader.set(null);
    this._industrialParts.set([]);
    this._technicianFilters.set({ page: 1, pageSize: 15 });
    this._technicianTotalCount.set(0);
  }
}
