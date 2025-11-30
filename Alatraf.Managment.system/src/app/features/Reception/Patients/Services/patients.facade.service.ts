import { Injectable, inject, signal } from '@angular/core';
import { Subject, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';

import { PatientService } from '../Services/patient.service';
import {
  CreateUpdatePatientDto,
  Patient,
  PatientFilterDto,
} from '../models/patient.model';

import { ApiResult } from '../../../../core/models/ApiResult';
import { BaseFacade } from '../../../../core/utils/facades/base-facade';
import { CacheManager } from '../../../../core/utils/cache-manager';
import { SearchManager } from '../../../../core/utils/search-manager';

@Injectable({
  providedIn: 'root',
})
export class PatientsFacade extends BaseFacade {
  private patientService = inject(PatientService);

  private _patients = signal<Patient[]>([]);
  patients = this._patients.asReadonly();

  private _filters = signal<PatientFilterDto>({});
  filters = this._filters.asReadonly();

  private searchInput$ = new Subject<string>();

  formValidationErrors = signal<Record<string, string[]>>({});

  createdPatientId = signal<number | null>(null);
  constructor() {
    super();
  }

  private cache = new CacheManager<Patient[]>(5);
  private searchManager = new SearchManager<Patient[]>(
    (term: string) =>
      this.patientService.getPatients({ searchTerm: term }).pipe(
        tap((res: ApiResult<Patient[]>) => {
          if (!res.isSuccess) {
            this.handleSearchError(res);
          }
        }),
        map((res: ApiResult<Patient[]>) =>
          res.isSuccess && res.data ? res.data : []
        )
      ),

    this.cache,

    (data) => this._patients.set(data)
  );

  search(term: string): void {
    this._filters.update((f) => ({ ...f, searchTerm: term }));
    this.searchManager.search(term);
  }

  // ---------------------------
  // LOAD PATIENTS
  // ---------------------------
  loadPatients(): void {
    const key = this._filters().searchTerm?.toLowerCase() || '';

    const cached = this.cache.get(key);
    if (cached) {
      this._patients.set(cached);
      return;
    }

    this.patientService
      .getPatients(this._filters())
      .pipe(
        tap((result: ApiResult<Patient[]>) => {
          if (result.isSuccess && result.data) {
            if (result.data.length > 0) {
              this.cache.set(key, result.data);
            }
            this._patients.set(result.data);
          } else {
            this._patients.set([]);
            this.handleLoadPatientsError(result);
          }
        })
      )
      .subscribe();
  }

  deletePatient(patient: Patient): void {
    
    if (!patient?.patientId) return;

    const config = {
      title: 'حذف بيانات المريض',
      message: 'هل أنت متأكد من حذف بيانات المريض التالية؟',
      payload: {
        'رقم المريض': patient.nationalNo,
        الاسم: patient.fullname,
      },
    };

    this.confirmAndDelete(
      config,
      () => this.patientService.deletePatient(patient.patientId),
      {
        successMessage: 'تم حذف بيانات المريض بنجاح',
        defaultErrorMessage: 'فشل حذف بيانات المريض. حاول لاحقاً.',
      }
    )
    .subscribe((success) => {
      if (success) {
        this.cache.clear();
        this.loadPatients();
      }
    });
  }

  private _selectedPatient = signal<Patient | null>(null);
  selectedPatient = this._selectedPatient.asReadonly();

  isEditMode = signal<boolean>(false);

  enterCreateMode() {
 
    this.isEditMode.set(false);
    this._selectedPatient.set(null);
  }

  loadPatientForEdit(id: number) {
  
    this.isEditMode.set(true);
    this._selectedPatient.set(null);

    this.patientService
      .getPatientById(id)
      .pipe(
        tap((result) => {
          if (result.isSuccess && result.data) {
            this._selectedPatient.set(result.data);
          } else {
            this.toast.error(result.errorDetail ?? 'لم يتم العثور على المريض');
            this.isEditMode.set(false);
            this._selectedPatient.set(null);
          }
        })
      )
      .subscribe();
  }

  // ---------------------------
  // CREATE
  // ---------------------------
  createPatient(dto: CreateUpdatePatientDto) {
    
    return this.handleCreateOrUpdate(this.patientService.createPatient(dto), {
      successMessage: 'تم حفظ بيانات المريض بنجاح',
      defaultErrorMessage: 'فشل حفظ بيانات المريض. يرجى المحاولة لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.cache.clear();
          this.createdPatientId.set(res.data.patientId);
          this.formValidationErrors.set({});
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  // ---------------------------
  // UPDATE
  // ---------------------------
  updatePatient(id: number, dto: CreateUpdatePatientDto) {
    return this.handleCreateOrUpdate(
      this.patientService.updatePatient(id, dto),
      {
        successMessage: 'تم تعديل بيانات المريض بنجاح',
        defaultErrorMessage: 'فشل تعديل بيانات المريض. حاول لاحقاً.',
      }
    ).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.cache.clear();
          this.formValidationErrors.set({});
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  private handleLoadPatientsError(result: ApiResult<any>) {
    const err = this.extractError(result);

    if (err.type === 'validation' || err.type === 'business') {
      this.toast.error(err.message);
      return;
    }

    this.toast.error('تعذر تحميل بيانات المرضى. يرجى المحاولة لاحقاً.');
  }

  private handleSearchError(result: ApiResult<any>) {
    const err = this.extractError(result);

    if (err.type === 'validation' || err.type === 'business') {
      this.toast.info(err.message);
      return;
    }

    this.toast.error('حدث خطأ أثناء تنفيذ عملية البحث.');
  }
}
