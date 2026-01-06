import { inject, Injectable, signal } from '@angular/core';
import { tap, forkJoin } from 'rxjs';

import { BaseFacade } from '../../../../core/utils/facades/base-facade';

import { RepairCardDiagnosisDto } from '../Models/repair-card-diagnosis.dto';
import { CreateRepairCardRequest } from '../Models/create-repair-card.request';
import { UpdateRepairCardRequest } from '../Models/update-repair-card.request';

import { RepairCardDiagnosisService } from './repair-card-diagnosis.service';

import { InjuryDto } from '../../../../core/models/injuries/injury.dto';

import { InjuriesManagementService } from '../../../Injuries/Services/injuries-management.service';
import { IndustrialPartsManagementService } from '../../../IndustrialParts/Services/industrial-parts-management.service';
import { IndustrialPartDto } from '../../../../core/models/industrial-parts/industrial-partdto';
import { PatientService } from '../../../Reception/Patients/Services/patient.service';

@Injectable({
  providedIn: 'root',
})
export class RepairCardDiagnosisFacade extends BaseFacade {
  private repairService = inject(RepairCardDiagnosisService);
  private injuriesService = inject(InjuriesManagementService);
  private industrialPartsService = inject(IndustrialPartsManagementService);

  private _selectedRepairCard = signal<RepairCardDiagnosisDto | null>(null);
  selectedRepairCard = this._selectedRepairCard.asReadonly();

  isEditMode = signal<boolean>(false);
  createdRepairCard = signal<RepairCardDiagnosisDto | null>(null);

  formValidationErrors = signal<Record<string, string[]>>({});

  injuryTypes = signal<InjuryDto[]>([]);
  injurySides = signal<InjuryDto[]>([]);
  injuryReasons = signal<InjuryDto[]>([]);
  industrialParts = signal<IndustrialPartDto[]>([]);

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
      parts: this.industrialPartsService.getIndustrialParts(),
    }).subscribe({
      next: (res) => {
        if (res.reasons.isSuccess)
          this.injuryReasons.set(res.reasons.data ?? []);
        if (res.types.isSuccess) this.injuryTypes.set(res.types.data ?? []);
        if (res.sides.isSuccess) this.injurySides.set(res.sides.data ?? []);
        if (res.parts.isSuccess) this.industrialParts.set(res.parts.data ?? []);

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
    this._selectedRepairCard.set(null);
    this.formValidationErrors.set({});
    this.createdRepairCard.set(null);
  }

  loadRepairCardForEdit(repairCardId: number) {
    this.isEditMode.set(true);
    this._selectedRepairCard.set(null);
    this.formValidationErrors.set({});
    this.createdRepairCard.set(null);

    this.repairService.getRepairCardById(repairCardId).pipe(
      tap((result) => {
        if (result.isSuccess && result.data) {
          this._selectedRepairCard.set(result.data);
        } else {
          this.toast.error(
            result.errorDetail ?? 'لم يتم العثور على بطاقة الإصلاح'
          );
          this.isEditMode.set(false);
        }
      })
    );
  }

  // ------------------ CREATE ------------------
  createRepairCard(dto: CreateRepairCardRequest) {
    return this.handleCreateOrUpdate(this.repairService.createRepairCard(dto), {
      successMessage: 'تم حفظ بطاقة الإصلاح بنجاح',
      defaultErrorMessage: 'فشل حفظ بطاقة الإصلاح. يرجى المحاولة لاحقاً.',
    }).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.createdRepairCard.set(res.data);
          this.formValidationErrors.set({});
        } else if (res.validationErrors) {
          this.formValidationErrors.set(res.validationErrors);
        }
      })
    );
  }

  // ------------------ UPDATE ------------------
  updateRepairCard(repairCardId: number, dto: UpdateRepairCardRequest) {
    return this.handleCreateOrUpdate(
      this.repairService.updateRepairCard(repairCardId, dto),
      {
        successMessage: 'تم تعديل بطاقة الإصلاح بنجاح',
        defaultErrorMessage: 'فشل تعديل بطاقة الإصلاح. حاول لاحقاً.',
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
private patientService = inject(PatientService);

private _patientRepairDiagnosis = signal<RepairCardDiagnosisDto[]>([]);
patientRepairDiagnosis = this._patientRepairDiagnosis.asReadonly();

loadingPatientRepairDiagnosis = signal<boolean>(false);
loadPatientRepairDiagnosis(patientId: number) {
  this.loadingPatientRepairDiagnosis.set(true);

  this.patientService
    .GetRepairCardsByPatientId(patientId)
    .pipe(
      tap((result) => {
        if (result.isSuccess && result.data) {
          this._patientRepairDiagnosis.set(result.data);
          this.toast.success(
            'previous repair diagnoses returned successfully'
          );
        } else {
          this._patientRepairDiagnosis.set([]);
          this.toast.error(
            result.errorMessage ?? 'تعذر تحميل بيانات تشخيصات الإصلاح'
          );
        }

        this.loadingPatientRepairDiagnosis.set(false);
      })
    )
    .subscribe();
}


}
