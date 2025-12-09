import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  inject,
  EnvironmentInjector,
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

import { NgIf, CommonModule } from '@angular/common';

import {
  MultiSelectComponent,
  MultiSelectOption,
} from '../../../../../shared/components/multi-select/multi-select.component';

import {
  CreateTherapyCardRequest,
  TherapyCardType,
} from '../../Models/create-therapy-card.request';

import { UpdateTherapyCardRequest } from '../../Models/update-therapy-card.request';
import { TherapyCardDiagnosisDto } from '../../Models/therapy-card-diagnosis.dto';
import { MedicalProgramDto } from '../../Models/medical-program.dto';

import { FormValidationState } from '../../../../../core/utils/form-validation-state';
import { InjuryDto } from '../../../Shared/Models/injury.dto';
import { TherapyDiagnosisFacade } from '../../Services/therapy-diagnosis.facade.Service';

@Component({
  selector: 'app-add-therapy-diagnosis-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MultiSelectComponent, NgIf],
  templateUrl: './add-therapy-diagnosis-form.component.html',
  styleUrl: './add-therapy-diagnosis-form.component.css',
})
export class AddTherapyDiagnosisFormComponent implements OnChanges {
  private fb = inject(FormBuilder);
  private facade = inject(TherapyDiagnosisFacade);
  private env = inject(EnvironmentInjector);

  // --------------------------
  // Inputs
  // --------------------------
  @Input() ticketId!: number;

  @Input() injuryReasons: InjuryDto[] = [];
  @Input() injurySides: InjuryDto[] = [];
  @Input() injuryTypes: InjuryDto[] = [];

  @Input() medicalPrograms: MedicalProgramDto[] = [];

  @Input() editMode: boolean = false;
  @Input() existingTherapyCard: TherapyCardDiagnosisDto | null = null;

  @Output() submitForm = new EventEmitter<
    CreateTherapyCardRequest | UpdateTherapyCardRequest
  >();

  // --------------------------
  // Options
  // --------------------------
  injuryReasonsOptions: MultiSelectOption[] = [];
  injurySidesOptions: MultiSelectOption[] = [];
  injuryTypesOptions: MultiSelectOption[] = [];
  programDropdown: { label: string; value: number }[] = [];

  // Backend already returns Arabic strings → we use those directly
  therapyTypes = [
    { label: 'عام', value: 'عام' },
    { label: 'خاص', value: 'خاص' },
    { label: 'أعصاب أطفال', value: 'أعصاب أطفال' },
  ];

