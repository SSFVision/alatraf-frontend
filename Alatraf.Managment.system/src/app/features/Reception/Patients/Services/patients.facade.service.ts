import { Injectable, computed, inject, signal } from '@angular/core';
import { Subject, Observable, of, filter } from 'rxjs';
import {
  catchError,
  debounceTime,
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

@Injectable({
  providedIn: 'root',
})
export class PatientsFacade {
  private patientService = inject(PatientService);
  private toast = inject(ToastService);

  private _patients = signal<Patient[]>([]);
  patients = this._patients.asReadonly();

  private _selectedPatient = signal<Patient | null>(null);
  selectedPatient = this._selectedPatient.asReadonly();

  private _filters = signal<PatientFilterDto>({});
  filters = this._filters.asReadonly();

  isEditMode = signal<boolean>(false);

  isLoadingList = signal<boolean>(false);
  isLoadingDetails = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  isDeleting = signal<boolean>(false);

  hasPatients = computed(() => this._patients().length > 0);

  // 🔍 Internal search stream (for debounce)
  private searchTerm$ = new Subject<string>();

  constructor() {
    this.initSearchSubscription();
  }

  // ------------------------------------------------------
  // 🔍 SEARCH HANDLING (with debounce)
  // ------------------------------------------------------
  private initSearchSubscription() {
    this.searchTerm$
      .pipe(
        debounceTime(300),
        tap((term) => {
          // Update filters with search term
          this._filters.update((f) => ({
            ...f,
            searchTerm: term || undefined,
          }));
          this.isLoadingList.set(true);
        }),
        switchMap(() =>
          this.patientService.getPatients(this._filters()).pipe(
            tap((result) => this.handlePatientsResult(result)),
            catchError((err) => this.handlePatientsError(err)),
            finalize(() => this.isLoadingList.set(false))
          )
        )
      )
      .subscribe();
  }

  search(term: string): void {
    this.searchTerm$.next(term);
  }

  loadPatients(): void {
    if (this._patients().length > 0) return; // already loaded
    console.log('Called ');

    this.isLoadingList.set(true);

    this.patientService
      .getPatients(this._filters())
      .pipe(
        tap((result) => this.handlePatientsResult(result)),
        catchError((err) => this.handlePatientsError(err)),
        finalize(() => this.isLoadingList.set(false))
      )
      .subscribe();
  }

  reloadPatients(): void {
    this.loadPatients();
  }

  setFilters(partial: Partial<PatientFilterDto>): void {
    this._filters.update((current) => ({
      ...current,
      ...partial,
    }));
    this.loadPatients();
  }

  clearFilters(): void {
    this._filters.set({});
    this.loadPatients();
  }

  private handlePatientsResult(result: ApiResult<Patient[]>): void {
    if (result.isSuccess && result.data) {
      this._patients.set(result.data);
    } else {
      this._patients.set([]);
      const msg =
        result.errorMessage ||
        'فشل في جلب بيانات المرضى، يرجى المحاولة لاحقاً.';
      this.toast.error(msg);
    }
  }

  private handlePatientsError(err: any): Observable<never> {
    console.error('Error loading patients:', err);
    this._patients.set([]);
    this.toast.error('حدث خطأ أثناء جلب بيانات المرضى.');
    // Re-throw or return EMPTY; here we just complete the stream:
    return of() as never;
  }

  // ------------------------------------------------------
  // 👁️ PATIENT DETAILS (for view / edit)
  // ------------------------------------------------------
  enterCreateMode(): void {
    this.isEditMode.set(false);
    this._selectedPatient.set(null);
  }

  loadPatientForEdit(id: number): void {
    if (!id || isNaN(id)) {
      this.enterCreateMode();
      return;
    }

    this.isEditMode.set(true);
    this.isLoadingDetails.set(true);

    this.patientService
      .getPatientById(id)
      .pipe(
        tap((result) => {
          if (result.isSuccess && result.data) {
            this._selectedPatient.set(result.data);
          } else {
            const msg =
              result.errorMessage ||
              'لم يتم العثور على بيانات المريض المطلوبة.';
            this.toast.error(msg);
            this._selectedPatient.set(null);
            this.isEditMode.set(false);
          }
        }),
        catchError((err) => {
          console.error('Error loading patient details:', err);
          this.toast.error('حدث خطأ أثناء تحميل بيانات المريض.');
          this._selectedPatient.set(null);
          this.isEditMode.set(false);
          return of(null);
        }),
        finalize(() => this.isLoadingDetails.set(false))
      )
      .subscribe();
  }

  loadPatientDetails(id: number): void {
    // For view-only page if you have it
    this.isLoadingDetails.set(true);

    this.patientService
      .getPatientById(id)
      .pipe(
        tap((result) => {
          if (result.isSuccess && result.data) {
            this._selectedPatient.set(result.data);
          } else {
            const msg =
              result.errorMessage ||
              'لم يتم العثور على بيانات المريض المطلوبة.';
            this.toast.error(msg);
            this._selectedPatient.set(null);
          }
        }),
        catchError((err) => {
          console.error('Error loading patient details:', err);
          this.toast.error('حدث خطأ أثناء تحميل بيانات المريض.');
          this._selectedPatient.set(null);
          return of(null);
        }),
        finalize(() => this.isLoadingDetails.set(false))
      )
      .subscribe();
  }

  // ------------------------------------------------------
  // 💾 CREATE / UPDATE
  // ------------------------------------------------------
  /**
   * Create a new patient.
   * Facade:
   *  - handles ApiResult
   *  - updates local list
   *  - shows toasts
   *  - returns created Patient (or null on error)
   */
  createPatient(dto: CreateUpdatePatientDto): Observable<Patient | null> {
    this.isSaving.set(true);

    return this.patientService.createPatient(dto).pipe(
      tap((res) => {
        if (res.isSuccess && res.data) {
          const created = res.data;
          // Update cache list
          console.log("new patient ",created);
          // this._patients.update(list => [created, ...list]);

          // this._patients.update((list) => [...list, created]);
          this.toast.success('تم حفظ بيانات المريض بنجاح');
        } else {
          const msg =
            res.errorMessage || 'فشل حفظ بيانات المريض، يرجى المحاولة لاحقاً.';
          this.toast.error(msg);
        }
      }),
      map((res) => (res.isSuccess ? res.data! : null)),
      catchError((err) => {
        console.error('Error creating patient:', err);
        this.toast.error('حدث خطأ أثناء حفظ بيانات المريض.');
        return of(null);
      }),
      finalize(() => this.isSaving.set(false))
    );
  }

  /**
   * Update an existing patient by id.
   *  - handles ApiResult
   *  - updates list + selected patient
   *  - shows toasts
   *  - returns updated Patient (or null on error)
   */
  updatePatient(
    id: number,
    dto: CreateUpdatePatientDto
  ): Observable<Patient | null> {
    this.isSaving.set(true);

    return this.patientService.updatePatient(id, dto).pipe(
      tap((res) => {
        if (res.isSuccess && res.data) {
          const updated = res.data;
          // Update cached list
          this._patients.update((list) =>
            list.map((p) => (p.patientId === updated.patientId ? updated : p))
          );
          // Update selected patient if same
          const current = this._selectedPatient();
          if (current && current.patientId === updated.patientId) {
            this._selectedPatient.set(updated);
          }

          this.toast.success('تم تعديل بيانات المريض بنجاح');
        } else {
          const msg =
            res.errorMessage ||
            'فشل تعديل بيانات المريض، يرجى المحاولة لاحقاً.';
          this.toast.error(msg);
        }
      }),
      map((res) => (res.isSuccess ? res.data! : null)),
      catchError((err) => {
        console.error('Error updating patient:', err);
        this.toast.error('حدث خطأ أثناء تعديل بيانات المريض.');
        return of(null);
      }),
      finalize(() => this.isSaving.set(false))
    );
  }

  // ------------------------------------------------------
  // 🗑️ DELETE
  // ------------------------------------------------------
  /**
   * Delete a patient.
   * Component should handle the confirm dialog.
   * Facade:
   *  - calls API
   *  - updates local list on success
   *  - shows toasts
   */
  deletePatient(patient: Patient): Observable<boolean> {
    if (!patient?.patientId) return of(false);

    this.isDeleting.set(true);

    return this.patientService.deletePatient(patient.patientId).pipe(
      tap((res) => {
        if (res.isSuccess) {
          // Remove from cached list
          this._patients.update((list) =>
            list.filter((p) => p.patientId !== patient.patientId)
          );
          this.toast.success('تم حذف بيانات المريض بنجاح');
        } else {
          const msg =
            res.errorMessage || 'فشل حذف بيانات المريض، يرجى المحاولة لاحقاً.';
          this.toast.error(msg);
        }
      }),
      map((res) => res.isSuccess),
      catchError((err) => {
        console.error('Error deleting patient:', err);
        this.toast.error('حدث خطأ أثناء حذف بيانات المريض.');
        return of(false);
      }),
      finalize(() => this.isDeleting.set(false))
    );
  }
}
