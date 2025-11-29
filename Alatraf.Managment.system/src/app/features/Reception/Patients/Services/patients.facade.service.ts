// import { Injectable, computed, inject, signal } from '@angular/core';
// import { Subject, Observable, of } from 'rxjs';
// import {
//   catchError,
//   debounceTime,
//   distinctUntilChanged,
//   finalize,
//   map,
//   switchMap,
//   tap,
// } from 'rxjs/operators';

// import { PatientService } from '../Services/patient.service';
// import {
//   CreateUpdatePatientDto,
//   Patient,
//   PatientFilterDto,
// } from '../models/patient.model';
// import { ApiResult } from '../../../../core/models/ApiResult';
// import { ToastService } from '../../../../core/services/toast.service';
// import { DialogService } from '../../../../shared/components/dialog/dialog.service';
// import {
//   ApiErrorExtractor,
//   ExtractedApiErrorKind,
// } from '../../../../core/utils/api-error-extractor';

// @Injectable({
//   providedIn: 'root',
// })
// export class PatientsFacade {
//   private patientService = inject(PatientService);
//   private dialog = inject(DialogService);
//   private toast = inject(ToastService);
//   // For inline validation errors in the form
//   formValidationErrors = signal<Record<string, string[]>>({});

//   // For create mode redirection after success
//   createdPatientId = signal<number | null>(null);

//   // ---------------------------
//   // STATE
//   // ---------------------------
//   private _patients = signal<Patient[]>([]);
//   patients = this._patients.asReadonly();

//   private _filters = signal<PatientFilterDto>({});
//   filters = this._filters.asReadonly();

//   private searchInput$ = new Subject<string>();

//   // ---------------------------
//   // CACHE (flexible + expirable)
//   // ---------------------------
//   private cache = new Map<string, { data: Patient[]; timestamp: number }>();

//   private cacheEnabled = true;
//   private cacheExpirationMs = 5 * 60 * 1000; // default: 5 minutes

//   constructor() {
//     this.setupSearchSubscription();
//   }

//   // Enable/disable cache
//   setCacheEnabled(enabled: boolean) {
//     this.cacheEnabled = enabled;
//     if (!enabled) this.cache.clear();
//   }

//   // Change cache expiration dynamically
//   setCacheExpiration(minutes: number) {
//     this.cacheExpirationMs = minutes * 60 * 1000;
//   }

//   // Clear all cached results
//   clearCache() {
//     this.cache.clear();
//   }

//   // Check if cached entry is still valid
//   private isCacheValid(key: string): boolean {
//     if (!this.cacheEnabled) return false;
//     const entry = this.cache.get(key);
//     if (!entry) return false;

//     const age = Date.now() - entry.timestamp;
//     return age < this.cacheExpirationMs;
//   }

//   // ---------------------------
//   // SEARCH PIPELINE
//   // ---------------------------
//   private setupSearchSubscription() {
//     this.searchInput$
//       .pipe(
//         debounceTime(300),
//         distinctUntilChanged(),

//         switchMap((term) => {
//           const searchTerm = term.trim();
//           this._filters.update((f) => ({ ...f, searchTerm }));

//           const key = searchTerm.toLowerCase();

//           // Use cache
//           if (this.isCacheValid(key)) {
//             this._patients.set(this.cache.get(key)!.data);
//             return of(null);
//           }

//           // Call backend
//           return this.patientService.getPatients(this._filters()).pipe(
//             tap((result: ApiResult<Patient[]>) => {
//               if (result.isSuccess && result.data) {
//                 this.cache.set(key, {
//                   data: result.data,
//                   timestamp: Date.now(),
//                 });
//                 this._patients.set(result.data);
//               } else {
//                 this._patients.set([]);
//                 this.handleSearchError(result); // <-- Fix here
//               }
//             })
//           );
//         })
//       )
//       .subscribe();
//   }

//   // Called by component
//   search(term: string): void {
//     this.searchInput$.next(term);
//   }

//   // Initial page load
//   loadPatients(): void {
//     const key = this._filters().searchTerm?.toLowerCase() || '';

//     if (this.isCacheValid(key)) {
//       this._patients.set(this.cache.get(key)!.data);
//       return;
//     }

