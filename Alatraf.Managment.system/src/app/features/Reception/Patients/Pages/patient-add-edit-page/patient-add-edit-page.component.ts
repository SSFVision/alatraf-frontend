// import { Component, inject, input } from '@angular/core';
// import { PatientFormComponent } from '../../components/patient-form/patient-form.component';
// import { DialogService } from '../../../../../shared/components/dialog/dialog.service';
// import { ArabicSuccessMessages } from '../../../../../core/locals/Arabic';
// import { NavigationReceptionFacade } from '../../../../../core/navigation/navigation-reception.facade';
// import { PatientsFacade } from '../../Services/patients.facade.service';
// import { UiLockService } from '../../../../../core/services/ui-lock.service';
// import { CreatePatientRequest } from '../../models/create-patient.request';
// import { UpdatePatientRequest } from '../../models/update-patient.request';
// import { ActivatedRoute, Router } from '@angular/router';

// // NEW DTOs

// @Component({
//   selector: 'app-patient-add-edit-page',
//   imports: [PatientFormComponent],
//   templateUrl: './patient-add-edit-page.component.html',
//   styleUrl: './patient-add-edit-page.component.css',
// })
// export class PatientAddEditPageComponent {
//   private facade = inject(PatientsFacade);
//   private dialogService = inject(DialogService);
//   private navReception = inject(NavigationReceptionFacade);
//   private uiLock = inject(UiLockService);

//   patientId = input<string>();

//   isEditMode = this.facade.isEditMode;
//   patientInfo = this.facade.selectedPatient;

//   ngOnInit() {
//     const id = Number(this.patientId());

//     if (!isNaN(id)) {
//       this.facade.loadPatientForEdit(id);
//     } else {
//       this.facade.enterCreateMode();
//     }
//   }

//   // DTO type changed here ↓
//   OnSavePatient(dto: CreatePatientRequest | UpdatePatientRequest) {
//     // Clear previous backend validation
//     this.facade.formValidationErrors.set({});

//     if (this.isEditMode()) {
//       // ===================== UPDATE =====================
//       this.facade
//         .updatePatient(Number(this.patientId()), dto as UpdatePatientRequest)
//         .subscribe((result) => {
//           if (result.success) {
//             this.closeModal();
//             return;
//           }

//           if (result.validationErrors) {
//             this.facade.formValidationErrors.set(result.validationErrors);
//           }
//         });
//     } else {
//       // ===================== CREATE =====================
//       this.facade
//         .createPatient(dto as CreatePatientRequest)
//         .subscribe((result) => {
//           if (result.success && !result.validationErrors) {
//             const newPatientId = this.facade.createdPatientId();

//             this.dialogService
//               .confirmSuccess(ArabicSuccessMessages.saved)
//               .subscribe((confirm) => {
//                 if (confirm && newPatientId) {
//                   this.navReception.goToTicketsCreate(newPatientId);
//                 }
//               });

//             this.closeModal();
//             return;
//           }

//           // Inline validation
//           if (result.validationErrors) {
//             this.facade.formValidationErrors.set(result.validationErrors);
//           }
//         });
//     }
//   }

//   onCancel() {
//     this.closeModal();
//   }

//   private closeModal() {
//     this.uiLock.unlock();
//     this.navReception.goToPatientsList();
//   }
// }


import { Component, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PatientFormComponent } from '../../components/patient-form/patient-form.component';
import { DialogService } from '../../../../../shared/components/dialog/dialog.service';
import { ArabicSuccessMessages } from '../../../../../core/locals/Arabic';
import { NavigationReceptionFacade } from '../../../../../core/navigation/navigation-reception.facade';
import { PatientsFacade } from '../../Services/patients.facade.service';
import { UiLockService } from '../../../../../core/services/ui-lock.service';

import { CreatePatientRequest } from '../../models/create-patient.request';
import { UpdatePatientRequest } from '../../models/update-patient.request';

@Component({
  selector: 'app-patient-add-edit-page',
  standalone: true,
  imports: [PatientFormComponent],
  templateUrl: './patient-add-edit-page.component.html',
  styleUrl: './patient-add-edit-page.component.css',
})
export class PatientAddEditPageComponent {
  private facade = inject(PatientsFacade);
  private dialogService = inject(DialogService);
  private navReception = inject(NavigationReceptionFacade);
  private uiLock = inject(UiLockService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  patientId = input<string>();

  isEditMode = this.facade.isEditMode;
  patientInfo = this.facade.selectedPatient;

  // 👈 NEW
  private redirectTarget: string | null = null;

  ngOnInit() {
    this.redirectTarget = this.route.snapshot.queryParamMap.get('redirect');

    const id = Number(this.patientId());

    if (!isNaN(id)) {
      this.facade.loadPatientForEdit(id);
    } else {
      this.facade.enterCreateMode();
    }
  }

  // ------------------------------------------------
  // SAVE
  // ------------------------------------------------
  OnSavePatient(dto: CreatePatientRequest | UpdatePatientRequest) {
    this.facade.formValidationErrors.set({});

    if (this.isEditMode()) {
      // ================= UPDATE =================
      this.facade
        .updatePatient(Number(this.patientId()), dto as UpdatePatientRequest)
        .subscribe((result) => {
          if (result.success) {
            this.handleRedirectAfterSave(Number(this.patientId()));
          }

          if (result.validationErrors) {
            this.facade.formValidationErrors.set(result.validationErrors);
          }
        });

    } else {
      // ================= CREATE =================
      this.facade
        .createPatient(dto as CreatePatientRequest)
        .subscribe((result) => {
          if (result.success && !result.validationErrors) {
            const newPatientId = this.facade.createdPatientId();

            this.dialogService
              .confirmSuccess(ArabicSuccessMessages.saved)
              .subscribe((confirm) => {
                if (confirm && newPatientId) {
                  this.handleRedirectAfterSave(newPatientId);
                }
              });
          }

          if (result.validationErrors) {
            this.facade.formValidationErrors.set(result.validationErrors);
          }
        });
    }
  }

  // ------------------------------------------------
  // CANCEL
  // ------------------------------------------------
  onCancel() {
    this.closeAndGoBack();
  }

  // ------------------------------------------------
  // REDIRECT LOGIC (⭐ IMPORTANT)
  // ------------------------------------------------
  private handleRedirectAfterSave(patientId: number): void {
    this.uiLock.unlock();

    switch (this.redirectTarget) {
      case 'select-patient':
        this.router.navigate(
          ['/reception/patients/select'],
          { queryParams: { target: 'disabled-card' } }
        );
        break;

      case 'ticket':
        this.navReception.goToTicketsCreate(patientId);
        break;

      default:
        this.navReception.goToPatientsList();
        break;
    }
  }

  private closeAndGoBack(): void {
    this.uiLock.unlock();

    if (this.redirectTarget === 'select-patient') {
      this.router.navigate(
        ['/reception/patients/select'],
        { queryParams: { target: 'disabled-card' } }
      );
      return;
    }

    this.navReception.goToPatientsList();
  }
}
