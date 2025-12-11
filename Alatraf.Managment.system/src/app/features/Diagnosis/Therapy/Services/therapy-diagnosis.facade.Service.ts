import { inject, Injectable, signal } from '@angular/core';
import { tap, forkJoin } from 'rxjs';

import { BaseFacade } from '../../../../core/utils/facades/base-facade';
import { TherapyCardDiagnosisDto } from '../Models/therapy-card-diagnosis.dto';
import { TherapyDiagnosisService } from './therapy-diagnosis.service';

import { CreateTherapyCardRequest } from '../Models/create-therapy-card.request';
import { UpdateTherapyCardRequest } from '../Models/update-therapy-card.request';
import { InjuryDto } from '../../../../core/models/injuries/injury.dto';
import { MedicalProgramDto } from '../../../../core/models/medical-programs/medical-program.dto';
import { InjuriesManagementService } from '../../../Injuries/Services/injuries-management.service';
import { MedicalProgramsManagementService } from '../../../MedicalPrograms/medical-programs-management.service';
import { PageRequest } from '../../../../core/models/Shared/page-request.model';
import { TherapyCardFilterRequest } from '../Models/therapy-card-filter.request';
import { TherapyCardDto } from '../Models/therapy-card.dto';
import { PatientService } from '../../../Reception/Patients/Services/patient.service';

@Injectable({
  providedIn: 'root',
})
export class TherapyDiagnosisFacade extends BaseFacade {
  private therapyService = inject(TherapyDiagnosisService);
  private injuriesService = inject(InjuriesManagementService);
  private programsService = inject(MedicalProgramsManagementService);

  private _selectedTherapyCard = signal<TherapyCardDiagnosisDto | null>(null);
  selectedTherapyCard = this._selectedTherapyCard.asReadonly();

  isEditMode = signal<boolean>(false);
  createdTherapyCard = signal<TherapyCardDiagnosisDto | null>(null);

  formValidationErrors = signal<Record<string, string[]>>({});

  injuryTypes = signal<InjuryDto[]>([]);
  injurySides = signal<InjuryDto[]>([]);
  injuryReasons = signal<InjuryDto[]>([]);
  medicalPrograms = signal<MedicalProgramDto[]>([]);
  loadingLookups = signal<boolean>(true);

  constructor() {
    super();
  }

  loadLookups() {
    this.loadingLookups.set(true);

    forkJoin({
      types: this.injuriesService.getInjuryTypes(),
      sides: this.injuriesService.getInjurySides(),
      reasons: this.injuriesService.getInjuryReasons(),
      programs: this.programsService.getMedicalPrograms(),
    }).subscribe({
      next: (res) => {
        if (res.reasons.isSuccess && res.reasons.data)
          this.injuryReasons.set(res.reasons.data);

        if (res.types.isSuccess && res.types.data)
          this.injuryTypes.set(res.types.data);

        if (res.sides.isSuccess && res.sides.data)
          this.injurySides.set(res.sides.data);

        if (res.programs.isSuccess && res.programs.data)
          this.medicalPrograms.set(res.programs.data);

        this.loadingLookups.set(false);
      },
      error: () => {
        this.toast.error('فشل تحميل بيانات الاختيارات');
        this.loadingLookups.set(false);
      },
    });
  }

  enterCreateMode() {
    this.isEditMode.set(false);
    this._selectedTherapyCard.set(null);
    this.formValidationErrors.set({});
    this.createdTherapyCard.set(null);
  }

  loadTherapyCardForEdit(therapyCardId: number) {
    this.isEditMode.set(true);
    this._selectedTherapyCard.set(null);
    this.formValidationErrors.set({});
    this.createdTherapyCard.set(null);

    this.therapyService
      .getTherapyCardById(therapyCardId)
      .pipe(
        tap((result) => {
          if (result.isSuccess && result.data) {
            this._selectedTherapyCard.set(result.data);
          } else {
            this.toast.error(
              result.errorDetail ?? 'لم يتم العثور على بطاقة العلاج'
            );
            this.isEditMode.set(false);
            this._selectedTherapyCard.set(null);
          }
        })
      )
      .subscribe();
  }

