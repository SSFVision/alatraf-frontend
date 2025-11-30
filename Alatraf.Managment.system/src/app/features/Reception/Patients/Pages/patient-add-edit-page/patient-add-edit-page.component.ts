import { Component, computed, inject, input, signal } from '@angular/core';
import { PatientFormComponent } from '../../components/patient-form/patient-form.component';
import { CreateUpdatePatientDto, Patient } from '../../models/patient.model';
import { DialogService } from '../../../../../shared/components/dialog/dialog.service';
import { ArabicSuccessMessages } from '../../../../../core/locals/Arabic';
import { NavigationReceptionFacade } from '../../../../../core/navigation/navigation-reception.facade';
import { PatientsFacade } from '../../Services/patients.facade.service';
import { ActivatedRoute } from '@angular/router';
import { UiLockService } from '../../../../../core/services/ui-lock.service';

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

  ngOnInit() {
    const id = Number(this.patientId());

    if (!isNaN(id)) {
      this.facade.loadPatientForEdit(id);
    } else {
      this.facade.enterCreateMode();
    }
  }

  OnSavePatient(dto: CreateUpdatePatientDto) {
    // CLEAR previous inline errors
    this.facade.formValidationErrors.set({});

    if (this.isEditMode()) {
      // =============== UPDATE ===============
      this.facade
        .updatePatient(Number(this.patientId()), dto)
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
      // =============== CREATE ===============
      this.facade.createPatient(dto).subscribe((result) => {
        if (result.success && result.validationErrors == null) {
          const newPatientId = this.facade.createdPatientId();

          this.dialogService
            .confirmSuccess(ArabicSuccessMessages.saved)
            .subscribe((confirm) => {
              if (confirm && newPatientId) {
                this.navReception.goToTicketsCreate(newPatientId);
              }
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
    this.navReception.goToPatientsList();
  }
}
