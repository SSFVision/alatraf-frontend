import {
  Component,
  EnvironmentInjector,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  OnDestroy,
  Output,
  SimpleChanges,
  effect,
  inject,
  runInInjectionContext,
  signal,
} from '@angular/core';

import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { Subscription } from 'rxjs';

import { CommonModule, NgIf } from '@angular/common';

import {
  MultiSelectComponent,
  MultiSelectOption,
} from '../../../../../shared/components/multi-select/multi-select.component';

import { CreateRepairCardRequest } from '../../Models/create-repair-card.request';

import { UpdateRepairCardRequest } from '../../Models/update-repair-card.request';

import { IndustrialPartDto } from '../../../../../core/models/industrial-parts/industrial-partdto';
import { InjuryDto } from '../../../../../core/models/injuries/injury.dto';
import { FormValidationState } from '../../../../../core/utils/form-validation-state';
import { RepairCardDiagnosisDto } from '../../Models/repair-card-diagnosis.dto';
import { RepairCardDiagnosisFacade } from '../../Services/repair-card-diagnosis.facade.service';
import { noFutureDatesValidator } from '../../../../../core/utils/validators/date-validators';

@Component({
  selector: 'app-add-industrial-diagnosis-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf, MultiSelectComponent],
  templateUrl: './add-industrial-diagnosis-form.component.html',
  styleUrl: './add-industrial-diagnosis-form.component.css',
})
export class AddIndustrialDiagnosisFormComponent
  implements OnChanges, OnInit, OnDestroy
{
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
    diagnosisText: ['', [Validators.required, Validators.maxLength(2000)]],
    injuryDate: ['', [Validators.required, noFutureDatesValidator]],
    injuryReasons: [[] as number[], Validators.required],
    injurySides: [[] as number[], Validators.required],
    injuryTypes: [[] as number[], Validators.required],

    notes: [''],

    industrialParts: this.fb.array<FormGroup>([], {
      validators: [
        this.noDuplicatePartsValidator.bind(this),
        this.atLeastOnePartValidator.bind(this),
      ],
    }),
  });

  // --------------------------
  // FormArray getter
  // --------------------------
  get industrialPartsForm(): FormArray<FormGroup> {
    return this.form.get('industrialParts') as FormArray<FormGroup>;
  }

  private createIndustrialPartRow(withValidators = true): FormGroup {
    return this.fb.group({
      industrialPartId: withValidators ? [null, Validators.required] : [null],
      unitId: withValidators ? [null, Validators.required] : [null],
      quantity: withValidators
        ? [1, [Validators.required, Validators.min(1)]]
        : [1],
    });
  }

  addPartRow() {
    this.industrialPartsForm.push(this.createIndustrialPartRow(true));
  }

  removePartRow(i: number) {
    this.industrialPartsForm.removeAt(i);
  }

  private validationState!: FormValidationState;

  private partsValueSub?: Subscription;
  submitting = signal(false);
  saved = signal(false);
  today = new Date().toISOString().slice(0, 10);

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
    // Default injury date to today in create mode
    if (!this.editMode) {
      // Start with a trailing empty row (no validators) so Save isn't blocked
      this.industrialPartsForm.clear();
      this.industrialPartsForm.push(this.createIndustrialPartRow(false));
    }

    // Watch parts array changes to auto-attach validators and append trailing row
    this.partsValueSub = this.industrialPartsForm.valueChanges.subscribe(() => {
      this.ensureTrailingRowValidators();
    });
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
      Notes: 'empety not loadded from the backend ',
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
      // add trailing empty row (no validators)
      this.industrialPartsForm.push(this.createIndustrialPartRow(false));
    }
  }

  private ensureTrailingRowValidators() {
    const len = this.industrialPartsForm.length;
    if (len === 0) return;

    const lastIndex = len - 1;
    const last = this.industrialPartsForm.at(lastIndex);
    if (!last) return;

    const partId = last.get('industrialPartId')?.value;
    const unitId = last.get('unitId')?.value;
    const quantityCtrl = last.get('quantity');
    const quantity = quantityCtrl?.value;
    const quantityTouched = !!quantityCtrl?.touched;

    const hasInput =
      (partId !== null && partId !== undefined && partId !== '') ||
      (unitId !== null && unitId !== undefined && unitId !== '') ||
      (quantityTouched && quantity !== null && quantity !== undefined && quantity !== '');

    if (hasInput) {
      this.applyPartRowValidators(last as FormGroup);
    } else {
      // empty trailing row stays optional
      last.get('industrialPartId')?.setValidators(null);
      last.get('unitId')?.setValidators(null);
      last.get('quantity')?.setValidators(null);

      last
        .get('industrialPartId')
        ?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      last
        .get('unitId')
        ?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      last
        .get('quantity')
        ?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }

    // When last row is complete (part + unit), append a new empty trailing row
    if (partId && unitId && lastIndex === this.industrialPartsForm.length - 1) {
      this.industrialPartsForm.push(this.createIndustrialPartRow(false));
    }
  }

  private atLeastOnePartValidator(control: AbstractControl): any {
    const fa = control as FormArray;
    const hasCompleted = fa.controls.some((c) => {
      const partId = c.get('industrialPartId')?.value;
      const unitId = c.get('unitId')?.value;
      return !!(partId && unitId);
    });

    return hasCompleted ? null : { atLeastOnePart: true };
  }

  ngOnDestroy(): void {
    this.partsValueSub?.unsubscribe();
  }

  startSubmitting() {
    this.submitting.set(true);
  }

  stopSubmitting() {
    this.submitting.set(false);
  }

  markSaved() {
    this.saved.set(true);
    this.submitting.set(false);
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
    // apply validators only to rows with any input so partial rows show errors
    this.industrialPartsForm.controls.forEach((row) => {
      const partId = row.get('industrialPartId')?.value;
      const unitId = row.get('unitId')?.value;
      const quantity = row.get('quantity')?.value;
      const hasInput =
        (partId !== null && partId !== undefined && partId !== '') ||
        (unitId !== null && unitId !== undefined && unitId !== '') ||
        (quantity !== null && quantity !== undefined && quantity !== '');

      if (hasInput) {
        this.applyPartRowValidators(row as FormGroup);
        row.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      }
    });

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;

    // filter out trailing empty rows (those without partId/unitId)
    const parts = (v.industrialParts ?? []).filter(
      (p: any) => p.industrialPartId && p.unitId
    );

    if (this.editMode) {
      const dto: UpdateRepairCardRequest = {
        ticketId: this.ticketId,
        diagnosisText: v.diagnosisText,
        injuryDate: v.injuryDate,
        injuryReasons: v.injuryReasons,
        injurySides: v.injurySides,
        injuryTypes: v.injuryTypes,
        industrialParts: parts,
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
        industrialParts: parts,
        notes: v.notes ?? null,
      };
      this.startSubmitting();
      this.submitForm.emit(dto);
    }
  }

  private applyPartRowValidators(row: FormGroup) {
    row.get('industrialPartId')?.setValidators(Validators.required);
    row.get('unitId')?.setValidators(Validators.required);
    row
      .get('quantity')
      ?.setValidators([Validators.required, Validators.min(1)]);

    row
      .get('industrialPartId')
      ?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    row
      .get('unitId')
      ?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    row
      .get('quantity')
      ?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }
 
}
