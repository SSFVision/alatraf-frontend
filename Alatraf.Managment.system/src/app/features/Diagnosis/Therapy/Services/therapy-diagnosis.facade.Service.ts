import { Injectable, inject, signal } from '@angular/core';
import { map, tap } from 'rxjs/operators';

import { BaseFacade } from '../../../../core/utils/facades/base-facade';
import { ApiResult } from '../../../../core/models/ApiResult';

import { TherapyDiagnosisService } from './therapy-diagnosis.service';
import { SearchManager } from '../../../../core/utils/search-manager';

import { WaitingPatientDto } from '../../Shared/Models/WaitingPatientDto';
import { CreateTherapyCardRequest } from '../Models/create-therapy-card.request';
import { TherapyDiagnosisDto } from '../Models/therapy-diagnosis.dto';


@Injectable({
  providedIn: 'root',
})
export class TherapyDiagnosisFacade extends BaseFacade {

  private therapyService = inject(TherapyDiagnosisService);

  private _waitingPatients = signal<WaitingPatientDto[]>([]);
  waitingPatients = this._waitingPatients.asReadonly();

  private _selectedPatient = signal<WaitingPatientDto | null>(null);
  selectedPatient = this._selectedPatient.asReadonly();

  private _filters = signal<{ diagnosisType: 'therapy'; searchTerm: string }>({
    diagnosisType: 'therapy',
    searchTerm: '',
  });
  filters = this._filters.asReadonly();

  isLoadingWaitingList = signal<boolean>(false);
  formValidationErrors = signal<Record<string, string[]>>({});
  createdDiagnosis = signal<TherapyDiagnosisDto | null>(null);

  /** -----------------------------
   * SEARCH MANAGER
   * ------------------------------*/
  private searchManager = new SearchManager<WaitingPatientDto[]>(
    (term: string) =>
      this.therapyService
        .getWaitingPatients({
          diagnosisType: 'therapy',
          searchTerm: term,
        })
        .pipe(
          tap((res: ApiResult<WaitingPatientDto[]>) => {
            if (!res.isSuccess) this.handleSearchError(res);
          }),
          map((res) => (res.isSuccess && res.data ? res.data : []))
        ),
    null,
    (data) => this._waitingPatients.set(data)
  );

  constructor() {
    super();
  }

  /** -----------------------------
   * LOAD WAITING PATIENTS
   * ------------------------------*/
  loadWaitingPatients(): void {
    console.log("Loading waiting patients...");
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

  /** -----------------------------
   * SEARCH
   * ------------------------------*/
  search(term: string): void {
    this._filters.update((f) => ({ ...f, searchTerm: term }));
    this.searchManager.search(term);
  }

  /** -----------------------------
   * SELECT WAITING PATIENT
   * ------------------------------*/
  selectWaitingPatient(patient: WaitingPatientDto | null): void {
    this._selectedPatient.set(patient);
  }

  /** -----------------------------
   * CREATE THERAPY DIAGNOSIS
   * ------------------------------*/
  createTherapyDiagnosis(dto: CreateTherapyCardRequest) {
    return this.handleCreateOrUpdate(
      this.therapyService.createTherapyDiagnosis(dto),
      {
        successMessage: 'تم إنشاء التشخيص بنجاح',
        defaultErrorMessage: 'فشل إنشاء التشخيص. حاول لاحقاً.',
      }
    ).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.createdDiagnosis.set(res.data);
          this.formValidationErrors.set({});
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  /** -----------------------------
   * ERROR HANDLERS
   * ------------------------------*/
  private handleLoadWaitingPatientsError(result: ApiResult<any>) {
    const err = this.extractError(result);
    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
    } else {
      this.toast.error('تعذر تحميل قائمة المرضى المنتظرين.');
    }
  }

  private handleSearchError(result: ApiResult<any>) {
    const err = this.extractError(result);
    if (err.type === 'validation' || err.type === 'business') {
      this.toast.info(err.message);
    } else {
      this.toast.error('حدث خطأ أثناء تنفيذ عملية البحث.');
    }
  }
}
