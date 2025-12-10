import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  inject,
  effect,
  runInInjectionContext,
  EnvironmentInjector,
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';

import { CommonModule, NgIf } from '@angular/common';

import {
  MultiSelectComponent,
  MultiSelectOption,
} from '../../../../../shared/components/multi-select/multi-select.component';

import {
  CreateRepairCardRequest,
  RepairCardIndustrialPartRequest,
} from '../../Models/create-repair-card.request';

import {
  UpdateRepairCardRequest,
  UpdateRepairCardIndustrialPartRequest,
} from '../../Models/update-repair-card.request';

import { RepairCardDiagnosisDto } from '../../Models/repair-card-diagnosis.dto';
import { IndustrialPartDto } from '../../../../../core/models/industrial-parts/industrial-partdto';
import { InjuryDto } from '../../../../../core/models/injuries/injury.dto';
import { FormValidationState } from '../../../../../core/utils/form-validation-state';
import { RepairCardDiagnosisFacade } from '../../Services/repair-card-diagnosis.facade.service';

@Component({
  selector: 'app-add-industrial-diagnosis-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf,MultiSelectComponent],
  templateUrl: './add-industrial-diagnosis-form.component.html',
  styleUrl: './add-industrial-diagnosis-form.component.css',
})
export class AddIndustrialDiagnosisFormComponent implements OnChanges {
  private fb = inject(FormBuilder);
  private facade = inject(RepairCardDiagnosisFacade);
  private env = inject(EnvironmentInjector);

  // --------------------------
  // Inputs
  // --------------------------
  @Input() ticketId!: number;

  @Input() injuryReasons: InjuryDto[] = [];
  @Input() injurySides: InjuryDto[] = [];
  @Input() injuryTypes: InjuryDto[] = [];

  @Input() industrialParts: IndustrialPartDto[] = [];

  @Input() editMode: boolean = false;
  @Input() existingRepairCard: RepairCardDiagnosisDto | null = null;

  // --------------------------
  // Output
  // --------------------------
  @Output() submitForm = new EventEmitter<
    CreateRepairCardRequest | UpdateRepairCardRequest
  >();

  // --------------------------
  // Options
  // --------------------------
  injuryReasonsOptions: MultiSelectOption[] = [];
  injurySidesOptions: MultiSelectOption[] = [];
  injuryTypesOptions: MultiSelectOption[] = [];

  industrialPartsDropdown: { label: string; value: number }[] = [];

  // --------------------------
  // Form
  // --------------------------
  form: FormGroup = this.fb.group({
    diagnosisText: ['', [ Validators.maxLength(2000)]],
    injuryDate: ['', Validators.required],

    injuryReasons: [[] as number[]],
    injurySides: [[] as number[]],
    injuryTypes: [[] as number[]],

    notes: [''],

    industrialParts: this.fb.array<FormGroup>([], {
      validators: [this.noDuplicatePartsValidator.bind(this)],
    }),
  });

  // --------------------------
  // FormArray getter
  // --------------------------
  get industrialPartsForm(): FormArray<FormGroup> {
    return this.form.get('industrialParts') as FormArray<FormGroup>;
  }

  private createIndustrialPartRow(): FormGroup {
    return this.fb.group({
      industrialPartId: [null, Validators.required],
      unitId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
  }

  addPartRow() {
    this.industrialPartsForm.push(this.createIndustrialPartRow());
  }

  removePartRow(i: number) {
    this.industrialPartsForm.removeAt(i);
  }

  private validationState!: FormValidationState;

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


    // في وضع الإنشاء نضمن وجود صف واحد على الأقل
    if (!this.editMode) {
      this.addPartRow();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Map injuries to multi-select options
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

    // Industrial parts dropdown
    this.industrialPartsDropdown = this.industrialParts.map((p) => ({
      label: p.name,
      value: p.industrialPartId,
    }));

    // Patch form in edit mode
    if (this.editMode && this.existingRepairCard) {
      this.patchEditForm(this.existingRepairCard);
    }
  }

  // --------------------------
  // Patch Edit Form
  // --------------------------
  private patchEditForm(card: RepairCardDiagnosisDto) {
    this.form.patchValue({
      diagnosisText: card.diagnosisText,
      injuryDate: card.injuryDate,
      injuryReasons: (card.injuryReasons ?? []).map((x) => x.id),
      injurySides: (card.injurySides ?? []).map((x) => x.id),
      injuryTypes: (card.injuryTypes ?? []).map((x) => x.id),
      Notes:'empety not loadded from the backend ',
    });

    // Populate industrialParts rows
    this.industrialPartsForm.clear();

    (card.diagnosisIndustrialParts ?? []).forEach((p) => {
      this.industrialPartsForm.push(
        this.fb.group({
          industrialPartId: [p.industrialPartId, Validators.required],
          unitId: [p.unitId, Validators.required],
          quantity: [p.quantity, [Validators.required, Validators.min(1)]],
        })
      );
    });

    // لو ما في ولا صف من الـ backend نضيف واحد
    if (this.industrialPartsForm.length === 0) {
      this.addPartRow();
    }
  }

  // --------------------------
  // Validators
  // --------------------------
  private noDuplicatePartsValidator(control: AbstractControl): any {
    const formArray = control as FormArray;
    const pairs = formArray.controls
      .map((c) => {
        const partId = c.get('industrialPartId')?.value;
        const unitId = c.get('unitId')?.value;
        return partId && unitId ? `${partId}-${unitId}` : null;
      })
      .filter((v) => v != null);

    const hasDuplicate = new Set(pairs).size !== pairs.length;
    return hasDuplicate ? { duplicatePart: true } : null;
  }

  // --------------------------
  // Units options per row (Option A)
  // --------------------------
  getUnitsOptionsForRow(index: number): { label: string; value: number }[] {
    const row = this.industrialPartsForm.at(index);
    const partId = row.get('industrialPartId')?.value;

    if (!partId) return [];

    const part = this.industrialParts.find(
      (p) => p.industrialPartId === partId
    );

    if (!part?.industrialPartUnits) return [];

    return part.industrialPartUnits.map((u) => ({
      label: u.unitName,
      value: u.unitId,
    }));
  }

  onPartChange(index: number) {
    const row = this.industrialPartsForm.at(index);
    // reset unit when part changes
    row.get('unitId')?.setValue(null);
  }

  // --------------------------
  // Form Error Helpers
  // --------------------------
  FrontendError(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.invalid && c.touched);
  }

  getBackendError(field: string): string | null {
    // keys في الـ FormValidationState مخزنة lowercase
    return this.validationState.getBackendError(field);
  }

  hasBackendError(field: string): boolean {
    return this.validationState.hasBackendError(field);
  }

  hasFrontendError(field: string): boolean {
    return this.validationState.hasFrontendError(field);
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
    const dto: UpdateRepairCardRequest = {
      ticketId: this.ticketId,
      diagnosisText: v.diagnosisText,
      injuryDate: v.injuryDate,
      injuryReasons: v.injuryReasons,
      injurySides: v.injurySides,
      injuryTypes: v.injuryTypes,
      industrialParts: v.industrialParts,
      notes: v.notes ?? null,
    };

    this.submitForm.emit(dto);
  } else {
    const dto: CreateRepairCardRequest = {
      ticketId: this.ticketId,
      diagnosisText: v.diagnosisText,
      injuryDate: v.injuryDate,
      injuryReasons: v.injuryReasons,
      injurySides: v.injurySides,
      injuryTypes: v.injuryTypes,
      industrialParts: v.industrialParts,
      notes: v.notes ?? null,
    };

    this.submitForm.emit(dto);
  }
}

}
