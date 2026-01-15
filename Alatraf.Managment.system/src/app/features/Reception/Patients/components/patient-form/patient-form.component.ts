import { NgIf } from '@angular/common';
import {
  Component,
  effect,
  EnvironmentInjector,
  inject,
  input,
  OnChanges,
  OnInit,
  output,
  runInInjectionContext,
  signal,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { PatientsFacade } from '../../Services/patients.facade.service';

import { debounceTime } from 'rxjs';
import { CACHE_KEYS } from '../../../../../core/constants/cache-keys.constants';
import {
  PatientDto,
  PatientType,
} from '../../../../../core/models/Shared/patient.model';
import { CacheService } from '../../../../../core/services/cache.service';
import { FormValidationState } from '../../../../../core/utils/form-validation-state';
import {
  ChangeGenderToBoolean,
  FormatDateForInput,
  formatPhoneNumberInput,
  preventNonNumericInput,
  yemeniPhoneNumberValidator,
} from '../../../../../core/utils/person.validators';
import { AddressSelectComponent } from '../../../../../shared/components/address-select/address-select.component';
import { CreatePatientRequest } from '../../models/create-patient.request';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, AddressSelectComponent],
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.css',
})
export class PatientFormComponent implements OnChanges, OnInit {
  patient = input.required<PatientDto | null>();
  close = output();
  save = output<CreatePatientRequest>();
  mode = input.required<boolean>();
  maxDate = new Date().toISOString().split('T')[0];

  private facade = inject(PatientsFacade);
  private fb = inject(FormBuilder);
  private env = inject(EnvironmentInjector);

  form!: FormGroup;
  private validationState!: FormValidationState;
  addressName = signal<string>('');
  preventNonNumericInput = preventNonNumericInput;
  formatPhoneNumberInput = formatPhoneNumberInput;
  //  for caching  form data an  refresh page
  private cache = inject(CacheService); // 10 minutes expiration
  private DRAFT_KEY = CACHE_KEYS.PATIENT_FORM_DRAFT;
  ngOnInit(): void {
    this.form = this.fb.group({
      fullname: ['', Validators.required],
      gender: [true, Validators.required],
      birthdate: [null, Validators.required],
      phone: [
        '',
        [
          Validators.required,
          Validators.maxLength(9),
          yemeniPhoneNumberValidator(),
        ],
      ],
      addressId: [null, Validators.required],
      nationalNo: [''],
      patientType: ['Disabled', Validators.required],
    });
    // Load draft data if available
    const draft = this.cache.get(this.DRAFT_KEY);
    if (draft) {
      this.form.patchValue(draft);
    }
    this.validationState = new FormValidationState(
      this.form,
      this.facade.formValidationErrors
    );

    runInInjectionContext(this.env, () => {
      effect(() => {
        this.validationState.apply();
      });
    });

    this.validationState.clearOnEdit();

    // Cache form data on value changes
    this.form.valueChanges
      .pipe(debounceTime(1)) // wait 0.5s after changes
      .subscribe((value) => {
        this.cache.set(this.DRAFT_KEY, value);
      });
  }
  getControl(name: string): AbstractControl | null {
    return this.form.get(name);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patient'] && this.patient() && this.form) {
      const p = this.patient() as PatientDto;
      this.addressName.set(p.personDto?.address ?? '');

      this.form.patchValue({
        fullname: p.personDto?.fullname ?? '',
        gender: ChangeGenderToBoolean(p.personDto?.gender),
        birthdate: FormatDateForInput(p.personDto?.birthdate),
        phone: p.personDto?.phone ?? '',
        addressId: p.personDto?.addressId,
        nationalNo: p.personDto?.nationalNo ?? '',
        patientType: PatientType.Normal,
      });
    }
  }

  onSave() {
    if (this.form.valid) {
      const dto = { ...this.form.value };

      if (dto.birthdate === '') {
        dto.birthdate = null;
      }

      this.save.emit(dto);
      // 🔹 Clear cache on successful save
      this.cache.clear(this.DRAFT_KEY);
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

  onClose() {
    // 🔹 Clear draft when user cancels form
    this.cache.clear(this.DRAFT_KEY);
    this.close.emit();
  }
}
