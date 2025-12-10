import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  inject,
  EnvironmentInjector,
  effect,
  runInInjectionContext,
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
import { MedicalProgramDto } from '../../../../../core/models/medical-programs/medical-program.dto';

import { FormValidationState } from '../../../../../core/utils/form-validation-state';
import { InjuryDto } from '../../../../../core/models/injuries/injury.dto';
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

  therapyTypes = [
    { label: 'عام', value: TherapyCardType.General },
    { label: 'خاص', value: TherapyCardType.Special },
    { label: 'أعصاب أطفال', value: TherapyCardType.NerveKids },
  ];

  // --------------------------
  // Form (all controls in lowerCamelCase)
  // --------------------------
  form: FormGroup = this.fb.group(
    {
      diagnosisText: ['', [Validators.maxLength(1000)]],
      injuryDate: ['', Validators.required],

      injuryReasons: [[]],
      injurySides: [[]],
      injuryTypes: [[]],

      programStartDate: ['', Validators.required],
      programEndDate: ['', Validators.required],

      therapyCardType: [TherapyCardType.General, Validators.required],
      notes: [''],

      programs: this.fb.array<FormGroup>([], {
        validators: [this.noDuplicateProgramsValidator.bind(this)],
      }),
    },
    { validators: [this.dateRangeValidator] }
  );

  get programs(): FormArray<FormGroup> {
    return this.form.get('programs') as FormArray<FormGroup>;
  }

  private createProgramRow(): FormGroup {
    return this.fb.group({
      medicalProgramId: [null, Validators.required],
      duration: [null, [Validators.required, Validators.min(1)]],
      notes: [''],
    });
  }

  // --------------------------
  // Backend validation handler
  // --------------------------
  private validationState!: FormValidationState;

  ngOnInit(): void {
    this.validationState = new FormValidationState(
      this.form,
      this.facade.formValidationErrors
    );

    // ربط الـ signal بالـ form
    runInInjectionContext(this.env, () => {
      effect(() => {
        this.validationState.apply();
      });
    });

    this.validationState.clearOnEdit();

    if (!this.editMode) {
      this.addProgramRow();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.injuryReasonsOptions = this.injuryReasons.map((r) => ({
      label: r.name,
      value: r.id,
    }));

    this.injurySidesOptions = this.injurySides.map((s) => ({
      label: s.name,
      value: s.id,
    }));

    this.injuryTypesOptions = this.injuryTypes.map((t) => ({
      label: t.name,
      value: t.id,
    }));

    this.programDropdown = this.medicalPrograms.map((p) => ({
      label: p.name,
      value: p.id,
    }));

    if (this.editMode && this.existingTherapyCard) {
      this.patchEditForm(this.existingTherapyCard);
    }
  }

  private mapArabicTypeToEnum(arabic: string): TherapyCardType {
    switch (arabic) {
      case 'عام':
        return TherapyCardType.General;
      case 'خاص':
        return TherapyCardType.Special;
      case 'أعصاب أطفال':
        return TherapyCardType.NerveKids;
      default:
        return TherapyCardType.General;
    }
  }

  private patchEditForm(card: TherapyCardDiagnosisDto) {
    this.form.patchValue({
      diagnosisText: card.DiagnosisText,
      injuryDate: card.InjuryDate,
      injuryReasons: card.InjuryReasons.map((x) => x.id),
      injurySides: card.InjurySides.map((x) => x.id),
      injuryTypes: card.InjuryTypes.map((x) => x.id),
      programStartDate: card.ProgramStartDate,
      programEndDate: card.ProgramEndDate,

      therapyCardType: this.mapArabicTypeToEnum(card.TherapyCardType),
      notes: card.Notes ?? '',
    });

    this.programs.clear();

    (card.Programs ?? []).forEach((p) => {
      this.programs.push(
        this.fb.group({
          medicalProgramId: [p.MedicalProgramId, Validators.required],
          duration: [p.Duration, Validators.required],
          notes: [p.Notes ?? ''],
        })
      );
    });
  }

  // --------------------------
  // Validators
  // --------------------------
  dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const start = control.get('programStartDate')?.value;
    const end = control.get('programEndDate')?.value;
    if (!start || !end) return null;
    return new Date(start) >= new Date(end) ? { dateRange: true } : null;
  }

  private noDuplicateProgramsValidator(control: AbstractControl): any {
    const formArray = control as FormArray;
    const ids = formArray.controls
      .map((c) => c.get('medicalProgramId')?.value)
      .filter((v) => v != null && v !== '');

    const hasDuplicate = new Set(ids).size !== ids.length;
    return hasDuplicate ? { duplicateProgram: true } : null;
  }

  // --------------------------
  // Error helpers
  // --------------------------
  FrontendError(field: string): boolean {
    const c = this.form.get(field);
    return c ? c.invalid && c.touched : false;
  }

  getBackendError(field: string): string | null {
    return this.validationState.getBackendError(field);
  }

  hasBackendError(field: string): boolean {
    return this.validationState.hasBackendError(field);
  }

  hasFrontendError(field: string): boolean {
    return this.validationState.hasFrontendError(field);
  }

  // --------------------------
  // Programs table actions
  // --------------------------
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
        DiagnosisText: v.diagnosisText,
        InjuryDate: v.injuryDate,
        InjuryReasons: v.injuryReasons,
        InjurySides: v.injurySides,
        InjuryTypes: v.injuryTypes,
        ProgramStartDate: v.programStartDate,
        ProgramEndDate: v.programEndDate,
        TherapyCardType: v.therapyCardType,
        Programs: v.programs,
        Notes: v.notes ?? null,
      };

      this.submitForm.emit(dto);
    } else {
      const dto: CreateTherapyCardRequest = {
        TicketId: this.ticketId,
        DiagnosisText: v.diagnosisText,
        InjuryDate: v.injuryDate,
        InjuryReasons: v.injuryReasons,
        InjurySides: v.injurySides,
        InjuryTypes: v.injuryTypes,
        ProgramStartDate: v.programStartDate,
        ProgramEndDate: v.programEndDate,
        TherapyCardType: v.therapyCardType,
        Programs: v.programs,
        Notes: v.notes ?? null,
      };

      this.submitForm.emit(dto);
    }
  }
}
