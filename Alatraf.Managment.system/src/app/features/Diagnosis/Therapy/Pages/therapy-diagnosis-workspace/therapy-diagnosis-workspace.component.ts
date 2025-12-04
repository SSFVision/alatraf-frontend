// import {
//   Component,
//   DestroyRef,
//   inject,
//   Input,
//   OnChanges,
//   OnInit,
//   signal,
//   SimpleChanges,
// } from '@angular/core';
// import { HeaderPatientInfoComponent } from '../../../Shared/Components/header-patient-info/header-patient-info.component';
// import { PatientsFacade } from '../../../../Reception/Patients/Services/patients.facade.service';
// import { ActivatedRoute } from '@angular/router';
// import { PatientService } from '../../../../Reception/Patients/Services/patient.service';
// import { Patient } from '../../../../Reception/Patients/models/patient.model';
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// @Component({
//   selector: 'app-therapy-diagnosis-workspace',
//   imports: [HeaderPatientInfoComponent],
//   templateUrl: './therapy-diagnosis-workspace.component.html',
//   styleUrl: './therapy-diagnosis-workspace.component.css',
// })
// export class TherapyDiagnosisWorkspaceComponent implements OnInit {
//   private patientService = inject(PatientService);
//   private route = inject(ActivatedRoute);
//   private destroyRef = inject(DestroyRef);
//   patient = signal<Patient | null>(null);
//   viewMode = signal<'add' | 'history'>('add');

//   ngOnInit() {
//     this.patient.set(null);
//     this.route.paramMap
//       .pipe(takeUntilDestroyed(this.destroyRef))
//       .subscribe((params) => {
//         const idParam = params.get('patientId'); // make sure this name matches your route
//         const id = idParam ? Number(idParam) : NaN;


//         if (!id || Number.isNaN(id)) {
//           this.patient.set(null);
//           return;
//         }

//         this.patientService.getPatientById(id).subscribe((res) => {
//           if (res.isSuccess && res.data) {
//             this.patient.set(res.data);
//           } else {
//             this.patient.set(null);
//           }
//         });
//       });
//   }

//   switchToAdd() {
//     this.viewMode.set('add');
//   }

//   switchToHistory() {
//     this.viewMode.set('history');
//   }
// }
import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SelectTherapyProgramsComponent } from '../../Components/select-therapy-programs/select-therapy-programs.component';
import { CreateTherapyCardMedicalProgramRequest, CreateTherapyCardRequest } from '../../Models/create-therapy-card.request';

@Component({
  selector: 'app-therapy-diagnosis-workspace',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SelectTherapyProgramsComponent
  ],
  templateUrl: './therapy-diagnosis-workspace.component.html',
  styleUrls: ['./therapy-diagnosis-workspace.component.css'],
})
export class TherapyDiagnosisWorkspaceComponent implements OnInit {

  private fb = inject(FormBuilder);

  medicalPrograms = [
    { id: 1, name: 'تدليك' },
    { id: 2, name: 'كهرباء' },
    { id: 3, name: 'wa' },
  ];

  form: FormGroup = this.fb.group({
    InjurySides: this.fb.control([], Validators.required),
    InjuryTypes: this.fb.control([], Validators.required),
    InjuryDate: this.fb.control(null, Validators.required),
    InjuryReasons: this.fb.control([], Validators.required),
    DiagnosisText: this.fb.control('', Validators.required),

    ProgramStartDate: this.fb.control('', Validators.required),
    ProgramEndDate: this.fb.control('', Validators.required),

    TherapyCardType: this.fb.control(null, Validators.required),

    Notes: this.fb.control(''),

    Programs: this.fb.array<FormGroup>([])
  });

  // -----------------------------
  // Programs shorter reference
  // -----------------------------
  get programs(): FormArray<FormGroup> {
    return this.form.get('Programs') as FormArray<FormGroup>;
  }

  ngOnInit(): void {
    this.ensureInitialRow();
  }

  private createProgram(): FormGroup {
    return this.fb.group({
      MedicalProgramId: this.fb.control(null, Validators.required),
      Duration: this.fb.control(null, [Validators.required, Validators.min(1)]),
      Notes: this.fb.control('')
    });
  }

  private ensureInitialRow(): void {
    if (this.programs.length === 0) {
      this.programs.push(this.createProgram());
    }
  }

  // -----------------------------
  // SUBMIT + VALIDATION
  // -----------------------------
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.error("❌ Form invalid:", this.form);
      return;
    }

    const formValue = this.form.value;

    const payload: CreateTherapyCardRequest = {
      TicketId: 0, // fill from route/parent
      DiagnosisText: formValue.DiagnosisText,
      InjuryDate: formValue.InjuryDate,

      InjuryReasons: formValue.InjuryReasons,
      InjurySides: formValue.InjurySides,
      InjuryTypes: formValue.InjuryTypes,

      PatientId: 0, // fill from route
      ProgramStartDate: formValue.ProgramStartDate,
      ProgramEndDate: formValue.ProgramEndDate,
      TherapyCardType: formValue.TherapyCardType,

      Notes: formValue.Notes ?? null,

      Programs: formValue.Programs as CreateTherapyCardMedicalProgramRequest[]
    };

    console.log("🔥 FINAL DIAGNOSIS PAYLOAD:", payload);
  }
}

