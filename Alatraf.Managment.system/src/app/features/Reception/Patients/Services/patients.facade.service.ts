import { Injectable, computed, inject, signal } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import {
  catchError,
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
import { ToastService } from '../../../../core/services/toast.service';
import { DialogService } from '../../../../shared/components/dialog/dialog.service';
import { ApiErrorExtractor, ExtractedApiErrorKind } from '../../../../core/utils/api-error-extractor';

@Injectable({
  providedIn: 'root',
})
// export class PatientsFacade {
//   private patientService = inject(PatientService);
//   private toast = inject(ToastService);

//   // ============================
//   // STATE SIGNALS
//   // ============================
//   private _patients = signal<Patient[]>([]);
//   patients = this._patients.asReadonly();

//   private _selectedPatient = signal<Patient | null>(null);
//   selectedPatient = this._selectedPatient.asReadonly();

//   private _filters = signal<PatientFilterDto>({}); // only searchTerm used
//   filters = this._filters.asReadonly();

//   isEditMode = signal<boolean>(false);

//   isLoadingList = signal<boolean>(false);
//   isLoadingDetails = signal<boolean>(false);
//   isSaving = signal<boolean>(false);
//   isDeleting = signal<boolean>(false);

//   hasPatients = computed(() => this._patients().length > 0);

//   // Debounced search stream
//   private searchTerm$ = new Subject<string>();

//   constructor() {
//     this.initSearchSubscription();
//   }

//   // ============================
//   // 🔍 FILTER SANITIZATION
//   // ============================
//   // This ensures ONLY searchTerm is ever sent
//   private sanitizeFilters(filters: PatientFilterDto) {
//     const clean: any = {};

//     if (filters.searchTerm && filters.searchTerm.trim() !== '') {
//       clean.searchTerm = filters.searchTerm.trim();
//     }

//     return clean;
//   }

//   // ============================
//   // 🔍 SEARCH SUBSCRIPTION
//   // ============================
//   private initSearchSubscription() {
//     this.searchTerm$
//       .pipe(
//         debounceTime(300),
//         tap((term) => {
//           this._filters.update((f) => ({
//             ...f,
//             searchTerm: term?.trim() || undefined,
//           }));
//           this.isLoadingList.set(true);
//         }),
//         switchMap(() =>
//           this.patientService
//             .getPatients(this.sanitizeFilters(this._filters()))
//             .pipe(
//               tap((result) => this.handlePatientsResult(result)),
//               catchError((err) => this.handlePatientsError(err)),
//               finalize(() => this.isLoadingList.set(false))
//             )
//         )
//       )
//       .subscribe();
//   }

//   search(term: string): void {
//     this.searchTerm$.next(term);
//   }

//   // ============================
//   // 📌 LOAD & RELOAD
//   // ============================
//   loadPatients(): void {
//     this.isLoadingList.set(true);

//     this.patientService
//       .getPatients(this.sanitizeFilters(this._filters()))
//       .pipe(
//         tap((result) => this.handlePatientsResult(result)),
//         catchError((err) => this.handlePatientsError(err)),
//         finalize(() => this.isLoadingList.set(false))
//       )
//       .subscribe();
//   }

//   reloadPatients(): void {
//     this._patients.set([]); // force new load
//     this.loadPatients();
//   }

//   setFilters(partial: Partial<PatientFilterDto>): void {
//     this._filters.update((current) => ({
//       ...current,
//       ...partial,
//     }));
//     this.reloadPatients();
//   }

//   clearFilters(): void {
//     this._filters.set({});
//     this.reloadPatients();
//   }

//  private handlePatientsResult(result: ApiResult<Patient[]>): void {

//   if (result.isSuccess && Array.isArray(result.data)) {

//     // EMPTY LIST CASE
//     if (result.data.length === 0) {
//       this._patients.set([]);

//       // Show NO RESULT toast only if user has typed a search
//       if (this._filters().searchTerm && this._filters().searchTerm !== '') {
//         this.toast.error('لا توجد نتائج مطابقة لبحثك.');
//       }

//       return;
//     }

//     // NORMAL SUCCESS
//     this._patients.set(result.data);
//     return;
//   }

//   // ERROR CASE
//   this._patients.set([]);
//   const msg =
//     result.errorMessage ||
//     'فشل في جلب بيانات المرضى، يرجى المحاولة لاحقاً.';
//   this.toast.error(result.errorDetail || msg);
// }

//   private handlePatientsError(err: any): Observable<never> {
//     console.error('Error loading patients:', err);
//     this._patients.set([]);
//     this.toast.error('حدث خطأ أثناء جلب بيانات المرضى.');
//     return of() as never;
//   }

//   // ============================
//   // 👁️ DETAILS (EDIT / VIEW)
//   // ============================
//   enterCreateMode(): void {
//     this.isEditMode.set(false);
//     this._selectedPatient.set(null);
//   }

//   loadPatientForEdit(id: number): void {
//     // if (!id || isNaN(id)) {
//     //   this.enterCreateMode();
//     //   return;
//     // }

//     this.isEditMode.set(true);
//     this.isLoadingDetails.set(true);

//     this.patientService
//       .getPatientById(id)
//       .pipe(
//         tap((result) => {
//           if (result.isSuccess && result.data) {
//             this._selectedPatient.set(result.data);
//           } else {
//             const msg =
//               result.errorMessage ||
//               'لم يتم العثور على بيانات المريض المطلوبة.';
//             this.toast.error(msg);
//             this._selectedPatient.set(null);
//             this.isEditMode.set(false);
//           }
//         }),
//         catchError((err) => {
//           console.error('Error loading patient details:', err);
//           this.toast.error('حدث خطأ أثناء تحميل بيانات المريض.');
//           this._selectedPatient.set(null);
//           this.isEditMode.set(false);
//           return of(null);
//         }),
//         finalize(() => this.isLoadingDetails.set(false))
//       )
//       .subscribe();
//   }

//   loadPatientDetails(id: number): void {
//     this.isLoadingDetails.set(true);

//     this.patientService
//       .getPatientById(id)
//       .pipe(
//         tap((result) => {
//           if (result.isSuccess && result.data) {
//             this._selectedPatient.set(result.data);
//           } else {
//             const msg =
//               result.errorMessage ||
//               'لم يتم العثور على بيانات المريض المطلوبة.';
//             this.toast.error(msg);
//             this._selectedPatient.set(null);
//           }
//         }),
//         catchError((err) => {
//           console.error('Error loading patient details:', err);
//           this.toast.error('حدث خطأ أثناء تحميل بيانات المريض.');
//           this._selectedPatient.set(null);
//           return of(null);
//         }),
//         finalize(() => this.isLoadingDetails.set(false))
//       )
//       .subscribe();
//   }

//   // ============================
//   // 💾 CREATE
//   // ============================
//   createPatient(dto: CreateUpdatePatientDto): Observable<Patient | null> {
//     this.isSaving.set(true);

//     return this.patientService.createPatient(dto).pipe(
//       tap((res) => {
//         if (res.isSuccess && res.data) {
//           this.toast.success('تم حفظ بيانات المريض بنجاح');

//           this.reloadPatients();
//         } else {
//           const msg =
//             res.errorMessage || 'فشل حفظ بيانات المريض، يرجى المحاولة لاحقاً.';
//           this.toast.error(msg);
//         }
//       }),
//       map((res) => (res.isSuccess ? res.data! : null)),
//       catchError((err) => {
//         console.error('Error creating patient:', err);
//         this.toast.error('حدث خطأ أثناء حفظ بيانات المريض.');
//         return of(null);
//       }),
//       finalize(() => this.isSaving.set(false))
//     );
//   }

//   // ============================
//   // ✏️ UPDATE
//   // ============================
//   updatePatient(
//     id: number,
//     dto: CreateUpdatePatientDto
//   ): Observable<Patient | null> {
//     this.isSaving.set(true);

//     return this.patientService.updatePatient(id, dto).pipe(
//       tap((res) => {
//         if (res.isSuccess && res.data) {
//           this.toast.success('تم تعديل بيانات المريض بنجاح');

//           this.reloadPatients();
//         } else {
//           const msg =
//             res.errorMessage ||
//             'فشل تعديل بيانات المريض، يرجى المحاولة لاحقاً.';
//           this.toast.error(msg);
//         }
//       }),
//       map((res) => (res.isSuccess ? res.data! : null)),
//       catchError((err) => {
//         console.error('Error updating patient:', err);
//         this.toast.error('حدث خطأ أثناء تعديل بيانات المريض.');
//         return of(null);
//       }),
//       finalize(() => this.isSaving.set(false))
//     );
//   }

//   // ============================
//   // 🗑️ DELETE
//   // ============================
//   deletePatient(patient: Patient): Observable<boolean> {
//     if (!patient?.patientId) return of(false);

//     this.isDeleting.set(true);

//     return this.patientService.deletePatient(patient.patientId).pipe(
//       tap((res) => {
//         if (res.isSuccess) {
//           this.toast.success('تم حذف بيانات المريض بنجاح');

//           this.reloadPatients();
//         } else {
//           const msg =
//             res.errorMessage || 'فشل حذف بيانات المريض، يرجى المحاولة لاحقاً.';
//           this.toast.error(msg);
//         }
//       }),
//       map((res) => res.isSuccess),
//       catchError((err) => {
//         console.error('Error deleting patient:', err);
//         this.toast.error('حدث خطأ أثناء حذف بيانات المريض.');
//         return of(false);
//       }),
//       finalize(() => this.isDeleting.set(false))
//     );
//   }
// }
export class PatientsFacade {
  private patientService = inject(PatientService);
  private dialog = inject(DialogService);
  private toast = inject(ToastService);
  // For inline validation errors in the form
  formValidationErrors = signal<Record<string, string[]>>({});

  // For create mode redirection after success
  createdPatientId = signal<number | null>(null);

  // ---------------------------
  // STATE
  // ---------------------------
  private _patients = signal<Patient[]>([]);
  patients = this._patients.asReadonly();

  private _filters = signal<PatientFilterDto>({});
  filters = this._filters.asReadonly();

  private searchInput$ = new Subject<string>();

  // ---------------------------
  // CACHE (flexible + expirable)
  // ---------------------------
  private cache = new Map<string, { data: Patient[]; timestamp: number }>();

  private cacheEnabled = true;
  private cacheExpirationMs = 5 * 60 * 1000; // default: 5 minutes

  constructor() {
    this.setupSearchSubscription();
  }

  // Enable/disable cache
  setCacheEnabled(enabled: boolean) {
    this.cacheEnabled = enabled;
    if (!enabled) this.cache.clear();
  }

  // Change cache expiration dynamically
  setCacheExpiration(minutes: number) {
    this.cacheExpirationMs = minutes * 60 * 1000;
  }

  // Clear all cached results
  clearCache() {
    this.cache.clear();
  }

  // Check if cached entry is still valid
  private isCacheValid(key: string): boolean {
    if (!this.cacheEnabled) return false;
    const entry = this.cache.get(key);
    if (!entry) return false;

    const age = Date.now() - entry.timestamp;
    return age < this.cacheExpirationMs;
  }

  // ---------------------------
  // SEARCH PIPELINE
  // ---------------------------
  private setupSearchSubscription() {
    this.searchInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),

        switchMap((term) => {
          const searchTerm = term.trim();
          this._filters.update((f) => ({ ...f, searchTerm }));

          const key = searchTerm.toLowerCase();

          // Use cache
          if (this.isCacheValid(key)) {
            this._patients.set(this.cache.get(key)!.data);
            return of(null);
          }

          // Call backend
          return this.patientService.getPatients(this._filters()).pipe(
            tap((result: ApiResult<Patient[]>) => {
              if (result.isSuccess && result.data) {
                this.cache.set(key, {
                  data: result.data,
                  timestamp: Date.now(),
                });
                this._patients.set(result.data);
              } else {
                this._patients.set([]);
                this.handleSearchError(result); // <-- Fix here
              }
            })
          );
        })
      )
      .subscribe();
  }

  // Called by component
  search(term: string): void {
    this.searchInput$.next(term);
  }

  // Initial page load
  loadPatients(): void {
    const key = this._filters().searchTerm?.toLowerCase() || '';

    if (this.isCacheValid(key)) {
      this._patients.set(this.cache.get(key)!.data);
      return;
    }

    this.patientService
      .getPatients(this._filters())
      .pipe(
        tap((result: ApiResult<Patient[]>) => {
          if (result.isSuccess && result.data) {
            this.cache.set(key, {
              data: result.data,
              timestamp: Date.now(),
            });
            this._patients.set(result.data);
          } else {
            this._patients.set([]);
            this.handleLoadPatientsError(result);
          }
        })
      )
      .subscribe();
  }

  isDeleting = signal(false);

  // ------------------------------------
  // DELETE FLOW
  // ------------------------------------
  deletePatient(patient: Patient): void {
    if (this.isDeleting()) return;
    this.isDeleting.set(true);

    const config = {
      title: 'حذف بيانات المريض',
      message: 'هل أنت متأكد من حذف بيانات المريض التالية؟',
      payload: {
        'رقم المريض': patient.nationalNo,
        الاسم: patient.fullname,
      },
    };

    // 1) Show dialog
    this.dialog.confirmDelete(config).subscribe((confirmed) => {
      if (!confirmed) {
        this.isDeleting.set(false);
        return;
      }

      // 2) Call backend
      this.patientService
        .deletePatient(patient.patientId)
        .pipe(
          tap((result: ApiResult<void>) => {
            if (result.isSuccess) {
              // 3) Show toast
              this.toast.success('تم حذف بيانات المريض بنجاح');

              // 4) Invalidate cache
              this.cache.clear();

              // 5) Reload list
              this.loadPatients();
            } else {
              this.handleDeleteError(result);
            }
          }),
          finalize(() => this.isDeleting.set(false))
        )
        .subscribe();
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

    console.log('Previous Selected patient', this.selectedPatient());
    // 🔥 IMPORTANT FIX
    this._selectedPatient.set(null);

    this.patientService
      .getPatientById(id)
      .pipe(
        tap((result) => {
          if (result.isSuccess && result.data) {
            this._selectedPatient.set(result.data);
          } else {
            this.toast.error(result.errorMessage ?? 'لم يتم العثور على المريض');
            this.isEditMode.set(false);
            this._selectedPatient.set(null);
          }
        })
      )
      .subscribe();
  }

  createPatient(dto: CreateUpdatePatientDto) {
    return this.patientService.createPatient(dto).pipe(
      map((result: ApiResult<Patient>) => {
        if (result.isSuccess && result.data) {
          this.toast.success('تم حفظ بيانات المريض بنجاح');
          this.cache.clear();

          this.createdPatientId.set(result.data.patientId);
          this.formValidationErrors.set({});

          return { success: true, validation: null };
        }

        const err = this.handleCreateError(result);

        if (err.validation) {
          this.formValidationErrors.set(err.validation);
        }

        return err;
      })
    );
  }

  updatePatient(id: number, dto: CreateUpdatePatientDto) {
    return this.patientService.updatePatient(id, dto).pipe(
      map((result: ApiResult<Patient>) => {
        if (result.isSuccess && result.data) {
          this.toast.success('تم تعديل بيانات المريض بنجاح');
          this.cache.clear();
          this.formValidationErrors.set({});
          return { success: true, validation: null };
        }

        const err = this.handleUpdateError(result);

        if (err.validation) {
          this.formValidationErrors.set(err.validation);
        }

        return err;
      })
    );
  }

 
 private handleLoadPatientsError(result: ApiResult<any>) {
  const err = ApiErrorExtractor.extract(result);

  if (err.type === ExtractedApiErrorKind.Validation || 
      err.type === ExtractedApiErrorKind.Business) {
    this.toast.error(err.message);
    return;
  }

  // System fallback
  this.toast.error('تعذر تحميل بيانات المرضى. يرجى المحاولة لاحقاً.');
}

 private handleSearchError(result: ApiResult<any>) {
  const err = ApiErrorExtractor.extract(result);

  if (err.type === ExtractedApiErrorKind.Validation ||
      err.type === ExtractedApiErrorKind.Business) {
    this.toast.error(err.message);
    return;
  }

  this.toast.error('حدث خطأ أثناء تنفيذ عملية البحث.');
}
private handleDeleteError(result: ApiResult<any>) {
  const err = ApiErrorExtractor.extract(result);

  if (err.type === ExtractedApiErrorKind.Validation ||
      err.type === ExtractedApiErrorKind.Business) {
    this.toast.error(err.message);
    return;
  }

  this.toast.error('فشل حذف بيانات المريض. حاول مرة أخرى لاحقاً.');
}

private handleCreateError(result: ApiResult<any>) {
  const err = ApiErrorExtractor.extract(result);

  if (err.type === ExtractedApiErrorKind.Validation) {
    return { success: false, validation: err.errors };
  }

  if (err.type === ExtractedApiErrorKind.Business) {
    this.toast.error(err.message);
    return { success: false, validation: null };
  }

  this.toast.error('فشل حفظ بيانات المريض. يرجى المحاولة لاحقاً.');
  return { success: false, validation: null };
}

private handleUpdateError(result: ApiResult<any>) {
  const err = ApiErrorExtractor.extract(result);

  if (err.type === ExtractedApiErrorKind.Validation) {
    return { success: false, validation: err.errors };
  }

  if (err.type === ExtractedApiErrorKind.Business) {
    this.toast.error(err.message);
    return { success: false, validation: null };
  }

  this.toast.error('فشل تعديل بيانات المريض. حاول لاحقاً.');
  return { success: false, validation: null };
}

}
