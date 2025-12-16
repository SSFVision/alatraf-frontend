import { Injectable, inject, signal } from '@angular/core';
import { tap, map } from 'rxjs/operators';

import { BaseFacade } from '../../../../core/utils/facades/base-facade';
import { PageRequest } from '../../../../core/models/Shared/page-request.model';
import { ApiResult } from '../../../../core/models/ApiResult';
import { SearchManager } from '../../../../core/utils/search-manager';
import { DoctorService } from './doctor.service';
import { TechnicianFilterRequest } from '../Models/technicians/technician-filter.request';
import { TechnicianDto } from '../Models/technicians/technician.dto';
import { TherapistFilterRequest } from '../Models/therapists/therapist-filter.request';
import { TherapistDto } from '../Models/therapists/therapist.dto';

@Injectable({ providedIn: 'root' })
export class DoctorWorkloadFacade extends BaseFacade {
  private service = inject(DoctorService);

  constructor() {
    super();
  }

  private _technicians = signal<TechnicianDto[]>([]);
  technicians = this._technicians.asReadonly();
  techniciansTotalCount = signal<number>(0);

  private _technicianFilters = signal<TechnicianFilterRequest>({
    sectionId: null,
    searchTerm: '',
  });

  private _technicianPage = signal<PageRequest>({
    page: 1,
    pageSize: 20,
  });

  private techniciansSearchManager = new SearchManager<TechnicianDto[]>(
    (term: string) =>
      this.service
        .getTechniciansDropdown(
          { ...this._technicianFilters(), searchTerm: term },
          this._technicianPage()
        )
        .pipe(
          tap((res) => {
            if (!res.isSuccess) this.handleDropdownError(res);
          }),
          map((res) => {
            if (res.isSuccess && res.data) {
              this.techniciansTotalCount.set(res.data.totalCount ?? 0);
              return res.data.items ?? [];
            }
            this.techniciansTotalCount.set(0);
            return [];
          })
        ),
    null,
    (items) => this._technicians.set(items)
  );

  loadTechnicians(): void {
    this.service
      .getTechniciansDropdown(this._technicianFilters(), this._technicianPage())
      .pipe(
        tap((res) => {
          if (res.isSuccess && res.data) {
            this._technicians.set(res.data.items ?? []);
            this.techniciansTotalCount.set(res.data.totalCount ?? 0);
          } else {
            this._technicians.set([]);
            this.techniciansTotalCount.set(0);
            this.handleDropdownError(res);
          }
        })
      )
      .subscribe();
  }

  searchTechnicians(term: string): void {
    this._technicianFilters.update((f) => ({ ...f, searchTerm: term }));
    this._technicianPage.update((p) => ({ ...p, page: 1 }));
    this.techniciansSearchManager.search(term);
  }

  setTechniciansPage(page: number): void {
    this._technicianPage.update((p) => ({ ...p, page }));
    this.loadTechnicians();
  }

  setTechniciansPageSize(size: number): void {
    this._technicianPage.set({ page: 1, pageSize: size });
    this.loadTechnicians();
  }

  resetTechnicians(): void {
    this._technicians.set([]);
    this.techniciansTotalCount.set(0);
    this._technicianFilters.set({ sectionId: null, searchTerm: '' });
    this._technicianPage.set({ page: 1, pageSize: 20 });
  }

  private _therapists = signal<TherapistDto[]>([]);
  therapists = this._therapists.asReadonly();
  therapistsTotalCount = signal<number>(0);

  private _therapistFilters = signal<TherapistFilterRequest>({
    sectionId: null,
    roomId: null,
    searchTerm: '',
  });

  private _therapistPage = signal<PageRequest>({
    page: 1,
    pageSize: 20,
  });

  private therapistsSearchManager = new SearchManager<TherapistDto[]>(
    (term: string) =>
      this.service
        .getTherapistsDropdown(
          { ...this._therapistFilters(), searchTerm: term },
          this._therapistPage()
        )
        .pipe(
          tap((res) => {
            if (!res.isSuccess) this.handleDropdownError(res);
          }),
          map((res) => {
            if (res.isSuccess && res.data) {
              this.therapistsTotalCount.set(res.data.totalCount ?? 0);
              return res.data.items ?? [];
            }
            this.therapistsTotalCount.set(0);
            return [];
          })
        ),
    null,
    (items) => this._therapists.set(items)
  );

  loadTherapists(): void {
    this.service
      .getTherapistsDropdown(this._therapistFilters(), this._therapistPage())
      .pipe(
        tap((res) => {
          if (res.isSuccess && res.data) {
            this._therapists.set(res.data.items ?? []);
            this.therapistsTotalCount.set(res.data.totalCount ?? 0);
          } else {
            this._therapists.set([]);
            this.therapistsTotalCount.set(0);
            this.handleDropdownError(res);
          }
        })
      )
      .subscribe();
  }

  searchTherapists(term: string): void {
    this._therapistFilters.update((f) => ({ ...f, searchTerm: term }));
    this._therapistPage.update((p) => ({ ...p, page: 1 }));
    this.therapistsSearchManager.search(term);
  }

  setTherapistsPage(page: number): void {
    this._therapistPage.update((p) => ({ ...p, page }));
    this.loadTherapists();
  }

  setTherapistsPageSize(size: number): void {
    this._therapistPage.set({ page: 1, pageSize: size });
    this.loadTherapists();
  }

  resetTherapists(): void {
    this._therapists.set([]);
    this.therapistsTotalCount.set(0);
    this._therapistFilters.set({
      sectionId: null,
      roomId: null,
      searchTerm: '',
    });
    this._therapistPage.set({ page: 1, pageSize: 20 });
  }

  private handleDropdownError(result: ApiResult<any>) {
    const err = this.extractError(result);
    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }
    this.toast.error('تعذر تحميل القائمة. يرجى المحاولة لاحقاً.');
  }
}
