import { CommonModule } from '@angular/common';
import { Component, inject, signal, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InjurySidesFacadeService } from '../../Services/injury-sides.facade.service';
import { InjuryDto } from '../../../../core/models/injuries/injury.dto';
import { InjuriesNavigationFacade } from '../../../../core/navigation/injuries-navigation.facade';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-injury-sides-add-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './injury-sides-add-edit.component.html',
  styleUrl: './injury-sides-add-edit.component.css',
})
export class InjurySidesAddEditComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private facade = inject(InjurySidesFacadeService);
  private nav = inject(InjuriesNavigationFacade);

  isEditMode = this.facade.isEditMode;
  selectedItem = this.facade.selectedInjurySide;
  canDelete = signal(false);
  canSubmit = signal(false);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  private listenToRoute() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        const numeric = Number(id);
        if (!Number.isNaN(numeric)) {
          this.facade.loadInjurySideForEdit(numeric);
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
      this.facade.updateInjurySide(item.id, { name }).subscribe((res) => {
        if (res.success) {
          this.form.disable();
          this.form.markAsPristine();
          this.canSubmit.set(false);
          this.canDelete.set(true);
        }
      });
    } else {
      this.facade.createInjurySide({ name }).subscribe((res) => {
        if (res.success && res.data) {
          this.nav.goToEditInjurySidePage(res.data.id);
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
    this.facade.deleteInjurySide(item);
  }
}
