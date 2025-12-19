import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { SectionsFacade } from '../../Service/sections.facade.service';

import { CreateSectionRequest } from '../../Models/create-section.request';
import { UpdateSectionRequest } from '../../Models/update-section.request';
import { DepartmentsFacade } from '../../../Departments/departments.facade.service';
import { SectionsNavigationFacade } from '../../../../../core/navigation/sections-navigation.facade';

@Component({
  selector: 'app-add-edit-section-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-edit-section-page.component.html',
  styleUrl: './add-edit-section-page.component.css',
})
export class AddEditSectionPageComponent {
  private fb = inject(FormBuilder);
  private facade = inject(SectionsFacade);
  private departmentsFacade = inject(DepartmentsFacade);
private nav = inject(SectionsNavigationFacade);

  // ---------------------------------------------
  // STATE (SAME AS MEDICAL PROGRAM)
  // ---------------------------------------------
  isEditMode = this.facade.isEditMode;
  canDelete = signal(false);
  canSubmit = signal(false);

  // ---------------------------------------------
  // FORM
  // ---------------------------------------------
  form = this.fb.group({
    name: this.fb.nonNullable.control('', Validators.required),
    departmentId: this.fb.nonNullable.control<number | null>(
      null,
      Validators.required
    ),
  });

  departments = this.departmentsFacade.departments;

  constructor() {
    // ---------------------------------------------
    // LOAD DEPARTMENTS (no pagination / no search)
    // ---------------------------------------------
    this.departmentsFacade.loadDepartments();

    // ---------------------------------------------
    // EDIT MODE → PATCH FORM
    // ---------------------------------------------
    effect(() => {
      const section = this.facade.selectedSection();
      if (!section) return;

      this.form.patchValue({
        name: section.name,
        departmentId: section.departmentId,
      });

      this.form.markAsPristine();
      this.form.enable();
            this.form.controls.departmentId.disable({ emitEvent: false });

      this.canDelete.set(true);
      this.canSubmit.set(false);
    });

    // ---------------------------------------------
    // CREATE MODE → RESET FORM
    // ---------------------------------------------
    effect(() => {
      if (this.isEditMode()) return;

      this.form.reset({
        name: '',
        departmentId: null,
      });
      this.form.controls.departmentId.enable({ emitEvent: false });

      this.form.markAsPristine();
      this.form.enable();
      this.canDelete.set(false);
      this.canSubmit.set(false);
    });

    // ---------------------------------------------
    // ENABLE SUBMIT ONLY WHEN USER CHANGES SOMETHING
    // ---------------------------------------------
    this.form.valueChanges.subscribe(() => {
      this.canSubmit.set(this.form.valid && this.form.dirty);
    });
  }

  // ---------------------------------------------
  // SUBMIT
  // ---------------------------------------------
  submit() {
    if (!this.canSubmit()) return;

    const name = this.form.controls.name.value;
    const departmentId = this.form.controls.departmentId.value!;

    if (this.isEditMode()) {
      const section = this.facade.selectedSection();
      if (!section) return;

      const updateDto: UpdateSectionRequest = {
        name,
        // departmentId
      };

      this.facade.updateSection(section.id, updateDto).subscribe((res) => {
        if (res.success) {
          this.form.disable();
          this.form.markAsPristine();
          this.canSubmit.set(false);
          this.canDelete.set(true);
        }
      });
    } else {
      const createDto: CreateSectionRequest = {
        name,
        departmentId,
      };

      this.facade.createSection(createDto).subscribe((res) => {
        if (res.success && res.data) {
    this.nav.goToEditSectionPage(res.data.id);
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
    const section = this.facade.selectedSection();
    if (!section) return;

    this.facade.deleteSection(section);
  }
}
