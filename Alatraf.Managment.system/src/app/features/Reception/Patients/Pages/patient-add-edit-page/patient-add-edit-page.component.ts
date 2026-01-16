import { Component, inject, input } from '@angular/core';
import { PatientFormComponent } from '../../components/patient-form/patient-form.component';
import { DialogService } from '../../../../../shared/components/dialog/dialog.service';
import { ArabicSuccessMessages } from '../../../../../core/locals/Arabic';
import { NavigationReceptionFacade } from '../../../../../core/navigation/navigation-reception.facade';
import { PatientsFacade } from '../../Services/patients.facade.service';
import { UiLockService } from '../../../../../core/services/ui-lock.service';
import { CreatePatientRequest } from '../../models/create-patient.request';
import { UpdatePatientRequest } from '../../models/update-patient.request';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientSelectTarget } from '../../../../../shared/enums/patient-select-target.enum';
import { DialogType } from '../../../../../shared/components/dialog/DialogConfig';

// NEW DTOs

@Component({
  selector: 'app-patient-add-edit-page',
  imports: [PatientFormComponent],
  templateUrl: './patient-add-edit-page.component.html',
  styleUrl: './patient-add-edit-page.component.css',
})
export class PatientAddEditPageComponent {
  private facade = inject(PatientsFacade);
  private dialogService = inject(DialogService);
  private navReception = inject(NavigationReceptionFacade);
  private uiLock = inject(UiLockService);

  patientId = input<string>();

  isEditMode = this.facade.isEditMode;
  patientInfo = this.facade.selectedPatient;
  // this for redirect after save
  private route = inject(ActivatedRoute);
  private redirectTarget: string | null = null;
  private featureTarget: PatientSelectTarget | null = null;

  ngOnInit() {
    const id = Number(this.patientId());

    // read redirect query param
    this.redirectTarget = this.route.snapshot.queryParamMap.get('redirect');
    this.featureTarget = this.route.snapshot.queryParamMap.get(
      'target'
    ) as PatientSelectTarget | null;

    if (!isNaN(id)) {
      this.facade.loadPatientForEdit(id);
    } else {
      this.facade.enterCreateMode();
    }
  }

  // DTO type changed here ↓
  OnSavePatient(dto: CreatePatientRequest | UpdatePatientRequest) {
    // Clear previous backend validation
    this.facade.formValidationErrors.set({});

    if (this.isEditMode()) {
      // ===================== UPDATE =====================
      this.facade
        .updatePatient(Number(this.patientId()), dto as UpdatePatientRequest)
        .subscribe((result) => {
          if (result.success) {
            this.closeModal();
            return;
          }

          if (result.validationErrors) {
            this.facade.formValidationErrors.set(result.validationErrors);
          }
        });
    } else {
      // ===================== CREATE =====================
      this.facade
        .createPatient(dto as CreatePatientRequest)
        .subscribe((result) => {
          if (result.success && !result.validationErrors) {
            const newPatientId = this.facade.createdPatientId();

            this.dialogService
              .confirm({
                type: DialogType.Success,
                title: 'نجاح',
                message: ArabicSuccessMessages.saved,
                confirmText: 'إصدار تذكرة',
                showCancel: true,
              })
              .subscribe((confirm) => {
                if (!confirm || !newPatientId) return;

                if (this.redirectTarget === 'select-patient') {
                  this.navReception.goToPatientsSelect({
                    queryParams: {
                      target: this.featureTarget,
                    },
                  });
                  return;
                }

                // existing behavior
                this.navReception.goToTicketsCreate(newPatientId);
              });

            this.closeModal();
            return;
          }

          // Inline validation
          if (result.validationErrors) {
            this.facade.formValidationErrors.set(result.validationErrors);
          }
        });
    }
  }

  onCancel() {
    this.closeModal();
  }

  private closeModal() {
    this.uiLock.unlock();

    if (this.redirectTarget === 'select-patient') {
      this.navReception.goToPatientsSelect({
        queryParams: {
          target: this.featureTarget,
        },
      });
      return;
    }
    this.navReception.goToPatientsList();
  }
}
