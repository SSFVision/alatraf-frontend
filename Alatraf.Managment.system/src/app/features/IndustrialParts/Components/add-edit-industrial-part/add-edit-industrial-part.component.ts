import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CreateIndustrialPartRequest } from '../../models/create-industrial-part.request';
import { UpdateIndustrialPartRequest } from '../../models/update-industrial-part.request';
import { IndustrialPartDto } from '../../../../core/models/industrial-parts/industrial-partdto';

type IndustrialPartFormMode = 'create' | 'edit';
type UnitOption = { id: number; name: string };

@Component({
  selector: 'app-add-edit-industrial-part',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-edit-industrial-part.component.html',
  styleUrl: './add-edit-industrial-part.component.css',
})
export class AddEditIndustrialPartComponent implements OnChanges {
  private fb = inject(FormBuilder);

  // ----------------------------------------------------
  // INPUTS
  // ----------------------------------------------------
  @Input({ required: true }) mode: IndustrialPartFormMode = 'create';
  @Input() part: IndustrialPartDto | null = null;
  @Input() units: UnitOption[] = [];
  @Input() saving = false;

  // ----------------------------------------------------
  // OUTPUTS
  // ----------------------------------------------------
  @Output() create = new EventEmitter<CreateIndustrialPartRequest>();
  @Output() update = new EventEmitter<{
    id: number;
    dto: UpdateIndustrialPartRequest;
  }>();
  @Output() delete = new EventEmitter<IndustrialPartDto>();

  // ----------------------------------------------------
  // FORM
  // ----------------------------------------------------
  form = this.fb.group({
    name: this.fb.nonNullable.control('', Validators.required),
    description: this.fb.control<string | null>(null),
    units: this.fb.array([]), // rows are validated inside
  });

  get unitsArray(): FormArray {
    return this.form.controls.units as FormArray;
  }

  // ----------------------------------------------------
  // INTERNAL GUARDS (to avoid rebuilding form on units load)
  // ----------------------------------------------------
  private lastMode: IndustrialPartFormMode | null = null;
  private lastPartId: number | null = null;

  // ----------------------------------------------------
  // DERIVED UI STATE
  // ----------------------------------------------------
  /** Create: enable when required fields are filled (valid) */
  get canCreate(): boolean {
    return this.mode === 'create' && this.form.valid && !this.saving;
  }

  /** Edit: enable only when user changed something (dirty) AND still valid */
  get canUpdate(): boolean {
    return this.mode === 'edit' && this.form.valid && this.form.dirty && !this.saving;
  }

  get showEditButtons(): boolean {
    return this.mode === 'edit';
  }

  get canDelete(): boolean {
    return this.mode === 'edit' && !!this.part && !this.saving;
  }

  compareUnitById = (a: number | null, b: number | null): boolean => a === b;

  // ----------------------------------------------------
  // INPUT CHANGES
  // ----------------------------------------------------
  ngOnChanges(changes: SimpleChanges): void {
    // ✅ Only rebuild when it makes sense:
    // - mode changed
    // - OR editing a different part id
    const currentPartId = this.part?.industrialPartId ?? null;
    const modeChanged = this.lastMode !== this.mode;
    const partChanged = this.mode === 'edit' && currentPartId !== this.lastPartId;

    if (this.mode === 'edit') {
      // Wait until we actually have part + units options
      if (!this.part) return;
      if (!this.units || this.units.length === 0) return;

      if (modeChanged || partChanged) {
        this.enterEditForm(this.part);
      }
    } else {
      // create mode
      if (modeChanged) {
        this.enterCreateForm();
      }
      // IMPORTANT: do NOT rebuild form when units list arrives while creating
      // because user may have started typing already.
    }

    this.lastMode = this.mode;
    this.lastPartId = currentPartId;
  }

  // ----------------------------------------------------
  // FORM MODES
  // ----------------------------------------------------
  private enterEditForm(part: IndustrialPartDto): void {
    this.form.controls.name.setValue(part.name);
    this.form.controls.description.setValue(part.description ?? null);

    this.rebuildUnitsForm(part.industrialPartUnits ?? []);

    // Mark pristine so Update is disabled until user changes something
    this.form.markAsPristine();
  }

  private enterCreateForm(): void {
    this.form.reset();

    this.unitsArray.clear();
    this.unitsArray.push(this.createUnitRow());

    // In create, pristine is fine; button uses valid only
    this.form.markAsPristine();
  }

  private rebuildUnitsForm(units: any[]): void {
    this.unitsArray.clear();

    if (!units || units.length === 0) {
      this.unitsArray.push(this.createUnitRow());
      return;
    }

    units.forEach((u) => {
      this.unitsArray.push(
        this.fb.group({
          unitId: [u.unitId ?? null, Validators.required],
          price: [
            u.pricePerUnit ?? null,
            [Validators.required, Validators.min(0)],
          ],
        })
      );
    });
  }

  private createUnitRow() {
    return this.fb.group({
      unitId: [null, Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
    });
  }

  // ----------------------------------------------------
  // UI ACTIONS
  // ----------------------------------------------------
  addUnit(): void {
    this.unitsArray.push(this.createUnitRow());
    // Adding a row is a user action -> should enable Update in edit
    this.form.markAsDirty();
  }

  removeUnit(index: number): void {
    if (this.unitsArray.length > 1) {
      this.unitsArray.removeAt(index);
      this.form.markAsDirty();
    }
  }

  // ----------------------------------------------------
  // SUBMIT / DELETE
  // ----------------------------------------------------
  submitCreate(): void {
    if (!this.canCreate) return;

    const dto: CreateIndustrialPartRequest = {
      name: this.form.controls.name.value,
      description: this.form.controls.description.value ?? null,
      units: this.unitsArray.value,
    };

    this.create.emit(dto);
  }

  submitUpdate(): void {
    if (!this.canUpdate) return;
    if (!this.part) return;

    const dto: UpdateIndustrialPartRequest = {
      name: this.form.controls.name.value,
      description: this.form.controls.description.value ?? null,
      units: this.unitsArray.value,
    };

    this.update.emit({ id: this.part.industrialPartId, dto });
  }

  onDelete(): void {
    if (!this.canDelete) return;
    this.delete.emit(this.part!);
  }
}
