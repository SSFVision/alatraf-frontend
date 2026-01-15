import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  EnvironmentInjector,
  inject,
  OnChanges,
  OnInit,
  runInInjectionContext,
  signal,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UnitsNavigationFacade } from '../../../../../core/navigation/units-navigation.facade';
import { CreateUnitRequest } from '../../Models/create-unit.request';
import { UpdateUnitRequest } from '../../Models/update-unit.request';
import { UnitsFacade } from '../../Services/unit.facade.service';

@Component({
  selector: 'app-add-edit-units',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-edit-units.component.html',
  styleUrl: './add-edit-units.component.css',
})
export class AddEditUnitsComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  private unitsFacade = inject(UnitsFacade);
  private nav = inject(UnitsNavigationFacade);
  private route = inject(ActivatedRoute);
  private env = inject(EnvironmentInjector);

  selectedUnit = this.unitsFacade.selectedUnit;
  isEditMode = this.unitsFacade.isEditMode;

  canDelete = signal(false);
  canSubmit = signal(false);

  form = this.fb.group({
    name: this.fb.nonNullable.control('', Validators.required),
  });

  private lisonToRouteChanges() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('unitId');

      if (id) {
        this.unitsFacade.loadUnitForEdit(+id);
      } else {
        this.unitsFacade.enterCreateMode();
      }

      this.form.markAsPristine();
      this.canSubmit.set(false);
    });
  }

  ngOnInit(): void {
    this.lisonToRouteChanges();
    runInInjectionContext(this.env, () => {
      effect(() => {
        const unit = this.selectedUnit();
        if (!unit) return;

        this.form.patchValue({ name: unit.name }, { emitEvent: false });
        this.form.markAsPristine();
        this.form.enable();
        this.canDelete.set(true);
        this.canSubmit.set(false);
      });

      effect(() => {
        if (this.isEditMode()) return;

        this.form.reset({ name: '' });
        this.form.enable();
        this.canDelete.set(false);
        this.canSubmit.set(false);
      });

      this.form.valueChanges.subscribe(() => {
        this.canSubmit.set(this.form.valid && this.form.dirty);
      });
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

  submit(): void {
    if (!this.canSubmit()) return;

    const name = this.form.controls.name.value;

    if (this.isEditMode()) {
      const unit = this.selectedUnit();
      if (!unit) return;

      const updateDto: UpdateUnitRequest = { name };

      this.unitsFacade.updateUnit(unit.id, updateDto).subscribe((res) => {
        if (res.success) {
          this.form.disable();
          this.form.markAsPristine();
          this.canSubmit.set(false);
          this.canDelete.set(true);
        }
      });
    } else {
      const createDto: CreateUnitRequest = { name };

      this.unitsFacade.createUnit(createDto).subscribe((res) => {
        if (res.success && res.data) {
          // this.nav.goToEditUnitsPage(res.data.id);
          this.isEditMode.set(true);
        
          this.form.markAsPristine();
          this.canDelete.set(true);
          this.canSubmit.set(false);
        }
      });
    }
  }

  delete(): void {
    const unit = this.selectedUnit();
    if (!unit) return;

    this.unitsFacade.deleteUnit(unit);
  }
}
