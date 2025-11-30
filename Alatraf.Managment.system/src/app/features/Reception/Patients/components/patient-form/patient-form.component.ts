// import {
//   Component,
//   input,
//   output,
//   OnChanges,
//   SimpleChanges,
//   OnInit,
//   inject,
//   effect,
// } from '@angular/core';
// import {
//   FormBuilder,
//   Validators,
//   ReactiveFormsModule,
//   FormGroup,
// } from '@angular/forms';
// import { NgIf } from '@angular/common';
// import { PatientsFacade } from '../../Services/patients.facade.service';
// import {
//   CreateUpdatePatientDto,
//   PatientType,
// } from '../../models/patient.model';

// @Component({
//   selector: 'app-patient-form',
//   standalone: true,
//   imports: [ReactiveFormsModule, NgIf],
//   templateUrl: './patient-form.component.html',
//   styleUrl: './patient-form.component.css',
// })
// export class PatientFormComponent implements OnChanges, OnInit {
//   patient = input.required<any>();
//   close = output();
//   save = output<any>();
//   mode = input.required<boolean>();

//   private facade = inject(PatientsFacade);
//   form!: FormGroup;

//   constructor(private fb: FormBuilder) {
//     effect(() => {
//       if (!this.form) return; // <--- FIXED

//       const errors = this.facade.formValidationErrors();
//       if (!errors) return;

//       // Remove old backend errors
//       Object.keys(this.form.controls).forEach((c) => {
//         const control = this.form.get(c);
//         if (control?.errors?.['backend']) {
//           control.setErrors(null);
//         }
//       });

//       // Apply new backend errors
//       for (const field in errors) {
//         const control = this.form.get(field);
//         if (control) {
//           control.setErrors({ backend: errors[field][0] });
//           control.markAsTouched();
//         }
//       }
//     });
//   }

//   ngOnInit(): void {
//     this.form = this.fb.group({
//       autoRegistrationNumber: [this.GenerateRandomAutoRegisterNumber()],
//       fullname: ['', Validators.required],
//       gender: [true, Validators.required],
//       birthdate: [''],
//       phone: ['', Validators.required],
//       address: [''],
//       nationalNo: ['', Validators.required],
//       patientType: [PatientType.Normal],
//     });

//     // Clear old backend validation when user changes any field
//     this.form.valueChanges.subscribe(() => {
//       this.facade.formValidationErrors.set({});
//     });
//   }

//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes['patient'] && this.patient() && this.form) {
//       const p = this.patient()!;

//       this.form.patchValue({
//         ...p,
//         birthdate: this.formatDate(p.birthdate),
//       });
//     }
//   }

//   onSave() {
//     if (this.form.valid) {
//       this.save.emit(this.form.value as CreateUpdatePatientDto);
//     } else {
//       this.form.markAllAsTouched();
//     }
//   }

//  getBackendError(controlName: string): string | null {
//   const control = this.form.get(controlName);
//   if (!control) return null;

//   return control.errors?.['backend'] ?? null;
// }

// hasBackendError(controlName: string): boolean {
//   return this.getBackendError(controlName) !== null;
// }

// hasFrontendError(controlName: string): boolean {
//   // If backend error exists → never show frontend error
//   if (this.hasBackendError(controlName)) return false;

//   const control = this.form.get(controlName);
//   if (!control) return false;

//   return control.invalid && control.touched;
// }

//   private formatDate(date: string | null | undefined): string | null {
//     if (!date) return null;

//     const d = new Date(date);
//     return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
//   }

//   onClose() {
//     this.closeDialog();
//   }
//   closeDialog() {
//     this.close.emit();
//   }

//    GenerateRandomAutoRegisterNumber(){
//     return Math.random().toString();
//   }

// }
import {
  Component,
  input,
  output,
  OnChanges,
  SimpleChanges,
  OnInit,
  inject,
  effect,
  EnvironmentInjector,
  runInInjectionContext
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { PatientsFacade } from '../../Services/patients.facade.service';
import {
  CreateUpdatePatientDto,
  PatientType,
} from '../../models/patient.model';
import { FormValidationState } from '../../../../../core/utils/form-validation-state';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.css',
})
export class PatientFormComponent implements OnChanges, OnInit {
  patient = input.required<any>();
  close = output();
  save = output<any>();
  mode = input.required<boolean>();

  private facade = inject(PatientsFacade);
  private fb = inject(FormBuilder);
  private env = inject(EnvironmentInjector);

  form!: FormGroup;
  private validationState!: FormValidationState;

  constructor() {}

  ngOnInit(): void {
    // 1️⃣ Create the form
    this.form = this.fb.group({
      autoRegistrationNumber: [this.GenerateRandomAutoRegisterNumber()],
      fullname: ['', Validators.required],
      gender: [true, Validators.required],
      birthdate: [''],
      phone: ['', Validators.required],
      address: [''],
      nationalNo: ['', Validators.required],
      patientType: [PatientType.Normal],
    });

    // 2️⃣ Setup validation state
    this.validationState = new FormValidationState(
      this.form,
      this.facade.formValidationErrors
    );

    // 3️⃣ Correctly execute the effect inside injection context
    runInInjectionContext(this.env, () => {
      effect(() => {
        this.validationState.apply();
      });
    });

    // 4️⃣ Remove backend errors on user typing
    this.validationState.clearOnEdit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patient'] && this.patient() && this.form) {
      const p = this.patient()!;
      this.form.patchValue({
        ...p,
        birthdate: this.formatDate(p.birthdate),
      });
    }
  }

  onSave() {
    if (this.form.valid) {
      this.save.emit(this.form.value as CreateUpdatePatientDto);
    } else {
      this.form.markAllAsTouched();
    }
  }

  getBackendError(controlName: string): string | null {
    return this.validationState.getBackendError(controlName);
  }

  hasBackendError(controlName: string): boolean {
    return this.validationState.hasBackendError(controlName);
  }

  hasFrontendError(controlName: string): boolean {
    return this.validationState.hasFrontendError(controlName);
  }

  private formatDate(date: string | null | undefined): string | null {
    if (!date) return null;

    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
  }

  onClose() {
    this.close.emit();
  }

  GenerateRandomAutoRegisterNumber() {
    return Math.random().toString();
  }
}
