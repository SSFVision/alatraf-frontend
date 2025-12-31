import { Injectable, inject, signal } from '@angular/core';
import { finalize, map, tap, of } from 'rxjs'; // IMPORT `of`
import { BaseFacade } from '../../../core/utils/facades/base-facade';
import { SearchManager } from '../../../core/utils/search-manager';
import { GetTherapistSessionsFilter } from '../../Organization/Doctors/Models/therapists/get-therapist-sessions.filter';
import { TherapistHeaderDto } from '../../Organization/Doctors/Models/therapists/therapist-header.dto';
import { TherapistSessionProgramDto } from '../../Organization/Doctors/Models/therapists/therapist-session-program.dto';
import { DoctorSectionRoomsService } from '../../Organization/Doctors/Service/doctor-section-rooms.service';

@Injectable({
  providedIn: 'root',
})
export class TherapistFacade extends BaseFacade {
  private service = inject(DoctorSectionRoomsService);
  private _doctorSectionRoomId: number | null = null;

  constructor() {
    super();
  }

  private searchManager = new SearchManager<TherapistSessionProgramDto[]>(
    (term: string) => {
      // THIS IS THE FIX:
      // If there's no ID, return an OBSERVABLE that emits an empty array.
      if (!this._doctorSectionRoomId) {
        return of([]);
      }
      const currentFilters = { ...this._therapistFilters(), patientName: term };
      return this.service
        .getTherapistSessions(this._doctorSectionRoomId, currentFilters)
        .pipe(
          tap((res) => {
            if (!res.isSuccess) {
              this.toast.error('Search failed to retrieve sessions.');
            }
          }),
          map((res) => (res.isSuccess && res.data?.items ? res.data.items : []))
        );
    },
    null,
    (items) => {
      this._loadingTherapistData.set(false);
      this._therapistSessions.set(items);
    }
  );

  // ... (rest of the facade is unchanged)
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

  search(term: string): void {
    this._therapistFilters.update((f) => ({ ...f, patientName: term, page: 1 }));
    this._loadingTherapistData.set(true);
    this.searchManager.search(term);
  }

  loadTherapistHeader(doctorSectionRoomId: number) {
    this._doctorSectionRoomId = doctorSectionRoomId;
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
    this._doctorSectionRoomId = doctorSectionRoomId;
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

  resetTherapistState(): void {
    this._therapistHeader.set(null);
    this._therapistSessions.set([]);
    this._therapistFilters.set({ page: 1, pageSize: 15 });
    this._therapistTotalCount.set(0);
  }
}
