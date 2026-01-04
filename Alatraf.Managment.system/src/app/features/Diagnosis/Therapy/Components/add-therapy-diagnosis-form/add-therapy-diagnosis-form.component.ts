import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  inject,
  EnvironmentInjector,
  effect,
  runInInjectionContext,
  input,
  signal,
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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-therapy-diagnosis-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MultiSelectComponent, NgIf],
  templateUrl: './add-therapy-diagnosis-form.component.html',
  styleUrl: './add-therapy-diagnosis-form.component.css',
})
export class AddTherapyDiagnosisFormComponent implements OnChanges, OnDestroy {
  private fb = inject(FormBuilder);
  private facade = inject(TherapyDiagnosisFacade);
  private env = inject(EnvironmentInjector);

  @Input() ticketId!: number;
  @Input() injuryReasons: InjuryDto[] = [];
  @Input() injurySides: InjuryDto[] = [];
  @Input() injuryTypes: InjuryDto[] = [];
  @Input() medicalPrograms: MedicalProgramDto[] = [];
  @Input() existingTherapyCard: TherapyCardDiagnosisDto | null = null;
  editMode = input<boolean>(false);
  @Output() submitForm = new EventEmitter<
    CreateTherapyCardRequest | UpdateTherapyCardRequest
  >();

  today = new Date().toISOString().split('T')[0];
  injuryReasonsOptions: MultiSelectOption[] = [];
  injurySidesOptions: MultiSelectOption[] = [];
  injuryTypesOptions: MultiSelectOption[] = [];
  programDropdown: { label: string; value: number }[] = [];
  therapyTypes = [
    { label: 'عام', value: TherapyCardType.General },
    { label: 'خاص', value: TherapyCardType.Special },
    { label: 'أعصاب أطفال', value: TherapyCardType.NerveKids },
  ];

  form: FormGroup = this.fb.group(
    {
      diagnosisText: ['', [Validators.required, Validators.maxLength(1000)]],
      injuryDate: [
        '',
        [
          Validators.required,
          AddTherapyDiagnosisFormComponent.noFutureDatesValidator,
        ],
      ],
      injuryReasons: [[] as number[], Validators.required],
      injurySides: [[] as number[], Validators.required],
      injuryTypes: [[] as number[], Validators.required],
      programStartDate: [
        '',
        [
          Validators.required,
          AddTherapyDiagnosisFormComponent.noPastDatesValidator,
        ],
      ],
      programEndDate: [{ value: '', disabled: true }],
      numberOfSessions: [{ value: null, disabled: true }, Validators.required],
      therapyCardType: [TherapyCardType.General, Validators.required],
      notes: [''],
      programs: this.fb.array<FormGroup>([], {
        validators: [
          AddTherapyDiagnosisFormComponent.noDuplicateProgramsValidator,
          AddTherapyDiagnosisFormComponent.atLeastOneProgramValidator,
        ],
      }),
    },
    { validators: [AddTherapyDiagnosisFormComponent.dateRangeValidator] }
  );

  private destroy$ = new Subject<void>();
  private validationState!: FormValidationState;
  submitting = signal(false);

