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

import { Subscription } from 'rxjs';

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
export class AddTherapyDiagnosisFormComponent implements OnChanges, OnDestroy {
  private fb = inject(FormBuilder);
  private facade = inject(TherapyDiagnosisFacade);
  private env = inject(EnvironmentInjector);

  @Input() ticketId!: number;

  @Input() injuryReasons: InjuryDto[] = [];
  @Input() injurySides: InjuryDto[] = [];
  @Input() injuryTypes: InjuryDto[] = [];

  @Input() medicalPrograms: MedicalProgramDto[] = [];

  // @Input() editMode: boolean = false;
  editMode = input<boolean>(false);

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

  form: FormGroup = this.fb.group(
    {
      diagnosisText: ['', [Validators.required, Validators.maxLength(1000)]],
      injuryDate: ['', Validators.required],

      injuryReasons: [[] as number[], Validators.required],
      injurySides: [[] as number[], Validators.required],
      injuryTypes: [[] as number[], Validators.required],

      programStartDate: ['', Validators.required],
      programEndDate: ['', Validators.required],
      // programEndDate: [{ value: '', disabled: true }], // ⬅️ read-only

      numberOfSessions: [
        { value: null }, // ⬅️ disabled initially
        Validators.required,
      ],

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

  private validationState!: FormValidationState;

  // map to keep subscriptions for each program row so we can clean them up
  private rowSubs = new Map<AbstractControl, Subscription>();

  // attach a listener to a program row so when the user types/selects in the last row
  // a new empty row is automatically appended
  private attachAutoAddToRow(group: FormGroup) {
    // avoid attaching twice
    if (this.rowSubs.has(group)) return;

    const sub = group.valueChanges.subscribe((val) => {
      const hasData =
        (val && val.medicalProgramId != null && val.medicalProgramId !== '') ||
        (val && val.duration != null && val.duration !== '') ||
        (val && val.notes && String(val.notes).trim() !== '');

      const lastIndex = this.programs.length - 1;
      const isLast = this.programs.at(lastIndex) === group;

      if (hasData && isLast) {
        this.addProgramRow();
      }
    });

    this.rowSubs.set(group, sub);
  }

  // ngOnInit(): void {
  //   this.validationState = new FormValidationState(
  //     this.form,
  //     this.facade.formValidationErrors
  //   );

  //   runInInjectionContext(this.env, () => {
  //     effect(() => {
  //       this.validationState.apply();
  //     });
  //   });

  //   this.validationState.clearOnEdit();

  //   if (!this.editMode()) {
  //     this.addProgramRow();
  //   }
  // }
  ngOnInit(): void {
    // الموجود عندك
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
      this.addProgramRow();
    }

    // ===============================
    // 🔹 NEW LOGIC
    // ===============================
    this.form.get('programStartDate')?.valueChanges.subscribe((startDate) => {
      const sessionsCtrl = this.form.get('numberOfSessions');

      if (startDate) {
        sessionsCtrl?.enable();
      } else {
        sessionsCtrl?.disable();
        sessionsCtrl?.reset();
        this.form.get('programEndDate')?.reset();
      }
    });

    this.form.get('numberOfSessions')?.valueChanges.subscribe(() => {
      this.updateProgramEndDate();
    });

    this.form.get('programStartDate')?.valueChanges.subscribe(() => {
      this.updateProgramEndDate();
    });
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
  private toDateOnly(value: string | null | undefined): string | null {
    if (!value) return null;
    return value.split('T')[0]; // "2025-12-01T00:00:00" → "2025-12-01"
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

  // private patchEditForm(card: TherapyCardDiagnosisDto) {
  //   this.form.patchValue({
  //     diagnosisText: card.diagnosisId,
  //     injuryDate: card.injuryDate,
  //     injuryReasons: card.injuryReasons.map((x) => x.id),
  //     injurySides: card.injurySides.map((x) => x.id),
  //     injuryTypes: card.injuryTypes.map((x) => x.id),
  //     programStartDate: card.programStartDate,
  //     programEndDate: card.programEndDate,

  //     therapyCardType: this.mapArabicTypeToEnum(card.therapyCardType),
  //     notes: card.notes ?? '',
  //   });

  //   this.programs.clear();

  //   (card.programs ?? []).forEach((p) => {
  //     this.programs.push(
  //       this.fb.group({
  //         medicalProgramId: [p.medicalProgramId, Validators.required],
  //         duration: [p.duration, Validators.required],
  //         notes: [p.notes ?? ''],
  //       })
  //     );
  //   });
  // }

  // --------------------------
  // Validators
  // --------------------------

  private patchEditForm(card: TherapyCardDiagnosisDto) {
    this.form.patchValue({
      diagnosisText: card.diagnosisText, // FIXED

      injuryDate: this.formatDate(card.injuryDate), // FIXED
      injuryReasons: card.injuryReasons.map((x) => x.id),
      injurySides: card.injurySides.map((x) => x.id),
      injuryTypes: card.injuryTypes.map((x) => x.id),

      programStartDate: this.formatDate(card.programStartDate), // FIXED
      programEndDate: this.formatDate(card.programEndDate), // FIXED
      numberOfSessions: (card as any).numberOfSessions ?? null, // ✅ NEW

      therapyCardType: this.mapArabicTypeToEnum(card.therapyCardType),
      notes: card.notes ?? '',
    });
    // clear existing controls and subscriptions
    this.programs.clear();
    this.rowSubs.forEach((s) => s.unsubscribe());
    this.rowSubs.clear();

    // populate existing programs and attach auto-add listener to each
    (card.programs ?? []).forEach((p) => {
      const g = this.fb.group({
        medicalProgramId: [p.medicalProgramId, Validators.required],
        duration: [p.duration, Validators.required],
        notes: [p.notes ?? ''],
      });

      this.programs.push(g);
      this.attachAutoAddToRow(g);
    });

    // always ensure there's an empty row at the end for new entry
    this.addProgramRow();
  }

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
    const group = this.createProgramRow();
    this.programs.push(group);
    this.attachAutoAddToRow(group);
  }

  removeProgramRow(i: number) {
    const ctrl = this.programs.at(i);
    if (ctrl) {
      const sub = this.rowSubs.get(ctrl);
      if (sub) {
        sub.unsubscribe();
        this.rowSubs.delete(ctrl);
      }
    }

    this.programs.removeAt(i);
  }

  // --------------------------
  // Submit
  // --------------------------
  onSubmit() {
    // remove trailing empty row(s) before validation/submission
    this.pruneEmptyRows();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;

    if (this.editMode()) {
      const dto: UpdateTherapyCardRequest = {
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
        numberOfSessions: v.numberOfSessions,
        TherapyCardType: v.therapyCardType,
        Programs: v.programs,
        Notes: v.notes ?? null,
      };

      this.submitForm.emit(dto);
    }
  }

  private updateProgramEndDate() {
    const start = this.form.get('programStartDate')?.value;
    const sessions = this.form.get('numberOfSessions')?.value;

    if (!start || !sessions || sessions <= 0) {
      this.form.get('programEndDate')?.reset();
      return;
    }

    const startDate = new Date(start);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + Number(sessions));

    const iso = endDate.toISOString().split('T')[0];
    this.form.get('programEndDate')?.setValue(iso, { emitEvent: false });
  }
  isSpecialCardType(): boolean {
    const v = this.form.get('therapyCardType')?.value;
    return Number(v) === TherapyCardType.Special;
  }

  // return true when a program row has no meaningful data
  private isProgramRowEmpty(group: AbstractControl): boolean {
    const med = group.get('medicalProgramId')?.value;
    const dur = group.get('duration')?.value;
    const notes = group.get('notes')?.value;

    const medEmpty = med == null || med === '';
    const durEmpty = dur == null || dur === '';
    const notesEmpty = notes == null || String(notes).trim() === '';

    return medEmpty && durEmpty && notesEmpty;
  }

  // remove empty rows (including the automatic last empty row) before submit
  private pruneEmptyRows() {
    for (let i = this.programs.length - 1; i >= 0; i--) {
      const ctrl = this.programs.at(i);
      if (!ctrl) continue;

      if (this.isProgramRowEmpty(ctrl)) {
        const sub = this.rowSubs.get(ctrl);
        if (sub) {
          sub.unsubscribe();
          this.rowSubs.delete(ctrl);
        }
        this.programs.removeAt(i);
      }
    }
  }

  ngOnDestroy(): void {
    this.rowSubs.forEach((s) => s.unsubscribe());
    this.rowSubs.clear();
  }


}
