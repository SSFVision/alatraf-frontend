import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  MultiSelectOption,
  MultiSelectComponent,
} from '../../../../../shared/components/multi-select/multi-select.component';
import {
  CreateTherapyCardRequest,
  CreateTherapyCardMedicalProgramRequest,
} from '../../Models/create-therapy-card.request';
import {
  THERAPY_CARD_TYPE_OPTIONS,
  INJURY_REASONS,
  INJURY_SIDES,
  INJURY_TYPES,
  MEDICAL_PROGRAMS_MOCK,
} from '../../Models/medical-program.dto';
import { PatientDto } from '../../../../../core/models/Shared/patient.model';

@Component({
  selector: 'app-add-therapy-diagnosis-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MultiSelectComponent],
  templateUrl: './add-therapy-diagnosis-form.component.html',
  styleUrl: './add-therapy-diagnosis-form.component.css',
})
export class AddTherapyDiagnosisFormComponent {
  @Input() patient: PatientDto | null = null; // must contain ticketId + id
  @Output() submitForm = new EventEmitter<CreateTherapyCardRequest>();

  private fb = inject(FormBuilder);

  injuryReasonsOptions: MultiSelectOption[] = [];
  injurySidesOptions: MultiSelectOption[] = [];
  injuryTypesOptions: MultiSelectOption[] = [];
  programDropdown: { label: string; value: number }[] = [];
  therapyTypes = THERAPY_CARD_TYPE_OPTIONS;

  form: FormGroup = this.fb.group(
    {
      DiagnosisText: ['', [Validators.required, Validators.maxLength(1000)]],

      InjuryDate: ['', Validators.required],

      InjuryReasons: [[], Validators.required],
      InjurySides: [[], Validators.required],
      InjuryTypes: [[], Validators.required],

      ProgramStartDate: ['', Validators.required],
      ProgramEndDate: ['', Validators.required],

      TherapyCardType: [null, Validators.required],
      Notes: [''],

      Programs: this.fb.array<FormGroup>([], {
        validators: [this.noDuplicateProgramsValidator.bind(this)],
      }),
    },
    { validators: [this.dateRangeValidator] }
  );
  get programs(): FormArray<FormGroup> {
    return this.form.get('Programs') as FormArray<FormGroup>;
  }

  private createProgramRow(): FormGroup {
    return this.fb.group({
      MedicalProgramId: [null, [Validators.required, Validators.min(1)]],
      Duration: [null, [Validators.required, Validators.min(1)]],
      Notes: [''],
    });
  }

  addProgramRow() {
    this.programs.push(this.createProgramRow());
  }

  removeProgramRow(i: number) {
    this.programs.removeAt(i);
  }

  dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const start = control.get('ProgramStartDate')?.value;
    const end = control.get('ProgramEndDate')?.value;

    if (!start || !end) return null;

    return new Date(start) >= new Date(end) ? { dateRange: true } : null;
  }
  FrontendError(field: string): boolean {
    const control = this.form.get(field);
    if (!control) return false;
    return control.invalid && control.touched;
  }

  private noDuplicateProgramsValidator(control: AbstractControl): any {
    const formArray = control as FormArray;

    const ids = formArray.controls
      .map((c) => c.get('MedicalProgramId')?.value)
      .filter((v) => v != null && v !== '');

    const hasDuplicate = new Set(ids).size !== ids.length;

    return hasDuplicate ? { duplicateProgram: true } : null;
  }

  // --------------------------
  // SUBMIT
  // --------------------------
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const f = this.form.value;

    const dto: CreateTherapyCardRequest = {
      TicketId: this.patient!.patientId,
      PatientId: this.patient!.patientId,

      Notes: f.Notes ?? null,
      DiagnosisText: f.DiagnosisText,
      InjuryDate: f.InjuryDate,

      InjuryReasons: f.InjuryReasons,
      InjurySides: f.InjurySides,
      InjuryTypes: f.InjuryTypes,

      ProgramStartDate: f.ProgramStartDate,
      ProgramEndDate: f.ProgramEndDate,

      TherapyCardType: f.TherapyCardType,

      Programs: f.Programs.map((p: CreateTherapyCardMedicalProgramRequest) => ({
        MedicalProgramId: p.MedicalProgramId,
        Duration: p.Duration,
        Notes: p.Notes ?? null,
      })),
    };

    this.submitForm.emit(dto);
  }

  // --------------------------
  // INIT
  // --------------------------
  ngOnInit() {
    this.injuryReasonsOptions = INJURY_REASONS.map((r) => ({
      label: r.Name,
      value: r.Id,
    }));
    this.injurySidesOptions = INJURY_SIDES.map((s) => ({
      label: s.Name,
      value: s.Id,
    }));
    this.injuryTypesOptions = INJURY_TYPES.map((t) => ({
      label: t.Name,
      value: t.Id,
    }));

    this.programDropdown = MEDICAL_PROGRAMS_MOCK.map((p) => ({
      label: p.Name,
      value: p.Id,
    }));

    this.addProgramRow(); // add first row
  }
}