  ngOnInit(): void {
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
    if (!this.editMode()) {
      this.form.patchValue({ programStartDate: this.today });
      this.form.get('numberOfSessions')?.enable({ emitEvent: false });
      this.addProgramRow();
    }
    this.setupFormSubscriptions();
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

    if (this.editMode() && this.existingTherapyCard) {
      this.patchEditForm(this.existingTherapyCard);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get programs(): FormArray<FormGroup> {
    return this.form.get('programs') as FormArray<FormGroup>;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const request = this.editMode()
      ? this.createUpdateDto(v)
      : this.createCreateDto(v);
    // disable the form immediately to prevent duplicate submits
    this.startSubmitting();
    this.submitForm.emit(request);
  }

  startSubmitting() {
    this.submitting.set(true);
    try {
      this.form.disable({ emitEvent: false });
    } catch {
      /* ignore */
    }
  }

  stopSubmitting() {
    this.submitting.set(false);
    try {
      this.form.enable({ emitEvent: false });
    } catch {
      /* ignore */
    }
  }

  isSpecialCardType(): boolean {
    const v = this.form.get('therapyCardType')?.value;
    return Number(v) === TherapyCardType.Special;
  }

  getBackendError(field: string): string | null {
    return this.validationState.getBackendError(field);
  }

  hasBackendError(field: string): boolean {
    return this.validationState.hasBackendError(field);
  }

  getFrontendErrorMessage(field: string): string | null {
    const control = this.form.get(field);
    if (control && control.invalid && control.touched) {
      if (control.hasError('required')) {
        return 'هذا الحقل مطلوب';
      }
      if (control.hasError('pastDate')) {
        return 'لا يمكن اختيار تاريخ في الماضي';
      }
      if (control.hasError('futureDate')) {
        return 'لا يمكن أن يكون تاريخ الإصابة في المستقبل';
      }
      if (control.hasError('maxlength')) {
        return `الحد الأقصى ${control.errors!['maxlength'].requiredLength} حرف`;
      }
      if (control.hasError('min')) {
        return `الرقم يجب أن يكون أكبر من ${control.errors!['min'].min}`;
      }
      return 'قيمة غير صالحة';
    }
    return null;
  }

  addProgramRow() {
    this.programs.push(this.createProgramRow(false));
  }

  removeProgramRow(i: number) {
    this.programs.removeAt(i);
  }

  private setupFormSubscriptions(): void {
    this.form
      .get('programStartDate')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((startDate) => {
        const sessionsCtrl = this.form.get('numberOfSessions');
        const isValidDate = startDate && !isNaN(new Date(startDate).getTime());
        if (isValidDate) {
          sessionsCtrl?.enable({ emitEvent: false });
        } else {
          sessionsCtrl?.disable({ emitEvent: false });
          sessionsCtrl?.reset(null, { emitEvent: false });
        }
        this.updateProgramEndDate();
      });

    this.form
      .get('numberOfSessions')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateProgramEndDate();
      });

    // Auto-add a new program row when the last row's required fields are filled
    this.programs.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const len = this.programs.length;
      if (len === 0) return;
      const last = this.programs.at(len - 1);
      const med = last.get('medicalProgramId')?.value;
      const dur = last.get('duration')?.value;

      const lastIsValid =
        !!med && !!dur && !isNaN(Number(dur)) && Number(dur) > 0;

      if (lastIsValid) {
        // attach validators to the completed row so it's validated as part of the form
        this.ensureRowValidators(last as FormGroup);
        // append a new empty row without validators
        this.addProgramRow();
      }
    });
  }

  private updateProgramEndDate(): void {
    const start = this.form.get('programStartDate')?.value;
    const sessions = this.form.get('numberOfSessions')?.value;
    const endDateCtrl = this.form.get('programEndDate');

    const startDate = new Date(start);
    if (isNaN(startDate.getTime()) || !sessions || sessions <= 0) {
      endDateCtrl?.reset('', { emitEvent: false });
      return;
    }
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + Number(sessions));
    endDateCtrl?.setValue(endDate.toISOString().split('T')[0], {
      emitEvent: false,
    });
  }

  private createProgramRow(withValidators = true): FormGroup {
    return this.fb.group({
      medicalProgramId: [null, withValidators ? Validators.required : []],
      duration: [
        null,
        withValidators ? [Validators.required, Validators.min(1)] : [],
      ],
      notes: [''],
    });
  }

  private ensureRowValidators(row: FormGroup) {
    const med = row.get('medicalProgramId');
    const dur = row.get('duration');
    med?.setValidators(Validators.required);
    dur?.setValidators([Validators.required, Validators.min(1)]);
    med?.updateValueAndValidity({ emitEvent: false });
    dur?.updateValueAndValidity({ emitEvent: false });
  }

  private patchEditForm(card: TherapyCardDiagnosisDto) {
    this.form.patchValue({
      diagnosisText: card.diagnosisText,
      injuryDate: this.formatDate(card.injuryDate),
      injuryReasons: card.injuryReasons.map((x) => x.id),
      injurySides: card.injurySides.map((x) => x.id),
      injuryTypes: card.injuryTypes.map((x) => x.id),
      programStartDate: this.formatDate(card.programStartDate),
      programEndDate: this.formatDate(card.programEndDate),
      numberOfSessions: (card as any).numberOfSessions ?? null,
      therapyCardType: this.mapArabicTypeToEnum(card.therapyCardType),
      notes: card.notes ?? '',
    });

    this.form.get('numberOfSessions')?.enable();
    this.form.get('programEndDate')?.enable();

    this.programs.clear();
    (card.programs ?? []).forEach((p) => {
      this.programs.push(
        this.fb.group({
          medicalProgramId: [p.medicalProgramId, Validators.required],
          duration: [p.duration, Validators.required],
          notes: [p.notes ?? ''],
        })
      );
    });
  }

  private createCreateDto(v: any): CreateTherapyCardRequest {
    const programs = (v.programs || []).filter(
      (p: any) => p && p.medicalProgramId != null && p.duration != null
    );

    return {
      TicketId: this.ticketId,
      DiagnosisText: v.diagnosisText,
      InjuryDate: v.injuryDate,
      InjuryReasons: v.injuryReasons,
      InjurySides: v.injurySides,
      InjuryTypes: v.injuryTypes,
      ProgramStartDate: v.programStartDate,
      ProgramEndDate: v.programEndDate,
      numberOfSessions: v.numberOfSessions,
      TherapyCardType: v.therapyCardType,
      Programs: programs,
      Notes: v.notes ?? null,
    };
  }
  private createUpdateDto(v: any): UpdateTherapyCardRequest {
    const programs = (v.programs || []).filter(
      (p: any) => p && p.medicalProgramId != null && p.duration != null
    );

    return {
      TicketId: this.ticketId,
      DiagnosisText: v.diagnosisText,
      InjuryDate: v.injuryDate,
      InjuryReasons: v.injuryReasons,
      InjurySides: v.injurySides,
      InjuryTypes: v.injuryTypes,
      ProgramStartDate: v.programStartDate,
      ProgramEndDate: v.programEndDate,
      numberOfSessions: v.numberOfSessions,
      TherapyCardType: v.therapyCardType,
      Programs: programs,
      Notes: v.notes ?? null,
    };
  }

  private formatDate(date: string | null | undefined): string | null {
    if (!date) return null;
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
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

  private static dateRangeValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const start = control.get('programStartDate')?.value;
    const end = control.get('programEndDate')?.value;
    if (!start || !end) return null;
    return new Date(start) >= new Date(end) ? { dateRange: true } : null;
  }

  private static noDuplicateProgramsValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const formArray = control as FormArray;
    const ids = formArray.controls
      .map((c) => c.get('medicalProgramId')?.value)
      .filter((v) => v != null && v !== '');
    const hasDuplicate = new Set(ids).size !== ids.length;
    return hasDuplicate ? { duplicateProgram: true } : null;
  }

  private static atLeastOneProgramValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const formArray = control as FormArray;
    const hasOne = formArray.controls.some((c) => {
      const med = c.get('medicalProgramId')?.value;
      const dur = c.get('duration')?.value;
      return med != null && med !== '' && dur != null && dur !== '';
    });
    return hasOne ? null : { atLeastOneProgram: true };
  }

  private static noFutureDatesValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    if (isNaN(selectedDate.getTime())) {
      return null;
    }
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (selectedDate.getTime() > today.getTime()) {
      return { futureDate: true };
    }
    return null;
  }

  private static noPastDatesValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    if (isNaN(selectedDate.getTime())) {
      return null;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate.getTime() < today.getTime()) {
      return { pastDate: true };
    }
    return null;
  }
}
