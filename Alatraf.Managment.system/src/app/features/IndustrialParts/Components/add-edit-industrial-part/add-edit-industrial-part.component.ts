import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  signal,
  effect,
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

// If you have a Unit DTO type, import it. Otherwise keep it minimal.
type UnitOption = { id: number; name: string };

@Component({
  selector: 'app-add-edit-industrial-part',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-edit-industrial-part.component.html',
  styleUrl: './add-edit-industrial-part.component.css',
})
export class AddEditIndustrialPartComponent implements OnChanges {
  private fb = new FormBuilder();

  @Input({ required: true }) mode: IndustrialPartFormMode = 'create';
  @Input() part: IndustrialPartDto | null = null;
  @Input() units: UnitOption[] = [];

  // -----------------------------
  @Output() create = new EventEmitter<CreateIndustrialPartRequest>();
  @Output() update = new EventEmitter<{
    id: number;
    dto: UpdateIndustrialPartRequest;
  }>();
  @Output() delete = new EventEmitter<IndustrialPartDto>();

  canDelete = signal(false);
  canSubmit = signal(false);

  form = this.fb.group({
    name: this.fb.nonNullable.control('', Validators.required),
    description: this.fb.control<string | null>(null),
    units: this.fb.array([]),
  });

  get unitsArray(): FormArray {
    return this.form.controls.units as FormArray;
  }

  compareUnitById = (a: number | null, b: number | null): boolean => a === b;

  constructor() {
    effect(() => {
      this.form.valueChanges.subscribe(() => {
        this.canSubmit.set(this.form.valid && this.form.dirty);
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.mode === 'edit') {
      if (!this.part) return;
      if (!this.units || this.units.length === 0) return;

      this.enterEditForm(this.part);
      return;
    }
    this.enterCreateForm();
  }

  // -----------------------------
  // UI ACTIONS
  // -----------------------------
  addUnit(): void {
    this.unitsArray.push(this.createUnitRow());
  }

  removeUnit(index: number): void {
    if (this.unitsArray.length > 1) {
      this.unitsArray.removeAt(index);
    }
  }

  // -----------------------------
  // SUBMIT
  // -----------------------------
  submit(): void {
    const dtoBase = {
      name: this.form.controls.name.value,
      description: this.form.controls.description.value ?? null,
      units: this.unitsArray.value,
    };
    console.log('Form Data:', dtoBase);
    if (this.mode === 'edit') {
      const id = this.part?.industrialPartId;
      if (!id) return;

      const dto: UpdateIndustrialPartRequest = dtoBase;
      this.update.emit({ id, dto });
      return;
    }

    const dto: CreateIndustrialPartRequest = dtoBase;
    this.create.emit(dto);
    this.canSubmit.set(false);
  }

  onDelete(): void {
    if (!this.part) return;
    this.delete.emit(this.part);
  }

  // -----------------------------
  // FORM MODES
  // -----------------------------
  private enterEditForm(part: IndustrialPartDto): void {
    // No form.reset with dynamic FormArray
    this.form.controls.name.setValue(part.name);
    this.form.controls.description.setValue(part.description ?? null);

    this.rebuildUnitsForm(part.industrialPartUnits ?? []);

    this.form.markAsPristine();
    this.canDelete.set(true);
    this.canSubmit.set(false);
  }

  private enterCreateForm(): void {
    this.form.controls.name.setValue('');
    this.form.controls.description.setValue(null);

    this.unitsArray.clear();
    this.unitsArray.push(this.createUnitRow());

    this.form.markAsPristine();
    this.canDelete.set(false);
    this.canSubmit.set(false);
  }

  private rebuildUnitsForm(units: any[]): void {
    this.unitsArray.clear();

    // If backend can send empty list, keep at least one row
    if (!units || units.length === 0) {
      this.unitsArray.push(this.createUnitRow());
      return;
    }

    units.forEach((u) => {
      this.unitsArray.push(
        this.fb.group({
          unitId: [u.unitId ?? null, Validators.required],
          price: [
            u.pricePerUnit ?? 0,
            [Validators.required, Validators.min(0)],
          ],
        })
      );
    });
  }

  private createUnitRow() {
    return this.fb.group({
      unitId: [null, Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }
}
