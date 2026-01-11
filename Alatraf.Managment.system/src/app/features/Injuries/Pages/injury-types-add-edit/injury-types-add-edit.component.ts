import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InjuryTypesFacadeService } from '../../Services/injury-types.facade.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-injury-types-add-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './injury-types-add-edit.component.html',
  styleUrl: './injury-types-add-edit.component.css',
})
export class InjuryTypesAddEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private facade = inject(InjuryTypesFacadeService);

  isEditMode = this.facade.isEditMode;
  selectedItem = this.facade.selectedInjuryType;
  canDelete = signal(false);
  canSubmit = signal(false);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  formValidationErrors = this.facade.formValidationErrors;
  isLoading = this.facade.isLoading;
  private listenToRoute() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        const numeric = Number(id);
        if (!Number.isNaN(numeric)) {
          this.facade.loadInjuryTypeForEdit(numeric);
          return;
        }
      }
      this.facade.enterCreateMode();
    });
  }
  private readonly syncFormEffect = effect(() => {
    if (this.isEditMode()) {
      const item = this.selectedItem();
      if (!item) return;

      this.form.patchValue({ name: item.name });
      this.form.markAsPristine();
      this.form.enable();
      this.canDelete.set(true);
      this.canSubmit.set(false);
    } else {
      this.form.reset({ name: '' });
      this.form.markAsPristine();
      this.form.enable();
      this.canDelete.set(false);
      this.canSubmit.set(false);
    }
  });
 
  ngOnInit(): void {
    this.listenToRoute();

    this.form.valueChanges.subscribe(() => {
      this.canSubmit.set(this.form.valid && this.form.dirty);
    });
  }

  submit(): void {
    if (!this.canSubmit()) return;
    const name = this.form.controls.name.value.trim();

    if (this.isEditMode()) {
      const item = this.selectedItem();
      if (!item) return;
      this.facade.updateInjuryType(item.id, { name }).subscribe((res) => {
        if (res.success) {
          this.form.disable();
          this.form.markAsPristine();
          this.canSubmit.set(false);
          this.canDelete.set(true);
        }
      });
    } else {
      this.facade.createInjuryType({ name }).subscribe((res) => {
        if (res.success && res.data) {
          this.form.markAsPristine();
          this.canDelete.set(true);
          this.canSubmit.set(false);
        }
      });
    }
  }

  delete(): void {
    const item = this.selectedItem();
    if (!item) return;
    this.facade.deleteInjuryType(item);
  }
}
