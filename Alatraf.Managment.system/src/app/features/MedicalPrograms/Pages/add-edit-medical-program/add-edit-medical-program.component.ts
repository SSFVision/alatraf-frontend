import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';

import { SectionsFacade } from '../../../Organization/Sections/Service/sections.facade.service';
import { MedicalProgramsFacade } from '../../Services/medical-programs.facade.service';
import { Department } from '../../../Diagnosis/Shared/enums/department.enum';
import { CreateMedicalProgramRequest } from '../../Models/create-medical-program-request.model';
import { UpdateMedicalProgramRequest } from '../../Models/update-medical-program-request.model';

@Component({
  selector: 'app-add-edit-medical-program',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-edit-medical-program.component.html',
  styleUrl: './add-edit-medical-program.component.css',
})
export class AddEditMedicalProgramComponent {
  private fb = inject(FormBuilder);
  private facade = inject(MedicalProgramsFacade);
  private sectionsFacade = inject(SectionsFacade);

  // ---------------------------------------------
  // STATE
  // ---------------------------------------------
  isEditMode = this.facade.isEditMode;
  canDelete = signal(false);
  canSubmit = signal(false);

  // ---------------------------------------------
  // FORM
  // ---------------------------------------------
  form = this.fb.group({
    name: this.fb.nonNullable.control('', Validators.required),
    description: this.fb.control<string | null>(null),
    sectionId: this.fb.control<number | null>(null, Validators.required),
  });

  sections = this.sectionsFacade.sections;

  constructor() {
    // ---------------------------------------------
    // LOAD SECTIONS
    // ---------------------------------------------
    this.sectionsFacade.setDepartment(Department.Therapy);
    this.sectionsFacade.loadSections();

    // ---------------------------------------------
    // EDIT MODE → PATCH FORM
    // ---------------------------------------------
    effect(() => {
      const program = this.facade.selectedMedicalProgram();
      if (!program) return;

      this.form.patchValue({
        name: program.name,
        description: program.description ?? null,
        sectionId: program.sectionId ?? null,
      });

      this.form.markAsPristine();
      this.form.enable();
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
        description: null,
        sectionId: null,
      });

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
  // SEARCH SECTIONS
  // ---------------------------------------------
  onSearchSection(term: string) {
    this.sectionsFacade.search(term);
  }

  // ---------------------------------------------
  // SUBMIT
  // ---------------------------------------------
  submit() {
    if (!this.canSubmit()) return;

    const name = this.form.controls.name.value;
    const description = this.form.controls.description.value ?? null;
    const sectionId = this.form.controls.sectionId.value!;

    if (this.isEditMode()) {
      const id = this.facade.selectedMedicalProgram()?.id;
      if (!id) return;

      const updateDto: UpdateMedicalProgramRequest = {
        name,
        description,
        sectionId,
      };

      this.facade.updateMedicalProgram(id, updateDto).subscribe((res) => {
        if (res.success) {
          this.form.disable();
          this.form.markAsPristine();
          this.canSubmit.set(false);
          this.canDelete.set(true);
        }
      });
    } else {
      const createDto: CreateMedicalProgramRequest = {
        name,
        description,
        sectionId,
      };

      this.facade.createMedicalProgram(createDto).subscribe((res) => {
        if (res.success && res.data) {
          // 🔥 REQUIRED BUSINESS STEP
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
    const program = this.facade.selectedMedicalProgram();
    if (!program) return;

    this.facade.deleteMedicalProgram(program);
  }
}
