// import { Component, DestroyRef, OnInit, effect, inject, signal } from '@angular/core';
// import {
//   FormBuilder,
//   FormGroup,
//   Validators,
//   ReactiveFormsModule,
// } from '@angular/forms';
// import { ActivatedRoute } from '@angular/router';
// import { PatientService } from '../../../../Reception/Patients/Services/patient.service';
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// import { HeaderPatientInfoComponent } from '../../../Shared/Components/header-patient-info/header-patient-info.component';
// import { AddTherapyDiagnosisFormComponent } from '../../Components/add-therapy-diagnosis-form/add-therapy-diagnosis-form.component';
// import { ToastService } from '../../../../../core/services/toast.service';
// import { CreateTherapyCardRequest } from '../../Models/create-therapy-card.request';
// import { PatientDto } from '../../../../../core/models/Shared/patient.model';
// import { TherapyDiagnosisFacade } from '../../Services/therapy-diagnosis.facade.Service';
// import { UpdateTherapyCardRequest } from '../../Models/update-therapy-card.request';

// @Component({
//   selector: 'app-therapy-diagnosis-workspace',
//   standalone: true,
//   imports: [
//     ReactiveFormsModule,
//     HeaderPatientInfoComponent,
//     AddTherapyDiagnosisFormComponent,
//   ],
//   templateUrl: './therapy-diagnosis-workspace.component.html',
//   styleUrls: ['./therapy-diagnosis-workspace.component.css'],
// })
// export class TherapyDiagnosisWorkspaceComponent implements OnInit {
//  private route = inject(ActivatedRoute);
// private destroyRef = inject(DestroyRef);
// private patientService = inject(PatientService);
// private toast = inject(ToastService);
// private facade = inject(TherapyDiagnosisFacade);
//  patient = signal<PatientDto | null>(null);
// viewMode = signal<'add' | 'history'>('add');
// isLoading = signal(true);

// // Lookup signals directly from facade
// injuryReasons = this.facade.injuryReasons;
// injurySides = this.facade.injurySides;
// injuryTypes = this.facade.injuryTypes;
// medicalPrograms = this.facade.medicalPrograms;
// isLookupLoading = this.facade.loadingLookups;

// // Edit state (comes from facade!)
// isEditMode = this.facade.isEditMode;

// existingCard = signal<any | null>(null);

// constructor() {
//   // Debug: See lookup updates in real time
//   effect(() => {
//     console.log('medicalPrograms (effect):', this.medicalPrograms());
//   });
// }

// // --------------------------
// // INIT
// // --------------------------
// ngOnInit(): void {
//   // 🔥 MUST BE CALLED so dropdowns load
//   this.facade.loadLookups();

//   this.listenToRouteChanges();
// }

// // --------------------------
// // LOAD PATIENT BASED ON ROUTE
// // --------------------------
// private listenToRouteChanges() {
//   this.route.paramMap
//     .pipe(takeUntilDestroyed(this.destroyRef))
//     .subscribe((params) => {
//       const idParam = params.get('patientId');
//       const id = idParam ? Number(idParam) : NaN;

//       if (!id || Number.isNaN(id)) {
//         this.patient.set(null);
//         this.isLoading.set(false);
//         return;
//       }

//       this.isLoading.set(true);

//       this.patientService.getPatientById(id).subscribe((res) => {
//         if (res.isSuccess && res.data) {
//           this.patient.set(res.data);
//         } else {
//           this.patient.set(null);
//         }

//         this.isLoading.set(false);
//       });
//     });
// }

// // --------------------------
// // VIEW MODE SWITCHING
// // --------------------------
// switchToAdd() {
//   this.viewMode.set('add');
//   this.facade.enterCreateMode();
// }

// switchToHistory() {
//   this.viewMode.set('history');
// }

// // --------------------------
// // SAVE HANDLER
// // --------------------------
// saveTherapyDiagnosis(dto: CreateTherapyCardRequest | UpdateTherapyCardRequest) {

//   if (this.isEditMode()) {
//     this.facade
//       .updateTherapyCard(this.existingCard()?.TherapyCardId, dto as UpdateTherapyCardRequest)
//       .subscribe((result) => {
//         if (result.success) this.toast.success('تم تعديل التشخيص بنجاح');
//       });
//   } else {
//     this.facade
//       .createTherapyCard(dto as CreateTherapyCardRequest)
//       .subscribe((result) => {
//         if (result.success) this.toast.success('تم إضافة التشخيص بنجاح');
//       });
//   }
// }
// }

import {
  Component,
  DestroyRef,
  OnInit,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HeaderPatientInfoComponent } from '../../../Shared/Components/header-patient-info/header-patient-info.component';
import { AddTherapyDiagnosisFormComponent } from '../../Components/add-therapy-diagnosis-form/add-therapy-diagnosis-form.component';
import { ToastService } from '../../../../../core/services/toast.service';
import { CreateTherapyCardRequest } from '../../Models/create-therapy-card.request';
import { TherapyDiagnosisFacade } from '../../Services/therapy-diagnosis.facade.Service';
import { UpdateTherapyCardRequest } from '../../Models/update-therapy-card.request';
import { TicketFacade } from '../../../../Reception/Tickets/tickets.facade.service';

@Component({
  selector: 'app-therapy-diagnosis-workspace',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HeaderPatientInfoComponent,
    AddTherapyDiagnosisFormComponent,
  ],
  templateUrl: './therapy-diagnosis-workspace.component.html',
  styleUrls: ['./therapy-diagnosis-workspace.component.css'],
})
export class TherapyDiagnosisWorkspaceComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  private toast = inject(ToastService);
  private therapyFacade = inject(TherapyDiagnosisFacade);
  private ticketFacade = inject(TicketFacade);

  ticket = this.ticketFacade.selectedTicket;
  viewMode = signal<'add' | 'history'>('add');

  isLoading = this.ticketFacade.loadingTicket;

  // Lookup Signals (from therapy facade)
  injuryReasons = this.therapyFacade.injuryReasons;
  injurySides = this.therapyFacade.injurySides;
  injuryTypes = this.therapyFacade.injuryTypes;
  medicalPrograms = this.therapyFacade.medicalPrograms;
  isLookupLoading = this.therapyFacade.loadingLookups;

  isEditMode = this.therapyFacade.isEditMode;
  existingCard = signal<any | null>(null);

  // ------------------------------
  // INIT
  // ------------------------------
  ngOnInit(): void {
    // Load dropdowns (injuries & medical programs)
    this.therapyFacade.loadLookups();
    console.log('loaded...........');

    // Load ticket based on route param
    this.listenToRouteChanges();
  }

  private listenToRouteChanges() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const ticketId = Number(params.get('ticketId'));

        if (!ticketId || Number.isNaN(ticketId)) {
          this.isLoading.set(false);
          return;
        }

        this.ticketFacade.loadTicketById(ticketId);
      });
  }

  switchToAdd() {
    this.viewMode.set('add');
    this.therapyFacade.enterCreateMode();
  }

  switchToHistory() {
    this.viewMode.set('history');
  }

  saveTherapyDiagnosis(
    dto: CreateTherapyCardRequest | UpdateTherapyCardRequest
  ) {
    if (this.isEditMode()) {
      this.therapyFacade
        .updateTherapyCard(
          this.existingCard()?.TherapyCardId,
          dto as UpdateTherapyCardRequest
        )
        .subscribe();
    } else {
      this.therapyFacade
        .createTherapyCard(dto as CreateTherapyCardRequest)
        .subscribe();
    }
  }
}
