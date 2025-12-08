import { Injectable, inject, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { PatientService } from '../Services/patient.service';


import { ApiResult } from '../../../../core/models/ApiResult';
import { PaginatedList } from '../../../../core/models/Shared/paginated-list.model';
import { PageRequest } from '../../../../core/models/Shared/page-request.model';

import { BaseFacade } from '../../../../core/utils/facades/base-facade';
import { SearchManager } from '../../../../core/utils/search-manager';
import { PatientDto } from '../../../../core/models/Shared/patient.model';
import { CreatePatientRequest } from '../models/create-patient.request';
import { PatientFilterRequest } from '../models/PatientFilterRequest';
import { UpdatePatientRequest } from '../models/update-patient.request';

@Injectable({
  providedIn: 'root',
})
export class PatientsFacade extends BaseFacade {
  private patientService = inject(PatientService);

  // ================================
  // Signals
  // ================================
  private _patients = signal<PatientDto[]>([]);
  patients = this._patients.asReadonly();

  private _filters = signal<PatientFilterRequest>({});
  filters = this._filters.asReadonly();

  private _pageRequest = signal<PageRequest>({
    page: 1,
    pageSize: 10,
  });
  pageRequest = this._pageRequest.asReadonly();

  totalCount = signal<number>(0);

  formValidationErrors = signal<Record<string, string[]>>({});
  createdPatientId = signal<number | null>(null);

  private searchInput$ = new Subject<string>();

  constructor() {
    super();
  }

  // ================================
  // SEARCH MANAGER (same structure as TicketFacade)
  // ================================
  private searchManager = new SearchManager<PatientDto[]>(
    (term: string) =>
      this.patientService
        .getPatients(
          { ...this._filters(), searchTerm: term },
          this._pageRequest(),
        )
        .pipe(
          tap((res: ApiResult<PaginatedList<PatientDto>>) => {
            if (!res.isSuccess) this.handleSearchError(res);
          }),
          map((res: ApiResult<PaginatedList<PatientDto>>) =>
            res.isSuccess && res.data?.items ? res.data.items : []
          )
        ),

    null, // NO cache

    (data) => this._patients.set(data)
  );

  // ================================
  // Search
  // ================================
  search(term: string): void {
    this._pageRequest.update((p) => ({ ...p, page: 1 }));
    this._filters.update((f) => ({ ...f, searchTerm: term }));
    this.searchManager.search(term);
  }

  // ================================
  // LOAD PATIENTS
  // ================================
  loadPatients(): void {
    this.patientService
      .getPatients(this._filters(), this._pageRequest())
      .pipe(
        tap((result: ApiResult<PaginatedList<PatientDto>>) => {
          if (result.isSuccess && result.data?.items) {
            this._patients.set(result.data.items);
            this.totalCount.set(result.data.totalCount ?? 0);
          } else {
            this._patients.set([]);
            this.totalCount.set(0);
            this.handleLoadPatientsError(result);
          }
        })
      )
      .subscribe();
  }

  // ================================
  // Pagination setters (same as TicketFacade)
  // ================================
  setPage(page: number) {
    this._pageRequest.update((p) => ({ ...p, page }));
    this.loadPatients();
  }

  setPageSize(size: number) {
    this._pageRequest.update((p) => ({ ...p, pageSize: size, page: 1 }));
    this.loadPatients();
  }

  // ================================
  // DELETE PATIENT (unchanged except DTO mapping)
  // ================================
  deletePatient(patient: PatientDto): void {
    if (!patient?.patientId) return;

    const config = {
      title: 'حذف بيانات المريض',
      message: 'هل أنت متأكد من حذف بيانات المريض التالية؟',
      payload: {
        'رقم المريض': patient.personDto?.nationalNo ?? '',
        الاسم: patient.personDto?.fullname ?? '',
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
      if (success) this.loadPatients();
    });
  }

  // ================================
  // SELECTED PATIENT + EDIT MODE (unchanged)
  // ================================
  private _selectedPatient = signal<PatientDto | null>(null);
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

  // ================================
  // CREATE
  // ================================
  createPatient(dto: CreatePatientRequest) {
    return this.handleCreateOrUpdate(this.patientService.createPatient(dto), {
      successMessage: 'تم حفظ بيانات المريض بنجاح',
      defaultErrorMessage: 'فشل حفظ بيانات المريض. يرجى المحاولة لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.createdPatientId.set(res.data.patientId);
          this.formValidationErrors.set({});
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  // ================================
  // UPDATE
  // ================================
  updatePatient(id: number, dto: UpdatePatientRequest) {
    return this.handleCreateOrUpdate(
      this.patientService.updatePatient(id, dto),
      {
        successMessage: 'تم تعديل بيانات المريض بنجاح',
        defaultErrorMessage: 'فشل تعديل بيانات المريض. حاول لاحقاً.',
      }
    ).pipe(
      tap((res) => {
        if (res.success ) {
          this.formValidationErrors.set({});
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  // ================================
  // Error Handlers (unchanged)
  // ================================
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
