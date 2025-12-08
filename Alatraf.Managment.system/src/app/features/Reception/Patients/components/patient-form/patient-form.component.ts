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
  runInInjectionContext,
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { NgIf } from '@angular/common';

import { PatientsFacade } from '../../Services/patients.facade.service';

import { FormValidationState } from '../../../../../core/utils/form-validation-state';
import {
  PatientDto,
  PatientType,
} from '../../../../../core/models/Shared/patient.model';
import { CreatePatientRequest } from '../../models/create-patient.request';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.css',
})
export class PatientFormComponent implements OnChanges, OnInit {
  patient = input.required<PatientDto | null>();
  close = output();
  save = output<CreatePatientRequest>();
  mode = input.required<boolean>();

  private facade = inject(PatientsFacade);
  private fb = inject(FormBuilder);
  private env = inject(EnvironmentInjector);

  form!: FormGroup;
  private validationState!: FormValidationState;

  constructor() {}

  ngOnInit(): void {
    // 1️⃣ Create the form — autoRegistrationNumber removed
    this.form = this.fb.group({
      fullname: ['', Validators.required],
      gender: [true, Validators.required],
      birthdate: [null,Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      nationalNo: [''],
      patientType: [PatientType.Normal, Validators.required],
    });

    this.validationState = new FormValidationState(
      this.form,
      this.facade.formValidationErrors
    );

    runInInjectionContext(this.env, () => {
      effect(() => {
        this.validationState.apply();
      });
    });

    // 4️⃣ Remove backend errors on edit
    this.validationState.clearOnEdit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patient'] && this.patient() && this.form) {
      const p = this.patient() as PatientDto;

      // Auto-registration number removed; everything else stays
      this.form.patchValue({
        fullname: p.personDto?.fullname ?? '',
        gender: this.toBooleanGender(p.personDto?.gender),
        birthdate: this.formatDate(p.personDto?.birthdate),
        phone: p.personDto?.phone ?? '',
        address: p.personDto?.address ?? '',
        nationalNo: p.personDto?.nationalNo ?? '',
        patientType: p.patientType,
      });
    }
  }

  onSave() {
    if (this.form.valid) {
      const dto = { ...this.form.value };

      // Convert empty string to null for the backend
      if (dto.birthdate === '') {
        dto.birthdate = null;
      }

      this.save.emit(dto);
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

  private toBooleanGender(value: string | boolean | null | undefined): boolean {
    if (typeof value === 'boolean') return value;

    if (typeof value === 'string') {
      const v = value.toLowerCase();
      if (v === 'male' || v === 'ذكر') return true;
      if (v === 'female' || v === 'أنثى') return false;
    }

    return true; // default
  }
}
