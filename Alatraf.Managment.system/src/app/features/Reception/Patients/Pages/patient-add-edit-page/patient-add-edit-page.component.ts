// import { Component, inject, input, signal, DestroyRef } from '@angular/core';
// import { PatientFormComponent } from '../../components/patient-form/patient-form.component';
// import { CreateUpdatePatientDto, Patient } from '../../models/patient.model';
// import { PatientService } from '../../Services/patient.service';
// import { DialogService } from '../../../../../shared/components/dialog/dialog.service';
// import { ArabicSuccessMessages } from '../../../../../core/locals/Arabic';
// import { NavigationReceptionFacade } from '../../../../../core/navigation/navigation-reception.facade';

// @Component({
//   selector: 'app-patient-add-edit-page',
//   imports: [PatientFormComponent],
//   templateUrl: './patient-add-edit-page.component.html',
//   styleUrl: './patient-add-edit-page.component.css',
// })
// export class PatientAddEditPageComponent {
//   private patientService = inject(PatientService);
//   private dialogService = inject(DialogService);
//   private navReception = inject(NavigationReceptionFacade);

//   private destroyRef = inject(DestroyRef);

//   patientId = input<string>();
//   isEditMode = signal<boolean>(false);
//   patientInfo = signal<Patient | undefined>(undefined);

//   ngOnInit() {
//     const id = Number(this.patientId());
//     console.log(id);
//     if (!isNaN(id)) {
//       this.isEditMode.set(true);

//       const subscription = this.patientService.getPatientById(id).subscribe({
//         next: (result) => {
//           if (result.isSuccess && result.data) {
//             this.patientInfo.set(result.data);
//           } else {
//             console.error('Patient not found or API error', result);
//           }
//         },
//         error: (err) => {
//           console.error('API error', err);
//           this.isEditMode.set(false);
//         },
//       });
//       this.destroyRef.onDestroy(() => {
//         subscription.unsubscribe();
//       });
//     }
//   }

//   OnSavePatient(newpatien: CreateUpdatePatientDto) {
//     if (this.isEditMode()) {
//       const updated = this.patientService
//         .updatePatient(Number(this.patientId()), newpatien)
//         .subscribe();

//       console.log('this is the updated  patient info ', newpatien);
//     } else {
//       const Addedpatient = this.patientService
//         .createPatient(newpatien)
//         .subscribe({
//           next: (res) => {
//             if (res.isSuccess && res.data) {
//               const patientId = res.data.patientId;
//               this.dialogService
//                 .confirmSuccess(ArabicSuccessMessages.saved)
//                 .subscribe((confirm) => {
//                   if (confirm) {
//                     this.navReception.goToTicketsCreate(patientId);
//                   }
//                 });
//             }
//           },
//         });

//       console.log('Add new patient info ', newpatien);
//     }

//     this.closeModal();
//   }

//   onCancel() {
//     this.closeModal();
//   }
//   private closeModal() {
//     this.navReception.goToPatientsList();
//   }
// }
import { Component, inject, input } from '@angular/core';
import { PatientFormComponent } from '../../components/patient-form/patient-form.component';
import { CreateUpdatePatientDto } from '../../models/patient.model';
import { DialogService } from '../../../../../shared/components/dialog/dialog.service';
import { ArabicSuccessMessages } from '../../../../../core/locals/Arabic';
import { NavigationReceptionFacade } from '../../../../../core/navigation/navigation-reception.facade';
import { PatientsFacade } from '../../Services/patients.facade.service';

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

  OnSavePatient(formDto: CreateUpdatePatientDto) {
    if (this.isEditMode()) {
      this.facade.updatePatient(Number(this.patientId()), formDto).subscribe({
        next: (updatedPatient) => {
          if (updatedPatient) {
            this.closeModal();
          }
        },
      });
    } else {
      // ------ CREATE MODE ------
      this.facade.createPatient(formDto).subscribe({
        next: (newPatient) => {
          if (!newPatient) return;

          const patientId = newPatient.patientId;

          this.dialogService
            .confirmSuccess(ArabicSuccessMessages.saved)
            .subscribe((confirm) => {
              if (confirm) {
                this.navReception.goToTicketsCreate(patientId);
              }
            });
        },
      });
    }
    this.closeModal();
  }

  onCancel() {
    this.closeModal();
  }

  private closeModal() {
    this.navReception.goToPatientsList();
  }
}