//     this.patientService
//       .getPatients(this._filters())
//       .pipe(
//         tap((result: ApiResult<Patient[]>) => {
//           if (result.isSuccess && result.data) {
//             this.cache.set(key, {
//               data: result.data,
//               timestamp: Date.now(),
//             });
//             this._patients.set(result.data);
//           } else {
//             this._patients.set([]);
//             this.handleLoadPatientsError(result);
//           }
//         })
//       )
//       .subscribe();
//   }

//   isDeleting = signal(false);

//   // ------------------------------------
//   // DELETE FLOW
//   // ------------------------------------
//   deletePatient(patient: Patient): void {
//     if (this.isDeleting()) return;
//     this.isDeleting.set(true);

//     const config = {
//       title: 'حذف بيانات المريض',
//       message: 'هل أنت متأكد من حذف بيانات المريض التالية؟',
//       payload: {
//         'رقم المريض': patient.nationalNo,
//         الاسم: patient.fullname,
//       },
//     };

//     // 1) Show dialog
//     this.dialog.confirmDelete(config).subscribe((confirmed) => {
//       if (!confirmed) {
//         this.isDeleting.set(false);
//         return;
//       }

//       // 2) Call backend
//       this.patientService
//         .deletePatient(patient.patientId)
//         .pipe(
//           tap((result: ApiResult<void>) => {
//             if (result.isSuccess) {
//               // 3) Show toast
//               this.toast.success('تم حذف بيانات المريض بنجاح');

//               // 4) Invalidate cache
//               this.cache.clear();

//               // 5) Reload list
//               this.loadPatients();
//             } else {
//               this.handleDeleteError(result);
//             }
//           }),
//           finalize(() => this.isDeleting.set(false))
//         )
//         .subscribe();
//     });
//   }

//   private _selectedPatient = signal<Patient | null>(null);
//   selectedPatient = this._selectedPatient.asReadonly();

//   isEditMode = signal<boolean>(false);
//   enterCreateMode() {
//     this.isEditMode.set(false);
//     this._selectedPatient.set(null);
//   }
//   loadPatientForEdit(id: number) {
//     this.isEditMode.set(true);

//     console.log('Previous Selected patient', this.selectedPatient());
//     // 🔥 IMPORTANT FIX
//     this._selectedPatient.set(null);

//     this.patientService
//       .getPatientById(id)
//       .pipe(
//         tap((result) => {
//           if (result.isSuccess && result.data) {
//             this._selectedPatient.set(result.data);
//           } else {
//             this.toast.error(result.errorMessage ?? 'لم يتم العثور على المريض');
//             this.isEditMode.set(false);
//             this._selectedPatient.set(null);
//           }
//         })
//       )
//       .subscribe();
//   }

//   createPatient(dto: CreateUpdatePatientDto) {
//     return this.patientService.createPatient(dto).pipe(
//       map((result: ApiResult<Patient>) => {
//         if (result.isSuccess && result.data) {
//           this.toast.success('تم حفظ بيانات المريض بنجاح');
//           this.cache.clear();

//           this.createdPatientId.set(result.data.patientId);
//           this.formValidationErrors.set({});

//           return { success: true, validationErrors: null };
//         }

//         const err = this.handleCreateError(result);

//         if (err.validationErrors) {
//           this.formValidationErrors.set(err.validationErrors);
//         }

//         return err;
//       })
//     );
//   }

//   updatePatient(id: number, dto: CreateUpdatePatientDto) {
//     return this.patientService.updatePatient(id, dto).pipe(
//       map((result: ApiResult<Patient>) => {
//         if (result.isSuccess && result.data) {
//           this.toast.success('تم تعديل بيانات المريض بنجاح');
//           this.cache.clear();
//           this.formValidationErrors.set({});
//           return { success: true, validationErrors: null };
//         }

//         const err = this.handleUpdateError(result);

//         if (err.validationErrors) {
//           this.formValidationErrors.set(err.validationErrors);
//         }

//         return err;
//       })
//     );
//   }

//   private handleLoadPatientsError(result: ApiResult<any>) {
//     const err = ApiErrorExtractor.extract(result);

//     if (
//       err.type === ExtractedApiErrorKind.Validation ||
//       err.type === ExtractedApiErrorKind.Business
//     ) {
//       this.toast.error(err.message);
//       return;
//     }

//     // System fallback
//     this.toast.error('تعذر تحميل بيانات المرضى. يرجى المحاولة لاحقاً.');
//   }

//   private handleSearchError(result: ApiResult<any>) {
//     const err = ApiErrorExtractor.extract(result);

