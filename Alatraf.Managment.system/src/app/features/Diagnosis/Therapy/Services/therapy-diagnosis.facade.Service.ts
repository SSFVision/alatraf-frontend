import { Injectable, inject, signal } from '@angular/core';
import { map, tap } from 'rxjs/operators';

import { BaseFacade } from '../../../../core/utils/facades/base-facade';
import { ApiResult } from '../../../../core/models/ApiResult';
import { TherapyDiagnosisService } from './therapy-diagnosis.service';
import { SearchManager } from '../../../../core/utils/search-manager';
import { WaitingPatientDto } from '../../Shared/Models/WaitingPatientDto';
import { TherapyDepartment } from '../Models/therapy-department.enum';
import { TherapyWaitingFilterDto } from '../Models/TherapyWaitingFilterDto ';


@Injectable({
  providedIn: 'root',
})
export class TherapyDiagnosisFacade extends BaseFacade {
  private therapyService = inject(TherapyDiagnosisService);

  private _waitingPatients = signal<WaitingPatientDto[]>([]);
  waitingPatients = this._waitingPatients.asReadonly();

  private _filters = signal<TherapyWaitingFilterDto>({
    searchTerm: '',
    department: TherapyDepartment.All,
  });
  filters = this._filters.asReadonly();

  private _selectedWaitingPatient = signal<WaitingPatientDto | null>(null);
  selectedWaitingPatient = this._selectedWaitingPatient.asReadonly();

  isLoadingWaitingList = signal<boolean>(false);

  formValidationErrors = signal<Record<string, string[]>>({});


  private searchManager = new SearchManager<WaitingPatientDto[]>(
    (term: string) =>
      this.therapyService
        .getWaitingPatients({
          ...this._filters(),
          searchTerm: term,
        })
        .pipe(
          tap((res: ApiResult<WaitingPatientDto[]>) => {
            if (!res.isSuccess) {
              this.handleSearchError(res);
            }
          }),
          map((res: ApiResult<WaitingPatientDto[]>) =>
            res.isSuccess && res.data ? res.data : []
          )
        ),

    null, // no cache for now

    (data) => this._waitingPatients.set(data)
  );

  constructor() {
    super();
  }

  loadWaitingPatients(): void {
    this.isLoadingWaitingList.set(true);
    this.therapyService
      .getWaitingPatients(this._filters())
      .pipe(
        tap((result: ApiResult<WaitingPatientDto[]>) => {
          if (result.isSuccess && result.data) {
            this._waitingPatients.set(result.data);
          } else {
            this._waitingPatients.set([]);
            this.handleLoadWaitingPatientsError(result);
          }
        })
      )
      .subscribe({
        complete: () => this.isLoadingWaitingList.set(false),
        error: () => this.isLoadingWaitingList.set(false),
      });
  }

  /** ---------------------------
   * SEARCH
   * ---------------------------- */
  search(term: string): void {
    this._filters.update((f) => ({ ...f, searchTerm: term }));
    this.searchManager.search(term);
  }

  /** ---------------------------
   * FILTER BY DEPARTMENT
   * ---------------------------- */
  setDepartment(dept: TherapyDepartment): void {
    this._filters.update((f) => ({ ...f, department: dept }));
    this.loadWaitingPatients(); // refresh list
  }

  /** ---------------------------
   * SELECT PATIENT
   * ---------------------------- */
  selectWaitingPatient(patient: WaitingPatientDto | null): void {
    this._selectedWaitingPatient.set(patient);
  }

  /** ---------------------------
   * ERROR HANDLERS
   * ---------------------------- */
  private handleLoadWaitingPatientsError(result: ApiResult<any>) {
    const err = this.extractError(result);

    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }

    this.toast.error('تعذر تحميل قائمة المرضى المنتظرين. يرجى المحاولة لاحقاً.');
  }

  private handleSearchError(result: ApiResult<any>) {
    const err = this.extractError(result);

    if (err.type === 'validation' || err.type === 'business') {
      this.toast.info(err.message);
      return;
    }

    this.toast.error('حدث خطأ أثناء البحث عن المرضى المنتظرين.');
  }
}