  // --------------------------
  // Form
  // --------------------------
  form: FormGroup = this.fb.group(
    {
      DiagnosisText: ['', [Validators.required, Validators.maxLength(1000)]],
      InjuryDate: ['', Validators.required],

      InjuryReasons: [[], ],
      InjurySides: [[], ],
      InjuryTypes: [[], ],

      ProgramStartDate: ['', Validators.required],
      ProgramEndDate: ['', Validators.required],

      TherapyCardType: [TherapyCardType.General], // Arabic string
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
      MedicalProgramId: [null, [, Validators.min(1)]],
      Duration: [null, [Validators.required, Validators.min(1)]],
      Notes: [''],
    });
  }
  // --------------------------
  // Backend Validation Handler
  // --------------------------
  private validationState!: FormValidationState;

  ngOnInit(): void {
    this.validationState = new FormValidationState(
      this.form,
      this.facade.formValidationErrors
    );

    // Delay to ensure form exists
    Promise.resolve().then(() => {
      this.validationState.apply();
      this.validationState.clearOnEdit();
    });
  }

  // --------------------------
  // Input Changes
  // --------------------------
  ngOnChanges(changes: SimpleChanges): void {
    this.injuryReasonsOptions = this.injuryReasons.map((r) => ({
      label: r.Name,
      value: r.Id,
    }));

    this.injurySidesOptions = this.injurySides.map((s) => ({
      label: s.Name,
      value: s.Id,
    }));

    this.injuryTypesOptions = this.injuryTypes.map((t) => ({
      label: t.Name,
      value: t.Id,
    }));

    this.programDropdown = this.medicalPrograms.map((p) => ({
      label: p.Name,
      value: p.Id,
    }));

    if (this.editMode && this.existingTherapyCard) {
      this.patchEditForm(this.existingTherapyCard);
    }
  }

  // --------------------------
  // Patch Form (Edit Mode)
  // --------------------------
  private patchEditForm(card: TherapyCardDiagnosisDto) {
    this.form.patchValue({
      DiagnosisText: card.DiagnosisText,
      InjuryDate: card.InjuryDate,
      InjuryReasons: card.InjuryReasons.map((x) => x.Id),
      InjurySides: card.InjurySides.map((x) => x.Id),
      InjuryTypes: card.InjuryTypes.map((x) => x.Id),
      ProgramStartDate: card.ProgramStartDate,
      ProgramEndDate: card.ProgramEndDate,

      // 🔥 FIX: backend returns Arabic string (e.g., "عام")
      TherapyCardType: card.TherapyCardType,

      Notes: card.Notes ?? '',
    });

    this.programs.clear();

    (card.Programs ?? []).forEach((p) => {
      this.programs.push(
        this.fb.group({
          MedicalProgramId: [p.MedicalProgramId, Validators.required],
          Duration: [p.Duration, Validators.required],
          Notes: [p.Notes ?? ''],
        })
      );
    });
  }

  // --------------------------
  // Validators
  // --------------------------
  dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const start = control.get('ProgramStartDate')?.value;
    const end = control.get('ProgramEndDate')?.value;
    if (!start || !end) return null;
    return new Date(start) >= new Date(end) ? { dateRange: true } : null;
  }

  private noDuplicateProgramsValidator(control: AbstractControl): any {
    const formArray = control as FormArray;
    const ids = formArray.controls
      .map((c) => c.get('MedicalProgramId')?.value)
      .filter((v) => v != null && v !== '');

    const hasDuplicate = new Set(ids).size !== ids.length;
    return hasDuplicate ? { duplicateProgram: true } : null;
  }

  FrontendError(field: string): boolean {
    const c = this.form.get(field);
    return c ? c.invalid && c.touched : false;
  }

  getBackendError(field: string): string | null {
    return this.validationState.getBackendError(field.toLocaleLowerCase());
  }

  hasBackendError(field: string): boolean {
    return this.validationState.hasBackendError(field);
  }

  hasFrontendError(field: string): boolean {
    return this.validationState.hasFrontendError(field);
  }
    addProgramRow() {
    this.programs.push(this.createProgramRow());
  }

  removeProgramRow(i: number) {
    this.programs.removeAt(i);
  }

  // --------------------------
  // Submit
  // --------------------------
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;

    if (this.editMode) {
      const dto: UpdateTherapyCardRequest = {
        TicketId: this.ticketId,
        DiagnosisText: v.DiagnosisText,
        InjuryDate: v.InjuryDate,
        InjuryReasons: v.InjuryReasons,
        InjurySides: v.InjurySides,
        InjuryTypes: v.InjuryTypes,
        ProgramStartDate: v.ProgramStartDate,
        ProgramEndDate: v.ProgramEndDate,
        TherapyCardType: v.TherapyCardType,
        Programs: v.Programs,
        Notes: v.Notes ?? null,
      };

      this.submitForm.emit(dto);
    } else {
      const dto: CreateTherapyCardRequest = {
        TicketId: this.ticketId,
        DiagnosisText: v.DiagnosisText,
        InjuryDate: v.InjuryDate,
        InjuryReasons: v.InjuryReasons,
        InjurySides: v.InjurySides,
        InjuryTypes: v.InjuryTypes,
        ProgramStartDate: v.ProgramStartDate,
        ProgramEndDate: v.ProgramEndDate,
        TherapyCardType: v.TherapyCardType,
        Programs: v.Programs,
        Notes: v.Notes ?? null,
      };

      this.submitForm.emit(dto);
    }
  }
}