//     if (
//       err.type === ExtractedApiErrorKind.Validation ||
//       err.type === ExtractedApiErrorKind.Business
//     ) {
//       this.toast.error(err.message);
//       return;
//     }

//     this.toast.error('حدث خطأ أثناء تنفيذ عملية البحث.');
//   }
//   private handleDeleteError(result: ApiResult<any>) {
//     const err = ApiErrorExtractor.extract(result);

//     if (
//       err.type === ExtractedApiErrorKind.Validation ||
//       err.type === ExtractedApiErrorKind.Business
//     ) {
//       this.toast.error(err.message);
//       return;
//     }

//     this.toast.error('فشل حذف بيانات المريض. حاول مرة أخرى لاحقاً.');
//   }

//   private handleCreateError(result: ApiResult<any>) {
//     const err = ApiErrorExtractor.extract(result);

//     if (err.type === ExtractedApiErrorKind.Validation) {
//       return { success: false, validationErrors: err.errors };
//     }

//     if (err.type === ExtractedApiErrorKind.Business) {
//       this.toast.error(err.message);
//       return { success: false, validationErrors: null };
//     }

//     this.toast.error('فشل حفظ بيانات المريض. يرجى المحاولة لاحقاً.');
//     return { success: false, validationErrors: null };
//   }

//   private handleUpdateError(result: ApiResult<any>) {
//     const err = ApiErrorExtractor.extract(result);

//     if (err.type === ExtractedApiErrorKind.Validation) {
//       return { success: false, validationErrors: err.errors };
//     }

//     if (err.type === ExtractedApiErrorKind.Business) {
//       this.toast.error(err.message);
//       return { success: false, validationErrors: null };
//     }

//     this.toast.error('فشل تعديل بيانات المريض. حاول لاحقاً.');
//     return { success: false, validationErrors: null };
//   }
// }

// ***************new version of base-facade.ts

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
import { BaseFacade } from '../../../../core/utils/facades/base-facade';

@Injectable({
  providedIn: 'root',
})
export class PatientsFacade extends BaseFacade {
  private patientService = inject(PatientService);

  // ---------------------------
  // STATE
  // ---------------------------
  private _patients = signal<Patient[]>([]);
  patients = this._patients.asReadonly();

  private _filters = signal<PatientFilterDto>({});
  filters = this._filters.asReadonly();

  private searchInput$ = new Subject<string>();

  // Validation errors for forms
  formValidationErrors = signal<Record<string, string[]>>({});

  // For create mode redirection
  createdPatientId = signal<number | null>(null);

  // ---------------------------
  // CACHE (flexible + expirable)
  // ---------------------------
  private cache = new Map<string, { data: Patient[]; timestamp: number }>();

  private cacheEnabled = true;
  private cacheExpirationMs = 5 * 60 * 1000; // 5 minutes

  constructor() {
    super();
    this.setupSearchSubscription();
  }

  // Enable/disable cache
  setCacheEnabled(enabled: boolean) {
    this.cacheEnabled = enabled;
    if (!enabled) this.cache.clear();
  }

  setCacheExpiration(minutes: number) {
    this.cacheExpirationMs = minutes * 60 * 1000;
  }

  clearCache() {
    this.cache.clear();
  }

  private isCacheValid(key: string): boolean {
    if (!this.cacheEnabled) return false;

    const entry = this.cache.get(key);
    if (!entry) return false;

    const age = Date.now() - entry.timestamp;
    return age < this.cacheExpirationMs;
  }

  // ---------------------------
  // SEARCH PIPELINE (KEPT AS IS)
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

          if (this.isCacheValid(key)) {
            this._patients.set(this.cache.get(key)!.data);
            return of(null);
          }

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
                this.handleSearchError(result);
              }
            })
          );
        })
      )
      .subscribe();
  }

  search(term: string): void {
    this.searchInput$.next(term);
  }

  // ---------------------------
  // LOAD PATIENTS
  // ---------------------------
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
    ).subscribe((success) => {
      if (success) {
        this.cache.clear();
        this.loadPatients();
      }
    });
  }

  // ---------------------------
  // DETAILS (unchanged)
  // ---------------------------
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
            this.toast.error(result.errorMessage ?? 'لم يتم العثور على المريض');
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

  // ---------------------------
  // OLD ERROR HANDLERS (Kept for list/search only)
  // ---------------------------
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
      this.toast.error(err.message);
      return;
    }

    this.toast.error('حدث خطأ أثناء تنفيذ عملية البحث.');
  }
}
