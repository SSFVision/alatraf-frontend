import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  EnvironmentInjector,
  inject,
  input,
  output,
  runInInjectionContext,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormValidationState } from '../../../../../core/utils/form-validation-state';
import {
  ChangeGenderToBoolean,
  FormatDateForInput,
  formatPhoneNumberInput,
  preventNonNumericInput,
  yemeniPhoneNumberValidator,
} from '../../../../../core/utils/person.validators';
import { DepartmentDto } from '../../../Departments/Models/department.dto';
import { CreateDoctorRequest } from '../../Models/create-doctor.request';
import { DoctorDto } from '../../Models/doctor.dto';
import { UpdateDoctorRequest } from '../../Models/update-doctor.request';
import { DoctorFacade } from './../../Service/doctor.facade.service';

@Component({
  selector: 'app-add-edit-doctor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-edit-doctor-form.component.html',
  styleUrl: './add-edit-doctor-form.component.css',
})
export class AddEditDoctorFormComponent {
  private fb = inject(FormBuilder);
  private env = inject(EnvironmentInjector);

  isEditMode = input<boolean>(false);
  selectedDoctor = input<DoctorDto | null>(null);
  departments = input<DepartmentDto[]>([]);
  validationErrors = input<Record<string, string[]>>({});
  isSaving = input<boolean>(false);
  save = output<CreateDoctorRequest | UpdateDoctorRequest>();
  delete = output<DoctorDto>();

  form!: FormGroup;
  private validationState!: FormValidationState;
  preventNonNumericInput = preventNonNumericInput;
  formatPhoneNumberInput = formatPhoneNumberInput;

  private doctorFacade = inject(DoctorFacade);

  ngOnInit(): void {
    this.initForm();
    this.validationState = new FormValidationState(
      this.form,
      this.doctorFacade.formValidationErrors
    );

    runInInjectionContext(this.env, () => {
      effect(() => {
        const doctor = this.selectedDoctor();
        if (this.isEditMode() && doctor) {
          this.populateForm(doctor);
        }
        //  else {
        //   // this.initForm();
        //   this.form.reset();
        // }
      });

      effect(() => {
        this.validationState.apply();
      });
    });

    this.validationState.clearOnEdit();
  }
  private initForm(): void {
    this.form = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(3)]],
      nationalNo: ['', [Validators.required]],
      phone: [
        '',
        [
          Validators.required,
          Validators.maxLength(9),
          yemeniPhoneNumberValidator(),
        ],
      ],
      birthdate: [null, [Validators.required]],

      address: ['', [Validators.required]],
      gender: [true, [Validators.required]],
      specialization: ['', [Validators.required]],
      departmentId: [null, [Validators.required]],
    });
  }
  private populateForm(doctor: DoctorDto): void {
    const formData = {
      fullname: doctor.personDto?.fullname,
      nationalNo: doctor.personDto?.nationalNo,
      phone: doctor.personDto?.phone,
      birthdate: FormatDateForInput(doctor.personDto?.birthdate),
      address: doctor.personDto?.address,
      gender: ChangeGenderToBoolean(doctor.personDto?.gender) ?? false,
      specialization: doctor.specialization,
      departmentId: doctor.departmentId,
    };

    this.form.patchValue(formData, { emitEvent: false });

    this.form.markAsPristine();
    this.form.markAsUntouched();
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

  getControl(name: string): AbstractControl | null {
    return this.form.get(name);
  }

  submit(): void {
    const dto = { ...this.form.value };

    if (dto.birthdate === '') {
      dto.birthdate = null;
    }
    if (this.form.valid) {
      this.save.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onDeleteDoctor() {
    const doctor = this.selectedDoctor();
    if (doctor !== null) this.delete.emit(doctor);
  }
}