  // ------------------ CREATE ------------------
  createTherapyCard(dto: CreateTherapyCardRequest) {
    return this.handleCreateOrUpdate(
      this.therapyService.createTherapyCard(dto),
      {
        successMessage: 'تم حفظ بطاقة العلاج بنجاح',
        defaultErrorMessage: 'فشل حفظ بطاقة العلاج. يرجى المحاولة لاحقاً.',
      }
    ).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.createdTherapyCard.set(res.data);
          this.formValidationErrors.set({});
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  // ------------------ UPDATE ------------------
  updateTherapyCard(therapyCardId: number, dto: UpdateTherapyCardRequest) {
    return this.handleCreateOrUpdate(
      this.therapyService.updateTherapyCard(therapyCardId, dto),
      {
        successMessage: 'تم تعديل بطاقة العلاج بنجاح',
        defaultErrorMessage: 'فشل تعديل بطاقة العلاج. حاول لاحقاً.',
      }
    ).pipe(
      tap((res) => {
        if (res.success) {
          this.formValidationErrors.set({});
        }

        if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }



   // =====================================================================
  // 🔥🔥🔥 ADDITION: GET ALL THERAPY CARDS (LIKE TICKET FACADE)
  // =====================================================================

  private _therapyCards = signal<TherapyCardDto[]>([]);
  therapyCards = this._therapyCards.asReadonly();

  private _filters = signal<TherapyCardFilterRequest>({
    searchTerm: '',
    sortColumn: 'ProgramStartDate',
    sortDirection: 'desc',
    isActive: null,
    therapyCardType: null,
    therapyCardStatus: null,
    programStartFrom: null,
    programStartTo: null,
    programEndFrom: null,
    programEndTo: null,
    diagnosisId: null,
    patientId: null,
  });
  filters = this._filters.asReadonly();

  private _pageRequest = signal<PageRequest>({
    page: 1,
    pageSize: 10,
  });
  pageRequest = this._pageRequest.asReadonly();

  totalCount = signal<number>(0);

  // ----------------------- Load All Cards -----------------------
  loadTherapyCards() {
    this.therapyService
      .getAllTherapyCardPagenated(this._filters(), this._pageRequest())
      .pipe(
        tap((result) => {
          if (result.isSuccess && result.data?.items) {
            this._therapyCards.set(result.data.items);
            this.totalCount.set(result.data.totalCount ?? 0);
          } else {
            this._therapyCards.set([]);
            this.totalCount.set(0);
            this.toast.error('تعذر تحميل بطاقات العلاج');
          }
        })
      )
      .subscribe();
  }

  // ----------------------- Update filters -----------------------
  updateFilters(newFilters: Partial<TherapyCardFilterRequest>) {
    this._filters.update((f) => ({ ...f, ...newFilters }));
  }

  // ----------------------- Pagination -----------------------
  setPage(page: number) {
    this._pageRequest.update((p) => ({ ...p, page }));
    this.loadTherapyCards();
  }

  setPageSize(size: number) {
    this._pageRequest.update((p) => ({ page: 1, pageSize: size }));
    this.loadTherapyCards();
  }

  // ----------------------- Reset -----------------------
  resetFilters() {
    this._filters.set({
      searchTerm: '',
      sortColumn: 'ProgramStartDate',
      sortDirection: 'desc',
      isActive: null,
      therapyCardType: null,
      therapyCardStatus: null,
      programStartFrom: null,
      programStartTo: null,
      programEndFrom: null,
      programEndTo: null,
      diagnosisId: null,
      patientId: null,
    });

    this._pageRequest.set({ page: 1, pageSize: 10 });
    this._therapyCards.set([]);
    this.totalCount.set(0);
  }


  /// Load all patient prevoius therapy diagnosis
  private _patientTherapyDiagnoisis = signal<TherapyCardDiagnosisDto[]>([]);
patientTherapyDiagnoisis = this._patientTherapyDiagnoisis.asReadonly();

private patientService=inject(PatientService)

loadingPatientTherapyDiagnoisis = signal<boolean>(false);
loadPatientTherapyDiagnoisis(patientId: number) {
  this.loadingPatientTherapyDiagnoisis.set(true);
  this.patientService
    .GetPatientTherapyCardsById(patientId)
    .pipe(
      tap((result) => {
        if (result.isSuccess && result.data) {
          this._patientTherapyDiagnoisis.set(result.data);
          this.toast.success("✅ previous disgonsed returnd sucess fully ")
        } else {
          this._patientTherapyDiagnoisis.set([]);
          this.toast.error(
            result.errorMessage ?? 'تعذر تحميل بيانات تشخيصات المريض'
          );
        }

        this.loadingPatientTherapyDiagnoisis.set(false);
      })
    )
    .subscribe();
}



}
