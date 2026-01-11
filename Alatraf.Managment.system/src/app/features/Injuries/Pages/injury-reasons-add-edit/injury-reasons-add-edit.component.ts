import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InjuryReasonsFacadeService } from '../../Services/injury-reasons.facade.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-injury-reasons-add-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './injury-reasons-add-edit.component.html',
  styleUrl: './injury-reasons-add-edit.component.css',
})
export class InjuryReasonsAddEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private facade = inject(InjuryReasonsFacadeService);

  isEditMode = this.facade.isEditMode;
  selectedItem = this.facade.selectedInjuryReason;
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
          this.facade.loadInjuryReasonForEdit(numeric);
          return;
        }
      }
      // create mode
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
      this.facade.updateInjuryReason(item.id, { name }).subscribe((res) => {
        if (res.success) {
          this.form.disable();
          this.form.markAsPristine();
          this.canSubmit.set(false);
          this.canDelete.set(true);
        }
      });
    } else {
      this.facade.createInjuryReason({ name }).subscribe((res) => {
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
    this.facade.deleteInjuryReason(item);
  }
}
