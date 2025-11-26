import { Injectable, computed, inject, signal } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
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

  // ============================
  // STATE SIGNALS
  // ============================
  private _patients = signal<Patient[]>([]);
  patients = this._patients.asReadonly();

  private _selectedPatient = signal<Patient | null>(null);
  selectedPatient = this._selectedPatient.asReadonly();

  private _filters = signal<PatientFilterDto>({}); // only searchTerm used
  filters = this._filters.asReadonly();

  isEditMode = signal<boolean>(false);

  isLoadingList = signal<boolean>(false);
  isLoadingDetails = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  isDeleting = signal<boolean>(false);

  hasPatients = computed(() => this._patients().length > 0);

  // Debounced search stream
  private searchTerm$ = new Subject<string>();

  constructor() {
    this.initSearchSubscription();
  }

  // ============================
  // 🔍 FILTER SANITIZATION
  // ============================
  // This ensures ONLY searchTerm is ever sent
  private sanitizeFilters(filters: PatientFilterDto) {
    const clean: any = {};

    if (filters.searchTerm && filters.searchTerm.trim() !== '') {
      clean.searchTerm = filters.searchTerm.trim();
    }

    return clean;
  }

  // ============================
  // 🔍 SEARCH SUBSCRIPTION
  // ============================
  private initSearchSubscription() {
    this.searchTerm$
      .pipe(
        debounceTime(300),
        tap((term) => {
          this._filters.update((f) => ({
            ...f,
            searchTerm: term?.trim() || undefined,
          }));
          this.isLoadingList.set(true);
        }),
        switchMap(() =>
          this.patientService
            .getPatients(this.sanitizeFilters(this._filters()))
            .pipe(
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

  // ============================
  // 📌 LOAD & RELOAD
  // ============================
  loadPatients(): void {
    this.isLoadingList.set(true);

    this.patientService
      .getPatients(this.sanitizeFilters(this._filters()))
      .pipe(
        tap((result) => this.handlePatientsResult(result)),
        catchError((err) => this.handlePatientsError(err)),
        finalize(() => this.isLoadingList.set(false))
      )
      .subscribe();
  }

  reloadPatients(): void {
    this._patients.set([]); // force new load
    this.loadPatients();
  }

  setFilters(partial: Partial<PatientFilterDto>): void {
    this._filters.update((current) => ({
      ...current,
      ...partial,
    }));
    this.reloadPatients();
  }

  clearFilters(): void {
    this._filters.set({});
    this.reloadPatients();
  }

 private handlePatientsResult(result: ApiResult<Patient[]>): void {

  if (result.isSuccess && Array.isArray(result.data)) {

    // EMPTY LIST CASE
    if (result.data.length === 0) {
      this._patients.set([]);

      // Show NO RESULT toast only if user has typed a search
      if (this._filters().searchTerm && this._filters().searchTerm !== '') {
        this.toast.error('لا توجد نتائج مطابقة لبحثك.');
      }

      return;
    }

    // NORMAL SUCCESS
    this._patients.set(result.data);
    return;
  }

  // ERROR CASE
  this._patients.set([]);
  const msg =
    result.errorMessage ||
    'فشل في جلب بيانات المرضى، يرجى المحاولة لاحقاً.';
  this.toast.error(msg);
}


  private handlePatientsError(err: any): Observable<never> {
    console.error('Error loading patients:', err);
    this._patients.set([]);
    this.toast.error('حدث خطأ أثناء جلب بيانات المرضى.');
    return of() as never;
  }

  // ============================
  // 👁️ DETAILS (EDIT / VIEW)
  // ============================
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

  // ============================
  // 💾 CREATE
  // ============================
  createPatient(dto: CreateUpdatePatientDto): Observable<Patient | null> {
    this.isSaving.set(true);

    return this.patientService.createPatient(dto).pipe(
      tap((res) => {
        if (res.isSuccess && res.data) {
          this.toast.success('تم حفظ بيانات المريض بنجاح');

          this.reloadPatients();
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

  // ============================
  // ✏️ UPDATE
  // ============================
  updatePatient(
    id: number,
    dto: CreateUpdatePatientDto
  ): Observable<Patient | null> {
    this.isSaving.set(true);

    return this.patientService.updatePatient(id, dto).pipe(
      tap((res) => {
        if (res.isSuccess && res.data) {
          this.toast.success('تم تعديل بيانات المريض بنجاح');

          this.reloadPatients();
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

  // ============================
  // 🗑️ DELETE
  // ============================
  deletePatient(patient: Patient): Observable<boolean> {
    if (!patient?.patientId) return of(false);

    this.isDeleting.set(true);

    return this.patientService.deletePatient(patient.patientId).pipe(
      tap((res) => {
        if (res.isSuccess) {
          this.toast.success('تم حذف بيانات المريض بنجاح');

          this.reloadPatients();
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
