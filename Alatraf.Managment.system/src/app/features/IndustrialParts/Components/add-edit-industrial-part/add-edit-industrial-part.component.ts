import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CreateIndustrialPartRequest } from '../../models/create-industrial-part.request';
import { UpdateIndustrialPartRequest } from '../../models/update-industrial-part.request';
import { UnitsFacade } from '../../../Inventory/Units/Services/unit.facade.service';
import { IndustrialPartsFacade } from '../../Services/industrial-parts.facade.service';

@Component({
  selector: 'app-add-edit-industrial-part',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-edit-industrial-part.component.html',
  styleUrl: './add-edit-industrial-part.component.css',
})
export class AddEditIndustrialPartComponent {
  private fb = inject(FormBuilder);
  private facade = inject(IndustrialPartsFacade);
  private unitsFacade = inject(UnitsFacade);

  isEditMode = this.facade.isEditMode;
  selectedPart = this.facade.selectedIndustrialPart;

  canDelete = signal(false);
  canSubmit = signal(false);

  availableUnits = this.unitsFacade.units;

  form = this.fb.group({
    name: this.fb.nonNullable.control('', Validators.required),
    description: this.fb.control<string | null>(null),
    units: this.fb.array([]),
  });

  get units(): FormArray {
    return this.form.controls.units as FormArray;
  }

 constructor() {
  this.unitsFacade.loadUnits();

  // =========================
  // EDIT MODE
  // =========================
  effect(() => {
    const part = this.selectedPart();
    const units = this.availableUnits();

    if (!part || units.length === 0) return;

    this.form.patchValue({
      name: part.name,
      description: part.description ?? null,
    });

    this.units.clear();

    part.industrialPartUnits.forEach((u) => {
      this.units.push(
        this.fb.group({
          unitId: [u.unitId, Validators.required],
          price: [
            u.pricePerUnit,
            [Validators.required, Validators.min(0)],
          ],
        })
      );
    });

    this.form.markAsPristine();
    this.canDelete.set(true);
    this.canSubmit.set(false);
  });

  // =========================
  // CREATE MODE
  // =========================
  effect(() => {
    if (this.isEditMode()) return;

    this.form.reset({
      name: '',
      description: null,
    });

    this.units.clear();
    this.units.push(this.createUnitRow()); // ✅ هنا فقط

    this.form.markAsPristine();
    this.canDelete.set(false);
    this.canSubmit.set(false);
  });

  // =========================
  // ENABLE SUBMIT
  // =========================
  this.form.valueChanges.subscribe(() => {
    this.canSubmit.set(this.form.valid && this.form.dirty);
  });
}


  private createUnitRow() {
    return this.fb.group({
      unitId: [null, Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  addUnit() {
    this.units.push(this.createUnitRow());
  }

  removeUnit(index: number) {
    if (this.units.length > 1) {
      this.units.removeAt(index);
    }
  }

  // ---------------------------------------------
  // SUBMIT
  // ---------------------------------------------
  submit() {
    if (!this.canSubmit()) return;

    const dtoBase = {
      name: this.form.controls.name.value,
      description: this.form.controls.description.value ?? null,
      units: this.units.value,
    };

    if (this.isEditMode()) {
      const id = this.selectedPart()?.industrialPartId;
      if (!id) return;

      const updateDto: UpdateIndustrialPartRequest = dtoBase;

      this.facade.updateIndustrialPart(id, updateDto).subscribe((res) => {
        if (res.success) {
          this.form.markAsPristine();
          this.canSubmit.set(false);
        }
      });
    } else {
      const createDto: CreateIndustrialPartRequest = dtoBase;

      this.facade.createIndustrialPart(createDto).subscribe((res) => {
        if (res.success && res.data) {
          this.facade.enterEditMode(res.data);
          this.form.markAsPristine();
          this.canDelete.set(true);
          this.canSubmit.set(false);
        }
      });
    }
  }

  // ---------------------------------------------
  // DELETE
  // ---------------------------------------------
  delete() {
    const part = this.selectedPart();
    if (!part) return;

    this.facade.deleteIndustrialPart(part);
  }
}
